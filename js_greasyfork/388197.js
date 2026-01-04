// ==UserScript==
// @name         CSDN终结者百度版
// @description  关掉垃圾堆CSDN
// @version      1.5
// @author       CHENMO
// @match        https://www.baidu.com/*
// @homepageURL  https://github.com/chenmoand
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/scripts/388197

// @downloadURL https://update.greasyfork.org/scripts/388197/CSDN%E7%BB%88%E7%BB%93%E8%80%85%E7%99%BE%E5%BA%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/388197/CSDN%E7%BB%88%E7%BB%93%E8%80%85%E7%99%BE%E5%BA%A6%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 万恶的csdn滚球把
    const bdinput = $("#form input[name='wd']");
    const bdsubmit = $("#form input[value='百度一下']")
    bdsubmit.click(() => {
        if(!isSpeac(bdinput.val())){
            bdinput.val(bdinput.val() + ' -csdn');
        }
    });
    const isSpeac = (str) => {
        if(str.length <= 5) {return (false)};
        return str.substr(str.length - 5, str.length) === '-csdn';
    }

})();