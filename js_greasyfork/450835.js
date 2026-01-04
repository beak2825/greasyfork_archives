// ==UserScript==
// @name         百度去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       02的狗
// @match        *://*.baidu.com/*
// @match        *://*.zhihu.com/*
// @icon         https://img2.baidu.com/it/u=3969377962,2359772706&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1662656400&t=4127b5412921f05aff87a8eb927c7f70
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450835/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450835/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

/**
 * 写在前面：通过`@run-at`初始化嵌入css样式来实现功能，提升页面浏览平滑度(好像也就是比起其他的徐晃一下看起来好一点点...)
 *          不考录兼容，反正只有我在用^_^
 *
 * 1.百度列表去广告
 * 2.知乎列表去广告和视频话题：
 *    列表视频需Experimental Web Platform features 以支持css`has`选择器体验 ==> chrome://flags
 */

 (function () {
  'use strict';
  /**datas */
  const datas = {
    /**css样式嵌入 */
    cssInsert: [
      {
        funcName: 'cssInsert',
        name: 'baidu',
        match: /^https?:\/\/[a-z]+\.baidu\.com/,
        /**
         * #content_left > :not(.xpath-log, .hit-toptip) 列表页广告
         * #content_right 右侧热点
         */
        css: `
          #content_left > :not(.xpath-log, .hit-toptip),
          #content_right {
            display: none;
          }
        `
      },
      {
        funcName: 'cssInsert',
        name: 'zhihu',
        match: /^https?:\/\/[a-z]+\.zhihu\.com/,
        /**
         * .Topstory-recommend .TopstoryItem--advertCard 列表广告
         * .Sticky .GlobalSideBar-category, .css-173vipd 右侧个人信息部分功能
         * .Pc-card 右侧广告
         * .TopstoryItem:has(iframe) 视频类型话题
         */
        css: `
          .Topstory-recommend .TopstoryItem--advertCard,
          .Sticky .GlobalSideBar-category,
          .css-173vipd,
          .Pc-card,
          .TopstoryItem:has(iframe) {
            display: none;
          }
        `
      },
    ],
    /**页面优化 */
    optimization: [

    ]
  }

  /**
   * DOM操作
   */
  class OperateDOM {
    /**
     * @param {string} setStyle
     * @return { 页面插入css样式 }
     */
    CSSinsert(setStyle) {
      const domStyle = document.createElement('style')
      domStyle.appendChild(document.createTextNode(setStyle));
      document.querySelector('html').appendChild(domStyle);
    }
  }

  const { cssInsert, optimization } = datas;
  const operateDOM = new OperateDOM()
  /**功能判断 */
  const dataAll = [...cssInsert, ...optimization]
  dataAll.forEach(item => {
    if (location.href.match(item.match)) {
      switch (item.funcName) {
        case 'cssInsert':
          operateDOM.CSSinsert(item.css)
          break;

        default:
          break;
      }
    }
  })
})();

