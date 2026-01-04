// ==UserScript==
// @name         Elimination Filter
// @namespace    sullengenieEliminationFilter
// @version      0.4
// @description  Removes targets that are not Okay from the team list and revenge pages for elimination.
// @author       sullengenie [1946152], epicaricacy [2040809]
// @match        *://*.torn.com/competition.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33118/Elimination%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/33118/Elimination%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TEAM_LIST_STATUS_INDEX = 4;
    const REVENGE_LIST_STATUS_INDEX = 3;

    const TEAM_LIST_LEVEL_INDEX = 3;
    const REVENGE_LIST_LEVEL_INDEX = 2;

    let STATUS_INDEX;
    let LEVEL_INDEX;

    function hide(player) {
        player.style.display = 'none';
    }

    function show(player) {
        player.style.display = 'inline';
    }

    function statusOf(player) {
        return player.firstElementChild.children[STATUS_INDEX].innerText;
    }

    function levelOf(player) {
        return player.firstElementChild.children[LEVEL_INDEX].innerText;
    }

    function isTeamListPage() {
        return window.location.href.includes('team');
    }

    function isRevengePage() {
        return window.location.href.includes('revenge');
    }

    function isListOfPlayers(node) {
        return node.classList !== undefined &&
            (node.classList.contains('team-list-wrap') ||
             node.classList.contains('revenge-wrap'));
    }

    function updateIndices() {
        if (isTeamListPage()) {
            STATUS_INDEX = TEAM_LIST_STATUS_INDEX;
            LEVEL_INDEX = TEAM_LIST_LEVEL_INDEX;
        } else if (isRevengePage()) {
            STATUS_INDEX = REVENGE_LIST_STATUS_INDEX;
            LEVEL_INDEX = REVENGE_LIST_LEVEL_INDEX;
        } else {
            throw 'Invalid page.';
        }
    }

    function shouldHide(filterOptions, player) {
        return (filterOptions.okayOnly && statusOf(player) !== 'Okay') ||
            (filterOptions.maxLevel && levelOf(player) > filterOptions.maxLevel);
    }

    function applyFilter() {
        let playerList = document.querySelector('.competition-list');
        let filterOptions = getFilterOptionsFromPanel();
        localStorage.eliminationFilter = JSON.stringify(filterOptions);
        for (let player of playerList.children) {
            if (shouldHide(filterOptions, player)) {
                hide(player);
            } else {
                show(player);
            }
        }
    }

    function getFilterOptionsFromPanel() {
        let maxLevelInput = document.getElementById('ef-max-level');
        let okayOnlyCheckbox = document.getElementById('ef-status-okay-only');
        return {
            'maxLevel': maxLevelInput && !isNaN(maxLevelInput.value) && parseInt(maxLevelInput.value, 10),
            'okayOnly': okayOnlyCheckbox && okayOnlyCheckbox.checked
        };
    }

    function createFilterOptionsPanel() {
        if (document.getElementById('elimination-filter')) {
            return;
        }
        let cachedOptions = JSON.parse(localStorage.eliminationFilter || '{}');
        let competitionWrap = document.getElementById('competition-wrap');
        let competitionBr = competitionWrap.querySelector('.page-head-delimiter');

        let lineBreak = document.createElement('br');

        let filterOptionsPanel = document.createElement('div');
        filterOptionsPanel.id = 'elimination-filter';
        filterOptionsPanel.className += ' m-top10';

        let panelTitle = document.createElement('div');
        panelTitle.className += ' title-gray top-round';
        panelTitle.innerHTML = '[UNOFFICIAL] Elimination Filter Options';

        let panelContent = document.createElement('div');
        panelContent.className += ' bottom-round cont-gray p10';

        let statusCheckbox = document.createElement('input');
        statusCheckbox.type = 'checkbox';
        statusCheckbox.name = 'ef-status';
        statusCheckbox.value = 'Okay Only';
        statusCheckbox.id = 'ef-status-okay-only';
        statusCheckbox.checked = cachedOptions.okayOnly || false;

        let okayOnlyLabel = document.createElement('label');
        okayOnlyLabel.innerHTML = ' Okay Only';
        okayOnlyLabel.setAttribute('for', 'ef-status-okay-only');

        let statusSpan = document.createElement('p');
        statusSpan.appendChild(statusCheckbox);
        statusSpan.appendChild(okayOnlyLabel);

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

        panelContent.appendChild(statusSpan);
        panelContent.appendChild(lineBreak);
        panelContent.appendChild(levelSpan);
        filterOptionsPanel.appendChild(panelTitle);
        filterOptionsPanel.appendChild(panelContent);
        competitionBr.parentNode.insertBefore(filterOptionsPanel, competitionBr.nextSibling);

        statusCheckbox.onchange=applyFilter;
        levelInput.onchange=applyFilter;
        levelInput.onkeyup=applyFilter;
    }

    function watchForPlayerListUpdates() {
        let target = document.getElementById('competition-wrap');
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        break;
                    }
                }
                if (doApplyFilter) {
                    createFilterOptionsPanel();
                    updateIndices();
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