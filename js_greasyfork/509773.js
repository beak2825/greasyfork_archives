// ==UserScript==
// @name         复制当前页面链接
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  添加一个菜单项来复制当前页面链接
// @author       momo
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://item.taobao.com/item.htm?*
// @match        https://detail.tmall.com/item.htm?*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/509773/%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/509773/%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand('复制当前页面链接', () => {
    GM_setClipboard((() => {
      switch (location.host) {
        case 'www.bilibili.com': {
          const avOrBV = location.pathname.split('/')[2];
          return `b23.tv/${avOrBV}`;
        }
        case 'item.taobao.com':
        case 'detail.tmall.com': {
          const search = new URLSearchParams(location.search);
          const params = new URLSearchParams({id: search.get('id')});
          const skuId = search.get('skuId');
          if(skuId) params.set('skuId', skuId);
          return `${location.host}/item.htm?${params}`;
        }
      }
    })());
  });
})();