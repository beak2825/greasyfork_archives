// ==UserScript==
// @name           Jira Cloud Backlog Sprint Swapper
// @description    This script adds additional posibility to move backlog sprints more than just one place up/down.
// @author         tteskac
// @namespace      tteskac
// @version    	   0.1.0
// @include        https://*.atlassian.net/secure/RapidBoard.*
// @downloadURL https://update.greasyfork.org/scripts/388064/Jira%20Cloud%20Backlog%20Sprint%20Swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/388064/Jira%20Cloud%20Backlog%20Sprint%20Swapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _menuVisible = false;

    setTimeout(function() {
        setInterval(function() {
            var sprintMenus = getElementsByClassName("js-sprint-actions-list", null, "div");
            var anyVisible = false;
            for(var i = 0; i < sprintMenus.length; i++) {
                var menu = sprintMenus[i];
                if (menu.parentNode.classList.contains("active")) {
                    anyVisible = true;
                    if (!_menuVisible) {
                        _menuVisible = true;
                        window._sprints = getSprintList();
                        var sprintId = menu.getElementsByTagName('a')[0].getAttribute('data-sprint-id');
                        console.log("menu visible, sprint id: " + sprintId);
                        for(var j = 0; j < window._sprints.length; j++) {
                            var sprint = window._sprints[j];
                            createNewMenuItem(menu, sprintId, sprint.id, sprint.name);
                        }
                    }
                }
            }
            // Reset
            if (!anyVisible) _menuVisible = false;

        }, 500);

    }, 1000);

})();

function getSprintList() {
    var sprintList = [];
    var sprintMenuButtons = getElementsByClassName("js-sprint-actions-trigger", null, "a");
    var sprintHeaders = getElementsByClassName("js-sprint-header", null, "div");
    console.log("total sprints:" + sprintMenuButtons.length);
    if (sprintMenuButtons.length !== sprintHeaders.length) {
        console.log("ERROR: sprint number doesn't match!");
        return;
    }
    for(var i = 0; i < sprintMenuButtons.length; i++) {
        var sprintId = sprintMenuButtons[i].getAttribute('data-sprint-id');
        var sprintName = getElementsByClassName("ghx-name", sprintHeaders[i], "div")[0].innerHTML;
        sprintList.push({id: sprintId, name: sprintName});
        console.log("sprint: " + sprintName + " [" + sprintId + "]");
    }
    return sprintList;
}

// Create visible UI element on Jira UI.
function createNewMenuItem(menu, thisSprintId, newSprintId, newSprintName) {
    if (thisSprintId == newSprintId) return;
    var entryUl = document.createElement('ul');
    entryUl.classList.add("aui-list-section");
    var entryLi = document.createElement('li');
    entryLi.classList.add("aui-list-item");

    var link = document.createElement("p");
    link.classList.add("aui-list-item-link");
    link.classList.add("js-sprint-action");
    link.innerHTML = "Move under '" + newSprintName + "'";
    link.setAttribute("title", newSprintName);
    link.onclick = function() { moveSprint(thisSprintId, newSprintId); };

    link.style.cursor = "pointer";
    link.onmouseover = function() { this.style.backgroundColor = "#f4f5f7"; };
    link.onmouseout = function() { this.style.backgroundColor = "white"; };

    entryLi.appendChild(link);
    entryUl.appendChild(entryLi);
    menu.appendChild(entryUl);
}

function moveSprint(thisId, newId) {
    console.log("old: "+thisId+", new: "+newId);

    var thisIndex = window._sprints.findIndex(sprint => {
        return sprint.id === thisId;
    });
    var newIndex = window._sprints.findIndex(sprint => {
        return sprint.id === newId;
    });

    console.log("thisIndex: " + thisIndex);
    console.log("newIndex: " + newIndex);

    var statusCode;
    if (thisIndex < newIndex) {
        for (var i = thisIndex; i < newIndex; i++) {
            console.log("swap: " + window._sprints[i].name + "-" + window._sprints[i+1].name);
            statusCode = makeSwapRequest(window._sprints[i].id, window._sprints[i+1].id);
            if (statusCode !== 200) {
                console.log("ERROR: status not 200, abort. Code: " + statusCode);
                return;
            }
            [window._sprints[i], window._sprints[i+1]] = [window._sprints[i+1], window._sprints[i]];
        }
    }
    if (thisIndex > newIndex) {
        for (var j = thisIndex; j > newIndex+1; j--) {
            statusCode = makeSwapRequest(window._sprints[j].id, window._sprints[j-1].id);
            if (statusCode !== 200) {
                console.log("ERROR: status not 200, abort. Code: " + statusCode);
                return;
            }
            [window._sprints[j], window._sprints[j-1]] = [window._sprints[j-1], window._sprints[j]];
        }
    }
    // Refresh the page to show results.
    location.reload();
}

function makeSwapRequest(id1, id2) {
    var request = new XMLHttpRequest();
    //request.open('POST', '/rest/agile/1.0/sprint/' + id1 + '/swap', false);
    request.open('PUT', '/rest/greenhopper/1.0/sprint/' + id1 + '/swap', false);
    request.setRequestHeader('Content-Type', 'application/json');
    //request.send(JSON.stringify({"sprintToSwapWith": id2}));
    request.send(JSON.stringify({"otherSprintId": id2}));
    return request.status;
}

// Helper
function getElementsByClassName(classname_, node, tagName) {
    tagName=(typeof(tagName) === 'undefined')?"*":tagName;
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var classes = classname_.split(',');

    for(var cid in classes) {
        var classname = classes[cid];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName(tagName);
        for(var i=0,j=els.length; i<j; i++) {
            if(re.test(els[i].className))a.push(els[i]);
        }
    }

    return a;
}
