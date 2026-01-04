// ==UserScript==
// @name         AiStudio Chat 主题优化
// @namespace    http://120.46.24.57/
// @version      0.5
// @description  优化了AiStudio Chat板块的主题，使它不那么刺眼
// @author       ChenMo
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530994/AiStudio%20Chat%20%E4%B8%BB%E9%A2%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530994/AiStudio%20Chat%20%E4%B8%BB%E9%A2%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS 样式
    const customCSS = `
body.dark-theme {
    & .chat-turn-container .inline-code {
        color: #ffec99;
        background-color: rgba(255, 249, 219, 0.1);
    }

    /* 针对所有支持的浏览器 */
    & .chat-turn-container ::selection {
      background-color: #495057;
    }

    & .chat-turn-container.render.user .user-prompt-container .turn-content .text-chunk {
        background-color: #343a40;
        color: #efefef
    }
}

body.light-theme {
    & .chat-turn-container .inline-code {
        color: #e67700;
        background-color: rgba(255, 249, 219, 0.9);
    }

    /* 针对所有支持的浏览器 */
    & .chat-turn-container ::selection {
        background-color: #a5d8ff;
    }

    & .chat-turn-container.render.user .user-prompt-container .turn-content .text-chunk {
        background-color: #343a40;
        color: #efefef
    }
}

.chat-turn-container .ng-star-inserted:not(.footer-icon) {
    font-family: "Arial",  "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, sans-serif;
}

.chat-turn-container span.ng-star-inserted {
    font-size: 1.15rem;
    line-height: 1.7;
}

.chat-turn-container code,
.chat-turn-container .inline-code {
    font-family: "Fira Code", "Consolas" !important;
}

.chat-turn-container code {
    font-size: 1rem;
}

div.thought-container {
    max-width: 100% !important;
}
    `;

    // Inject CSS
    GM_addStyle(customCSS);

    // Log
    console.log('AiStudio Dark Optmized has been applied。');

})();