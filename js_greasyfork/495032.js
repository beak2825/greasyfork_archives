// ==UserScript==
// @name 优化系统显示效果
// @namespace akso
// @version 0.10
// @description Akso style
// @author 李海林
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://pro.form-create.com/view*
// @include /^(?:.*web.*)$/
// @include /^(?:.*admin.*)$/
// @include /^(?:.*relation.*)$/
// @downloadURL https://update.greasyfork.org/scripts/495032/%E4%BC%98%E5%8C%96%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/495032/%E4%BC%98%E5%8C%96%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:.*web.*)\$").test(location.href)) {
  css += `
      .menu-container {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 5px;
          background-color: #333;
          overflow: hidden;
          transition: width 0.3s ease;
          z-index: 1000;
          border-right: 5px solid #ddf1ff;
      }

      .menu-container:hover {
          width: 250px;
      }

      .menu-container:hover .content {
          margin-left: 250px;
      }

      .menu {
          list-style: none;
          padding: 20px 0;
          margin: 0;
          width: 250px;
      }

      .menu > li {
          position: relative;
          padding: 10px 20px;
          color: white;
          white-space: nowrap;
          cursor: pointer;
          transition: background-color 0.5s;
          border-bottom: 2px solid #5fce9d0a;
      }

      .menu > li:hover {
          background-color: #555;
      }

      .menu > li > a {
          color: white;
          text-decoration: none;
          display: block;
      }

      .submenu {
          list-style: none;
          padding: 0;
          margin: 0;
          background-color: #444;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease;
      }

      .menu > li:hover > .submenu {
          max-height: 3500px;
      }

      .submenu li {
          padding: 8px 20px 8px 30px;
          color: #ddd;
          transition: background-color 0.5s;
          border-bottom: 2px solid #5fce9d0a;
      }

      .submenu li:hover {
          background-color: #666;
      }

      .submenu li a {
          color: #ddd;
          text-decoration: none;
          display: block;
      }

      .has-submenu::after {
          content: ">";
          position: absolute;
          right: 15px;
          transform: rotate(90deg);
          transition: transform 0.5s;
          top: 5px;
      }

      .menu > li:hover::after {
          transform: rotate(0deg);
      }

      .content {
          margin-left: 5px;
          padding: 20px;
          transition: margin-left 0.5s ease;
      }
  `;
}
if (new RegExp("^(?:.*admin.*)\$").test(location.href)) {
  css += `
      body {
          font-family: system-ui;
      }
  `;
}
if (new RegExp("^(?:.*relation.*)\$").test(location.href)) {
  css += `
      .ant-table-tbody > tr > td {
          width: 10% !important;
          overflow-wrap: normal;
      }

      .ant-table-thead > tr > th:nth-child(2) {
          width: 500px !important;
      }
  `;
}
if (location.href.startsWith("https://pro.form-create.com/view")) {
  css += `
  ._fd-preview-dialog {
      --el-dialog-width: 100% !important;
  }
  .el-dialog {
      --el-dialog-margin-top: 0vh !important;
      margin: var(--el-dialog-margin-top, 0vh) auto 0px;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
