// ==UserScript==
// @name         提前切换到VM页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提前切换到VM页面描述
// @author       You
// @match        */vj/*.aspx
// @icon         https://icons.duckduckgo.com/ip2/tampermonkey.net.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445519/%E6%8F%90%E5%89%8D%E5%88%87%E6%8D%A2%E5%88%B0VM%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/445519/%E6%8F%90%E5%89%8D%E5%88%87%E6%8D%A2%E5%88%B0VM%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var oldurl = window.location.href;
    var newurl = oldurl.replace("/vj/","/vm/");
    window.location.href= newurl;
})();