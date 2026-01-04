// ==UserScript==
// @name        Xueqiu Xmp Helper
// @namespace   https://github.com/Distringer/monkeyjs/blob/main/xueqiu_xmp_halper.js
// @description 将雪球上的 xmp url 转化为可操作组件
// @author      yangzhenze
// @version     20220704.1.2
// @match       http://xueqiu.com/*
// @match       https://xueqiu.com/*
// @license     MIT License
// @require     https://cdn.jsdelivr.net/npm/domo@0.5.9/lib/domo.js
// @downloadURL https://update.greasyfork.org/scripts/447421/Xueqiu%20Xmp%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447421/Xueqiu%20Xmp%20Helper.meta.js
// ==/UserScript==

var allAElement = document.getElementsByTagName("a");
for (var i = 0; i < allAElement.length; i++) {
  var aElement = allAElement[i];
  if (aElement.href.includes("xmp") || aElement.href.includes("vmp")) {
    var iframe = IFRAME({ src: aElement.href, width: "100%", height: "500" });
    aElement.parentNode.insertBefore(iframe, aElement.nextSibling);
    var br = BR();
    aElement.parentNode.insertBefore(br, iframe);
  }
}
