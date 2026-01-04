// ==UserScript==
// @name         登录宝塔
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sco
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397470/%E7%99%BB%E5%BD%95%E5%AE%9D%E5%A1%94.user.js
// @updateURL https://update.greasyfork.org/scripts/397470/%E7%99%BB%E5%BD%95%E5%AE%9D%E5%A1%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var url = window.location.href
    if(url.indexOf(":8888") != -1){
        console.log(123456)
        $(".inputtxt").eq(0).attr("value","x8iu9x0e")
        $(".inputtxt").eq(1).attr("value","230fd968")
    }
})();