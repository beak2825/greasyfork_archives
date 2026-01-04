// ==UserScript==
// @name        AI2MOE 深色模式
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description 御爱同萌的深色模式
// @author      injustice1
// @match       http*://www.ai2moe.org/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/476021/AI2MOE%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/476021/AI2MOE%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const css = `

        body, html, div, section, article, aside, header, footer, nav, form, ul, li, .Mega-Footer, .ipsLayout_container {
            background-color: #121212 !important;
            color: #e8e8e8 !important;
        }
        a, a:link, a:visited {
            color: #e8e8e8 !important;
        }
        p, span, h1, h2, h3, h4, h5, h6, button, select, option, textarea {
            background-color: #121212 !important;
            color: #e8e8e8 !important;
        }

        input[type="number"] {
            background-color: #2a2a2a !important;
            color: #e8e8e8 !important;
        }

        h3.ipsWidget_title.ipsType_reset, .ipsFieldRow_content input[type="number"] {
            background-color: #2a2a2a !important;
        }

        div[data-role="sidebarAd"] {
            display: none !important;
        }

        ul.ipsDataItem_lastPoster, ul.ipsDataItem_lastPoster li, ul.ipsDataItem_lastPoster a {
            background-color: #121212 !important;
            color: #e8e8e8 !important;
        }

        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;

    const darkModeEnabled = GM_getValue('darkModeEnabled', true);

    function toggleDarkMode() {
        const isEnabled = GM_getValue('darkModeEnabled');
        GM_setValue('darkModeEnabled', !isEnabled);
        window.location.reload();
    }

    if (darkModeEnabled) {
        GM_addStyle(css);
    }

    const toggleButton = document.createElement('div');
    toggleButton.innerHTML = `<img id="gearIcon" src="https://img.icons8.com/ios-filled/24/${darkModeEnabled ? 'ffffff' : '000000'}/settings.png"/>`;
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '9999';
    toggleButton.onclick = toggleDarkMode;
    document.body.appendChild(toggleButton);
})();
