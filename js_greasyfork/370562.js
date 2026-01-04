// ==UserScript==
// @name        baidu no jump
// @namespace   1018148046
// @description 去除百度搜索跳转链接
// @include     http://www.baidu.com/*
// @include     https://www.baidu.com/*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370562/baidu%20no%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/370562/baidu%20no%20jump.meta.js
// ==/UserScript==
//http://bbs.kafan.cn/forum.php?mod=viewthread&tid=1865907&page=12#pid38794320
(D => {
  let addcss = () => D.head.appendChild(D.createElement('style')).innerHTML = `.t a[href*="http://www.baidu.com/link?url="]{animation:baidu 1ms}@keyframes baidu{from{opacity:.9;}to{opacity:1}}`;
  D.addEventListener('DOMContentLoaded', () => new MutationObserver(() => addcss()).observe(D.body, {childList: true}), false);
  D.addEventListener('animationstart', e => {
    if (e.animationName !== 'baidu') return;
    let ele = e.target, curhref = ele.href;
    GM_xmlhttpRequest({url: curhref, method: "HEAD", onload: e => ele.href = e.finalUrl});
  }, false)
})(document);