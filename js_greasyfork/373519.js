// ==UserScript==
// @name         SIMConnect Download Helper
// @version      1.4
// @namespace    https://simconnect.simge.edu.sg/
// @namespace    https://simconnect1.simge.edu.sg/
// @description  Adds a "Download All" button and selectable downloads
// @include      https://simconnect1.simge.edu.sg:444/psc/csprd*/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373519/SIMConnect%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373519/SIMConnect%20Download%20Helper.meta.js
// ==/UserScript==
(function () {
  'use strict';
  xhook.disable();
  var fileTimer = null;
  var fileDownload = [];
  var fileDownloadIdx = -1;
  var cmCheckboxes = [];
  var pyCheckboxes = [];
  var csprdId = document.URL.match(/csprd(\_*)(\d*)/);
  if (csprdId[2] == "") csprdId[2] = "0";

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link); //FIREFOX COMPATIBILITY
    link.click();
    document.body.removeChild(link);
  }

  function processDownloads() {
    if (!isLoaderInProcess()) {
      if (fileDownload.length != 0 && fileDownloadIdx < fileDownload.length) {
        xhook.enable();
        var submitAction_win = eval("submitAction_win" + csprdId[2]);
        var documentWin = eval("document.win" + csprdId[2]);
        submitAction_win(documentWin, fileDownload[fileDownloadIdx].name);
        fileDownloadIdx++;
      }
      else if (fileDownload.length != 0 && fileDownloadIdx >= fileDownload.length) {
        fileDownload = [];
        fileDownloadIdx = -1;
        clearInterval(fileTimer);
      }
    }
  }

  xhook.after(function (request, response) {
    var match = response.text.match(/<GENSCRIPT id='onloadScript'><!\[CDATA\[window.open.*<\/GENSCRIPT>/);
    if (match != null) {
      var fileLink = match[0].slice(51, match[0].indexOf("','','');]]></GENSCRIPT>"));
      var fileName = fileLink.slice(fileLink.lastIndexOf("/") + 1, fileLink.length);
      downloadURI(fileLink, fileName);
      response.text = response.text.replace(/<GENSCRIPT id='onloadScript'><!\[CDATA\[window.open.*<\/GENSCRIPT>/, '');
    }
    xhook.disable();
  });

  var modifyFileLinks = function (mutationsList, observer) {
    var checkbox;
    var cmLinks = document.querySelectorAll("a[id^=SM_CUSTOM_WRK_SM_VIEW]"); // Course Materials
    for (i = 0; i < cmLinks.length; i++) {
      cmLinks[i].setAttribute("onClick", "javascript:xhook.enable();cancelBubble(event);");
      if (cmLinks[i].parentNode.childElementCount <= 1) {
        checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "cmCheckbox" + i;
        checkbox.style = "vertical-align: middle;";
        cmCheckboxes.push(checkbox);
        cmLinks[i].parentNode.appendChild(checkbox);
      }
    }

    var pyLinks = document.querySelectorAll("a[id^=SM_CUSTOM_WRK_BUTTON2]"); // Past Year Exam Papers
    for (i = 0; i < pyLinks.length; i++) {
      pyLinks[i].setAttribute("onClick", "javascript:xhook.enable();cancelBubble(event);");
      if (pyLinks[i].parentNode.childElementCount <= 1) {
        checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "pyCheckbox" + i;
        checkbox.style = "vertical-align: middle;";
        pyCheckboxes.push(checkbox);
        pyLinks[i].parentNode.appendChild(checkbox);
      }
    }

    var div;
    //var div = document.getElementById("win" + csprdId[2] + "divSM_CRSE_MTS_VW$0");
    //if (div != null && document.getElementById("downloadAll1") == null) {
    if (cmLinks.length > 0 && document.getElementById("downloadAll1") == null) {
      observer.disconnect();
      var downloadAll1 = document.createElement('a');
      downloadAll1.onclick = function () {
        for (i = 0; i < cmCheckboxes.length; i++) {
          if (cmCheckboxes[i].checked) {
            fileDownload.push(cmCheckboxes[i].previousElementSibling);
            cmCheckboxes[i].checked = false;
          }
        }
        if (fileDownload.length == 0) fileDownload = cmLinks;
        fileDownloadIdx = 0;
        fileTimer = setInterval(processDownloads, 100);
      };
      downloadAll1.href = "javascript:;";
      downloadAll1.id = "downloadAll1";
      downloadAll1.className = "PSHYPERLINK";
      downloadAll1.appendChild(document.createTextNode('Download All'));
      div = cmLinks[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement; // To avoid DOM ID matching and increase compatibility
      div.appendChild(downloadAll1);
      observer.observe(targetNode, config);
    }

    // div = document.getElementById("win" + csprdId[2] + "divSM_PST_YR_XP_VW$0");
    // if (div != null && document.getElementById("downloadAll2") == null) {
    if (pyLinks.length > 0 && document.getElementById("downloadAll2") == null) {
      observer.disconnect();
      var downloadAll2 = document.createElement('a');
      downloadAll2.onclick = function () {
        for (i = 0; i < pyCheckboxes.length; i++) {
          if (pyCheckboxes[i].checked) {
            fileDownload.push(pyCheckboxes[i].previousElementSibling);
            pyCheckboxes[i].checked = false;
          }
        }
        if (fileDownload.length == 0) fileDownload = pyLinks;
        fileDownloadIdx = 0;
        fileTimer = setInterval(processDownloads, 100);
      };
      downloadAll2.href = "javascript:;";
      downloadAll2.id = "downloadAll2";
      downloadAll2.className = "PSHYPERLINK";
      downloadAll2.appendChild(document.createTextNode('Download All'));
      div = pyLinks[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement; // To avoid DOM ID matching and increase compatibility
      div.appendChild(downloadAll2);
      observer.observe(targetNode, config);
    }
  }

  var targetNode = document.documentElement;
  var config = {
    attributes: false,
    childList: true,
    subtree: true
  };
  var observer = new MutationObserver(modifyFileLinks);
  observer.observe(targetNode, config);
})();