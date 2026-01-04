// ==UserScript==
// @name                美化Jenkins
// @name:zh-CN          美化Jenkins
// @name:en             Beautify Jenkins
// @description         美化Jenkins，仅供SAP内部使用。
// @description:zh-CN   美化Jenkins，仅供SAP内部使用。
// @description:en      Beautify Jenkins. Only for SAP internal using.
// @namespace           https://github.com/HaleShaw
// @version             1.1.1
// @author              HaleShaw
// @copyright           2020, HaleShaw http://www.jianwudao.com
// @homepageURL         https://github.com/HaleShaw/TM-BeautifyJenkins
// @supportURL          https://github.com/HaleShaw/TM-BeautifyJenkins/issues
// @contributionURL     http://www.jianwudao.com
// @icon                https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/static/7ce2b5b0/favicon.ico
// @require             https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @require             https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @match               https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/*
// @exclude             https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/pluginManager/
// @exclude             https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/updateCenter/
// @connect             prod-build10300.wdf.sap.corp
// @license             AGPL-3.0-or-later
// @compatible	        Chrome
// @run-at              document-idle
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389460/%E7%BE%8E%E5%8C%96Jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/389460/%E7%BE%8E%E5%8C%96Jenkins.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author              HaleShaw
// @collaborator        HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const hideStyle = `
  /* 隐藏管理界面消息 */
  .manage-messages {
    display: none !important;
  }

  /* 隐藏右上角AutoRefresh */
  #right-top-nav {
    display: none !important;
  }

  /* 隐藏右上角搜索框 */
  .searchbox.hidden-xs {
    display: none !important;
  }

  /* 隐藏顶部分支名称 */
  .job-index-headline.page-headline,
  #pipeline-box>h2 {
    display: none !important;
  }

  /* 隐藏历史列表右侧悬浮菜单 */
  #buildHistoryPageNav {
    display: none !important;
  }

  /* 隐藏RSS标签 */
  #buildHistory>div:nth-child(3),
  .dashboard>div:nth-child(3) {
    display: none !important;
  }

  /* 隐藏页脚 */
  footer,
  .permalinks-header,
  .permalinks-list {
    display: none !important;
  }
  `;

  GM_addStyle(hideStyle);
  changeTile();
  addHeaderButton();
  hideLeftTasks();
  hideRightStatic();
  addToolButton();
  addToolButtonFront();
  replaceStr();
  addToolButtonPeriodically();
  optimizeE2ELog();

  function addToolButtonPeriodically() {
    var timerId = setInterval(() => {
      let timeDiv = document.querySelector('div[time]');
      if (timeDiv.nextSibling.children.length > 1) {
        if (timeDiv.children.length == 2) {
          timeDiv.children[1].remove();
          addToolButtonSingle(timeDiv);
          addToolButtonFront();
        }
      }
    }, 5000);
  }

  /**
   * Add button in the front.
   */
  function addToolButtonFront() {
    let timeDiv = document.querySelector('div[time]');
    var parentEle = timeDiv.parentElement.parentElement.previousSibling.firstElementChild;
    parentEle.innerHTML = "";
    parentEle.style.textAlign = "center";
    parentEle.style.fontWeight = "bold";

    const hrefReal = timeDiv.children[0].href;

    parentEle.appendChild(createJobButton(hrefReal));
    parentEle.appendChild(createAConsole(hrefReal));
    parentEle.appendChild(createATextLog(hrefReal));
    parentEle.appendChild(createABlueOcean(hrefReal));

    var consoleTextUrl = hrefReal + "consoleText";
    addConsoleButton(consoleTextUrl, parentEle);

    // 如果当前任务正在执行，才添加abort按钮
    if (timeDiv.nextSibling.children.length > 1) {
      parentEle.appendChild(createAAbort(hrefReal));
    }
  }

  function addToolButton() {
    let allTimes = document.querySelectorAll('div[time]');
    for (let i = 0; i < allTimes.length; i++) {
      let item = allTimes[i];
      addToolButtonSingle(item);
    }
  }

  /**
   * Add button for each line.
   * @param {Object} timeDiv timeDiv.
   */
  function addToolButtonSingle(timeDiv) {
    formatTime(timeDiv);
    addToolButtonAfter(timeDiv);
  }

  /**
   * Format time.
   * @param {Object} timeDiv timeDiv.
   */
  function formatTime(timeDiv) {
    timeDiv.children[0].textContent = dateFormat("yyyy-MM-dd HH:mm", new Date(+timeDiv.getAttribute('time')));
    timeDiv.children[0].target = "_blank";

    // 调整宽度
    timeDiv.style.width = "59%";
    timeDiv.previousSibling.style.width = "21%";
    timeDiv.nextSibling.style.width = "20%";
  }

  /**
   * Add button after the time.
   * @param {Object} timeDiv timeDiv.
   */
  function addToolButtonAfter(timeDiv) {
    const hrefReal = timeDiv.children[0].href;
    // const projectName = hrefReal.split("SelfBilling/job/")[1].split("/")[0];

    // Append Child to div
    timeDiv.appendChild(createAConsole(hrefReal));
    timeDiv.appendChild(createATextLog(hrefReal));
    timeDiv.appendChild(createABlueOcean(hrefReal));
  }

  // 添加其他自定义按钮：xMake日志，Mta文件，部署日志
  async function addConsoleButton(consoleTextUrl, parentEle) {
    let log = await doGet(consoleTextUrl);
    if (log != undefined && log != null && log != "") {
      createXMake(log, parentEle);
      createMta(log, parentEle);
      createDeploy(log, parentEle);
      log = null;
    }
  }

  function createJobButton(url) {
    let aJob = document.createElement("a");
    aJob.href = url;
    const hrefArr = url.split("/");
    aJob.text = "#" + hrefArr[hrefArr.length - 2];
    aJob.target = "_blank";
    return aJob;
  }

  // 创建xMake按钮
  async function createXMake(log, parentEle) {
    const conText = "Remote build URL: ";
    const xMakeIndex = log.indexOf(conText);
    if (xMakeIndex != -1) {
      var longRes = log.substr(xMakeIndex + conText.length, 150);
      var remoteJobURL = longRes.split("\n")[0];
      const xMakeHost = remoteJobURL.split("/")[2];
      let xMakeHtml = await doGet(remoteJobURL);
      const xMakeJobURL = $($(xMakeHtml).find("#main-panel").find("ul")[0]).find("li").find("a")[1].getAttribute("href");
      xMakeHtml = null;
      if (xMakeJobURL != undefined && xMakeJobURL != "") {
        const xMakeURL = "https://" + xMakeHost + xMakeJobURL + "consoleText";
        // Create A xMake
        var aXMake = document.createElement("a");
        var hrefXMake = xMakeURL;
        aXMake.href = hrefXMake;
        aXMake.target = "_blank";
        aXMake.style.marginLeft = "2px";

        // Create IMG xMake
        var imgXMake = document.createElement("img");
        imgXMake.src = "/static/4dda255b/images/24x24/notepad.png";
        imgXMake.style.width = "20px";
        imgXMake.style.height = "20px";
        imgXMake.title = "xMake Log";

        aXMake.appendChild(imgXMake);
        parentEle.appendChild(aXMake);
      }
    }
  }

  // 创建Mta按钮
  function createMta(response, parentEle) {
    var mtarText = "curl --insecure --silent --show-error --write-out";
    var mtarIndex = response.indexOf(mtarText);
    if (mtarIndex != -1) {
      var mtarRes = response.substr(mtarIndex, 600);
      var hrefMtar = mtarRes.split("\n")[0].split(".mtar ")[1];

      // Create A Mtar
      var aMtar = document.createElement("a");
      aMtar.href = hrefMtar;
      aMtar.style.marginLeft = "2px";

      // Create IMG Mtar
      var imgMtar = document.createElement("img");
      imgMtar.src = "/static/1a925db4/images/24x24/save.png";
      imgMtar.style.width = "20px";
      imgMtar.style.height = "20px";
      imgMtar.title = "Mtar File";

      aMtar.appendChild(imgMtar);
      parentEle.appendChild(aMtar);
    }
  }

  //创建Deploy log按钮
  function createDeploy(response, parentEle) {
    var deployText = "Deploying in org ";
    var deployIndex = response.indexOf(deployText);
    if (deployIndex != -1) {
      var deployEndText = " to download the logs of the process.";
      var deployEndIndex = response.indexOf(deployEndText);
      var deployMsg = response.substring(deployIndex, deployEndIndex + 37);

      // Create A Deploy
      var aDeploy = document.createElement("a");
      aDeploy.id = "aDeploy";
      aDeploy.href = "javascript:void(0);";
      aDeploy.setAttribute("onclick", "javascript:document.getElementById('modal').style.display = 'block'; document.getElementById('back').style.display = 'block';");
      aDeploy.style.marginLeft = "1px";

      // Create IMG Deploy
      var imgDeploy = document.createElement("img");
      imgDeploy.src = "/static/b7e59525/images/24x24/search.png";
      imgDeploy.style.width = "20px";
      imgDeploy.style.height = "20px";
      imgDeploy.title = "Deploy Log";

      var modal = document.createElement("div");
      modal.setAttribute("id", "modal");
      modal.style.width = "80%";
      modal.style.height = "80%";
      modal.style.opacity = "0.8";
      //modal.style.maxHeight = "80%";
      modal.style.position = "fixed";
      modal.style.top = "7%";
      modal.style.left = "10%";
      modal.style.backgroundColor = "#fff";
      modal.style.zIndex = "100000";
      modal.style.display = "none";

      var back = document.createElement("div");
      back.setAttribute("id", "back");
      back.style.width = "100%";
      back.style.height = "100%";
      back.style.position = "fixed";
      back.style.top = "0";
      back.style.left = "0";
      back.style.background = "rgba(0, 0, 0, .5)";
      back.style.zIndex = "99999";
      back.style.display = "none";

      var titleP = document.createElement("p");
      titleP.style.textAlign = "right";
      titleP.style.margin = "0 0 0 0";
      titleP.style.backgroundColor = "#D5E8C1";
      titleP.style.height = "20px";

      var titleSpan = document.createElement("span");
      titleSpan.textContent = "Deploy log";
      titleSpan.style.fontWeight = "bold";
      titleSpan.style.position = "fixed";
      titleSpan.style.left = "10%";

      var closeSpan = document.createElement("span");
      closeSpan.setAttribute("id", "closeSpan");
      closeSpan.style.color = "#fff";
      closeSpan.style.padding = "0 5px 0 5px";
      closeSpan.style.width = "20px";
      closeSpan.style.height = "20px";

      titleP.append(titleSpan);
      titleP.append(closeSpan);

      var textP = document.createElement("pre");
      textP.setAttribute("id", "textP");
      textP.innerHTML = deployMsg;

      var textDiv = document.createElement("div");
      textDiv.style.height = "calc(100% - 20px)";
      textDiv.style.overflow = "auto";
      textDiv.append(textP);

      modal.append(titleP);
      modal.append(textDiv);

      aDeploy.appendChild(imgDeploy);
      parentEle.appendChild(aDeploy);

      document.body.append(back);
      document.body.append(modal);

      closeSpan.onclick = function () {
        modal.style.display = "none";
        back.style.display = "none";
      };

      var closeSpanCss = "<style type='text/css'>#closeSpan:hover{background: #d9152c !important;}\n#closeSpan{position: relative; width: 20px; height: 20px; display: inline-block;}\n#closeSpan::before{content: ''; width: inherit; border-top: 1px solid #000; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%) rotate(45deg);}\n#closeSpan::after{content: ''; width: inherit; border-top: 1px solid #000; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%) rotate(-45deg);}\n</style>";
      document.head.innerHTML = document.head.innerHTML.concat(closeSpanCss);
    }
  }

  // 创建A标签：Console
  function createAConsole(url) {
    var aConsole = document.createElement("a");
    aConsole.href = url + "console";
    aConsole.target = "_blank";
    aConsole.style.marginLeft = "2px";

    // Create IMG Console
    var imgConsole = document.createElement("img");
    imgConsole.src = "/static/51568324/images/24x24/terminal.png";
    imgConsole.style.width = "20px";
    imgConsole.style.height = "20px";
    imgConsole.title = "Console Log";

    aConsole.appendChild(imgConsole);
    return aConsole;
  }

  // 创建A标签：TextLog
  function createATextLog(url) {
    var aTextLog = document.createElement("a");
    aTextLog.href = url + "consoleText";
    aTextLog.target = "_blank";
    aTextLog.style.marginLeft = "1px";

    // Create IMG TextLog
    var imgTextLog = document.createElement("img");
    imgTextLog.src = "/static/4dda255b/images/24x24/document.png";
    imgTextLog.style.width = "20px";
    imgTextLog.style.height = "20px";
    imgTextLog.title = "Console Text";

    aTextLog.appendChild(imgTextLog);
    return aTextLog;
  }

  // 创建A标签：BlueOcean
  function createABlueOcean(url) {
    var hrefs = url.split("SelfBilling/job/")[1].split("/");
    var hrefBlueOcean = "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/blue/organizations/jenkins/SelfBilling%2F" + hrefs[0] + "/detail/" + hrefs[2] + "/" + hrefs[3];

    // Create A BlueOcean
    var aBlueOcean = document.createElement("a");
    aBlueOcean.href = hrefBlueOcean;
    aBlueOcean.target = "_blank";
    aBlueOcean.style.marginLeft = "1px";

    // Create IMG BlueOcean
    var imgBlueOcean = document.createElement("img");
    imgBlueOcean.src = "/static/51568324/plugin/blueocean-rest-impl/images/48x48/blueocean.png";
    imgBlueOcean.style.width = "20px";
    imgBlueOcean.style.height = "20px";
    imgBlueOcean.title = "Blue Ocean";

    aBlueOcean.appendChild(imgBlueOcean);
    return aBlueOcean;
  }

  // 创建A标签：Abort
  function createAAbort(url) {
    // Create A Abort
    var aAbort = document.createElement("a");
    aAbort.setAttribute("id", "aAbort");
    aAbort.href = "javascript:void(0);";
    aAbort.setAttribute("onclick", "javascript:var xhrPost = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp'); xhrPost.open('POST', '" + url + "stop', true); xhrPost.send();");
    aAbort.style.marginLeft = "2px";

    // Create IMG Abort
    var imgAbort = document.createElement("img");
    imgAbort.src = "/static/b7e59525/images/16x16/stop.png";
    imgAbort.style.width = "20px";
    imgAbort.style.height = "20px";
    imgAbort.title = "Abort";

    aAbort.appendChild(imgAbort);
    return aAbort;
  }

  //修改页面标题
  function changeTile() {
    var url = window.location.href;
    if (url.indexOf("com.sap.cf.sales.self.billing.") != -1) {
      var urlSuffix = url.split("com.sap.cf.sales.self.billing.")[1];
      var projectName = urlSuffix.split("/")[0];
      var title = document.title;
      var branchName = "";
      if (title.indexOf(" [SelfBilling") != -1) {
        branchName = title.split(" [SelfBilling")[0];
      }
      else if (urlSuffix.indexOf("job") != -1 || urlSuffix.indexOf("detail") != -1) {
        if (urlSuffix.split("/")[3] != null && urlSuffix.split("/")[3] != "") {
          branchName = urlSuffix.split("/")[2] + "-" + urlSuffix.split("/")[3];
        }
        else {
          branchName = urlSuffix.split("/")[2];
        }
      }
      document.title = projectName + " " + branchName;
    }
  }

  //添加顶部工具按钮
  function addHeaderButton() {
    if (isValidById("visible-am-container")) {
      document.getElementById("visible-am-container").innerHTML = "";
      let aSelfBilling = createHeaderBtn("SelfBilling", "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/job/SelfBilling");
      let aManage = createHeaderBtn("Manage", "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/manage");
      let aPluginManager = createHeaderBtn("PluginManager", "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/pluginManager");
      let aCredentials = createHeaderBtn("Credentials", "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/credentials");
      let aSecurity = createHeaderBtn("Security", "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/configureSecurity");

      document.getElementById("visible-am-container").appendChild(aManage);
      document.getElementById("visible-am-container").appendChild(aSelfBilling);
      document.getElementById("visible-am-container").appendChild(aPluginManager);
      document.getElementById("visible-am-container").appendChild(aCredentials);
      document.getElementById("visible-am-container").appendChild(aSecurity);
    }
  }

  /**
   * create the button on the header.
   * @param {String} title button title.
   * @param {String} url button url.
   */
  function createHeaderBtn(title, url) {
    let btn = document.createElement("a");
    btn.text = title;
    btn.href = url;
    btn.target = "_blank";
    btn.style.textDecoration = "none";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "14px";
    btn.style.lineHeight = "40px";
    btn.style.display = "inline-block";
    btn.style.color = "#fff";
    btn.style.marginLeft = "15px";
    return btn;
  }

  //隐藏左侧菜单列表
  function hideLeftTasks() {
    if (isValidByClassName("task")) {
      const hideList = ["Up", "返回到项目", "Status", "状态", "Changes", "变更历史", "编辑构建信息", "No Tags", "Git Build Data", "打开 Blue Ocean", "从指定阶段重新运行", "Embeddable Build Status", "回放", "流水线语法", "流水线步骤", "上次构建", "下一次构建", "Workspaces"];
      const tasks = document.getElementsByClassName("task");
      [...tasks].forEach(task => {
        const aText = task.children[1].text;
        if (hideList.include(aText)) {
          task.style.display = 'none';
        }
      });
    }
  }

  //隐藏右侧静态检查结果
  function hideRightStatic() {
    var isStage = checkStageView();
    if (isValidById("main-panel") && isStage) {
      var children = document.getElementById("main-panel").childNodes;
      for (var i = 0; i < children.length; i++) {

        // 隐藏右侧静态检查结果
        if ("DIV" == children[i].tagName) {
          if ("description" == children[i].id || "cbwf-stage-view" == children[i].className || "dashboard" == children[i].className || "scheduleRestartBlock" == children[i].id || "back" == children[i].id || "modal" == children[i].id) {
            continue;
          }
          children[i].style.display = 'none';
        }

        // 隐藏最后一次成功结果表格
        else if ("TABLE" == children[i].tagName && "log" != children[i].id) {
          if ("" == children[i].className) {
            children[i].style.display = 'none';
          }
        }

        // 隐藏标题分支名称
        else if ("H1" == children[i].tagName) {
          if ("job-index-headline page-headline" == children[i].className && children[i].innerText.startsWith("分支")) {
            children[i].style.display = 'none';
          }
        }
      }

      // 隐藏工程分支名称
      if (3 == children[2].nodeType) {
        children[2].textContent = "";
      }
    }
  }

  //检查是否是Stage页面
  function checkStageView() {
    var url = window.location.href;
    var isStage = false;
    if (url.endsWith("/")) {
      url = url.substring(0, url.length - 1);
    }
    if (url.indexOf("job") != -1) {
      var urlArr = url.split("job");
      if (urlArr.length == 4) {
        var urlLastArr = urlArr[3].split("/");
        if (urlLastArr.length == 2) {
          isStage = true;
        }
      }
    }
    return isStage;
  }

  /**
   * Do http get request and return the response.
   * @param {String} url url.
   */
  function doGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function (res) {
          if (res.status === 200) {
            resolve(res.response);
          } else {
            console.warn('Get ' + url + ' Failed! Status: ' + res.status);
            console.debug(res);
          }
        },
        onerror: function (err) {
          console.error('Get ' + url + ' Failed! Status: ' + err.status);
          console.debug(err);
        }
      });
    });
  }

  //替换页面所有A标签中的文字
  function replaceStr() {
    var as = document.getElementsByTagName("a");
    var rpStr = "part of SelfBilling » com.sap.cf.sales.self.billing.";
    var rpStrShort = "SelfBilling » com.sap.cf.sales.self.billing.";
    var rpStrGroup = "com.sap.cf.sales.self.billing.";
    for (var i = 0; i < as.length; i++) {
      var str = as[i].text;
      if (str.indexOf(rpStr) != -1) {
        str = str.replace(rpStr, "");
        as[i].text = str;
      } else if (str.indexOf(rpStrShort) != -1) {
        str = str.replace(rpStrShort, "");
        as[i].text = str;
      } else if (str.indexOf(rpStrGroup) != -1) {
        str = str.replace(rpStrGroup, "");
        as[i].text = str;
      }
      if (as[i].id != "aDeploy" && as[i].id != "aAbort" && as[i].className != "collapse") {
        as[i].target = "_blank";
      }
    }
  }

  /**
   * Optimize the log of E2E.
   */
  function optimizeE2ELog() {
    const e2eUrlPrefix = "https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/job/SelfBilling/job/com.sap.cf.sales.self.billing.etecase/job/master/";
    const consoleUrlSuffix = "consoleText";
    const tableMark = "┘";
    const errorMark = "----------------------------------------------------------";
    const pipelineErrMark = "[Pipeline] error";
    const failure = "FAILURE\n";
    const newmanMark = "] newman";
    const logTip = "Log has been Optimized!\n";
    const URL = window.location.href;

    // Ensure this page is the consoleLog page of E2E.
    if (URL.startsWith(e2eUrlPrefix) && URL.endsWith(consoleUrlSuffix)) {

      // Ensure there's the 'pre' DOM of the logs.
      if (document.getElementsByTagName("pre") && document.getElementsByTagName("pre")[0]) {
        let logs = document.getElementsByTagName("pre")[0].textContent;
        const logArr = logs.split(tableMark);
        const count = logArr.length - 1;

        // If there're more than 1 case, then optimize it.
        if (count > 1) {
          logs = logArr[count - 1] + tableMark + logArr[count];

          // Remove the redundant log at the front.
          if (logs.indexOf(newmanMark) != -1) {
            logs = logs.split(newmanMark)[1].slice(1);
            const frontIndex = logs.indexOf("\n");
            logs = logs.slice(frontIndex + 1);
          }

          // If it failed, then optimize further.
          if (logs.endsWith(failure)) {
            // Remove the redundant log at the end.
            if (logs.indexOf(errorMark) != -1) {
              logs = logs.split(errorMark)[0];
              if (logs.indexOf(pipelineErrMark) != -1) {
                logs = logs.split(pipelineErrMark)[0];
                const endIndex = logs.lastIndexOf("\n");
                logs = logs.slice(0, endIndex - 1);
              }
            }
          }
          logs = logTip + logs;
          document.getElementsByTagName("pre")[0].textContent = logs;
        }
      }
    }
  }
})();
