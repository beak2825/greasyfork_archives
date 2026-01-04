// ==UserScript==
// @name         统计子任务估点
// @namespace    AmountStoryPointsOfSubTasks.user.js
// @version      1.3
// @description  统计Spring中每个用户故事所有子任务的总估点数
// @author       RichieMay
// @match        http://jira.iot.kundeyt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413423/%E7%BB%9F%E8%AE%A1%E5%AD%90%E4%BB%BB%E5%8A%A1%E4%BC%B0%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/413423/%E7%BB%9F%E8%AE%A1%E5%AD%90%E4%BB%BB%E5%8A%A1%E4%BC%B0%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function watchTreeChanged(targetTree, targetClassNames, callback) {
        new MutationObserver(function(mutations, observer) {
            callback(mutations, observer, targetClassNames);
        }).observe(targetTree, {subtree: true, childList: true});
    }

    function analyseSprint(sprintDocument) {
        let stories = sprintDocument.querySelectorAll("div[data-issue-id]");
        stories.forEach(function(story) {
            amountStoryPointOfSubTasks(story);
        });
    }

    function amountStoryPointOfSubTasks(storyDocument) {
        let baseURL = new URL(storyDocument.baseURI);
        $.ajax({ url: "/rest/greenhopper/1.0/xboard/issue/details.json",
                data:{ rapidViewId: baseURL.searchParams.get("rapidView"), issueIdOrKey: storyDocument.getAttribute("data-issue-id"), loadSubtasks: true, ts: new Date().getTime()},
                success: function(responseData){
                    responseData.tabs.defaultTabs.forEach(function(tab){
                        if (tab.tabId === 'SUB_TASKS') {
                            let storyPointOfSubTasks = 0;
                            tab.subtaskEntries.forEach(function(entry){
                                storyPointOfSubTasks += getStoryPointOfSubTask(entry.id);
                            });

                            if (storyPointOfSubTasks !== 0) {
                                let auiBadge = document.createElement('aui-badge');
                                auiBadge.className = 'ghx-statistic-badge';
                                auiBadge.style.background = "darkgray";
                                auiBadge.innerHTML = storyPointOfSubTasks;

                                storyDocument.getElementsByClassName('ghx-end ghx-estimate')[0].appendChild(auiBadge);
                            }
                        }
                    });
               }
              });
    }

    function getStoryPointOfSubTask(subTaskId) {
        var storyPoint = 0;
        $.ajax({url: "/secure/AjaxIssueEditAction!default.jspa",
                async: false,
                data: {decorator: "none", issueId: subTaskId, ts: new Date().getTime()},
                success: function(responseData){
                    responseData.fields.forEach(function(field){
                        if (field.label === 'Story Point') {
                            let storyPointTree = new DOMParser().parseFromString(field.editHtml, 'text/html');
                            storyPoint = Number(storyPointTree.getElementById(field.id).value);
                        }
                    });
                }});

        return storyPoint;
    }

    function getTargetNodesByClassName(mutations, targetClassNames) {
        let targetNodes = [];
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(addNode) {
                targetClassNames.forEach(function(targetClassName) {
                    if (-1 != addNode.className.indexOf(targetClassName)) {
                        targetNodes.push(addNode);
                    }
                });
            });
         });

        return targetNodes;
    }

    watchTreeChanged(document.getElementById('gh'), ['ghx-sprint-active', 'ghx-sprint-planned'], function(mutations, observer, targetClassNames) {
        getTargetNodesByClassName(mutations, targetClassNames).forEach(function(targetNode) {
            observer.disconnect();
            analyseSprint(targetNode);

            watchTreeChanged(targetNode, ['ghx-meta'], function(mutations, observer, targetClassNames) {
                getTargetNodesByClassName(mutations, targetClassNames).forEach(function(targetNode) {
                    analyseSprint(targetNode);
                });
            });
        });
    });
})();