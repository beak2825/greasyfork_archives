// ==UserScript==
// @name         eRepublikChHunter
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-06-08
// @description  CH hunter
// @author       You
// @match        https://www.erepublik.com/en/military/campaigns
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/538887/eRepublikChHunter.user.js
// @updateURL https://update.greasyfork.org/scripts/538887/eRepublikChHunter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `.hidden { display: none; }
    `;

    const addCSS = document.head.appendChild(document.createElement("style")).innerHTML = style;
    const $scope = angular.element('#ListCampaignsController').scope();

    let campaigns = [];
    let sortedCampaigns = [];
    let innerContent;
    let timeoutId;

    function createContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.width = 'auto';
        container.style.top = 0;
        container.style.border = 'solid 1px #000';
        container.style.backgroundColor = '#fff';
        container.style.padding = '8px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.classList.add('rafael-ch-hunter-container');

        const title = document.createElement('p');
        title.innerHTML = 'CH Watch <span id="rafael-ch-hunter-indicator">+</span>';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';
        title.style.cursor = 'pointer';

        innerContent = document.createElement('div');
        innerContent.id = 'rafael-ch-hunter-content';
        innerContent.classList.add('hidden');


        title.addEventListener('click', () => toggleVisibility(innerContent, document.querySelector('#rafael-ch-hunter-indicator')));

        container.appendChild(title);
        container.appendChild(innerContent);

        const body = document.querySelector('body');
        body.appendChild(container);
    }

    async function toggleVisibility(element, indicator) {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
            indicator.innerText = '-';
            await pacedLoad(sortedCampaigns, 300);
        } else {
            element.classList.add('hidden');
            indicator.innerText = '+';
            clearTimeout(timeoutId);
        }
    }

    function loadCampaigns() {
        return $scope.getCampaignsList().map(c => ({
            id: c.id,
            inv: c.inv.id,
            inv_score: c.inv.points,
            inv_flag: $scope._getCountryFlag(c.inv.id, 'S'),
            def: c.def.id,
            def_score: c.def.points,
            def_flag: $scope._getCountryFlag(c.def.id, 'S'),
        }));
    }

    function createRows(campaigns) {
        return campaigns.map(c => `<li>
            <div class="rafael-ch-hunter-content-header"><img src="${c.inv_flag}"> <img src="${c.def_flag}"> | ${c.inv_score} x ${c.def_score}</div>
            <div style="display:flex">
                <div class="rafael-ch-hunter-content-data-inv" style="flex: 1;" id="data-${c.id}-${c.inv}"></div>
                <div class="rafael-ch-hunter-content-data-def" style="flex: 1;" id="data-${c.id}-${c.def}"></div>
            </div>
        </li>`);
    }

    function loadContent(content) {
        innerContent.innerHTML = content;
    }

    async function loadCampaignStats(id) {
        const obj = {
            "battleId": id,
            "action": "battleStatistics",
            "_token": unsafeWindow.SERVER_DATA.csrfToken,
            "round": 1,
            "leftPage": 1,
            "rightPage": 1,
            "division": "overall",
            "type": "damage",
        };

        const response = await fetch("https://www.erepublik.com/en/military/battle-console", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://www.erepublik.com/en/military/battlefield/${id}/0/fighterStatistics`,
            "referrerPolicy": "same-origin",
            "body": `battleId=${obj.battleId}&action=${obj.action}&round=${obj.round}&division=${obj.division}&type=damage&leftPage=1&rightPage=1&_token=${obj._token}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        return await response.json();
    }

    async function populateBattle(battleId) {
        const json = await loadCampaignStats(battleId);

        delete json.rounds;

        const countries = Object.keys(json);
        countries.forEach(country => {
            const data = json[country];
            const top = Object.values(data.fighterData).slice(0, 2);
            const rows = top.map(fighter => {
                return `<li style="display:flex;"><span style="flex: 1; padding: 0 8px 0 8px;">${fighter.citizenName}</span><span style="text-align: right; padding: 0 8px 0 8px;">${fighter.value}</span></li>`;
            });

            const content = document.querySelector(`#data-${battleId}-${country}`);
            content.innerHTML = `<ul style="display: flex; flex-direction: column;">${rows.join(' ')}</ul>`;
        });

    }

    async function pacedLoad(battles, backoff) {
        if (!battles || battles.length == 0) {
            return;
        }

        const battle = battles.shift();
        await populateBattle(battle.id);

        timeoutId = setTimeout(async () => await pacedLoad(battles, backoff + 300), backoff);
    }

    createContainer();
    $scope.$watch('filteredList', async () => {
        campaigns = loadCampaigns();
        if (!campaigns || campaigns.length == 0) {
            return;
        }

        sortedCampaigns = campaigns.sort((a, b) => {
            const scoreA = a.inv_score > a.def_score ? a.inv_score : a.def_score;
            const scoreB = b.inv_score > b.def_score ? b.inv_score : b.def_score;

            return scoreA > scoreB ? -1 : 1;
        });

        const rows = createRows(sortedCampaigns);
        loadContent(`<ul>${rows.join(' ')}</ul>`);
    });

})();