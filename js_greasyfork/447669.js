// ==UserScript==
// @name         vehicle number bidding
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  深圳小汽车历史竞价表优雅显示
// @author       hujun
// @match        https://xqctk.jtys.sz.gov.cn/bszn/20171206/1512524976335_1.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sz.gov.cn
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447669/vehicle%20number%20bidding.user.js
// @updateURL https://update.greasyfork.org/scripts/447669/vehicle%20number%20bidding.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    $('div.details table tr:eq(1)').css({
        position: 'sticky',
        top: '0',
        background: 'white',
        fontWeight: 'bold'
    })
    $('div.details table tr:eq(2)').css({
        position: 'sticky',
        top: '28px',
        background: 'white',
        fontWeight: 'bold'
    })
})();