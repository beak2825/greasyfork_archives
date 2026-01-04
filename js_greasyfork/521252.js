// ==UserScript==
// @name         隐藏闲鱼聊天顶部logo
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  隐藏闲鱼聊天顶部logo(desc)
// @author       imzhi <yxc_blue@126.com>
// @match        https://www.goofish.com/im*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521252/%E9%9A%90%E8%97%8F%E9%97%B2%E9%B1%BC%E8%81%8A%E5%A4%A9%E9%A1%B6%E9%83%A8logo.user.js
// @updateURL https://update.greasyfork.org/scripts/521252/%E9%9A%90%E8%97%8F%E9%97%B2%E9%B1%BC%E8%81%8A%E5%A4%A9%E9%A1%B6%E9%83%A8logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
#header {display: none}
`;
    GM_addStyle(css);
})();