// ==UserScript==
// @name         Torn Log Hustling
// @namespace    https://github.com/SOLiNARY
// @version      0.3.1
// @description  Logs detailed info about all hustling attempts.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478776/Torn%20Log%20Hustling.user.js
// @updateURL https://update.greasyfork.org/scripts/478776/Torn%20Log%20Hustling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const levelsImagePxGap = 35;
    const levelsArray = [[1], generateNumberRange(2, 24), generateNumberRange(25, 49), generateNumberRange(50, 74), generateNumberRange(75, 99)];
    const actions = ['Gather', 'Demo', 'Hype', 'Lose', 'Win'];
    let attached = false;
    let userId = 'N/A';

    if (!isTampermonkeyEnabled) {
        console.error('[TornLogHustling] Please, install Tampermonkey first!');
        alert('[TornLogHustling] Please, install Tampermonkey first!');
        return;
    }

    const styles = `
    div.crimeSlider___uha7d > div.previousCrime___gxp9r, div.currentCrime___KNKYQ, div.nextCrime___uKnJr {
        transition-duration: 0ms !important;
    }`;
    GM_addStyle(styles);

    try {
        if (isMobileView) {
            const inputString = document.querySelector('img.mini-avatar-image').src;
            const regex = /(\d+)\.jpg$/;
            const match = inputString.match(regex);
            if (match) {
                userId = match[1];
            }
        } else {
            const userLink = document.querySelector('#sidebarroot div.user-information___VBSOk p.menu-info-row___YG31c > a').href;
            userId = userLink.split("=")[1];
        }
    } catch (e) {
        userId = 'N/A';
    }

    addExportButton(document.querySelector('div.crimes-app div.topSection___U7sVi div.titleContainer___QrlWP'));

    const targetNode = document.querySelector("div.crimes-app");
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const crimesDiv = document.querySelectorAll("div.crimes-app");
        const currentCrimeDiv = document.querySelectorAll("div.currentCrime___KNKYQ");
        for (const mutation of mutationsList) {
            let mutationTarget = mutation.target;
            if (!attached && mutation.type === 'childList' && mutationTarget.className == 'crime-root hustling-root') {
                if (document.querySelector('div.currentCrime___KNKYQ div.title___MqBua') == null) {
                    continue;
                }
                attached = true;
                crimesDiv.forEach((div) => {
                    div.addEventListener("click", function (event) {
                        if (event.target.matches("div.topSection___U7sVi div.linksContainer___LiOTN")) {
                            handleSwitchPage();
                        }
                    });
                });
                currentCrimeDiv.forEach((div) => {
                    div.addEventListener("click", function (event) {
                        if (event.target.matches("div.topSection___HchKK div.crimeBanner___LiKtj div.crimeSliderArrowButtons___N_y4N button.arrowButton___gYTVW")) {
                            handleSwitchPage();
                        }
                    });
                });
                const hustlingRoot = document.querySelector('div.crime-root.hustling-root');
                const gatherBtn = document.querySelectorAll('.crimeOptionGroup___gQ6rI')[0].querySelector('button.commitButton___uX7k_');
                $(mutationTarget).on("click", "button.commitButton___uX7k_:not(.silmaril-log-hustling)", async function(event){
                    const now = document.querySelector('span.server-date-time').textContent.split(' ');
                    const date = now[3];
                    const time = now[1];
                    const skillLevelBefore = getCurrentSkillLevelValue();
                    const audienceBefore = getAudience();

                    const button = findNearestButtonParent(event.target);
                    const action = button.ariaLabel;
                    const row = button.parentNode.parentNode;
                    const shillBalanceBefore = getCurrentShillBalance();
                    const pickpocketBalanceBefore = getCurrentPickpocketBalance();
                    let game = '';
                    let target = '';
                    let techLevel = '';
                    let techSkillBefore = '';
                    try {
                        switch (action) {
                            case 'Gather, 4 nerve':
                                break;
                            case 'Demo, 2 nerve':
                            case 'Hype, 2 nerve':
                            case 'Lose, 2 nerve':
                            case 'Win, 2 nerve':
                                game = isMobileView ? row.querySelector('div.titleAndBet___JgIty > span').textContent : row.querySelector('div.crimeOptionSection___hslpu.title___u67Sn').textContent;
                                techLevel = row.querySelector('div.techniqueBar___JaXl6').ariaLabel;
                                techSkillBefore = getCurrentTechSkill(row);
                                break;
                            case 'Recruit, 4 nerve':
                            case 'Collect, 2 nerve':
                                target = isMobileView ? row.querySelector('div.titleAndBet___JgIty > span').textContent : row.querySelector('div.crimeOptionSection___hslpu.titleSection___Se0RD').textContent;
                                break;
                            default:
                                break;
                        }
                    } catch (e) {
                        console.error('[TornLogHustling] Error while parsing action', action, e);
                    }

                    while (row.nextElementSibling.querySelector('div.outcomeReward___E34U7:not(.silmaril-log-hustling-parsed)') == null) {
                        await sleep(20);
                    }

                    const outcomeRewardDiv = row.nextElementSibling.querySelector('div.outcomeReward___E34U7');
                    const result = outcomeRewardDiv.querySelector('p.title___IrNe6').textContent;
                    const gained = [];
                    if (outcomeRewardDiv.querySelector('div.rewards___oRCyz span.reward___dCLvW') != null) {
                        const money = outcomeRewardDiv.querySelector('div.rewards___oRCyz span.reward___dCLvW').textContent;
                        gained.push(money);
                    }
                    try {
                        gained.push(outcomeRewardDiv.querySelector('div.rewards___oRCyz div.reward___Tvvmx').textContent);
                    } catch (e) {
                        console.log('[TornLogHustling] No reward string parsed');
                    }
                    try {
                        gained.push(outcomeRewardDiv.querySelector('div.rewards___oRCyz div.reward___OmEOo').textContent);
                    } catch (e) {
                        console.log('[TornLogHustling] No crit fail injury string parsed');
                    }
                    try {
                        gained.push(outcomeRewardDiv.querySelector('div.rewards___oRCyz div.reward___snxxf').textContent);
                    } catch (e) {
                        console.log('[TornLogHustling] No crit fail jail string parsed');
                    }

                    outcomeRewardDiv
                        .querySelectorAll('div.rewards___oRCyz div.reward___P7K87 img')
                        .forEach(item => {
                        try {
                            gained.push(item.alt);
                        } catch (e) {
                            console.error('[TornLogHustling] Error while parsing non-ammo rewards:', item, e);
                        }
                    });
                    outcomeRewardDiv
                        .querySelectorAll('div.rewards___oRCyz div.reward___oQH1h')
                        .forEach(item => {
                        try {
                            let ammoQuantity = item.querySelector('div.itemCell___aZaUE.countCell___XzhYQ span.count___hBmtm').textContent;
                            let ammoCodeX = (Math.abs(parseInt(item.querySelector('div.ammoImage___tebhe').style.backgroundPositionX))/70).toFixed(0);
                            let ammoCodeY = (Math.abs(parseInt(item.querySelector('div.ammoImage___tebhe').style.backgroundPositionY))/70).toFixed(0);
                            gained.push(`${ammoQuantity} ammo of type ${ammoCodeX}-${ammoCodeY}`);
                        } catch (e) {
                            console.error('[TornLogHustling] Error while parsing ammo rewards:', item, e);
                        }
                    });
                    outcomeRewardDiv.classList.add('silmaril-log-hustling-parsed');
                    const skillLevelAfter = getCurrentSkillLevelValue();

                    let techSkillAfter = '';
                    const shillBalanceAfter = getCurrentShillBalance();
                    const pickpocketBalanceAfter = getCurrentPickpocketBalance();
                    switch (action) {
                        case 'Demo, 2 nerve':
                        case 'Hype, 2 nerve':
                        case 'Lose, 2 nerve':
                        case 'Win, 2 nerve':
                            techSkillAfter = getCurrentTechSkill(row);
                            break;
                        case 'Gather, 4 nerve':
                        case 'Recruit, 4 nerve':
                        case 'Collect, 2 nerve':
                        default:
                            break;
                    }

                    const audienceAfter = getAudience();
                    const progressionBonus = document.querySelector('div.statsColumn___ATsSP > button.statistic___jgFf2:nth-child(3) > span.value___FdkAT').textContent;
                    const version = GM_info.script.version;

                    const hustleAttempt = new HustleAttempt(userId, date, time, action, game, skillLevelBefore, skillLevelAfter, techLevel, techSkillBefore, techSkillAfter, audienceBefore, audienceAfter, target, shillBalanceBefore, shillBalanceAfter, pickpocketBalanceBefore, pickpocketBalanceAfter, result, gained, progressionBonus, version);
                    const dateSplit = date.split('/');
                    const timeStampFormatted = `${dateSplit[2]}${dateSplit[1]}${dateSplit[0]}${time.replaceAll(':','')}`;
                    const newGuid = generateGuid();
                    GM_setValue(`silmaril-torn-log-hustling-attempt-${timeStampFormatted}-${newGuid}`, hustleAttempt);
                    updateLogsCount();
                });

                observer.disconnect();
            }
        }
    });
    setUpObserver();

    function handleSwitchPage() {
        attached = false;
        setUpObserver();
    }

    function getAudience() {
        let audience = '';
        try {
            audience = document.querySelector('div.crimeOptionSection___hslpu.audienceSection___f3jVs > span.srOnly___Nqywa').textContent;
        } catch (e) {
            console.error('[TornLogHustling] Error while parsing audience:', e);
            audience = 'Error';
        }
        return audience;
    }

    function addExportButton(root) {
        const outerExportDiv = document.createElement('div');
        outerExportDiv.className = 'title___MqBua';
        const exportButton = document.createElement('button');
        exportButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-hustling silmaril-log-hustling-export';
        exportButton.ariaLabel = 'Copy Hustling logs';
        const exportButtonLabel = document.createElement('span');
        exportButtonLabel.className = 'title___KAQ9m';
        exportButtonLabel.textContent = isMobileView ? 'Copy logs' : 'Copy Hustling logs';
        const exportButtonDivider = document.createElement('span');
        exportButtonDivider.className = 'divider___RGx7a';
        const exportButtonLogCount = document.createElement('span');
        exportButtonLogCount.className = 'nerveCost___OoGfz';
        exportButtonLogCount.textContent = getAllLogsCount();
        exportButton.append(exportButtonLabel, exportButtonDivider, exportButtonLogCount);
        exportButton.addEventListener('click', exportLogs);

        const outerClearDiv = document.createElement('div');
        outerClearDiv.className = 'title___MqBua';
        const clearButton = document.createElement('button');
        clearButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-hustling silmaril-log-hustling-clear';
        clearButton.ariaLabel = 'Clear Hustling logs';
        const clearButtonLabel = document.createElement('span');
        clearButtonLabel.textContent = isMobileView ? 'Clear logs' : 'Clear Hustling logs';
        clearButton.appendChild(clearButtonLabel);
        clearButton.addEventListener('click', clearLogs);

        outerExportDiv.append(exportButton);
        outerClearDiv.append(clearButton);

        root.append(outerExportDiv, outerClearDiv);

        const backButton = document.querySelector('div.topSection___U7sVi > div.linksContainer___LiOTN');
        backButton.addEventListener('click', function(){
            attached = false;
            setUpObserver();
        });
    }

    function setUpObserver() {
        observer.observe(targetNode, observerConfig);
    }

    function updateLogsCount(reset = false) {
        const countSpan = document.querySelector('button.silmaril-log-hustling-export > span.nerveCost___OoGfz');
        const count = reset ? 0 : parseInt(countSpan.textContent) + 1;
        countSpan.textContent = count;
    }

    function exportLogs() {
        let logs = getAllLogs();
        let logsRaw = JSON.stringify(logs);
        GM_setClipboard(logsRaw, 'json');
        const exportText = document.querySelector('button.silmaril-log-hustling-export > span.title___KAQ9m');
        exportText.textContent = isMobileView ? 'Copied!' : 'Copied to clipboard!';
        setTimeout(function(){exportText.textContent = isMobileView ? 'Copy logs' : 'Copy Hustling logs';}, 2500);
    }

    function clearLogs() {
        deleteAllLogs();
        updateLogsCount(true);
        const clearText = document.querySelector('button.silmaril-log-hustling-clear > span');
        clearText.textContent = isMobileView ? 'Cleared!' : 'Cleared all logs!';
        setTimeout(function(){clearText.textContent = isMobileView ? 'Clear logs' : 'Clear Hustling logs';}, 2500);
    }

    function getAllLogs() {
        const prefix = 'silmaril-torn-log-hustling-attempt-';
        const filteredRecords = {};
        const allKeys = GM_listValues();
        allKeys.forEach((key) => {
            if (key.startsWith(prefix)) {
                filteredRecords[key] = GM_getValue(key);
            }
        });
        return filteredRecords;
    }

    function getAllLogsCount() {
        const allLogsCount = Object.keys(GM_listValues()).length;
        return allLogsCount;
    }

    function deleteAllLogs() {
        const allKeys = GM_listValues();
        allKeys.forEach((key) => {
            GM_deleteValue(key);
        });
    }

    function getCurrentSkillLevelValue() {
        let currentSkillLevel = -1;
        if (document.querySelector('div.maxLevel___jTooz') == null) {
            const skillLevelDiv = document.querySelector('div.level___tAlsk');
            const levelFirstIndex = Math.abs(parseInt(skillLevelDiv.style.backgroundPositionX, 10)) / levelsImagePxGap;
            const levelSecondIndex = Math.abs(parseInt(skillLevelDiv.style.backgroundPositionY, 10)) / levelsImagePxGap;
            const skillLevelBefore = levelsArray[levelFirstIndex][levelSecondIndex];
            const skillProgressBar = document.querySelector('div.progressFill___ksrq5');
            const skillPercentageBefore = parseInt(skillProgressBar.style.width, 10) + (parseInt(skillProgressBar.style.left, 10) ?? -100);
            currentSkillLevel = skillLevelBefore + skillPercentageBefore / 100;
        } else {
            currentSkillLevel = 100;
        }
        return parseFloat(currentSkillLevel.toFixed(2));
    }

    function getCurrentShillBalance() {
        try {
            const hirelingsDiv = document.querySelectorAll('div.crimeOptionGroup___gQ6rI')[2];
            return hirelingsDiv.querySelector('div.crime-option:nth-child(1) > div.sections___tZPkg > div.crimeOptionSection___hslpu.mainSection___STO9B').textContent;
        } catch (e) {
            console.error('[TornLogHustling] Error while parsing shill balance', e);
            return "Can't parse";
        }
    }

    function getCurrentPickpocketBalance() {
        try {
            const hirelingsDiv = document.querySelectorAll('div.crimeOptionGroup___gQ6rI')[2];
            return hirelingsDiv.querySelector('div.crime-option:nth-child(2) > div.sections___tZPkg > div.crimeOptionSection___hslpu.mainSection___STO9B').textContent;
        } catch (e) {
            console.error('[TornLogHustling] Error while parsing pickpocket balance', e);
            return "Can't parse";
        }
    }

    function getCurrentTechSkill(element) {
        console.log('getCurrentTechSkill', element);
        let techSkill = '';
        const techSkillBar = element.querySelector('div.techniqueBar___JaXl6');
        try {
            const computedStyle = getComputedStyle(techSkillBar);
            techSkill = computedStyle.getPropertyValue('--progress');
        } catch (e) {
            console.error('[TornLogHustling] Error while parsing tech skill level', e);
            techSkill = "Can't parse";
        }
        return techSkill;
    }

    function findNearestButtonParent(element) {
        let currentElement = element;
        while (currentElement && currentElement.tagName !== 'BUTTON') {
            currentElement = currentElement.parentNode;
        }
        return currentElement;
    }

    function getTextValueWithoutChildren(element) {
        let text = '';
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            }
        }
        return text.trim();
    }

    function generateGuid() {
        const crypto = window.crypto || window.msCrypto;

        if (!crypto) {
            return Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
        }

        const data = new Uint16Array(8);
        crypto.getRandomValues(data);

        data[3] = (data[3] & 0x0fff) | 0x4000; // Version 4
        data[4] = (data[4] & 0x3fff) | 0x8000; // Variant 10

        const guid = Array.from(data)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

        return (
            guid.substr(0, 8) + '-' +
            guid.substr(8, 4) + '-' +
            guid.substr(12, 4) + '-' +
            guid.substr(16, 4) + '-' +
            guid.substr(20, 12)
        );
    }

    function generateNumberRange(start, end) {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    class HustleAttempt {
        constructor(playerId, date, time, action, game, skillBefore, skillAfter, techLevel, techSkillBefore, techSkillAfter, audienceBefore, audienceAfter, target, shillBalanceBefore, shillBalanceAfter, pickpocketBalanceBefore, pickpocketBalanceAfter, result, gained, progressionBonus, version) {
            this.playerId = playerId;
            this.date = date;
            this.time = time;
            this.action = action;
            this.game = game;
            this.skillBefore = skillBefore;
            this.skillAfter = skillAfter;
            this.audienceBefore = audienceBefore;
            this.audienceAfter = audienceAfter;
            this.techLevel = techLevel;
            this.techSkillBefore = techSkillBefore;
            this.techSkillAfter = techSkillAfter;
            this.target = target;
            this.shillBalanceBefore = shillBalanceBefore;
            this.shillBalanceAfter = shillBalanceAfter;
            this.pickpocketBalanceBefore = pickpocketBalanceBefore;
            this.pickpocketBalanceAfter = pickpocketBalanceAfter;
            this.result = result;
            this.gained = gained;
            this.progressionBonus = progressionBonus;
            this.version = version;
        }
    }
})();