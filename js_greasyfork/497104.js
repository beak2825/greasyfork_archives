// ==UserScript==
// @name         Timiy WEB定制化插件
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  定制化各种网页插件
// @author       Timiy
// @icon         https://raw.githubusercontent.com/timibox/Timiy-tampermonkey/main/icon.png
// @match        https://chatgpt.com/*
// @match        https://www.douyu.com/*
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497104/Timiy%20WEB%E5%AE%9A%E5%88%B6%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/497104/Timiy%20WEB%E5%AE%9A%E5%88%B6%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 获取当前页面的 URL
    var currentURL = window.location.href;

    // CHATGPT自定义样式
    if (currentURL.includes('chatgpt.com')) {
        GM_addStyle(`
            .mx-auto {
                max-width: 90vw;
            }
        `);
    }


    if (currentURL.includes('douyu.com')) {
    GM_addStyle(`
        .ChargeTask-closeBg.react-draggable {
            display: none;
        }
        .layout-Player-announce {
            display: none;
        }
        .layout-Player-rank {
            display: none;
        }
        div#js-room-activity {
            display: none;
        }
        @media screen and (max-width: 1200px) {
            .layout-Player {
                display: flex;
                flex-direction: column;
                min-width: auto!important;
            }
            .layout-Player-main {
                width: 100vw!important;
                height: 710px!important;
                z-index: 2;
                flex: none;
                background: #ff0000;
            }
            .layout-Player-aside {
                width: 100%;
                height: 100%;
            }
        }
    `);
    }

    if (currentURL.includes('live.bilibili.com')) {
        GM_addStyle(`
           @media screen and (max-width: 1200px) {
                .player-and-aside-area {
                    display: flex!important;
                    flex-direction: column;
                }
                .player-section.p-relative {
                    width: 100%!important;
                    height: 605px!important;
                }
                div#rank-list-vm {
                    display: none;
                }
                .aside-area.p-absolute.border-box {
                    position: relative!important;
                    width: 100vw!important;
                    height: calc(100vh - 427px) !important;
                    margin-left: -4px;
                    top: 427px!important;
                }
           }
        `);
    }


})();
