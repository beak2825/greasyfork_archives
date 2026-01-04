// ==UserScript==
// @name         Copy code button for UserStyles.world
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to copy source code
// @author       You
// @match        https://userstyles.world/style/*
// @icon         https://userstyles.world/favicon.ico
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460193/Copy%20code%20button%20for%20UserStylesworld.user.js
// @updateURL https://update.greasyfork.org/scripts/460193/Copy%20code%20button%20for%20UserStylesworld.meta.js
// ==/UserScript==

var realCode = document.querySelector(".Style-source code").innerText;
var copyButton = document.createElement('button');
copyButton.innerText = "Copy code";
copyButton.onclick = ()=> {
    GM_setClipboard(realCode);
    alert('Copied！');
}
document.querySelector(".code h2").after(copyButton);