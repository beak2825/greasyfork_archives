// ==UserScript==
// @name        Toggl-Button TeamWork
// @namespace   https://gitlab.paragon-es.de/toggl-button
// @version     1.2
// @include     http*://*.teamwork.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/2670-toggllibrary/code/TogglLibrary.js
// @resource    togglStyle https://gitlab.paragon-es.de/toggl-button/core/raw/master/TogglLibrary.css
// @description Toggle button for TeamWork
// @downloadURL https://update.greasyfork.org/scripts/10809/Toggl-Button%20TeamWork.user.js
// @updateURL https://update.greasyfork.org/scripts/10809/Toggl-Button%20TeamWork.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
  target = document.querySelector('#mainContent'),
  bodyTarget = document.querySelector('body'),
  stopTB, stopProcessed,
  config = { attributes: true, childList: true, characterData: true },
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        // TODO: if none of the mutations is a task, then remove the toggle element if visible.
        var task = document.querySelector('#Task');
        if (task !== null) {
          var tb = new TogglButtonGM('#Task', function (elem) {
            var taskDetail = document.querySelector('.taskDetailHolder');
            if (taskDetail !== null) {
              var taskID = taskDetail.id.substr(13),
                taskDetailTarget = taskDetail.querySelector('div'),
                taskDetailProcessed = false,
                innerObserver = new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList' && !taskDetailProcessed) {
                      var titleElem = document.querySelector('.taskDetailsName span');
                      if (titleElem !== null) {
                        innerObserver.disconnect();
                        taskDetailProcessed = true;
                        var tb = new TogglButtonGM('#Task', function (elem) {
                          var description, projectIds = [],
                            projectElem = document.querySelector('#projectName'),
                            linkElem = document.querySelector('#ViewTaskSidebar .blue2.ql');

                          description = taskID + " " + titleElem.textContent.trim();

                          if (projectElem !== null) {
                            projectIds.push(projectElem.textContent.trim());
                          }
                          if (linkElem !== null) {
                            projectIds.push(linkElem.textContent.trim());
                          }

                          return {
                            className: 'teamwork',
                            description: description,
                            projectIds: projectIds
                          };
                        });

                        document.querySelector('.startTimer button').addEventListener('click', function () {
                          tb.clickLinks();
                        });
                      }
                    }
                  });
                });
              innerObserver.observe(taskDetailTarget, config);
            }
          });
        }
      }
    });
  }),
  bodyObserver = new MutationObserver(function (mutations) {
    if (stopTB == null) {
      stopTB = new TogglButtonGM();
      stopProcessed = false;
    }
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        var stopElem = document.querySelector('#timerBar');
        if (stopElem !== null && !stopProcessed) {
          stopProcessed = true;
          stopElem.querySelector('.timer-log-time, .timer-body .btn-success').addEventListener('click', function () {
            stopTB.stopTimeEntry();
          });
        }
      }
    });
  });

observer.observe(target, config);
bodyObserver.observe(bodyTarget, config);
