// ==UserScript==
// @name         快速访问arxiv
// @namespace    https://github.com/Whiskysu/SelfEditTampermonkeyScripts/
// @version      0.2
// @description  快速打开arxiv网页，解决访问慢问题，由于该中文地址收录较慢，较新的文献无效。
// @author       suyiranzhi
// @homeurl    https://github.com/Whiskysu/SelfEditTampermonkeyScripts/快速访问arxiv.js
// @license      MIT
// @match      https://*.arxiv.org/*/*
// @icon         https://github.com/Whiskysu/Su_Picture_Bed/blob/master/master/arxiv.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443796/%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AEarxiv.user.js
// @updateURL https://update.greasyfork.org/scripts/443796/%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AEarxiv.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var btn = document.createElement("BUTTON");
  btn.innerText = "快速arxiv";
  btn.style.cssText = `
    position: fixed;
    bottom: 250px;
    left: 625px;
    // position: relative;
    color:white;
    color-scheme:dark;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    font-weight: bolder;
    font-size: 14px;
    margin-left: 8px !important;
    display: inline-block;
    padding: 5px 16px;
    line-height: 20px;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    border: 1px solid rgba(205, 217, 229, 0.1);
    border-radius: 6px;
    background: rgb(52, 125, 57);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    `;
//   document.querySelector(".file-navigation").appendChild(btn);
  document.body.appendChild(btn);
  btn.onclick = toOnlineEditor;
  function toOnlineEditor() {
    console.log("toOnlineEditor");
    window.open(`${"http:/xxx.itp.ac.cn" + window.location.pathname}`);

  }
  // Your code here...
})();
