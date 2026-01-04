// ==UserScript==
// @name         解决百度百科禁止右键
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决百度百科禁止右键的问题
// @author       You
// @match        https://baike.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/513026/%E8%A7%A3%E5%86%B3%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%A6%81%E6%AD%A2%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/513026/%E8%A7%A3%E5%86%B3%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%A6%81%E6%AD%A2%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==

(function () {

  const key = encodeURIComponent('Cat73:网页限制解除:执行判断');
  if (window[key]) {
    return;
  };
  window[key] = true;

  const script = document.createElement('script');
  script.setAttribute('src', 'https://greasyfork.org/scripts/14146-%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4/code/%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js');
  document.body.append(script);
})();