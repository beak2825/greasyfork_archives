// ==UserScript==
// @name        Winter Theme
// @name:zh-CN  油管自定义主题（肉桂狗和虚空骑士）
// @name:zh-TW  油管自定主題（肉桂狗和虛空騎士）
// @namespace   Violentmonkey Scripts
// @version     1.02
// @description The Best Winter Theme on Youtube
// @description:zh-CN  油管上最好的冬季主题
// @description:zh-TW  油管上最好的冬季主題
// @author      Zach Kosove
// @match       *://www.youtube.com/*
// @grant       GM_addStyle
// @icon        https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c78bc3fc-9f08-47ca-81ae-d89055c7ec49/db0enw6-92a4ff34-7247-45f1-8051-1ea40b2059ca.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M3OGJjM2ZjLTlmMDgtNDdjYS04MWFlLWQ4OTA1NWM3ZWM0OVwvZGIwZW53Ni05MmE0ZmYzNC03MjQ3LTQ1ZjEtODA1MS0xZWE0MGIyMDU5Y2EucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sSluklD5G6XB7s4jVPjj5XTLuSHTR_DTeRSOqwXyz6M
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486796/Winter%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/486796/Winter%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add styles
    function addStyle(css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    // CSS styles
    var customCSS = `
        /* replace YT logo */
        #logo-icon {
            content: url("https://i.pinimg.com/originals/26/76/1b/26761bb6052727e18ddf0022bf45d7e6.gif") !important;
            width: 85px !important;
            height: 50px !important;
            object-fit: cover !important;
        }

        /* hollow knight slider */
        .ytp-scrubber-pull-indicator {
            background-color: #fff0 !important;
            height: 40px !important;
            width: 45px !important;
            background-image: url(https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjExYjM5MDMxY2MwN2IwZDQ5ZjNlNjRlZDY2MGRjNjgwYzI1MGI2NSZjdD1z/Y8bAdBxtKREVcuDNyH/giphy.gif) !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-size: 43px, 80px !important;
            bottom: 18px !important;
            left: -10px !important;
            transform: rotate(0deg) !important;
            transform: scale(-1.5, 1.5) !important;
            border-radius: 30px !important;
        }

        /* sliderball */
        .ytp-swatch-background-color {
            background-color: #212a53 !important; /* Color for slider ball */
        }

        /* progress bar (videos) */
        .ytp-cairo-refresh-signature-moments .ytp-play-progress {
            background: #212a53 !important; /* Color for progress bar */
        }

        /* progress bar (thumbnails) */
        ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer {
            background: #212a53 !important; /* Red color for thumbnail progress bar */
        }

        /* old progress bar (remove if the follow through with a/b testing) */
        .ytp-play-progress,
        .ytp-buffered-progress {
            background-color: #212a53 !important; /* Match progress bar color to slider ball */
        }

        .ytp-settings-menu .ytp-menuitem-toggle-checkbox,
        .ytp-autonav-toggle-button,
        .yt-spec-icon-badge-shape__badge,
        .iron-selected {
            background-color: #212a53 !important; /* Maintain consistency */
        }

        .iron-selected .yt-chip-cloud-chip-renderer {
            color: #fff !important;
        }

        .ytd-thumbnail-overlay-resume-playback-renderer {
            background-color: #0b33e6 !important; /* Thumbnail overlay color */
        }

        .yt-core-attributed-string__link,
        #channel-name,
        yt-formatted-string.ytd-channel-name  {
            /* text and hyperlinks */
            color: #5461a1 !important; /* Text and link color */
        }
    `;

    addStyle(customCSS);
})();
