// ==UserScript==
// @name         Elethor General Purpose
// @description  Provides some general additions to Elethor
// @namespace    https://www.elethor.com/
// @version      1.7.17
// @author       Xortrox
// @contributor  Kidel
// @contributor  Saya
// @contributor  Archeron
// @contributor  Hito
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419905/Elethor%20General%20Purpose.user.js
// @updateURL https://update.greasyfork.org/scripts/419905/Elethor%20General%20Purpose.meta.js
// ==/UserScript==

(function() {
    const currentUserData = {};

    const moduleName = 'Elethor General Purpose';
    const version = '1.7.9';

    const profileURL = '/profile/';

    function initializeXHRHook() {
        let rawSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function() {
            if (!this._hooked) {
                this._hooked = true;

                this.addEventListener('readystatechange', function() {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        setupHook(this);
                    }
                }, false);
            }
            rawSend.apply(this, arguments);
        }

        function setupHook(xhr) {
            if (window.elethorGeneralPurposeOnXHR) {
                const e = new Event('EGPXHR');
                e.xhr = xhr;

                window.elethorGeneralPurposeOnXHR.dispatchEvent(e);
            }
        }
        window.elethorGeneralPurposeOnXHR = new EventTarget();

        console.log(`[${moduleName} v${version}] XHR Hook initialized.`);
    }

    function initializeUserLoadListener() {
        elethorGeneralPurposeOnXHR.addEventListener('EGPXHR', function (e) {
            console.log('user load?:', e?.xhr?.responseURL);
            if (e && e.xhr
                && e.xhr.responseURL
                && e.xhr.responseURL.endsWith
                && e.xhr.responseURL.endsWith('/game/user')
            ) {
                try {
                    const userData = JSON.parse(e.xhr.responseText);

                    if (userData) {
                        for (const key of Object.keys(userData)) {
                            currentUserData[key] = userData[key];
                        }
                    }
                } catch (e) {
                    console.log(`[${moduleName} v${version}] Error parsing userData:`, e);
                }

            }
        });

        console.log(`[${moduleName} v${version}] User Load Listener initialized.`);
    }

    function initializeToastKiller() {
        document.addEventListener('click', function(e) {
            if (e.target
                && e.target.className
                && e.target.className.includes
                && e.target.className.includes('toasted toasted-primary')
            ) {
                e.target.remove();
            }
        });

        console.log(`[${moduleName} v${version}] Toast Killer initialized.`);
    }

    async function forceLoadUser() {
        const userLoad = await getUserSelf();
    }

    function initializeInventoryStatsLoadListener() {
        elethorGeneralPurposeOnXHR.addEventListener('EGPXHR', function (e) {
            if (e && e.xhr
                && e.xhr.responseURL
                && e.xhr.responseURL.endsWith
                && e.xhr.responseURL.endsWith('/game/inventory/stats')
            ) {
                setTimeout(async () => {
                    if (Object.keys(currentUserData).length === 0) {
                        await forceLoadUser();
                    }

                    updateEquipmentPercentageSummary();

                    setTimeout(updateInventoryStatsPercentages, 1000);
                });
            }
        });

        console.log(`[${moduleName} v${version}] Inventory Stats Load Listener initialized.`);
    }

    function updateEquipmentPercentageSummary() {
        document.querySelector('.contains-equipment>div>div:nth-child(1)').setAttribute('style', 'width: 50%');
        document.querySelector('.contains-equipment>div>div:nth-child(2)').setAttribute('style', 'width: 25%');
        let percentagesTable = document.querySelector('#egpPercentagesSummary')
        if (!percentagesTable){
            percentagesTable = document.querySelector('.contains-equipment>div>div:nth-child(2)').cloneNode(true);
            percentagesTable.setAttribute('style', 'width: 25%');
            percentagesTable.id='egpPercentagesSummary';
            document.querySelector('.contains-equipment>div').appendChild(percentagesTable);

            for (const child of percentagesTable.children[0].children) {
                if (child && child.children && child.children[0]) {
                    child.children[0].remove();
                }
            }

            document.querySelector('#egpPercentagesSummary>table>tr:nth-child(8)').setAttribute('style', 'height:43px');
        }
    }

    function getStatSummary(equipment) {
        const summary = {
            base: {},
            energizements: {}
        };

        if (equipment) {
            for (const key of Object.keys(equipment)) {
                const item = equipment[key];

                /**
                 * Sums base attributes by name
                 * */
                if (item && item.attributes) {
                    for (const attributeName of Object.keys(item.attributes)) {
                        const attributeValue = item.attributes[attributeName];

                        if (!summary.base[attributeName]) {
                            summary.base[attributeName] = 0;
                        }

                        summary.base[attributeName] += attributeValue;
                    }
                }

                /**
                 * Sums energizements by stat name
                 * */
                if (item && item.upgrade && item.upgrade.energizements) {
                    for (const energizement of item.upgrade.energizements) {
                        if (!summary.energizements[energizement.stat]) {
                            summary.energizements[energizement.stat] = 0;
                        }

                        summary.energizements[energizement.stat] += Number(energizement.boost);
                    }
                }
            }
        }

        return summary;
    }

    function updateInventoryStatsPercentages() {
        let percentagesTable = document.querySelector('#egpPercentagesSummary')
        if (percentagesTable && currentUserData && currentUserData.equipment){
            const statSummary = getStatSummary(currentUserData.equipment);

            const baseKeys = Object.keys(statSummary.base);
            const energizementKeys = Object.keys(statSummary.energizements);

            let allKeys = baseKeys.concat(energizementKeys);
            const filterUniques = {};
            for (const key of allKeys){
                filterUniques[key] = true;
            }
            allKeys = Object.keys(filterUniques);
            allKeys.sort();

            allKeys.push('actions');

            const tableRows = percentagesTable.children[0].children;

            for(const row of tableRows) {
                if (row
                    && row.children
                    && row.children[0]
                    && row.children[0].children[0]
                ) {
                    const rowText = row.children[0].children[0];
                    rowText.innerText = '';
                }
            }

            let rowIndex = 0;
            for (const key of allKeys) {
                if (key === 'puncture') {
                    continue;
                }

                const row = tableRows[rowIndex];
                if (row
                    && row.children
                    && row.children[0]
                    && row.children[0].children[0]
                ) {
                    const rowText = row.children[0].children[0];

                    const rowBase = statSummary.base[key] || 0;
                    const rowEnergizement = (statSummary.energizements[key] || 0);
                    const rowEnergizementPercentage = (statSummary.energizements[key] || 0) * 100;

                    if (key.startsWith('+')) {
                        rowText.innerText = `${key} per 10 levels: ${rowEnergizement}`;
                    } else if (key === 'actions') {
                        const actions = currentUserData.user.bonus_actions || 0;
                        rowText.innerText = `Bonus Actions: ${actions}`;
                    } else {
                        rowText.innerText = `${key}: ${rowBase} (${rowEnergizementPercentage.toFixed(0)}%)`;
                    }

                    rowIndex++;
                }
            }
        }
    }

    function initializeLocationChangeListener() {
        let previousLocation = window.location.href;

        window.elethorGeneralPurposeOnLocationChange = new EventTarget();

        window.elethorLocationInterval = setInterval(() => {
            if (previousLocation !== window.location.href) {
                previousLocation = window.location.href;

                const e = new Event('EGPLocation');
                e.newLocation = window.location.href;
                window.elethorGeneralPurposeOnLocationChange.dispatchEvent(e);
            }

        }, 500);

        console.log(`[${moduleName} v${version}] Location Change Listener initialized.`);
    }

    function getProfileCombatElement() {
        const skillElements = document.querySelectorAll('.is-round-skill .progressbar-text>div>p:first-child');
        const skillElements2 = document.querySelectorAll('.is-round-skill .progressbar-text>div>p:nth-child(2)');

        let index = 0;
        for (const skillElement of skillElements2) {
            if (skillElement.innerText?.toLowerCase().includes('combat')) {
                return skillElements[index].parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
            }
            index++;
        }
    }

    function getProfileMiningElement() {
        const skillElements = document.querySelectorAll('.is-round-skill .progressbar-text>div>p:first-child');
        const skillElements2 = document.querySelectorAll('.is-round-skill .progressbar-text>div>p:nth-child(2)');

        let index = 0;
        for (const skillElement of skillElements2) {
            if (skillElement.innerText?.toLowerCase().includes('mining')) {
                return skillElements[index].parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
            }
            index++;
        }
    }

    function updateXPTracker(difference) {
        const combatElement = getProfileCombatElement();
        if (combatElement) {
            if (difference.combat > 0) {
                combatElement.setAttribute('data-combat-experience-ahead', `(+${formatNormalNumber(difference.combat)})`);
                combatElement.setAttribute('style', `color:lime`);
            } else {
                combatElement.setAttribute('data-combat-experience-ahead', `(${formatNormalNumber(difference.combat)})`);
                combatElement.setAttribute('style', `color:red`);
            }
        }

        const miningElement = getProfileMiningElement();
        if (difference.mining > 0) {
            miningElement.setAttribute('data-mining-experience-ahead', `(+${formatNormalNumber(difference.mining)})`);
            miningElement.setAttribute('style', `color:lime`);
        } else {
            miningElement.setAttribute('data-mining-experience-ahead', `(${formatNormalNumber(difference.mining)})`);
            miningElement.setAttribute('style', `color:red`);
        }
    }

    function initializeProfileLoadListener() {
        let css = '[data-combat-experience-ahead]::after { content: attr(data-combat-experience-ahead); padding: 12px;}';
        css += '[data-mining-experience-ahead]::after { content: attr(data-mining-experience-ahead); padding: 12px;}';

        appendCSS(css);

        window.elethorGeneralPurposeOnLocationChange.addEventListener('EGPLocation', async function (e) {
            if (e && e.newLocation) {
                if(e.newLocation.includes('/profile/')) {
                    console.log('Profile view detected:', e);
                    const url = e.newLocation;
                    const path = url.substr(url.indexOf(profileURL));

                    // We know we have a profile lookup, and not user-data load if the length differs.
                    if (path.length > profileURL.length) {
                        const userId = Number(path.substr(path.lastIndexOf('/') + 1));

                        const difference = await getExperienceDifference(userId, currentUserData.user.id);

                        updateXPTracker(difference);
                    }
                }
            }
        });

        console.log(`[${moduleName} v${version}] Profile Load Listener initialized.`);
    }

    async function getUser(id) {
        const result = await window.axios.get(`/game/user/${id}?egpIgnoreMe=true`);
        return result.data;
    }

    window.getUser = getUser;

    async function getUserSelf() {
        const result = await window.axios.get(`/game/user`);
        return result.data;
    }

    window.getUserSelf = getUserSelf;

    async function getUserStats() {
        const result = await window.axios.get(`/game/inventory/stats`);
        return result.data;
    }

    window.getUserStats = getUserStats;

    async function getUserStatsJSON(pretty) {
        const stats = await getUserStats();

        if (pretty) {
            return JSON.stringify(stats, null, 2);
        }

        return JSON.stringify(stats);
    }

    window.getUserStatsJSON = getUserStatsJSON;

    function getUserCombatStats(user) {
        for (const skill of user.skills) {
            if (skill.name === 'combat') {
                return skill.pivot;
            }
        }
    }

    function getMiningStats(user) {
        for (const skill of user.skills) {
            if (skill.id === 1) {
                return skill.pivot;
            }
        }

        return 0;
    }

    async function getExperienceDifference(userId1, userId2) {
        const [user1, user2] = await Promise.all([
            getUser(userId1),
            getUser(userId2)
        ]);

        const combatStats1 = getUserCombatStats(user1);
        const miningStats1 = getMiningStats(user1);

        const combatStats2 = getUserCombatStats(user2);
        const miningStats2 = getMiningStats(user2);

        return {
            combat: combatStats2.experience - combatStats1.experience,
            mining: miningStats2.experience - miningStats1.experience,
        };
    }

    (async function run() {
        await waitForField(window, 'axios');
        forceLoadUser();
        initializeToastKiller();
        initializeXHRHook();
        initializeUserLoadListener();
        initializeInventoryStatsLoadListener();
        initializeLocationChangeListener();
        initializeProfileLoadListener();
        loadMarketRecyclobotVisualizer();

        console.log(`[${moduleName} v${version}] Loaded.`);
    })();

    (async function loadRerollDisableButtonModule() {
        async function waitForEcho() {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (window.Echo) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }

        await waitForEcho();
        await waitForUser();

        elethorGeneralPurposeOnXHR.addEventListener('EGPXHR', async function (e) {
            if (e && e.xhr && e.xhr.responseURL) {
                if(e.xhr.responseURL.includes('/game/energize')) {
                    const itemID = e.xhr.responseURL.substr(e.xhr.responseURL.lastIndexOf('/')+1);
                    window.lastEnergizeID = Number(itemID);
                }
            }
        });
    })();

    (async function loadResourceNodeUpdater() {
        await waitForField(currentUserData, 'user');
        const user = await getUser(currentUserData.user.id);

        function updateExperienceRates() {
            document.querySelectorAll('#nodeContainer>div:not(:first-child)').forEach(async (node) => {
                visualizeResourceNodeExperienceRates(node, user)
            });

            function visualizeResourceNodeExperienceRates(node, user) {
                const purity = getNodePurityPercentage(node, user);
                const density = getNodeDensityPercentage(node, user);
                const experience = getNodeExperience(node, density, user);
                const ore = 16;
                const experienceRate = experience?.toFixed(2);
                const oreRate = getOreRate(density, purity, ore);

                node.children[0].children[0].setAttribute('data-after', `${experienceRate} xp/h ${oreRate} ore/h`);
            }

            function getNodePurityPercentage(node, user) {
                const column = node.children[0].children[0].children[2];
                if (!column || !column.querySelectorAll('.font-bold')[0]) return;
                const label = column.querySelectorAll('.font-bold')[0].parentElement;
                let percentage = Number(label.innerText.replace('%','').split(':')[1]);

                let miningLevel = getMiningLevel(user);
                percentage = percentage + (miningLevel * 0.1);

                return percentage;
            }

            function getNodeDensityPercentage(node, user) {
                const column = node.children[0].children[0].children[1];
                if (!column || !column.querySelectorAll('.font-bold')[0]) return;
                const label = column.querySelectorAll('.font-bold')[0].parentElement;
                let percentage = Number(label.innerText.replace('%','').split(':')[1]);

                let miningLevel = getMiningLevel(user);
                percentage = percentage + (miningLevel * 0.1);

                return percentage;
            }

            function getNodeExperience(node, density, user) {
                /** Gets the Exp: label */
                const column = node.children[0].children[0].children[3];
                if (!column || !column.querySelectorAll('.font-bold')[0]) return;
                const label = column.querySelectorAll('.font-bold')[0].parentElement;
                let value = Number(label.innerText.replace('%','').split(':')[1]);

                const skilledExtraction = getSkilledExtractionLevel(user);
                const knowledgeExtraction = getKnowledgeExtractionLevel(user) / 100;

                const ore = getActiveMining();
                const expertiseLevel = getExpertiseLevel(user);
                const expertiseGain = getExpertiseXPGainByOre(ore);
                const additionalMiningGain = expertiseLevel / 5 * expertiseGain;
                console.log('additionalMiningGain:', additionalMiningGain);

                value += additionalMiningGain;

                const actionsPerHour = getActionsPerHour(density);
                const experienceBase = value * actionsPerHour;
                const experienceSkilled = actionsPerHour * skilledExtraction;
                const experienceKnowledge = value * knowledgeExtraction;

                value = experienceBase + experienceSkilled + experienceKnowledge;

                const vip = isUserVIP(user);

                value *= vip ? 1.1 : 1;

                return value;
            }

            function getActionsPerHour(density) {
                return 3600 / (60 / (density / 100))
            }

            function getExperienceRate(density, experience) {
                return Number((3600 / (60 / (density / 100)) * experience).toFixed(2));
            }

            function getOreRate(density, purity, ore) {
                return Number((3600 / (60 / (density / 100)) * (purity / 100) * ore).toFixed(2));
            }
        }

        function isUserVIP(user) {
            return new Date(user.vip_expires) > new Date();
        }

        updateExperienceRates();
        window.elethorResourceInterval = setInterval(updateExperienceRates, 500);
        initializeResourceNodeView();

        async function initializeResourceNodeView() {
            await waitForField(document, 'head');

            let css = '[data-after]::after { content: attr(data-after); padding: 12px;}';

            appendCSS(css);
        }
    })();

    async function loadMarketRecyclobotVisualizer() {
        if (!window.egpItemPoints) {
            const companions = await getCompanions();
            const recyclobot = companions.recyclobot;
            window.egpItemPoints = recyclobot.itemPoints;

            console.log(`[${moduleName} v${version}] Companion Data initialized.`);
        }

        window.elethorGeneralPurposeOnLocationChange.addEventListener('EGPLocation', async function (e) {
            if (e && e.newLocation) {
                window.egpRecyclobotOnMarket = e.newLocation.includes('/market/');

                if (!window.egpRecyclobotOnMarket) {
                    return;
                }

                if (!window.egpItemPoints) {
                    console.warn(`[${moduleName} v${version}] Entered market page but had no recyclobot item points list.`);
                    return;
                }

                const marketObjects = getMarketListingObjects();

                for (const marketListing of marketObjects) {
                    for (const recyclobotEntry of window.egpItemPoints) {
                        if (recyclobotEntry.item_name === marketListing.name) {
                            //marketListing.element.setAttribute('data-points-recyclobot',`R: ${recyclobotEntry.quantity}:${recyclobotEntry.points}`);
                            break;
                        }
                    }
                }
            }
        });

        function getMarketListingObjects() {
            return Array.prototype.slice.call(document.querySelectorAll('.is-market-side-menu ul li')).map((e) => {return {element: e, name: e.innerText}});
        }

        async function getCompanions() {
            return (await window.axios.get('/game/companions')).data;
        }
    };

    function setPackAmount(amount) {
        window.packAmount = amount;

        if (window.packAmount < 0) {
            window.packAmount = 0;
        }
    }

    window.setPackAmount = setPackAmount;

    function formatNormalNumber(num){
        return num.toLocaleString();
    }

    function appendCSS(css) {
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    function getMiningLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 1) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    function getSkilledExtractionLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 17) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    function getKnowledgeExtractionLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 18) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    function getExpertiseLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 38) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    expertiseXPGainByOre = {
        'Orthoclase': 780,
        'Anorthite': 825,
        'Ferrisum': 600,
        'Rhenium': 465,
        'Jaspil': 480,
        'Skasix': 0,
    };

    function getExpertiseXPGainByOre(ore) {
        return expertiseXPGainByOre[ore];
    }

    function getActiveMining() {
        const activeMiningButtons = document.querySelectorAll('.buttons .button.is-success');

        if (!activeMiningButtons[0] ||
            !activeMiningButtons[0].children[0] ||
            !activeMiningButtons[0].children[0].innerText ||
            !activeMiningButtons[0].children[0].innerText.trim
        ) {
            return '';
        }

        return activeMiningButtons[0].children[0].innerText.trim();
    }

    function getPackLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 22) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    function getCarnageLevel(user) {
        for (const skill of user.skills) {
            if (skill.id === 23) {
                return skill.pivot.level;
            }
        }

        return 0;
    }

    function getAttackSpeed(speed) {
        return 50 - (50 * speed / (speed + 400));
    }

    function getHealth(fortitude) {
        return 100000 * fortitude / (fortitude + 4000);
    }

    async function waitForField(target, field) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (target[field] !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    async function waitForUser() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (currentUserData.user && currentUserData.user.id !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    (async function loadAlarms() {
        await waitForField(window, 'Echo');
        await waitForField(document, 'head');
        await waitForUser();


        const meta1 = document.createElement('meta');
        meta1.setAttribute('content', "media-src https://furious.no/elethor/sound/");
        meta1.setAttribute('http-equiv', 'Content-Security-Policy');
        document.getElementsByTagName('head')[0].appendChild(meta1);

        /**
         * You can add an alternative audio by setting the local storage keys:
         * localStorage.setItem('egpSoundOutOfActions', 'your-url')
         * localStorage.setItem('egpSoundQuestCompleted', 'your-url')
         * */

        // Alternative: https://furious.no/elethor/sound/elethor-actions-have-ran-out.mp3
        window.egpSoundOutOfActions =
            localStorage.getItem('egpSoundOutOfActions') || 'https://furious.no/elethor/sound/out-of-actions.wav';

        // Alternative: https://furious.no/elethor/sound/elethor-quest-completed.mp3
        window.egpSoundQuestCompleted =
            localStorage.getItem('egpSoundQuestCompleted') || 'https://furious.no/elethor/sound/quest-complete.wav';

        const masterAudioLevel = 0.3;

        window.Echo.private(`App.User.${currentUserData.user.id}`).listen(".App\\Domain\\Monster\\Events\\FightingAgain", handleActionData);
        window.Echo.private(`App.User.${currentUserData.user.id}`).listen(".App\\Domain\\ResourceNode\\Events\\GatheringAgain", handleActionData);
        window.Echo.private(`App.User.${currentUserData.user.id}`).listen(".App\\Domain\\Quest\\Events\\UpdateQuestProgress", handleQuestData);

        let hasWarnedAboutActions = false;
        let hasWarnedAboutQuest = false;

        /**
         * Warns once when action runs out.
         * */
        function handleActionData(data) {
            if (data && data.action) {
                if (data.action.remaining <= 0 && !hasWarnedAboutActions) {
                    playOutOfActions();
                    hasWarnedAboutActions = true;
                } else if (data.action.remaining > 0 && hasWarnedAboutActions) {
                    hasWarnedAboutActions = false;
                }
            }
        }
        window.handleActionData = handleActionData;

        /**
         * Warns once when quest completes.
         * */
        function handleQuestData(data) {
            if (data
                && data.step
                && data.step.tasks) {
                if (data.step.progress >= data.step.tasks[0].quantity && !hasWarnedAboutQuest) {
                    playQuestCompleted();
                    hasWarnedAboutQuest = true;
                } else if (data.step.progress < data.step.tasks[0].quantity && hasWarnedAboutQuest) {
                    hasWarnedAboutQuest = false;
                }
            }
        }
        window.handleQuestData = handleQuestData;

        function playOutOfActions() {
            playSound(window.egpSoundOutOfActions);
        }
        window.playOutOfActions = playOutOfActions;

        function playQuestCompleted() {
            playSound(window.egpSoundQuestCompleted);
        }
        window.playQuestCompleted = playQuestCompleted;

        function playSound(sound, volume = masterAudioLevel){
            const audio = new Audio(sound);

            audio.volume = volume;
            audio.play();
        }
    })();
})();
