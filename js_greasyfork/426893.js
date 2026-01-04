// ==UserScript==
// @name            Steam 使用客户端打开当前页面
// @name:en         Steam open current page in client
// @namespace       https://github.com/romebake/SteamOpenInClient
// @version         1.0.0
// @description     添加一个使用客户端打开当前页面的按钮
// @description:en  Add a button to open the current page using steam client
// @author          Romebake
// @icon            https://store.steampowered.com/favicon.ico
// @grant           GM_addStyle
// @match           *://*.steamcommunity.com/*
// @match           *://*.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/426893/Steam%20%E4%BD%BF%E7%94%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%89%93%E5%BC%80%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/426893/Steam%20%E4%BD%BF%E7%94%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%89%93%E5%BC%80%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const objs = {
        hrefText: {
            'zh-CN': '在客户端打开',
            'default': 'Open in client'
        },
        choose: function (name) {
            const language = navigator.language || navigator.userLanguage;
            return this[name][language] || this[name].default;
        }
    }

    const globalActions = document.getElementById('global_action_menu');
    if (globalActions) {
        GM_addStyle(`
            .linkToClient {
                display: inline-block;
                text-decoration: none;
                color: #DEDEDE;
                line-height: 24px;
                font-weight: normal;
                padding: 0px 9px 0px 35px;
                background-color: rgba( 103, 193, 245, 0.2 );
                background-image: url(https://store.akamai.steamstatic.com/public/images/v6/icon_platform_linux.png);
                background-repeat: no-repeat;
                background-position: 10px 2px;
            }
            .linkToClient:hover {
                color: #ffffff;
            }
        `)
        const linkBtn = document.createElement('a');
        linkBtn.setAttribute('href', `steam://openurl/${window.location.href}`);
        linkBtn.className = 'linkToClient'
        linkBtn.setAttribute('target', '_self');
        linkBtn.text = objs.choose('hrefText');
        globalActions.prepend(linkBtn);
    }
})();
