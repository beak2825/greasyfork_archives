// ==UserScript==
// @name         谷歌翻译位置交换
// @namespace    http://tampermonkey.net/
// @version      2024-02-02
// @description 谷歌翻译位置交换，方便把窗口放到侧面时，使用语音翻译时，翻译的内容在前面，方便观看。
// @author       gnix_oag
// @match        https://translate.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486351/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E4%BD%8D%E7%BD%AE%E4%BA%A4%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/486351/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E4%BD%8D%E7%BD%AE%E4%BA%A4%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
  // Get the two divs to be swapped.
  var div1 = document.evaluate("//*[@id='yDmH0d']/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[1]/c-wiz/div[1]/c-wiz/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var div2 = document.evaluate("//*[@id='yDmH0d']/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[1]/c-wiz/div[1]/c-wiz/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  // Swap the positions of the two divs.
  var parent = div1.parentNode;
  parent.insertBefore(div2, div1);

  // Get the two divs to be swapped.
  var div3 = document.evaluate("//*[@id='yDmH0d']/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var div4 = document.evaluate("//*[@id='yDmH0d']/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  // Swap the positions of the two divs.
  var parent1 = div3.parentNode;
  parent1.insertBefore(div4, div3);
})();