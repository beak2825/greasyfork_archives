// ==UserScript==
// @name         mteam-preview
// @namespace    https://rachpt.cn
// @version      2025.10.25.1526
// @author       rachpt
// @description  mteam增强插件
// @license      MIT
// @copyright    2025, rachpt (https://openuserjs.org/users/rachpt)
// @icon         https://static.m-team.cc/favicon.ico
// @match        https://ob.m-team.cc/browse/*
// @match        https://ob.m-team.cc/browse
// @match        https://ob.m-team.cc/detail/*
// @connect      static.m-team.cc
// @connect      img.m-team.cc
// @connect      *
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536508/mteam-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/536508/mteam-preview.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(` #root #app-content .app-content__inner .ant-spin-nested-loading table>thead>tr>th:nth-child(2) {
  width: 560px !important;
}
#root #app-content .app-content__inner .ant-image img.ant-image-img {
  /* height: 444px !important; */
  width: 100%;
  height: 100%;
}
#root #app-content .ant-spin-container .flex-grow .inline-flex.max-w-full.items-center.pr-3.whitespace-nowrap,
#root #app-content .ant-spin-container .flex-grow .inline-flex.max-w-full.items-center.pr-3.whitespace-nowrap .ant-typography.ant-typography-ellipsis.ant-typography-ellipsis-single-line {
  flex-wrap: wrap !important;
  text-wrap: wrap !important;
}
#root #app-content .app-content__inner .mx-auto ul.ant-pagination.ant-pagination-mini {
  display: none;
}
#root #app-content tr.download-history[data-type="append"] {
  background-color: #8a2be236;
}
#root #app-content tr.download-history[data-type="append"] .download-status.hide {
  display: none;
}
#root #app-content tr.download-history[data-type="append"] .download-status {
  margin-top: 4px;
}
#root #app-content tr.download-history[data-type="append"] .down-percent {
  border-radius: 5px;
  padding: 2px 5px;
  background-color: #73e10594;
}
#root #app-content tr.download-history[data-type="append"] .down-date {
  border-radius: 5px;
  padding: 2px 5px;
  background-color: #73e10594;
}

/* \u7F13\u5B58\u6807\u8BC6\u6837\u5F0F */
#root #app-content .ant-image .cache-indicator {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #108ee9;
  color: white;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
  z-index: 10;
  pointer-events: none;
}

/* \u786E\u4FDD\u56FE\u7247\u5BB9\u5668\u6709\u76F8\u5BF9\u5B9A\u4F4D */
#root #app-content .ant-image {
  position: relative;
}/* rynl2q */
:where(.css-custom).ant-tag {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 14px;
    box-sizing: border-box;
}

:where(.css-custom).ant-tag::before,
:where(.css-custom).ant-tag::after {
    box-sizing: border-box;
}

:where(.css-custom).ant-tag [class^="ant-tag"],
:where(.css-custom).ant-tag [class*=" ant-tag"] {
    box-sizing: border-box;
}

:where(.css-custom).ant-tag [class^="ant-tag"]::before,
:where(.css-custom).ant-tag [class*=" ant-tag"]::before,
:where(.css-custom).ant-tag [class^="ant-tag"]::after,
:where(.css-custom).ant-tag [class*=" ant-tag"]::after {
    box-sizing: border-box;
}

:where(.css-custom).ant-tag {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.88);
    font-size: 12px;
    line-height: 20px;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    display: inline-block;
    height: auto;
    margin-inline-end: 8px;
    padding-inline: 7px;
    white-space: nowrap;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    opacity: 1;
    transition: all 0.2s;
    text-align: start;
    position: relative;
}

:where(.css-custom).ant-tag.ant-tag-rtl {
    direction: rtl;
}

:where(.css-custom).ant-tag,
:where(.css-custom).ant-tag a,
:where(.css-custom).ant-tag a:hover {
    color: rgba(0, 0, 0, 0.88);
}

:where(.css-custom).ant-tag .ant-tag-close-icon {
    margin-inline-start: 3px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: all 0.2s;
}

:where(.css-custom).ant-tag .ant-tag-close-icon:hover {
    color: rgba(0, 0, 0, 0.88);
}

:where(.css-custom).ant-tag.ant-tag-has-color {
    border-color: transparent;
}

:where(.css-custom).ant-tag.ant-tag-has-color,
:where(.css-custom).ant-tag.ant-tag-has-color a,
:where(.css-custom).ant-tag.ant-tag-has-color a:hover,
:where(.css-custom).ant-tag.ant-tag-has-color .anticon-close,
:where(.css-custom).ant-tag.ant-tag-has-color .anticon-close:hover {
    color: #fff;
}

:where(.css-custom).ant-tag-checkable {
    background-color: transparent;
    border-color: transparent;
    cursor: pointer;
}

:where(.css-custom).ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
    color: #2f4879;
    background-color: rgba(0, 0, 0, 0.06);
}

:where(.css-custom).ant-tag-checkable:active,
:where(.css-custom).ant-tag-checkable-checked {
    color: #fff;
}

:where(.css-custom).ant-tag-checkable-checked {
    background-color: #2f4879;
}

:where(.css-custom).ant-tag-checkable-checked:hover {
    background-color: #495f85;
}

:where(.css-custom).ant-tag-checkable:active {
    background-color: #1c2c52;
}

:where(.css-custom).ant-tag-hidden {
    display: none;
}

:where(.css-custom).ant-tag>.anticon+span,
:where(.css-custom).ant-tag>span+.anticon {
    margin-inline-start: 7px;
}

:where(.css-custom).ant-tag-borderless {
    border-color: transparent;
    background: #fafafa;
}

/* button */
:where(.css-custom).ant-btn {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 14px;
    box-sizing: border-box;
}

:where(.css-custom).ant-btn::before,
:where(.css-custom).ant-btn::after {
    box-sizing: border-box;
}

:where(.css-custom).ant-btn [class^="ant-btn"],
:where(.css-custom).ant-btn [class*=" ant-btn"] {
    box-sizing: border-box;
}

:where(.css-custom).ant-btn [class^="ant-btn"]::before,
:where(.css-custom).ant-btn [class*=" ant-btn"]::before,
:where(.css-custom).ant-btn [class^="ant-btn"]::after,
:where(.css-custom).ant-btn [class*=" ant-btn"]::after {
    box-sizing: border-box;
}

:where(.css-custom).ant-btn {
    outline: none;
    position: relative;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    user-select: none;
    touch-action: manipulation;
    color: rgba(0, 0, 0, 0.88);
}

:where(.css-custom).ant-btn:disabled>* {
    pointer-events: none;
}

:where(.css-custom).ant-btn .ant-btn-icon>svg {
    display: inline-flex;
    align-items: center;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

:where(.css-custom).ant-btn .ant-btn-icon>svg>* {
    line-height: 1;
}

:where(.css-custom).ant-btn .ant-btn-icon>svg svg {
    display: inline-block;
}

:where(.css-custom).ant-btn>a {
    color: currentColor;
}

:where(.css-custom).ant-btn:not(:disabled):focus-visible {
    outline: 3px solid #8a929e;
    outline-offset: 1px;
    transition: outline-offset 0s, outline 0s;
}

:where(.css-custom).ant-btn.ant-btn-two-chinese-chars::first-letter {
    letter-spacing: 0.34em;
}

:where(.css-custom).ant-btn.ant-btn-two-chinese-chars>*:not(.anticon) {
    margin-inline-end: -0.34em;
    letter-spacing: 0.34em;
}

:where(.css-custom).ant-btn.ant-btn-icon-only {
    padding-inline: 0;
}

:where(.css-custom).ant-btn.ant-btn-icon-only.ant-btn-compact-item {
    flex: none;
}

:where(.css-custom).ant-btn.ant-btn-icon-only.ant-btn-round {
    width: auto;
}

:where(.css-custom).ant-btn.ant-btn-loading {
    opacity: 0.65;
    cursor: default;
}

:where(.css-custom).ant-btn .ant-btn-loading-icon {
    transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-appear-start,
:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-enter-start {
    margin-inline-end: -8px;
}

:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-appear-active,
:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-enter-active {
    margin-inline-end: 0;
}

:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-leave-start {
    margin-inline-end: 0;
}

:where(.css-custom).ant-btn:not(.ant-btn-icon-end) .ant-btn-loading-icon-motion-leave-active {
    margin-inline-end: -8px;
}

:where(.css-custom).ant-btn-icon-end {
    flex-direction: row-reverse;
}

:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-appear-start,
:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-enter-start {
    margin-inline-start: -8px;
}

:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-appear-active,
:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-enter-active {
    margin-inline-start: 0;
}

:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-leave-start {
    margin-inline-start: 0;
}

:where(.css-custom).ant-btn-icon-end .ant-btn-loading-icon-motion-leave-active {
    margin-inline-start: -8px;
}

:where(.css-custom).ant-btn {
    font-size: 14px;
    height: 32px;
    padding: 0px 15px;
    border-radius: 6px;
}

:where(.css-custom).ant-btn.ant-btn-icon-only {
    width: 32px;
}

:where(.css-custom).ant-btn.ant-btn-icon-only .anticon {
    font-size: inherit;
}

:where(.css-custom).ant-btn.ant-btn-circle.ant-btn {
    min-width: 32px;
    padding-inline-start: 0;
    padding-inline-end: 0;
    border-radius: 50%;
}

:where(.css-custom).ant-btn.ant-btn-round.ant-btn {
    border-radius: 32px;
    padding-inline-start: 16px;
    padding-inline-end: 16px;
}

:where(.css-custom).ant-btn-sm {
    font-size: 14px;
    height: 24px;
    padding: 0px 7px;
    border-radius: 4px;
}

:where(.css-custom).ant-btn-sm.ant-btn-icon-only {
    width: 24px;
}

:where(.css-custom).ant-btn-sm.ant-btn-icon-only .anticon {
    font-size: inherit;
}

:where(.css-custom).ant-btn.ant-btn-circle.ant-btn-sm {
    min-width: 24px;
    padding-inline-start: 0;
    padding-inline-end: 0;
    border-radius: 50%;
}

:where(.css-custom).ant-btn.ant-btn-round.ant-btn-sm {
    border-radius: 24px;
    padding-inline-start: 12px;
    padding-inline-end: 12px;
}

:where(.css-custom).ant-btn-lg {
    font-size: 16px;
    height: 40px;
    padding: 0px 15px;
    border-radius: 8px;
}

:where(.css-custom).ant-btn-lg.ant-btn-icon-only {
    width: 40px;
}

:where(.css-custom).ant-btn-lg.ant-btn-icon-only .anticon {
    font-size: inherit;
}

:where(.css-custom).ant-btn.ant-btn-circle.ant-btn-lg {
    min-width: 40px;
    padding-inline-start: 0;
    padding-inline-end: 0;
    border-radius: 50%;
}

:where(.css-custom).ant-btn.ant-btn-round.ant-btn-lg {
    border-radius: 40px;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
}

:where(.css-custom).ant-btn.ant-btn-block {
    width: 100%;
}

:where(.css-custom).ant-btn-color-default {
    color: rgba(0, 0, 0, 0.88);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-solid {
    color: #fff;
    background: rgb(0, 0, 0);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-solid:disabled,
:where(.css-custom).ant-btn-color-default.ant-btn-variant-solid.ant-btn-disabled {
    cursor: not-allowed;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.04);
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-solid:not(:disabled):not(.ant-btn-disabled):active {
    color: #fff;
    background: rgba(0, 0, 0, 0.95);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-dashed {
    border-style: dashed;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-filled {
    box-shadow: none;
    background: rgba(0, 0, 0, 0.04);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-filled:disabled,
:where(.css-custom).ant-btn-color-default.ant-btn-variant-filled.ant-btn-disabled {
    cursor: not-allowed;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.04);
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):hover {
    background: rgba(0, 0, 0, 0.06);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):active {
    background: rgba(0, 0, 0, 0.15);
}

:where(.css-custom).ant-btn-color-default.ant-btn-background-ghost {
    color: #ffffff;
    background: transparent;
    border-color: #ffffff;
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-default.ant-btn-background-ghost:not(:disabled):not(.ant-btn-disabled):hover {
    background: transparent;
}

:where(.css-custom).ant-btn-color-default.ant-btn-background-ghost:not(:disabled):not(.ant-btn-disabled):active {
    background: transparent;
}

:where(.css-custom).ant-btn-color-default.ant-btn-background-ghost:disabled {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-link {
    color: rgba(0, 0, 0, 0.88);
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-link:disabled,
:where(.css-custom).ant-btn-color-default.ant-btn-variant-link.ant-btn-disabled {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-link:not(:disabled):not(.ant-btn-disabled):hover {
    color: #69b1ff;
    background: transparent;
}

:where(.css-custom).ant-btn-color-default.ant-btn-variant-link:not(:disabled):not(.ant-btn-disabled):active {
    color: #0958d9;
}

:where(.css-custom).ant-btn-color-primary {
    color: #2f4879;
    box-shadow: 0 2px 0 rgba(7, 22, 40, 0.33);
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-outlined,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed {
    border-color: #2f4879;
    background: #ffffff;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-outlined:disabled,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed:disabled,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-outlined.ant-btn-disabled,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed.ant-btn-disabled {
    cursor: not-allowed;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.04);
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover {
    color: #495f85;
    border-color: #495f85;
    background: #ffffff;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):active,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):active {
    color: #1c2c52;
    border-color: #1c2c52;
    background: #ffffff;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-dashed {
    border-style: dashed;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-filled {
    box-shadow: none;
    background: #adb2b8;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-filled:disabled,
:where(.css-custom).ant-btn-color-primary.ant-btn-variant-filled.ant-btn-disabled {
    cursor: not-allowed;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
    background: rgba(0, 0, 0, 0.04);
    box-shadow: none;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):hover {
    background: #a1a5ab;
}

:where(.css-custom).ant-btn-color-primary.ant-btn-variant-filled:not(:disabled):not(.ant-btn-disabled):active {
    background: #8a929e;
} `);

(function () {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  function Zt(t){const e=Array.isArray(t)?t:[t],n=()=>{e.forEach((a,r)=>{try{a();}catch(o){console.error(`执行函数 ${a.name||`#${r+1}`} 时发生错误:`,o);}});};document.readyState==="complete"?n():window.addEventListener("load",n);}let x=null;const te=()=>{const t=document.createElement("div");return t.style.cssText="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;align-items:center;gap:10px;",t},ee=t=>{const{type:e="info",content:n}=t,a=document.createElement("div");a.style.cssText="padding:8px 16px;border-radius:4px;background:white;box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);display:flex;align-items:center;gap:8px;animation:messageSlideIn 0.3s ease-out;font-size:14px;line-height:1.5;color:#333;";const r={success:{borderLeft:"4px solid #52c41a",backgroundColor:"#f6ffed"},error:{borderLeft:"4px solid #ff4d4f",backgroundColor:"#fff2f0"},info:{borderLeft:"4px solid #1890ff",backgroundColor:"#e6f7ff"},warning:{borderLeft:"4px solid #faad14",backgroundColor:"#fffbe6"}};Object.assign(a.style,r[e]);const o={success:`<svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" fill="#52c41a">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
    </svg>`,error:`<svg viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="#ff4d4f">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
    </svg>`,info:`<svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="#1890ff">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
    </svg>`,warning:`<svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="1em" height="1em" fill="#faad14">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
    </svg>`};a.innerHTML=`${o[e]}${n}`;const s=document.createElement("style");return s.textContent=`
    @keyframes messageSlideIn {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes messageSlideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  `,document.head.appendChild(s),a},P=t=>{x||(x=te(),document.body.appendChild(x));const e=ee(t);x.appendChild(e);const n=t.duration||3e3;setTimeout(()=>{e.style.animation="messageSlideOut 0.3s ease-out forwards",setTimeout(()=>{e.remove(),x&&x.children.length===0&&(x.remove(),x=null);},300);},n);},F={success:(t,e)=>P({type:"success",content:t,duration:e}),error:(t,e)=>P({type:"error",content:t,duration:e}),info:(t,e)=>P({type:"info",content:t,duration:e}),warning:(t,e)=>P({type:"warning",content:t,duration:e})};var ne=typeof GM_getValue<"u"?GM_getValue:void 0,At=typeof GM_setValue<"u"?GM_setValue:void 0,j=typeof unsafeWindow<"u"?unsafeWindow:void 0,ae="__monkeyWindow-"+(()=>{try{return new URL((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)).origin}catch{return location.origin}})(),Ht=document[ae]??window,re=Ht.GM,oe=Ht.GM_xmlhttpRequest;function se(t){var e;const n=new Headers,a=t.replace(/\r?\n[\t ]+/g," ");for(const r of a.split(/\r?\n/)){const o=r.split(":"),s=(e=o.shift())==null?void 0:e.trim();if(s){const c=o.join(":").trim();try{n.append(s,c);}catch(i){console.warn(`Response ${i.message}`);}}}return n}const pt=async(t,e)=>{const n=oe||re.xmlHttpRequest;if(typeof n!="function")throw new DOMException("GM_xmlhttpRequest or GM.xmlHttpRequest is not granted.","NotFoundError");const a=new Request(t,e);if(a.signal.aborted)throw new DOMException("Network request aborted.","AbortError");const r=await a.blob(),o=Object.fromEntries(a.headers);return new Headers(e?.headers).forEach((s,c)=>{o[c]=s;}),new Promise((s,c)=>{let i=false;const l=new Promise(d=>{const{abort:u}=n({method:a.method.toUpperCase(),url:a.url||location.href,headers:o,data:r.size?r:void 0,redirect:a.redirect,binary:true,nocache:a.cache==="no-store",revalidate:a.cache==="reload",timeout:3e5,responseType:n.RESPONSE_TYPE_STREAM??"blob",overrideMimeType:a.headers.get("Content-Type")??void 0,anonymous:a.credentials==="omit",onload:({response:m})=>{if(i){d(null);return}d(m);},async onreadystatechange({readyState:m,responseHeaders:f,status:v,statusText:g,finalUrl:b,response:B}){if(m===XMLHttpRequest.DONE)a.signal.removeEventListener("abort",u);else if(m!==XMLHttpRequest.HEADERS_RECEIVED)return;if(i){d(null);return}const $=se(f),A=a.url!==b,H=new Response(B instanceof ReadableStream?B:await l,{headers:$,status:v,statusText:g});Object.defineProperties(H,{url:{value:b},type:{value:"basic"},...H.redirected!==A?{redirected:{value:A}}:{},...$.has("set-cookie")||$.has("set-cookie2")?{headers:{value:$}}:{}}),s(H),i=true;},onerror:({statusText:m,error:f})=>{c(new TypeError(m||f||"Network request failed.")),d(null);},ontimeout(){c(new TypeError("Network request timeout.")),d(null);},onabort(){c(new DOMException("Network request aborted.","AbortError")),d(null);}});a.signal.addEventListener("abort",u);});})},mt="qbittorrent_config",Y=()=>{const t=ne(mt);return t||null},ie=t=>{const{url:e,username:n,password:a}=t,r=Y();if(r&&r.url===e&&r.username===n&&r.password===a)return r.sid},ce=async t=>{if(!t.url)throw new Error("Invalid qBittorrent config, url is required");if(t.sid=ie(t),!await Mt(t).catch(n=>{throw new Error(`qBittorrent login failed: ${n}`)}))throw new Error("Invalid qBittorrent config, login failed");return At(mt,t),true},Dt=(t,e=false)=>({...t?.sid?{Cookie:`SID=${t.sid}`}:{},...e?{}:{"Content-Type":"application/x-www-form-urlencoded"}});async function Mt(t){const{url:e,username:n,password:a}=t;if(!e)return  false;const r=!!t.sid;try{const o=await pt(`${e}/api/v2/auth/login`,{method:"POST",headers:Dt(t),...r?{}:{credentials:"omit"},body:`username=${encodeURIComponent(n)}&password=${encodeURIComponent(a)}`});if(!o.ok)return !1;const s=o.headers.get("set-cookie")||o.headers.get("Set-Cookie");if(!t.sid&&!s)return !1;const c=s?.match(/SID=(?<sid>[^;]+)/)?.groups?.sid;return c?(t.sid=c,r&&At(mt,t),!0):!!(await o.text())?.match(/ok/i)}catch{return  false}}const le=async t=>{const e=Y();if(!e)return  false;try{if(!await Mt(e))throw new Error("qBittorrent login failed");const{url:a,autoStart:r}=e,o=!r,s=new FormData;s.append("urls",t),s.append("paused",o.toString());const c=Dt(e,!0),i=await pt(`${a}/api/v2/torrents/add`,{credentials:"omit",body:s,method:"POST",headers:c});return i.ok?!!(await i.text())?.match(/ok/i):!1}catch(n){return console.error("Failed to add torrent to qBittorrent:",n),false}},G=t=>{const e=performance.now();return new Promise(n=>{const a=()=>{performance.now()-e>=t?n():requestAnimationFrame(a);};requestAnimationFrame(a);})};async function M(t,e=200,n=300,a=false){for(;e--;){const r=document.querySelector(t);if(!r){await G(n);continue}if(a&&r.innerText?.length===0){await G(n);continue}return r}return null}let de=(t,e)=>{console.error("Fetch Error:",t.message,e);};async function Rt(t,e={},n=3){let a=0,r;for(;;)try{const o=await pt(t,e);if(!o.ok){const{status:c,statusText:i}=o,l=`状态: ${i||c}`;throw new ue(l)}const s=e.responseType||"auto";return s==="blob"?await o.blob():s==="text"?await o.text():o.headers.get("content-type")?.includes("application/json")?await o.json():await o.text()}catch(o){if(r||(r=o),a++,a>=n)throw de(r||o,t),r||o;await G(200*a);}}class ue extends Error{constructor(e){super(e),this.name="FetchError";}}const pe=["440"],Q=Object.freeze({secret:"HLkPcWmycL57mfJt",webversion:"1140",version:"1.1.4"}),C={secret:"",version:{}};function qt(t){return t?.length?t.filter(e=>!(ge(e.smallDescr)||pe.includes(e.category))):[]}async function K(){if(C.secret)return C.secret;const{secret:t,...e}=await It();return C.version=e,C.secret=t,t}async function me(){if(Object.keys(C.version).length)return C.version;const{secret:t,...e}=await It();return C.version=e,C.secret=t,e}async function It(){const t=fe();if(!t)return Q;const e=await await Rt(t);if(!e)return Q;const n=/version:"(?<v>[^"]+)"/,a=/secret:"(?<v>[^"]+)"/,r=n.exec(e)?.groups?.v,o=a.exec(e)?.groups?.v;if(!r||!o)return Q;const s=r.split("-")[0].replace(/\./g,"")+"0";return {secret:o,version:r,webversion:s}}function ge(t){return t?["#GV","#GAY","WARNING","人妖","勿入","伪娘","男娘"].some(n=>t.includes(n)):false}function fe(){const t=document.querySelectorAll("script"),e=/\/js\/main\.[^/]+\.js$/;for(const n of t){const a=n.getAttribute("src");if(a&&e.test(a))return a}return null}const z=()=>{const t=localStorage.getItem("visitorId"),e=localStorage.getItem("apiHost"),n=localStorage.getItem("auth"),a=localStorage.getItem("did");return {host:e,genHeaders:async(r=true)=>({...await me(),accept:"application/json",...r&&{"Content-Type":"application/json"},ts:Math.floor(Date.now()/1e3).toString(),...n&&{Authorization:n},...t&&{visitorId:t},...a&&{did:a}})}};async function J(t,e){const n=new TextEncoder,a=n.encode(t),r=n.encode(e),o=await crypto.subtle.importKey("raw",r,{name:"HMAC",hash:"SHA-1"},false,["sign"]),s=await crypto.subtle.sign("HMAC",o,a);return btoa(String.fromCharCode(...new Uint8Array(s)))}const zt=async t=>{const e=await he(t);return e?.startsWith("http")?await le(e)?(F.success("已添加到 qBittorrent 下载队列",4e3),true):(window.open(e,"_blank"),F.info("已使用浏览器打开下载链接",3e3),false):(F.error("下载失败，请重试",3e3),false)};async function he(t){const{host:e,genHeaders:n}=z(),a=Date.now(),r=await K(),o=await J(`POST&/api/torrent/genDlToken&${a}`,r),s=new FormData;s.append("id",t.toString()),s.append("_sgin",o),s.append("_timestamp",a.toString());const c=`${e}/torrent/genDlToken`,i=await n(false),d=await(await fetch(c,{method:"POST",body:s,headers:i})).json();return d.message==="SUCCESS"?d.data:null}const ye=`<svg viewBox="64 64 896 896" focusable="false" data-icon="reload" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true">
  <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"></path></svg>`,Bt=`<svg width="1.8em" height="1.8em" viewBox="0 0 32 32" fill="currentColor">
<path d="M 16 3 C 8.8321388 3 3 8.832144 3 16 C 3 23.167856 8.8321388 29 16 29 C 23.167861 29 29 23.167856 29 16 C 29 8.832144 23.167861 3 16 3 z M 16 5 C 22.086982 5 27 9.9130223 27 16 C 27 22.086978 22.086982 27 16 27 C 9.9130183 27 5 22.086978 5 16 C 5 9.9130223 9.9130183 5 16 5 z M 17 8 L 17 15 L 17 17 L 17 21 L 18 21 L 18.466797 20.064453 C 19.160001 20.639538 20.035946 21 21 21 C 23.197334 21 25 19.197334 25 17 L 25 15 C 25 12.802666 23.197334 11 21 11 C 20.269312 11 19.59163 11.213648 19 11.560547 L 19 8 L 17 8 z M 11 11 C 8.8026661 11 7 12.802666 7 15 L 7 17 C 7 19.197334 8.8026661 21 11 21 C 11.730688 21 12.40837 20.786352 13 20.439453 L 13 24 L 15 24 L 15 11 L 14 11 L 13.533203 11.935547 C 12.839999 11.360462 11.964054 11 11 11 z M 11 13 C 12.116666 13 13 13.883334 13 15 L 13 17 C 13 18.116666 12.116666 19 11 19 C 9.8833339 19 9 18.116666 9 17 L 9 15 C 9 13.883334 9.8833339 13 11 13 z M 21 13 C 22.116666 13 23 13.883334 23 15 L 23 17 C 23 18.116666 22.116666 19 21 19 C 19.883334 19 19 18.116666 19 17 L 19 15 C 19 13.883334 19.883334 13 21 13 z"></path></svg>`,be=t=>`<button type="button" class="ant-btn css-custom ${t} ant-btn-circle ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-sm ant-btn-icon-only ant-btn-background-ghost mr-2">
    <span class="ant-btn-icon">
      <span role="img" aria-label="download" class="anticon anticon-download">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
        </svg>
      </span>
    </span>
  </button>`,Pt='<path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>',jt='<path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>',we=t=>`<button type="button" class="ant-btn css-custom ${t} ant-btn-circle ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-sm ant-btn-icon-only ant-btn-background-ghost">
    <span class="ant-btn-icon">
      <span role="img" aria-label="star" class="anticon anticon-star">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          ${Pt}
        </svg>
      </span>
    </span>
  </button>`,ve=t=>`<button type="button" class="ant-btn css-custom ${t} ant-btn-circle ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-sm ant-btn-icon-only ant-btn-background-ghost">
    <span class="ant-btn-icon">
      <span role="img" aria-label="star" class="anticon anticon-star" style="color: gold;">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true">${jt}</svg>
      </span>
    </span>
  </button>`,Nt=t=>{const e=t.closest(".anticon-star");if(!e)return  false;const{color:n}=window.getComputedStyle(e);return n==="gold"||n==="rgb(255, 215, 0)"},xe=t=>{const e=t.querySelector("path");if(!e)return  false;const n=t.closest(".anticon-star");return Nt(t)?(e.setAttribute("d",Pt.match(/<path d="([^"]+)"/)?.[1]||""),n?.removeAttribute("style"),false):(e.setAttribute("d",jt.match(/<path d="([^"]+)"/)?.[1]||""),n?.setAttribute("style","color: gold;"),true)},Se=()=>`<span role="img" aria-label="arrow-up" class="anticon anticon-arrow-up mr-0.5" style="color: green;">
    <svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-up" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"></path>
    </svg>
  </span>`,Ce=()=>`<span role="img" aria-label="arrow-down" class="anticon anticon-arrow-down mr-0.5" style="color: red;">
    <svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0048.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z"></path>
    </svg>
  </span>`,$e=()=>{const t=document.createElement("div");return t.style.left="50%",t.style.bottom="20px",t.style.color="white",t.style.position="fixed",t.className="loading-tip",t.style.transform="translateX(-50%)",t.style.background="rgba(0, 0, 0, 0.7)",t.style.borderRadius="4px",t.style.padding="8px 16px",t.style.display="none",t.style.zIndex="1000",t.textContent="加载中...",t},Ee=Object.freeze({1:{name:"DIY",color:"rgb(90, 189, 72)"},2:{name:"国配",color:"rgb(90, 59, 20)"},4:{name:"中字",color:"rgb(59, 74, 127)"}}),Te=t=>{const e=Number(t),n=[];return e&1&&n.push("1"),e&2&&n.push("2"),e&4&&n.push("4"),n},Le=(t,e)=>{if(!t||String(t)==="0")return "";const n=Te(t);if(!n.length)return "";const a="ant-tag ant-tag-has-color ml-1 mt-default css-custom";return n.map(r=>{const{name:o,color:s}=Ee[r];return `<span class="${a} ${e}" style="background-color:${s};">${o}</span>`}).join("")},ke=(t,e="",n="")=>`<div class='download-status hide'><span data-size="${t}" class="down-percent">${e}</span> <span class="down-date">${n}</span></div>`,vt="css-xwzqqd";function gt(){const t=document.querySelector('.ant-descriptions-item-content .ant-typography[class*="css-"]');return t?.classList?.length&&Array.from(t.classList.values()).find(n=>n.startsWith("css-"))||vt}async function Ae(){if(!De())return;await M('.ant-descriptions-item-content .ant-typography[class*="css-"]',50,100);const t=gt();Re()&&qe(t),He(t);}async function He(t){const e=await M('.grid .ant-image-img-placeholder[class*="css-"]',20,200);if(!e)return;const n=e.closest(".grid.grid-cols-7");n?.classList?.remove("grid-cols-7"),n?.classList?.add("grid-cols-4");const a=document.querySelectorAll(`.ant-image-img.ant-image-img-placeholder.${t}`);for(const r of a){const o=r;if(!o.src)continue;o.src=Me(o.src);const c=o.nextElementSibling;c?.className==="ant-image-mask"&&c?.remove();}}function De(){const{host:t,pathname:e}=location;return t.endsWith("m-team.cc")?e.startsWith("/detail/"):false}function Me(t){return t.replace(/(\d+)-(\d+)\.jpg$/,"$1jp-$2.jpg")}function Re(){return !!Y()}function qe(t){const e=document.querySelector(".ant-descriptions-view tbody:first-child .ant-descriptions-item-content .ant-space");if(!e)return;const n=document.createElement("button");n.type="button",n.className=`ant-btn ant-btn-color-default ant-btn-default ant-btn-sm ant-btn-variant-outlined ${t}`,n.innerHTML=`<span class="ant-btn-icon"><span role="img" aria-label="alert" class="anticon anticon-alert" style="color:red;"></span></span>${Bt}<span>下载</span>`,e.appendChild(n),n.addEventListener("click",async()=>{const a=Ie();a&&await zt(a);});}function Ie(){const{pathname:t}=location,e=t.replace("/detail/","").match(/^\d+/);if(e)return e[0]}const ze="mteam-preview",Be=2;var y=(t=>(t.ImageCache="image-cache",t.TorrentHistory="torrent-history",t))(y||{});function Pe(t){if(!t.objectStoreNames.contains("image-cache")){const e=t.createObjectStore("image-cache",{keyPath:"id"});e.createIndex("insertTime","insertTime",{unique:false}),e.createIndex("lastAccessTime","lastAccessTime",{unique:false});}if(!t.objectStoreNames.contains("torrent-history")){const e=t.createObjectStore("torrent-history",{keyPath:"id"});e.createIndex("dateTime","dateTime",{unique:false}),e.createIndex("updateTime","updateTime",{unique:false});}}const je=t=>t?.includes("m-team.cc/")?{Referer:"https://kp.m-team.cc/"}:void 0;let ft=0;async function Ne(t,e=540,n=.75){try{const a=await Rt(t,{method:"GET",responseType:"blob",credentials:"include",headers:je(t)});return new Promise((r,o)=>{const s=new Image;s.onload=()=>{const c=document.createElement("canvas");let i=s.width,l=s.height;if(i>e){const u=e/i;i=e,l=l*u;}c.width=i,c.height=l;const d=c.getContext("2d");if(!d){o(new Error("无法获取 canvas 上下文"));return}d.drawImage(s,0,0,i,l),c.toBlob(u=>{u?r(u):o(new Error("无法创建 Blob"));},"image/webp",n);},s.onerror=()=>o(new Error("图像加载失败")),s.src=URL.createObjectURL(a);})}catch(a){throw new Error(`获取图像失败: ${a}`)}}async function _e(t,e){try{const n=await Ne(e),o=(await k()).transaction(y.ImageCache,"readwrite").objectStore(y.ImageCache),s={id:t,imageData:n,originalUrl:e,insertTime:Date.now(),lastAccessTime:Date.now()},c=o.put(s);return new Promise((i,l)=>{c.onsuccess=()=>{i();},c.onerror=d=>{l(new Error(`缓存图像失败: ${d}`));};})}catch(n){throw new Error(`缓存图像时出错: ${n}`)}}async function Oe(t){try{const a=(await k()).transaction(y.ImageCache,"readwrite").objectStore(y.ImageCache),r=a.get(t);return new Promise((o,s)=>{r.onsuccess=()=>{const c=r.result;if(c){c.lastAccessTime=Date.now(),a.put(c);const i=URL.createObjectURL(c.imageData);ft++,o(i);}else o(null);},r.onerror=()=>s(new Error("获取缓存图像失败"));})}catch(e){return console.error("获取缓存图像时出错:",e),null}}async function Fe(t=30){try{const r=(await k()).transaction(y.ImageCache,"readwrite").objectStore(y.ImageCache).index("lastAccessTime"),o=Date.now()-t*24*60*60*1e3,s=r.openCursor(IDBKeyRange.upperBound(o));s.onsuccess=c=>{const i=c.target.result;i&&(i.delete(),i.continue());};}catch(e){console.error("清理缓存时出错:",e);}}async function Ve(){try{const n=(await k()).transaction(y.ImageCache,"readonly").objectStore(y.ImageCache);return new Promise((a,r)=>{let o=0,s=0;const c=n.openCursor();c.onsuccess=i=>{const l=i.target.result;if(l){o++;const d=l.value;s+=d.imageData.size,l.continue();}else a({count:o,size:s});},c.onerror=()=>r(new Error("获取缓存统计信息失败"));})}catch(t){return console.error("获取缓存统计信息时出错:",t),{count:0,size:0}}}function Ue(){return ft}function Ge(){ft=0;}let T=null;async function k(){return T||new Promise((t,e)=>{const n=indexedDB.open(ze,Be);n.onerror=()=>{e(new Error("无法打开数据库"));},n.onsuccess=a=>{T=a.target.result,T.onclose=()=>{T=null;},t(T);},n.onupgradeneeded=a=>{const r=a.target.result;Pe(r);};})}function Xe(){const t=localStorage.getItem("lastImageCacheCleanup"),e=Date.now();(!t||e-parseInt(t)>30*24*60*60*1e3)&&Fe(60).then(()=>{localStorage.setItem("lastImageCacheCleanup",e.toString()),console.log("图像缓存清理完成");}).catch(n=>{console.error("设置缓存清理任务时出错:",n);});}async function We(t){try{const a=(await k()).transaction(y.TorrentHistory,"readwrite").objectStore(y.TorrentHistory);return new Promise((r,o)=>{let s=0;for(const c of t){const i=a.put(c);i.onsuccess=()=>{s++,s===t.length&&r();},i.onerror=()=>o(new Error("批量保存下载历史记录失败"));}t.length===0&&r();})}catch(e){console.error("批量保存下载历史记录时出错:",e);}}async function _t(t){try{const a=(await k()).transaction(y.TorrentHistory,"readonly").objectStore(y.TorrentHistory),r={},o=t.map(s=>new Promise(c=>{const i=a.get(s);i.onsuccess=()=>{i.result&&(r[s]=i.result),c();},i.onerror=()=>{console.error(`获取种子${s}的下载历史失败`),c();};}));return await Promise.all(o),r}catch(e){return console.error("批量获取下载历史记录时出错:",e),{}}}async function Ye(t){const e=await _t(t);return t.filter(n=>!e[n])}async function Ke(t){const e=Date.now(),n=await K(),a=await J(`POST&/api/tracker/queryHistory&${e}`,n),{host:r,genHeaders:o}=z(),s={_timestamp:e,_sgin:a,tids:t},c=`${r}/tracker/queryHistory`,i=await o();return (await(await fetch(c,{body:JSON.stringify(s),method:"POST",headers:i})).json()).data}function Je(t){return t.map(e=>e.id)}function Qe(t){const e={};return t.forEach(n=>{n.id&&n.size&&(e[n.id]=n.size);}),e}function xt(t){return {id:t.torrent,dateTime:t.lastCompleteDate||t.lastModifiedDate||t.createdDate,download:t.downloadedReal||t.downloaded||"0",timesCompleted:t.timesCompleted||"0",updateTime:Date.now()}}function Ze(t,e){if(!t.download||!e)return "0%";const n=parseFloat(t.download),a=parseFloat(e);if(isNaN(n)||isNaN(a)||a===0)return "0%";const r=n/a*100;return r>=100?"100%":`${r.toFixed(1)}%`}function tn(t){if(!t)return "";try{return new Date(t).toLocaleDateString()}catch{return ""}}function St(t,e){Object.entries(t).forEach(([n,a])=>{const r=document.querySelector(`tr[data-id="${n}"]`);if(!r)return;const o=r.querySelector(".download-status"),s=r.querySelector(".down-percent"),c=r.querySelector(".down-date");if(o?.classList.remove("hide"),r.classList?.add("download-history"),s){let i="";e&&e[n]?i=e[n]:i=s.getAttribute("data-size")||"";const l=Ze(a,i);s.textContent=`完成：${l}`;}if(c){const i=tn(a.dateTime);c.textContent=`日期：${i}`;}});}async function Ot(t){try{const e=Je(t);if(!e.length)return;const n=t?Qe(t):void 0,a=await _t(e);Object.keys(a).length>0&&St(a,n);const r=await Ye(e);if(r.length>0)try{const o=await Ke(r),s=[];if(o.historyMap&&Object.values(o?.historyMap||{}).forEach(c=>{const i=xt(c);s.push(i);}),o.peerMap&&Object.values(o?.peerMap||{}).forEach(c=>{const i=xt(c);s.push(i);}),s.length>0){We(s).catch(i=>console.error("保存下载历史记录失败:",i));const c=Object.fromEntries(s.map(i=>[i.id,i]));St(c,n);}}catch(o){console.error("从API获取下载历史记录失败:",o);}}catch(e){console.error("处理下载历史记录时出错:",e);}}let Ct=false,R="";const en=[{value:"createdDate",label:"发布时间"},{value:"seeders",label:"做种数"},{value:"leechers",label:"下载数"},{value:"timeCompleted",label:"完成数"}],nn={createdDate:null,seeders:"SEEDERS",leechers:"LEECHERS",timeCompleted:"TIME_COMPLETED"},an=t=>nn[t];async function $t(){if(Ct)return;Ct=true;const t=await M("form.ant-form > .ant-form-item:last-child .ant-form-item-control-input-content");if(!t)return;R||(R=gt());const e=rn();t.appendChild(e);}function rn(){const t=Z("div","ant-form-item-control-input");t.style.display="inline-flex",t.style.marginLeft="20px";const e=Z("div",`ant-radio-group ant-radio-group-outline ${R}`);e.style.marginLeft="6px";const n=Z("div",`ant-space ${R} ant-space-horizontal ant-space-align-center ant-space-gap-row-small ant-space-gap-col-small`);return n.style.display="flex",n.style.gap="10px",en.forEach(a=>{const r=on(a);n.appendChild(r);}),e.appendChild(n),t.appendChild(document.createTextNode("排序:")),t.appendChild(e),t}function Z(t,e){const n=document.createElement(t);return n.className=e,n}function on(t){const e=document.createElement("div");e.className="ant-space-item";const n=document.createElement("label");n.className=`ant-radio-wrapper ant-radio-wrapper-in-form-item capitalize ${R}`,n.style.display="flex";const a=document.createElement("span");a.className="ant-radio ant-wave-target",a.style.display="flex";const r=document.createElement("input");r.className="ant-radio-input",r.name=":ric:",r.type="radio",r.value=t.value,t.value==="createdDate"&&(r.checked=true),r.addEventListener("change",function(){const c=this.value,i=document.querySelector("#sort");if(!i)return;const l=new URLSearchParams(window.location.search);if(c){const d=i.value?.split(":")||["","descend"],u=c+(d.length>1?`:${d[1]}`:":descend"),m=an(c)+(d.length>1?`:${d[1]}`:":descend");i.setAttribute("value",u),l.set("sort",m);}else i.value="",l.delete("sort");window.history.replaceState({},"",`${window.location.pathname}?${l}`);});const o=document.createElement("span");o.className="ant-radio-inner",a.appendChild(r),a.appendChild(o);const s=document.createElement("span");return s.className="ant-radio-label",s.textContent=t.label,n.appendChild(a),n.appendChild(s),e.appendChild(n),e}const sn=t=>{const e=Date.now(),a=new Date(t).getTime()-e,r=1e3*60*60*24;if(e>r)return `${Math.floor(a/r)} 天`;const o=1e3*60*60;return e>o?`${Math.floor(a/o)} 小时`:`${Math.floor(a/(1e3*60))} 分钟`},st=1024,it=st*1024,ct=it*1024,tt=ct*1024,et=16,cn=t=>{if(t.length>et){const n=parseFloat(t.slice(0,et));return `${((t.length-et)*(n/tt)).toFixed(2)} TB`}const e=parseFloat(t);return e<st?`${e.toFixed(2)} B`:e<it?`${(e/st).toFixed(2)} KB`:e<ct?`${(e/it).toFixed(2)} MB`:e<tt?`${(e/ct).toFixed(2)} GB`:`${(e/tt).toFixed(2)} TB`},ln=t=>dn.find(e=>e.id===String(t)),dn=[{id:"100",image:"",name:"电影"},{id:"105",image:"",name:"影剧/综艺"},{id:"110",image:"",name:"Music"},{id:"115",image:"",name:"AV(有码)"},{id:"120",image:"",name:"AV(无码)"},{id:"401",image:"moviesd.png",name:"电影/SD"},{id:"402",image:"tvhd.png",name:"影剧/综艺/HD"},{id:"403",image:"tvsd.png",name:"影剧/综艺/SD"},{id:"404",image:"bbc.png",name:"纪录"},{id:"405",image:"anime.png",name:"动画"},{id:"406",image:"mv.png",name:"演唱"},{id:"407",image:"sport.png",name:"运动"},{id:"409",image:"other.png",name:"Misc(其他)"},{id:"410",image:"cenhd.png",name:"AV(有码)/HD Censored"},{id:"411",image:"hgame.png",name:"H-游戏"},{id:"412",image:"hanime.png",name:"H-动漫"},{id:"413",image:"hcomic.png",name:"H-漫画"},{id:"419",image:"moviehd.png",name:"电影/HD"},{id:"420",image:"moviedvd.png",name:"电影/DVDiSo"},{id:"421",image:"moviebd.png",name:"电影/Blu-Ray"},{id:"422",image:"software.png",name:"软件"},{id:"423",image:"game-pc-3.jpeg",name:"PC游戏"},{id:"424",image:"censd.png",name:"AV(有码)/SD Censored"},{id:"425",image:"ivvideo.png",name:"IV(写真影集)"},{id:"426",image:"uendvd.png",name:"AV(无码)/DVDiSo Uncensored"},{id:"427",image:"Study.png",name:"教育書面"},{id:"429",image:"uenhd.png",name:"AV(无码)/HD Uncensored"},{id:"430",image:"uensd.png",name:"AV(无码)/SD Uncensored"},{id:"431",image:"cenbd.png",name:"AV(有码)/Blu-Ray Censored"},{id:"432",image:"uenbd.png",name:"AV(无码)/Blu-Ray Uncensored"},{id:"433",image:"ivpic.png",name:"IV(写真图集)"},{id:"434",image:"flac.png",name:"Music(无损)"},{id:"435",image:"tvdvd.png",name:"影剧/综艺/DVDiSo"},{id:"436",image:"adult0day.png",name:"AV(网站)/0Day"},{id:"437",image:"cendvd.png",name:"AV(有码)/DVDiSo Censored"},{id:"438",image:"tvbd.png",name:"影剧/综艺/BD"},{id:"439",image:"movieremux.png",name:"电影/Remux"},{id:"440",image:"gayhd.gif",name:"AV(Gay)/HD"},{id:"441",image:"Study_Video.png",name:"教育(影片)"},{id:"442",image:"Study_Audio.png",name:"有声书"},{id:"443",image:"",name:"教育"},{id:"444",image:"",name:"紀錄"},{id:"445",image:"",name:"IV"},{id:"446",image:"",name:"H-ACG"},{id:"447",image:"",name:"遊戲"},{id:"448",image:"pcgame.png",name:"TV游戏"},{id:"449",image:"",name:"動漫"},{id:"450",image:"",name:"其他"}];let h="";const nt={},lt=t=>t?.[0]?.includes("m-team.cc/")?"origin":"no-referrer",un=(t,e)=>!t||!e?"":`<a href="${t}" target="_blank" rel="noreferrer" class="mr-2">
    <span class="ant-typography css-custom ${h}">
      <img src="https://static.m-team.cc/static/douban.ico" alt="imdb" height="14" class="rounded-sm" />
      <span class="align-middle">${e}</span>
    </span>
  </a>`,pn=(t,e)=>!t||!e?"":`<a href="${t}" target="_blank" rel="noreferrer" class="mr-2">
    <span class="ant-typography css-custom ${h}">
      <img src="https://static.m-team.cc/static/imdb.gif" alt="imdb" />
      <span class="align-middle">${e}</span>
    </span>
  </a>`,mn=({douban:t,doubanRating:e,imdb:n,imdbRating:a})=>{const r=pn(n,a),s=[un(t,e),r].filter(Boolean);return s.length?`<div class="flex items-center justify-end flex-nowrap">${s.join("")}</div>`:""},gn=t=>Number(t)?`<img src="https://static.m-team.cc/static/ms_up.jpg" alt="+${t}%" title="+${t}%" />`:"",fn=t=>Array.from({length:Number(t)||0},()=>'<img src="https://static.m-team.cc/static/trans.gif" class="sticky" alt="sticky" title="置頂">').join(""),Et=t=>{const e="background-color:rgb(255, 85, 0);",n="background-color:rgb(16, 142, 233);",a=`ant-tag mt-default ml-2 css-custom ${h}}`;switch(t){case "NORMAL":return "";case "PERCENT_70":return `<span class="${a} ant-tag-gold">30%</span>`;case "PERCENT_50":return `<span class="${a} ant-tag-has-color" style="${e}">50%</span>`;case "FREE":return `<span class="${a} ant-tag-has-color" style="${n}">Free</span>`;default:return ""}},hn=(t,e,n)=>e?`<span class="ant-typography ml-2 ${n}" title="促销, 截止日期：${e}">
    ${Et(t)}
    <span class="ant-typography ${n}" style="font-size: 13px;">限时：${sn(e)}</span>
  </span>`:Et(t),S="border border-solid border-black p-2";async function yn(t,e,n){if(!nt[t])try{nt[t]=!0;for(let a=0;a<e.length;a++){const r=e[a];try{n.referrerPolicy=lt([r]);const o=await Oe(t);if(o){n.src=o,bn(n);return}await new Promise((s,c)=>{n.onload=s,n.onerror=c,n.src=r;}),await _e(t,r);return}catch{a===e.length-1&&(n.src=r);}}}catch(a){console.error("所有图片加载失败，使用最后一张:",a),e.length>0&&(n.src=e[e.length-1]);}finally{nt[t]=false;}}function bn(t){const e=t.closest(".ant-image");if(e){if(e.querySelector(".cache-indicator"))return;const n=document.createElement("div");n.className="cache-indicator",n.textContent="缓存",n.title="此图片来自本地缓存",e.appendChild(n);}}const Ft=t=>{h||(h=gt());const{comments:e,seeders:n,timesCompleted:a,leechers:r,discount:o,discountEndTime:s,toppingLevel:c}=t.status,{imageList:i,msUp:l,douban:d,createdDate:u,imdbRating:m,imdb:f,doubanRating:v}=t,{name:g,id:b,smallDescr:B,category:$,size:A,labels:H,collection:Kt}=t,Jt=cn(A),yt=ln($),Qt=mn({douban:d,doubanRating:v,imdb:f,imdbRating:m}),bt=`torrent-img-${b}`;return requestAnimationFrame(()=>{const wt=document.getElementById(bt);wt&&i?.length&&yn(b,i,wt);}),`<tr data-id="${b}" data-type="append">
      <td class="${S}" align="center">
        <a href="/browse?cat=${$}" target="_self">
          <img class="cate" src="https://static.m-team.cc/static/cate/${yt?.image}" alt="${yt?.name}" />
        </a>
      </td>
      <td class="${S}" align="center">
        <div referrerpolicy="${lt(i)}" class="ant-image css-custom ${h}">
          <img id="${bt}" referrerpolicy="${lt(i)}" class="ant-image-img css-custom ${h}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${g}" />
        </div>
      </td>
      <td class="${S}">
        <div class="flex flex-nowrap">
          <div class="w-2 flex-grow">
            <div>
              <a href="/detail/${b}" target="_blank">
                <div class="inline-flex max-w-full items-center pr-3 whitespace-nowrap" style="margin-top: 1px; margin-bottom: 1px">
                  <span class="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line mr-1 css-custom ${h}">
                    <strong>
                      ${fn(c)}
                      ${gn(l)}
                      <span>${g}</span>
                    </strong>
                  </span>
                  <a href="https://wiki.m-team.cc/zh-tw/seedbox-rules" target="_blank">
                    <img class="box_img" src="https://static.m-team.cc/static/box_small.png" alt="box-img" />
                  </a>
                  ${hn(o,s,h)}
                </div>
              </a>
              <br />
              <div class="inline-flex max-w-full items-center pr-3 whitespace-nowrap">
                <span class="ant-typography ant-typography-ellipsis ant-typography-ellipsis-single-line css-custom ${h}">
                  ${B||""}
                </span>
                ${Le(H,h)}
              </div>
            </div>
          </div>
          <div>
            <div class="flex rows-center justify-end flex-nowrap">
              <div>${be(h)} ${Kt?ve(h):we(h)}</div>
            </div>
            ${Qt}
            </div>
          </div>
        </div>
        ${ke(A)}
      </td>
      <td class="${S}" align="center">${e}</td>
      <td class="${S}" align="center">
        <span title="" class="block mx-[-5px]">${u}</span>
      </td>
      <td class="${S} whitespace-pre-line" align="center">
        <div class="mx-[-5px]">${Jt}</div>
      </td>
      <td class="${S}" align="center">
        ${Se()}<span>${n}</span>
      </td>
      <td class="${S}" align="center">
        ${Ce()}<span>${r}/${a}</span>
      </td>
    </tr>`},wn=async(t,e)=>{const{host:n,genHeaders:a}=z(),r=Date.now(),o=await K(),s=await J(`POST&/api/torrent/collection&${r}`,o),c=new FormData;c.append("id",t),c.append("_sgin",s),c.append("make",e?"true":"false"),c.append("_timestamp",r.toString());const i=`${n}/torrent/collection`,l=await a(false);return (await(await fetch(i,{method:"POST",body:c,headers:l})).json()).message==="SUCCESS"};let Tt=false;const vn=()=>{Tt||(Tt=true,document.addEventListener("click",xn));};function xn(t){const e=t.target,n=e.closest('tr[data-id][data-type="append"]');if(!n)return;const a=n.dataset.id;if(!a)return;const r=Sn(e);if(!r)return;const o=Cn(r);if(o)switch(o){case "download":return zt(a).then(s=>{s&&n.classList.add("download-history");});case "collect":{const s=Nt(r);return wn(a,!s).then(c=>{console.log("res",c),xe(r);})}}}function Sn(t){return t.tagName.toLowerCase()!=="button"||!t.closest('button.ant-btn.ant-btn-circle.ant-btn-background-ghost[type="button"]')?null:t.tagName.toLowerCase()==="svg"?t:t.querySelector("svg[data-icon]")||t.closest("svg[data-icon]")}function Cn(t){if(!t)return null;const e=t.getAttribute("data-icon");return e==="download"?"download":e==="star"?"collect":null}function $n(t){const e=history.pushState,n=history.replaceState;history.pushState=function(a,r,o){t(a,r,o);const s=[a,r,o];return e.apply(history,s)},history.replaceState=function(a,r,o){t(a,r,o);const s=[a,r,o];return n.apply(history,s)};}const En=Object.freeze({descend:"DESC",ascend:"ASC"}),Tn=()=>1+(Number(new URL(location.href).searchParams.get("pageNumber"))||1),Ln=t=>t.replace(/([A-Z])/g,"_$1").toUpperCase(),kn=t=>t.get("onlyFav")?{onlyFav:1}:{},An=t=>t.get("keyword")?{keyword:t.get("keyword")}:{},Hn=t=>{const e=t.get("sort");if(!e)return {};const[n,a]=e.split(":");return {sortField:Ln(n),sortDirection:En[a]}},Dn=t=>{const e=t.get("uploadDateStart"),n=t.get("uploadDateEnd");return !e||!n?{}:{uploadDateStart:e,uploadDateEnd:n}},Mn=()=>{const{href:t,pathname:e}=location,{searchParams:n}=new URL(t),a=e.match(/^\/browse\/(?<m>\w+)$/)?.groups?.m||"normal",r=Number(n.get("pageSize"))||100,o=n.getAll("cat")||[],s=Dn(n),c=Hn(n),i=kn(n),l=An(n);return {mode:a,pageSize:r,categories:o,...c,...s,...i,...l}};async function Rn(t=Tn()){const e=Date.now(),n=await K(),a=await J(`POST&/api/torrent/search&${e}`,n),r={...Mn(),visible:1,pageNumber:t,_timestamp:e,_sgin:a},{host:o,genHeaders:s}=z(),c=`${o}/torrent/search`,i=await s(),d=await(await fetch(c,{body:JSON.stringify(r),method:"POST",headers:i})).json();return qt(d.data?.data)}const Vt=(t,e,n="beforeend")=>{e.insertAdjacentHTML(n,t);},qn=(t,e)=>{let n=null;return (...a)=>{n&&clearTimeout(n),n=setTimeout(()=>{t.apply(null,a),n=null;},e);}};let w=null;const In=()=>{const t=document.createElement("dialog");t.style.cssText="padding:20px;border-radius:8px;border:1px solid #ccc;background:#fff;min-width:300px;box-shadow:0 4px 12px rgba(0, 0, 0, 0.15);";const e=Y();t.innerHTML=`<h2 style="margin:0 0 20px 0;font-size:18px;">qBittorrent 设置</h2><form method="dialog" style="display:flex;flex-direction:column;gap:15px;"><div><label for="url" style="display:block;margin-bottom:5px;">Web UI 地址</label><input type="url" id="url" name="url" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" value="${e?.url||""}" placeholder="http://localhost:8080"></div><div><label for="username" style="display:block;margin-bottom:5px;">用户名</label><input type="text" id="username" name="username" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" value="${e?.username||""}" placeholder="admin"></div><div><label for="password" style="display:block;margin-bottom:5px;">密码</label><div style="position:relative;"><input type="password" id="password" name="password" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" value="${e?.password||""}" placeholder="adminadmin"><button type="button" id="toggle-password" style=" position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;color:#666;"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></button></div></div><div><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="autoStart" name="autoStart" ${e?.autoStart!==false?"checked":""}><span>添加后自动开始下载</span></label></div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;"><button type="button" id="cancel" style="padding:8px 16px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;">取消</button><button type="submit" id="save" style="padding:8px 16px;border:none;border-radius:4px;background:#1890ff;color:white;cursor:pointer;">保存</button></div></form>`;const n=t.querySelector("#toggle-password"),a=t.querySelector("#password");return n&&a&&n.addEventListener("click",()=>{const r=a.type==="password"?"text":"password";a.type=r,n.innerHTML=r==="password"?`<svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"></path>
            <path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
          </svg>`:`<svg viewBox="64 64 896 896" focusable="false" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"></path>
            <path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
          </svg>`;}),t},zn=async()=>{if(w){w.showModal();return}w=In(),document.body.appendChild(w);const t=document.createElement("style");t.textContent=`
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }
  `,document.head.appendChild(t);const e=w.querySelector("form"),n=w.querySelector("#cancel");e&&e.addEventListener("submit",async a=>{a.preventDefault();const r=new FormData(e);try{await ce({url:r.get("url"),username:r.get("username"),password:r.get("password"),autoStart:r.get("autoStart")==="on"}).then(()=>F.success("配置qBittorrent成功！")),w?.close();}catch(o){alert(o instanceof Error?o.message:"保存设置失败");}}),n&&n.addEventListener("click",()=>{w?.close();}),w.showModal();};let p=null,q=1,L=0,I=0,at=false;const Bn=t=>{if(t===0)return "0 B";const e=["B","KB","MB","GB"],n=Math.floor(Math.log(t)/Math.log(1024)),a=Math.min(n,e.length-1);return (t/Math.pow(1024,a)).toFixed(2)+" "+e[a]},Pn=()=>{const t=document.createElement("div");t.id="torrent-status-indicator",t.style.cssText="position:fixed;left:0;top:50%;color:white;transform:translateY(-50%);background-color:rgba(0, 0, 0, 0.5);padding:5px 8px 6px 5px;border-radius:0 12px 12px 0;font-size:12px;z-index:1000;display:flex;flex-direction:column;box-shadow:0 0 10px rgba(0, 0, 0, 0.3);position:absolute;",t.innerHTML=`<div class="status-header" style="margin-bottom:8px;font-weight:bold;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:5px;">状态监视器</div><div id="status-body"><div class="cache-stats" style="margin-bottom:8px;"><div>缓存：<span id="cache-count">0</span> 条</div><div>空间：<span id="cache-size">0 B</span></div><div>命中：<span id="cache-hits">0</span> 次</div></div><div class="status-content" style="margin-bottom:8px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;"><div>页码：<span id="current-page">1 / ${I}</span></div><div>总数：<span id="total-records">${L}</span></div></div><button id="load-next-page" style=" background:none;border:1px solid rgba(255,255,255,0.6);color:#fff;padding:2px;border-radius:4px;cursor:pointer;display:flex;font-size:xx-small;align-items:center;justify-content:center;transition:background-color 0.2s;width:100%;margin-bottom:5px;"> ${ye} 下一页 </button><button id="qb-settings" style=" background:none;border:1px solid rgba(255,255,255,0.6);color:#fff;padding:2px;border-radius:4px;cursor:pointer;display:flex;font-size:xx-small;align-items:center;justify-content:center;transition:background-color 0.2s;width:100%;"> ${Bt} 下载设置 </button></div><div id="loading-animation" style=" display:none;position:absolute;top:24px;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.7);text-align:center;flex-direction:column;justify-content:center;align-items:center;border-radius:0 0 12px 0;z-index:10;"><div class="loading-spinner" style=" width:24px;height:24px;border:2px solid rgba(255, 255, 255, 0.3);border-radius:50%;border-top-color:#fff;animation:spin 1s ease-in-out infinite;margin-top:12px;display:inline-block;"></div><style> @keyframes spin { to { transform:rotate(360deg);} } </style><div style="margin-top:5px;font-size:12px;">加载中...</div></div>`,t.querySelectorAll("button").forEach(a=>{a.addEventListener("mouseover",()=>{a.style.backgroundColor="rgba(255,255,255,0.1)";}),a.addEventListener("mouseout",()=>{a.style.backgroundColor="transparent";});});const n=t.querySelector("#qb-settings");return n&&n.addEventListener("click",()=>{zn();}),t},jn=t=>{p&&document.body.removeChild(p),p=Pn(),document.body.appendChild(p);const e=p.querySelector("#load-next-page");return e&&e.addEventListener("click",t),dt(),setInterval(dt,1e4),p},dt=async()=>{if(p&&!at){at=true;try{const{count:t,size:e}=await Ve(),n=Ue(),a=p.querySelector("#cache-count"),r=p.querySelector("#cache-size"),o=p.querySelector("#cache-hits");a&&(a.textContent=String(t)),r&&(r.textContent=Bn(e)),o&&(o.textContent=String(n));}catch(t){console.error("更新缓存信息时出错:",t);}finally{at=false;}}},ht=(t,e)=>{if(!p)return;q=t,e>0&&(L+=e);const n=p.querySelector("#current-page"),a=p.querySelector("#total-records");n&&(n.textContent=`${q} / ${I}`),a&&(a.textContent=String(L)),dt();},Nn=()=>{L=0,q=1;},_n=(t,e=0)=>{const n=t?.length||0;if(L+=n,I=e,!p)return;const a=p?.querySelector("#current-page"),r=p?.querySelector("#total-records");a&&(a.textContent=`${q} / ${I}`),r&&(r.textContent=String(L));},On=t=>{if(!p)return;const e=p.querySelector("#loading-animation"),n=p.querySelector("#load-next-page");e&&(e.style.display=t?"flex":"none"),n&&(n.disabled=t);},Fn=()=>{p&&p.parentNode&&(p.parentNode.removeChild(p),p=null);},Vn=()=>q<I;let V=false,U=false,D=1,X="",E=null,W=false;const Un=()=>{const t=document.querySelector("#app-content");if(!t)return  false;const{scrollHeight:e,scrollTop:n,clientHeight:a}=t;return e-n-a<=1e3},Lt=t=>{E&&(E.style.display=t?"block":"none",On(t));},Ut=async()=>{if(!(U||!Vn()))try{U=!0,Lt(!0);const t=document.querySelector(".ant-spin-container tbody");if(!t)return;const e=await Rn(D+1);if(!e?.length)return;e.forEach(n=>{const a=Ft(n);Vt(a,t);}),D++,ht(D,e.length),setTimeout(()=>{Ot(e);},100);}catch(t){console.error("加载更多失败:",t);}finally{setTimeout(()=>{U=false;},3e3),Lt(false);}},Gt=qn(async()=>{Un()&&await Ut();},1e3),Gn=t=>{const e=t.target;(e.classList.contains("ant-image")||e.classList.contains("ant-image-img"))&&(t.preventDefault(),t.stopPropagation());},Xt=()=>{const t=document.querySelectorAll('tr[data-type="append"]');for(const e of t)e.remove();Nn(),Ge();},Wt=()=>{document.querySelector("#app-content")?.removeEventListener("scroll",Gt),E?.remove(),Xt(),Fn(),X="",V=false,D=1,U=false,E=null,W=false,window.handleScrollEventRef=void 0,console.log("run cleanup.");};async function Xn(){Xe(),$n((t,e,n)=>{if(console.log("url change:",n),!n?.startsWith("/browse"))return Wt();n!==X&&(X=n,D=1,Xt(),$t(),W&&ht(1,0)),kt();}),Wn()&&(vn(),$t(),await kt());}async function kt(){if(V)return;X=location.pathname,await M(".ant-image-img",50,400),await G(500),await M(".ant-image-mask",50,400),E||(E=$e(),document.body.appendChild(E)),W||(jn(Ut),ht(1,0),W=true),document.querySelector("#float-btns")?.remove(),document.querySelectorAll(".ant-image > .ant-image-mask").forEach(n=>n?.remove()),document.addEventListener("click",Gn,true),setTimeout(()=>{const n=document.querySelector("#app-content");n&&(V||(V=true,window.handleScrollEventRef&&window.handleScrollEventRef?.(),n.addEventListener("scroll",Gt),window.handleScrollEventRef=Wt,console.log("Adding scroll listener to #app-content")));},8e3);}function Wn(){const{host:t,pathname:e}=location;return t.endsWith("m-team.cc")?e.startsWith("/browse"):false}var N=null,Yt=class ut{constructor(e){if(this.interceptConfigs=[],ut.isHijacked){if(N)return N.addConfig(e),N;console.warn("XHRAndFetchInterceptor: Already activated, avoid duplicate interception.");return}this.interceptConfigs=Array.isArray(e)?e:[e],this.originalXHRopen=XMLHttpRequest.prototype.open,this.originalXHRsend=XMLHttpRequest.prototype.send,this.originalFetch=j.fetch,this.hijackXHR(),this.hijackFetch(),ut.isHijacked=true,N=this;}addConfig(e){(Array.isArray(e)?e:[e]).forEach(n=>{this.interceptConfigs.some(a=>a.url===n.url&&a.method===n.method)||this.interceptConfigs.push(n);});}hijackXHR(){let e=this;XMLHttpRequest.prototype.open=function(n,a,r=true,o,s){this.uri=a,this.method=n,e.originalXHRopen.apply(this,[n,a,r,o,s]);},XMLHttpRequest.prototype.send=async function(n){let a=this.onreadystatechange,r=e.originalXHRsend.bind(this),o={status:0,statusText:"",response:null,responseText:"",responseXML:null,responseType:"",readyState:0},s=new Proxy(this,{get:(i,l)=>l==="readyState"?o.readyState:Reflect.get(i,l)}),c=this.uri?.startsWith("/")?`${location.origin}${this.uri}`:this.uri;for(let i of e.interceptConfigs)if(_(c,i.url)&&O(this.method,i.method)){if(i.beforeSendCallback){let l={url:new URL(c),data:n},{data:d,url:u}=await i.beforeSendCallback(l)||{};d&&(n=d),u&&(this.uri=u.toString(),e.originalXHRopen.apply(this,[this.method,this.uri,true]));}break}return this.onreadystatechange=async function(i){let l=true;if(this.readyState===4&&this.status===200)for(let d of e.interceptConfigs){if(!_(this.responseURL,d.url)||!O(this.method,d.method))continue;let u={url:rt(this.responseURL),data:n};if(d.preCallback){let[f,v]=await d.preCallback(ot(this),u);if(!f){l=false;let g=new XMLHttpRequest;return g.open(this.method,v.uri,true),g.onreadystatechange=async()=>{if(g.readyState===4){if(o.status=g.status,o.statusText=g.statusText,o.response=g.response,o.responseText=g.responseText,o.responseXML=g.responseXML,o.readyState=g.readyState,d.lastCallback){let b=await d.lastCallback(ot(o),u);o.response=b,o.responseText=JSON.stringify(b);}Object.defineProperties(this,{status:{get:()=>o.status},response:{get:()=>o.response},statusText:{get:()=>o.statusText},responseXML:{get:()=>o.responseXML},responseText:{get:()=>o.responseText},responseType:{get:()=>o.responseType},readyState:{get:()=>o.readyState}}),a&&a.call(s,i);}},g.send(v?.data)}}let m=ot(this);if(d.callback&&await d.callback(m),d.lastCallback){let f=await d.lastCallback(m,u);o.response=f,o.responseText=JSON.stringify(f),Object.defineProperties(this,{response:{get:()=>o.response},responseText:{get:()=>o.responseText}});}}a&&l&&a.call(this,i);},r(n)};}hijackFetch(){let e=this;j.fetch=async function(n,a){let r=typeof n=="string"?n:n instanceof URL?n.href:n.url,o=a&&a.method?a.method:"GET",s=n,c=a;for(let l of e.interceptConfigs)if(_(r,l.url)&&O(o,l.method)){if(l.beforeSendCallback){let d={url:rt(r),data:a?.body},u=await l.beforeSendCallback(d);u&&(u.url&&(s=u.url.toString()),u.data&&(c={...a,body:u.data}));}break}let i=await e.originalFetch.call(j,s,c);for(let l of e.interceptConfigs)if(_(i.url,l.url)&&O(o,l.method)){let d=await i.clone().text(),u;try{u=JSON.parse(d);}catch{u=d;}let m={url:rt(i.url),data:a?.body};if(l.callback&&await l.callback(u),l.lastCallback){let f=await l.lastCallback(u,m),v=typeof f=="string"?f:JSON.stringify(f);return new Response(v,{status:i.status,statusText:i.statusText,headers:i.headers})}}return i};}restore(){XMLHttpRequest.prototype.open=this.originalXHRopen,XMLHttpRequest.prototype.send=this.originalXHRsend,j.fetch=this.originalFetch;}};Yt.isHijacked=false;var Yn=Yt;function rt(t){return t.startsWith("/")?new URL(`${location.origin}${t}`):new URL(t)}function _(t,e){if(e instanceof RegExp)return e.test(t);try{let n=new URL(t),a=new URL(e);return n.host===a.host&&n.protocol===a.protocol&&n.pathname===a.pathname}catch{return  false}}function O(t,e){return t?.toLocaleLowerCase()===e?.toLocaleLowerCase()}function ot(t){return t.responseType==="json"?t.response:t.responseText}async function Kn(){if(!Jn())return;const{host:t}=z();new Yn([{method:"POST",url:`${t}/torrent/search`,lastCallback:Qn}]);}function Jn(){const{host:t}=location;return t.endsWith(".m-team.cc")}async function Qn(t){const e=typeof t=="string"?JSON.parse(t):t;if(e?.data?.data?.length){const n=qt(e.data.data);e.data.data=[],await Zn(n);const a=e?.data.totalPages;_n(n,a);}return e}async function Zn(t){if(!t?.length)return;const e=document.querySelector(".ant-spin-container tbody");if(!e)return;t.forEach(a=>{const r=Ft(a);Vt(r,e);}),setTimeout(()=>{const a=document.querySelector(".ant-spin-container>div>div.ant-empty");a&&(a.style.display="none");},100),setTimeout(()=>{Ot(t);},100);const n=document.createElement("style");n.textContent="body>div.ant-message.ant-message-top { display: none !important; }",document.head.appendChild(n),setTimeout(()=>{n.remove();},6e3);}Kn(),Zt([Xn,Ae]);

})();