// ==UserScript==
// @name         [HF] Hide threads from boards in the search page.
// @namespace    @iNeo19
// @version      1.1
// @description  Hide threads from certain boards in your "View New Posts" page
// @author       You
// @match        http://hackforums.net/search.php?action=results&sid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19632/%5BHF%5D%20Hide%20threads%20from%20boards%20in%20the%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/19632/%5BHF%5D%20Hide%20threads%20from%20boards%20in%20the%20search%20page.meta.js
// ==/UserScript==

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var badBoards = [
    "Call of Duty Series", "Hearthstone: Heroes of Warcraft", "CS:GO Lobby Talk"
];

(function() {
    'use strict';
    var threadList = false;
    var threadTitleElement = null;
    var boardsNum = 0;
    var filteredBoards = 0;
    threadList = getElementByXpath('//*[@id="content"]/div[2]/table[2]/tbody');
    if (threadList) {
        var threads = threadList.getElementsByTagName("tr");
        for(var threadIndex=0;threadIndex<threads.length;threadIndex++) {
            var threadData = threads[threadIndex].getElementsByClassName("forumdisplay_regular");
            var boardTitleRow = threadData[1];
            if (boardTitleRow) {
                var boardTitleElement = boardTitleRow.getElementsByTagName("a");
                var boardTitle = boardTitleElement[0].innerHTML;
                if (badBoards.indexOf(boardTitle) > -1) {
                    threads[threadIndex].style.display = "none";
                    filteredBoards = filteredBoards + 1;
                }
                boardsNum = boardsNum + 1;
            }

        }
    }
    var searchResults = getElementByXpath('//*[@id="content"]/div[2]/table[2]/tbody/tr[1]/td/strong');
    searchResults.innerHTML = searchResults.innerHTML + "  <span style='font-size:10px;'><b> Filtered threads:</b> "+filteredBoards+"/"+boardsNum+"</span>";
})();