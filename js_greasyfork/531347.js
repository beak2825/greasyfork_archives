// ==UserScript==
// @name        妖火去除帖子列表滑动底部加载重复帖子
// @namespace   yaohuo.me
// @match       https://yaohuo.me/*
// @match       https://www.yaohuo.me/*
// @grant       none
// @version     1.2
// @noframes    off
// @run-at      document-end
// @author      老六 (https://yaohuo.me/bbs/userinfo.aspx?touserid=25038)
// @description 2025/3/30 17:27:21
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531347/%E5%A6%96%E7%81%AB%E5%8E%BB%E9%99%A4%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%BB%91%E5%8A%A8%E5%BA%95%E9%83%A8%E5%8A%A0%E8%BD%BD%E9%87%8D%E5%A4%8D%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/531347/%E5%A6%96%E7%81%AB%E5%8E%BB%E9%99%A4%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E6%BB%91%E5%8A%A8%E5%BA%95%E9%83%A8%E5%8A%A0%E8%BD%BD%E9%87%8D%E5%A4%8D%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(() => {
  'use strict';
  console.log("start filter...")
  const existingIds = new Set();
  const getPostId = (item) => item.querySelector('a.topic-link')?.getAttribute('href')?.match(/bbs-(\d+)\.html/)?.[1];


    document.querySelectorAll('body > .listdata').forEach(item => {
      const id = getPostId(item);
      if (id) existingIds.add(id);
    });

    const original_KL_CallBack = window.KL_CallBack;
    if (typeof original_KL_CallBack !== 'function') return;

    window.KL_CallBack = () => {
      original_KL_CallBack();

      if (window.xmlhttp?.readyState === 4 && window.xmlhttp?.status === 200) {
        const responseText = window.xmlhttp.responseText;
        const startIndex = responseText.indexOf("<!--listS-->");
        const endIndex = responseText.indexOf("<!--listE-->");

        if (startIndex !== -1 && endIndex > startIndex) {
          const newDoc = new DOMParser().parseFromString(`<div>${responseText.substring(startIndex + 12, endIndex)}</div>`, 'text/html');

          newDoc.querySelectorAll('.listdata').forEach(newItem => {
            const id = getPostId(newItem);
            if (id) {
              if (existingIds.has(id)) {
                document.querySelector(`a.topic-link[href*="bbs-${id}.html"]`)?.closest('div.listdata')?.remove();
              } else {
                existingIds.add(id);
              }
            }
          });
        }
      }
    };

})();