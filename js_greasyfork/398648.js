// ==UserScript==
// @name         greasy fork 评论验证码自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/zh-CN/forum/post/discussion?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398648/greasy%20fork%20%E8%AF%84%E8%AE%BA%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/398648/greasy%20fork%20%E8%AF%84%E8%AE%BA%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = document.querySelector("#DiscussionForm > div > form > div > div.Buttons > div").innerText.replace('=','')
    document.querySelector("#DiscussionForm > div > form > div > div.Buttons > div > input").value = eval(a)
    // Your code here...
})();