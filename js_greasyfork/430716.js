// ==UserScript==
// @name         重大网络教育练习题答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  重庆大学网络教育学院练习题答案啊!
// @author       You
// @match        https://exercise.5any.com/Exercise/WebUI/Exerpool/Index
// @icon         https://www.google.com/s2/favicons?domain=5any.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430716/%E9%87%8D%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E7%BB%83%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/430716/%E9%87%8D%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E7%BB%83%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
    $(".std-answer").attr("style","");
    $(".std-answer").removeClass("hidden");
        },1000)
})();