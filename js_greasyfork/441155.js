// ==UserScript==
// @name         Jira story counter
// @namespace    https://github.com/RayWangQvQ/Ray.Tampermonkey/
// @version      0.1
// @description  Auto count sub-task stoty point
// @author       Ray
// @match        https://*/jira/*
// @icon         https://raw.githubusercontent.com/RayWangQvQ/Ray.Tampermonkey/main/JiraStoryCounter/jira-software_logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441155/Jira%20story%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/441155/Jira%20story%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setInterval(() => {
        var tableArray = [];
        //查找table
        function getParentTable(elem) {
            if (elem.tagName == "TABLE") {
                return elem;
            } else {
                return getParentTable(elem.parentElement);
            }
        }
        function findTable(array, item) {
            for (var i in array) {
                if (array[i].table === item) {
                    return array[i];
                }
            }
            return null;
        }
        var storyCellarray = document.getElementsByClassName("customfield_10006");
        for (var i in storyCellarray) {
            if (storyCellarray[i].innerText) {
                var table = getParentTable(storyCellarray[i]);
                var parentTable = findTable(tableArray, table);
                if (parentTable) {
                    parentTable.data.push(parseFloat(storyCellarray[i].innerText || 0));
                } else {
                    tableArray.push({
                        table: table,
                        data: [parseFloat(storyCellarray[i].innerText || 0)]
                    });
                }
            }
        }
        var thArray = document.getElementsByClassName("colHeaderLink sortable headerrow-customfield_10006");
        //fill sum result
        for (var i in tableArray) {
            var sum = 0;
            for (var count in tableArray[i].data) {
                sum += tableArray[i].data[count];
            }
            thArray[i].innerText = "Story Point (" + sum + ")";
        }
    }, 3000);

})();
