// ==UserScript==
// @name         Avgle Web WideScreen
// @namespace    https://avgle.com
// @version      1.2
// @description  Avgle Player Web WideScreen
// @author       XF
// @match        https://avgle.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438471/Avgle%20Web%20WideScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/438471/Avgle%20Web%20WideScreen.meta.js
// ==/UserScript==

(() => {
document.getElementsByClassName("container")[2].style.width="100%";
document.getElementById("embed_video_box").parentNode.style.width="100%";
})();