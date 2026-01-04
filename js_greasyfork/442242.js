// ==UserScript==
// @name         YApi优化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  哈哈
// @author       You
// @match        yapi.zhufalaw.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhufalaw.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442242/YApi%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/442242/YApi%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const styleArr = [
        {
          selector: '.ant-layout-sider', //左侧菜单
          style: {
            position: 'sticky',
            top: 0,
          },
        },
        {
          selector: '.interface-content .ant-tabs', //内容区顶部tab
          style: {
            position: 'sticky',
            top: 0,
            'z-index': 1,
            background: '#fff',
          },
        },
        {
          selector: '.interface-title',
          style: {
            position: 'sticky',
            top: 0,
          },
        },
        {
          selector: '.ant-layout.ant-layout-has-sider>.ant-layout',
          style: {
            overflow: 'unset',
          },
        },
        {
          selector: '.caseContainer',
          style: {
            overflow: 'unset',
          },
        },
        {
          selector: '.left-menu',
          style: {
            overflow: 'hidden',
          },
        },
        {
          selector: '.tree-wrappper',
          style: {
            height: 'calc(100vh - 56.5px)',
            'max-height': 'unset',
          },
        },
      ];
      const fn = () => {
        styleArr.forEach(item => {
          const dom = document.querySelector(item.selector);
          console.log('🚀 ~ dom', dom);
          if (dom) {
            for (const prop in item.style) {
              dom.style[prop] = item.style[prop];
            }
          }
        });
      };
      window.onload = function () {
        fn();
        setTimeout(() => {
          fn();
        }, 800);
      };
    // Your code here...
})();