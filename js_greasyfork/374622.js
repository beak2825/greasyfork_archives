// ==UserScript==
// @name         优酷全屏快捷键（F键）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Lu Xi
// @match        *v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374622/%E4%BC%98%E9%85%B7%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88F%E9%94%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/374622/%E4%BC%98%E9%85%B7%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88F%E9%94%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0
    document.onkeydown=function(e){
        var keyNum=window.event ? e.keyCode :e.which;
        if(keyNum==70 && i==0){
            document.getElementsByClassName("control-icon control-fullscreen-icon")[0].click()
            i=1
        }
        else if (keyNum==70 && i==1) {
            document.getElementsByClassName("control-icon control-halfscreen-icon")[0].click()
            i=0
        }
    }
    // Your code here...
})();