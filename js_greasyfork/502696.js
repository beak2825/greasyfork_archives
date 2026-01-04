// ==UserScript==
// @name         自动关闭学习通AI助教
// @namespace    http://tampermonkey.net/
// @version      2024-06-04
// @description  自动关闭AI助教
// @author       AcZZZZ
// @match        https://mooc2-ans.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502696/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%AD%A6%E4%B9%A0%E9%80%9AAI%E5%8A%A9%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/502696/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%AD%A6%E4%B9%A0%E9%80%9AAI%E5%8A%A9%E6%95%99.meta.js
// ==/UserScript==

(function() {
    var i=0;
    var timer = setInterval(() => {
        i+=1;
        if(i >= 50)
        {
            clearInterval(timer);
        }
        document.getElementsByClassName("cx-robot-wrapper")[0].remove();
    }, 200)
})();