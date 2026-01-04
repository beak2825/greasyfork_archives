// ==UserScript==
// @name        Roblox comments
// @namespace   https://robloxcomments.pages.dev/
// @version     2024-11-18
// @description Adds a comment section to roblox games
// @author      Pooiod7
// @match       https://www.roblox.com/games/*
// @icon        https://robloxcomments.pages.dev/icon.png
// @license     GNU GPLv3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/517936/Roblox%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/517936/Roblox%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElements(selectors, callback) {
        const observer = new MutationObserver(() => {
            for (let selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    return callback(element);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function getFirstElement(elements) {
        for (const selector of elements) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    var commentsframe = document.createElement('iframe');
    var placements = [
        "#game-detail-page > div.col-xs-12.btr-game-main-container.section-content",
        "#game-details-about-tab-container > div > div.game-description-container"
    ];
    var links = [
        "#right-navigation-header > div.navbar-right.rbx-navbar-right > ul > div.age-bracket-label.text-header.btr-nav-node-header_agebracket.btr-nav-header_agebracket > a",
        "#right-navigation-header > div.navbar-right.rbx-navbar-right > ul > div.age-bracket-label.text-header > a"
    ];

    window.addEventListener("message", function(event) {
        if (event.origin === "https://www.roblox.com" || event.origin === "https://robloxcomments.pages.dev") {
            if (event.data == "comments frame listening") {
                var link = getFirstElement(links);
                const BodyRGB = window.getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
                var dark = (BodyRGB[0] * 0.299 + BodyRGB[1] * 0.587 + BodyRGB[2] * 0.114) / 255 < 0.5

                commentsframe.contentWindow.postMessage({
                    id: link?(link.href.match(/\d+/g) || []).join(''):0,
                    game: (window.location.href.match(/\/games\/(\d+)(?=\/|$)/g) || []).map(m => m.match(/\d+/)[0]).join(','),
                    dark: dark
                }, "*");
            } else if (event.data.endsWith("px") || event.data.endsWith("%")) {
                commentsframe.style.height = event.data;
            }
        }
    });

    waitForElements(placements, (container) => {
        setTimeout(function(){
            commentsframe.src = '//robloxcomments.pages.dev/comment.html';
            commentsframe.style.width = '100%';
            commentsframe.style.height = '250px';
            commentsframe.style.border = '0px';
            container.appendChild(commentsframe);
        }, 1000);
    });
})();
