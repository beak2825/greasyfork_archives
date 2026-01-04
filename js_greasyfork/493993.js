// ==UserScript==
// @name         Osu top play positions
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  Show the numbered position of each top play. (#1 - #100). Also fix some UI mess. Just CSS.
// @author       beastwick18
// @match        https://osu.ppy.sh/*
// @icon         https://osu.ppy.sh/images/favicon/favicon-32x32.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493993/Osu%20top%20play%20positions.user.js
// @updateURL https://update.greasyfork.org/scripts/493993/Osu%20top%20play%20positions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #wrapper {
            padding: 0 !important
        }

        .simple-menu__header-icon {
            width: 30px !important;
            opacity: 0 !important;
        }

        .js-current-user-cover > div {
            opacity: 0 !important;
        }

        .simple-menu__header::before {
            background-color: rgba(0,0,0,.25) !important
        }

        .header-v4__bg-container {
            display: none;
        }
        .nav2__menu-popup > .simple-menu {
            background: hsla(0,0%,7%,.9);
        }
        .nav2-header__menu-bg.js-nav2--menu-bg {
            display: none;
        }
        .nav2__notification-container {
            border: none;
        }
        .header-v4__container.header-v4__container--main {
            min-height: 0;
            height: 0;
            visibility: hidden;
        }

        .profile-page-cover-editor-button {
            width: 100%;
            height: 100%;
        }

        .profile-page-cover-editor-button > button {
            opacity: 0;
            width: 100%;
            height: 100%;
        }

        .profile-page-cover-editor-button {
            top: 0;
        }

        .profile-cover-change-popup {
            top: 100% !important;
            right: 0 !important;
            margin: 10px;
            overflow: hidden;
        }

        .profile-cover-change-popup__defaults {
            display: none !important;
        }

        .play-detail-list.u-relative:nth-of-type(2) > .play-detail::before {
            content: "#"counter(section);
            width: 40px;
            position: absolute;
            right: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 1.3rem;
            font-weight: bold;
        }

        .lazy-load > .play-detail-list > .play-detail {
            counter-increment: section;
        }
    `)
})();