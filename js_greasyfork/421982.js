// ==UserScript==
// @name         隐社新版页面ysjp.xyz错位修正
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  修正隐社页面错位的问题，页面模块排布正常起来。
// @author       Tomosawa
// @match        http://ysjp.xyz/drama/
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421982/%E9%9A%90%E7%A4%BE%E6%96%B0%E7%89%88%E9%A1%B5%E9%9D%A2ysjpxyz%E9%94%99%E4%BD%8D%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/421982/%E9%9A%90%E7%A4%BE%E6%96%B0%E7%89%88%E9%A1%B5%E9%9D%A2ysjpxyz%E9%94%99%E4%BD%8D%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        $("[id=box]").css("height","375px");
        $("[id=box]").css("overflow","hidden");
    });
})();