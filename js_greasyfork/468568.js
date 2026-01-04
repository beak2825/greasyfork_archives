// ==UserScript==
// @name      Response Generator
// @author    Elliot Kwan
// @version   1.0.29
// @include   /.*\/survey_logic_file\/.*/
// @include   /.*\/quotas\/.*/
// @include   /.*\/view/surveyid\/[0-9]{6}/
// @include   /.*\/index.php/admin/dataentry/sa/vvimport/surveyid\/[0-9]{6}/
// @grant     unsafeWindow
// @locale    en
// @description Generates response files for uploading to LimeSurvey
// @namespace https://greasyfork.org/users/560069
// @downloadURL https://update.greasyfork.org/scripts/468568/Response%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/468568/Response%20Generator.meta.js
// ==/UserScript==

function exec (fn) {
  let script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}

function initiate () {
  const STAGE_STORE = 'RG_stage';
  const TERMINATE = 'RG_terms';
  const NUM_RESPONSE = 'RG_num_response';
  const NUM_START = 'RG_start_id';
  const FORCE = 'RG_force';
  const AVOID = 'RG_avoid';
  const RAW_FORCE = 'RG_force_raw';
  const RAW_AVOID = 'RG_avoid_raw';
  const AUTO_UPLOAD = 'RG_auto_upload';
  const DATA_STORE = 'RG_data';
  const HIDDEN = 'RG_hidden';

  const SUBQ_TYPES = 'FMQHK';
  const EMPTY_ANS = '{question_not_shown}';

  const SURVEY_ID = window.location.href.match(/[0-9]{6}/)[0];
  const QUOTA_URL = window.location.origin + '/index.php/admin/quotas/sa/index/surveyid/' + SURVEY_ID;
  const LOGIC_URL = window.location.origin + '/index.php/admin/expressions/sa/survey_logic_file/sid/' + SURVEY_ID;
  const UPLOAD_URL = window.location.origin + '/index.php/admin/dataentry/sa/vvimport/surveyid/' + SURVEY_ID;

  const STAGE = {
    GET_TERMS: 1,
    GENERATE_DATA: 2,
    UPLOAD_DATA: 3,
  };

  const ResponseGenerator = {
    commands: {
      force: null,
      avoid: null,
    },
    initialize: function () {
      if (this.overlay) {
        this.overlay.remove();
      }
      const stage = Number(sessionStorage.getItem(STAGE_STORE));
      this.initStorage();

      switch (stage) { // Program started
        case STAGE.GET_TERMS: // record terminate conditions
          this.initOverlay();
          this.queryTerminates();

          this.navigateTo(LOGIC_URL);
          break;
        case STAGE.GENERATE_DATA: // set logic and generate responses
          this.initOverlay();
          this.constructSurveyStructure();
          const fileData = new Promise(resolve => {
            this.generateFileData(resolve);
          });

          fileData.then(data => {
            if (this.autoUpload) {
              this.setStage(STAGE.UPLOAD_DATA);
              sessionStorage.setItem(DATA_STORE, data);
              this.navigateTo(UPLOAD_URL);
            } else {
              this.removeOverlay();
              this.downloadData(data);
              this.initContinueUI();
            }
          }).catch(e => {
            console.log(e);
          });
          break;
        case STAGE.UPLOAD_DATA: // upload data to LS
          let vvFile = sessionStorage.getItem(DATA_STORE);
          sessionStorage.removeItem(STAGE_STORE);
          sessionStorage.removeItem(DATA_STORE);
          this.uploadData(vvFile);
          break;
        default:
          this.initUI();
      }

      let logData = function () {
        console.log('Survey: ', this.survey);
        console.log('Commands: ', this.commands);
        console.log('Terminates: ', this.terminates);
      }.bind(this);
      logData();
    },
    downloadData: function (data) {
      const downloadBtn = document.createElement('a');
      downloadBtn.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
      downloadBtn.setAttribute('download', 'test.tab');

      downloadBtn.style.display = 'none';
      document.body.appendChild(downloadBtn);

      downloadBtn.click();

      downloadBtn.remove();
    },
    constructSurveyStructure: function () {
      this.updateStatus('Generating survey structure');

      let terminates = JSON.parse(sessionStorage.getItem(TERMINATE));
      let getLSTableRowValue = function (row, label) {
        return [...row.children[3].querySelectorAll('td:first-child')].filter(td => {
          return td.innerText.includes(label);
        })[0]?.nextElementSibling.innerText ?? undefined;
      };

      let groupRelevance = '1';
      let survey = new Map();
      let subqReference = new Map();
      let surveyTable = document.querySelector('table#logicfiletable');

      [...surveyTable.querySelectorAll('.LEMgroup, .LEMquestion')].forEach((qRow) => {
        if (qRow.children.length > 3) {
          if (qRow.classList.contains('LEMgroup')) {
            groupRelevance = qRow.children[2].querySelector('span.em-expression').innerText;
          } else {
            let questionCode = qRow.children[1].querySelector('b').innerText.replace('*','');
            let params = {};

            params.type = qRow.children[1].innerText.split('[').pop().split(']').shift();
            params.relevance = qRow.children[2].querySelector('span')?.innerText ?? '1';
            params.groupRelevance = groupRelevance;
            params.hidden = getLSTableRowValue(qRow, 'hidden') ? true : false;
            params.hidden = getLSTableRowValue(qRow, 'test_variable') ? false : params.hidden;
            params.questionText = qRow.children[3].innerHTML.split('<hr>').shift().split('<table').shift();

            let qContent, ansCode, groupId, ansRelevance, subqc, subqRelevance;

            switch (params.type) {
              case 'L': // Radio
              case '!': // Dropdown
                qContent = qRow.nextElementSibling;
                params.responseValues = [];
                params.hasOther = false;
                params.responseRelevance = {};
                params.groupIDs = new Map();

                while (qContent?.classList.contains('LEMsubq') || qContent?.classList.contains('LEManswer')) {
                  [ansCode, groupId] = qContent.children[1].innerText.split(' (');
                  ansCode = ansCode.trim();
                  groupId = groupId?.replace(')','').trim();
                  ansRelevance = qContent.children[2].innerText.split('[').shift();
                  if (qContent.classList.contains('LEMsubq')) {
                    params.responseValues.push('-oth-');
                    params.hasOther = true;
                    params.otherCode = getLSTableRowValue(qRow, 'other_setting_export');
                    subqReference.set(questionCode + '_other', questionCode);
                  } else {
                    if (groupId) {
                      params.responseValues.push(ansCode);
                      params.groupIDs.set(ansCode, groupId);
                    } else {
                      params.responseValues.push(ansCode);
                      params.groupIDs.set(ansCode, '');
                    }
                    if (ansRelevance) {
                      params.responseRelevance[ansCode] = ansRelevance;
                    }
                  }
                  qContent = qContent.nextElementSibling;
                }
                break;
              case 'U': // Huge Free Text (probably heatmap)
                params.isHeatmap = getLSTableRowValue(qRow, 'heatmap_text_enable') ? true : false;
                if (params.isHeatmap) {
                  let heatmapText = qRow.children[3].querySelector('pre').innerText.split(' ');
                  params.responseValues = '1';
                  for (let i = 1; i < heatmapText.length; i++) {
                    params.responseValues += '0';
                  }
                }
                break;
              case 'F': // Array
              case 'H': // Array by column
                qContent = qRow.nextElementSibling;
                params.responseValues = [];
                params.subqRelevance = {};
                while (qContent?.classList.contains('LEMsubq')) {
                  subqc = qContent.children[1].innerText.trim();
                  subqRelevance = qContent.children[2].querySelector('span')?.innerText ?? '1';
                  params.subqRelevance[subqc] = subqRelevance;
                  qContent = qContent.nextElementSibling;
                  subqReference.set(subqc, questionCode);
                }
                while (qContent?.classList.contains('LEManswer')) {
                  params.responseValues.push(qContent.children[1].innerText.trim());
                  qContent = qContent.nextElementSibling;
                }
                break;
              case 'M': // MC
                qContent = qRow.nextElementSibling;
                params.subqRelevance = {};
                params.exclusive = getLSTableRowValue(qRow, 'exclude_all_others')?.split(';') || [];
                params.maxAnswers = getLSTableRowValue(qRow, 'max_answers');
                while (qContent?.classList.contains('LEMsubq')) {
                  subqc = qContent.children[1].innerText.trim();
                  subqRelevance = qContent.children[2].querySelector('span')?.innerText ?? '1';
                  params.subqRelevance[subqc] = subqRelevance;
                  qContent = qContent.nextElementSibling;
                  subqReference.set(subqc, questionCode);
                }
                if (this.commands.avoid?.[questionCode]) {
                  this.commands.avoid[questionCode].forEach(toAvoid => {
                    params.subqRelevance[questionCode + '_' + toAvoid] = '0';
                  });
                }
                break;
              case '*': // Equation
                params.equations = [...qRow.children[3].querySelectorAll('span.em-expression')]
                  .map(eq => eq.innerText)
                  .filter(eq => !eq.includes('TOKEN:ATTRIBUTE_'));
                params.hidden = false;
                break;
              case 'Q': // Multiple Short Text
              case 'K': // Multiple Numerical Input
                qContent = qRow.nextElementSibling;
                params.subqRelevance = {};
                while (qContent?.classList.contains('LEMsubq')) {
                  subqc = qContent.children[1].innerText.trim();
                  subqRelevance = qContent.children[2].querySelector('span')?.innerText ?? '1';
                  params.subqRelevance[subqc] = subqRelevance;
                  qContent = qContent.nextElementSibling;
                  subqReference.set(subqc, questionCode);
                }
                break;
              case 'N': // Numerical Input
              case 'S': // SFT
              case 'T': // Long Free Text
              case 'I': // Language Switch
              default:
                // Do nothing
            }
            if (this.commands.avoid?.[questionCode]) {
              this.commands.avoid[questionCode].forEach(toAvoid => {
                params.responseValues?.splice(params.responseValues.indexOf(toAvoid), 1);
              });
            }

            survey.set(questionCode, params);
          }
        }
      });

      this.terminates = terminates;
      this.survey = survey;
      this.subquestionReference = subqReference;
    },
    generateFileData: function (resolve) {

      this.updateStatus('Generating responses');

      let headers = 'Response ID\ttoken\tDate submitted\tLast page\tStart language\tDate started\tDate last action\n';
      headers += 'id\ttoken\tsubmitdate\tlastpage\tstartlanguage\tstartdate\tdatestamp';

      let surveyTable = document.querySelector('table#logicfiletable');
      let columnHeaders = [];

      [...surveyTable.querySelectorAll('.LEMquestion,.LEMsubq')].forEach((qRow) => {
        if (qRow.children.length > 3) {
          let questionCode = qRow.children[1].querySelector('b').innerText.replace('*','');
          let type = qRow.children[1].innerText.split('[').pop().split(']').shift();
          if (!SUBQ_TYPES.includes(type)) {
            columnHeaders.push(questionCode);
            headers += '\t' + questionCode;
          }
        }
      });

      headers += '\n';

      let bgWorkerURL = URL.createObjectURL(new Blob([`(${backgroundWorker.toString()})()`], {
        type: 'text/javascript',
      }));

      let functionImport = URL.createObjectURL(new Blob([
        LEMif.toString(),
        LEMempty.toString(),
        LEMstrlen.toString(),
        LEMjoin.toString(),
        LEMsum.toString(),
        LEMsumifop.toString(),
        LEMcount.toString(),
        LEMcountif.toString(),
        LEMcountifop.toString(),
        LEMstr_replace.toString(),
        LEMstrtoupper.toString(),
        LEMstrtolower.toString(),
        LEMstrpos.toString(),
        LEMunique.toString(),
        LEMregexMatch.toString(),
        rand.toString(),
      ], {
        type: 'text/javascript',
      }));

      let responseWorker = new Worker(bgWorkerURL);
      responseWorker.postMessage({
        survey: this.survey,
        startID: this.startID,
        subqRef: this.subquestionReference,
        numResponses: this.numResponses,
        commands: this.commands,
        terminates: this.terminates,
        columnHeaders: columnHeaders,
        functionImport: functionImport,
      });

      responseWorker.onmessage = function (e) {
        if (e.data.done) {
          let respData = '';
          let rows = e.data.rows;

          for (let x = 0; x < rows.length; x++) {
            for (const value of rows[x].values()) {
              if (value === '') {
                respData += EMPTY_ANS + '\t';
              } else {
                respData += value + '\t';
              }
            }
            respData += '\n';
          }

          let data = headers + respData;

          responseWorker.terminate();
          resolve(data);
        } else {
          this.updateStatus(`Generating responses (${e.data.numGenerated}/${this.numResponses})` + (e.data.numTerminated ? `<br />Terminates: ${e.data.numTerminated}` : ''));
        }
      }.bind(this);
    },
    initContinueUI: function () {
      this.initUI();
      this.txtAvoid.disabled = true;
      this.txtAvoid.style.color = 'lightgray';
      this.txtAvoid.parentElement.style.color = 'lightgray';
      this.txtAvoid.style.cursor = 'not-allowed';
      this.txtAvoid.parentElement.style.cursor = 'not-allowed';
      this.btnMain.innerHTML = 'Generate more responses';
      this.btnMain.onclick = function () {
        this.setInputData();
        this.initStorage();
        this.initOverlay();
        const fileData = new Promise(resolve => {
          this.generateFileData(resolve);
        });

        fileData.then(data => {
          if (this.autoUpload) {
            this.setStage(STAGE.UPLOAD_DATA);
            sessionStorage.setItem(DATA_STORE, data);
            this.navigateTo(UPLOAD_URL);
          } else {
            this.removeOverlay();
            sessionStorage.removeItem(STAGE_STORE);
            this.downloadData(data);
          }
        }).catch(e => {
          console.log(e);
        });
      }.bind(this);
    },
    initOverlay: function () {
      let overlay = document.createElement('div');
      let textContainer = document.createElement('div');
      let textStatus = document.createElement('span');
      let ellipsis = document.createElement('span');
      let statusContainer = document.createElement('div');

      overlay.style.position = 'fixed';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.backgroundColor = 'rgba(55,55,55,0.6)';
      overlay.style.textAlign = 'center';
      overlay.style.transitionDuration = '0.7s';
      overlay.style['z-index'] = 9999;

      statusContainer.style.margin = '0 auto';
      statusContainer.style.position = 'absolute';
      statusContainer.style.bottom = '-50%';
      statusContainer.style.left = 0;
      statusContainer.style.right = 0;
      statusContainer.style.width = 'fit-content';
      statusContainer.style.transitionDuration = '0.2s';
      statusContainer.style.overflowY = 'clip';
      statusContainer.style.pointerEvents = 'none';

      textContainer.style.padding = '.1em .3em';
      textContainer.style.textAlign = 'center';
      textContainer.style.fontSize = '3em';
      textContainer.style.color = 'white';
      textContainer.style.backgroundColor = 'rgba(170, 0, 0, 0.8)';
      textContainer.style.boxShadow = '0 0 0.7em 1em rgba(170, 0, 0, 0.8)';

      textStatus.innerHTML = 'Loading';
      ellipsis.innerHTML = '';
      ellipsis.style.position = 'absolute';

      const updateEllipsis = () => {
        switch (ellipsis.innerHTML.length) {
          case 1:
            ellipsis.innerHTML = '..';
            break;
          case 2:
            ellipsis.innerHTML = '...';
            break;
          case 3:
            ellipsis.innerHTML = '';
            break;
          default:
            ellipsis.innerHTML = '.';
        };
        setTimeout(updateEllipsis, 500);
      };
      updateEllipsis();

      textContainer.append(textStatus, ellipsis);
      statusContainer.append(textContainer);
      overlay.append(statusContainer);

      setTimeout(() => {
        statusContainer.style.bottom = '10%';
      }, 500);

      this.overlay = overlay;
      this.textStatus = textStatus;
      document.body.append(overlay);
    },
    initStorage: function () {
      let force = localStorage.getItem(FORCE);
      let avoid = localStorage.getItem(AVOID);
      let numResponses = Number(localStorage.getItem(NUM_RESPONSE));
      let startID = sessionStorage.getItem(NUM_START);
      let autoUpload = Number(localStorage.getItem(AUTO_UPLOAD)) ? true : false;
      let hidden = Number(localStorage.getItem(HIDDEN)) ? true : false;

      this.commands.force = this.parseCommand(force);
      this.commands.avoid = this.parseCommand(avoid);

      if (numResponses) {
        this.numResponses = Number(numResponses);
      }
      if (startID) {
        this.startID = Number(startID);
      }
      this.autoUpload = autoUpload;
      this.hidden = hidden;
    },
    initUI: function () {
      this.uiContainer = document.createElement('div');
      this.txtForce = document.createElement('textarea');
      this.txtAvoid = document.createElement('textarea');
      this.numNumResponse = document.createElement('input');
      this.numStartingID = document.createElement('input');
      this.chkUpload = document.createElement('input');
      this.btnMain = document.createElement('button');
      this.btnHide = document.createElement('button');

      const lblForce = document.createElement('label');
      const lblAvoid = document.createElement('label');
      const lblNumResponse = document.createElement('label');
      const lblStartingID = document.createElement('label');
      const lblUpload = document.createElement('label');

      this.btnHide.style.backgroundColor = 'rgb(222, 0, 0)';
      this.btnHide.style.color = 'white';
      this.btnHide.style.border = 'none';
      this.btnHide.style.position = 'absolute';
      this.btnHide.style.height = '40%';
      this.btnHide.style.top = '30%';
      this.btnHide.style.width = '3em';
      this.btnHide.style.right = '100%';
      this.btnHide.style.borderRadius = '10em 0 0 10em';
      this.btnHide.classList.add('glyphicon');
      if (this.hidden) {
        this.btnHide.classList.add('glyphicon-chevron-left');
      } else {
        this.btnHide.classList.add('glyphicon-chevron-right');
      }

      this.btnHide.onclick = this.toggleHide.bind(this);
      // Rounded background rectangle
      this.uiContainer.style.position = 'fixed';
      this.uiContainer.style.padding = '0.5em';
      this.uiContainer.style.left = this.hidden ? '100%' : 'auto';
      this.uiContainer.style.right = this.hidden ? 'auto' : '2em';
      this.uiContainer.style.top = '35%';
      this.uiContainer.style.transitionDuration = '0.5s';
      this.uiContainer.style.zIndex = 2001;
      this.uiContainer.style.backgroundColor = 'rgb(222,222,222,0.85)';
      this.uiContainer.style.borderRadius = '10px';
      this.uiContainer.style.display = 'flex';
      this.uiContainer.style.flexDirection = 'column';

      // Force Label
      lblForce.innerHTML = 'Force:';
      lblForce.style.backgroundColor = 'rgba(255,255,255,0.7)';
      lblForce.style.borderRadius = '5px';
      lblForce.style.padding = '0.3em 1em';
      lblForce.style.cursor = 'pointer';
      lblForce.style.display = 'flex';
      lblForce.style.justifyContent = 'space-between';
      lblForce.style.alignItems = 'center';
      lblForce.appendChild(this.txtForce);

      // Force input
      this.txtForce.rows = 1;
      this.txtForce.cols = 20;
      this.txtForce.placeholder = 'e.g. Q1,1|Q2,1...';
      this.txtForce.style.float = 'right';
      this.txtForce.style.marginLeft = '1em';
      this.txtForce.value = localStorage.getItem(RAW_FORCE) || '';

      // Avoid Label
      lblAvoid.innerHTML = 'Avoid:';
      lblAvoid.style.backgroundColor = 'rgba(255,255,255,0.7)';
      lblAvoid.style.borderRadius = '5px';
      lblAvoid.style.padding = '0.3em 1em';
      lblAvoid.style.cursor = 'pointer';
      lblAvoid.style.display = 'flex';
      lblAvoid.style.justifyContent = 'space-between';
      lblAvoid.style.alignItems = 'center';
      lblAvoid.appendChild(this.txtAvoid);

      // Avoid input
      this.txtAvoid.rows = 1;
      this.txtAvoid.cols = 20;
      this.txtAvoid.placeholder = 'e.g. Q1,1|Q2,1...'
      this.txtAvoid.style.float = 'right';
      this.txtAvoid.style.marginLeft = '1em';
      this.txtAvoid.value = localStorage.getItem(RAW_AVOID) || '';

      // Starting ID Label
      lblStartingID.innerHTML = 'Starting ID:';
      lblStartingID.style.backgroundColor = 'rgba(255,255,255,0.7)';
      lblStartingID.style.borderRadius = '5px';
      lblStartingID.style.padding = '0.3em 1em';
      lblStartingID.style.cursor = 'pointer';
      lblStartingID.style.display = 'flex';
      lblStartingID.style.justifyContent = 'space-between';
      lblStartingID.appendChild(this.numStartingID);

      // Number of Responses Label
      lblNumResponse.innerHTML = 'Number of responses:';
      lblNumResponse.style.backgroundColor = 'rgba(255,255,255,0.7)';
      lblNumResponse.style.borderRadius = '5px';
      lblNumResponse.style.padding = '0.3em 1em';
      lblNumResponse.style.cursor = 'pointer';
      lblNumResponse.style.display = 'flex';
      lblNumResponse.style.justifyContent = 'space-between';
      lblNumResponse.appendChild(this.numNumResponse);

      // Starting ID input
      this.numStartingID.type = 'number';
      this.numStartingID.min = '1';
      this.numStartingID.value = Math.ceil(Math.random() * 10000000);
      this.numStartingID.style.maxWidth = '50%';
      this.numStartingID.style.marginLeft = '10px';

      // Number of Responses input
      this.numNumResponse.type = 'number';
      this.numNumResponse.min = '1';
      this.numNumResponse.max = '1000';
      this.numNumResponse.value = this.numResponses || 300;
      this.numNumResponse.style.maxWidth = '50%';
      this.numNumResponse.style.marginLeft = '10px';

      let isSurveyActive = document.querySelector('a.question-explorer-add-question.disabled') ? true : false;

      // Upload Label
      lblUpload.innerHTML = 'Automatically upload:';
      lblUpload.style.backgroundColor = 'rgba(255,255,255,0.7)';
      lblUpload.style.borderRadius = '5px';
      lblUpload.style.padding = '0.3em 1em';
      lblUpload.style.cursor = isSurveyActive ? 'pointer' : 'not-allowed';
      lblUpload.style.color = isSurveyActive ? 'black' : 'grey';
      lblUpload.style.display = 'flex';
      lblUpload.style.justifyContent = 'space-between';
      lblUpload.appendChild(this.chkUpload);

      this.chkUpload.type = 'checkbox';
      this.chkUpload.checked = isSurveyActive ? this.autoUpload : false;
      this.chkUpload.disabled = !isSurveyActive;
      this.chkUpload.style.marginLeft = '10px';

      // Initialize Survey Data Button
      this.btnMain.style.padding = '0.3em';
      this.btnMain.style.textAlign = 'center';
      this.btnMain.innerHTML = 'Begin response generation';
      this.btnMain.onclick = function () {
        this.setInputData();
        this.setStage(STAGE.GET_TERMS);
        this.navigateTo(QUOTA_URL);
      }.bind(this);

      this.uiContainer.append(
        lblStartingID,
        lblNumResponse,
        lblAvoid,
        lblForce,
        lblUpload,
        this.btnMain,
        this.btnHide,
      );

      document.body.appendChild(this.uiContainer);
    },
    navigateTo: function (href) {
      window.location.assign(href);
    },
    parseCommand: function (commandString) {
      let commandList = JSON.parse(commandString);
      let tempCmd = {};

      if (commandList) {
        for (let i = 0; i < commandList.length; i++) {
          let arrTemp = commandList[i].split(',');
          let qName = arrTemp.shift();

          tempCmd[qName] = arrTemp;
        }
      }
      return tempCmd;
    },
    removeOverlay: function () {
      if (this.overlay) {
        this.overlay.addEventListener('transitionend', (e) => {
          if (e.currentTarget == e.target) {
            this.overlay.remove();
          }
        });
        this.overlay.style.opacity = 0;
      }
    },
    setStage: function (stage) {
      sessionStorage.setItem(STAGE_STORE, stage);
    },
    queryTerminates: function () {
      let quotas = [...document.querySelectorAll('tr.odd, tr.even')];
      let terms = [];

      this.updateStatus('Detecting terminate conditions');

      quotas = quotas.filter((row) => {
        return (row.children[row.children.length - 2].innerText == '0' &&
          row.querySelector('.status-active'));
      });

      quotas.forEach((row) => {
        let conditions = {};
        let answerTable = row.querySelector('table>tbody');
        if (answerTable) {
          [...answerTable.children].forEach((innerRow) => {
            let qCode = innerRow.children[0].innerText;
            let punch = innerRow.children[1].innerText.match(/\([0-9]+\)$/g)?.[0].replace(/[\(\)]/g,'') ?? innerRow.children[1].innerText;
            if (conditions[qCode]) {
              conditions[qCode].push(punch);
            } else {
              conditions[qCode] = [punch];
            }
          });
        }

        terms.push(conditions);
      });

      this.updateStatus('Waiting for survey logic file');

      sessionStorage.setItem(TERMINATE, JSON.stringify(terms));
      this.setStage(STAGE.GENERATE_DATA);
    },
    setInputData: function () {
      sessionStorage.setItem(NUM_START, this.numStartingID.value);
      localStorage.setItem(AUTO_UPLOAD, this.chkUpload.checked ? 1 : 0);
      localStorage.setItem(NUM_RESPONSE, this.numNumResponse.value);
      localStorage.setItem(RAW_AVOID, this.txtAvoid.value.replace(' ',''));
      localStorage.setItem(RAW_FORCE, this.txtForce.value.replace(' ',''));

      if (this.txtForce.value) {
        localStorage.setItem(FORCE, JSON.stringify(this.txtForce.value.replace(' ','').split('|')));
      } else {
        localStorage.removeItem(FORCE);
      }
      if (this.txtAvoid.value) {
        localStorage.setItem(AVOID, JSON.stringify(this.txtAvoid.value.replace(' ','').split('|')));
      } else {
        localStorage.removeItem(AVOID);
      }
    },
    toggleHide: function () {
      if (this.hidden) {
        this.uiContainer.style.left = 'auto';
        this.uiContainer.style.right = '2em';
        this.btnHide.classList.add('glyphicon-chevron-right');
        this.btnHide.classList.remove('glyphicon-chevron-left');
      } else {
        this.uiContainer.style.left = '100%';
        this.uiContainer.style.right = 'auto';
        this.btnHide.classList.add('glyphicon-chevron-left');
        this.btnHide.classList.remove('glyphicon-chevron-right');
      }
      this.hidden = !this.hidden;
      localStorage.setItem(HIDDEN, this.hidden ? 1 : 0);
    },
    updateStatus: function (message) {
      this.textStatus.innerHTML = message;
    },
    uploadData: function (data) {
      const fileInput = document.querySelector('input[type="file"]');
      const dt = new DataTransfer();
      dt.items.add(new File([data], 'test-data.csv'));
      fileInput.files = dt.files;

      document.querySelector('a#save-button').click();
    },
  };

  function backgroundWorker () {
    onmessage = function (e) {
      importScripts(e.data.functionImport);

      let {
        survey,
        subqRef,
        startID,
        numResponses,
        commands,
        columnHeaders,
        terminates,
      } = e.data;

      let curDate = new Date();
      let validAgeYear = curDate.getFullYear() - 18;

      const Q_NUM_CONTEXT = {
        age: 1,
        year: 2,
        zipCode: 3,
        quantity: 4,
        percent: 5,
        yearRef: 6,
        yearAL: 7,
        scale: 8,
      };

      let sortedQCodes = [...columnHeaders].sort((a, b) => b.length - a.length);
      let rows = [];
      let numTerminated = 0;

      function getNumericContext (questionText) {
        // Return a context enumeration based on what the question text contains
        let context = null;

        if (questionText.includes('percent')) {
          context = Q_NUM_CONTEXT.percent;
        }
        else if (questionText.includes(' age') || questionText.includes('how old')) {
          context = Q_NUM_CONTEXT.age;
        }
        else if (questionText.includes('postal ') || questionText.includes('zip ')) {
          context = Q_NUM_CONTEXT.zipCode;
        }
        else if (questionText.includes(' many')
          || questionText.includes(' much')
          || questionText.includes(' number')
          || questionText.includes('amount')) {
          context = Q_NUM_CONTEXT.quantity;
        }
        else if (questionText.includes('year') || questionText.includes(' born') ) {
          if (questionText.includes('9999')) {
            context = Q_NUM_CONTEXT.yearRef;
          } else if (questionText.includes('0000')) {
            context = Q_NUM_CONTEXT.yearAL;
          } else {
            context = Q_NUM_CONTEXT.year;
          }
        }
        else if (questionText.includes('a scale')) {
          context = Q_NUM_CONTEXT.scale;
        }
        return context;
      }

      function generateNumericInput (min, max, refusedVal=-1) {
        let returnVal = 0;
        // 20% chance of returning refused option, if provided
        if (refusedVal > -1) {
          returnVal = (roll(0, 100) < 20) ? refusedVal : roll(min, max);
        } else {
          returnVal = roll(min, max);
        }
        return returnVal;
      };

      function roll (min, max) {
        return (Math.random() * (max - min) + min) | 0;
      };

      function getTimeStamp () {
        return String(curDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(curDate.getDate()).padStart(2, '0') + ' ' +
          String(curDate.getHours()).padStart(2, '0') + ':' +
          String(curDate.getMinutes()).padStart(2, '0');
      }

      const checkTerminate = function (response) {
        let terminateStatus = false;

        for (const quota of terminates) {
          let termConditions = Object.entries(quota);
          let conditionCount = 0;
          for (const [qCode, aCodes] of termConditions) {
            if (aCodes.includes(response.get(qCode)?.toString())) {
              conditionCount++;
            } else if (survey.get(qCode).type === 'M') {
              let question = survey.get(qCode);
              for (const subquestion in question.subqRelevance) {
                if (response.get(subquestion) == 1) {
                  conditionCount++;
                }
              }
            }
          }
          if (conditionCount >= termConditions.length && termConditions.length > 0) {
            terminateStatus = true;
            break;
          }
        }
        return terminateStatus;
      }

      const executeEquation = function (equationString, responseContext, inEquation = false) {
        let LEMifiedEquation = equationString
          .replaceAll('if(','LEMif(')
          .replaceAll('count(', 'actualLEMcount(')
          .replaceAll('sum(','LEMsum(')
          .replaceAll('is_empty(','LEMempty(')
          .replaceAll('strlen(','LEMstrlen(')
          .replaceAll('join(','LEMjoin(')
          .replaceAll('strlen(','LEMstrlen(')
          .replaceAll('regexMatch(','LEMregexMatch(')
          .replaceAll('unique(','LEMunique(')
          .replaceAll('str_replace(','LEMstr_replace(')
          .replaceAll('strtoupper(','LEMstrtoupper(')
          .replaceAll('strtolower(','LEMstrtolower(')
          .replaceAll('strpos(','LEMstrpos(')
          .replaceAll('countLEMif(','countif(')
          .replaceAll('countif(', 'LEMcountif(')
          .replaceAll('sumLEMif(','sumif(')
          .replaceAll(' AND ', ' && ')
          .replaceAll(' and ', ' && ')
          .replaceAll(' OR ', ' || ')
          .replaceAll(' or ', ' || ');
        let numericRegex = /^[0-9]+$/;
        let tempValue, groupIdTempValue, question;
        for (let x = 0; x < sortedQCodes.length; x++) {

          let mainQCode = subqRef.get(sortedQCodes[x]) ?? sortedQCodes[x];

          if (LEMifiedEquation.includes(sortedQCodes[x]) ||
            (mainQCode.length > 0 && LEMifiedEquation.includes(mainQCode))
            ) {
            if (survey.has(sortedQCodes[x])) {
              question = survey.get(sortedQCodes[x]);
            } else if (survey.has(mainQCode)) {
              question = survey.get(mainQCode);
            } else {
              // missing question code means this is invalid
              return '';
            }
            tempValue = (responseContext.get(sortedQCodes[x]) || '').toString();
            if (LEMifiedEquation.includes(sortedQCodes[x] + '.GroupID')) {
              groupIdTempValue = question.groupIDs.get(tempValue);
              groupIdTempValue = (groupIdTempValue == 'undefined' || !groupIdTempValue) ? '""' : groupIdTempValue;
              LEMifiedEquation = LEMifiedEquation.replaceAll(sortedQCodes[x] + '.GroupID', groupIdTempValue);
            }
            if (!numericRegex.test(tempValue)) {
              tempValue = '"' + tempValue + '"';
            }
            if (LEMifiedEquation.includes(sortedQCodes[x] + '.NAOK')) {
              LEMifiedEquation = LEMifiedEquation.replaceAll(sortedQCodes[x] + '.NAOK', tempValue);
            }
            // non .NAOK answer option
            if (LEMifiedEquation.includes(sortedQCodes[x])) {
              let innerRelevance;
              if (survey.has(sortedQCodes[x])) {
                innerRelevance = executeEquation(`(${question.relevance}) && (${question.groupRelevance})`, responseContext, inEquation);
              } else if (survey.has(mainQCode) && question.subqRelevance) {
                innerRelevance = executeEquation(`(${question.relevance}) && (${question.groupRelevance}) && (${question.subqRelevance[sortedQCodes[x]]})`, responseContext, inEquation);
              }
              if (!innerRelevance && !inEquation) {
                return '';
              }
            }
            LEMifiedEquation = LEMifiedEquation.replaceAll(sortedQCodes[x], tempValue);
          }
        }

        let result;

        try {
          result = eval(LEMifiedEquation);
        }

        catch (e) {
          result = '';
        }

        return result;
      };

      // Begin response generation
      for (let responseID = startID; rows.length < numResponses; responseID++) {

        let response = new Map();
        response.set('id', responseID)
          .set('token','')
          .set('submitdate','1')
          .set('lastpage','1')
          .set('startlanguage','en')
          .set('startdate','1')
          .set('datestamp','1');

        let question, qContext, respValue, relevant, forcedVal;

        columnHeaders.forEach((qCode) => {
          let mainQCode = subqRef.get(qCode);
          let subQCode = qCode.replace(mainQCode + '_', '');

          if (survey.has(qCode)) { // question
            question = survey.get(qCode);
            relevant = executeEquation(`(${question.relevance}) && (${question.groupRelevance})`, response);
            if ((!question.hidden || question.type === '*') && relevant) {
              if (commands.force?.[qCode]) {
                forcedVal = commands.force[qCode][roll(0, commands.force[qCode].length)].split("-");
                if (forcedVal.length > 1) {
                  forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
                } else {
                  forcedVal = forcedVal[0];
                }
                response.set(qCode, forcedVal);
              } else {
                switch (question.type) {
                  case 'L': // Radio
                  case '!': // Dropdown
                    let tempResponseValues = [...question.responseValues];

                    for (const aCode in question.responseRelevance) {
                      if (tempResponseValues.indexOf(aCode) >= 0 && !executeEquation(question.responseRelevance[aCode], response)) {
                        tempResponseValues.splice(tempResponseValues.indexOf(aCode), 1);
                      }
                    }

                    if (tempResponseValues.length > 0) {
                      respValue = tempResponseValues[roll(0, tempResponseValues.length)];
                      response.set(qCode, respValue);
                    } else {
                      console.log(`WARNING: ${qCode} has no relevant answer options. Output will be blank.`);
                      response.set(qCode, '');
                    }

                    break;
                  case 'U': // Huge Free Text (probably heatmap)
                  case 'S': // SFT
                  case 'T': // Long Free Text
                    if (question?.isHeatmap) {
                      respValue = question.responseValues;
                      if (Math.random() < 0.5) {
                        respValue = respValue.substring(0, respValue.length - 1) + '1';
                      }
                      response.set(qCode, respValue);
                    } else {
                      response.set(qCode, 'Run at: ' + getTimeStamp());
                    }
                    break;
                  case '*': // Equation
                    respValue = '';
                    let eqSetRegex = /^[A-Za-z0-9_]+ *=[^=<>!]/;
                    let eq, toSet, tempRespVal = '';
                    for (let i = 0; i < question.equations.length; i++) {
                      if (eqSetRegex.test(question.equations[i])) {
                        eq = question.equations[i].split('=');
                        toSet = eq.shift().trim();
                        eq = eq.join('=');
                        tempRespVal = executeEquation(eq, response, true);
                        if (columnHeaders.includes(toSet) && (tempRespVal.length > 0 || isFinite(tempRespVal))) {
                          response.set(toSet, tempRespVal);
                        }
                        respValue += tempRespVal;
                      } else {
                        respValue += executeEquation(question.equations[i], response, true);
                      }
                    }
                    response.set(qCode, respValue ? respValue : '');
                    break;
                  case 'N': // Numerical Input
                    qContext = getNumericContext(question.questionText);
                    switch (qContext) {
                      case Q_NUM_CONTEXT.age:
                      case Q_NUM_CONTEXT.percent:
                        respValue = generateNumericInput(18, 99).toString();
                        break;
                      case Q_NUM_CONTEXT.year:
                        respValue = generateNumericInput(1910, validAgeYear);
                        break;
                      case Q_NUM_CONTEXT.zipCode:
                        respValue = 11111;
                        break;
                      case Q_NUM_CONTEXT.yearRef:
                        // Year except with a refused option
                        respValue = generateNumericInput(1910, validAgeYear, 9999);
                        break;
                      case Q_NUM_CONTEXT.yearAL:
                        // Client-specific year w/ refused option
                        respValue = generateNumericInput(1910, validAgeYear, 0);
                        break;
                      default:  // Probably a quantity or something
                        respValue = roll(0, 20);
                    }
                    response.set(qCode, respValue);
                    break;
                  case 'I': // Language Switch
                    response.set(qCode, 'en');
                    break;
                  default:
                    response.set(qCode, '');
                    break;
                }
              }
            } else {
              response.set(qCode, '');
            }
          } else if (survey.has(mainQCode)) { //subquestion
            question = survey.get(mainQCode);
            let subqRelevance = question.subqRelevance?.[qCode];
            relevant = executeEquation(`(${question.relevance}) && (${question.groupRelevance}) && (${subqRelevance ?? 1})`, response);
            if (relevant && commands.force?.[qCode]) {  //specific subq
              forcedVal = commands.force[qCode][roll(0, commands.force[qCode].length)].split("-");
              if (forcedVal.length > 1) {
                forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
              } else {
                forcedVal = forcedVal[0];
              }
              response.set(qCode, forcedVal);
            } else if (relevant && commands.force?.[mainQCode]) { //overall
              if (question.type == 'M') {
                if (commands.force[mainQCode].includes(subQCode)) {
                  response.set(qCode, 1);
                } else {
                  response.set(qCode, '');
                }
              } else {
                forcedVal = commands.force[mainQCode][roll(0, commands.force[mainQCode].length)].split("-");
                if (forcedVal.length > 1) {
                  forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
                } else {
                  forcedVal = forcedVal[0];
                }
                response.set(qCode, forcedVal);
              }
            } else {
              switch (question.type) {
                case 'L': // Radio
                case '!': // Dropdown
                  if (response.get(mainQCode) == '-oth-') {
                    qContext = getNumericContext(question.questionText);
                    switch (qContext) {
                      case Q_NUM_CONTEXT.age:
                      case Q_NUM_CONTEXT.percent:
                        respValue = roll(18, 99);
                        break;
                      case Q_NUM_CONTEXT.year:
                        respValue = roll(1910, validAgeYear);
                        break;
                      case Q_NUM_CONTEXT.zipCode:
                        respValue = '90210';
                        break;
                      case Q_NUM_CONTEXT.quantity:
                        respValue = roll(0, 20);
                        break;
                      case Q_NUM_CONTEXT.scale:
                        respValue = roll(40, 100);
                        break;
                      default:  // Generic string response
                        respValue = 'Run at: ' + getTimeStamp();
                    }
                    response.set(qCode, respValue);
                  } else {
                    response.set(qCode, '');
                  }
                  break;
                case 'F': // Array
                case 'H': // Array by column
                  if (!question.hidden && relevant) {
                    respValue = question.responseValues[roll(0, question.responseValues.length)];
                    response.set(qCode, respValue);
                  } else {
                    response.set(qCode, '');
                  }
                  break;
                case 'M': // MC
                  if (!response.has(qCode)) {
                    let choiceRelevance = {};
                    for (const subqKey in question.subqRelevance) {
                      response.set(subqKey, '');
                      choiceRelevance[subqKey] = executeEquation(question.subqRelevance[subqKey], response);
                    }
                    if (!question.hidden && relevant) {
                      let selectExclusive = (Math.random() < 0.3);
                      let exclusiveCode;
                      if (selectExclusive && question.exclusive.length > 0) {
                        exclusiveCode = mainQCode + '_' + question.exclusive[roll(0, question.exclusive.length)];
                      }
                      if (selectExclusive && choiceRelevance[exclusiveCode]) { // exclusive option selected and it is displayed
                        response.set(exclusiveCode, 'Y');
                      } else {
                        let availableOpt = [...Object.keys(question.subqRelevance)];
                        for (const subqKey in choiceRelevance) {
                          if (!choiceRelevance[subqKey]) {
                            availableOpt.splice(availableOpt.indexOf(subqKey), 1);
                          }
                        }
                        let numSelected = roll(0, availableOpt.length < question.maxAnswers ? availableOpt.length : question.maxAnswers) + 1;
                        for (let i = 0; i < numSelected; i++) {
                          response.set(availableOpt[roll(0, availableOpt.length)], 'Y');
                        }
                        question.exclusive.forEach(exclusive => {
                          if (response.get(mainQCode + '_' + exclusive).length > 0) {
                            for (const subqKey in question.subqRelevance) {
                              response.set(subqKey, '');
                              response.set(mainQCode + '_' + exclusive, 'Y');
                            }
                          }
                        });
                        if (response.get(mainQCode + '_other') == 'Y') {
                          response.set(mainQCode + '_other', 'Run at: ' + getTimeStamp());
                        }
                      }
                    }
                  }
                  break;
                case 'Q': // Multiple Short Text
                  if (!question.hidden && relevant) {
                    response.set(qCode, 'Run at: ' + getTimeStamp());
                  } else {
                    response.set(qCode, '');
                  }
                  break;
                case 'K': // Multiple Numerical Input
                  if (!question.hidden && relevant) {
                    qContext = getNumericContext(question.questionText);
                    switch (qContext) {
                      case Q_NUM_CONTEXT.age:
                      case Q_NUM_CONTEXT.percent:
                        respValue = generateNumericInput(18, 99).toString();
                        break;
                      case Q_NUM_CONTEXT.year:
                        respValue = generateNumericInput(1910, validAgeYear);
                        break;
                      case Q_NUM_CONTEXT.zipCode:
                        respValue = 11111;
                        break;
                      case Q_NUM_CONTEXT.yearRef:
                        // Year except with a refused option
                        respValue = generateNumericInput(1910, validAgeYear, 9999);
                        break;
                      case Q_NUM_CONTEXT.yearAL:
                        // Client-specific year w/ refused option
                        respValue = generateNumericInput(1910, validAgeYear, 0);
                        break;
                      default:  // Probably a quantity or something
                        respValue = roll(0, 20);
                    }
                    response.set(qCode, respValue);
                  } else {
                    response.set(qCode, '');
                  }
                  break;
                default:
                  response.set(qCode, '');
                  break;
              }
            }
          } else {
            throw `Header does not exist in survey: ${qCode}`;
          }
        });
        if (checkTerminate(response)) {
          numTerminated++;
        } else {
          rows.push(response);
        }
        postMessage({
          done: false,
          numGenerated: rows.length,
          numTerminated: numTerminated,
        });
      }

      postMessage({
        done: true,
        rows: rows,
      });
    }
  }

  function actualLEMcount () {
    let result = 0;
    for (let i = 0; i < arguments.length; ++i) {
      let arg = arguments[i];
      if (arg !== '' && !arg) {
        ++result;
      }
    }
    return result;
  }

  try {
    ResponseGenerator.initialize();
  } catch (e) {
    console.log('Inturrupted, resetting...', e);
    sessionStorage.removeItem(STAGE_STORE);
    ResponseGenerator.removeOverlay();
    ResponseGenerator.initialize();
  }
}

window.addEventListener('load', () => {

  // script injection
  exec(initiate);

}, false);