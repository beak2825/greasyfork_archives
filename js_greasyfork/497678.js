// ==UserScript==
// @name        it之家评论区显示图片
// @namespace   https://github.com/daimiaopeng
// @version     1.2
// @description it之家评论区自动显示图片，无需跳转到手机版
// @author      daimiaopeng
// @match       https://*.ithome.com/*
// @icon        https://img.ithome.com/img/soft/ithome.svg
// @downloadURL https://update.greasyfork.org/scripts/497678/it%E4%B9%8B%E5%AE%B6%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/497678/it%E4%B9%8B%E5%AE%B6%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听DOM节点的变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 处理新添加的节点
                handleNewNodes(mutation.addedNodes);
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察页面的根节点
    observer.observe(document.body, config);

    function handleNewNodes(nodes) {
        nodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('.post-img-list')) {
                    decodeAndDisplayImage(node);
                }
                // 递归处理子节点
                node.querySelectorAll('.post-img-list').forEach((childNode) => {
                    decodeAndDisplayImage(childNode);
                });
            }
        });
    }

    function decodeAndDisplayImage(node) {
        const spans = node.querySelectorAll('span.img-placeholder');
        if (spans) {
          spans.forEach((span) => {
              const dataS = span.getAttribute('data-s');
              if (dataS) {
                  const decodedUrl = atob(dataS);
                  const img = document.createElement('img');
                  img.src = decodedUrl;
                  img.style.width = "100%";
                  span.innerHTML = ''; // 清空span内容
                  span.appendChild(img); // 添加img元素
              }
           });
        }
    }

    // 初始化时处理已有的节点
    document.querySelectorAll('.post-img-list').forEach((node) => {
        decodeAndDisplayImage(node);
    });

})();