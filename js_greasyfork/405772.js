// ==UserScript==
// @name         SteamFriendActivityTweak
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Steam Friend Activity Tweak
// @author       You
// @match        https://steamcommunity.com/id/*/home/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405772/SteamFriendActivityTweak.user.js
// @updateURL https://update.greasyfork.org/scripts/405772/SteamFriendActivityTweak.meta.js
// ==/UserScript==

// =====配置选项=====
// 自动对指定的appid或者userid发送的截图添加剧透图层
// 指定appid，例子：[ 730 ]
const appIDs = [  ];
// userid
const userIDs = [  ];
// ==================


(function() {
    'use strict';

    const style = `
.spoiler:not(:hover) {
    color: #000;
    background: #000;
}
`;
    GM_addStyle(style);

    const targetDOM = document.getElementById('blotter_content');

    function executeHide(target) {
        Array.from(target.querySelectorAll('.blotter_block')).forEach((element) => {
            const screenshotDOM = element.getElementsByClassName('blotter_screenshot');
            if (screenshotDOM.length === 0) {
                return;
            }

            const screenshot = screenshotDOM[0];
            const userID = parseInt(screenshot.querySelector('.blotter_author_block .blotter_avatar_holder a .playerAvatar img').getAttribute('data-miniprofile'));
            const appLink = screenshot.querySelector('.blotter_author_block div:nth-child(3) a').getAttribute('href');
            const appID = parseInt(/app\/(\d+)/.exec(appLink)[1]);


            if (appIDs.includes(appID) || userIDs.includes(userID)) {
                console.log(`🙈 userID=${userID} appID=${appID} `);
                screenshot.querySelector('.ss_spoiler_cover').style.display = 'block';

                const thumbs = element.querySelectorAll('.highlight_strip_scroll > div > div');
                thumbs.forEach((element) => {
                    const id = /gallery_(\d+)/.exec(element.getElementsByTagName('img')[0].id)[1];
                    const spoilerCover = document.createElement('div');
                    spoilerCover.innerHTML = `<div id="ss_thumb_spoiler_cover_${id}" class="ss_thumb_spoiler_cover"></div>`
                    element.appendChild(spoilerCover.firstChild);
                });

                element.getElementsByClassName('blotter_screenshot_title')[0].classList.add('spoiler');
            }
        });
    }

    window.onload = function() {
        executeHide(targetDOM);

        const obserber = new MutationObserver(function(mutations) {
            console.log(mutations);
            executeHide(mutations[0].addedNodes[0]);
        }).observe(targetDOM, { childList: true });
    }

})();