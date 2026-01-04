// ==UserScript==
// @name 清水河畔校园网 VPN 补丁
// @namespace bbs.uestc.edu.cn
// @license MIT
// @author ____
// @version 0.5.0
// @description 网页版 VPN 浏览河畔时，将非学校网站的外链恢复为正常链接，不通过 VPN 代理访问。
// @match *://bbs-uestc-edu-cn-s.vpn.uestc.edu.cn/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452469/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E6%A0%A1%E5%9B%AD%E7%BD%91%20VPN%20%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/452469/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E6%A0%A1%E5%9B%AD%E7%BD%91%20VPN%20%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

function patch(unsafeWindow) {
  const NativeAHref = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');

  document.addEventListener('DOMContentLoaded', _ => {
    setTimeout(_ => {
      [].forEach.call(document.querySelectorAll('a'), a => {
        if (a.href.match(/^https?:\/\//i) && !a.href.match(/^https?:\/\/([^/]*?\.|)uestc\.edu\.cn(:[0-9]+)?\//i)) {
          NativeAHref.set.call(a, a.href);
        }
      });
    }, 1);
  });
}

patch(window.unsafeWindow || window);