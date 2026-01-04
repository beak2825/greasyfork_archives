// ==UserScript==
// @name         Torn Log Cracking
// @namespace    https://github.com/SOLiNARY
// @version      0.1.13
// @description  Logs detailed info about all cracking attempts.
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
// @downloadURL https://update.greasyfork.org/scripts/482698/Torn%20Log%20Cracking.user.js
// @updateURL https://update.greasyfork.org/scripts/482698/Torn%20Log%20Cracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const levelsImagePxGap = 35;
    const levelsArray = [[1], generateNumberRange(2, 24), generateNumberRange(25, 49), generateNumberRange(50, 74), generateNumberRange(75, 99)];
    const actions = ['Brute force', 'Crack'];
    let attached = false;
    let userId = 'N/A';

    if (!isTampermonkeyEnabled) {
        console.error('[TornLogCracking] Please, install Tampermonkey first!');
        alert('[TornLogCracking] Please, install Tampermonkey first!');
        return;
    }

    const styles = `
    div.crimeSlider___uha7d > div.previousCrime___gxp9r, div.currentCrime___KNKYQ, div.nextCrime___uKnJr {
        transition-duration: 0ms !important;
    }

    div.silmarilPopOutText {
      position: absolute;
      color: #37b24d;
      font-size: 16px;
      display: none;
      user-select: none;
      pointer-events: none;
      text-shadow: 0.5px 0.5px 0.5px black, 0 0 1em black, 0 0 0.2em black;
    }`;
    GM_addStyle(styles);

    try {
        userId = document.cookie.split('; ').filter( x => x.startsWith('uid=') )[0].split('=')[1];
    } catch (e) {
        userId = 'N/A';
    }

    addExportButton(document.querySelector('div.crimes-app div[class*=appHeader___]'));

    const targetNode = document.querySelector("div.crimes-app");
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const crimesDiv = document.querySelectorAll("div.crimes-app");
        const currentCrimeDiv = document.querySelectorAll("div[class*=currentCrime___]");
        for (const mutation of mutationsList) {
            let mutationTarget = mutation.target;
            if (!attached && mutation.type === 'childList' && mutationTarget.className == 'crime-root cracking-root') {
                if (document.querySelector('div[class*=currentCrime___] div[class*=title___]') == null) {
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
                $(mutationTarget).on("click", "button.commitButton___NYsg8:not(.silmaril-log-cracking)", async function(event){
                    try {
                        console.log('muta click', mutationTarget, event);
                        const now = document.querySelector('span.server-date-time').textContent.split(' ');
                        const date = now[3];
                        const time = now[1];
                        const skillLevelBefore = getCurrentSkillLevelValueV2();

                        const button = findNearestButtonParent(event.target);
                        const action = button.ariaLabel;
                        const row = button.parentNode.parentNode;
                        let passwordLength = '';
                        let passwordBefore = '';

                        try {
                            switch (action) {
                                case 'Brute force, 7 nerve':
                                case 'Crack, 5 nerve': {
                                    const passwordChars = isMobileView ? row.querySelectorAll('div.tabletPassword___hnzbl > div:not(.charSlotDummy___s11h5)') : row.querySelectorAll('div.desktopPasswordSection___tucU6 > div:not(.charSlotDummy___s11h5)');
                                    passwordLength = passwordChars.length;
                                    passwordBefore = getCurrentPassword(passwordChars);
                                    break;
                                }
                                default:
                                    break;
                            }
                        } catch (e) {
                            console.error('[TornLogCracking] Error while parsing action', action, e);
                        }

                        while (row.nextElementSibling.querySelector('div.outcomeReward___E34U7:not(.silmaril-log-cracking-parsed)') == null) {
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
                            console.log('[TornLogCracking] No reward string parsed');
                        }
                        try {
                            gained.push(outcomeRewardDiv.querySelector('div.rewards___oRCyz div.reward___OmEOo').textContent);
                        } catch (e) {
                            console.log('[TornLogCracking] No crit fail injury string parsed');
                        }
                        try {
                            gained.push(outcomeRewardDiv.querySelector('div.rewards___oRCyz div.reward___snxxf').textContent);
                        } catch (e) {
                            console.log('[TornLogCracking] No crit fail jail string parsed');
                        }

                        outcomeRewardDiv
                            .querySelectorAll('div.rewards___oRCyz div.reward___P7K87 img')
                            .forEach(item => {
                            try {
                                gained.push(item.alt);
                            } catch (e) {
                                console.error('[TornLogCracking] Error while parsing non-ammo rewards:', item, e);
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
                                console.error('[TornLogCracking] Error while parsing ammo rewards:', item, e);
                            }
                        });
                        outcomeRewardDiv.classList.add('silmaril-log-cracking-parsed');
                        const skillLevelAfter = getCurrentSkillLevelValueV2();

                        let passwordAfter = '';
                        switch (action) {
                            case 'Brute force, 7 nerve':
                            case 'Crack, 5 nerve': {
                                const passwordChars = isMobileView ? row.querySelectorAll('div.tabletPassword___hnzbl > div:not(.charSlotDummy___s11h5)') : row.querySelectorAll('div.desktopPasswordSection___tucU6 > div:not(.charSlotDummy___s11h5)');
                                passwordAfter = getCurrentPassword(passwordChars);
                                break;
                            }
                            default:
                                break;
                        }

                        const progressionBonus = document.querySelector('div[class*=statsColumn___] > button[class*=statistic___]:nth-child(3) > span[class*=value___]').textContent;
                        const version = GM_info.script.version;
                        // playerId, date, time, action, skillBefore, skillAfter, targetType, targetService, rigStatus, rigPower, rigMips, rigBruteForceStrength, rigOverheatedComponents, rigHottestComponent, result, gained, progressionBonus, version
                        const targetDiv = row.querySelector('div[class*=targetSection___] div[class*=typeAndServiceWrapper___] div[class*=typeAndService___]');
                        const targetType = targetDiv.querySelector('span[class*=type___]').innerText;
                        const targetService = targetDiv.querySelector('span[class*=service___]').innerText;

                        const rigDiv = document.querySelector('div[class*=rig___]');
                        const rigStatus = rigDiv.querySelector('div[class*=heading___] span[class*=status___]').innerText;
                        const rigPower = rigDiv.querySelector('div[class*=power___] span[class*=value___]').innerText;
                        const rigMips = rigDiv.querySelector('div[class*=statistic___][class*=mips___] span[class*=value___]').innerText;
                        const rigBruteForceStrength = rigDiv.querySelector('div[class*=statistic___][class*=strength___] span[class*=value___]').innerText;
                        const rigOverheatedComponents = rigDiv.querySelector('div[class*=statistic___][class*=overheated___] span[class*=value___]').innerText;
                        const rigHottestComponent = rigDiv.querySelector('div[class*=statistic___][class*=hottest___] span[class*=value___]').innerText;
                        let rigClockSpeed = '';
                        try {
                            const computedStyle = getComputedStyle(rigDiv.querySelector('div[class*=readOnlyKnob___]'));
                            rigClockSpeed = computedStyle.getPropertyValue('--position-on-bar');
                        } catch (e) {
                            rigClockSpeed = 'N/A';
                        }

                        const crackingAttempt = new CrackingAttempt(userId, date, time, action, skillLevelBefore, skillLevelAfter, targetType, targetService, passwordLength, passwordBefore, passwordAfter, rigStatus, rigPower, rigMips, rigBruteForceStrength, rigOverheatedComponents, rigHottestComponent, rigClockSpeed, result, gained, progressionBonus, version);
                        const dateSplit = date.split('/');
                        const timeStampFormatted = `${dateSplit[2]}${dateSplit[1]}${dateSplit[0]}${time.replaceAll(':','')}`;
                        const newGuid = generateGuid();
                        GM_setValue(`silmaril-torn-log-cracking-attempt-${timeStampFormatted}-${newGuid}`, crackingAttempt);
                        const logsTotal = updateLogsCount();
                        showPopOutText(`Logged +1! (${logsTotal})`, event.clientX, event.clientY);
                    } catch (e) {
                        console.error('[TornLogCracking] Error while constructing log', e);
                        showPopOutText('Not Logged!', event.clientX, event.clientY, false);
                    }
                });

                observer.disconnect();
            }
        }
    });
    setUpObserver();

    function getCurrentPassword(passwordChars) {
        let password = '';
        console.log('passwordChars', passwordChars);
        passwordChars.forEach((item, index) => {
            try {
                console.log('char item', item);
                const passChar = item.querySelector('span.discoveredChar___mmchE');
                if (passChar != null)
                {
                    password += passChar.innerText;
                } else {
                    password += item.querySelector('div.encryption1___w7tm_') != null ? '#' : '?';
                }

            }
            catch (e) {
                password += '!';
            }
        });
        console.log('password returned', password);
        return password;
    }

    function handleSwitchPage() {
        attached = false;
        setUpObserver();
    }

    function getRigInfo() {
    }

    function addExportButton(root) {
        const outerExportDiv = document.createElement('div');
        outerExportDiv.className = 'title___MqBua';
        const exportButton = document.createElement('button');
        exportButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-cracking silmaril-log-cracking-export';
        exportButton.ariaLabel = 'Copy Cracking logs';
        const exportButtonLabel = document.createElement('span');
        exportButtonLabel.className = 'title___KAQ9m';
        exportButtonLabel.textContent = isMobileView ? 'Copy logs' : 'Copy Cracking logs';
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
        clearButton.className = 'torn-btn commitButton___uX7k_ silmaril-log-cracking silmaril-log-cracking-clear';
        clearButton.ariaLabel = 'Clear Cracking logs';
        const clearButtonLabel = document.createElement('span');
        clearButtonLabel.textContent = isMobileView ? 'Clear logs' : 'Clear Cracking logs';
        clearButton.appendChild(clearButtonLabel);
        clearButton.addEventListener('click', clearLogs);

        outerExportDiv.append(exportButton);
        outerClearDiv.append(clearButton);

        root.append(outerExportDiv, outerClearDiv);

        const backButton = document.querySelector('div[class*=appHeader___] > a[class*=link___]');
        backButton.addEventListener('click', function(){
            attached = false;
            setUpObserver();
        });
    }

    function setUpObserver() {
        observer.observe(targetNode, observerConfig);
    }

    function updateLogsCount(reset = false) {
        const countSpan = document.querySelector('button.silmaril-log-cracking-export > span.nerveCost___OoGfz');
        const count = reset ? 0 : parseInt(countSpan.textContent) + 1;
        countSpan.textContent = count;
        return count;
    }

    function exportLogs() {
        let logs = getAllLogs();
        let logsRaw = JSON.stringify(logs);
        GM_setClipboard(logsRaw, 'json');
        const exportText = document.querySelector('button.silmaril-log-cracking-export > span.title___KAQ9m');
        exportText.textContent = isMobileView ? 'Copied!' : 'Copied to clipboard!';
        setTimeout(function(){exportText.textContent = isMobileView ? 'Copy logs' : 'Copy Cracking logs';}, 2500);
    }

    function clearLogs() {
        if (!confirm('Are you sure you want to clear the logs?\r\nMake sure to send them to Emforus first.')) {
            return;
        }
        deleteAllLogs();
        updateLogsCount(true);
        const clearText = document.querySelector('button.silmaril-log-cracking-clear > span');
        clearText.textContent = isMobileView ? 'Cleared!' : 'Cleared all logs!';
        setTimeout(function(){clearText.textContent = isMobileView ? 'Clear logs' : 'Clear Cracking logs';}, 2500);
    }

    function getAllLogs() {
        const prefix = 'silmaril-torn-log-cracking-attempt-';
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

    function getCurrentSkillLevelValueV2() {
        let skillLevel = 'N/A';
        try {
            skillLevel = document.querySelector('[class*=value___][class*=copyTrigger___]').textContent;
        } catch (e) {
            console.error('[TornLogCracking] Error while parsing skill level using v2', e);
            return skillLevel;
        }
        console.log('skillLevel parsed', skillLevel);
        return skillLevel;

    }

    function getCurrentSkillLevelValue() {
        let currentSkillLevel = -1;
        try {
            if (document.querySelector('div.maxLevel___jTooz') == null) {
                const computedStyle = getComputedStyle(document.querySelector('div.topSection___HchKK div.currentLevel___vCRVm div.number___L1VcJ'));
                const levelFirstIndex = Math.round(Math.abs(parseInt(computedStyle.getPropertyValue('background-position-x'), 10)) / levelsImagePxGap);
                const levelSecondIndex = Math.round(Math.abs(parseInt(computedStyle.getPropertyValue('background-position-y'), 10)) / levelsImagePxGap);
                const skillLevelBefore = levelsArray[levelFirstIndex][levelSecondIndex];
                const skillProgressBar = document.querySelector('div.progressFill___ksrq5');
                const skillPercentageBefore = parseInt(skillProgressBar.style.width, 10) + (parseInt(skillProgressBar.style.left, 10) ?? -100);
                currentSkillLevel = skillLevelBefore + skillPercentageBefore / 100;
            } else {
                currentSkillLevel = 100;
            }
        } catch (e) {
            console.error('[TornLogCracking] Error while parsing skill level', e);
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

    function showPopOutText(text, mouseX, mouseY, isSuccess = true, delay = 2000) {
        // Create pop-out text element
        let popOutText = document.createElement('div');
        popOutText.className = 'silmarilPopOutText';
        popOutText.style.color = isSuccess ? '#37b24d' : '#f03e3e';
        popOutText.innerText = text;

        // Append element to the body
        document.body.appendChild(popOutText);

        // Adjust for scroll position
        let scrollX = window.scrollX || window.pageXOffset;
        let scrollY = window.scrollY || window.pageYOffset;

        // Set random position within a specific radius
        let minAngle = 0.4; // Adjust this angle as needed
        let maxAngle = 0.6;
        let minRadius = 50; // Adjust this radius as needed
        let maxRadius = 250;
        let angle = (Math.random() * (maxAngle - minAngle) + minAngle) * Math.PI * 2;
        let radius = (Math.random() * (maxRadius - minRadius) + minRadius);
        let randomX = mouseX + Math.cos(angle) * radius + scrollX;
        let randomY = mouseY + Math.sin(angle) * radius + scrollY;

        // Set pop-out text position
        popOutText.style.left = randomX + 'px';
        popOutText.style.top = randomY + 'px';

        // Show pop-out text
        popOutText.style.display = 'block';

        // Fade away and disappear after a few seconds
        setTimeout(function() {
            popOutText.style.opacity = 0;
            setTimeout(function() {
                document.body.removeChild(popOutText);
            }, 500); // 500ms delay for removal after fade
        }, delay); // 2000ms (2 seconds) delay for fade
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    class CrackingAttempt {
        constructor(playerId, date, time, action, skillBefore, skillAfter, targetType, targetService, passwordLength, passwordBefore, passwordAfter, rigStatus, rigPower, rigMips, rigBruteForceStrength, rigOverheatedComponents, rigHottestComponent, rigClockSpeed, result, gained, progressionBonus, version) {
            this.playerId = playerId;
            this.date = date;
            this.time = time;
            this.action = action;
            this.skillBefore = skillBefore;
            this.skillAfter = skillAfter;
            this.targetType = targetType;
            this.targetService = targetService;
            this.passwordLength = passwordLength;
            this.passwordBefore = passwordBefore;
            this.passwordAfter = passwordAfter;
            this.rigStatus = rigStatus;
            this.rigPower = rigPower;
            this.rigMips = rigMips;
            this.rigBruteForceStrength = rigBruteForceStrength;
            this.rigOverheatedComponents = rigOverheatedComponents;
            this.rigHottestComponent = rigHottestComponent;
            this.rigClockSpeed = rigClockSpeed;
            this.result = result;
            this.gained = gained;
            this.progressionBonus = progressionBonus;
            this.version = version;
        }
    }
})();