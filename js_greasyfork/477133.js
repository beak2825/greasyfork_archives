// ==UserScript==
// @name         Torn Log Pickpocketing
// @namespace    https://github.com/SOLiNARY
// @version      0.4
// @description  Logs detailed info about all pickpocketing attempts.
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
// @downloadURL https://update.greasyfork.org/scripts/477133/Torn%20Log%20Pickpocketing.user.js
// @updateURL https://update.greasyfork.org/scripts/477133/Torn%20Log%20Pickpocketing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const levelsImagePxGap = 35;
    const levelsArray = [[1], generateNumberRange(2, 24), generateNumberRange(25, 49), generateNumberRange(50, 74), generateNumberRange(75, 99)];
    const activities = ['Cycling', 'Distracted', 'Talking?', 'Listening to music', 'Loitering', 'On Phone', 'Running/Jogging', 'Soliciting', 'Stumbling', 'Walking', 'Begging'];
    let attached = false;
    let userId = 'N/A';

    if (!isTampermonkeyEnabled) {
        console.error('[TornLogPickpocketing] Please, install Tampermonkey first!');
        alert('[TornLogPickpocketing] Please, install Tampermonkey first!');
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
            if (!attached && mutation.type === 'childList' && mutationTarget.className == 'crime-root pickpocketing-root') {
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
                const pickpocketingRoot = document.querySelector('div.crime-root.pickpocketing-root');
                $(mutationTarget).on("click", "button.commitButton___uX7k_:not(.silmaril-log-pickpocketing)", async function(event){
                    const now = document.querySelector('span.server-date-time').textContent.split(' ');
                    const date = now[3];
                    const time = now[1];
                    const skillLevelBefore = getCurrentSkillLevelValue();
                    const button = findNearestButtonParent(event.target);
                    const row = button.parentNode.parentNode;
                    const markName = row.querySelector('div.titleAndProps___DdeVu div').innerText;
                    const markBuildText = row.querySelector('div.titleAndProps___DdeVu button').innerText;
                    const markBuildArray = markBuildText.split(' ');
                    const markBuild = markBuildArray[0];
                    let markHeight, markWeight;
                    if (markBuildText.indexOf(' kg') >= 0) {
                        markHeight = `${markBuildArray[1]} ${markBuildArray[2]}`;
                        markWeight = `${markBuildArray[3]} ${markBuildArray[4]}`;
                    } else {
                        markHeight = markBuildArray[1];
                        markWeight = `${markBuildArray[2]} ${markBuildArray[3]}`;
                    }
                    let markActivity = 'N/A';
                    try {
                        markActivity = isMobileView
                            ? activities[Math.abs(parseInt(row.querySelector('div.activity___e7mdA div.icon___VfCk2').style.backgroundPositionY, 10)) / 34]
                        : getTextValueWithoutChildren(row.querySelector('div.activity___e7mdA'));
                    } catch (e) {
                        console.error('[TornLogPickpocketing] Error while parsing activity:', row, e);
                    }

                    while (row.nextElementSibling.querySelector('div.outcomeReward___E34U7') == null) {
                        await sleep(20);
                    }

                    const outcomeRewardDiv = row.nextElementSibling.querySelector('div.outcomeReward___E34U7');
                    const result = outcomeRewardDiv.querySelector('p.title___IrNe6').textContent;
                    const gained = [];
                    if (outcomeRewardDiv.querySelector('div.rewards___oRCyz span.reward___dCLvW') != null) {
                        const money = outcomeRewardDiv.querySelector('div.rewards___oRCyz span.reward___dCLvW').textContent;
                        gained.push(money);
                    }
                    outcomeRewardDiv
                        .querySelectorAll('div.rewards___oRCyz div.reward___P7K87 img')
                        .forEach(item => {
                        try {
                            gained.push(item.alt);
                        } catch (e) {
                            console.error('[TornLogPickpocketing] Error while parsing non-ammo rewards:', item, e);
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
                            console.error('[TornLogPickpocketing] Error while parsing ammo rewards:', item, e);
                        }
                    });
                    const skillLevelAfter = getCurrentSkillLevelValue();
                    const progressionBonus = document.querySelector('div.statsColumn___ATsSP > button.statistic___jgFf2:nth-child(3) > span.value___FdkAT').textContent;
                    const version = GM_info.script.version;

                    const pickPocketAttempt = new PickPocketAttempt(userId, date, time, skillLevelBefore, skillLevelAfter, markName, markBuild, markHeight, markWeight, markActivity, result, gained, progressionBonus, version);
                    const dateSplit = date.split('/');
                    const timeStampFormatted = `${dateSplit[2]}${dateSplit[1]}${dateSplit[0]}${time.replaceAll(':','')}`;
                    const newGuid = generateGuid();
                    GM_setValue(`silmaril-torn-log-pickpocketing-attempt-${timeStampFormatted}-${newGuid}`, pickPocketAttempt);
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

    function addExportButton(root) {
        const outerExportDiv = document.createElement('div');
        outerExportDiv.className = 'title___MqBua';
        const exportButton = document.createElement('button');
        exportButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-pickpocketing silmaril-log-pickpocketing-export';
        exportButton.ariaLabel = 'Copy PickPocket logs';
        const exportButtonLabel = document.createElement('span');
        exportButtonLabel.className = 'title___KAQ9m';
        exportButtonLabel.textContent = isMobileView ? 'Copy logs' : 'Copy PickPocket logs';
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
        clearButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-pickpocketing silmaril-log-pickpocketing-clear';
        clearButton.ariaLabel = 'Clear PickPocket logs';
        const clearButtonLabel = document.createElement('span');
        clearButtonLabel.textContent = isMobileView ? 'Clear logs' : 'Clear PickPocket logs';
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
        const countSpan = document.querySelector('button.silmaril-log-pickpocketing-export > span.nerveCost___OoGfz');
        const count = reset ? 0 : parseInt(countSpan.textContent) + 1;
        countSpan.textContent = count;
    }

    function exportLogs() {
        let logs = getAllLogs();
        let logsRaw = JSON.stringify(logs);
        GM_setClipboard(logsRaw, 'json');
        const exportText = document.querySelector('button.silmaril-log-pickpocketing-export > span.title___KAQ9m');
        exportText.textContent = isMobileView ? 'Copied!' : 'Copied to clipboard!';
        setTimeout(function(){exportText.textContent = isMobileView ? 'Copy logs' : 'Copy PickPocket logs';}, 2500);
    }

    function clearLogs() {
        deleteAllLogs();
        updateLogsCount(true);
        const clearText = document.querySelector('button.silmaril-log-pickpocketing-clear > span');
        clearText.textContent = isMobileView ? 'Cleared!' : 'Cleared all logs!';
        setTimeout(function(){clearText.textContent = isMobileView ? 'Clear logs' : 'Clear PickPocket logs';}, 2500);
    }

    function getAllLogs() {
        const prefix = 'silmaril-torn-log-pickpocketing-attempt-';
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

    class PickPocketAttempt {
        constructor(playerId, date, time, skillBefore, skillAfter, markName, markBuild, markHeight, markWeight, markActivity, result, gained, progressionBonus, version) {
            this.playerId = playerId;
            this.date = date;
            this.time = time;
            this.skillBefore = skillBefore;
            this.skillAfter = skillAfter;
            this.markName = markName;
            this.markBuild = markBuild;
            this.markHeight = markHeight;
            this.markWeight = markWeight;
            this.markActivity = markActivity;
            this.result = result;
            this.gained = gained;
            this.progressionBonus = progressionBonus;
            this.version = version;
        }
    }
})();