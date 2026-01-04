// ==UserScript==
// @name         eyny自动简体
// @version      0.2
// @description 自动调整eyny论坛为简体显示（繁体用户请勿安装）
// @author       ff520
// @license MIT

// @match         *.eyny.com/*
// @grant        none
// @namespace https://greasyfork.org/users/19329
// @downloadURL https://update.greasyfork.org/scripts/470808/eyny%E8%87%AA%E5%8A%A8%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/470808/eyny%E8%87%AA%E5%8A%A8%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    if (document.getElementById("StranLink")  != null && document.getElementById("StranLink").innerText == "简体"){
        document.getElementById("StranLink").click()}
   
   
})();