// ==UserScript==
// @name         Torn DT Personal Stats Helper
// @namespace    wildhareDTPersonalStatsHelper
// @version      2.2.7
// @description  Grabs data from chart hover about defends lost or attacks won for dog tags targets
// @author       wildhare
// @match        *://*.torn.com/personalstats.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392235/Torn%20DT%20Personal%20Stats%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392235/Torn%20DT%20Personal%20Stats%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const green = 'rgb(0, 204, 102)';

    // observer target for chart data
    let target = document.querySelector('.chartWrapper___2rkSK');
    // This allows grabbing hidden element data without needing to grab from the chart hover
    var hiddenElementsSelector = 'div[aria-label="A tabular representation of the data in the chart."] > table > tbody'
    var hiddenPlayerElementSelector = 'div[aria-label="A tabular representation of the data in the chart."] > table > thead > tr > th:nth-child(2)'

    // set this date each year to the day before dogtags start
    let dogTagsDate = 'Nov 4, 2020';
    var playerID;
    var dogTagsDefendsLost;
    var dogTagsAttacksWon;
    var hoverDataDate;
    var hoverDataPlayer;
    var defendsLost;
    var lineDefendsLost;
    var attacksWon;
    var lineAttacksWon;
    var attack;
    var attackURL;
    var defendsLostURL;
    var attacksWonURL;
    var profileURL;
    var lineElementsSelector = 'div > div:nth-child(6) > div';
    var defendsCompareSelector = 'div > div:nth-child(6) > div:nth-child(3)';
    var attacksCompareSelector = 'div > div:nth-child(1) > div:nth-child(3)';
    var defendsSingleSelector = 'div > div:nth-child(6) > div.statValue___qKLYH';
    var attacksSingleSelector = 'div > div:nth-child(1) > div.statValue___qKLYH';


    var dltHeaderLost;
    var awtHeaderWon;
    var attackPlayer;
    var playerProfileAnchor;

    function grabLineElements() {
        var lineElements = document.querySelectorAll(lineElementsSelector);
        // console.log(lineElements.length);
        /* if ( lineElements.length > 51 ) {
            lineDefendsLost = document.querySelector(defendsCompareSelector).innerText.replace(/\D/g,'');
            // console.log("over 51: "+ lineDefendsLost);
            lineAttacksWon = document.querySelector(attacksCompareSelector).innerText.replace(/\D/g,'');
        } else { */
        let defArray = document.querySelector(defendsSingleSelector).innerText.split('\n');
        lineDefendsLost = defArray[defArray.length - 2].replace(/\D/g,'');
            //lineDefendsLost = document.querySelector(defendsSingleSelector).innerText.replace(/\D/g,'');
        console.log("single player stats: " + lineDefendsLost);
        let attArray = document.querySelector(attacksSingleSelector).innerText.split('\n');
        lineAttacksWon = attArray[attArray.length - 2].replace(/\D/g,'');
            //lineAttacksWon = document.querySelector(attacksSingleSelector).innerText.replace(/\D/g,'');
        // }
    }

    function defendsLostDelta() {
        if (+lineDefendsLost > +dogTagsDefendsLost) {
            let delta = lineDefendsLost - dogTagsDefendsLost;
            dltHeaderLost.innerText = 'Defends Lost +' + delta;
        } else if (lineDefendsLost == dogTagsDefendsLost) {
            dltHeaderLost.innerText = 'Defends Lost +0';
            dltHeaderLost.style.backgroundColor = green;
        } else {
            let delta = lineDefendsLost - dogTagsDefendsLost;
            console.log(delta);
        }
    }

    function attacksWonDelta() {
        if (+lineAttacksWon > +dogTagsAttacksWon) {
            let delta = lineAttacksWon - dogTagsAttacksWon;
            awtHeaderWon.innerText = 'Attacks Won +' + delta;
        } else if (lineAttacksWon == dogTagsAttacksWon) {
            awtHeaderWon.innerText = 'Attacks Won +0';
        }
    }

    function grabHiddenData() {
        var hiddenElements = document.querySelector(hiddenElementsSelector).childNodes;
        var found;
        for (var i = 0; i < hiddenElements.length; i++) {
            if (hiddenElements[i].childNodes[0].innerText == dogTagsDate) {
                found = i;
                break;
            }
        }
        var hiddenElementData = hiddenElements[found].childNodes[1].innerText;
        // console.log(hiddenElementData);
        if (checkForQueryStringValue("defendslost")) {
            dogTagsDefendsLost = hiddenElementData.replace(/\D/g,'');
            defendsLostDelta();
        } else if (checkForQueryStringValue("attackswon")) {
            dogTagsAttacksWon = hiddenElementData.replace(/\D/g,'');
            attacksWonDelta();
        }
        playerID = document.querySelector(hiddenPlayerElementSelector).innerText.match(/\[(\d+)\]/)[1];
        attackURL = '/loader2.php?sid=getInAttack&user2ID=' + playerID;
        defendsLostURL = '/personalstats.php?ID=' + playerID + '&stats=defendslost';
        attacksWonURL = '/personalstats.php?ID=' + playerID + '&stats=attackswon';
        profileURL = '/profiles.php?XID=' + playerID + '#/';
        dltHeaderLost.href = defendsLostURL;
        awtHeaderWon.href = attacksWonURL;
        attackPlayer.href = attackURL;
        playerProfileAnchor.href = profileURL;
        grabLineElements();
        createStatsHelperPanel();
    }

    function grabData(node, hoverDataType) {
        grabLineElements();

        let hoverData = node.innerText;
        let hd2Array = hoverData.split("\n");
        hoverDataPlayer = hd2Array[0];
        hoverDataDate = hd2Array[2];
        defendsLost = hd2Array[4];
        let hoverDataInt = hd2Array[4].replace(/\D/g,'');

        if (hoverDataType == 'defendslost') {
            defendsLost = hoverDataInt;
            if (hoverDataDate == dogTagsDate) {
                dogTagsDefendsLost = defendsLost;
                defendsLostDelta();
            }
            if (lineDefendsLost > defendsLost) {
                node.style.backgroundColor= "red";
            } else if (lineDefendsLost == defendsLost) {
                node.style.backgroundColor = green;
            }
        } else if (hoverDataType == 'attackswon') {
            attacksWon = hoverDataInt;
            if (hoverDataDate == dogTagsDate) {
                dogTagsAttacksWon = attacksWon;
                attacksWonDelta();
            }
            if (lineAttacksWon > attacksWon) {
                node.style.backgroundColor= green;
            } else if (lineAttacksWon == attacksWon) {
                node.style.backgroundColor = "red";
            }
        }
        createStatsHelperPanel();
    }

    function checkForQueryStringValue(queryStringValue) {
        var fieldValue = queryStringValue;
        var url = window.location.href;
        if(url.indexOf('=' + fieldValue + '&') != -1) {
            return true;
        }
        return false
    }

    var dltHoverDataDate;
    var dltHoverDefLost;
    var dltDTDefLost;
    var dltLatestDefLost;
    var awtDTAttacksWon;
    var awtLatestAttacksWon;

    function updateStatsHelperPanel() {
        dltHoverDataDate.innerText = (hoverDataDate);
        dltHoverDefLost.innerText = (defendsLost);
        dltDTDefLost.innerText = (dogTagsDefendsLost);
        dltLatestDefLost.innerText = (lineDefendsLost);
        awtDTAttacksWon.innerText = (dogTagsAttacksWon);
        awtLatestAttacksWon.innerText = (lineAttacksWon);
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

        dltHeaderLost = document.createElement('a');
        dltHeaderLost.innerText = 'Defends Lost';

        let dltHeader = document.createElement('tr');
        dltHeader.appendChild(dltHeaderLost);

        dltHoverDataDate = document.createElement('td');
        dltHoverDataDate.innerText = (hoverDataDate);

        dltHoverDefLost = document.createElement('td');
        dltHoverDefLost.innerText = (defendsLost);

        let dltHoverData = document.createElement('tr');
        dltHoverData.appendChild(dltHoverDataDate);
        dltHoverData.appendChild(dltHoverDefLost);

        let dltDTDataDate = document.createElement('td');
        dltDTDataDate.innerText = (dogTagsDate);

        dltDTDefLost = document.createElement('td');
        dltDTDefLost.innerText = (dogTagsDefendsLost);

        let dltDTData = document.createElement('tr');
        dltDTData.appendChild(dltDTDataDate);
        dltDTData.appendChild(dltDTDefLost);

        let dltLatestDataDate = document.createElement('td');
        dltLatestDataDate.innerText = ('Latest');

        dltLatestDefLost = document.createElement('td');
        dltLatestDefLost.innerText = (lineDefendsLost);

        let dltLatestData = document.createElement('tr');
        dltLatestData.appendChild(dltLatestDataDate);
        dltLatestData.appendChild(dltLatestDefLost);

        let defendsLostTable = document.createElement('table');
        defendsLostTable.style.display = 'inline-block';
        defendsLostTable.style.borderCollapse = 'separate';
        defendsLostTable.style.borderSpacing = '10px 5px';
        defendsLostTable.setAttribute("class", "defendslost");
        defendsLostTable.appendChild(dltHeader);
        // defendsLostTable.appendChild(dltHoverData);
        defendsLostTable.appendChild(dltDTData);
        defendsLostTable.appendChild(dltLatestData);

        awtHeaderWon = document.createElement('a');
        awtHeaderWon.innerText = 'Attacks Won';

        let awtHeader = document.createElement('tr');
        awtHeader.appendChild(awtHeaderWon);

        let awtDTDataDate = document.createElement('td');
        awtDTDataDate.innerText = (dogTagsDate);

        awtDTAttacksWon = document.createElement('td');
        awtDTAttacksWon.innerText = (dogTagsAttacksWon);

        let awtDTData = document.createElement('tr');
        awtDTData.appendChild(awtDTDataDate);
        awtDTData.appendChild(awtDTAttacksWon);

        let awtLatestDataDate = document.createElement('td');
        awtLatestDataDate.innerText = ('Latest');

        awtLatestAttacksWon = document.createElement('td');
        awtLatestAttacksWon.innerText = (lineAttacksWon);

        let awtLatestData = document.createElement('tr');
        awtLatestData.appendChild(awtLatestDataDate);
        awtLatestData.appendChild(awtLatestAttacksWon);

        let attacksWonTable = document.createElement('table');
        attacksWonTable.style.display = 'inline-block';
        attacksWonTable.style.borderCollapse = 'separate';
        attacksWonTable.style.borderSpacing = '10px 5px';
        attacksWonTable.setAttribute("class", "attackswon");
        attacksWonTable.appendChild(awtHeader);
        //attacksWonTable.appendChild(awtHoverData);
        attacksWonTable.appendChild(awtDTData);
        attacksWonTable.appendChild(awtLatestData);

        attackPlayer = document.createElement('a');
        attackPlayer.innerText = 'Attack!';

        let attackPlayerHeader = document.createElement('tr');
        attackPlayerHeader.appendChild(attackPlayer);

        playerProfileAnchor = document.createElement('a');
        playerProfileAnchor.innerText = 'Profile!';

        let myPlayerProfileHeader = document.createElement('tr');
        myPlayerProfileHeader.appendChild(playerProfileAnchor);

        let tableData = document.createElement('td');
        tableData.innerText = 'Placeholder';
        let tableRow = document.createElement('tr');
        tableRow.appendChild(tableData);

        let actionsTable = document.createElement('table');
        actionsTable.style.display = 'inline-block';
        actionsTable.style.borderCollapse = 'separate';
        actionsTable.style.borderSpacing = '10px 5px';
        actionsTable.setAttribute("class", "actionlinks");
        actionsTable.appendChild(attackPlayerHeader);
        actionsTable.appendChild(myPlayerProfileHeader);
        actionsTable.appendChild(tableRow);

        let defendsLostDiv = document.createElement('div');
        defendsLostDiv.appendChild(defendsLostTable);
        let attacksWonDiv = document.createElement('div');
        attacksWonDiv.appendChild(attacksWonTable);
        let actionsDiv = document.createElement('div');
        actionsDiv.appendChild(actionsTable);

        panelContent.appendChild(defendsLostTable);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(attacksWonTable);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(actionsTable);
        panelContent.appendChild(lineBreak);
        playerDataPanel.appendChild(panelTitle);
        playerDataPanel.appendChild(panelContent);
        userlistBr.parentNode.insertBefore(playerDataPanel, userlistBr.nextSibling);

    }

    var checkNode = function(addedNode) {
        if (addedNode.nodeType === 1){
            if (document.querySelector(hiddenElementsSelector).childNodes){
                grabHiddenData();
            }
            if (addedNode.matches('.tooltip___35jK1')){
                if (checkForQueryStringValue("defendslost")) {
                    grabData(addedNode, 'defendslost');
                } else if (checkForQueryStringValue("attackswon")) {
                    grabData(addedNode, 'attackswon');
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

    if (checkForQueryStringValue('useractivity') || checkForQueryStringValue('defendslost') || checkForQueryStringValue('attackswon')) {
            createStatsHelperPanel();
        }

    observer.observe(target, {
        childList: true,
        subtree: true
    });

})();