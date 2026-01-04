// ==UserScript==
// @name         小专栏目录优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化小专栏目录显示
// @author       You
// @match        https://xiaozhuanlan.com/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaozhuanlan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443643/%E5%B0%8F%E4%B8%93%E6%A0%8F%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443643/%E5%B0%8F%E4%B8%93%E6%A0%8F%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addStyle (styleText) {
        const styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        document.head.appendChild(styleNode);
        return styleNode;
    }
    addStyle(`
      .toc {
        position: fixed;
        top: 80px;
        left: calc(50% - 680px);
      }
      .toc ul{
        padding-left: 24px;
      }
      .toc>ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .toc li {
        line-height: 24px!important;
      }
      .toc a {
        font-size: 14px!important;
        line-height: 24px!important;
      }
    `)
})();