// ==UserScript==
// @name             优化元宝可读性
// @namespace        https://github.com/qianjunlang/
// @version          2.4
// @description      移除元宝页面的多余元素，聊天气泡颜色模拟微信，提供更好的阅读体验
// @icon             https://cdn-bot.hunyuan.tencent.com/logo.png
// @author           qianjunlang
// @match            https://yuanbao.tencent.com/*
// @grant            none
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/529416/%E4%BC%98%E5%8C%96%E5%85%83%E5%AE%9D%E5%8F%AF%E8%AF%BB%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/529416/%E4%BC%98%E5%8C%96%E5%85%83%E5%AE%9D%E5%8F%AF%E8%AF%BB%E6%80%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        

        #app .yb-layout__content.agent-layout__content .agent-dialogue__content .agent-dialogue__content--common__input.agent-chat__input-box .agent-dialogue__content--common__input-box {
            padding: 0 !important;
        }
        #app .yb-layout__content.agent-layout__content .agent-dialogue__content .agent-dialogue__content--common__header,
        .yb-layout__content.agent-layout__content .agent-dialogue .agent-dialogue__content-wrapper .agent-dialogue__content-copyright,
        #app .yb-layout__content.agent-layout__content .agent-dialogue__content .agent-dialogue__tool > div,
        #app .yb-layout__content.agent-layout__content .agent-dialogue__content .agent-dialogue__content--common__content .agent-chat__list__content-wrapper .agent-chat__scroll-arrow,
        #chat-content .index_pc_download_ads_card_banner__FillW
        {
            display:none;
        }

        .agent-chat__bubble.agent-chat__bubble--human.agent-chat__conv--human .agent-chat__bubble__content{
            background : #07C160 !important;
        }

        .hyc-common-markdown.hyc-common-markdown-style{
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            /*color:black;*/
        }


    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);


})();