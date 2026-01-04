// ==UserScript==
// @name         mox.moe 下载工具
// @version      0.1
// @author       hjun
// @description  mox.moe 在 safari 下载 epub
// @match        *mox.moe/c/*
// @license      GPL-3.0 License
// @namespace    hjun.eth
// @downloadURL https://update.greasyfork.org/scripts/456444/moxmoe%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/456444/moxmoe%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

async function safari_onclick(text) {
  function sleep(_timeout) {
    return new Promise(resolve => setTimeout(resolve, _timeout));
  }
  var links = document.querySelectorAll('a[href]');

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.textContent.indexOf(text) > -1) {
      console.log("download",link)
      link.click();
      await sleep(4000);
    }
  }
  return;
};

(function () {
  'use strict';
  var epub = document.getElementById('div_epub');

  var button1 = document.createElement("button");
  button1.textContent = "VIP下載";
  button1.style.width = "80px";
  button1.onclick = function() {
    safari_onclick("VIP下載");
  };
  epub.appendChild(button1);

  var button2 = document.createElement("button");
  button2.textContent = "VIP線路2";
  button2.style.width = "80px";
  button2.onclick = function() {
    safari_onclick("VIP線路2");
  };
  epub.appendChild(button2);
})();
