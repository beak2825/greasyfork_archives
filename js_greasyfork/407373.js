// ==UserScript==
// @name        简历样式纠正 - wondercv.com
// @namespace   Violentmonkey Scripts
// @match       https://www.wondercv.com/cvs/*/editor
// @grant       none
// @version     1.0
// @author      -
// @description 此脚本用于解决简历实际排版效果和网页端预览效果不一致的问题，使用 Ctrl+P 快捷键或使用打印功能可下载纠正后的简历。
// @downloadURL https://update.greasyfork.org/scripts/407373/%E7%AE%80%E5%8E%86%E6%A0%B7%E5%BC%8F%E7%BA%A0%E6%AD%A3%20-%20wondercvcom.user.js
// @updateURL https://update.greasyfork.org/scripts/407373/%E7%AE%80%E5%8E%86%E6%A0%B7%E5%BC%8F%E7%BA%A0%E6%AD%A3%20-%20wondercvcom.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = 'text/css';
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

addCss(`
@media print {
.pc-nav,
#udesk_container,
.edit-cv-main > .info,
.edit-cv-main > .edit,
.editor-sidebar-main,
.cvs-button-content,
.cv-nps.close,
.padding-10.main::after,
.resume-main .main .cover {
  display: none !important;
}

body, html {
  background: #fff;
}

.cv-editor-main {
  min-width: 320px !important;
}

.edit-cv-main {
  width: initial !important;
  height: initial !important;
  padding: 0 !important;
  display: block !important;
  min-width: 320px !important;
  max-width: 700px !important;
  margin: 0 auto !important;
}

.edit-cv-main a {
  color: #0052af;
}

.cv-editor-main .edit-cv-main .cvs,
.cv-editor-main .edit-cv-main .cvs .cvs-component {
  width: initial !important;
  padding: 0 !important;
  max-width: initial !important;
  max-height: initial !important;
}

.cv-editor-main .edit-cv-main .cvs .cvs-component > div {
  width: initial !important;
  height: initial !important;
}

.resume-main.a4 .main {
  padding: 0 !important;
  height: initial !important;
}

.resume-main .scale.visible {
  transform: none !important;
  width: initial !important;
}

.cv-editor-main .edit-cv-main .cvs .resume .cvs-hover.cvs-hover.cvs-hover {
  height: initial !important;
  transition: none !important;
  transform: none !important;
}

.cv-editor-main .edit-cv-main .cvs .resume.a4 {
  width: initial !important;
  height: initial !important;
}
}
`)
