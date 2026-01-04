// ==UserScript==
// @name         Fuck Yunpan1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove popPanel of yunpan1.cc.
// @author       You
// @match        https://www.yunpan1.cc/d/181929-zheng-jiu-da-bing-rui-en-4k-remux-guo-ying-shuang-yu-te-xiao-zi-mu-892gb
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunpan1.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503188/Fuck%20Yunpan1.user.js
// @updateURL https://update.greasyfork.org/scripts/503188/Fuck%20Yunpan1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("secretCode").closest("div").parentNode.remove("div");
    console.log("Remove the popPanel successfully!");
})();