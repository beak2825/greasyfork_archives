// ==UserScript==
// @name         github禁翻译代码和文件名
// @namespace    http://5jianzhan.com
// @author       itldg
// @version      1.5.2
// @description  禁止一切翻译插件脚本处理文件名和代码，在F辣条要甜点的基础上修改
// @author       MewoChen
// @include      *://github.com*
// @match        *://github.com*
// @match        *://www.npmjs.com*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/523454/github%E7%A6%81%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/523454/github%E7%A6%81%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    //----------------------------------------------------------------------------------------------------------------------------------------------------
    const markNoTranslate = function () {

      // 代码  议题  拉取请求  操作
        const lists = document.querySelectorAll('ul.list-style-none');
        lists.forEach(function (ul) {
            const items = ul.querySelectorAll('li.d-inline');
            items.forEach(function (li) {
                li.classList.add('notranslate');
            });
        });

      // 文件名
        const elements = document.querySelectorAll('.react-directory-filename-cell');
        elements.forEach(function (element) {
            element.classList.add('notranslate');
        });

    //----------------------------------------------------------------------------------------------------------------------------------------------------
      //
        const elements17 = document.querySelectorAll('.files');
        elements17.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // 标签
        const elements2 = document.querySelectorAll('.topic-tag.topic-tag-link');
        elements2.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // 语言使用情况
        const elements3 = document.querySelectorAll('.color-fg-default.text-bold.mr-1');
        elements3.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // 顶部项目名
        const elements4 = document.querySelectorAll('.AppHeader-context-item-label  ');
        elements4.forEach(function (element) {
            element.classList.add('notranslate');
        });

      // ❌
        const elements6 = document.querySelectorAll('.my-3.d-flex.flex-items-center');
        elements6.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // 右栏仓库大小
        const elements7 = document.querySelectorAll('.Link.Link--muted');
        // const elements7 = document.querySelectorAll('.Link.Link--muted span');
        elements7.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // ❌
        const elements8 = document.querySelectorAll('.Box-row.d-flex.flex-column.flex-md-row');
        elements8.forEach(function (element) {
            element.classList.add('notranslate');
        });
      // 代码  议题  拉取请求  操作
        const elements9 = document.querySelectorAll('.ActionListItem');
        elements9.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
      // 顶部星数
        const elements14 = document.querySelectorAll('.d-flex.flex-items-center.flex-justify-center.mr-1.gap-1.color-fg-muted');
        elements14.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements18 = document.querySelectorAll('#StickyHeader #file-name-id-wide code');
        elements18.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements19 = document.querySelectorAll('#StickyHeader a[data-testid="breadcrumbs-repo-link"]');
        elements19.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements20 = document.querySelectorAll('#repos-file-tree ul[class*="prc-TreeView-TreeView"] .PRIVATE_TreeView-item-content-text span');
        elements20.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements21 = document.querySelectorAll('div[data-testid="results-list"] >div >div >div:nth-of-type(1) >div:has(a[href*="/topics"]) >div a');
        elements21.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements23 = document.querySelectorAll('div[data-testid="results-list"] >div >div >div:nth-of-type(1) >h3 >div >div:nth-of-type(2) a');
        elements23.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        const elements24 = document.querySelectorAll('div[data-testid="results-list"] >div >div >div:nth-of-type(1) >ul >li:nth-of-type(1) >span');
        elements24.forEach(function (element) {
            element.classList.add('notranslate');
        });
      //
        /*const elements25 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements25.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
      //
        /*const elements26 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements26.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
      //
        /*const elements27 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements27.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
      //
        /*const elements28 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements28.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
      //
        /*const elements29 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements29.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
      //
        /*const elements30 = document.querySelectorAll('.react-directory-truncate .Link--primary');
        elements30.forEach(function (element) {
            element.classList.add('notranslate');
        });*/
    };


    // 还可以在页面加载时立即标记已经存在的元素
 //   setTimeout(function() {
  //       markNoTranslate();
 //   },1000);

  // 创建MutationObserver，监控新插入的视频卡片
      new MutationObserver(() => {
    // 业务代码执行
    // setTimeout(processDateElements, 1000); // 延迟1秒processDateElements();
          markNoTranslate();
      }).observe(document, {
          childList: true,
          subtree: true,
      });

})()