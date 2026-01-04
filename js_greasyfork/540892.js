// ==UserScript==
// @name        69shuba Ad Filtering
// @namespace   Violentmonkey Scripts
// @match       https://www.69shuba.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 2025/6/26 15:24:19
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/540892/69shuba%20Ad%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/540892/69shuba%20Ad%20Filtering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tmp = document.getElementById('txtright');
    if(tmp){
      tmp.style.display = 'none';
    }

    tmp = document.getElementById('tuijian');
    if(tmp){
      tmp.style.display = 'none';
    }

    tmp = document.getElementsByClassName('yueduad1');
    if (tmp && tmp.length > 0) { // 检查是否存在匹配的元素
      Array.from(tmp).forEach(iframe => {
        iframe.style.display = 'none';
      });
    }

    document.querySelectorAll('[title="afj"]').forEach(el => {
      el.style.display = 'none';
    });

    document.querySelectorAll('[title="bjd"]').forEach(el => {
      el.style.display = 'none';
    });

    document.querySelectorAll('[title="edc"]').forEach(el => {
      el.style.display = 'none';
    });

    document.querySelectorAll('iframe').forEach(iframe => {
      const title = iframe.title.trim();
      if (/^[A-Za-z]{3}$/.test(title)) {
        iframe.style.display = 'none';
      }
    });

    tmp = document.getElementsByClassName('bottom-ad');
    if (tmp && tmp.length > 0) { // 检查是否存在匹配的元素
      Array.from(tmp).forEach(iframe => {
        iframe.style.display = 'none';
      });
    }

    // 监听DOM变化，检测新添加的iframe
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'IFRAME' && /^[A-Za-z]{3}$/.test(node.title.trim())) {
            node.style.display = 'none';
            console.log("监听移除成功 title:{}", node.title)
          }
        });
      });

      let tmp2 = document.getElementsByClassName('yuedutuijian');
      if (tmp2 && tmp2.length > 0) { // 检查是否存在匹配的元素
        Array.from(tmp2).forEach(iframe => {
          iframe.style.display = 'none';
        });
      }
      
      tmp2 = document.getElementsByClassName('contentadv');
      if (tmp2 && tmp2.length > 0) { // 检查是否存在匹配的元素
        Array.from(tmp2).forEach(iframe => {
          iframe.style.display = 'none';
        });
      }

      tmp2 = document.getElementsByClassName('bg-dsp-text-center');
      if (tmp2 && tmp2.length > 0) { // 检查是否存在匹配的元素
        Array.from(tmp2).forEach(iframe => {
          iframe.style.display = 'none';
        });
      }
    });

    // 开始监听
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

})();