// ==UserScript==
// @name    Survey DD Generator
// @version 1.0.1
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @grant GM_deleteValue
// @grant unsafeWindow
// @locale  en
// @description A tool to generate dummy data for surveys
// @include /^https?:\/\/.+\.(com|net)\/index\.php(\/survey\/.*|\?r=.+)/
// @include /^https?:\/\/.+\.(com|net)\/index\.php(\/[0-9]{6}.*|\?r=.+)/
// @include /^https?:\/\/.+\.(com|net)\/index\.php\/admin\/survey\/sa\/view\/surveyid\/[0-9]{6}.*/
// @namespace https://greasyfork.org/users/560069
// @downloadURL https://update.greasyfork.org/scripts/437506/Survey%20DD%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/437506/Survey%20DD%20Generator.meta.js
// ==/UserScript==
const mainSurveyPageURL = /^https?:\/\/.+\.(com|net)\/index\.php\/admin\/survey\/sa\/view\/surveyid\/[0-9]{6}.*/;

// Question type-specific classes; in element div.question-container
const QUESTION_CLASSES = {
  "list-radio": 1,
  "numeric": 2,
  "text-short": 3,
  "array-flexible-row": 4,
  "multiple-opt": 5,
  "list-dropdown": 6,
  "numeric-multi": 7,
  "text-long": 8,
  "multiple-short-txt": 9,
  "text-huge": 10
};
const QUESTION_TYPE = {
  radio: 1,
  numericInput: 2,
  shortFreeText: 3,
  array: 4,
  mChoice: 5,
  dropdown: 6,
  multiNumInput: 7,
  longFreeText: 8,
  multiShortFreeText: 9,
  textHuge: 10
};
const BUTTON_CODES = {
  right: 39,
  left: 37,
  up: 38,
  down: 40,
  spacebar: 32,
  enter: 13,
  esc: 27,
  insert: 45
};
const Q_NUM_CONTEXT = {
  age: 1,
  year: 2,
  zipCode: 3,
  quantity: 4,
  percent: 5,
  yearRef: 6,
  yearAL: 7,
  scale: 8
};
const Q_MC_CONTEXT = {
  two: 2,
  three: 3,
  four: 4,
  five: 5
}
const SDG_COMMANDS = [
  "avoid",
  "force"
];
const SDG_ALERTCODE = {
  invalidAnswer: 1,
  hiddenOptionForced: 2,
  unexpectedNonMandatory: 3,
};
const ACTIVE_NAME = "SDG_active";
const ATTEMPTS_NAME = "SDG_attempts";
const COMMAND_OBJ_NAME = "SDG_commands";
const SDG_HIDDEN = "SDG_hidden";
const SDG_REMAINING = "SDG_remaining";
const SDG_TOTAL = "TRUNS";  //Param string name
const SDG_TABID = "SDG_tabID";

// Main Page UI
const MAIN_PAGE_CARD = {
  containerStyle:`display:flex;
                  width:25rem;
                  height:20rem;
                  position:absolute;
                  top:0rem;
                  right:2rem;
                  background-color:#fafafa;
                  z-index: 100000;
                  opacity: 1;
                  border-radius: 0.5rem;
                  box-shadow: 1px 5px 25px #aaaaaa;
                  align-items:center;
                  justify-content:center;
                  flex-direction:column;
                  padding: 0.5em;
                  border: 1px solid grey;`,
  inputStyle:    `display:block;
                  color:black;
                  width:90%;
                  margin-bottom: 0.75rem;
                  padding: 0.5em 0.3em;`,
  buttonStyle:   `display:block;
                  width:50%;
                  color:#222;
                  padding: 0.3em 0.6em;
                  font-weight:500;`,
  labelStyle:    `display:block;
                  padding: 0.1em 0.8em;
                  margin-right:auto;
                  margin-bottom:0.2em;
                  color:#222;
                  font-weight:500;`,

  html: function(){
    return `
      <div style="${this.containerStyle.replace(/\n\s+/g,'')}">
        <label for="numruns" style="${this.labelStyle.replace(/\n\s+/g,'')}">Runs/tab</label>
        <input id="numruns" style="${this.inputStyle.replace(/\n\s+/g,'')}" type=number min="1" step="1" placeholder="Number of runs per tab">
        <label for="windowcount" style="${this.labelStyle.replace(/\n\s+/g,'')}"># of tabs</label>
        <input id="windowcount" style="${this.inputStyle.replace(/\n\s+/g,'')}" type=number min="1" step="1" placeholder="Number of tabs">
        <button style="${this.buttonStyle.replace(/\n\s+/g,'')}" type="button">Test</button>
      </div>
    `
  }
}

class Alert {
  constructor(code = 0, message = "Generic Alert Message") {
    this.code = code;
    this.message = message;
  }
}

let curDate = new Date();
let validAgeYear = curDate.getFullYear() - 18;

let MainPageInitiator = {
  numWindows: 0,
  valueChangeCount: 0,
  initialize: function () {
    // Survey Main Page
    console.log("== Survey Main Page ==");
    this.initUI();
  },
  initUI: function () {
    let menuBar = document.querySelector(".menubar.surveymanagerbar");
    let surveyExecuteBtn = document.querySelector('.menubar.surveybar a.btn.btn-default');
    let surveyLink = surveyExecuteBtn.href;

    menuBar.style.position = "relative";
    menuBar.insertAdjacentHTML('beforeend', MAIN_PAGE_CARD.html());

    GM_setValue('inProgress', 0);
    GM_addValueChangeListener('inProgress', function (name, old_value, new_value, remote) {
      this.valueChangeCount++;
      if (this.valueChangeCount == this.numWindows) {
        document.querySelector('button[data-value=S]').click();
        menuBar.querySelector('button').disabled = false;
        console.log(new Date().toLocaleString());
      }
      console.log('Value changed:', this.valueChangeCount, this.numWindows);
    }.bind(this));

    menuBar.querySelector('button').addEventListener('click', function (e) {
      let inputNumRuns = document.querySelector('#numruns');
      let inputWindowCount = document.querySelector('#windowcount');
      let openedTabs = 0;

      // Initialize values
      this.numWindows = inputWindowCount.value;
      GM_setValue('inProgress', 0);
      this.valueChangeCount = 0;

      if (inputNumRuns.value > 0 && inputWindowCount.value > 0) {
        inputNumRuns.value = Math.round(inputNumRuns.value);
        inputWindowCount.value = Math.round(inputWindowCount.value);

        if (window.confirm(`You are about to do ${inputNumRuns.value} ${inputNumRuns.value > 1 ? "runs" : "run"} in ${inputWindowCount.value} ${inputNumRuns.value > 1 ? "tabs" : "tab"}, for a total of ${inputNumRuns.value * inputWindowCount.value} ${inputNumRuns.value * inputWindowCount.value > 1 ? "runs" : "run"}. Continue?`)) {
          // Click All in one button
          document.querySelector('button[data-value=A]').click();
          console.log(new Date().toLocaleString());
          // Disable test button
          e.target.disabled = true;

          surveyExecuteBtn.href = surveyLink + `?${SDG_TOTAL}=${inputNumRuns.value}&tabID=0`;

          let clickSurveyExecute = function (tabID) {
            var simulateMouseEvent = function (element, eventName, coordX, coordY) {
              element.dispatchEvent(new MouseEvent(eventName, {
                view: unsafeWindow,
                bubbles: true,
                cancelable: true,
                clientX: coordX,
                clientY: coordY,
                button: 0
              }));
            };
            var box = surveyExecuteBtn.getBoundingClientRect(),
              coordX = box.left + (box.right - box.left) / 2,
              coordY = box.top + (box.bottom - box.top) / 2;

            surveyExecuteBtn.href = surveyExecuteBtn.href.replace(/tabID=[0-9]+/,`tabID=${tabID}`);

            simulateMouseEvent(surveyExecuteBtn, "mousedown", coordX, coordY);
            simulateMouseEvent(surveyExecuteBtn, "mouseup", coordX, coordY);
            simulateMouseEvent(surveyExecuteBtn, "click", coordX, coordY);

            openedTabs++;

            if (openedTabs==inputWindowCount.value) {
              // Change the survey link back to its original link
              surveyExecuteBtn.href = surveyLink;
            }
          };

          // Simulate clicks on the execute survey button
          for (let i = 0; i < inputWindowCount.value; i++) {
            let delay = 10;
            setTimeout(clickSurveyExecute, delay, i + 1);
          }
        }
      } else {
        alert("Please enter valid numbers greater than 0.");
      }
    }.bind(this));
  },
};

let SurveyDDGenerator = {
  active: false,
  attempts: 0,
  commands: null,
  commandsFound: false,
  currentQuestion: null,
  errorDeactivateOverride: false,
  errorAlertShown: false,
  hidden: false,
  infoElements: [],
  remaining: null,
  questionCode: null,
  questionList: null,
  questionType: null,
  tabID: null,
  alerts:[],
  initialize: function () {
    console.log("Initializing...");

    // Survey questions
    console.log("== Survey Questions ==");
    this.addErrorAlertListener();
    this.commands = this.queryCommands();
    this.initStorage();

    // Iterate through all question containers
    document.querySelectorAll("div.question-container").forEach(qContainer => {
      this.currentQuestion = qContainer;  // Reference to current questions container for other functions to access
      this.questionType = this.getQuestionType(qContainer);
      this.questionCode = qContainer.querySelector("span#QNameNumData");
      this.questionCode = this.questionCode ? this.questionCode.dataset.code : null;
      this.enterDummyResponse();
    }, this);

    this.initUI();

    document.body.appendChild(this.uiContainer);

    if (document.querySelector("button#movenextbtn")) {
      document.querySelector("button#movenextbtn").disabled = false;
    }

    if (this.remaining != null) {
      if (document.querySelector('div.question-container')) {
        // Submit if in survey
        this.setRemainingCount(this.remaining);
        document.querySelector('#movesubmitbtn, #movenextbtn').click();
      } else {
        if (this.remaining > 0) {
          // Restart survey for another run
          this.setRemainingCount(this.remaining - 1);
          window.location.href = window.location.href;
        } else {
          // Increment the value in GM storage so that the value change is evoked
          GM_setValue('inProgress', this.tabID);
          sessionStorage.removeItem(SDG_REMAINING);
          window.close();
        }
      }
    }
  },
  initUI: function () {
    this.uiContainer = document.createElement("div");
    this.remainingDisplay = document.createElement("div");

    // Message Display
    this.remainingDisplay.style["font-weight"] = "bold";
    this.remainingDisplay.style["background-color"] = "rgba(255,255,255,0.75)";
    this.remainingDisplay.style["transition-duration"] = "0.75s";
    this.remainingDisplay.style.color = "#000000";
    this.remainingDisplay.innerHTML = `Remaining runs: ${this.remaining ? this.remaining : "N/A"}`;
    this.remainingDisplay.ontransitionend = function () {
      this.style.color = "#000000";
    };

    // Rounded background rectangle
    this.uiContainer.style.position = "fixed";
    this.uiContainer.style.padding = "7px";
    this.uiContainer.style.right = "0px";
    this.uiContainer.style.top = "75px";
    this.uiContainer.style["margin-right"] = this.hidden ? "-100%" : marginRightOffset.toString() + "px";
    this.uiContainer.style["transition-duration"] = "0.5s";
    this.uiContainer.style["z-index"] = 2001;
    this.uiContainer.style["background-color"] = "rgba(0,0,0,0.1)";
    this.uiContainer.style["border-radius"] = "10px";
    this.uiContainer.style["text-align"] = "center";

    this.uiContainer.append(this.remainingDisplay);
  },
  initQuestionInfoDisplay: function () {
    let qCodeDisplay = document.createElement("div");
    let qContainer = document.querySelector("div.question-container");

    let mainSurveyPageLink = document.createElement("a");

    // The big orange button is a link to a relevant page in a new tab
    mainSurveyPageLink.target = "_blank";
    mainSurveyPageLink.appendChild(qCodeDisplay);

    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        this.generateRadioInfoDisplay();
        break;
      case QUESTION_TYPE.array:
        this.generateArrayInfoDisplay();
        break;
      case QUESTION_TYPE.mChoice:
        this.generateMChoiceInfoDisplay();
        break;
      default:
        console.log("Question type for info display not found.");
    }

    // Big orange circle with question code
    qCodeDisplay.innerHTML = this.questionCode;
    qCodeDisplay.style.height = "40px";
    qCodeDisplay.style.display = "inline-block";
    qCodeDisplay.style.color = "floralwhite";
    qCodeDisplay.style.position = "absolute";
    qCodeDisplay.style.top = "-20px";
    qCodeDisplay.style.opacity = this.hidden ? 0 : 0.95;
    qCodeDisplay.style.padding = "10px";
    qCodeDisplay.style["background-color"] = "orange";
    qCodeDisplay.style["border-radius"] = "20px";
    qCodeDisplay.style["font-weight"] = "bold";

    qCodeDisplay.dataset.opacity = 0.95;

    if (qContainer) {
      // In question, attach the question code display to the top of the question container
      // Link the big orange button to the question edit page
      // sgqCode is of the format {SurveyID}X{GroupID}X{QuestionID}
      let sgqCode = document.querySelector("input#lastanswer").value.split("X");
      mainSurveyPageLink.href = window.location.origin +
        "/index.php" + (window.location.search.startsWith("?r=") ? "?r=" : "/") +
        "admin/questions/sa/view/surveyid/" + sgqCode[0] +
        "/gid/" + sgqCode[1] +
        "/qid/" + sgqCode[2];
      qContainer.appendChild(mainSurveyPageLink);
      this.infoElements.push(qCodeDisplay);
    } else {
      // Not in question, attach the question code display to the top of the UI container
      // Link the big orange button to the main survey page
      mainSurveyPageLink.href = window.location.origin +
        "/index.php" + (window.location.search.startsWith("?r=") ? "?r=" : "/") +
        "admin/survey/sa/view/surveyid/" + window.location.pathname.match(/[0-9]{6}/)[0];
      this.uiContainer.prepend(mainSurveyPageLink);
      qCodeDisplay.style.position = "relative";
      qCodeDisplay.style.top = "0px";
    }

    // Set generic style settings for each infoDisplay element
    this.infoElements.forEach(e => {
      e.style.color = "white";
      e.style["background-color"] = "orangered";
      e.style["font-weight"] = "bold";
      e.style["transition-duration"] = "0.5s";
    });
  },
  initStorage: function () {
    let activity = localStorage.getItem(ACTIVE_NAME);
    let hiddenVal = localStorage.getItem(SDG_HIDDEN);

    let prevQuestion = sessionStorage.getItem("SDG_qcode") || "Start";
    let attempts = sessionStorage.getItem(ATTEMPTS_NAME);
    let cmdObjStr = sessionStorage.getItem(COMMAND_OBJ_NAME);
    let remainingRuns = sessionStorage.getItem(SDG_REMAINING);
    let tabIdentifier = sessionStorage.getItem(SDG_TABID);

    let params = new URLSearchParams(document.location.search);

    sessionStorage.setItem("SDG_qcode", this.questionCode);
    sessionStorage.setItem("SDG_prev_qcode", prevQuestion);

    // if value exists in session/local storage, set to that value. Otherwise, initialize the value
    if (activity) {
      this.active = (activity === "1");
    } else {
      localStorage.setItem(ACTIVE_NAME, "0");
    }

    if (hiddenVal) {
      this.hidden = (hiddenVal === "1");
    } else {
      localStorage.setItem(SDG_HIDDEN, "0");
    }

    if (remainingRuns) {
      this.remaining = remainingRuns;
    } else {
      if (params.get(SDG_TOTAL)) {
        this.remaining = Number(params.get(SDG_TOTAL)) - 1;
      }
    }

    if (tabIdentifier) {
      this.tabID = tabIdentifier;
    } else {
      if (params.get("tabID")) {
        this.tabID = Number(params.get("tabID"));
        sessionStorage.setItem(SDG_TABID, this.tabID);
      }
    }

    if (prevQuestion === this.questionCode) {
      this.attempts = Number(attempts);
    } else {
      sessionStorage.removeItem(ATTEMPTS_NAME);
    }

    if (cmdObjStr) {
      if (this.commandsFound) {
        let cmdObj = JSON.parse(cmdObjStr);

        // If the current set of commands is missing something
        // from the stored commands, add them in
        for (const cmd in cmdObj) {
          for (const qCode in cmdObj[cmd]) {
            if (!this.commands[cmd]) {
              this.commands[cmd] = {};
            }
            if (!this.commands[cmd][qCode]) {
              this.commands[cmd][qCode] = cmdObj[cmd][qCode];
            }
          }
        }
        sessionStorage.setItem(COMMAND_OBJ_NAME, JSON.stringify(this.commands));
      } else {
        this.commands = JSON.parse(cmdObjStr);
      }
    } else {
      sessionStorage.setItem(COMMAND_OBJ_NAME, JSON.stringify(this.commands));
    }
  },
  addAlert: function (alert) {
    this.alerts.push(alert);
    this.displayAlerts();
  },
  displayAlerts: function () {
    window.setTimeout (function () {
      if (this.alerts.length > 0) {
        let codeShown = [];
        let alertString = [];
        this.alerts.forEach(a => {
          if (!codeShown.includes(a.code)) {
            codeShown.push(a.code);
            alertString.push(a.message);
          }

          this.alertDisplay.innerHTML = alertString.join("<br />");
        });

        this.alertDisplay.style.padding = "5px";
        this.alertDisplay.style["margin-top"] = "5px";
        this.alertDisplay.style.border = "1px solid black";
        this.alertDisplay.style.color = "#FF0000";
      }
    }.bind(this), 25);
  },
  clickNextButton: function () {
    let nextBtn = document.querySelector("#movenextbtn") || document.querySelector("#movesubmitbtn");

    if (nextBtn) {
      nextBtn.click();
    } else {
      if (this.active) {
        this.clickPrevButton();
      }
    }
  },
  clickPrevButton: function () {
    let prevBtn = document.querySelector("#moveprevbtn");
    if (prevBtn) {
      prevBtn.click();
    }
  },
  setActive: function (val) {
    this.active = val;
    this.activeCheckbox.checked = val;
    console.log("Activity changed: ", val);

    this.setStorageActivity(val);
  },
  toggleActive: function () {
    this.setActive(!this.active);
  },
  setStorageActivity: function (activity) {
    localStorage.setItem(ACTIVE_NAME, activity ? "1" : "0");
  },
  setRemainingCount: function (value) {
    sessionStorage.setItem(SDG_REMAINING, value);
  },
  toggleUI: function () {
    if (this.hidden) {
      this.showUI();
      this.hidden = false;
      this.showInfoElements();
    } else {
      this.hideUI();
      this.hidden = true;
      this.hideInfoElements();
    }
    this.setStorageHidden(this.hidden);
  },
  setStorageHidden: function (val) {
    localStorage.setItem(SDG_HIDDEN, val ? "1" : "0");
  },
  showUI: function () {
    this.uiContainer.style["margin-right"] = marginRightOffset.toString() + "px";
  },
  hideUI: function () {
    this.uiContainer.style["margin-right"] = "-" + (marginRightOffset + this.uiContainer.offsetWidth).toString() + "px";
  },
  showInfoElements: function () {
    this.infoElements.forEach(element => element.style.opacity = element.dataset.opacity);
  },
  hideInfoElements: function () {
    this.infoElements.forEach(element => element.style.opacity = 0);
  },
  buttonActionHandler: function (e) {
    switch (e.type) {
      case "keydown":
        this.handleKeyDown(e.keyCode);
        break;
      case "click":
        this.enterDummyResponse();
        this.clickNextButton();
        break;
      default:
        console.log("buttonActionHandler: Did nothing.");
    }
  },
  handleKeyDown: function (keyCode) {
    if (this.hidden) {
      if (keyCode === BUTTON_CODES.esc) {
        this.toggleUI();
      }
    } else {
      switch (keyCode) {
        case BUTTON_CODES.right:
          this.enterDummyResponse();
          // Fallthrough
        case BUTTON_CODES.enter:
          this.clickNextButton();
          break;
        case BUTTON_CODES.left:
          this.clickPrevButton();
          break;
        case BUTTON_CODES.spacebar:
          this.activeCheckbox.blur();
          this.toggleActive();
          break;
        case BUTTON_CODES.insert:
          this.enterDummyResponse();
          break;
        case BUTTON_CODES.esc:
          this.toggleUI();
          break;
      }
    }
  },
  getQuestionType: function (container) {
    if (container) {
      container = container.classList;
      for (const typeName in QUESTION_CLASSES) {
        if (container.contains(typeName)) {
          console.log(typeName + " detected.");
          return QUESTION_CLASSES[typeName];
        }
      }
    }
    return undefined;
  },
  getNumericContext: function () {
    // Return a context enumeration based on what the question text contains
    let questionText = this.currentQuestion.querySelector("div.question-text").innerText.toLowerCase();
    let context = null;

    if (questionText.includes("percent")) {
      context = Q_NUM_CONTEXT.percent;
    }
    else if (questionText.includes(" age") || questionText.includes("how old")) {
      context = Q_NUM_CONTEXT.age;
    }
    else if (questionText.includes("postal ") || questionText.includes("zip ")) {
      context = Q_NUM_CONTEXT.zipCode;
    }
    else if (questionText.includes(" many")
      || questionText.includes(" much")
      || questionText.includes(" number")
      || questionText.includes("amount")) {
      context = Q_NUM_CONTEXT.quantity;
    }
    else if (questionText.includes("year") || questionText.includes(" born") ) {
      if (questionText.includes("9999")) {
        context = Q_NUM_CONTEXT.yearRef;
      } else if (questionText.includes("0000")) {
        context = Q_NUM_CONTEXT.yearAL;
      } else {
        context = Q_NUM_CONTEXT.year;
      }
    }
    else if (questionText.includes("a scale")) {
      context = Q_NUM_CONTEXT.scale;
    }
    return context;
  },
  getMCContext: function () {
    // Return a context enumeration based on what the question text contains
    let questionText = this.currentQuestion.querySelector("div.question-text").innerText.toLowerCase();
    let context = null;

    if (questionText.includes("choos")
      || questionText.includes("select")
      || questionText.includes("pick")
      || questionText.includes("which ")
      || questionText.includes(" up to")) {
      if (questionText.includes(" two") || questionText.includes(" 2")) {
        context = Q_MC_CONTEXT.two;
      } else if (questionText.includes(" three") || questionText.includes(" 3")) {
        context = Q_MC_CONTEXT.three;
      } else if (questionText.includes(" four") || questionText.includes(" 4")) {
        context = Q_MC_CONTEXT.four;
      } else if (questionText.includes(" five") || questionText.includes(" 5")) {
        context = Q_MC_CONTEXT.five;
      }
    }
    return context;
  },
  addErrorAlertListener: function () {
    const alertElement = document.querySelector("#bootstrap-alert-box-modal");
    const config = {
      attributes: true
    };
    let observer = new MutationObserver(this.alertFoundHandler.bind(this));
    observer.observe(alertElement, config);
  },
  alertFoundHandler: function (mutationList, observer) {
    mutationList.forEach(mutation => {
      if (mutation.attributeName === "style" && mutation.target.style.display !== "none") {
        this.addAlert(new Alert(SDG_ALERTCODE.invalidAnswer, "Answer Invalid." +
          (this.active ? " Pausing run..." : ""))
        );
        if (!this.hidden) {
          mutation.target.querySelector("div.modal-footer > a.btn.btn-default").click();
        }
        if (!this.errorDeactivateOverride) {
          this.setActive(false);
        }
      }
    });
  },
  enterDummyResponse: function () {
    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        this.inputRadio();
        break;
      case QUESTION_TYPE.numericInput:
        this.inputNumericValue();
        break;
      case QUESTION_TYPE.shortFreeText:
        this.inputSFTValue();
        break;
      case QUESTION_TYPE.array:
        this.inputArrayOptions();
        break;
      case QUESTION_TYPE.mChoice:
        this.inputMultipleChoiceOptions();
        break;
      case QUESTION_TYPE.dropdown:
        this.inputDropdown();
        break;
      case QUESTION_TYPE.longFreeText:
        this.inputLFTValue();
        break;
      case QUESTION_TYPE.multiShortFreeText:
        this.inputMSFTValue();
        break;
      case QUESTION_TYPE.textHuge:
        //this.inputHeatmap();
        break;
      default:
        console.log("Handleable question type not found.");
    }
  },
  clearResponses: function () {
    switch (this.questionType) {
      case QUESTION_TYPE.radio:
        this.clearRadio();
        break;
      case QUESTION_TYPE.mChoice:
        this.clearMChoice();
        break;
    }
  },
  inputRadio: function () {
    let ansList = this.currentQuestion.querySelectorAll("div.answers-list > div.answer-item");
    let ansInputList = this.currentQuestion.querySelectorAll("div.answers-list > div.answer-item input.radio");
    let r = roll(0, ansInputList.length);
    let forced = false;

    this.clearRadio();

    try {
      if (this.commands.force && this.commands.force[this.questionCode]) {
        let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)];
        for (let i = 0; i < ansInputList.length; i++) {
          if (forcedVal === ansInputList[i].value) {
            r = i;
            /*if (isHidden(ansInputList[r])) {
              throw "ERROR: " + this.questionCode + " - option " + forcedVal +
                " is hidden but is being used as a forced option.";
            }*/
            break;
          }
        }
        forced = true;
      } else {
        // Checks to see whether the option found is hidden or not
        while (isHidden(ansInputList[r])) {
          r = roll(0, ansInputList.length);
        }
      }
    }
    catch (e) {
      this.addAlert(new Alert(SDG_ALERTCODE.hiddenOptionForced, e));
    }
    if (!forced && this.commands.avoid && this.commands.avoid[this.questionCode]) {
      let restrictedVals = this.commands.avoid[this.questionCode];
      while (restrictedVals.includes(ansInputList[r].value)) { //} || isHidden(ansInputList[r])) {
        r = roll(0, ansInputList.length);
      }
    }

    ansList.item(r).querySelector("input.radio").click(); //.checked = true;
    let otherOpt = ansList.item(r).querySelector("input.text");
    if (otherOpt) {
      let context = this.getNumericContext();
      switch (context) {
        case Q_NUM_CONTEXT.age:
        case Q_NUM_CONTEXT.percent:
          otherOpt.value = roll(18, 99);
          break;
        case Q_NUM_CONTEXT.year:
          otherOpt.value = roll(1910, validAgeYear);
          break;
        case Q_NUM_CONTEXT.zipCode:
          otherOpt.value = "90210";
          break;
        case Q_NUM_CONTEXT.quantity:
          otherOpt.value = roll(0, 20);
          break;
        case Q_NUM_CONTEXT.scale:
          otherOpt.value = roll(40, 100);
          break;
        default:  // Generic string response
          otherOpt.value = "Run at: " + getTimeStamp();
      }
    }
  },
  clearRadio: function () {
    let ansList = this.currentQuestion.querySelectorAll("div.answers-list>div.answer-item");
    let ans;
    for (let i = 0; i < ansList.length; i++) {
      ans = ansList.item(i).querySelector("input.radio");
      if (ans.checked) {
        ans.checked = false;
        let otherOpt = ansList.item(i).querySelector("input.text");
        if (otherOpt) {
          otherOpt.value = "";
        }
        break;
      }
    }
  },
  inputNumericValue: function () {
    let inputVal = 0;
    let inputElement = this.currentQuestion.querySelector("input.numeric");

    if (this.commands.force && this.commands.force[this.questionCode]) {
      // Select from one of the comma separated values, if it's a range it should have a '-' in it
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)].split("-");
      if (forcedVal.length > 1) {
        forcedVal = roll(Number(forcedVal[0]), Number(forcedVal[1]) + 1);
        inputVal = forcedVal;
      } else {
        inputVal = forcedVal[0];
      }
    } else {
      let context = this.getNumericContext();
      switch (context) {
        case Q_NUM_CONTEXT.age:
        case Q_NUM_CONTEXT.percent:
          inputVal = "0" + generateNumericInput(18, 99).toString();
          break;
        case Q_NUM_CONTEXT.year:
          inputVal = generateNumericInput(1910, validAgeYear);
          break;
        case Q_NUM_CONTEXT.zipCode:
          inputVal = 90210;
          break;
        case Q_NUM_CONTEXT.yearRef:
          // Year except with a refused option
          inputVal = generateNumericInput(1910, validAgeYear, 9999);
          break;
        case Q_NUM_CONTEXT.yearAL:
          // Client-specific year w/ refused option
          inputVal = generateNumericInput(1910, validAgeYear, 0);
          break;
        default:  // Probably a quantity or something
          inputVal = roll(0, 20);
      }
    }

    inputElement.value = inputVal;
  },
  inputSFTValue: function () {
    let inputElement = this.currentQuestion.querySelector("input.text");

    // Only set the value if there is nothing already in
    if (inputElement.value.length === 0) {
      inputElement.value = "Run at: " + getTimeStamp();
    }
  },
  inputMSFTValue: function () {
    let inputElement = this.currentQuestion.querySelectorAll("div.question-container input.text");

    inputElement.forEach(e => {
      // Only set the value if there is nothing already in
      if (e.value.length === 0) {
        e.value = "Run at: " + getTimeStamp();
      }
    });
  },
  inputLFTValue: function () {
    let inputElement = this.currentQuestion.querySelector("div.question-container textarea");

    // Only set the value if there is nothing already in
    if (inputElement.value.length === 0) {
      inputElement.value = "Run at: " + getTimeStamp();
    }
  },
  inputArrayOptions: function () {
    let arrayTable = this.currentQuestion.querySelector("table.questions-list");
    let rows = arrayTable.querySelectorAll(".answers-list");
    let options, r;
    rows.forEach(row => {
      options = row.querySelectorAll("td>input.radio");
      r = roll(0, options.length);
      //if (!isHidden(options[r])) {
      	options[r].click(); //checked = true;
      //}
    });
  },
  inputMultipleChoiceOptions: function () {
    let checkboxes = this.currentQuestion.querySelectorAll("div.questions-list div.answer-item input.checkbox");
    let context = this.getMCContext();
    let numToCheck = roll(2, context ? context : Math.ceil(checkboxes.length / 3));
    let toBeChecked = [];
    let r = 0;
    let forced = false;
    let restrictedVals = [];
    let rollAttempts = 0;

    let qID = this.currentQuestion.id.replace("question","");
    let subquestionCodes = function () {
      let sqCodes = [];

      this.currentQuestion.querySelectorAll("div.questions-list > div > div.answer-item").forEach(function (e) {
        sqCodes.push(e.id.split(qID)[1]);
      });
      return sqCodes;
    }.bind(this)();

    // Clear the checkboxes before re-selecting them
    this.clearMChoice();

    try {
      if (this.commands.force && this.commands.force[this.questionCode]) {
        let forcedVals = this.commands.force[this.questionCode];
        for (let i = 0; i < subquestionCodes.length
          && toBeChecked.length < numToCheck
          && toBeChecked.length < forcedVals.length; i++) {
          // Check every option that is forced
          if (forcedVals.includes(subquestionCodes[i])) {
            checkboxes[i].click(); //checked = true;
            /*if (isHidden(checkboxes[i])) {
              throw "ERROR: " + this.questionCode + " - option " + subquestionCodes[i] +
                " is hidden but is being used as a forced option.";
            }*/
            toBeChecked.push(i);
          }
        }
        forced = true;
      }
    }
    catch (e) {
      this.addAlert(new Alert(SDG_ALERTCODE.hiddenOptionForced, e));
    }
    if (!forced && this.commands.avoid && this.commands.avoid[this.questionCode]) {
      restrictedVals = this.commands.avoid[this.questionCode];
    }

    while (rollAttempts <= 10 && toBeChecked.length < numToCheck) {
      r = roll(0, checkboxes.length);
      if (!checkboxes[r].checked
        && checkboxes[r].closest("div.answer-item").style.display != "none"
        && !restrictedVals.includes(subquestionCodes[r])) {
        checkboxes[r].click(); //checked = true;
        if (checkboxes[r].classList.contains("other-checkbox")) {
          checkboxes[r].closest("div.answer-item").querySelector("input.text").value = "Run at: " + getTimeStamp();
        }
        toBeChecked.push(r);
      } else {
        // Infinite loop avoidance
        rollAttempts++;
      }
    }
  },
  clearMChoice: function () {
    let checkboxes = this.currentQuestion.querySelectorAll("div.questions-list div.answer-item input.checkbox");

    checkboxes.forEach(chkbox => {
      if (chkbox.checked) {
        chkbox.click();
      }
      if (chkbox.classList.contains("other-checkbox")) {
        chkbox.closest("div.answer-item").querySelector("input.text").value = "";
      }
    });
  },
  inputDropdown: function () {
    let dropdownElements = this.currentQuestion.querySelector("div.question-container select.list-question-select");
    let r = roll(0, dropdownElements.length);
    let forced = false;

    if (this.commands.force && this.commands.force[this.questionCode]) {
      let forcedVal = this.commands.force[this.questionCode][roll(0, this.commands.force[this.questionCode].length)];
      for (let i = 0; i < dropdownElements.length; i++) {
        if (forcedVal === dropdownElements[i].value) {
          r = i;
          break;
        }
      }
      forced = true;
    } else {
      // Roll until we reach an option with a value
      while (!dropdownElements[r].value) {
        r = roll(0, dropdownElements.length);
      }
    }
    if (!forced && this.commands.avoid && this.commands.avoid[this.questionCode]) {
      let restrictedVals = this.commands.avoid[this.questionCode];
      while (!dropdownElements[r].value || restrictedVals.includes(dropdownElements[r].value)) {
        r = roll(0, dropdownElements.length);
      }
    }

    dropdownElements[r].selected = true;
  },
  inputHeatmap: function () {
    let range = this.currentQuestion.createRange();
    let heatmap = this.currentQuestion.querySelector("#contentHeatMap");
    let content = heatmap.childNodes[0];

    range.setStart(content, 0);
    range.setEnd(content, 1);

    window.getSelection().addRange(range);

    heatmap.dispatchEvent(new MouseEvent("mouseup",{
      view: window,
      bubbles: true,
      cancelable: true
    }));
  },
  queryCommands: function () {
    // commands are html tags with data attributes of the same name containing
    // question codes and answer codes in the form "QX,1,2,3|QX2,1,2,3"
    let commandList = document.querySelectorAll(SDG_COMMANDS.join(","));
    let commandContainer = {};
    for (let x = 0; x < SDG_COMMANDS.length; x++) {
      commandContainer[SDG_COMMANDS[x]] = null;
    }

    if (commandList.length > 0) {
      commandList.forEach(cmd => {
        let tempCmd = {};
        let questionData = cmd.dataset[cmd.localName].split("|");

        for (let i = 0; i < questionData.length; i++) {
          let arrTemp = questionData[i].split(" ").join("").split(",");
          let qName = arrTemp.shift();

          tempCmd[qName] = arrTemp;
        }

        commandContainer[cmd.localName] = tempCmd;
      });
      this.commandsFound = true;
    }

    return commandContainer;
  },
  generateArrayInfoDisplay: function () {
    let rows = document.querySelectorAll("tbody > tr.answers-list");
    let headerCols = document.querySelectorAll("thead th.th-9");
    let firstRowCells = rows[0].querySelectorAll("td.answer-item > input");
    let qID = document.querySelector("div.question-container").id.replace("question","");

    // Subquestion code display
    for (let i = 0; i < rows.length; i++) {
      let infoDiv = document.createElement("div");
      infoDiv.innerHTML = rows[i].id.split(qID)[1];
      infoDiv.style.position = "absolute";
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px 0.5em";
      infoDiv.style.color = "white";
      infoDiv.style.opacity = this.hidden ? 0 : 0.75;
      infoDiv.style["background-color"] = "orangered";
      infoDiv.style["border-radius"] = "50% 0 0 10%";
      infoDiv.style["font-weight"] = "bold";
      infoDiv.style["transition-duration"] = "0.5s";

      infoDiv.dataset.opacity = 0.75;

      rows[i].appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }

    let rowHeight = headerCols[0].offsetHeight.toString() + "px";
    // Answer option value display
    for (let j = 0; j < firstRowCells.length; j++) {
      let infoDiv = document.createElement("div");
      infoDiv.innerHTML = firstRowCells[j].value;
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-" + rowHeight;
      infoDiv.style.left = "50%";
      infoDiv.style.padding = "3px 0.5em";
      infoDiv.style.opacity = this.hidden ? 0 : 0.75;
      infoDiv.style["transform"] = "translate(-50%, -100%)";
      infoDiv.style["border-radius"] = "45% 45% 5px 5px";

      infoDiv.dataset.opacity = 0.75;

      let infoDivContainer = document.createElement("div");
      infoDivContainer.style.position = "relative";

      infoDivContainer.appendChild(infoDiv);
      headerCols[j].appendChild(infoDivContainer);

      this.infoElements.push(infoDiv);
    }
  },
  generateRadioInfoDisplay: function () {
    let ansList = document.querySelectorAll("div.answers-list > div.answer-item input.radio");

    // Answer option value display
    for (let i = 0; i < ansList.length; i++) {
      let infoDiv = document.createElement("div");
      infoDiv.innerHTML = ansList[i].value;
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-0.3em";
      infoDiv.style.opacity = this.hidden ? 0 : 0.75;
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px";
      infoDiv.style.hyphens = "none";
      infoDiv.style.height = "28px";
      infoDiv.style.width = "fit-content";
      infoDiv.style["min-width"] = "28px";
      infoDiv.style["text-align"] = "center";
      infoDiv.style["margin-right"] = "1em";
      infoDiv.style["border-radius"] = "30px";
      infoDiv.style["padding-top"] = "0.2em";

      infoDiv.dataset.opacity = 0.75;

      ansList[i].closest("div.answer-item").appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }
  },
  generateMChoiceInfoDisplay: function () {
    let choiceList = document.querySelectorAll("div.questions-list > div > div.answer-item");
    let qID = document.querySelector("div.question-container").id.replace("question","");

    for (let i = 0; i < choiceList.length; i++) {
      let infoDiv = document.createElement("div");
      infoDiv.innerHTML = choiceList[i].id.split(qID)[1];
      infoDiv.style.position = "absolute";
      infoDiv.style.top = "-0.3em";
      infoDiv.style.opacity = this.hidden ? 0 : 0.75;
      infoDiv.style.right = "100%";
      infoDiv.style.padding = "3px";
      infoDiv.style.hyphens = "none";
      infoDiv.style.height = "28px";
      infoDiv.style.width = "fit-content";
      infoDiv.style["min-width"] = "28px";
      infoDiv.style["text-align"] = "center";
      infoDiv.style["margin-right"] = "-0.5em";
      infoDiv.style["border-radius"] = "30px";
      infoDiv.style["padding-top"] = "0.2em";

      infoDiv.dataset.opacity = 0.75;

      choiceList[i].appendChild(infoDiv);

      this.infoElements.push(infoDiv);
    }
  }
};

function roll (min, max) {
  return (Math.random() * (max - min) + min) | 0;
};

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

function getTimeStamp () {
  return String(curDate.getMonth() + 1).padStart(2, "0") + "-" +
    String(curDate.getDate()).padStart(2, "0") + " " +
    String(curDate.getHours()).padStart(2, "0") + ":" +
    String(curDate.getMinutes()).padStart(2, "0");
}

function isHidden(element) {
  return (element.parentElement.style.display == 'none');
}

var marginRightOffset = 15;

// Delay initialization so that LS has a chance to properly manage its UI before we start
window.setTimeout(function () {
  if (mainSurveyPageURL.test(location.href)) {
    MainPageInitiator.initialize();
  } else {
    SurveyDDGenerator.initialize();
  }
}, 10);
