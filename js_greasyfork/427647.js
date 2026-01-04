// ==UserScript==
// @name         AMOBBS.COM good old font
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  设置此网站的字体
// @author       shamiao
// @match        https://www.amobbs.com/*
// @icon         https://www.google.com/s2/favicons?domain=amobbs.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427647/AMOBBSCOM%20good%20old%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/427647/AMOBBSCOM%20good%20old%20font.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const font_family = 'Tahoma, SimSun, Helvetica, sans-serif';
    const font_size = '12px';

    GM_addStyle(`body, input, button, select, textarea { font: ${font_size} ${font_family} ; }`);
    GM_addStyle(`.xst { font-size: ${font_size} ; font-family: ${font_family} ; }`);
    GM_addStyle(`.t_f, .t_f td { font-size: ${font_size}; `);
})();
