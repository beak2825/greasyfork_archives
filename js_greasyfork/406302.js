// ==UserScript==
// @name         油猴脚本网站 Greasy Fork 页面美化及去广告
// @description  优化油猴脚本网站中文版（https://greasyfork.org/zh-CN）代码显示区，采用暗色彩色风格和Consolas字体，阅读代码更加舒服。
// @icon         https://greasyfork.org/assets/blacklogo96-1221dbbb8f0d47a728f968c35c2e2e03c64276a585b8dceb7a79a17a3f350e8a.png
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.1
// @author       Tsing
// @run-at       document-start
// @match        https://greasyfork.org/zh-CN/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406302/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%20Greasy%20Fork%20%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E5%8F%8A%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406302/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%20Greasy%20Fork%20%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E5%8F%8A%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style_tag = document.createElement('style');
    style_tag.innerHTML = '.width-constraint{max-width:1260px !important;} pre.prettyprint.lang-js.prettyprinted{font-family: "Consolas"; background-color: #1a1a1a; color: #ffffff; font-size: 1.2em;} .com{color: #666 !important;} .pln{color: #fff !important;} .kwd{color: #2ff !important;} .clo, .opn, .pun{color: #ccc !important;} .str{color: #ff6 !important;} .lit{color: #4ff !important;} .typ{color: #f4f !important;} ';
    document.head.appendChild(style_tag);

    document.addEventListener ("DOMContentLoaded", remove_ad); // 等DOM加载完毕时执行
    function remove_ad(){
        document.getElementById("codefund").remove();
        document.getElementById("script-show-info-ad").remove();
    }

})();