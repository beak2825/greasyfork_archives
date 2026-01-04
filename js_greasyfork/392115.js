// ==UserScript==
// @name         Userlist Filter
// @namespace    wildhareFedFilter
// @version      0.6.4
// @description  Filters targets from player search results (includes a fed filter)
// @author       wildhare
// @match        *://*.torn.com/page.php?sid=UserList*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392115/Userlist%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/392115/Userlist%20Filter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var defendsLostURL;
    var attacksWonURL;
    var playerID;
    var playerSpanExpand;
 
    function appendLink(player, dURL, aURL){
        let linkOptions = getLinkOptionsFromPanel();
        localStorage.linkOptions = JSON.stringify(linkOptions);
        var playerSpanExpand = player.querySelector('div.expander.clearfix > span.expand');
        if (!player.querySelector('.big.svg.singleicon > a.defendsLostLink')) {
            var defendsAnchor = document.createElement('a');
            defendsAnchor.href = dURL;
            defendsAnchor.innerText = 'DL';
            defendsAnchor.className = 'defendsLostLink';
            defendsAnchor.style.fontSize = '14px';
            playerSpanExpand.parentNode.querySelector('.big.svg.singleicon').appendChild(defendsAnchor);
        }
        if (linkOptions.defendsLostLink) {
            player.querySelector('a.defendsLostLink').style.display = null;
            player.querySelector('a.defendsLostLink').style.outline = null;
            /*
            var input = player.querySelector('a.defendsLostLink');
            input.addEventListener("focus", function () {
                this.style.backgroundColor = "yellow";
            });
            */
        } else {
            player.querySelector('a.defendsLostLink').style.display = 'none';
        }
        if (!player.querySelector('a.attacksWonLink')){
            var attacksAnchor = document.createElement('a');
            attacksAnchor.href = aURL;
            attacksAnchor.innerText = 'AW';
            attacksAnchor.className = 'attacksWonLink';
            attacksAnchor.style.fontSize = '14px';
            playerSpanExpand.parentNode.querySelector('.big.svg.singleicon').appendChild(attacksAnchor);
        }
        if (linkOptions.attacksWonLink) {
            player.querySelector('a.attacksWonLink').style.display = null
        } else {
            player.querySelector('a.attacksWonLink').style.display = 'none';
        }
        if (linkOptions.attacksWonLink || linkOptions.defendsLostLink) {
            playerSpanExpand.parentNode.querySelector('.big.svg.singleicon > .iconShow').style.display = 'none';
            playerSpanExpand.parentNode.querySelector('.user.faction').style.visibility = 'hidden';
        } else {
            playerSpanExpand.parentNode.querySelector('.big.svg.singleicon > .iconShow').style.display = null;
            playerSpanExpand.parentNode.querySelector('.user.faction').style.visibility = null;
        }
    }
 
    function hide(player) {
        player.style.display = 'none';
    }
 
    function show(player) {
        player.style.display = null;
        var currentPlayerID = getPlayerId(player);
        defendsLostURL = '/personalstats.php?ID=' + currentPlayerID + '&stat=defendslost&from=1%20month';
        attacksWonURL = '/personalstats.php?ID=' + currentPlayerID + '&stat=attackswon&from=1%20month';
        appendLink(player, defendsLostURL, attacksWonURL);
    }
 
    function statusOf(player) {
        let playerActivityIconID = $(player).find("#iconTray").children().attr('id');
        let playerActivity;
        if (playerActivityIconID.contains("icon1_")) {
            playerActvity = 'Online';
        } else if (playerActivityIconID.contains("icon2_")){
            playerActivity = 'Offline';
        } else if (playerActivityIconID.contains("icon62_")){
            playerActivity = 'Idle';
        }
        return playerActivity;
    }
 
    function levelOf(player) {
        return $(player).find('.level')[0].innerText;
    }
 
    function isFed(player) {
        let playerIsFed = 'false';
        if (player.querySelector("[id^='icon70_']")) {
            playerIsFed = 'true';
        }
        return playerIsFed;
    }
 
    function isTravel(player) {
        let playerIsTravel = 'false';
        if (player.querySelector("[id^='icon71_']")) {
            playerIsTravel = 'true';
        }
        return playerIsTravel;
    }
 
    function isUserListPage() {
        return window.location.href.includes('userlist');
    }
 
    function isRevengePage() {
        return window.location.href.includes('revenge');
    }
 
    function isListOfPlayers(node) {
        return node.classList !== undefined &&
            (node.classList.contains('user-info-list-wrap') ||
             node.classList.contains('revenge-wrap'));
    }
 
    function shouldHide(filterOptions, player) {
        return (filterOptions.offlineOnly && statusOf(player) !== 'Offline') ||
            (filterOptions.isNotFed && isFed(player) == 'true') ||
            (filterOptions.isNotTravel && isTravel(player)) == 'true' ||
            (filterOptions.maxLevel && levelOf(player) > filterOptions.maxLevel);
    }
 
    function getPlayerId(player) {
        let playerAccount = player.querySelector("a.user.name > img").alt;
        let playerAccountArray = playerAccount.split(" ");
        playerID = playerAccountArray[1].match(/\[(\d+)\]/)[1];
        console.log(playerID);
        return playerID;
    }
 
    function applyFilter() {
        var playerIdList = [];
        let playerList = document.querySelector('.user-info-list-wrap');
        let filterOptions = getFilterOptionsFromPanel();
        localStorage.userlistFilter = JSON.stringify(filterOptions);
        for (let player of playerList.children) {
            if (shouldHide(filterOptions, player)) {
                hide(player);
            } else {
                playerIdList.push(getPlayerId(player));
                show(player);
            }
        }
        localStorage.setItem('playerIdList', playerIdList);
    }
 
    function getFilterOptionsFromPanel() {
        let maxLevelInput = document.getElementById('ef-max-level');
        let offlineOnlyCheckbox = document.getElementById('ef-status-offline-only');
        let isNotFedCheckbox = document.getElementById('ef-is-not-fed');
        let isNotTravelCheckbox = document.getElementById('ef-is-not-travel');
        return {
            'maxLevel': maxLevelInput && !isNaN(maxLevelInput.value) && parseInt(maxLevelInput.value, 10),
            'offlineOnly': offlineOnlyCheckbox && offlineOnlyCheckbox.checked,
            'isNotFed': isNotFedCheckbox && isNotFedCheckbox.checked,
            'isNotTravel' : isNotTravelCheckbox && isNotTravelCheckbox.checked
        };
    }
 
    function getLinkOptionsFromPanel() {
        let defendsLostCheckbox = document.getElementById('ef-defends-lost-link');
        let attacksWonCheckbox = document.getElementById('ef-attacks-won-link');
        return {
            'defendsLostLink' : defendsLostCheckbox && defendsLostCheckbox.checked,
            'attacksWonLink' : attacksWonCheckbox && attacksWonCheckbox.checked
        }
    }
 
    function createFilterOptionsPanel() {
        if (document.getElementById('userlist-filter')) {
            return;
        }
        let cachedOptions = JSON.parse(localStorage.userlistFilter || '{}');
        let cachedLinkOptions = JSON.parse(localStorage.linkOptions || '{}');
        let userlistWrap = document.querySelector('.content-title');
        let userlistBr = userlistWrap.querySelector('.page-head-delimiter');
 
        let lineBreak = document.createElement('br');
 
        let filterOptionsPanel = document.createElement('div');
        filterOptionsPanel.id = 'userlist-filter';
        filterOptionsPanel.className += ' m-top10';
 
        let panelTitle = document.createElement('div');
        panelTitle.className += ' title-gray top-round';
        panelTitle.innerHTML = 'WildHare Userlist Filter Options';
 
        let panelContent = document.createElement('div');
        panelContent.className += ' bottom-round cont-gray p10';
 
        let statusCheckbox = document.createElement('input');
        statusCheckbox.type = 'checkbox';
        statusCheckbox.name = 'ef-status';
        statusCheckbox.value = 'Offline Only';
        statusCheckbox.id = 'ef-status-offline-only';
        statusCheckbox.checked = cachedOptions.offlineOnly || false;
 
        let offlineOnlyLabel = document.createElement('label');
        offlineOnlyLabel.innerHTML = ' Offline Only';
        offlineOnlyLabel.setAttribute('for', 'ef-status-offline-only');
 
        let statusSpan = document.createElement('p');
        statusSpan.appendChild(statusCheckbox);
        statusSpan.appendChild(offlineOnlyLabel);
 
        let isNotFedCheckbox = document.createElement('input');
        isNotFedCheckbox.type = 'checkbox';
        isNotFedCheckbox.name = 'ef-isnotfed';
        isNotFedCheckbox.value = 'Is Not Fed';
        isNotFedCheckbox.id = 'ef-is-not-fed';
        isNotFedCheckbox.checked = cachedOptions.isNotFed || false;
 
        let isNotFedLabel = document.createElement('label');
        isNotFedLabel.innerHTML = ' Is Not Fed';
        isNotFedLabel.setAttribute('for', 'ef-is-not-fed');
 
        let fedSpan = document.createElement('p');
        fedSpan.appendChild(isNotFedCheckbox);
        fedSpan.appendChild(isNotFedLabel);
 
        let isNotTravelCheckbox = document.createElement('input');
        isNotTravelCheckbox.type = 'checkbox';
        isNotTravelCheckbox.name = 'ef-isnottravel';
        isNotTravelCheckbox.value = 'Is Not Travel';
        isNotTravelCheckbox.id = 'ef-is-not-travel';
        isNotTravelCheckbox.checked = cachedOptions.isNotTravel || false;
 
        let isNotTravelLabel = document.createElement('label');
        isNotTravelLabel.innerHTML = ' Is Not Travel';
        isNotTravelLabel.setAttribute('for', 'ef-is-not-travel');
 
        let travelSpan = document.createElement('p');
        travelSpan.appendChild(isNotTravelCheckbox);
        travelSpan.appendChild(isNotTravelLabel);
 
        let defendsLostCheckbox = document.createElement('input');
        defendsLostCheckbox.type = 'checkbox';
        defendsLostCheckbox.name = 'ef-defendsLost';
        defendsLostCheckbox.value = 'Defends Lost Link';
        defendsLostCheckbox.id = 'ef-defends-lost-link';
        defendsLostCheckbox.checked = cachedLinkOptions.defendsLostLink || false;
 
        let defendsLostLabel = document.createElement('label');
        defendsLostLabel.innerHTML = ' Defends Lost Link';
        defendsLostLabel.setAttribute('for', 'ef-defends-lost-link');
 
        let defendsSpan = document.createElement('p');
        defendsSpan.appendChild(defendsLostCheckbox);
        defendsSpan.appendChild(defendsLostLabel);
 
        let attacksWonCheckbox = document.createElement('input');
        attacksWonCheckbox.type = 'checkbox';
        attacksWonCheckbox.name = 'ef-attacksWon';
        attacksWonCheckbox.value = 'Attacks Won Link';
        attacksWonCheckbox.id = 'ef-attacks-won-link';
        attacksWonCheckbox.checked = cachedLinkOptions.attacksWonLink || false;
 
        let attacksWonLabel = document.createElement('label');
        attacksWonLabel.innerHTML = ' Attacks Won Link';
        attacksWonLabel.setAttribute('for', 'ef-attacks-won-link');
 
        let attacksSpan = document.createElement('p');
        attacksSpan.appendChild(attacksWonCheckbox);
        attacksSpan.appendChild(attacksWonLabel);
 
        let levelLabel = document.createElement('label');
        levelLabel.setAttribute('for', 'ef-max-level');
        levelLabel.innerHTML = 'Max Level: ';
 
        let levelInput = document.createElement('input');
        levelInput.id = 'ef-max-level';
        levelInput.setAttribute('type', 'number');
        levelInput.value = cachedOptions.maxLevel || '';
 
        let levelSpan = document.createElement('p');
        levelSpan.appendChild(levelLabel);
        levelSpan.appendChild(levelInput);
 
        panelContent.appendChild(fedSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(travelSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(statusSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(levelSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(defendsSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(attacksSpan);
        filterOptionsPanel.appendChild(panelTitle);
        filterOptionsPanel.appendChild(panelContent);
        userlistBr.parentNode.insertBefore(filterOptionsPanel, userlistBr.nextSibling);
 
        statusCheckbox.onchange=applyFilter;
        isNotFedCheckbox.onchange=applyFilter;
        isNotTravelCheckbox.onchange=applyFilter;
        defendsLostCheckbox.onchange=applyFilter;
        attacksWonCheckbox.onchange=applyFilter;
        levelInput.onchange=applyFilter;
        levelInput.onkeyup=applyFilter;
    }
 
    function watchForPlayerListUpdates() {
        let target = document.querySelector('.user-info-list-wrap');
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = true;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        break;
                    }
                }
                if (doApplyFilter) {
                    createFilterOptionsPanel();
                    applyFilter();
                }
            });
        });
        // configuration of the observer:
        let config = { attributes: true, childList: true, characterData: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
    watchForPlayerListUpdates();
})();