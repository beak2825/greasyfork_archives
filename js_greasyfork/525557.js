// ==UserScript==
// @name         Backloggd - Metacritic Integration
// @name:zh-CN   Backloggd - 集成Metacritic
// @namespace    https://greasyfork.org/en/users/1410951-nzar-bayezid
// @author       Nzar Bayezid
// @version      1.0
// @description  Adds Metacritic ratings on Backloggd
// @description:zh-CN 在Backloggd上添加Metacritic评分
// @icon         https://www.backloggd.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://backloggd.com/*
// @match        https://www.backloggd.com/*
// @grant        GM_xmlhttpRequest
// @connect      metacritic.com
// @license      MIT
// @noframes
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525557/Backloggd%20-%20Metacritic%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/525557/Backloggd%20-%20Metacritic%20Integration.meta.js
// ==/UserScript==

/*=========================  Version History  ==================================
v1.0 -
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
            const metacriticData = await fetchMetacriticData(gameName);

            cleanExistingElements();
            renderIntegrationSection(metacriticData);
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

    // Rendering
    function renderIntegrationSection(metacriticData) {
        const target = $("#game-body > div.col > div:nth-child(2) > div.col-12.col-lg-cus-32.mt-1.mt-lg-2");
        if (!target.length) return;

        // Common styling
        const containerStyle = "margin-top:10px; margin-bottom:15px;";
        const linkStyle = "display:inline-block; text-decoration:none; color:white; "
            + "border-radius:4px; padding:8px 12px; border:1px solid #8f9ca7; "
            + "font-size:14.4px; line-height:1.5; white-space: normal; "
            + "min-height: 54px; display: flex; align-items: center; justify-content: center;";

        const metacriticTextStyle = "display: flex; flex-direction: column; align-items: center;";

        // Metacritic Box
        if (metacriticData) {
            target.append(`
                <div class="integration-container" style="${containerStyle}">
                    <a href="${metacriticData.url}"
                       target="_blank"
                       style="${linkStyle} background-color:#16181c;">
                        <div style="${metacriticTextStyle}">
                            <div>
                                <span style="color:#e0e0e0;">Metacritic: </span>
                                <span style="color:#FFD700;">Critic: ${metacriticData.critic}</span> -
                                <span style="color:#28c236;">User: ${metacriticData.user}</span>
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