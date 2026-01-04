// ==UserScript==
// @name           Automagic网址自动替换
// @namespace      http://tampermonkey.net/
// @version        1.5
// @description    自动将网址中的“automagic4android.com”字段替换为“46.231.200.187”
// @author         Jeff_CF
// @icon           https://46.231.200.187/images/AutomagicAdaptiveIcon_25.png
// @match          *://46.231.200.187/*
// @match          *://automagic4android.com/*
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/501529/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/501529/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
      'use  strict';

      //  替换网址中的域名
      function replaceUrl(url) {
          return url.replace('automagic4android.com', '46.231.200.187');
      }

      //  替换页面内容中的所有网址
      function replaceUrls() {
          //  获取页面中的所有链接
          const links = document.querySelectorAll('a[href*="automagic4android.com"]');
          links.forEach(link => {
              link.href = replaceUrl(link.href);
          });
      }

      //  执行替换页面内容中所有网址的函数
      replaceUrls();

      //  使用MutationObserver动态监控页面变化并替换新内容中的网址
      const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
              if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                  mutation.addedNodes.forEach(node => {
                      if (node.nodeType === Node.ELEMENT_NODE && node.matches('a[href*="automagic4android.com"]')) {
                          node.href = replaceUrl(node.href);
                      }
                  });
              }
          });
      });
      observer.observe(document.body, { childList: true, subtree: true });
})();