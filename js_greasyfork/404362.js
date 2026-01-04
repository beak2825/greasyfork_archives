// ==UserScript==
// @name         句解霸回车
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  句解霸回车键搜索
// @author       SUNSHINE
// @match        http://www.en998.com/*
// @grant        none
// @icon         http://www.en998.com/favicon.ico
// @license MIT
// @copyright 2020, SUNbrightness (https://openuserjs.org/users/SUNbrightness)
// @downloadURL https://update.greasyfork.org/scripts/404362/%E5%8F%A5%E8%A7%A3%E9%9C%B8%E5%9B%9E%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/404362/%E5%8F%A5%E8%A7%A3%E9%9C%B8%E5%9B%9E%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    $(document).keyup(function (event){
        console.log(event);
        var metaKeyPressed = event.metaKey;
        var altKeyPressed = event.altKey;
        var shiftKey = event.shiftKey;

        if(event.keyCode==13){
           GetAnalysis2();
        }
    });

})();