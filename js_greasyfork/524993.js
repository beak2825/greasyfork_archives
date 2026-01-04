// ==UserScript==
// @name         Backloggd - Integrate HowLongToBeat
// @name:zh-CN   Backloggd - Integrate HowLongToBeat CN
// @namespace    https://greasyfork.org/en/users/1410951-nzar-bayezid
// @author       Nzar Bayezid
// @version      1.3
// @description  Adds completion times from HowLongToBeat on Backloggd
// @description:zh-CN    添加来自 Backloggd 上的 HowLongToBeat 的完成时间
// @icon         https://www.backloggd.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://backloggd.com/*
// @match        https://www.backloggd.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524993/Backloggd%20-%20Integrate%20HowLongToBeat.user.js
// @updateURL https://update.greasyfork.org/scripts/524993/Backloggd%20-%20Integrate%20HowLongToBeat.meta.js
// ==/UserScript==
//
/*=========================  Version History  ==================================

v1.3 -
- [Layout] Changed HLTB time display to vertical list format
- [UI] Replaced horizontal separator "|" with line breaks
- [Style] Added multi-line text support in HLTB box
- [Padding] Increased button padding for better readability
- [Spacing] Adjusted line height for better text alignment

v1.1 -
- Fixed the HLTB button URL to use the processed game title for better search results.

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
        $('#loader, .hltb-container').remove();
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
            const hltbKey = await fetchHLTBKey();
            const hltbData = await fetchHLTBData(gameName, hltbKey);

            cleanExistingElements();
            renderHLTBButton(gameName, hltbData);
        } catch (error) {
            console.error('HLTB Error:', error);
            renderErrorState(getNormalizedGameName());
        } finally {
            processing = false;
        }
    }

    function getNormalizedGameName() {
        const rawName = document.querySelector("#title h1").textContent;
        return rawName.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z _0-9`~!@#$%^&*()-=+|\\\]}[{;:'",<.>/?]/gi, '')
            .toLowerCase()
            .split(/\s+/)
            .map(word => `"${word}"`)
            .join(",");
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

    async function fetchHLTBData(gameName, key) {
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
                    searchTerms: JSON.parse(`[${gameName}]`),
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

    function processHLTBResponse(response) {
    if (!response.count) return ['HLTB', 'ff8c00'];

    const mainEntry = response.data.find(item =>
        item.game_name.toLowerCase() === document.querySelector("#title h1").textContent.toLowerCase()
    ) || response.data[0];

    if (!mainEntry.comp_main) return ['--', '222222'];

    // Convert times from seconds to hours
    const main = Math.round((mainEntry.comp_main / 3600) * 2) / 2;
    const mainPlus = Math.round((mainEntry.comp_plus / 3600) * 2) / 2;
    const completionist = Math.round((mainEntry.comp_100 / 3600) * 2) / 2;
    const allStyles = Math.round((mainEntry.comp_all / 3600) * 2) / 2;

    // Format the times with line breaks
    const formatTime = (time) => `${time} Hour${time !== 1 ? 's' : ''}`.replace('.5', '½');
    const timeString = [
        `Main Story: ${formatTime(main)}`,
        `Main + Sides: ${formatTime(mainPlus)}`,
        `Completionist: ${formatTime(completionist)}`,
        `All Styles: ${formatTime(allStyles)}`
    ].join('<br>');

    return [timeString, getConfidenceColor(mainEntry.comp_main_count)];
}

function renderHLTBButton(gameName, hltbData) {
    const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
    if (!target.length) return;

    const originalTitle = document.querySelector("#title h1").textContent;
    const [time, color] = processHLTBResponse(hltbData);
    target.append(`<div class="hltb-container" style="margin-top:10px;">
        <a class="btnv6_blue_hoverfade btn_medium"
           href="https://howlongtobeat.com/?q=${encodeURIComponent(originalTitle)}"
           target="_blank"
           style="background-color:#${color}; border:1px solid #8f9ca7; border-radius:4px; padding:8px 12px; font-size:14.4px; color:white; text-decoration:none; display:inline-block; white-space: normal; line-height:1.5;">
            ${time}
        </a>
    </div>`);
}

// Helper function to format time in hours
function formatTime(seconds) {
    const hours = Math.round((seconds / 3600) * 2) / 2;
    return `${hours} Hour${hours !== 1 ? 's' : ''}`.replace('.5', '½');
}

    function getConfidenceColor(confidence) {
        const colors = {
            5: "FF3A3A",
            10: "cc3b51",
            15: "824985",
            20: "5650a1",
            25: "485cab",
            30: "3a6db5",
            Infinity: "287FC2"
        };
        return Object.entries(colors).find(([threshold]) => confidence < threshold)[1];
    }

    function renderErrorState(gameName) {
        const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
        if (target.length) {
            target.append(`<div class="hltb-container" style="margin-top:10px;">
                <a class="btnv6_blue_hoverfade btn_medium"
                   href="https://howlongtobeat.com/?q=${encodeURIComponent(gameName)}"
                   target="_blank"
                   style="background-color:#222222;border:1px solid #8f9ca7;border-radius:4px;padding:1px 5px;font-size:14.4px;color:#cbd4dc;text-decoration:none;">
                    <span style="color:white;">Error</span>
                </a>
            </div>`);
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