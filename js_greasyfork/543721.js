// ==UserScript==
// @name         MZ - ClashPotentialScore/esperiano
// @namespace    douglaskampl
// @version      1.0
// @description  Calculates clash score and analyzes member status for a specific, user-configurable federation.
// @author       Douglas
// @match        https://www.managerzone.com/?p=federations&sub=clash*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543721/MZ%20-%20ClashPotentialScoreesperiano.user.js
// @updateURL https://update.greasyfork.org/scripts/543721/MZ%20-%20ClashPotentialScoreesperiano.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'esperiano__config';
    const DEFAULT_CONFIG = {
        federationName: "Juventus FC",
        members: [
            'datch', 'esperiano', 'dadda4d', 'killermanager_91', 'toti1102',
            'fortalexis', 'manuchobot', 'sliemafc', 'tobi10', 'troyh65',
            'alexjas', 'edubeltro', 'fare_hadzibegic', 'southpacific',
            'new188', 'juventud1993'
        ]
    };

    function getConfig() {
        try {
            const storedConfig = localStorage.getItem(STORAGE_KEY);
            if (storedConfig) {
                return JSON.parse(storedConfig);
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
                return DEFAULT_CONFIG;
            }
        } catch (error) {
            return DEFAULT_CONFIG;
        }
    }

    function saveConfig(configObject) {
        try {
            const sanitizedConfig = {
                federationName: configObject.federationName.trim(),
                members: configObject.members.map(m => m.trim()).filter(m => m.length > 0)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedConfig));
            return true;
        } catch (error) {
            return false;
        }
    }

    function extractTitleData() {
        const title = document.title;
        const match = title.match(/\|\s*(.*?)\s+vs\s+/);
        if (match && match[1]) {
            return { pageFed1Name: match[1].trim() };
        }
        return { pageFed1Name: null };
    }

    function parseAllChallenges(tableElement) {
        const definitiveChallenges = [];
        const attackersWhoPlayed = new Set();
        const rows = tableElement.querySelectorAll('tbody > tr');

        rows.forEach((row) => {
            const challengeItemsContainer = row.querySelector('td:last-of-type .challenges');
            if (!challengeItemsContainer) return;

            const challengeItems = challengeItemsContainer.querySelectorAll('.challenges__item');
            if (challengeItems.length === 0) return;

            challengeItems.forEach(item => {
                const attackerNameElement = item.querySelector('.challenges--name .username');
                if (attackerNameElement) {
                    attackersWhoPlayed.add(attackerNameElement.textContent.trim());
                }
            });

            let finalItem = challengeItems[0];
            if (challengeItems.length > 1) {
                finalItem = Array.from(challengeItems).find(item => !item.querySelector('.challenges__older')) || finalItem;
            }

            const mainAttackerNameElement = finalItem.querySelector('.challenges--name .username');
            const resultLink = finalItem.querySelector('a[href*="p=match"]');

            if (!mainAttackerNameElement || !resultLink) return;

            const defenderCell = row.querySelector('td:nth-child(8) a.username');
            const defenderName = defenderCell ? defenderCell.textContent.trim() : 'Unknown Defender';
            const mainAttackerName = mainAttackerNameElement.textContent.trim();

            let result;
            if (resultLink.classList.contains('challenges--win')) result = 'WIN';
            else if (resultLink.classList.contains('challenges--lost')) result = 'LOSS';
            else result = 'DRAW';

            const totalAttemptsOnRow = Array.from(challengeItems).reduce((acc, item) => acc + (item.querySelector('.challenges--prev') ? 2 : 1), 0);

            definitiveChallenges.push({
                defender: defenderName,
                attacker: mainAttackerName,
                result: result,
                totalAttempts: totalAttemptsOnRow,
                isKeyMemberIntervention: challengeItems.length > 1
            });
        });

        return { definitiveChallenges, attackersWhoPlayed };
    }

    function calculatePotentialScore(tableElement, definitiveChallenges) {
        let currentScore = 0;
        const points = { WIN: 4, DRAW: 2, LOSS: 1 };
        const totalDefenderRows = tableElement.querySelectorAll('tbody > tr').length;
        currentScore += Math.max(0, 16 - totalDefenderRows) * points.WIN;
        definitiveChallenges.forEach(match => currentScore += points[match.result]);

        let potentialScore = currentScore;
        const opportunities = { secondAttempt: [], keyMember: [] };
        const keyMembersUsed = definitiveChallenges.filter(m => m.isKeyMemberIntervention).length;

        definitiveChallenges.filter(m => m.result !== 'WIN' && m.totalAttempts === 1).forEach(match => {
            const potentialGain = points.WIN - points[match.result];
            potentialScore += potentialGain;
            opportunities.secondAttempt.push({ ...match, potentialGain });
        });

        if ((2 - keyMembersUsed) > 0) {
            const keyMemberTargets = definitiveChallenges.filter(m => m.result !== 'WIN' && m.totalAttempts === 2).map(m => ({...m, potentialGain: points.WIN - points[m.result]})).sort((a, b) => b.potentialGain - a.potentialGain);
            if (keyMemberTargets.length > 0) {
                potentialScore += keyMemberTargets[0].potentialGain;
                opportunities.keyMember = keyMemberTargets.filter(m => m.potentialGain === keyMemberTargets[0].potentialGain);
            }
        }

        potentialScore += Math.max(0, totalDefenderRows - definitiveChallenges.length) * points.WIN;
        return { currentScore, potentialScore, keyMembersUsed, opportunities };
    }

    function renderScores(scores, memberStatus, pageFed1Name) {
        const existingContainer = document.querySelector('.cpan-score-container');
        if (existingContainer) existingContainer.remove();

        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'flex-grow-1 cpan-score-container';
        scoreContainer.innerHTML = `<span class="cpan-score-text">${pageFed1Name} MaxScore: <strong>${scores.potentialScore}</strong></span><span class="cpan-help-icon">?</span>`;

        scoreContainer.querySelector('.cpan-help-icon').addEventListener('click', (event) => {
            event.stopPropagation();
            buildAndShowModal(scores, memberStatus);
        });

        const placementAnchor = document.querySelector('#federation-select');
        const parentContainer = placementAnchor ? placementAnchor.closest('.flex-grow-1').parentNode : document.querySelector('.top-pane__name-score');
        if (parentContainer) {
            setTimeout(() => {
                parentContainer.appendChild(scoreContainer);
                setTimeout(() => scoreContainer.style.opacity = '1', 100);
            }, 1234);
        }
    }

    function buildAndShowModal(scores, memberStatus) {
        if (document.querySelector('.cpan-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'cpan-modal-overlay';
        const modalContent = document.createElement('div');
        modalContent.className = 'cpan-modal-content';

        let opportunitiesHtml = '';
        if (scores.opportunities.secondAttempt.length > 0) {
            opportunitiesHtml += '<h4>2nd Attempt Opportunities:</h4><ul>';
            scores.opportunities.secondAttempt.forEach(op => opportunitiesHtml += `<li><strong>${op.attacker}</strong> can play a 2nd match (<strong>+${op.potentialGain} pts</strong>)</li>`);
            opportunitiesHtml += '</ul>';
        }
        if (scores.opportunities.keyMember.length > 0) {
            opportunitiesHtml += '<h4>Key Member Opportunities:</h4><ul>';
            const gain = scores.opportunities.keyMember[0].potentialGain;
            const choices = scores.opportunities.keyMember.map(op => `<strong>${op.attacker}</strong>`).join(' or ');
            opportunitiesHtml += `<li>Use a key member for ${choices} (<strong>+${gain} pts</strong>)</li>`;
            opportunitiesHtml += '</ul>';
        }
        if (opportunitiesHtml === '') opportunitiesHtml = '<p>No further strategic opportunities identified.</p>';

        let memberStatusSectionHtml = '';
        if (memberStatus) {
            let memberStatusListHtml = '<ul>';
            memberStatus.forEach(item => {
                const icon = item.played ? 'fa-check-circle cpan-icon-played' : 'fa-times-circle cpan-icon-not-played';
                memberStatusListHtml += `<li><i class="fa ${icon}"></i> ${item.name}</li>`;
            });
            memberStatusListHtml += '</ul>';
            memberStatusSectionHtml = `
                <hr>
                <div id="cpan-member-status-section">
                    <h4 id="cpan-member-status-toggle">
                        <span class="cpan-toggle-title"><i class="fa fa-chevron-down" id="cpan-status-chevron"></i> Stato Membri</span>
                    </h4>
                    <div id="cpan-member-status-display">${memberStatusListHtml}</div>
                </div>`;
        }

        modalContent.innerHTML = `
            <div class="cpan-modal-header">
                <span id="cpan-main-title">Clash Analysis</span>
                <span id="cpan-edit-title" style="display: none;"><i class="fa fa-arrow-left cpan-back-icon"></i> Modifica Configurazione</span>
                <i class="fa fa-cog cpan-global-config-icon" title="Modifica Configurazione"></i>
            </div>
            <div class="cpan-modal-body">
                <div id="cpan-main-view">
                    <p>Current Score: <strong>${scores.currentScore}</strong> | Max Potential Score: <strong>${scores.potentialScore}</strong> | Key Members Used: <strong>${scores.keyMembersUsed} / 2</strong></p>
                    <hr>
                    ${opportunitiesHtml}
                    ${memberStatusSectionHtml}
                </div>
                <div id="cpan-edit-config-view" style="display: none;">
                    <label for="cpan-fed-name-input">Nome Federazione</label>
                    <input type="text" id="cpan-fed-name-input" />
                    <label for="cpan-members-textarea">Elenco Membri</label>
                    <textarea id="cpan-members-textarea" rows="8"></textarea>
                    <div class="cpan-button-group">
                        <button id="cpan-save-config-btn" class="cpan-modal-btn cpan-modal-btn-primary">Salva</button>
                    </div>
                </div>
            </div>`;

        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        const config = getConfig();
        const mainView = modalContent.querySelector('#cpan-main-view');
        const editView = modalContent.querySelector('#cpan-edit-config-view');
        const globalConfigIcon = modalContent.querySelector('.cpan-global-config-icon');
        const backIcon = modalContent.querySelector('.cpan-back-icon');
        const saveBtn = modalContent.querySelector('#cpan-save-config-btn');
        const fedNameInput = modalContent.querySelector('#cpan-fed-name-input');
        const membersTextarea = modalContent.querySelector('#cpan-members-textarea');
        const mainTitle = modalContent.querySelector('#cpan-main-title');
        const editTitle = modalContent.querySelector('#cpan-edit-title');

        const showEditView = () => {
            mainView.style.display = 'none';
            editView.style.display = 'block';
            mainTitle.style.display = 'none';
            editTitle.style.display = 'flex';
            globalConfigIcon.style.display = 'none';
            fedNameInput.value = config.federationName;
            membersTextarea.value = config.members.join('\n');
        };

        const hideEditView = () => {
            editView.style.display = 'none';
            mainView.style.display = 'block';
            editTitle.style.display = 'none';
            mainTitle.style.display = 'inline';
            globalConfigIcon.style.display = 'inline-block';
        };

        globalConfigIcon.addEventListener('click', showEditView);
        backIcon.addEventListener('click', hideEditView);

        saveBtn.addEventListener('click', () => {
            const newConfig = {
                federationName: fedNameInput.value,
                members: membersTextarea.value.split('\n')
            };
            if (saveConfig(newConfig)) {
                window.location.reload();
            }
        });

        if (memberStatus) {
            const toggleHeader = modalContent.querySelector('#cpan-member-status-toggle');
            const chevron = modalContent.querySelector('#cpan-status-chevron');
            const statusDisplay = modalContent.querySelector('#cpan-member-status-display');

            statusDisplay.style.display = 'none';
            chevron.style.transform = 'rotate(-90deg)';

            toggleHeader.addEventListener('click', () => {
                const isHidden = statusDisplay.style.display === 'none';
                statusDisplay.style.display = isHidden ? 'block' : 'none';
                chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }

        overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove() });

        requestAnimationFrame(() => overlay.classList.add('visible'));
    }

    function runClashAnalysis() {
        const table = document.querySelector('.hitlist.challenges-list');
        if (!table) return;

        const { pageFed1Name } = extractTitleData();
        if (!pageFed1Name) return;

        const config = getConfig();
        const isTargetFederation = config.federationName.trim().toLowerCase() === pageFed1Name.toLowerCase();

        const { definitiveChallenges, attackersWhoPlayed } = parseAllChallenges(table);
        const scores = calculatePotentialScore(table, definitiveChallenges);

        let memberStatus = null;
        if (isTargetFederation) {
            memberStatus = config.members.map(name => ({
                name,
                played: attackersWhoPlayed.has(name)
            }));
        }
        renderScores(scores, memberStatus, pageFed1Name);
    }

    function applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cpan-score-container { opacity: 0; transition: opacity 0.5s ease-in-out; display: flex; align-items: center; justify-content: flex-end; text-align: right; align-self: center; }
            .cpan-score-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1em; font-weight: 500; color: #152743; text-shadow: 0 0 5px rgba(0,0,0,0.5); }
            .cpan-score-text strong { font-weight: 700; color: #3498db; }
            .cpan-help-icon { font-family: 'Space Grotesk', monospace; font-weight: 700; font-size: 0.8em; color: #FFFFFF; background-color: #3498db; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
            .cpan-help-icon:hover { transform: scale(1.1); box-shadow: 0 0 10px rgba(52, 152, 219, 0.7); }
            .cpan-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(21, 39, 67, 0.7); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease-in-out; }
            .cpan-modal-overlay.visible { opacity: 1; }
            .cpan-modal-content { font-family: 'Space Grotesk', sans-serif; background-color: #F4F6F8; padding: 0; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); width: 90%; max-width: 550px; position: relative; transform: scale(0.95); transition: transform 0.3s ease-in-out; overflow: hidden;}
            .cpan-modal-overlay.visible .cpan-modal-content { transform: scale(1); }
            .cpan-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background-color: #EAECEE; border-bottom: 1px solid #DDE3E9; font-size: 1.5em; font-weight: 700; color: #152743; }
            .cpan-global-config-icon, .cpan-back-icon { cursor: pointer; color: #7f8c8d; transition: color 0.2s, transform 0.3s; }
            .cpan-global-config-icon:hover { color: #1D2B3A; transform: rotate(45deg); }
            .cpan-back-icon { margin-right: 15px; }
            .cpan-back-icon:hover { color: #1D2B3A; transform: translateX(-3px); }
            #cpan-edit-title { align-items: center; }
            .cpan-modal-body { padding: 15px 25px 25px 25px; }
            .cpan-modal-body hr { border: none; height: 1px; background-color: #DDE3E9; margin: 15px 0; }
            .cpan-modal-body h4, .cpan-modal-body h5 { font-size: 1.1em; color: #2c3e50; margin-top: 15px; margin-bottom: 10px; display: flex; align-items: center; }
            #cpan-member-status-toggle { cursor: pointer; justify-content: flex-start; }
            #cpan-status-chevron { transition: transform 0.3s; }
            .cpan-toggle-title { display: flex; align-items: center; gap: 8px; }
            .cpan-modal-body ul { list-style-type: none; padding-left: 0; margin: 0; }
            .cpan-modal-body li { background-color: #EAECEE; padding: 8px 12px; border-radius: 4px; margin-bottom: 6px; font-size: 0.95em; display: flex; align-items: center; }
            .cpan-modal-body li > i { margin-right: 10px; font-size: 1.2em; width: 20px; text-align: center; }
            .cpan-icon-played { color: #27ae60; }
            .cpan-icon-not-played { color: #c0392b; }
            .cpan-modal-body p { font-size: 1em; color: #34495E; line-height: 1.6; margin: 0 0 12px 0; }
            .cpan-modal-body strong { font-weight: 700; color: #3498db; }
            #cpan-edit-config-view label { display: block; margin-top: 10px; margin-bottom: 5px; font-size: 0.9em; color: #34495E; font-weight: bold; }
            #cpan-edit-config-view input[type="text"], #cpan-edit-config-view textarea { width: 98%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; background-color: #fff; }
            .cpan-button-group { text-align: right; margin-top: 15px; }
            .cpan-modal-btn { padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s ease; margin-left: 10px;}
            .cpan-modal-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .cpan-modal-btn-primary { background-color: #1D2B3A; color: white; border: 1px solid #1D2B3A; }
            .cpan-modal-btn-primary:hover { background-color: #2C3E50; }
        `;
        document.head.appendChild(style);
    }

    const observer = new MutationObserver((mutations, obs) => {
        const table = document.querySelector('.hitlist.challenges-list');
        const placementAnchor = document.querySelector('#federation-select') || document.querySelector('.top-pane__name-score');

        if (table && placementAnchor) {
            runClashAnalysis();
            applyStyles();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();