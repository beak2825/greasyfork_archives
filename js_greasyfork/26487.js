// ==UserScript==
// @name         TaskId on TFS
// @namespace    test
// @version      4
// @description:en  Adds TaskId, as a prefix to task on TFS board. It's required to set proper TFS board url in the @match field (like http://sometfs.com:8080/tfs/someProject/.../_backlogs/taskboard/*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @author       turban
// @match        http:/put.tfs.board.url.here.com
// @grant        none
// @description Adds TaskId, as a prefix to task on TFS board. It's required to set proper TFS board url in the @match field (like http://sometfs.com:8080/tfs/someProject/.../_backlogs/taskboard/*
// @downloadURL https://update.greasyfork.org/scripts/26487/TaskId%20on%20TFS.user.js
// @updateURL https://update.greasyfork.org/scripts/26487/TaskId%20on%20TFS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // task Id
    var idsAdded = [];
    function setIds(selector) {
        if (idsAdded.indexOf(selector) != -1) return;
        var tasks = Array.prototype.slice.call(document.querySelectorAll(selector));
        if(tasks.length > 0) idsAdded.push(selector);

        tasks.forEach(task => {
            var titleNode = task.querySelector(".clickable-title");
            titleNode.innerHTML = task.id.replace("tile-", "") + ": " + titleNode.innerHTML;

        });
    }

    var colourSet = [];
    var currentUser = document.querySelector('.user-menu li:first-child > span').innerHTML;
    function colorMyTasks(selector) {
        console.log("colorizer");
        if (colourSet.indexOf(selector) != -1) return;
        var tiles = Array.prototype.slice.call(document.querySelectorAll(selector));
        if(tiles.length > 0) colourSet.push(selector);

        tiles.forEach(tile => {
            var personElement = tile.querySelector('[field="System.AssignedTo"] > div > img');
            if (personElement && personElement.getAttribute("title") === currentUser) {
                console.log("Colorizing");
                tile.querySelector(".tbTileContent").style.backgroundColor = "rgb(128, 200, 250)";
            }
        });
    }

    function doTasks(selector) {
        setIds(selector);
        colorMyTasks(selector);
    }

    waitForKeyElements(".childTbTile", () => doTasks(".childTbTile"), false);
    waitForKeyElements(".parentTbTile", () => doTasks(".parentTbTile"), false);

    function setBranchTitle(){
        var modal = document.querySelector(".vc-create-branch-dialog");
        var taskId = modal.querySelector(".ra-primary-data .ra-primary-data-id").innerHTML;
        var taskTitle = modal.querySelector(".ra-primary-data .ra-primary-data-id + a").innerHTML.toLowerCase().replace(/\s/g,"-");
        var branchTitleInput = modal.querySelector('[placeholder="Enter your branch name"]');
        branchTitleInput.value = `feature/#${taskId}-${taskTitle}`;

    }

    waitForKeyElements(".childTbTile", () => setIds(".childTbTile"), false);
    waitForKeyElements(".parentTbTile", () => setIds(".parentTbTile"), false);
    waitForKeyElements(".vc-create-branch-dialog .ra-primary-data-id", setBranchTitle, false);

    // states
    function setExtraData() {
        setTimeout(() => {
        document.querySelectorAll(".taskboard-content-row")
            .forEach((element, index) => {
            var personElement = element.querySelector('[field="System.AssignedTo"] > div > img');
            var stateElement = element.querySelector('[field="System.State"] > div:last-child');

            var summaryRow = document.getElementById("taskboard-summary-row-" + (index + 1)).querySelector(".witStateSummary");
            if(summaryRow.querySelector(".extraData")){
                return;
            }
            //console.log("Setting extra data");

            if (personElement) {
                //console.log(personElement.getAttribute("title"));
                summaryRow.innerHTML += '<span class="work2-item-count extraData">' + personElement.getAttribute("title") + '</span>';
            } else {
                //console.log("Unassigned");
                summaryRow.innerHTML += '<span class="work-item-count">Unassigned</span>';
            }

            if (stateElement){
                //console.log(stateElement.innerHTML);
                summaryRow.innerHTML += '<span class="withRemainingWork extraData"> (' + stateElement.innerHTML + ')</span>';
            }
        });
        }, 1000);
    }
    waitForKeyElements(".taskboard-content-row", setExtraData, false);
})();