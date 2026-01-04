// ==UserScript==
// @name         niconico動画のタイトル移動するやつ
// @namespace   https://www.amania-tools.com
// @version      1
// @description  タイトルを動画下に移動します
// @author       amania
// @match        https://www.nicovideo.jp/watch/*
// @grant      GM_addStyle
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471306/niconico%E5%8B%95%E7%94%BB%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/471306/niconico%E5%8B%95%E7%94%BB%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let breakpointWidth = 1392
    function setPlayerPanelHeight() {
        const playerPanel = document.querySelector('.MainContainer-playerPanel');
        if (playerPanel) {
            if (window.innerWidth <= breakpointWidth) {
                playerPanel.style.height = '67%';
            } else {
                playerPanel.style.height = '75%';
            }
        }
    }

    const watchAppContainerMain = document.querySelector('.HeaderContainer');
    const mainContainer = document.querySelector('.MainContainer');
    GM_addStyle(`
        .MainContainer-playerPanel {
            min-height: 67% !important;
            max-height: 75% !important;
            height: auto !important;
            padding-top:5%;
        }
        .MainContainer{
           padding-top:5%;
        }
    `);
    if (watchAppContainerMain && mainContainer) {
        mainContainer.appendChild(watchAppContainerMain);
    }

})();