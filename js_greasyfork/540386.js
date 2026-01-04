// ==UserScript==
// @name         UpsWarrant
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Detect people that are worth a warrant;
// @author       Upsilon[3212478]
// @match        https://www.torn.com/page.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/540386/UpsWarrant.user.js
// @updateURL https://update.greasyfork.org/scripts/540386/UpsWarrant.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_API_KEY = "public api key";

    const analyzedDataMap = new Map();

    function showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '5%';
        toast.style.right = '5%';
        toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
        toast.style.color = 'white';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        toast.style.fontFamily = 'monospace';
        toast.style.whiteSpace = 'pre-wrap';
        toast.style.zIndex = 100000;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    function showUserModal(userData) {
        const existingModal = document.getElementById('ups-warrant-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'ups-warrant-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#222';
        modal.style.border = '2px solid #444';
        modal.style.borderRadius = '8px';
        modal.style.padding = '20px';
        modal.style.zIndex = 99999;
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.fontFamily = 'monospace';
        modal.style.maxWidth = '400px';
        modal.style.whiteSpace = 'pre-wrap';

        modal.innerHTML = `<p>
<b>${userData.name}</b> Profile – Level ${userData.level}

<b>Summary:</b>
Total Crimes: ${userData.total_crimes}
Organized Crimes: ${userData.organized_crimes}
Illegal Production: ${userData.illegal_production}
Extortion: ${userData.extortion}
Cybercrime: ${userData.cybercrime}
Illicit Services: ${userData.illicit_services}
Counterfeiting: ${userData.counterfeiting}
Theft: ${userData.theft}
Fraud: ${userData.fraud}
Vandalism: ${userData.vandalism}
Times Jailed: ${userData.times_jailed}

<b>Estimate nerves: ${userData.estimated_nerves}</b>
`;

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '12px';
        closeButton.style.display = 'block';
        closeButton.style.color = 'white';
        closeButton.onclick = () => modal.remove();

        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }


    function computeScore(user) {
        let score = 0;
        if (user.times_jailed == 0) score++;
        return score;
    }

    function assignColors(analyzedUsers) {
        analyzedUsers.forEach(user => {
            const score = computeScore(analyzedDataMap.get(user.id));

            let bgColor;
            let svgColor;

            switch(score) {
                case 1:
                    bgColor = 'initial';
                    svgColor = '#228B22'
                    break;
                case 0:
                    bgColor = 'rgba(255, 99, 71, 0.5)';
                    svgColor = '#fff'
                    break;
                default:
                    bgColor = 'transparent';
            }

            if (user.row) {
                user.row.style.backgroundColor = bgColor;

                const svg = user.row.querySelector(`#iconCustom___${user.id} svg`);
                if (svg) {
                    svg.querySelector('path').setAttribute('fill', svgColor);
                    svg.querySelector('polygon').setAttribute('fill', svgColor);
                }
            }
        });
    }

    async function fetchUserStats(userId, apiKey, timestamp) {
        let url = `https://api.torn.com/v2/user/${userId}/personalstats?stat=jailed,organizedcrimes,criminaloffenses,vandalism,theft,counterfeiting,fraud,illicitservices,cybercrime,extortion,illegalproduction&key=${apiKey}`;

        if (timestamp !== undefined) {
            url += `&timestamp=${timestamp}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

            const data = await response.json();
            if (data.error) throw new Error(data.error.error);

            return data.personalstats || null;

        } catch (error) {
            console.error('Erreur fetchUserStats:', error);
            throw error;
        }
    }

    function transformCurrentData(data) {
        return {
            jailed: { value: data.jail?.times_jailed || 0 },
            organizedcrimes: { value: data.crimes?.offenses?.organized_crimes || 0 },
            criminaloffenses: { value: data.crimes?.offenses?.total || 0 },
            vandalism: { value: data.crimes?.offenses?.vandalism || 0 },
            theft: { value: data.crimes?.offenses?.theft || 0 },
            counterfeiting: { value: data.crimes?.offenses?.counterfeiting || 0 },
            fraud: { value: data.crimes?.offenses?.fraud || 0 },
            illicitservices: { value: data.crimes?.offenses?.illicit_services || 0 },
            cybercrime: { value: data.crimes?.offenses?.cybercrime || 0 },
            extortion: { value: data.crimes?.offenses?.extortion || 0 },
            illegalproduction: { value: data.crimes?.offenses?.illegal_production || 0 }
        };
    }

    function transformOldData(oldDataArray) {
        const result = {};
        oldDataArray.forEach(item => {
            result[item.name] = { value: item.value };
        });
        return result;
    }

    async function onCustomIconClick(user) {
        if (analyzedDataMap.has(user.id)) {
            showUserModal(analyzedDataMap.get(user.id));
            return;
        }

        try {
            const twoMonthsAgoUnix = Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000);
            const currentData = transformCurrentData(await fetchUserStats(user.id, DEFAULT_API_KEY));
            const oldDataArray = await fetchUserStats(user.id, DEFAULT_API_KEY, twoMonthsAgoUnix);
            const oldData = transformOldData(oldDataArray);

            const userAnalysis = {
                name: user.username,
                level: user.level,
                organized_crimes: currentData.organizedcrimes.value - (oldData.organizedcrimes?.value || 0),
                total_crimes: currentData.criminaloffenses.value - (oldData.criminaloffenses?.value || 0),
                illegal_production: currentData.illegalproduction.value - (oldData.illegalproduction?.value || 0),
                extortion: currentData.extortion.value - (oldData.extortion?.value || 0),
                cybercrime: currentData.cybercrime.value - (oldData.cybercrime?.value || 0),
                illicit_services: currentData.illicitservices.value - (oldData.illicitservices?.value || 0),
                counterfeiting: currentData.counterfeiting.value - (oldData.counterfeiting?.value || 0),
                theft: currentData.theft.value - (oldData.theft?.value || 0),
                fraud: currentData.fraud.value - (oldData.fraud?.value || 0),
                vandalism: currentData.vandalism.value - (oldData.vandalism?.value || 0),
                times_jailed: currentData.jailed.value - (oldData.jailed?.value || 0),
            };

            userAnalysis.estimated_nerves = userAnalysis.illegal_production * 3 + userAnalysis.cybercrime * 5.5 + userAnalysis.illicit_services * 6.5 + userAnalysis.vandalism * 3 + userAnalysis.fraud * 2 + userAnalysis.theft * 4;

            analyzedDataMap.set(user.id, userAnalysis);
            user.analysis = userAnalysis;

            if (!user.row) {
                const row = document.querySelector(`li.table-row .honorWrap___BHau4 a[href*="XID=${user.id}"]`)?.closest('li.table-row');
                if (row) user.row = row;
            }

            showToast(`[UPS WARRANT] ${user.username} analyzed`);
            assignColors([user]);
        } catch (err) {
            console.error(`Error analysing ${user.username}`, err);
        }
    }

    function extractMembers() {
        const rows = document.querySelectorAll('li.table-row, ul.user-info-list-wrap>li');
        const members = [];

        rows.forEach(row => {
            const profileLink = row.querySelector('a[href^="/profiles.php?XID="], a.user.name[href^="/profiles.php?XID="]');
            if (!profileLink) return;

            const idMatch = profileLink.href.match(/XID=(\d+)/);
            if (!idMatch) return;
            const id = parseInt(idMatch[1]);

            let username = '';
            const nameSpans = profileLink.querySelectorAll('span[data-char]');
            if (nameSpans.length > 0) {
                username = Array.from(nameSpans).map(s => s.dataset.char).join('');
            } else {
                username = profileLink.textContent.trim();
            }

            let level = 0;
            const levelElement = row.querySelector('.lvlCol___kf6Ag, .lvlCol___NAW6T, .level .value');
            if (levelElement) {
                level = parseInt(levelElement.textContent.trim()) || 0;
            }

            const member = { username, id, level, row };
            if (window.location.href.includes("https://www.torn.com/factions.php")) {
                addFactionIcon(row, member);
            } else if (window.location.href.includes("https://www.torn.com/page.php")) {
                addCustomIcon(row, member);
            }

            members.push(member);
        });

        return members;
    }

    function addFactionIcon(row, member) {
        const iconContainerParent = row.querySelector('.member-icons, .user-icons');
        if (!iconContainerParent) return;

        const iconsList = iconContainerParent.querySelector('ul');
        if (!iconsList) return;

        if (iconContainerParent.querySelector(`#iconCustom___${member.id}`)) return;

        iconsList.style.width = 'initial';
        iconContainerParent.style.display = 'flex';
        iconContainerParent.style.justifyContent = 'flex-start';

        const icon = document.createElement('div');
        icon.id = `iconCustom___${member.id}`;
        icon.className = 'iconShow';
        icon.title = 'UPS WARRANT';
        icon.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin-left: 6px;
    `;
        icon.innerHTML = `
<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="16px" height="16px" viewBox="0 0 488.767 488.767"
	 xml:space="preserve">
<g>
	<g>
		<path d="M394.388,294.094c-1.416-1.812-9.303-10.988-25.094-17.014c-13.805-4.272-47.873-15.563-66.695-29.075
			c1.234-1.629,2.443-3.31,3.615-5.054c15.445-22.979,23.949-53.896,23.949-87.06c0-5.456-0.193-10.577-0.545-15.424
			c34.166-6.835,56.25-17.674,56.25-29.878c0-13.976-28.959-26.162-71.863-32.591c-1.062-6.93-1.787-14.609-1.787-22.703
			C312.218,24.757,303.154,0,277.772,0c-28.875,0-22.897,34.099-33.388,35.351C233.894,34.099,239.871,0,210.996,0
			c-25.381,0-34.446,24.757-34.446,55.295c0,8.094-0.725,15.775-1.787,22.703c-42.905,6.429-71.863,18.615-71.863,32.591
			c0,12.204,22.083,23.043,56.25,29.878c-0.352,4.847-0.546,9.968-0.546,15.424c0,33.163,8.505,64.08,23.949,87.06
			c1.172,1.745,2.38,3.425,3.616,5.054c-18.823,13.512-52.892,24.803-66.695,29.075c-15.792,6.023-23.678,15.201-25.096,17.014
			c-29.041,43.114-32.331,139.842-32.357,140.803c0.26,12.87,4.083,17.27,5.403,17.812c64.016,28.481,139.252,35.915,176.96,36.058
			c37.708-0.143,112.944-7.576,176.959-36.059c1.32-0.543,5.143-4.941,5.402-17.812C426.72,433.936,423.431,337.208,394.388,294.094
			z M168.725,86.869c-0.184,0.651-0.281,1.312-0.281,1.979c0,12.739,33.999,23.066,75.94,23.066s75.94-10.327,75.94-23.066
			c0-0.668-0.098-1.328-0.281-1.979c5.721,3.461,8.943,7.37,8.943,11.51c0,14.191-37.877,25.698-84.603,25.698
			s-84.604-11.507-84.604-25.698C159.78,94.239,163.006,90.33,168.725,86.869z M170.388,155.892c0-4.661,0.137-9.1,0.407-13.327
			c21.441,3.461,46.634,5.455,73.589,5.455c26.956,0,52.147-1.994,73.588-5.455c0.271,4.228,0.408,8.666,0.408,13.327
			c0,62.924-32.504,112.212-73.997,112.212C202.891,268.104,170.388,218.816,170.388,155.892z"/>
		<path d="M239.67,163.308h9.427c1.394,18.262,16.234,32.639,34.348,32.639c18.115,0,32.955-14.377,34.35-32.639h0.01v-0.139
			c0.062-0.884,0.105-1.771,0.105-2.674h-0.105v-5.224H170.857v8.036h0.117c1.394,18.262,16.234,32.639,34.348,32.639
			C223.436,195.946,238.277,181.57,239.67,163.308z"/>
	</g>
</g>
</svg>
`;

        icon.onclick = () => onCustomIconClick(member);
        iconContainerParent.appendChild(icon);
    }

    function addCustomIcon(row, member) {
        const iconContainerParent = row.querySelector('.member-icons, .user-icons');
        if (!iconContainerParent) return;

        const iconsList = iconContainerParent.querySelector('ul');
        if (!iconsList) return;

        if (iconContainerParent.querySelector(`#iconCustom___${member.id}`)) return;

        iconsList.style.width = 'initial';
        iconsList.parentElement.style.display = 'flex';
        iconsList.parentElement.style.justifyContent = 'flex-start';

        const icon = document.createElement('div');
        icon.id = `iconCustom___${member.id}`;
        icon.className = 'iconShow';
        icon.title = 'UPS WARRANT';
        icon.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin-left: 4px;
    `;
        icon.innerHTML = `
<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="16px" height="16px" viewBox="0 0 488.767 488.767"
	 xml:space="preserve">
<g>
	<g>
		<path d="M394.388,294.094c-1.416-1.812-9.303-10.988-25.094-17.014c-13.805-4.272-47.873-15.563-66.695-29.075
			c1.234-1.629,2.443-3.31,3.615-5.054c15.445-22.979,23.949-53.896,23.949-87.06c0-5.456-0.193-10.577-0.545-15.424
			c34.166-6.835,56.25-17.674,56.25-29.878c0-13.976-28.959-26.162-71.863-32.591c-1.062-6.93-1.787-14.609-1.787-22.703
			C312.218,24.757,303.154,0,277.772,0c-28.875,0-22.897,34.099-33.388,35.351C233.894,34.099,239.871,0,210.996,0
			c-25.381,0-34.446,24.757-34.446,55.295c0,8.094-0.725,15.775-1.787,22.703c-42.905,6.429-71.863,18.615-71.863,32.591
			c0,12.204,22.083,23.043,56.25,29.878c-0.352,4.847-0.546,9.968-0.546,15.424c0,33.163,8.505,64.08,23.949,87.06
			c1.172,1.745,2.38,3.425,3.616,5.054c-18.823,13.512-52.892,24.803-66.695,29.075c-15.792,6.023-23.678,15.201-25.096,17.014
			c-29.041,43.114-32.331,139.842-32.357,140.803c0.26,12.87,4.083,17.27,5.403,17.812c64.016,28.481,139.252,35.915,176.96,36.058
			c37.708-0.143,112.944-7.576,176.959-36.059c1.32-0.543,5.143-4.941,5.402-17.812C426.72,433.936,423.431,337.208,394.388,294.094
			z M168.725,86.869c-0.184,0.651-0.281,1.312-0.281,1.979c0,12.739,33.999,23.066,75.94,23.066s75.94-10.327,75.94-23.066
			c0-0.668-0.098-1.328-0.281-1.979c5.721,3.461,8.943,7.37,8.943,11.51c0,14.191-37.877,25.698-84.603,25.698
			s-84.604-11.507-84.604-25.698C159.78,94.239,163.006,90.33,168.725,86.869z M170.388,155.892c0-4.661,0.137-9.1,0.407-13.327
			c21.441,3.461,46.634,5.455,73.589,5.455c26.956,0,52.147-1.994,73.588-5.455c0.271,4.228,0.408,8.666,0.408,13.327
			c0,62.924-32.504,112.212-73.997,112.212C202.891,268.104,170.388,218.816,170.388,155.892z"/>
		<path d="M239.67,163.308h9.427c1.394,18.262,16.234,32.639,34.348,32.639c18.115,0,32.955-14.377,34.35-32.639h0.01v-0.139
			c0.062-0.884,0.105-1.771,0.105-2.674h-0.105v-5.224H170.857v8.036h0.117c1.394,18.262,16.234,32.639,34.348,32.639
			C223.436,195.946,238.277,181.57,239.67,163.308z"/>
	</g>
</g>
</svg>
`;

        icon.onclick = () => onCustomIconClick(member);
        iconsList.after(icon);
    }

    const observer = new MutationObserver(() => {
        const rows = document.querySelectorAll('li.table-row, ul.user-info-list-wrap>li');

        if (rows.length > 1) {
            observer.disconnect();
            const members = extractMembers(rows);
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();