// ==UserScript==
// @name         expand of cnki
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  增强cnki体验
// @author       GGRS
// @match        https://kns.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487215/expand%20of%20cnki.user.js
// @updateURL https://update.greasyfork.org/scripts/487215/expand%20of%20cnki.meta.js
// ==/UserScript==
// 绑定ctrl+c的快捷键
function copy() {
  var selectedText = window.getSelection().toString();
  if (selectedText) {
    var tempInput = document.createElement("input");
    tempInput.value = selectedText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    console.log("Selected text copied to clipboard");
  } else {
    console.log("没有选中任何文本");
  }
}

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "c") {
    console.log("pressed");
    copy();
  }
});
