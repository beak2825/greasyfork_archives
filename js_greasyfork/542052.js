// ==UserScript==
// @name         UI Qualificatório Português
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script that brings the beauty of portuguese tiles to your duels. Also shows and persists score for multiple game matches.
// @match        https://www.geoguessr.com/*
// @author       Shadow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @icon         https://i.imgur.com/wpfHKma.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542052/UI%20Qualificat%C3%B3rio%20Portugu%C3%AAs.user.js
// @updateURL https://update.greasyfork.org/scripts/542052/UI%20Qualificat%C3%B3rio%20Portugu%C3%AAs.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const customStyles = `
        .overlay_backdrop__ueiEF,
        .views_activeRoundWrapper__1_J5M,
        .background_backgroundParty__ZCPUZ,
        .in-game_root__8QarP {
            background-image: url('https://i.imgur.com/O4Zh4Xl.png') !important;
            background-position: center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
        }

        .party-footer_root__2_r1e {
        background: linear-gradient(180deg, #23498800 0, #161232);
        border-top: 0px;
        }

        .header-desktop_root__yvlVI{
        background: linear-gradient(0deg, #23498800 0, #161232);
        }

        .navigation-icon_icon__PKe5T {
        display: none;
        }

        .page-title_title__TqWHa h1 {
        margin-top: 20px;
        font-size: 2rem;
        line-height: 2.5rem;
        }

        .victories-medal_medalWrapper__PCePL {
        display: none;
        }

        .in-game_layout__kqBbg {
        background: 0 !important;
        }

        .cam-hud_playerNick__0rWzf h3 {
        text-overflow: ellipsis;
        width: 13rem;
        overflow: hidden;
        white-space: nowrap;
        }

        .cam-hud_playerBadge__RViHv {
        filter: drop-shadow(0 0rem 1rem var(--ds-color-black-50)) !important;
        }
    `;

    const styleElem = document.createElement('style');
    styleElem.textContent = customStyles;
    document.head.appendChild(styleElem);

    const updateScoreParty = () => {
        const partyTitle = document.querySelector(".headline_heading__2lf9L");
        if (partyTitle) {
            partyTitle.innerText = "Qualificatório Português";
        }

        const placeholderCard = document.querySelector(".member-card_placeholderWrapper__M_1Rg");
        if(placeholderCard) {
            GM_setValue('leftPlayer', '');
            GM_setValue('rightPlayer', '');
            GM_setValue('leftScore', 0);
            GM_setValue('rightScore', 0);
        }

        const partyScore = document.querySelector(".member-card_vsCard__SbvLp");
        if (partyScore) {
            partyScore.innerText = GM_getValue('leftScore', 0) + " - " + GM_getValue('rightScore', 0);
        }
    }

    const createScoreDisplays = () => {
        if (document.getElementById("leftScore") && document.getElementById("rightScore")) return;
        const hudPlayerLeft = document.querySelectorAll(".cam-hud_camAndBadge__G63kI")[0];
        const hudPlayerRight = document.querySelectorAll(".cam-hud_camAndBadge__G63kI")[1];
        if (!hudPlayerLeft || !hudPlayerRight) return;
        const createScoreDiv = (id, position) => {
            const div = document.createElement("div");
            const marginLeftValue = (id === "leftScore") ? '-10px' : '0px';
            const marginRightValue = (id === "leftScore") ? '0px' : '-20px';
            const borderRadiusValue = (id === "leftScore") ? '0px 10px 10px 0px' : '10px 0px 0px 10px';
            const backgroundValue = (id === "leftScore") ? 'rgb(0 162 254)' : 'rgb(233 69 85)';
            div.id = id;
            div.innerText = (id === "leftScore") ? GM_getValue('leftScore', 0) : GM_getValue('rightScore', 0);
            div.style.cssText = `
                padding: 4.6px 10px;
                font-size: 48px;
                font-weight: bold;
                color: white;
                background: ${backgroundValue};
                border-radius: ${borderRadiusValue};
                text-align: center;
                margin-left: ${marginLeftValue};
                margin-right: ${marginRightValue};
                margin-top: 93px;
                width: 100px;
                height: fit-content;
                z-index: 1000;
                filter: drop-shadow(0.5rem 0rem 1rem var(--ds-color-black-50));
            `;
            return div;
        };
        hudPlayerLeft.appendChild(createScoreDiv("leftScore", "left"));
        hudPlayerRight.appendChild(createScoreDiv("rightScore", "right"));
    };

    const createPlayerData = () => {
        if (document.getElementById("divDistrictLeft") && document.getElementById("divDistrictRight")) return;
        const namePlayerLeft = document.querySelectorAll(".cam-hud_playerNick__0rWzf")[0];
        const namePlayerRight = document.querySelectorAll(".cam-hud_playerNick__0rWzf")[1];
        if (!namePlayerLeft || !namePlayerRight) return;
        namePlayerLeft.style.borderRadius = '10px 0px 0px 10px';
        namePlayerRight.style.borderRadius = '0px 10px 10px 0px';
        const nameHeadingPlayerLeft = document.querySelectorAll(".cam-hud_playerNick__0rWzf h3")[0];
        const nameHeadingPlayerRight = document.querySelectorAll(".cam-hud_playerNick__0rWzf h3")[1];
        if (!nameHeadingPlayerLeft || !nameHeadingPlayerRight) return;
        nameHeadingPlayerLeft.style.textAlign = 'left';
        nameHeadingPlayerRight.style.textAlign = 'right';
        const flagPlayerLeft = document.querySelectorAll(".cam-hud_badgeFlag__w7usq")[0];
        const flagPlayerRight = document.querySelectorAll(".cam-hud_badgeFlag__w7usq")[1];
        if (!flagPlayerLeft || !flagPlayerRight) return;
        flagPlayerLeft.remove();
        flagPlayerRight.remove();
        const playerData = GM_getValue('playerData', null);
        if (!playerData) return;
        const flagScreenPlayerLeft = document.querySelectorAll(".cam-hud_flag__DOu6b img")[0];
        const flagScreenPlayerRight = document.querySelectorAll(".cam-hud_flag__DOu6b img")[1];
        if (!flagScreenPlayerLeft || !flagScreenPlayerRight) return;
        flagScreenPlayerLeft.src = playerData.players[GM_getValue('leftPlayer', '')].flag;
        flagScreenPlayerRight.src = playerData.players[GM_getValue('rightPlayer', '')].flag;
        const createDistrictDiv = (id) => {
            const justifyContent = (id === "divDistrictLeft") ? 'start' : 'end';
            const div = document.createElement("div");
            div.id = id;
            div.style.cssText = `
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                margin-top: 0.5rem;
                justify-content: ${justifyContent};
            `;
            return div;
        };
        const createDistrictName = (id) => {
            const p = document.createElement("p");
            p.id = id;
            p.classList.add('headline_italic__yzx0R');
            p.style.cssText = ``;
            p.innerText = (id === "pDistrictLeft") ? playerData.players[GM_getValue('leftPlayer', '')].district : playerData.players[GM_getValue('rightPlayer', '')].district;
            return p;
        };
        const createDistrictFlag = (id) => {
            const img = document.createElement("img");
            img.id = id;
            img.classList.add('country-flag_flag__tlHIr');
            img.style.cssText = `
                height: 1rem;
                width: 1.5rem;
                color: transparent;
            `;
            img.src = (id === "imgDistrictLeft") ? playerData.players[GM_getValue('leftPlayer', '')].flag : playerData.players[GM_getValue('rightPlayer', '')].flag;
            return img;
        };
        const divDistrictLeft = namePlayerLeft.appendChild(createDistrictDiv("divDistrictLeft"));
        const divDistrictRight = namePlayerRight.appendChild(createDistrictDiv("divDistrictRight"));
        divDistrictLeft.appendChild(createDistrictFlag("imgDistrictLeft"));
        divDistrictLeft.appendChild(createDistrictName("pDistrictLeft"));
        divDistrictRight.appendChild(createDistrictName("pDistrictRight"));
        divDistrictRight.appendChild(createDistrictFlag("imgDistrictRight"));
    };

    const resetScores = (response) => {
        if (response.status === 'Created') {
            GM_setValue('gameOver', false);
            if(response.teams[0].players[0].playerId != GM_getValue('leftPlayer', '') || response.teams[1].players[0].playerId != GM_getValue('rightPlayer', '')) {
                GM_setValue('leftPlayer', response.teams[0].players[0].playerId);
                GM_setValue('rightPlayer', response.teams[1].players[0].playerId);
                GM_setValue('leftScore', 0);
                GM_setValue('rightScore', 0);

                const leftScoreEl = document.getElementById("leftScore");
                const rightScoreEl = document.getElementById("rightScore");
                if (leftScoreEl) {
                    leftScoreEl.innerText = GM_getValue('leftScore', 0);
                }
                if (rightScoreEl) {
                    rightScoreEl.innerText = GM_getValue('rightScore', 0);
                }
            }
        }
    };

    const updateScores = (response) => {
        if (response.status === 'Finished' && !GM_getValue('gameOver', false)) {
            if (response.result.winningTeamId === response.teams[0].id) {
                GM_setValue('leftScore', GM_getValue('leftScore', 0) + 1);
            } else {
                GM_setValue('rightScore', GM_getValue('rightScore', 0) + 1);
            }

            const leftScoreEl = document.getElementById("leftScore");
            const rightScoreEl = document.getElementById("rightScore");
            if (leftScoreEl) {
                leftScoreEl.innerText = GM_getValue('leftScore', 0);
            }
            if (rightScoreEl) {
                rightScoreEl.innerText = GM_getValue('rightScore', 0);
            }

            GM_setValue('gameOver', true);
        }
    };

    const fetchDuelData = () => {
        const duelId = location.pathname.split("/")[2];
        if (!duelId) return;
        fetch(`https://game-server.geoguessr.com/api/duels/${duelId}/spectate`, { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(GM_getValue('currentDuel', '') != duelId ? resetScores : updateScores)
            .catch(err => {});
        GM_setValue('currentDuel', duelId);
    };

    const fetchPlayerData = () => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/JoaoPMF/UI-Qualificat-rio-Portugu-s/refs/heads/main/distritos.json',
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                GM_setValue('playerData', data);
                createPlayerData();
            }
        });
    };

    const observer = new MutationObserver(() => {
        requestAnimationFrame(createScoreDisplays);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (location.href.includes("duels")) {
        fetchDuelData();
        fetchPlayerData();
    }
    if (location.href.includes("party")) {
        updateScoreParty();
    }

    setInterval(() => {
        if (location.href.includes("duels")) {
            fetchDuelData();
            const playerData = GM_getValue('playerData', null);
            if (!playerData) fetchPlayerData();
            else createPlayerData();
        }
        if (location.href.includes("party")) {
            updateScoreParty();
        }
    }, 1000);

})();