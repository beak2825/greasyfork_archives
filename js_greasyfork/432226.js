// ==UserScript==
// @name         自动填写91tvg验证码
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动计算91tvg的算术题，并提交。
// @author       Jack Wang
// @match        https://www.91tvg.com/*
// @icon         https://www.91tvg.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432226/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%9991tvg%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432226/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%9991tvg%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    var btn = document.getElementsByName("secqsubmit");
    if (btn.length > 0){
        var title = document.title
        var nums = title.split('=')[0].split('+');
        var input = document.getElementsByName("answer");
        var answer = 0;
        for (var i=0;i<nums.length;i++){
            answer+=parseInt(nums[i]);
        }
        input[0].value = answer;
        btn[0].click();
    }

})();