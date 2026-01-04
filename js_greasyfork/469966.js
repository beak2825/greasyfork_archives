// ==UserScript==
// @name         轻学堂全部显示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  使轻学堂课程名称全部显示
// @author       明金同学
// @match        https://www.qingxuetang.com/*
// @icon         data:image/x-icon;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469966/%E8%BD%BB%E5%AD%A6%E5%A0%82%E5%85%A8%E9%83%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469966/%E8%BD%BB%E5%AD%A6%E5%A0%82%E5%85%A8%E9%83%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建一个新的样式元素
  let style = document.createElement('style');

  // 更新和添加新的样式规则，假设这些属性可能已经被定义过了
  style.innerHTML = `
      /* 更新【企业课程】样式，假设这些属性可能已经在其他地方被定义过 */
      .content>table tbody tr td:nth-child(2) a.lesson-info .tips {
          max-width: initial !important; /* 根据需要调整 */
      }
      .course-title .info .title {
          white-space: normal !important; /* 根据需要调整 */
      }
      .content table td, .content table td p.tips {
          white-space: normal !important; /* 根据需要调整 */
      }

      /* 针对【添加员工页面】已存在属性的额外样式修改 */
      .add-employee-modal.layui-layer-page .layui-layer-content {
          max-height: 800px !important; /* 新指定或更新的 */
          padding: 24px 32px 250px 24px !important; /* 新指定或更新的 */
      }
      .add_employee_form .select-dept.has-search .dropdown-panel {
          max-height: 600px !important; /* 新指定或更新的 */
          height: 600px !important; /* 新指定或更新的 */
      }
      .add_employee_form .select-dept.has-search .dropdown-panel .tree-warp {
          max-height: 600px !important; /* 新指定或更新的 */
      }
    `;

    // 将样式元素添加到<head>中
    document.head.appendChild(style);
})();
