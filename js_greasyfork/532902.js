// ==UserScript==
// @name         Wider Xiaobot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使 Xiaobot 文章页面内容区域更宽。
// @author       Your Name
// @match        https://xiaobot.net/post/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532902/Wider%20Xiaobot.user.js
// @updateURL https://update.greasyfork.org/scripts/532902/Wider%20Xiaobot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .app-container {
            max-width: none !important;
        }
        .app-container > .left {
            flex-grow: 1 !important;
            max-width: 90% !important;
        }

		.left {
			margin-left: 15px;
			margin-right: 15px;
		}
    `);
})();