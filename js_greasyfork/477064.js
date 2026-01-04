// ==UserScript==
// @name         myKavita
// @name:zh-TW   myKavita
// @name:zh-TW   myKavita
// @name:en      Kavita enhancement
// @version      0.9
// @author       ethan
// @description  自动更改Kavita用户设置
// @description:ZH-TW  自动更改Kavita用户设置
// @description:EN  自动更改Kavita用户设置
// @match        *://127.0.0.1:5000/*
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace https://greasyfork.org/users/829453
// @downloadURL https://update.greasyfork.org/scripts/477064/myKavita.user.js
// @updateURL https://update.greasyfork.org/scripts/477064/myKavita.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const styleFont = document.createElement('style');
    styleFont.innerHTML = `
  p,blockquote {
    font-family: Lato !important;
    font-size: 200% !important;
  }

`;
    document.head.appendChild(styleFont);
// 构建新的CSS规则
const newThemeCSS = `
  :root .brtheme-dark {
    --bs-btn-active-color: black !important;
    --progress-bg-color: rgb(222, 226, 230) !important;
    --color-scheme: light !important;
    --bs-body-color: black !important;
    --hr-color: rgba(239, 239, 239, 0.125) !important;
    --accent-bg-color: rgba(1, 4, 9, 0.5) !important;
    --accent-text-color: lightgrey !important;
    --body-text-color: black !important;
    --btn-icon-filter: invert(1) grayscale(100%) brightness(200%) !important;
    --drawer-bg-color: #F1E4D5 !important;
    --drawer-text-color: black !important;
    --drawer-pagination-horizontal-rule: inset 0 -1px 0 rgb(255 255 255 / 20%) !important;
    --accordion-header-bg-color: rgba(52, 60, 70, 0.5) !important;
    --accordion-body-bg-color: #F1E4D5 !important;
    --accordion-body-border-color: rgba(239, 239, 239, 0.125) !important;
    --accordion-body-text-color: var(--body-text-color) !important;
    --accordion-header-collapsed-bg-color: #F1E4D5 !important;
    --accordion-button-focus-border-color: unset !important;
    --accordion-button-focus-box-shadow: unset !important;
    --accordion-active-body-bg-color: #F1E4D5 !important;
    --btn-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --btn-primary-text-color: white !important;
    --btn-primary-bg-color: var(--primary-color) !important;
    --btn-primary-border-color: var(--primary-color) !important;
    --btn-primary-hover-text-color: white !important;
    --btn-primary-hover-bg-color: var(--primary-color-darker-shade) !important;
    --btn-primary-hover-border-color: var(--primary-color-darker-shade) !important;
    --btn-alt-bg-color: #424c72 !important;
    --btn-alt-border-color: #444f75 !important;
    --btn-alt-hover-bg-color: #3b4466 !important;
    --btn-alt-focus-bg-color: #343c59 !important;
    --btn-alt-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --btn-fa-icon-color: black !important;
    --btn-disabled-bg-color: #343a40 !important;
    --btn-disabled-text-color: #efefef !important;
    --btn-disabled-border-color: #6c757d !important;
    --input-bg-color: white !important;
    --input-bg-readonly-color: #F1E4D5 !important;
    --input-focused-border-color: #ccc !important;
    --input-placeholder-color: black !important;
    --input-border-color: #ccc !important;
    --input-text-color: black !important;
    --input-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --nav-tab-border-color: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-text-color: var(--body-text-color) !important;
    --nav-tab-bg-color: var(--primary-color) !important;
    --nav-tab-hover-border-color: var(--primary-color) !important;
    --nav-tab-active-text-color: white !important;
    --nav-tab-border-hover-color: transparent !important;
    --nav-tab-hover-text-color: var(--body-text-color) !important;
    --nav-tab-hover-bg-color: transparent !important;
    --nav-tab-border-top: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-left: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-bottom: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-right: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-top: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-left: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-bottom: var(--bs-body-bg) !important;
    --nav-tab-hover-border-right: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-active-hover-bg-color: var(--primary-color) !important;
    --nav-link-bg-color: var(--primary-color) !important;
    --nav-link-active-text-color: white !important;
    --nav-link-text-color: white !important;
    --br-actionbar-button-hover-border-color: #6c757d !important;
    --br-actionbar-bg-color: #F1E4D5 !important;
    --drawer-pagination-horizontal-rule: inset 0 -1px 0 rgb(0 0 0 / 13%) !important;
    --theme-bg-color: #fff3c9 !important;
  }
`;
    const stylePaper = document.createElement('style');
    stylePaper.innerHTML = newThemeCSS;
    document.head.appendChild(stylePaper);

const newDefaultCSS = `
  :root .default {
    --bs-btn-active-color: black !important;
    --progress-bg-color: rgb(222, 226, 230) !important;
    --color-scheme: light !important;
    --bs-body-color: black !important;
    --hr-color: rgba(239, 239, 239, 0.125) !important;
    --accent-bg-color: rgba(1, 4, 9, 0.5) !important;
    --accent-text-color: lightgrey !important;
    --body-text-color: black !important;
    --btn-icon-filter: invert(1) grayscale(100%) brightness(200%) !important;
    --drawer-bg-color: #F1E4D5 !important;
    --drawer-text-color: black !important;
    --drawer-pagination-horizontal-rule: inset 0 -1px 0 rgb(255 255 255 / 20%) !important;
    --accordion-header-bg-color: rgba(52, 60, 70, 0.5) !important;
    --accordion-body-bg-color: #F1E4D5 !important;
    --accordion-body-border-color: rgba(239, 239, 239, 0.125) !important;
    --accordion-body-text-color: var(--body-text-color) !important;
    --accordion-header-collapsed-bg-color: #F1E4D5 !important;
    --accordion-button-focus-border-color: unset !important;
    --accordion-button-focus-box-shadow: unset !important;
    --accordion-active-body-bg-color: #F1E4D5 !important;
    --btn-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --btn-primary-text-color: white !important;
    --btn-primary-bg-color: var(--primary-color) !important;
    --btn-primary-border-color: var(--primary-color) !important;
    --btn-primary-hover-text-color: white !important;
    --btn-primary-hover-bg-color: var(--primary-color-darker-shade) !important;
    --btn-primary-hover-border-color: var(--primary-color-darker-shade) !important;
    --btn-alt-bg-color: #424c72 !important;
    --btn-alt-border-color: #444f75 !important;
    --btn-alt-hover-bg-color: #3b4466 !important;
    --btn-alt-focus-bg-color: #343c59 !important;
    --btn-alt-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --btn-fa-icon-color: black !important;
    --btn-disabled-bg-color: #343a40 !important;
    --btn-disabled-text-color: #efefef !important;
    --btn-disabled-border-color: #6c757d !important;
    --input-bg-color: white !important;
    --input-bg-readonly-color: #F1E4D5 !important;
    --input-focused-border-color: #ccc !important;
    --input-placeholder-color: black !important;
    --input-border-color: #ccc !important;
    --input-text-color: black !important;
    --input-focus-boxshadow-color: rgb(255 255 255 / 50%) !important;
    --nav-tab-border-color: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-text-color: var(--body-text-color) !important;
    --nav-tab-bg-color: var(--primary-color) !important;
    --nav-tab-hover-border-color: var(--primary-color) !important;
    --nav-tab-active-text-color: white !important;
    --nav-tab-border-hover-color: transparent !important;
    --nav-tab-hover-text-color: var(--body-text-color) !important;
    --nav-tab-hover-bg-color: transparent !important;
    --nav-tab-border-top: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-left: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-bottom: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-border-right: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-top: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-left: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-hover-border-bottom: var(--bs-body-bg) !important;
    --nav-tab-hover-border-right: rgba(44, 118, 88, 0.7) !important;
    --nav-tab-active-hover-bg-color: var(--primary-color) !important;
    --nav-link-bg-color: var(--primary-color) !important;
    --nav-link-active-text-color: white !important;
    --nav-link-text-color: white !important;
    --br-actionbar-button-hover-border-color: #6c757d !important;
    --br-actionbar-bg-color: #F1E4D5 !important;
    --drawer-pagination-horizontal-rule: inset 0 -1px 0 rgb(0 0 0 / 13%) !important;
    --theme-bg-color: #fff3c9 !important;
  }
`;
    const styleDefault = document.createElement('style');
    styleDefault.innerHTML = newDefaultCSS;
    document.head.appendChild(styleDefault);

})();