// ==UserScript==
// @name         ProcessOn-Vip-SVG-水印-PDF
// @namespace    http://tampermonkey.net/
// @license      WTFPL
// @author       dongye
// @description  ProcessOn文件导出支持，支持全部Vip功能，包括自定义水印，高清PDF等，有查看权限即可导出，在文件查看页面点击导出，列表页中导出暂不完全支持
// @version      2025.01.01
// @include      *://www.processon.com/mindmap/*
// @include      *://www.processon.com/diagraming/*
// @include      *://www.processon.com/outline/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522879/ProcessOn-Vip-SVG-%E6%B0%B4%E5%8D%B0-PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/522879/ProcessOn-Vip-SVG-%E6%B0%B4%E5%8D%B0-PDF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const intervalPoEditorInsertId = setInterval(function () {
    if (window.PoEditorInsert) {

      clearInterval(intervalPoEditorInsertId);

      window.PoEditorInsert.isMemberPayType = [];
      window.PoEditorInsert.isMember = true;
      window.PoEditorInsert.isMemberOrNo = () => { return Promise.resolve(true);};
    }
  }, 100);
})();