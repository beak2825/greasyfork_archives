// ==UserScript==
// @name         游民星空文章简洁显示
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  游民星空新闻、攻略显示简化。
// @author       fengqi
// @match        *://*.gamersky.com/handbook/*/*.shtml
// @match        *://*.gamersky.com/news/*/*.shtml
// @match        *://*.gamersky.com/gl/*/*.shtml
// @match        *://*.gamersky.com/hardware/*/*.shtml
// @match        *://*.gamersky.com/tech/*/*.shtml
// @icon         https://www.gamersky.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525387/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E6%96%87%E7%AB%A0%E7%AE%80%E6%B4%81%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525387/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E6%96%87%E7%AB%A0%E7%AE%80%E6%B4%81%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=()=>{
        const classesToDelete = [
            'Mid2_R',
            'Mid_top',
            'Top',
            'QZnav',
            'fixedCode',
            'Bot',
            'Relevant',
            'Comment',
            'box',
            'bgAdWrap',
            'gs_comm_content_bot_fun',
            'gs_ccs_solve',
            'supportMe',
            'referencecontent',
        ];
        document.querySelectorAll(classesToDelete.map(cls => `.${cls}`).join(',')).forEach(el => el.remove());
        document.querySelectorAll('div.Mid2_L').forEach(el => {
            el.style.float = 'none';
            el.style.margin = '0 auto';
        });
        document.querySelectorAll('div.Mcenter').forEach(el => {
            el.style.padding = '0';
        });
    }
})();