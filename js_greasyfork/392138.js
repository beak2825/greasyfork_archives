// ==UserScript==
// @name        TFS TaskBoard Resize (customized by RBi)
// @namespace   https://wenzel-metromec.ch/
// @version     0.6
// @description Optimizes the column widths of a Visual Studio Team Foundation Server 2015 taskboard to minimize scrolling. Original: https://greasyfork.org/de/scripts/383160-tfs-taskboard-resize
// @author      Amedeo Amato, Rolf Bislin
// @match       https://*.tfspreview.com/*/_backlogs/taskboard*
// @match       http://*/tfs/*/_backlogs/taskboard*
// @match       http://*/tfs2/*/_backlogs/taskboard*
// @match       https://*.tfspreview.com/*/_backlogs/TaskBoard*
// @match       http://*/tfs/*/_backlogs/TaskBoard*
// @match       http://*/tfs2/*/_backlogs/TaskBoard*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/392138/TFS%20TaskBoard%20Resize%20%28customized%20by%20RBi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392138/TFS%20TaskBoard%20Resize%20%28customized%20by%20RBi%29.meta.js
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
    refreshTaskAlignment();
}

function calculateOptimalColumnWidth(numberOfColumns) {
    var taskboardCells = document.getElementsByClassName("taskboard-cell ui-droppable");

    // Count number of maximal tasks in each column
    var taskCountPerColumn = Array(numberOfColumns).fill(0);
    for (let i = 0; i < taskboardCells.length; i++) {
        var colNr = i % numberOfColumns;
        taskCountPerColumn[colNr] = Math.max(taskCountPerColumn[colNr], taskboardCells[i].getElementsByClassName("childTbTile").length);
    }

    // Reduce last "Resolved and Done" column, because it's not important
    if (taskCountPerColumn[numberOfColumns - 4] > 9) {
        taskCountPerColumn[numberOfColumns - 4] -= 9; // Remove "Bodensatz"
    }
    taskCountPerColumn[numberOfColumns - 4] /= 2;  // Column "New"
    taskCountPerColumn[numberOfColumns - 3] *= 1.6;  // Column "Active"
    taskCountPerColumn[numberOfColumns - 2] /= 4;  // Column "Resolved"
    taskCountPerColumn[numberOfColumns - 1] /= 4;  // Column "Closed"
    console.log(taskCountPerColumn);

    //for (let i = 0; i < taskboardCells.length; i++) {
    //    var colNr2 = i% numberOfColumns;
    //    if(taskCountPerColumn[colNr2]==0) {
    //        taskboardCells[i].classList.add("emptyColumn");
    //    }
    //}

    // Set minimal with if only few tasks are in column, to avoid unusable space
    var approxCellHeight = Math.ceil(Math.sqrt(Math.max(...taskCountPerColumn))) + 1;
    for (let i = 0; i < taskCountPerColumn.length; i++) {
        //if (taskCountPerColumn[i]==0) {
        //    document.getElementById("taskboard-table-header_s"+i).classList.add("emptyColumn");
        //}
        //console.log('i='+i+', '+taskCountPerColumn[i]+' <= '+approxCellHeight)
        if (taskCountPerColumn[i] <= approxCellHeight) {
            taskCountPerColumn[i] = 0;
        }
    }

    return percent(taskCountPerColumn);
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

    //document.styleSheets[0].insertRule(".emptyColumn { min-width: 25px; }",0);

    var fullscreenButton = document.querySelector("li[command='fullscreen-toggle']");
    fullscreenButton.click();
    fullscreenButton.click();
}

function minimizeDoneTasks(numberOfColumns) {
    for (let i = 1; i <= 2; i++) {
        var doneTaskSelector = "td[axis='taskboard-table-body_s" + (numberOfColumns - i) + "'] .childTbTile";
        document.styleSheets[0].insertRule(doneTaskSelector + " {height: 18px; overflow: hidden; margin: 0px !important; border-bottom: 0.5px solid transparent; }", 0);
        document.styleSheets[0].insertRule(doneTaskSelector + ":hover {height: auto;}", 0);
        document.styleSheets[0].insertRule(doneTaskSelector + " .id-title-container { margin: 0px 2px; padding: 0px; }", 0);
    }
}

function getNumberOfColumns() {
    for (let i = 0; i < 100; i++) {
        if (document.getElementById("taskboard-table-header_s" + i) === null) {
            return i;
        }
    }
}