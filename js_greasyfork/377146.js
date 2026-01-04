// ==UserScript==
// @name waifu2x.me cleaner
// @namespace Violentmonkey Scripts
// @match https://waifu2x.me/
// @description waifu2x.me unwanted element cleaner.
// @grant none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/377146/waifu2xme%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/377146/waifu2xme%20cleaner.meta.js
// ==/UserScript==

(function () {
  // 余計な要素を削除
  var selectors = [
    "iframe",
    "div.ads",
//    "div.row[style*=margin-top]",
    "div.navbar-fixed",
    "div.header",
    "div.about",
    "div.help",
    "fieldset:nth-of-type(4)"
  ];
  document.querySelectorAll(selectors).forEach(function(el){el.remove();});
  document.querySelectorAll("div.row")[1].remove();
  
  // 拡大欄の縦幅を圧縮
  var enlarge = document.querySelector("fieldset:nth-of-type(3)");
  var scale = document.getElementById("scale");
  enlarge.querySelector("legend").innerHTML += "倍率：<span id='scale-ratio'></span>";
  enlarge.appendChild(scale);
  document.querySelector("p.range-field").remove();
  
  // 拡大幅を0.1から2に変更
  scale.step = 2;
})();
