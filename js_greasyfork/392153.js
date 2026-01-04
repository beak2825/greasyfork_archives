// ==UserScript==
// @name         Grab Hover Data
// @namespace    wildhareHoverData
// @version      0.1
// @description  Grabs data from chart hover and uses it
// @author       wildhare
// @match        *://*.torn.com/personalstats.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392153/Grab%20Hover%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/392153/Grab%20Hover%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let target = document.querySelector('.chartWrapper___2rkSK');
    var defendsLost;
    var lineDefendsLost;
    var attack;
    var attackUrl = document.createElement('a');
    attackUrl.href = "loader2.php?sid=getInAttack&user2ID=1974307";
    attackUrl.innerHTML = "Attack!";

    function grabData(node) {
        let hoverData = node.innerText;
        let hd2Array = hoverData.split("\n");
        defendsLost = hd2Array[4];
        console.log("Hover: " + hoverData);
        console.log("Hover Defends: " + defendsLost);
        var lineElements = document.querySelectorAll("div.statRows___jm5Oa > div:nth-child(6) > div");
        console.log("Length: " + lineElements.length);
        var playerGraphElement;
        if ( lineElements.length > 33 ) {
            lineDefendsLost = document.querySelector("div.statRows___jm5Oa > div:nth-child(6) > div:nth-child(3)").innerText;
            playerGraphElement = document.querySelector("div.chartWrapper___2rkSK > div > div > div:nth-child(1) > div > svg > g:nth-child(2) > g:nth-child(3) > g");
        } else {
            lineDefendsLost = document.querySelector("div.statRows___jm5Oa > div:nth-child(6) > div.statValue___qKLYH").innerText;
        } console.log("Latest: " + lineDefendsLost);

        if (lineDefendsLost > defendsLost) {
            node.style.backgroundColor= "red";
        } else if (lineDefendsLost == defendsLost) {
            node.style.backgroundColor = "green";
        }
    }

    function checkForQueryStringValue(queryStringValue) {
        var fieldValue = queryStringValue;
        var url = window.location.href;
        if(url.indexOf('=' + fieldValue + '&') != -1) {
            return true;
        }
        return false
    }

    var hoverDefendsData;
    var defendsData;

    function updateStatsHelperPanel() {
        hoverDefendsData.innerText = defendsLost;
        defendsData.innerText = lineDefendsLost;
    }

    // This doesn't work consistently yet.  I think I neeed another mutation observer to wait to run this after the element exists.
    function setFocus() {
        document.querySelector("div.statRows___jm5Oa > div:nth-child(6) > div.statValue___qKLYH").focus()
    }

    function createStatsHelperPanel() {
        if (document.getElementById('personal-stats-helper')) {
            updateStatsHelperPanel();
            return;
        }
        let cachedOptions = JSON.parse(localStorage.playerData || '{}');
        let personalStatsWrap = document.querySelector('.content-title');
        let userlistBr = personalStatsWrap.querySelector('.page-head-delimiter');

        let lineBreak = document.createElement('br');

        let playerDataPanel = document.createElement('div');
        playerDataPanel.id = 'personal-stats-helper';
        playerDataPanel.className += ' m-top10';

        let panelTitle = document.createElement('div');
        panelTitle.className += ' title-gray top-round';
        panelTitle.innerHTML = 'WildHare Personal Stats Helper';

        let panelContent = document.createElement('div');
        panelContent.className += ' bottom-round cont-gray p10';

        hoverDefendsData = document.createElement('p');
        hoverDefendsData.innerText = defendsLost;
        hoverDefendsData.id = 'ghd-hover-defends-data';

        let hoverDefendsLabel = document.createElement('label');
        hoverDefendsLabel.setAttribute('for', 'ghd-hover-defends-data');
        hoverDefendsLabel.innerHTML = 'Hover Defends Lost: ';

        let hoverDefendsSpan = document.createElement('p');
        hoverDefendsSpan.appendChild(hoverDefendsLabel);
        hoverDefendsSpan.appendChild(hoverDefendsData);

        defendsData = document.createElement('p');
        defendsData.innerText = lineDefendsLost;
        defendsData.id = 'ghd-defends-data';

        let defendsLabel = document.createElement('label');
        defendsLabel.setAttribute('for', 'ghd-defends-data');
        defendsLabel.innerHTML = 'Latest Defends Lost: ';

        let defendsSpan = document.createElement('p');
        defendsSpan.appendChild(defendsLabel);
        defendsSpan.appendChild(defendsData);

        panelContent.appendChild(hoverDefendsSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(defendsSpan);
        playerDataPanel.appendChild(panelTitle);
        playerDataPanel.appendChild(panelContent);
        userlistBr.parentNode.insertBefore(playerDataPanel, userlistBr.nextSibling);

    }

    var checkNode = function(addedNode) {
        if (addedNode.nodeType === 1){
            if (addedNode.matches('.tooltip___35jK1')){
                if (checkForQueryStringValue("defendslost")) {
                    grabData(addedNode);
                    createStatsHelperPanel();
                }
            }
        }
    }

    var observer = new MutationObserver(function(mutations){
        for (var i=0; i < mutations.length; i++){
            for (var j=0; j < mutations[i].addedNodes.length; j++){
                checkNode(mutations[i].addedNodes[j]);
            }
        }
    });

    if (checkForQueryStringValue('useractivity') || checkForQueryStringValue('defendslost')) {
            createStatsHelperPanel();
        }

    observer.observe(target, {
        childList: true,
        subtree: true
    });

})();