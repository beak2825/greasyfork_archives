// ==UserScript==
// @name         腾讯课堂自动签到
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动签到腾讯课堂，2020-03-04有效，不会误点提交答案
// @author       SDchao
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396610/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396610/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(clickSign,5000);
    // Your code here...
})();

function clickSign() {
    'use strict';
    var elements = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
    for(var i = 0; i < elements.length; i++) {
        try {
            var element = elements[i];
            if(element.innerHTML == "签到") {
                element.click();
                setTimeout(clickConfirm,2000);
                break;
            }
        }
        catch(e){}
    }
}

function clickConfirm() {
    'use strict';
    var elements2 = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
    for(var i = 0; i < elements2.length; i++) {
        try {
            var element = elements2[i];
            if(element.innerHTML == "确定") {
                element.click();
                break;
            }
        }
        catch(e){}
    }
}