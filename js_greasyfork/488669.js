// ==UserScript==
// @name         语雀美化
// @namespace    https://greasyfork.org/users/1268743-okoala
// @version      1.0.0
// @description  让语雀更加美观
// @author       仙森
// @icon         https://www.google.com/s2/favicons?domain=yuque.com
// @match        *://*.yuque.com/*
// @match        *://yuque.antfin.com/*
// @match        *://yuque.antfin-inc.com/*
// @grant        none
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488669/%E8%AF%AD%E9%9B%80%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488669/%E8%AF%AD%E9%9B%80%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const style = document.createElement('style');
  style.id = 'yuque-tampermonkey-beauty';
  style.type = 'text/css';

  const cssString = `
    body,
    html {
      letter-spacing: 0.02em;
      -webkit-font-smoothing: subpixel-antialiased;
    }
    #doc-reader-content #article-title,
    #comment-floor-mini,
    .ne-toc-view {
      font-weight: 400;
      line-height: 1.5;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      letter-spacing: 0.02em;
    }
    #doc-reader-content #article-title {
      font-size: 2.2em;
    }
    #sidePanel .ne-toc-normal-view .ne-toc-item .ne-toc-item-text:hover,
    #sidePanel .ne-toc-normal-view .ne-toc-item.ne-toc-selected {
      font-weight: 400;
    }
    #sidePanel .ne-toc-normal-view .ne-toc-item .ne-toc-item-text:hover a,
    #sidePanel .ne-toc-normal-view .ne-toc-item.ne-toc-selected a {
      color: var(--yq-yuque-grey-900);
    }
    #sidePanel .ne-toc-normal-view .ne-toc-content::after {
      width: 1px;
      background: var(--yq-yuque-grey-300);
    }
    #sidePanel .ne-toc-normal-view .ne-toc-pin,
    #sidePanel .ne-toc-view .ne-toc-pin .ne-toc-pin-text {
      color: var(--yq-yuque-grey-700);
      transition: all 0.5s ease;
    }
    #sidePanel .ne-toc-normal-view .ne-toc-item .ne-toc-fold-btn,
    #sidePanel .ne-toc-normal-view .ne-toc-item a {
      color: var(--yq-yuque-grey-600);
      transition: all 0.5s ease;
    }
    #sidePanel .ne-toc-normal-view .ne-toc-item.ne-toc-selected a {
      color: var(--yq-yuque-grey-900);
    }
    #sidePanel .ne-toc-normal-view:hover .ne-toc-pin,
    #sidePanel .ne-toc-normal-view:hover .ne-toc-pin .ne-toc-pin-text,
    #sidePanel .ne-toc-normal-view:hover .ne-toc-item.ne-toc-selected a {
      color: var(--yq-yuque-grey-900);
    }
    #sidePanel .ne-toc-normal-view:hover .ne-toc-item .ne-toc-fold-btn,
    #sidePanel .ne-toc-normal-view:hover .ne-toc-item a {
      color: var(--yq-yuque-grey-700);
    }
    div[class*='index-module_recentTable_'] .ant-table-tbody > tr > .ant-table-cell,
    div[class*='index-module_recentTable_'] .ant-table tfoot > tr > .ant-table-cell {
      padding: 8px 1px;
    }
    div[class*='index-module_recentTable_'] td[class*='index-module_columnsTime_'],
    div[class*='index-module_recentTable_'] div[class*='index-module_belongCol_'],
    div[class*='index-module_recentTable_'] a[class*='index-module_bookTitle_'],
    div[class*='index-module_recentTable_'] a[class*='index-module_groupTitle_'] {
      color: var(--yq-text-disable);
    }
    div[class*='ReaderLayout-module_asideHead_'] {
      border: none;
      padding: 0;
      flex-direction: column-reverse;
    }
    div[class*='ReaderLayout-module_asideHead_']:hover div[class*='ReaderLayout-module_crumb_'] {
      opacity: 1;
    }
    div[class*='ReaderLayout-module_bookName_'] {
      margin: 8px 0;
    }
    div[class*='ReaderLayout-module_crumb_'] {
      padding: 0 0 0 6px;
      height: 0;
      opacity: 0;
      transition: all 0.3s ease;
    }
    #lark-mini-editor .ne-paragraph-spacing-relax.ne-typography-classic,
    #lark-mini-editor .ne-viewer.ne-paragraph-spacing-relax.ne-typography-classic .ne-viewer-body,
    #lark-mini-editor .ne-viewer-body,
    #lark-mini-editor .ne-editor-body,
    .yuque-doc-content .ne-paragraph-spacing-relax.ne-typography-classic,
    .yuque-doc-content .ne-viewer.ne-paragraph-spacing-relax.ne-typography-classic .ne-viewer-body,
    .yuque-doc-content .ne-viewer-body,
    .yuque-doc-content .ne-editor-body,
    .ne-doc-major-editor .ne-paragraph-spacing-relax.ne-typography-classic,
    .ne-doc-major-editor .ne-viewer.ne-paragraph-spacing-relax.ne-typography-classic .ne-viewer-body,
    .ne-doc-major-editor .ne-viewer-body,
    .ne-doc-major-editor .ne-editor-body,
    .ne-doc-major-viewer .ne-paragraph-spacing-relax.ne-typography-classic,
    .ne-doc-major-viewer .ne-viewer.ne-paragraph-spacing-relax.ne-typography-classic .ne-viewer-body,
    .ne-doc-major-viewer .ne-viewer-body,
    .ne-doc-major-viewer .ne-editor-body {
      font-family: Source Sans Pro, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', Segoe UI Symbol, 'Noto Color Emoji';
      font-weight: 400;
      line-height: 1.5;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      letter-spacing: 0.02em;
    }
    #lark-mini-editor ne-alert-hole,
    #lark-mini-editor ne-container-hole,
    #lark-mini-editor ne-hole,
    #lark-mini-editor .ne-editor-body ne-p,
    #lark-mini-editor .ne-viewer-body ne-p,
    .yuque-doc-content ne-alert-hole,
    .yuque-doc-content ne-container-hole,
    .yuque-doc-content ne-hole,
    .yuque-doc-content .ne-editor-body ne-p,
    .yuque-doc-content .ne-viewer-body ne-p,
    .ne-doc-major-editor ne-alert-hole,
    .ne-doc-major-editor ne-container-hole,
    .ne-doc-major-editor ne-hole,
    .ne-doc-major-editor .ne-editor-body ne-p,
    .ne-doc-major-editor .ne-viewer-body ne-p,
    .ne-doc-major-viewer ne-alert-hole,
    .ne-doc-major-viewer ne-container-hole,
    .ne-doc-major-viewer ne-hole,
    .ne-doc-major-viewer .ne-editor-body ne-p,
    .ne-doc-major-viewer .ne-viewer-body ne-p {
      margin-top: 16px !important;
      margin-bottom: 16px !important;
    }
    #lark-mini-editor ne-h1,
    #lark-mini-editor ne-h2,
    #lark-mini-editor ne-h3,
    #lark-mini-editor ne-h4,
    #lark-mini-editor ne-h5,
    #lark-mini-editor ne-h6,
    .yuque-doc-content ne-h1,
    .yuque-doc-content ne-h2,
    .yuque-doc-content ne-h3,
    .yuque-doc-content ne-h4,
    .yuque-doc-content ne-h5,
    .yuque-doc-content ne-h6,
    .ne-doc-major-editor ne-h1,
    .ne-doc-major-editor ne-h2,
    .ne-doc-major-editor ne-h3,
    .ne-doc-major-editor ne-h4,
    .ne-doc-major-editor ne-h5,
    .ne-doc-major-editor ne-h6,
    .ne-doc-major-viewer ne-h1,
    .ne-doc-major-viewer ne-h2,
    .ne-doc-major-viewer ne-h3,
    .ne-doc-major-viewer ne-h4,
    .ne-doc-major-viewer ne-h5,
    .ne-doc-major-viewer ne-h6 {
      letter-spacing: 0.05em !important;
      margin-top: 24px !important;
      margin-bottom: 16px !important;
      line-height: 1.25 !important;
    }
    #lark-mini-editor ne-h1,
    .yuque-doc-content ne-h1,
    .ne-doc-major-editor ne-h1,
    .ne-doc-major-viewer ne-h1 {
      margin-top: 34px !important;
      padding-bottom: 0.3em !important;
      border-bottom: 1px solid var(--yq-yuque-grey-200);
      font-size: 2em !important;
    }
    #lark-mini-editor ne-h2,
    .yuque-doc-content ne-h2,
    .ne-doc-major-editor ne-h2,
    .ne-doc-major-viewer ne-h2 {
      margin-top: 34px !important;
      padding-bottom: 0.3em !important;
      border-bottom: 1px solid var(--yq-yuque-grey-200);
      font-size: 1.5em !important;
    }
    #lark-mini-editor ne-h3,
    .yuque-doc-content ne-h3,
    .ne-doc-major-editor ne-h3,
    .ne-doc-major-viewer ne-h3 {
      font-size: 1.25em !important;
    }
    #lark-mini-editor ne-h4,
    .yuque-doc-content ne-h4,
    .ne-doc-major-editor ne-h4,
    .ne-doc-major-viewer ne-h4 {
      font-size: 1em !important;
    }
    #lark-mini-editor ne-h5,
    .yuque-doc-content ne-h5,
    .ne-doc-major-editor ne-h5,
    .ne-doc-major-viewer ne-h5 {
      font-size: 0.875em !important;
    }
    #lark-mini-editor ne-h6,
    .yuque-doc-content ne-h6,
    .ne-doc-major-editor ne-h6,
    .ne-doc-major-viewer ne-h6 {
      font-size: 0.85em !important;
    }
    #lark-mini-editor ne-card[data-card-type='block'][data-card-name='hr'],
    .yuque-doc-content ne-card[data-card-type='block'][data-card-name='hr'],
    .ne-doc-major-editor ne-card[data-card-type='block'][data-card-name='hr'],
    .ne-doc-major-viewer ne-card[data-card-type='block'][data-card-name='hr'] {
      width: 30%;
      height: 1px;
      margin-top: 48px;
      margin-bottom: 47px;
      margin-inline-start: auto;
      margin-inline-end: auto;
      border: 0;
      box-sizing: content-box;
      overflow: visible;
      padding: 0 !important;
    }
    #lark-mini-editor .ne-viewer ne-card[data-card-name='hr'] .ne-hr,
    .yuque-doc-content .ne-viewer ne-card[data-card-name='hr'] .ne-hr,
    .ne-doc-major-editor .ne-viewer ne-card[data-card-name='hr'] .ne-hr,
    .ne-doc-major-viewer .ne-viewer ne-card[data-card-name='hr'] .ne-hr {
      height: 1px;
    }
    #lark-mini-editor ne-uli-i .ne-list-symbol > span,
    .yuque-doc-content ne-uli-i .ne-list-symbol > span,
    .ne-doc-major-editor ne-uli-i .ne-list-symbol > span,
    .ne-doc-major-viewer ne-uli-i .ne-list-symbol > span {
      transform: scale(0.4) !important;
    }
    #lark-mini-editor .ne-engine .ne-spacing-all,
    #lark-mini-editor .ne-viewer-body .ne-spacing-all,
    .yuque-doc-content .ne-engine .ne-spacing-all,
    .yuque-doc-content .ne-viewer-body .ne-spacing-all,
    .ne-doc-major-editor .ne-engine .ne-spacing-all,
    .ne-doc-major-editor .ne-viewer-body .ne-spacing-all,
    .ne-doc-major-viewer .ne-engine .ne-spacing-all,
    .ne-doc-major-viewer .ne-viewer-body .ne-spacing-all {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    #lark-mini-editor .ne-toc-view .ne-toc-pin,
    .yuque-doc-content .ne-toc-view .ne-toc-pin,
    .ne-doc-major-editor .ne-toc-view .ne-toc-pin,
    .ne-doc-major-viewer .ne-toc-view .ne-toc-pin {
      padding-left: 12px !important;
    }
    #lark-mini-editor .ne-toc-normal-view .ne-toc-depth-1,
    #lark-mini-editor .ne-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    #lark-mini-editor .ne-toc-small-view:hover .ne-toc-depth-1,
    #lark-mini-editor .ne-viewer-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .yuque-doc-content .ne-toc-normal-view .ne-toc-depth-1,
    .yuque-doc-content .ne-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .yuque-doc-content .ne-toc-small-view:hover .ne-toc-depth-1,
    .yuque-doc-content .ne-viewer-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .ne-doc-major-editor .ne-toc-normal-view .ne-toc-depth-1,
    .ne-doc-major-editor .ne-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .ne-doc-major-editor .ne-toc-small-view:hover .ne-toc-depth-1,
    .ne-doc-major-editor .ne-viewer-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .ne-doc-major-viewer .ne-toc-normal-view .ne-toc-depth-1,
    .ne-doc-major-viewer .ne-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1,
    .ne-doc-major-viewer .ne-toc-small-view:hover .ne-toc-depth-1,
    .ne-doc-major-viewer .ne-viewer-toc-sidebar-hover .ne-toc-view .ne-toc-depth-1 {
      padding-left: 10px !important;
    }
    #lark-mini-editor a.ne-link,
    #lark-mini-editor ne-link,
    .yuque-doc-content a.ne-link,
    .yuque-doc-content ne-link,
    .ne-doc-major-editor a.ne-link,
    .ne-doc-major-editor ne-link,
    .ne-doc-major-viewer a.ne-link,
    .ne-doc-major-viewer ne-link {
      text-decoration: underline !important;
      text-underline-offset: 0.2rem !important;
      color: var(--lakex-editor-text-link);
    }
    #lark-mini-editor ne-hole,
    .yuque-doc-content ne-hole,
    .ne-doc-major-editor ne-hole,
    .ne-doc-major-viewer ne-hole {
      margin-bottom: 16px !important;
    }
    #lark-mini-editor ne-card[data-card-name='codeblock'],
    .yuque-doc-content ne-card[data-card-name='codeblock'],
    .ne-doc-major-editor ne-card[data-card-name='codeblock'],
    .ne-doc-major-viewer ne-card[data-card-name='codeblock'] {
      border-color: transparent !important;
    }
    #lark-mini-editor .codeblock-menu,
    #lark-mini-editor .codeblock-menu,
    .yuque-doc-content .codeblock-menu,
    .yuque-doc-content .codeblock-menu,
    .ne-doc-major-editor .codeblock-menu,
    .ne-doc-major-editor .codeblock-menu,
    .ne-doc-major-viewer .codeblock-menu,
    .ne-doc-major-viewer .codeblock-menu {
      border-bottom-color: transparent !important;
    }
    #lark-mini-editor .ne-codeblock[theme='Github Light'] .CodeMirror-gutter-wrapper,
    #lark-mini-editor .ne-codeblock[theme='Github Light'] .CodeMirror-gutters,
    #lark-mini-editor .ne-codeblock[theme='Github Light'] .ne-codeblock,
    #lark-mini-editor .ne-codeblock[theme='Github Light'] .ne-codeblock-content,
    #lark-mini-editor .ne-codeblock[theme='Github Light'] .ne-codeblock-inner,
    #lark-mini-editor .ͼl.cm-editor,
    #lark-mini-editor .cm-gutters,
    .yuque-doc-content .ne-codeblock[theme='Github Light'] .CodeMirror-gutter-wrapper,
    .yuque-doc-content .ne-codeblock[theme='Github Light'] .CodeMirror-gutters,
    .yuque-doc-content .ne-codeblock[theme='Github Light'] .ne-codeblock,
    .yuque-doc-content .ne-codeblock[theme='Github Light'] .ne-codeblock-content,
    .yuque-doc-content .ne-codeblock[theme='Github Light'] .ne-codeblock-inner,
    .yuque-doc-content .ͼl.cm-editor,
    .yuque-doc-content .cm-gutters,
    .ne-doc-major-editor .ne-codeblock[theme='Github Light'] .CodeMirror-gutter-wrapper,
    .ne-doc-major-editor .ne-codeblock[theme='Github Light'] .CodeMirror-gutters,
    .ne-doc-major-editor .ne-codeblock[theme='Github Light'] .ne-codeblock,
    .ne-doc-major-editor .ne-codeblock[theme='Github Light'] .ne-codeblock-content,
    .ne-doc-major-editor .ne-codeblock[theme='Github Light'] .ne-codeblock-inner,
    .ne-doc-major-editor .ͼl.cm-editor,
    .ne-doc-major-editor .cm-gutters,
    .ne-doc-major-viewer .ne-codeblock[theme='Github Light'] .CodeMirror-gutter-wrapper,
    .ne-doc-major-viewer .ne-codeblock[theme='Github Light'] .CodeMirror-gutters,
    .ne-doc-major-viewer .ne-codeblock[theme='Github Light'] .ne-codeblock,
    .ne-doc-major-viewer .ne-codeblock[theme='Github Light'] .ne-codeblock-content,
    .ne-doc-major-viewer .ne-codeblock[theme='Github Light'] .ne-codeblock-inner,
    .ne-doc-major-viewer .ͼl.cm-editor,
    .ne-doc-major-viewer .cm-gutters {
      caret-color: transparent !important;
      color: var(--yq-yuque-grey-400) !important;
    }
    #lark-mini-editor .cm-lightLineGutter,
    .yuque-doc-content .cm-lightLineGutter,
    .ne-doc-major-editor .cm-lightLineGutter,
    .ne-doc-major-viewer .cm-lightLineGutter {
      background-color: transparent !important;
    }
    #lark-mini-editor .cm-foldGutter,
    .yuque-doc-content .cm-foldGutter,
    .ne-doc-major-editor .cm-foldGutter,
    .ne-doc-major-viewer .cm-foldGutter {
      visibility: hidden;
    }
    #lark-mini-editor .cm-gutters:hover .cm-foldGutter,
    .yuque-doc-content .cm-gutters:hover .cm-foldGutter,
    .ne-doc-major-editor .cm-gutters:hover .cm-foldGutter,
    .ne-doc-major-viewer .cm-gutters:hover .cm-foldGutter {
      visibility: visible;
    }
    #lark-mini-editor ne-alert ne-oli:first-child,
    #lark-mini-editor ne-alert ne-p:first-child,
    #lark-mini-editor ne-alert ne-p:first-child,
    #lark-mini-editor ne-alert ne-h1:first-child,
    #lark-mini-editor ne-alert ne-h1:first-child,
    #lark-mini-editor ne-alert ne-h2:first-child,
    #lark-mini-editor ne-alert ne-h2:first-child,
    #lark-mini-editor ne-alert ne-h3:first-child,
    #lark-mini-editor ne-alert ne-h3:first-child,
    #lark-mini-editor ne-alert ne-h4:first-child,
    #lark-mini-editor ne-alert ne-h4:first-child,
    #lark-mini-editor ne-alert ne-h5:first-child,
    #lark-mini-editor ne-alert ne-h5:first-child,
    #lark-mini-editor ne-alert ne-h6:first-child,
    #lark-mini-editor ne-alert ne-h6:first-child,
    .yuque-doc-content ne-alert ne-oli:first-child,
    .yuque-doc-content ne-alert ne-p:first-child,
    .yuque-doc-content ne-alert ne-p:first-child,
    .yuque-doc-content ne-alert ne-h1:first-child,
    .yuque-doc-content ne-alert ne-h1:first-child,
    .yuque-doc-content ne-alert ne-h2:first-child,
    .yuque-doc-content ne-alert ne-h2:first-child,
    .yuque-doc-content ne-alert ne-h3:first-child,
    .yuque-doc-content ne-alert ne-h3:first-child,
    .yuque-doc-content ne-alert ne-h4:first-child,
    .yuque-doc-content ne-alert ne-h4:first-child,
    .yuque-doc-content ne-alert ne-h5:first-child,
    .yuque-doc-content ne-alert ne-h5:first-child,
    .yuque-doc-content ne-alert ne-h6:first-child,
    .yuque-doc-content ne-alert ne-h6:first-child,
    .ne-doc-major-editor ne-alert ne-oli:first-child,
    .ne-doc-major-editor ne-alert ne-p:first-child,
    .ne-doc-major-editor ne-alert ne-p:first-child,
    .ne-doc-major-editor ne-alert ne-h1:first-child,
    .ne-doc-major-editor ne-alert ne-h1:first-child,
    .ne-doc-major-editor ne-alert ne-h2:first-child,
    .ne-doc-major-editor ne-alert ne-h2:first-child,
    .ne-doc-major-editor ne-alert ne-h3:first-child,
    .ne-doc-major-editor ne-alert ne-h3:first-child,
    .ne-doc-major-editor ne-alert ne-h4:first-child,
    .ne-doc-major-editor ne-alert ne-h4:first-child,
    .ne-doc-major-editor ne-alert ne-h5:first-child,
    .ne-doc-major-editor ne-alert ne-h5:first-child,
    .ne-doc-major-editor ne-alert ne-h6:first-child,
    .ne-doc-major-editor ne-alert ne-h6:first-child,
    .ne-doc-major-viewer ne-alert ne-oli:first-child,
    .ne-doc-major-viewer ne-alert ne-p:first-child,
    .ne-doc-major-viewer ne-alert ne-p:first-child,
    .ne-doc-major-viewer ne-alert ne-h1:first-child,
    .ne-doc-major-viewer ne-alert ne-h1:first-child,
    .ne-doc-major-viewer ne-alert ne-h2:first-child,
    .ne-doc-major-viewer ne-alert ne-h2:first-child,
    .ne-doc-major-viewer ne-alert ne-h3:first-child,
    .ne-doc-major-viewer ne-alert ne-h3:first-child,
    .ne-doc-major-viewer ne-alert ne-h4:first-child,
    .ne-doc-major-viewer ne-alert ne-h4:first-child,
    .ne-doc-major-viewer ne-alert ne-h5:first-child,
    .ne-doc-major-viewer ne-alert ne-h5:first-child,
    .ne-doc-major-viewer ne-alert ne-h6:first-child,
    .ne-doc-major-viewer ne-alert ne-h6:first-child {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    #lark-mini-editor .ne-viewer-body ne-h1:first-child,
    #lark-mini-editor .ne-viewer-body ne-h2:first-child,
    #lark-mini-editor .ne-viewer-body ne-h3:first-child,
    #lark-mini-editor .ne-viewer-body ne-h4:first-child,
    #lark-mini-editor .ne-viewer-body ne-h5:first-child,
    #lark-mini-editor .ne-viewer-body ne-h6:first-child,
    #lark-mini-editor .ne-viewer-body ne-p:first-child,
    #lark-mini-editor .ne-engine ne-h1:first-child,
    #lark-mini-editor .ne-engine ne-h2:first-child,
    #lark-mini-editor .ne-engine ne-h3:first-child,
    #lark-mini-editor .ne-engine ne-h4:first-child,
    #lark-mini-editor .ne-engine ne-h5:first-child,
    #lark-mini-editor .ne-engine ne-h6:first-child,
    #lark-mini-editor .ne-engine ne-p:first-child,
    .yuque-doc-content .ne-viewer-body ne-h1:first-child,
    .yuque-doc-content .ne-viewer-body ne-h2:first-child,
    .yuque-doc-content .ne-viewer-body ne-h3:first-child,
    .yuque-doc-content .ne-viewer-body ne-h4:first-child,
    .yuque-doc-content .ne-viewer-body ne-h5:first-child,
    .yuque-doc-content .ne-viewer-body ne-h6:first-child,
    .yuque-doc-content .ne-viewer-body ne-p:first-child,
    .yuque-doc-content .ne-engine ne-h1:first-child,
    .yuque-doc-content .ne-engine ne-h2:first-child,
    .yuque-doc-content .ne-engine ne-h3:first-child,
    .yuque-doc-content .ne-engine ne-h4:first-child,
    .yuque-doc-content .ne-engine ne-h5:first-child,
    .yuque-doc-content .ne-engine ne-h6:first-child,
    .yuque-doc-content .ne-engine ne-p:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h1:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h2:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h3:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h4:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h5:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-h6:first-child,
    .ne-doc-major-editor .ne-viewer-body ne-p:first-child,
    .ne-doc-major-editor .ne-engine ne-h1:first-child,
    .ne-doc-major-editor .ne-engine ne-h2:first-child,
    .ne-doc-major-editor .ne-engine ne-h3:first-child,
    .ne-doc-major-editor .ne-engine ne-h4:first-child,
    .ne-doc-major-editor .ne-engine ne-h5:first-child,
    .ne-doc-major-editor .ne-engine ne-h6:first-child,
    .ne-doc-major-editor .ne-engine ne-p:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h1:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h2:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h3:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h4:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h5:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h6:first-child,
    .ne-doc-major-viewer .ne-viewer-body ne-p:first-child,
    .ne-doc-major-viewer .ne-engine ne-h1:first-child,
    .ne-doc-major-viewer .ne-engine ne-h2:first-child,
    .ne-doc-major-viewer .ne-engine ne-h3:first-child,
    .ne-doc-major-viewer .ne-engine ne-h4:first-child,
    .ne-doc-major-viewer .ne-engine ne-h5:first-child,
    .ne-doc-major-viewer .ne-engine ne-h6:first-child,
    .ne-doc-major-viewer .ne-engine ne-p:first-child {
      margin-top: 0 !important;
    }
    #lark-mini-editor ne-alert ne-h1:last-child,
    #lark-mini-editor ne-alert ne-h2:last-child,
    #lark-mini-editor ne-alert ne-h3:last-child,
    #lark-mini-editor ne-alert ne-h4:last-child,
    #lark-mini-editor ne-alert ne-h5:last-child,
    #lark-mini-editor ne-alert ne-h6:last-child,
    #lark-mini-editor ne-alert ne-p:last-child,
    #lark-mini-editor .ne-viewer-body ne-h1:last-child,
    #lark-mini-editor .ne-viewer-body ne-h2:last-child,
    #lark-mini-editor .ne-viewer-body ne-h3:last-child,
    #lark-mini-editor .ne-viewer-body ne-h4:last-child,
    #lark-mini-editor .ne-viewer-body ne-h5:last-child,
    #lark-mini-editor .ne-viewer-body ne-h6:last-child,
    #lark-mini-editor .ne-viewer-body ne-p:last-child,
    .yuque-doc-content ne-alert ne-h1:last-child,
    .yuque-doc-content ne-alert ne-h2:last-child,
    .yuque-doc-content ne-alert ne-h3:last-child,
    .yuque-doc-content ne-alert ne-h4:last-child,
    .yuque-doc-content ne-alert ne-h5:last-child,
    .yuque-doc-content ne-alert ne-h6:last-child,
    .yuque-doc-content ne-alert ne-p:last-child,
    .yuque-doc-content .ne-viewer-body ne-h1:last-child,
    .yuque-doc-content .ne-viewer-body ne-h2:last-child,
    .yuque-doc-content .ne-viewer-body ne-h3:last-child,
    .yuque-doc-content .ne-viewer-body ne-h4:last-child,
    .yuque-doc-content .ne-viewer-body ne-h5:last-child,
    .yuque-doc-content .ne-viewer-body ne-h6:last-child,
    .yuque-doc-content .ne-viewer-body ne-p:last-child,
    .ne-doc-major-editor ne-alert ne-h1:last-child,
    .ne-doc-major-editor ne-alert ne-h2:last-child,
    .ne-doc-major-editor ne-alert ne-h3:last-child,
    .ne-doc-major-editor ne-alert ne-h4:last-child,
    .ne-doc-major-editor ne-alert ne-h5:last-child,
    .ne-doc-major-editor ne-alert ne-h6:last-child,
    .ne-doc-major-editor ne-alert ne-p:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h1:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h2:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h3:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h4:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h5:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-h6:last-child,
    .ne-doc-major-editor .ne-viewer-body ne-p:last-child,
    .ne-doc-major-viewer ne-alert ne-h1:last-child,
    .ne-doc-major-viewer ne-alert ne-h2:last-child,
    .ne-doc-major-viewer ne-alert ne-h3:last-child,
    .ne-doc-major-viewer ne-alert ne-h4:last-child,
    .ne-doc-major-viewer ne-alert ne-h5:last-child,
    .ne-doc-major-viewer ne-alert ne-h6:last-child,
    .ne-doc-major-viewer ne-alert ne-p:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h1:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h2:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h3:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h4:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h5:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-h6:last-child,
    .ne-doc-major-viewer .ne-viewer-body ne-p:last-child {
      margin-bottom: 0 !important;
    }
    #lark-mini-editor ne-card[data-card-type='block'],
    .yuque-doc-content ne-card[data-card-type='block'],
    .ne-doc-major-editor ne-card[data-card-type='block'],
    .ne-doc-major-viewer ne-card[data-card-type='block'] {
      border-radius: 8px !important;
      overflow: hidden;
    }
    #lark-mini-editor ne-card[data-card-name='hr'] .ne-card-container,
    .yuque-doc-content ne-card[data-card-name='hr'] .ne-card-container,
    .ne-doc-major-editor ne-card[data-card-name='hr'] .ne-card-container,
    .ne-doc-major-viewer ne-card[data-card-name='hr'] .ne-card-container {
      padding: 0 !important;
    }
    .larkui-icon-permission-private {
      color: var(--yq-red-400) !important;
    }
    .larkui-icon-icon-public {
      color: var(--yq-yuque-green-700) !important;
    }
  `;

  style.appendChild(document.createTextNode(cssString));
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
})();
