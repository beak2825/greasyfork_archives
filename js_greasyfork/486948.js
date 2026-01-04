// ==UserScript==
// @name         Highlight Myself in Faction
// @namespace    microbes.torn.highlight
// @version      0.3
// @description  Highlight myself in faction rows
// @author       You
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php*
// @match        https://www.torn.com/preferences.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486948/Highlight%20Myself%20in%20Faction.user.js
// @updateURL https://update.greasyfork.org/scripts/486948/Highlight%20Myself%20in%20Faction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username = $(`#sidebarroot a[href^='/profiles.php?XID=']`).first().text();
    let backgroundColor = localStorage.getItem(`highlight_bg`) || '#00ff00';
    let textColor = localStorage.getItem(`highlight_text`) || '#ffffff';
    let selector = `#react-root img[alt="${username}"], #react-root-faction-info img[alt="${username}"]`;

    if (GetPageName() == "preferences.php") {
        waitForElementToExist('.preferences-container').then(() => {
            $('.preferences-container').after(`
                <div style="margin-top: 20px; background-color: grey; color: white;">
                    <h1>Highlight Myself</h1>

                    <input type="color" id="background-color" name="favcolor" value="${backgroundColor}"> Background Color
                    <input type="color" id="text-color" name="favcolor" value="${textColor}"> Text Color
                </div>`);

            $("#background-color").change(() => {
                localStorage.setItem(`highlight_bg`, $("#background-color").val());
            });

            $("#text-color").change(() => {
                localStorage.setItem(`highlight_text`, $("#text-color").val());
            });
        });
    }
    else {
        GM_addStyle ( `
            li:has(> div a div img[alt="${username}"]) {
                background: ${backgroundColor} !important;
            }
        `);
    }
})();

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}

function GetPageName() {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    return page;
}