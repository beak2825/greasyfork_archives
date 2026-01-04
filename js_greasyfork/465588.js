// ==UserScript==
// @name        TFS TaskBoard Resize
// @description Optimizes the column widths of a Visual Studio Team Foundation Server 2015 taskboard to minimize scrolling.
// @version     0.7
// @author      Amedeo Amato
// @license MIT
// @match       https://*.tfspreview.com/*/_backlogs*
// @match       https://*.tfspreview.com/*/_workitems*
// @match       https://*.tfspreview.com/*/_workItems*
// @match       http://*/tfs/*/_backlogs*
// @match       http://*/tfs/*/_workitems*
// @match       http://*/tfs/*/_workItems*
// @match       http://*/tfs2/*/_backlogs*
// @match       http://*/tfs2/*/_workitems*
// @match       http://*/tfs2/*/_workItems*
// @grant       none
// @namespace   https://greasyfork.org/users/302581
// @downloadURL https://update.greasyfork.org/scripts/465588/TFS%20TaskBoard%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/465588/TFS%20TaskBoard%20Resize.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
 
waitForTaskboardTableToLoad();
 
function waitForTaskboardTableToLoad() {
    var taskboardTable = document.getElementById("taskboard-table-body");
 
    if (!taskboardTable) {
        setTimeout(waitForTaskboardTableToLoad, 500);
    } else {
        resizeTaskboardColumns();
    }
}
 
function resizeTaskboardColumns() {
    var numberOfColumns = getNumberOfColumns();
    var optimalColumnWidths = calculateOptimalColumnWidth(numberOfColumns);
    setColumnWidths(optimalColumnWidths, numberOfColumns);
    minimizeDoneTasks(numberOfColumns);
    minimizeResolvedTasks(numberOfColumns);
    refreshTaskAlignment();
}
 
function calculateOptimalColumnWidth(numberOfColumns) {
    var taskboardCells = document.getElementsByClassName("taskboard-cell ui-droppable");
 
    // Find the biggest cell in each column, by finding the maximal total height of tasks boxes per cell
    const totalTaskHeightPerColumn = Array(numberOfColumns).fill(0);
    Array.from(taskboardCells).forEach((cell, i) => {
        const colNr = i % numberOfColumns;
        const divsInCell = cell.getElementsByClassName("childTbTile");
        const totalHeight = [...divsInCell].reduce((sum, div) => sum + div.offsetHeight, 0);
        totalTaskHeightPerColumn[colNr] = Math.max(totalTaskHeightPerColumn[colNr], totalHeight);
    });
 
    // Reduce last "Resolved and Done" column, because it's not important
    totalTaskHeightPerColumn[numberOfColumns - 1] /= 3.5;
    totalTaskHeightPerColumn[numberOfColumns - 2] /= 1.5;
 
    // Set minimal with if only few tasks are in column, to avoid unusable space
    var approxCellHeight = Math.ceil(Math.sqrt(Math.max(...totalTaskHeightPerColumn))) + 1;
    for (let i = 0; i < totalTaskHeightPerColumn.length; i++) {
        if (totalTaskHeightPerColumn[i] <= approxCellHeight) {
            totalTaskHeightPerColumn[i] = 0;
        }
    }
 
    return percent(totalTaskHeightPerColumn);
}
 
function percent(array) {
    var sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
 
    var factor = 100.0 / sum;
 
    for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(array[i] * factor);
    }
 
    return array;
}
 
function setColumnWidths(widths, numberOfColumns) {
    for (let i = 0; i < numberOfColumns; i++) {
        document.getElementById("taskboard-table-header_s" + i).style.width = widths[i] + '%';
    }
 
    var taskboardCells = document.getElementsByClassName("taskboard-cell ui-droppable");
    for (let i = 0; i < taskboardCells.length; i++) {
        const cell = taskboardCells[i];
        cell.style.width = widths[i % numberOfColumns] + '%';
    }
}
 
function refreshTaskAlignment() {
    document.styleSheets[0].insertRule(".subColumn {display: contents}", 0); // Make disruptive subColumns ineffective
    document.styleSheets[0].insertRule(".childTbTile {float: left; margin: 2px !important}", 0);
 
    var fullscreenButton = document.querySelector("li[command='fullscreen-toggle']");
    fullscreenButton.click();
    fullscreenButton.click();
}
 
function minimizeResolvedTasks(numberOfColumns) {
    var resolvedTaskSelector = "td[axis='taskboard-table-body_s" + (numberOfColumns - 2) + "'] .childTbTile";
 
    // Hide additional fields
    document.styleSheets[0].insertRule(resolvedTaskSelector + " .additional-field {display: none}", 0);
    document.styleSheets[0].insertRule(resolvedTaskSelector + ":hover .additional-field {display: inherit}", 0);
 
    // Hide Tags
    document.styleSheets[0].insertRule(resolvedTaskSelector + " .tags {display: none}", 0);
    document.styleSheets[0].insertRule(resolvedTaskSelector + ":hover .tags {display: inherit}", 0);
}
 
function minimizeDoneTasks(numberOfColumns) {
    var doneTaskSelector = "td[axis='taskboard-table-body_s" + (numberOfColumns - 1) + "'] .childTbTile";
    document.styleSheets[0].insertRule(doneTaskSelector + " {height: 25px; overflow: hidden;}", 0);
    document.styleSheets[0].insertRule(doneTaskSelector + ":hover {height: auto;}", 0);
}
 
function getNumberOfColumns() {
    for (let i = 0; i < 100; i++) {
        if (document.getElementById("taskboard-table-header_s" + i) === null) {
            return i;
        }
    }
}
