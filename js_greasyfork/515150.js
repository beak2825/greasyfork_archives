// ==UserScript==
// @name         自动跳过QQ、微信地址拦截
// @namespace    http://tampermonkey.net/
// @version      v1.0.1
// @description  自动跳过QQ、微信腾讯网址安全中心地址拦截
// @author       5cm/s
// @license      MIT
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi**
// @match        https://c.pc.qq.com/middlem.html**
// @match        https://docs.qq.com/scenario/link.html**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @downloadURL https://update.greasyfork.org/scripts/515150/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E3%80%81%E5%BE%AE%E4%BF%A1%E5%9C%B0%E5%9D%80%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/515150/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E3%80%81%E5%BE%AE%E4%BF%A1%E5%9C%B0%E5%9D%80%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  let url
  if (document.location.host === 'weixin110.qq.com') {
    url = Array.from(document.querySelectorAll('p')).find(el => el.textContent?.match(/^https?:\/\//))?.textContent
  } else {
    const p = new URLSearchParams(location.search)
    url = p.entries().find(it => it[0].toLowerCase().includes('url'))?.[1]
  }
  if (url) window.location.replace(url)
})();