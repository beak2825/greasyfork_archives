// ==UserScript==
// @name         TFS 2017 Helper
// @namespace    http://jonas.ninja
// @version      1.11.3
// @description  Adds handy functionality to TFS 2017
// @author       @_jnblog
// @match        https://*.visualstudio.com/**/_backlogs*
// @match        https://*.visualstudio.com/**/_versionControl*
// @match        https://*.visualstudio.com/**/_workitems*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/17142/TFS%202017%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17142/TFS%202017%20Helper.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global GM_addStyle */
/* jshint asi: true, multistr: true */

var $ = unsafeWindow.jQuery; // to access .data() that is set by TFS.
var cursorUrl = 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQxNS41ODIgNDE1LjU4MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDE1LjU4MiA0MTUuNTgyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQxMS40Nyw5Ni40MjZsLTQ2LjMxOS00Ni4zMmMtNS40ODItNS40ODItMTQuMzcxLTUuNDgyLTE5Ljg1MywwTDE1Mi4zNDgsMjQzLjA1OGwtODIuMDY2LTgyLjA2NCAgIGMtNS40OC01LjQ4Mi0xNC4zNy01LjQ4Mi0xOS44NTEsMGwtNDYuMzE5LDQ2LjMyYy01LjQ4Miw1LjQ4MS01LjQ4MiwxNC4zNywwLDE5Ljg1MmwxMzguMzExLDEzOC4zMSAgIGMyLjc0MSwyLjc0Miw2LjMzNCw0LjExMiw5LjkyNiw0LjExMmMzLjU5MywwLDcuMTg2LTEuMzcsOS45MjYtNC4xMTJMNDExLjQ3LDExNi4yNzdjMi42MzMtMi42MzIsNC4xMTEtNi4yMDMsNC4xMTEtOS45MjUgICBDNDE1LjU4MiwxMDIuNjI4LDQxNC4xMDMsOTkuMDU5LDQxMS40Nyw5Ni40MjZ6IiBmaWxsPSIjMmQ5ZTFlIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==), auto !important'
var container = $('<div class="ijg-copyButtons">')
var button = $('<button class="ijg-copyButton">')
var colorMap = {'rgb(0, 156, 204)'  : 'pbi',
                'rgb(204, 41, 61)'  : 'bug',
                'rgb(242, 203, 29)' : 'task',
                'rgb(119, 59, 147)' : 'feature'}

//waitForKeyElements("div.tab-page[rawtitle=Links]", changeDialogBorderColor, false)
waitForKeyElements(".workitem-dialog", changeDialogBorderColor, false)
waitForKeyElements(".work-item-form", addTaskIdCopyUtilities, false)
$(document).on('click', '.ijg-js-copyButton', copy)



function changeDialogBorderColor(workitemDialog) {
  // color the border of the modal depending on the type of work item (PBI, Feature, Task, or Bug)

  var dialog = $(workitemDialog)
  var borderColor = dialog.find('.work-item-form-main-header').css('border-left-color')
  var itemType = colorMap[borderColor]

  if (itemType === 'pbi') {
    dialog.css({'border-color': borderColor,
                'box-shadow'  : '#91c3d2 0 0 30px 8px'})
  } else if (itemType === 'bug') {
    dialog.css({'border-color': borderColor,
                'box-shadow':   '#a15d5d 0 0 30px 8px'})
  } else if (itemType === 'feature') {
    dialog.css({'border-color': borderColor,
               'box-shadow':    '#ac80ac 0 0 30px 8px'})
  } else if (itemType === 'task') {
    dialog.css({'border-color': borderColor,
                'box-shadow'  : '#ddd3ae 0 0 30px 8px'})
  } else {
    setTimeout(function() {
      changeDialogBorderColor(workitemDialog)
    }, 100);
  }
}



function addTaskIdCopyUtilities(workItemForm) {
  var $workItemForm = $(workItemForm)
  if ($workItemForm.hasClass('ijg-tasksAdded')) {
    return
  }
  $workItemForm.addClass('ijg-tasksAdded')

  var $target = $workItemForm.find('.work-item-view')
  var id = $workItemForm.find('.work-item-form-id').text()
  var url = `${window.location.host}/${window.location.pathname.split("/")[1]}/_workitems?id=${id}`;
  var text = $workItemForm.find('.work-item-form-title input').val()
  var formattedUrl = '*' + text + '*\n' + url
  var commitMessage = makeCommitMessage(text)

  container.clone()
    .append(makeButton('ID', id))
    .append(makeButton('Link', formattedUrl))
    .append(makeButton('Commit Message', commitMessage))
  .prependTo($target)

  function makeCommitMessage(text) {
    // For tasks, remove the "dev: " prefix.
    text = text.replace(/^dev: */i, "")
    // Lowercase the first word if it's capitalized.
    if (text.length > 1 && text[0].toUpperCase() === text[0] && text[1].toLowerCase() === text[1]) {
      // first letter is uppercased and second is lowercased
      text = text[0].toLowerCase() + text.slice(1)
    }
    return text
  }

  function makeButton(text, copyText) {
    return button.clone()
      .text(text)
      .data('ijgCopyText', copyText)
      .addClass('ijg-js-copyButton')
  }
}



function copy(e) {
  $target = $(this)
  var copyText = $target.data('ijgCopyText')
  if (copyText === undefined || copyText === '') {
    // nothing to copy
    return
  }

  GM_setClipboard(copyText)
  displayResult($target)

  function displayResult($button) {
    var cursorClass = 'ijg-check'
    var highlightClass = 'isHighlighted'

    $button.addClass(cursorClass).addClass(highlightClass)
    setGreenCheckCursor()

    window.setTimeout(function() {
      $button.removeClass(highlightClass)
    }, 50)
    window.setTimeout(function() {
      $button.removeClass(cursorClass)
    }, 1500)
  }

  function setGreenCheckCursor() {
    /// from https://bugs.chromium.org/p/chromium/issues/detail?id=26723#c87
    if (document.body.style.cursor != cursorUrl) {
      var wkch = document.createElement("div");
      wkch.style.overflow = "hidden";
      wkch.style.position = "absolute";
      wkch.style.left = "0px";
      wkch.style.top = "0px";
      wkch.style.width = "100%";
      wkch.style.height = "100%";
      var wkch2 = document.createElement("div");
      wkch2.style.width = "200%";
      wkch2.style.height = "200%";
      wkch.appendChild(wkch2);
      document.body.appendChild(wkch);
      document.body.style.cursor = cursorUrl;
      wkch.scrollLeft = 1;
      wkch.scrollLeft = 0;
      document.body.removeChild(wkch);
    }
  }
}



;(function addStyles () {
  var modalStyle = '.workitem-dialog { \
    left: 10px !important;\
    top: 10px !important;\
    width: calc(100% - 28px) !important;\
    height: calc(100% - 26px) !important;\
    border: 4px solid grey;\
    box-shadow: gray 0 0 30px 8px;\
    box-sizing: border-box;\
  }\
  .workitem-dialog.ui-dialog.full-screen {\
    width: calc(100% - 8px) !important;\
    height: calc(100% - 8px) !important;\
  }\
  .workitem-dialog .ui-dialog-titlebar-progress-container {\
    margin: 0 !important;\
  }\
  .workitem-dialog .ui-resizable-handle {\
    display: none !important;\
  }'
  var uiDialogContentStyle = '.ui-dialog-content:not(.modal-dialog) {height: calc(100% - 51px) !important}'
  var otherStyles = '.work-item-view {\
    overflow: visible;\
  }\
  table.witform-layout {\
    width: calc(100% - 4px);\
  }\
  button {\
    transition: box-shadow 100ms;\
  }\
  button:focus {\
    background-color: #f8f8f8;\
    box-shadow: 0px 0px 0px 3px rgba(128, 128, 128, 0.4);\
  }\
  button:hover {\
    background-color: #fefefe;\
  }\
  button:active {\
    background-color: #e6e6e6;\
  }\
  button.changeset-identifier {\
    vertical-align: top;\
    line-height: 0;\
    padding: 0px 12px;\
    height: 22px;\
    margin-left: 8px;\
  }\
  .agile-content-container div.board-tile.ui-draggable,\
  #taskboard-table-body .ui-draggable {\
    transition: box-shadow 250ms;\
  }\
  .agile-content-container div.board-tile.ui-draggable:focus,\
  #taskboard-table-body .ui-draggable:focus {\
    box-shadow: 0px 0px 8px 2px rgb(25, 22, 6);\
    transition-delay: 50ms;\
    outline: none;\
  }\
  .taskboard-parent {\
    min-width: 154px;\
    width: 154px;\
  }\
  .taskboardTableHeaderScrollContainer .taskboard-parent {\
    min-width: 164px;\
  }\
  .ijg-check {\
    cursor: ' + cursorUrl + ';\
  }\
  .workitem-info-bar .info-text-wrapper{\
    overflow: visible !important;\
  }\
\
  .ui-dialog .ui-dialog-titlebar-close {\
    height: calc(100% + 1px);\
    transition: background-color 150ms;\
  }\
  .ui-dialog .ui-dialog-titlebar-close:hover {\
    background-color: rgba(232, 129, 129, 0.5) !important;\
  }\
  span.ui-button-icon-primary.ui-icon.ui-icon-closethick {\
    font-size: 20px;\
    background-image: initial !important;\
    text-indent: initial;\
  }\
\
  .ijg-copyButtons {\
    position: absolute;\
    font-size: 14px;\
    top: -20px;\
    left: 327px;\
    z-index: 1;\
  }\
  button.ijg-copyButton {\
    height: 26px;\
    margin-left: 16px;\
    transition: box-shadow 100ms, background-color 250ms 100ms linear;\
    transform: translateY(-2px);\
  }\
  .ijg-copyButton.isHighlighted {\
    transition-delay: 0s;\
    transition-duration: 0s;\
    background-color: rgba(160, 232, 151, 0.6);\
  }'

  var verticalCompactionStyles = '\
  .work-item-view legend {\
    display: none;\
  }\
  .ui-dialog .ui-dialog-buttonpane button {\
    margin: 0.3em .4em 0.3em 0;\
  }'

  var fixTfsGarbage = '\
  .work-item-form-main .work-item-form-main-header .work-item-form-toolbar-container .toolbar .menu-item {\
    padding: 5px 5px 3px 5px;\
  }'

  GM_addStyle(modalStyle)
  GM_addStyle(uiDialogContentStyle)
  GM_addStyle(otherStyles)
  GM_addStyle(verticalCompactionStyles)
  GM_addStyle(fixTfsGarbage)
})()



function waitForKeyElements(
  // CC BY-NC-SA 4.0. Author: BrockA
  selectorTxt, // Required: The jQuery selector string that specifies the desired element(s).
  actionFunction, // Required: The code to run when elements are found. It is passed a jNode to the matched element.
  bWaitOnce, // Optional: If false, will continue to scan for new elements even after the first match is found.
  iframeSelector // Optional: If set, identifies the iframe to search.
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined")
    targetNodes = $(selectorTxt);
  else
    targetNodes = $(iframeSelector).contents()
    .find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function() {
      var jThis = $(this);
      var alreadyFound = jThis.data('alreadyFound') || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound)
          btargetsFound = false;
        else
          jThis.data('alreadyFound', true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function() {
          waitForKeyElements(selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        },
        300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
