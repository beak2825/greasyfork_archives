// ==UserScript==
// @name         Chatable Google AI Studio 聊得下去的 Gemini 开发者模式
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Auto collapse sidebars in Google AI Studio. 原网页总是莫名弹出左右栏，非常反人类。Trim excess margins. 去除上下左右多余空白，释放阅读空间。The script will automatically activate the grounding(google search) feature for new chats. 自动点开google搜索。Adjust fonts for better readability. 调整字体、大小、行高、线条粗细、使用像素级别抗锯齿等等（在代码末尾的css里修改）。
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_256x256.png
// @author       qianjunlang
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528232/Chatable%20Google%20AI%20Studio%20%E8%81%8A%E5%BE%97%E4%B8%8B%E5%8E%BB%E7%9A%84%20Gemini%20%E5%BC%80%E5%8F%91%E8%80%85%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528232/Chatable%20Google%20AI%20Studio%20%E8%81%8A%E5%BE%97%E4%B8%8B%E5%8E%BB%E7%9A%84%20Gemini%20%E5%BC%80%E5%8F%91%E8%80%85%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var lastURL = "Fake://Initial.URL/";

    const collapseSidebar = () => {
        if ( lastURL == window.location.href || !window.location.href.includes('/prompts/') ) {
            lastURL = window.location.href;
            return;
        }

        const expandedSidebar = document.querySelector('ms-navbar .nav-content.expanded');
        if ( expandedSidebar ) document.querySelector('button[aria-label="Toggle navigation menu"]').click();

        if ( window.location.href.includes('/prompts/new_chat') ){
            const searchToggle = document.querySelector('button[aria-label="Grounding with Google Search"]');

            if (searchToggle) {
                if (!document.querySelector('.search-source')) searchToggle.click();

                const UrlToggle = document.querySelector('button[aria-label="Browse the url context"]');
                if (UrlToggle) UrlToggle.click();

                const exeToggle = document.querySelector('button[aria-label="Code execution"]');
                if (exeToggle) exeToggle.click();

            }
            
            lastURL = window.location.href;

        } else if ( document.querySelector('ms-run-settings .expanded') ){
            document.querySelector('button[aria-label="Close run settings panel"]').click();
            lastURL = window.location.href;
        }

    };

    const intervalId = setInterval( collapseSidebar , 500 ); 

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    const style = document.createElement('style');
    style.textContent = `

        .toolbar-container {
            padding:0!important;
        }

        body > app-root footer{
            margin-bottom : 0 !important;
            padding-bottom: 0!important;
        }
        body > app-root footer .prompt-input-wrapper {
            margin: 0 !important;
            max-width:unset!important;
            padding-top: 0!important;
            padding-bottom: 0 !important;
            padding-right: 0!important;
        }
        .prompt-box-container{
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            max-width:unset!important;
        }

        .chat-container .chat-view-container {
            padding-top:0  !important;
            padding-bottom:0 !important;
        }
        ms-chat-turn{
            margin:0!important;
            max-width: unset!important;
        }
        body > app-root ms-prompt-switcher ms-chat-session > ms-autoscroll-container{
            padding-left : 0 !important;
            padding-right: 5px !important;
        }

        body ms-cmark-node p {
            font-size: 15.5px !important;
            line-height: 1.6 !important;
            font-family:  "Roboto", "Open Sans", "Source Han Sans", system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif !important;
            /*font-weight: 300 !important;*/
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
        }
        body ms-cmark-node .inline-code {
            font-size: 15.5px !important;
            letter-spacing: 0.04em !important; /* 略微增加字间距 */
            font-family: 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace !important;
        }
        body ms-cmark-node pre code {
            font-size: 14.5px !important;
            line-height: 1.1 !important;
            font-family: Consolas, 'SF Mono', 'Roboto Mono', 'Cascadia Code', Menlo,  monospace !important;
        }


    `;
    document.head.appendChild(style);

})();