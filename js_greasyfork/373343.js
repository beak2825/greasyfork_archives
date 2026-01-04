// ==UserScript==
// @namespace   KiohPun
// @name  移除Pocket外链重定向
// @description 点击Pocket列表项的查看原始文档链接时，直接访问网址而不经由Pocket网站的重定向
// @version     1.2
// @match       https://app.getpocket.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373343/%E7%A7%BB%E9%99%A4Pocket%E5%A4%96%E9%93%BE%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373343/%E7%A7%BB%E9%99%A4Pocket%E5%A4%96%E9%93%BE%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

const deRedirect = ({ addedNodes: [node] }) => {
  	if (node.nodeName === 'ARTICLE') {
    		const link = node.querySelector('cite > a');
      	link.href = new URLSearchParams(new URL(link.href).search).get('url');

    }
};

const observer = new MutationObserver((records) => {
  	records.forEach(deRedirect);
});

observer.observe(document.getElementById('root'), {
    childList: true,
  	subtree: true,
});
