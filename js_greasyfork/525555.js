// ==UserScript==
// @name         Backloggd - Metacritic & HowLongToBeat Integration - Dark Mode
// @name:zh-CN   Backloggd - 集成Metacritic和HowLongToBeat
// @namespace    https://greasyfork.org/en/users/1410951-nzar-bayezid
// @author       Nzar Bayezid
// @version      1.5
// @description  Adds Metacritic ratings and HowLongToBeat completion times on Backloggd
// @description:zh-CN 在Backloggd上添加Metacritic评分和HowLongToBeat完成时间
// @icon         https://www.backloggd.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://backloggd.com/*
// @match        https://www.backloggd.com/*
// @grant        GM_xmlhttpRequest
// @connect      metacritic.com
// @connect      howlongtobeat.com
// @connect      umadb.ro
// @license      MIT
// @noframes
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525555/Backloggd%20-%20Metacritic%20%20HowLongToBeat%20Integration%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/525555/Backloggd%20-%20Metacritic%20%20HowLongToBeat%20Integration%20-%20Dark%20Mode.meta.js
// ==/UserScript==

/*=========================  Version History  ==================================
v1.5 -
- Dark Mode
- Combined Metacritic and HowLongToBeat integrations
- Unified UI styling for both services
- Added proper service ordering (HLTB above Metacritic)
- Optimized API requests and error handling
*/

(function() {
    'use strict';
    const OBSERVER_CONFIG = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    let processing = false;
    let currentPath = '';

    function mainExecutor() {
        if (processing) return;
        if (location.pathname === currentPath) return;
        if (!document.querySelector('#game-body')) return;

        currentPath = location.pathname;
        processing = true;

        cleanExistingElements();
        addLoader();
        processGameData();
    }

    function cleanExistingElements() {
        $('#loader, .integration-container').remove();
    }

    function addLoader() {
        const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
        if (target.length) {
            target.append('<div id="loader" style="display:inline-block;margin-left:10px;">'
                + '<div class="loadingio-spinner-ellipsis-xiqce8pxsmm">'
                + '<div class="ldio-www0qkokjy"><div></div><div></div><div></div><div></div><div></div></div>'
                + '</div></div>');
        }
    }

    async function processGameData() {
        try {
            const gameName = getNormalizedGameName();
            const [metacriticData, hltbData] = await Promise.all([
                fetchMetacriticData(gameName),
                fetchHLTBData(gameName)
            ]);

            cleanExistingElements();
            renderIntegrationSection(metacriticData, hltbData);
        } catch (error) {
            console.error('Integration Error:', error);
        } finally {
            processing = false;
        }
    }

    function getNormalizedGameName() {
        const rawName = document.querySelector("#title h1").textContent;
        return rawName.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z _0-9`~!@#$%^&*()-=+|\\\]}[{;:'",<.>/?]/gi, '')
            .toLowerCase();
    }

    // Metacritic Functions
    async function fetchMetacriticData(gameName) {
        const normalizedTitle = gameName
            .replace(/[^a-z0-9 ]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase();

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.metacritic.com/game/${normalizedTitle}/`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    const criticRating = doc.querySelector('.c-siteReviewScore_background-critic_medium .c-siteReviewScore span')?.textContent || 'N/A';
                    const userRating = doc.querySelector('.c-siteReviewScore_background-user .c-siteReviewScore span')?.textContent || 'N/A';

                    resolve({
                        critic: criticRating,
                        user: userRating,
                        url: `https://www.metacritic.com/game/${normalizedTitle}/`
                    });
                },
                onerror: () => resolve(null),
                timeout: 10000
            });
        });
    }

    // HLTB Functions
    async function fetchHLTBData(gameName) {
        try {
            const key = await fetchHLTBKey();
            return await fetchHLTBGameData(gameName, key);
        } catch (error) {
            console.error('HLTB Error:', error);
            return null;
        }
    }

    async function fetchHLTBKey() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://umadb.ro/hltb/fetch.php",
                onload: (res) => res.status === 200 ? resolve(res.responseText.trim()) : reject(),
                onerror: reject
            });
        });
    }

    async function fetchHLTBGameData(gameName, key) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://howlongtobeat.com${key}`,
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "https://howlongtobeat.com",
                    "Referer": "https://howlongtobeat.com/"
                },
                data: JSON.stringify({
                    searchType: "games",
                    searchTerms: [gameName.replace(/"/g, '')],
                    searchPage: 1,
                    size: 20,
                    searchOptions: {
                        games: {
                            userId: 0,
                            platform: "",
                            sortCategory: "popular",
                            rangeCategory: "main",
                            rangeTime: {min: null, max: null},
                            gameplay: {perspective: "", flow: "", genre: "", difficulty: ""},
                            rangeYear: {min: "", max: ""},
                            modifier: ""
                        },
                        users: {sortCategory: "postcount"},
                        lists: {sortCategory: "follows"},
                        filter: "",
                        sort: 0,
                        randomizer: 0
                    },
                    useCache: true
                }),
                onload: (res) => res.status === 200 ? resolve(JSON.parse(res.responseText)) : reject(),
                onerror: reject,
                timeout: 10000
            });
        });
    }

    function processHLTBData(response) {
        if (!response?.count) return { text: 'HLTB Data Unavailable', color: 'ff8c00' };

        const mainEntry = response.data.find(item =>
            item.game_name.toLowerCase() === document.querySelector("#title h1").textContent.toLowerCase()
        ) || response.data[0];

        if (!mainEntry.comp_main) return { text: '--', color: '222222' };

        const formatTime = (seconds) => {
            const hours = Math.round((seconds / 3600) * 2) / 2;
            return `${hours} Hour${hours !== 1 ? 's' : ''}`.replace('.5', '½');
        };

        return {
            text: [
                `Main Story: ${formatTime(mainEntry.comp_main)}`,
                `Main + Sides: ${formatTime(mainEntry.comp_plus)}`,
                `Completionist: ${formatTime(mainEntry.comp_100)}`,
                `All Styles: ${formatTime(mainEntry.comp_all)}`
            ].join('<br>'),
            color: getConfidenceColor(mainEntry.comp_main_count)
        };
    }

    function getConfidenceColor(confidence) {
        const colors = {
            5: "FF3A3A",
            10: "cc3b51",
            15: "824985",
            20: "5650a1",
            25: "485cab",
            30: "3a6db5",
            Infinity: "16181c"
        };
        return Object.entries(colors).find(([threshold]) => confidence < threshold)[1];
    }

    // Unified Rendering
    function renderIntegrationSection(metacriticData, hltbData) {
        const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
        if (!target.length) return;

        const originalTitle = document.querySelector("#title h1").textContent;
        const hltbProcessed = processHLTBData(hltbData);

        // Common styling
        const containerStyle = "margin-top:10px; margin-bottom:15px;";
        const linkStyle = "display:inline-block; text-decoration:none; color:white; "
            + "border-radius:4px; padding:8px 12px; border:1px solid #8f9ca7; "
            + "font-size:14.4px; line-height:1.5; white-space: normal; "
            + "min-height: 54px; display: flex; align-items: center; justify-content: center;";

        const metacriticTextStyle = "display: flex; flex-direction: column; align-items: center;";

        // HLTB Box
        target.append(`
            <div class="integration-container" style="${containerStyle}">
                <a href="https://howlongtobeat.com/?q=${encodeURIComponent(originalTitle)}"
                   target="_blank"
                   style="${linkStyle} background-color:#${hltbProcessed.color};">
                    ${hltbProcessed.text}
                </a>
            </div>
        `);

        // Metacritic Box
        if (metacriticData) {
            target.append(`
    <div class="integration-container" style="${containerStyle}">
        <a href="${metacriticData.url}"
           target="_blank"
           style="${linkStyle} background-color:#16181c;">
            <div style="${metacriticTextStyle}">
                <div>
                    <span style="color:#ffffff;">Metacritic: </span>
                    <span style="color:#ffffff;">Critic: ${metacriticData.critic}</span> |
                    <span style="color:#ffffff;">User: ${metacriticData.user}</span>
                </div>
            </div>
        </a>
    </div>
`);
        }
    }

    // Observation system
    new MutationObserver(mutations => {
        if (!document.body.matches('#game-body') && !mutations.some(m => m.addedNodes.length)) return;
        mainExecutor();
    }).observe(document.documentElement, OBSERVER_CONFIG);

    // Initial check
    addEventListener('DOMContentLoaded', mainExecutor);
    mainExecutor();
})();