// ==UserScript==
// @name         汉字假名查询
// @description  选择汉字,右键-tampermonkey工具-汉字假名查询. 私人留存,功能有点欠缺
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       YueLi
// @match        *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @run-at context-menu

// @downloadURL https://update.greasyfork.org/scripts/448747/%E6%B1%89%E5%AD%97%E5%81%87%E5%90%8D%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448747/%E6%B1%89%E5%AD%97%E5%81%87%E5%90%8D%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

window.onload=(function() {
  let url = window.location.href;
  let ruby_link = "https://www.jpmarumaru.com/tw/toolKanjiFurigana.html";


  function getSelectionText() {

    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  }


  if (window.location.href == ruby_link) {
    let sendBtn = document.querySelector("#divTool > div:nth-child(3) > a > span");
    let inputArea = document.querySelector("#Text")
    inputArea.value = "hello";
    // localStorage.getItem("yll_selText")
  } else {
    // GM_setValue("selText", getSelectionText())
    window.location.href = ruby_link;
  }

})();