// ==UserScript==
// @name         phpwind字体大小
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  橘园字体放大
// @author       林涂
// @include      *://bbs.jooyoo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jooyoo.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503793/phpwind%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/503793/phpwind%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==


(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    addStyle('.quote,.blockquote3,#thread_subject { line-height: 35px;font-size: 25px;}');

    addStyle('.c,.f14,#p_tpc { line-height: 30px;font-size: 24px;}');

    addStyle('.fl_icn { line-height: 30px;font-size: 20px;}');

    addStyle('.psti { line-height: 30px;font-size: 24px;}');
})();