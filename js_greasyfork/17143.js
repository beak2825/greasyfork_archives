// ==UserScript==
// @name         TFS 2017 Changeset History Helper
// @namespace    http://jonas.ninja
// @version      1.8.0
// @description  Changeset reference utilities
// @author       @_jnblog
// @match        https://*.visualstudio.com/**/_versionControl*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/17143/TFS%202017%20Changeset%20History%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17143/TFS%202017%20Changeset%20History%20Helper.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global GM_addStyle */
/* jshint asi: true, multistr: true */

var $ = unsafeWindow.jQuery
var mergedChangesetRegex = /\(merge [^\)]* to QA\)/gi
var buttonTemplate = $('<button class="ijg-copyButton">')
var containerTemplate = $('<div class="ijg-copyButtons"></div>')
var urls = {
  changesetLinkedWorkItems: '/_apis/tfvc/changesets/{}/workItems',
  changesetInfo: '/_apis/tfvc/changesets/{}',
  apiVersion: '?api-version=1.0',
}

waitForKeyElements('.ms-DetailsRow', doEverything, false)
//waitForKeyElements(".vc-page-title[title^=Changeset]", addChangesetIdCopyUtilities, true)

//$(document).on('mouseenter', '.ms-DetailsRow', highlightHistoryResult)
//  .on('mouseleave', '.ms-DetailsRow', unhighlightHistoryResult)

function doEverything(historyResult) {
  historyResult = $(historyResult)
  spanifyText(historyResult)
  addCopyUtilities(historyResult)
}

function spanifyText(historyResult) {
  // wraps changeset/task IDs with spans so they can be targeted individually
  // adds data to the newly-created spans
  historyResult.find('.ms-Link').each(function() {
    // commit messages may have either Tasks (deprecated in November 2016) or Changesets
    $(this).html($(this).text().replace(/[ct]\d{3,}/gi, function(match) {
      var id = match.replace(/[ct]/gi, '')
      if (match.startsWith('t')) {
        historyResult.data('ijgTaskId', id)
        return '<span class="ijg-task-id" data-ijg-task-id="' + id + '">' + match + '</span>'
      }
      return '<span class="ijg-changeset-id" data-ijg-changeset-id="' + id + '">' + match + '</span>'
    }))
  })
  historyResult.find('.change-info').each(function() {
    // '.ms-DetailsRow's will only have changesets, and they will not be prefixed with 'c'
    $(this).html($(this).text().replace(/\d{3,}/gi, function(match) {
      var changesetId = match.replace(/c/i, '')
      return '<span class="ijg-changeset-id" data-ijg-changeset-id="' + changesetId + '">' + match + '</span>'
    }))
  })
}

function addCopyUtilities(historyResult) {
  var $container = containerTemplate.clone()
  var changesetId = historyResult.find('.ms-Link')[0].getAttribute('href').match(/\d+$/)[0]
  var url = historyResult.find('a.ms-Link').prop('href')
  var formattedUrl = '*Changeset ' + changesetId + ": " + historyResult.find('a.ms-Link').text() + '*\n' + url
  var message = createCommitMessage(historyResult, changesetId)

  $container
    .append(buttonTemplate.clone().text(changesetId)    .addClass('ijg-js-copyButton').data('ijgCopyText', changesetId))
    .append(buttonTemplate.clone().text('Link')         .addClass('ijg-js-copyButton').data('ijgCopyText', formattedUrl))
    .append(buttonTemplate.clone().text('Merge Message').addClass('ijg-js-copyButton').data('ijgCopyText', message))

  historyResult.find('.card-details-section').before($container)

  // after the ajax call returns, append task IDs to the button
  addTaskUtilities(historyResult, function(taskIds) {
    var thisTaskButton
    if (taskIds.length <= 0) {
      // no task IDs to add. Might as well just stop here.
      tasksIds = ''
      thisTaskButton = buttonTemplate.clone().html('&nbsp;').addClass('ijg-js-copyButton ijg-js-copyTask').css('width', 56)
      $container.find('button').last().before(thisTaskButton)
      return
    }

    taskIds = taskIds.reduce(function(prev, cur) {
      return prev + ', ' + cur
    })

    thisTaskButton = buttonTemplate.clone().text('Task IDs').addClass('ijg-js-copyButton ijg-js-copyTask').data('ijgCopyText', taskIds)
    $container.find('button').last().before(thisTaskButton)

    // merge "Task IDs" buttons vertically to group commits on the same task
    // first, store the data
    var idsKey = 'ijg-taskIds'
    var countKey = 'ijg-countMergeRows'
    historyResult.data(idsKey, taskIds).data(countKey, 1)
    // second, merge down if the row below already has taskIDs, and they are the same
    var next = historyResult.next()
    if (next.size() > 0 && next.data(idsKey) == taskIds) {
      // the next button matches this one. Merge into this one, and remove the next button
        var nextButton = next.find('.ijg-js-copyTask')
    }
  })
}

function addTaskUtilities(historyResult, callback) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: window.location.origin + urls.changesetLinkedWorkItems.replace('{}', historyResult.find('a.ms-Link')[0].getAttribute('href').match(/\d+$/)[0]) + urls.apiVersion,
    success: function(data) {
      var idArray = []
      if (data !== undefined && data.count > 0) {
        idArray = data.value.map(function(el) {
          return el.id
        })
      }
      callback.call(historyResult, idArray)
      createTaskContainer(historyResult, idArray)
    }
  })
}

function createTaskContainer(historyResult, idArray) {
  // makes a positioned div in the right place to hold Task info
    var container = $('<div class="ijg-tasks-container">')
    historyResult.append(container)
    idArray.forEach(function(taskId) {
      var $task = $('<div class=ijg-task-link>').data('ijgTaskId', taskId)
      var $link = $('<a target="_blank">')
        .text(taskId)
        .prop('href', window.location.origin + '/' + window.location.pathname.split('/')[1] + '/_workitems?id=' + taskId)
      container.append($task.append($link))
    })
    if (container[0].scrollHeight > container[0].offsetHeight) { // broken
      container.addClass('is-overflow')
    }
}

function addChangesetIdCopyUtilities(pageTitle) {
  var $pageTitle = $(pageTitle)

  if ($pageTitle.hasClass('added')) {
    return
  }
  $pageTitle.addClass('added')

  var id = $pageTitle.text().replace('Changeset ', '')
  var $copyLinkInput = $('<input value="' + id + '">').addClass('ijg-copy-changeset-page-link')

  $pageTitle.after($copyLinkInput)
}

function highlightHistoryResult(e) {
  var changeset = $(this).data('changeList')
  var changesetId = changeset.changesetId
  var tasks
  var mainHistoryResult = $('.result-details .change-info .ijg-changeset-id[data-ijg-changeset-id=' + changesetId + ']').closest('.ms-DetailsRow')
  var matchingChangesets = $('span.ijg-changeset-id[data-ijg-changeset-id="' + changesetId + '"]')

  if (matchingChangesets.size() > 1) {
    matchingChangesets.each(function() {
      var matchingChangesetId = $(this)
      matchingChangesetId.css('color', 'red').closest('.ms-DetailsRow').css('background-color', 'beige')
    })
    mainHistoryResult.css('background-color', '#D1D1A9')
  }
}
function unhighlightHistoryResult(e) {
  $('span.ijg-changeset-id').css('color', '').closest('.ms-DetailsRow').css('background-color', '')
}

function displayResult($cursorContainer) {
  var cursorClass = 'ijg-check'

  $cursorContainer.addClass(cursorClass)
  window.setTimeout(function() {
    $cursorContainer.removeClass(cursorClass)
  }, 1750)
  setGreenCheckCursor()
}

/**
  If `historyResult` is a jQuery object, expect it to contain changelist data.
  If it is a string, expect it to be a selector string that contains the full commit message.
*/
function createCommitMessage(historyResult, changesetId) {
  var optMessage  = historyResult.find('a.ms-Link').text().trim()

  if (optMessage.match(mergedChangesetRegex)) {
    // a changeset that's already merged to QA should merge to Release
    optMessage = optMessage.replace(mergedChangesetRegex, '(merge c' + changesetId + ' to Release)')
  } else {
    optMessage = '(merge c' + changesetId + ' to QA) ' + optMessage
  }
  return optMessage
}


;(function addStyles () {
  var styles = '\
  .ms-DetailsRow {\
    position: relative;\
  }\
  .ms-DetailsRow .ms-DetailsRow-cell {\
    width: 100% !important;\
  }\
  .ms-DetailsRow-fields {\
    width: calc(100% - 58px);\
  }\
  .avatar-image-card {\
    display: flex;\
  }\
  span.ijg-changeset-id { \
    border-bottom: 1px dotted #ccc; \
  } \
  div > span.ijg-changeset-id { \
    cursor: default; \
  } \
  .ijg-copyButtons { \
    margin-left: 13px;\
    position: static;\
  } \
  .result-details { \
    padding-left: 276px;\
  } \
  input.ijg-copy-changeset-page-link {\
    cursor: pointer;\
    text-align: center;\
    width: 80px;\
    margin: 0 16px;\
    border: 1px solid #ccc;\
    vertical-align: middle; \
  }\
  .change-link-container { \
    display: inline-block; \
  }\
  .ijg-tasks-container {\
    top: 0; \
    right: 0;\
    height: 100%;\
    overflow-y: auto;\
    padding: 4px 8px 4px;\
    position: absolute;\
  }\
  .ijg-tasks-container.is-overflow {\
    border-bottom: 2px dashed red;\
  }\
  .ijg-tasks-container.is-overflow:hover {\
    border: 1px solid;\
    overflow: visible;\
    background-color: white;\
    max-height: initial;\
    z-index: 1;\
  }\
  .ijg-check {\
    cursor: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQxNS41ODIgNDE1LjU4MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDE1LjU4MiA0MTUuNTgyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQxMS40Nyw5Ni40MjZsLTQ2LjMxOS00Ni4zMmMtNS40ODItNS40ODItMTQuMzcxLTUuNDgyLTE5Ljg1MywwTDE1Mi4zNDgsMjQzLjA1OGwtODIuMDY2LTgyLjA2NCAgIGMtNS40OC01LjQ4Mi0xNC4zNy01LjQ4Mi0xOS44NTEsMGwtNDYuMzE5LDQ2LjMyYy01LjQ4Miw1LjQ4MS01LjQ4MiwxNC4zNywwLDE5Ljg1MmwxMzguMzExLDEzOC4zMSAgIGMyLjc0MSwyLjc0Miw2LjMzNCw0LjExMiw5LjkyNiw0LjExMmMzLjU5MywwLDcuMTg2LTEuMzcsOS45MjYtNC4xMTJMNDExLjQ3LDExNi4yNzdjMi42MzMtMi42MzIsNC4xMTEtNi4yMDMsNC4xMTEtOS45MjUgICBDNDE1LjU4MiwxMDIuNjI4LDQxNC4xMDMsOTkuMDU5LDQxMS40Nyw5Ni40MjZ6IiBmaWxsPSIjMmQ5ZTFlIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==), auto !important;\
  }\
  button.ijg-copyButton {\
    margin-left: 8px;\
    margin-top: 10px;\
    padding: 2px 6px;\
    font-size: 12px;\
  }\
  .ijg-copyButton--extended {\
    vertical-align: top;\
    position: absolute;\
  }\
  .ijg-copyButton--extended + .ijg-copyButton {\
    margin-left: 72px;\
  }\
  .comments-indicator-container {\
    display: table-cell !important;\
    width: 28px;\
  }'

  var animationStyles = '\
  button.ijg-copyButton {\
    transition: box-shadow 100ms, background-color 250ms 100ms linear, width 400ms, opacity 400ms, padding 400ms;\
  }\
  .fade {\
    opacity: 0 !important;\
    width: 0 !important;\
    padding: 2px 0 !important;\
    margin-left: 0 !important;\
  }\
  .offset .fade {\
    opacity: 1 !important;\
    width: 41px !important;\
    padding: 2px 6px !important;\
    margin-left: 8px !important;\
  }\
  .offset .result-details {\
    transition: padding-left 400ms -35ms;\
  }'

  GM_addStyle(styles)
  //GM_addStyle(animationStyles)
})()




function waitForKeyElements(
  // CC BY-NC-SA 4.0. Author: BrockA
  selectorTxt,
  actionFunction,
  bWaitOnce
) {
  var targetNodes, btargetsFound;

  targetNodes = $(selectorTxt);
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
            bWaitOnce
          );
        },
        300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
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