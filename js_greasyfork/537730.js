// ==UserScript==
// @name        PT站M-Team的高贵樱花粉、云朵白主题
// @namespace   https://mteam-theme-sakura.github.io
// @description 非常高贵的 —— 又高又贵的 M-Team 主题，你问我为什么高贵？你猜猜？
// @license     WTFPL
// @supportURL  https://github.com/mteam-theme-sakura/theme/issues
// @version     2025530.153150
// @author      Dark495
// @icon        https://m-team.syzx.me/assets/img/wtf.png
// @match       https://kp.m-team.cc/*
// @match       https://xp.m-team.cc/*
// @match       https://zp.m-team.io/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537730/PT%E7%AB%99M-Team%E7%9A%84%E9%AB%98%E8%B4%B5%E6%A8%B1%E8%8A%B1%E7%B2%89%E3%80%81%E4%BA%91%E6%9C%B5%E7%99%BD%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/537730/PT%E7%AB%99M-Team%E7%9A%84%E9%AB%98%E8%B4%B5%E6%A8%B1%E8%8A%B1%E7%B2%89%E3%80%81%E4%BA%91%E6%9C%B5%E7%99%BD%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const themeStyle = `body[data-theme=sakura] {
  background: #fffbfa url("data:image/png;base64,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") repeat !important;
}
body[data-theme=sakura] *,
body[data-theme=sakura] ::before,
body[data-theme=sakura] ::after,
body[data-theme=sakura] :root {
  --bg-1: #fffbfa;
  --bg-2: rgba(255, 255, 255, 0.5);
  --bg-3: #faa9bd;
}
body[data-theme=sakura] .bg-mt-gray {
  background: rgba(255, 255, 255, 0.5);
}
body[data-theme=sakura] .bg-mt-primary-3 {
  background: white;
}
body[data-theme=sakura] .loader-container {
  background-color: #fffbfa;
}
body[data-theme=sakura] #app-content a[href="/index"] img[alt=LOGO] {
  filter: hue-rotate(293deg) brightness(110%);
}
body[data-theme=sakura] .ant-card {
  background: rgba(250, 169, 189, 0.05);
  backdrop-filter: blur(15px);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.05) !important;
}
body[data-theme=sakura] .ant-card .ant-card-head {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  border-bottom: 1px dashed rgba(233, 30, 99, 0.15) !important;
}
body[data-theme=sakura] .ant-card .ant-card-bordered {
  border: 1px solid #faa9bd !important;
}
body[data-theme=sakura] .ant-menu {
  border-bottom: 1px dashed !important;
  border-bottom-color: rgba(233, 30, 99, 0.5) !important;
}
body[data-theme=sakura] .ant-menu.ant-menu-sub, body[data-theme=sakura] .ant-menu.ant-menu-submenu {
  border-bottom: none !important;
}
body[data-theme=sakura] .ant-menu .ant-menu-submenu-selected,
body[data-theme=sakura] .ant-menu .ant-menu-item-selected,
body[data-theme=sakura] .ant-menu .ant-menu-item-active,
body[data-theme=sakura] .ant-menu .ant-menu-submenu-active {
  color: #e91e63 !important;
}
body[data-theme=sakura] .ant-menu .ant-menu-submenu-selected::after,
body[data-theme=sakura] .ant-menu .ant-menu-item-selected::after,
body[data-theme=sakura] .ant-menu .ant-menu-item-active::after,
body[data-theme=sakura] .ant-menu .ant-menu-submenu-active::after {
  border-bottom-color: rgba(233, 30, 99, 0.5) !important;
}
body[data-theme=sakura] .bg-\\[\\#2f4879\\],
body[data-theme=sakura] .ant-table-thead > tr > th,
body[data-theme=sakura] .colhead,
body[data-theme=sakura] table.tablist thead td {
  background: #faa9bd !important;
  color: white;
}
body[data-theme=sakura] .bg-\\[\\#bccad6\\],
body[data-theme=sakura] .ant-table {
  background: rgba(255, 255, 255, 0.8) !important;
}
body[data-theme=sakura] .ant-table-row:hover .ant-table-cell {
  background: rgba(0, 0, 0, 0.05) !important;
}
body[data-theme=sakura] .ant-table-placeholder,
body[data-theme=sakura] .ant-table-placeholder td {
  background: rgba(255, 255, 255, 0.8) !important;
}
body[data-theme=sakura] .ant-table-placeholder:hover,
body[data-theme=sakura] .ant-table-placeholder td:hover {
  background: rgba(0, 0, 0, 0.01) !important;
}
body[data-theme=sakura] .bg-sticky_normal {
  background: rgba(56, 189, 248, 0.3);
}
body[data-theme=sakura] .bg-sticky_top {
  background: rgba(255, 213, 142, 0.5);
}
body[data-theme=sakura] .ant-tag.mt-default {
  border: 1px solid rgba(0, 0, 0, 0.15);
  line-height: 12px;
}
body[data-theme=sakura] .ant-table-title {
  border: 1px solid #000 !important;
  border-bottom: none !important;
}
body[data-theme=sakura] .app-content__inner {
  padding-block: 0 !important;
}
body[data-theme=sakura] .app-content__inner > .mx-auto {
  margin: 0 !important;
}
body[data-theme=sakura] .app-content__inner::after {
  background: transparent !important;
}
body[data-theme=sakura] .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #e91e63 !important;
}
body[data-theme=sakura] .ant-tabs .ant-tabs-ink-bar {
  background: #e91e63 !important;
}
body[data-theme=sakura] .ant-tabs .ant-tabs-tab:hover {
  color: rgba(233, 30, 99, 0.5) !important;
}
body[data-theme=sakura] .ant-btn-color-primary {
  background: #faa9bd;
}
body[data-theme=sakura] .ant-btn-color-primary.ant-btn-background-ghost {
  background: transparent;
}
body[data-theme=sakura] .ant-btn-color-primary:hover {
  background: rgba(250, 169, 189, 0.5) !important;
}
body[data-theme=sakura] .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover,
body[data-theme=sakura] .ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover {
  color: #e91e63 !important;
  border-color: #faa9bd !important;
}
body[data-theme=sakura] .ant-input-outlined:hover {
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-input-outlined:focus,
body[data-theme=sakura] .ant-input-outlined:focus-within {
  box-shadow: 0 0 0 2px rgba(250, 169, 189, 0.33);
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-checkbox-checked .ant-checkbox-inner {
  background: #faa9bd;
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner {
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
  background: #faa9bd;
}
body[data-theme=sakura] .ant-switch.ant-switch-checked:not(.ant-switch-disabled) {
  background: #faa9bd;
}
body[data-theme=sakura] .ant-switch.ant-switch-checked:not(.ant-switch-disabled):hover {
  background: rgba(250, 169, 189, 0.5) !important;
}
body[data-theme=sakura] .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
  background: #faa9bd;
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-radio-wrapper:hover .ant-radio-wrapper,
body[data-theme=sakura] .ant-radio-wrapper:hover .ant-radio-inner {
  border-color: #faa9bd;
}
body[data-theme=sakura] .ant-checkbox-indeterminate .ant-checkbox-inner:after {
  background-color: #faa9bd;
}
body[data-theme=sakura] .ant-descriptions-item-label {
  color: black !important;
  font-weight: bolder !important;
}
body[data-theme=sakura] .ant-descriptions-item-content {
  color: black !important;
}
body[data-theme=sakura] .ant-spin .ant-spin-dot-holder {
  color: #faa9bd;
}
body[data-theme=sakura] .ant-modal .ant-modal-content {
  background: white !important;
}
body[data-theme=sakura] .ant-modal .ant-modal-header {
  background: transparent !important;
  border-bottom: 1px dashed rgba(233, 30, 99, 0.5) !important;
  padding-bottom: 8px;
}
body[data-theme=sakura] .slick-slider .bg-mt-primary-3 {
  background: #faa9bd;
}

body[data-theme=cloud] {
  background: #caced9 url("data:image/svg+xml,%EF%BB%BF%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 2000 1500'%3E%3Crect fill%3D'%23D5DDEA' width%3D'2000' height%3D'1500'%2F%3E%3Cdefs%3E%3CradialGradient id%3D'a' gradientUnits%3D'objectBoundingBox'%3E%3Cstop  offset%3D'0' stop-color%3D'%23FFFFFF'%2F%3E%3Cstop  offset%3D'1' stop-color%3D'%23D5DDEA'%2F%3E%3C%2FradialGradient%3E%3ClinearGradient id%3D'b' gradientUnits%3D'userSpaceOnUse' x1%3D'0' y1%3D'750' x2%3D'1550' y2%3D'750'%3E%3Cstop  offset%3D'0' stop-color%3D'%23eaeef5'%2F%3E%3Cstop  offset%3D'1' stop-color%3D'%23D5DDEA'%2F%3E%3C%2FlinearGradient%3E%3Cpath id%3D's' fill%3D'url(%23b)' d%3D'M1549.2 51.6c-5.4 99.1-20.2 197.6-44.2 293.6c-24.1 96-57.4 189.4-99.3 278.6c-41.9 89.2-92.4 174.1-150.3 253.3c-58 79.2-123.4 152.6-195.1 219c-71.7 66.4-149.6 125.8-232.2 177.2c-82.7 51.4-170.1 94.7-260.7 129.1c-90.6 34.4-184.4 60-279.5 76.3C192.6 1495 96.1 1502 0 1500c96.1-2.1 191.8-13.3 285.4-33.6c93.6-20.2 185-49.5 272.5-87.2c87.6-37.7 171.3-83.8 249.6-137.3c78.4-53.5 151.5-114.5 217.9-181.7c66.5-67.2 126.4-140.7 178.6-218.9c52.3-78.3 96.9-161.4 133-247.9c36.1-86.5 63.8-176.2 82.6-267.6c18.8-91.4 28.6-184.4 29.6-277.4c0.3-27.6 23.2-48.7 50.8-48.4s49.5 21.8 49.2 49.5c0 0.7 0 1.3-0.1 2L1549.2 51.6z'%2F%3E%3Cg id%3D'g'%3E%3Cuse href%3D'%23s' transform%3D'scale(0.12) rotate(60)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.2) rotate(10)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.25) rotate(40)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.3) rotate(-20)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.4) rotate(-30)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.5) rotate(20)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.6) rotate(60)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.7) rotate(10)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.835) rotate(-40)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(0.9) rotate(40)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(1.05) rotate(25)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(1.2) rotate(8)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(1.333) rotate(-60)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(1.45) rotate(-30)'%2F%3E%3Cuse href%3D'%23s' transform%3D'scale(1.6) rotate(10)'%2F%3E%3C%2Fg%3E%3C%2Fdefs%3E%3Cg  transform%3D'translate(120 0)'%3E%3Cg  transform%3D'translate(0 60)'%3E%3Ccircle fill%3D'url(%23a)' r%3D'3000'%2F%3E%3Cg opacity%3D'0.5'%3E%3Ccircle fill%3D'url(%23a)' r%3D'2000'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1800'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1700'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1651'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1450'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1250'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'1175'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'900'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'750'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'500'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'380'%2F%3E%3Ccircle fill%3D'url(%23a)' r%3D'250'%2F%3E%3C%2Fg%3E%3Cg  transform%3D'rotate(-18 0 0)'%3E%3Cuse href%3D'%23g' transform%3D'rotate(10)'%2F%3E%3Cuse href%3D'%23g' transform%3D'rotate(120)'%2F%3E%3Cuse href%3D'%23g' transform%3D'rotate(240)'%2F%3E%3C%2Fg%3E%3Ccircle fill-opacity%3D'0' fill%3D'url(%23a)' r%3D'3000'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E%0D") no-repeat fixed center/cover !important;
}
body[data-theme=cloud] *,
body[data-theme=cloud] ::before,
body[data-theme=cloud] ::after,
body[data-theme=cloud] :root {
  --bg-1: #fffbfa;
  --bg-2: rgba(255, 255, 255, 0.5);
  --bg-3: #409eff;
}
body[data-theme=cloud] .bg-mt-gray {
  background: rgba(255, 255, 255, 0.5);
}
body[data-theme=cloud] .bg-mt-primary-3 {
  background: white;
}
body[data-theme=cloud] .loader-container {
  background-color: #fffbfa;
}
body[data-theme=cloud] #app-content a[href="/index"] img[alt=LOGO] {
  filter: hue-rotate(293deg) brightness(110%);
}
body[data-theme=cloud] .ant-card {
  background: rgba(64, 158, 255, 0.05);
  backdrop-filter: blur(15px);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.05) !important;
}
body[data-theme=cloud] .ant-card .ant-card-head {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  border-bottom: 1px dashed rgba(64, 158, 255, 0.15) !important;
}
body[data-theme=cloud] .ant-card .ant-card-bordered {
  border: 1px solid #409eff !important;
}
body[data-theme=cloud] .ant-menu {
  border-bottom: 1px dashed !important;
  border-bottom-color: rgba(64, 158, 255, 0.5) !important;
}
body[data-theme=cloud] .ant-menu.ant-menu-sub, body[data-theme=cloud] .ant-menu.ant-menu-submenu {
  border-bottom: none !important;
}
body[data-theme=cloud] .ant-menu .ant-menu-submenu-selected,
body[data-theme=cloud] .ant-menu .ant-menu-item-selected,
body[data-theme=cloud] .ant-menu .ant-menu-item-active,
body[data-theme=cloud] .ant-menu .ant-menu-submenu-active {
  color: #409eff !important;
}
body[data-theme=cloud] .ant-menu .ant-menu-submenu-selected::after,
body[data-theme=cloud] .ant-menu .ant-menu-item-selected::after,
body[data-theme=cloud] .ant-menu .ant-menu-item-active::after,
body[data-theme=cloud] .ant-menu .ant-menu-submenu-active::after {
  border-bottom-color: rgba(64, 158, 255, 0.5) !important;
}
body[data-theme=cloud] .bg-\\[\\#2f4879\\],
body[data-theme=cloud] .ant-table-thead > tr > th,
body[data-theme=cloud] .colhead,
body[data-theme=cloud] table.tablist thead td {
  background: #409eff !important;
  color: white;
}
body[data-theme=cloud] .bg-\\[\\#bccad6\\],
body[data-theme=cloud] .ant-table {
  background: rgba(255, 255, 255, 0.8) !important;
}
body[data-theme=cloud] .ant-table-row:hover .ant-table-cell {
  background: rgba(0, 0, 0, 0.05) !important;
}
body[data-theme=cloud] .ant-table-placeholder,
body[data-theme=cloud] .ant-table-placeholder td {
  background: rgba(255, 255, 255, 0.8) !important;
}
body[data-theme=cloud] .ant-table-placeholder:hover,
body[data-theme=cloud] .ant-table-placeholder td:hover {
  background: rgba(0, 0, 0, 0.01) !important;
}
body[data-theme=cloud] .bg-sticky_normal {
  background: rgba(56, 189, 248, 0.3);
}
body[data-theme=cloud] .bg-sticky_top {
  background: rgba(255, 213, 142, 0.5);
}
body[data-theme=cloud] .ant-tag.mt-default {
  border: 1px solid rgba(0, 0, 0, 0.15);
  line-height: 12px;
}
body[data-theme=cloud] .ant-table-title {
  border: 1px solid #000 !important;
  border-bottom: none !important;
}
body[data-theme=cloud] .app-content__inner {
  padding-block: 0 !important;
}
body[data-theme=cloud] .app-content__inner > .mx-auto {
  margin: 0 !important;
}
body[data-theme=cloud] .app-content__inner::after {
  background: transparent !important;
}
body[data-theme=cloud] .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #409eff !important;
}
body[data-theme=cloud] .ant-tabs .ant-tabs-ink-bar {
  background: #409eff !important;
}
body[data-theme=cloud] .ant-tabs .ant-tabs-tab:hover {
  color: rgba(64, 158, 255, 0.5) !important;
}
body[data-theme=cloud] .ant-btn-color-primary {
  background: #409eff;
}
body[data-theme=cloud] .ant-btn-color-primary.ant-btn-background-ghost {
  background: transparent;
}
body[data-theme=cloud] .ant-btn-color-primary:hover {
  background: rgba(64, 158, 255, 0.5) !important;
}
body[data-theme=cloud] .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover,
body[data-theme=cloud] .ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover {
  color: #409eff !important;
  border-color: #409eff !important;
}
body[data-theme=cloud] .ant-input-outlined:hover {
  border-color: #409eff;
}
body[data-theme=cloud] .ant-input-outlined:focus,
body[data-theme=cloud] .ant-input-outlined:focus-within {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.33);
  border-color: #409eff;
}
body[data-theme=cloud] .ant-checkbox-checked .ant-checkbox-inner {
  background: #409eff;
  border-color: #409eff;
}
body[data-theme=cloud] .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner {
  border-color: #409eff;
}
body[data-theme=cloud] .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
  background: #409eff;
}
body[data-theme=cloud] .ant-switch.ant-switch-checked:not(.ant-switch-disabled) {
  background: #409eff;
}
body[data-theme=cloud] .ant-switch.ant-switch-checked:not(.ant-switch-disabled):hover {
  background: rgba(64, 158, 255, 0.5) !important;
}
body[data-theme=cloud] .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
  background: #409eff;
  border-color: #409eff;
}
body[data-theme=cloud] .ant-radio-wrapper:hover .ant-radio-wrapper,
body[data-theme=cloud] .ant-radio-wrapper:hover .ant-radio-inner {
  border-color: #409eff;
}
body[data-theme=cloud] .ant-checkbox-indeterminate .ant-checkbox-inner:after {
  background-color: #409eff;
}
body[data-theme=cloud] .ant-descriptions-item-label {
  color: black !important;
  font-weight: bolder !important;
}
body[data-theme=cloud] .ant-descriptions-item-content {
  color: black !important;
}
body[data-theme=cloud] .ant-spin .ant-spin-dot-holder {
  color: #409eff;
}
body[data-theme=cloud] .ant-modal .ant-modal-content {
  background: white !important;
}
body[data-theme=cloud] .ant-modal .ant-modal-header {
  background: transparent !important;
  border-bottom: 1px dashed rgba(64, 158, 255, 0.5) !important;
  padding-bottom: 8px;
}
body[data-theme=cloud] .slick-slider .bg-mt-primary-3 {
  background: #409eff;
}
body[data-theme=cloud] .bg-mt-gray {
  background: rgba(0, 0, 0, 0.05);
}
body[data-theme=cloud] #app-content a[href="/index"] img[alt=LOGO] {
  filter: hue-rotate(161deg) brightness(98%);
}
body[data-theme=cloud] .bg-\\[\\#2f4879\\],
body[data-theme=cloud] .ant-table-thead > tr > th,
body[data-theme=cloud] .colhead,
body[data-theme=cloud] table.tablist thead td {
  background: rgba(102, 204, 255, 0.5) !important;
  color: black !important;
}
body[data-theme=cloud] .ant-card {
  backdrop-filter: none;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 19px rgba(0, 0, 0, 0.03) !important;
}
body[data-theme=cloud] .bg-\\[\\#bccad6\\],
body[data-theme=cloud] .ant-table {
  background: rgba(255, 255, 255, 0.6) !important;
}
body[data-theme=cloud] .editor-container {
  border: 1px solid #d9d9d9;
}`;
  const waitForElement = (selector, timeout = 5e3) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - start > timeout) return reject(new Error("Timeout"));
        requestAnimationFrame(check);
      };
      check();
    });
  };
  waitForElement('img[alt="LOGO"]').then((el) => {
    const nextDiv = el?.parentElement?.nextElementSibling;
    if (nextDiv && nextDiv.tagName === "DIV") {
      const select = document.createElement("select");
      select.style.background = "transparent";
      select.style.border = "none";
      select.style.color = "rgb(0, 0, 0)";
      select.style.fontSize = "16px";
      select.style.padding = "3px";
      select.style.outline = "none";
      select.style.display = "inline-block";
      select.style.position = "relative";
      select.style.top = "2px";
      const options = {
        default: "\u9ED8\u8BA4\u84DD",
        sakura: "\u6A31\u82B1\u7C89",
        cloud: "\u4E91\u6735\u767D"
      };
      const optionsEl = Object.entries(options).map(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        return option;
      });
      select.append(...optionsEl);
      nextDiv.insertBefore(select, nextDiv.childNodes[0]);
      select.addEventListener("change", () => {
        document.body.setAttribute("data-theme", select.value);
        localStorage.setItem("mteam-theme", select.value);
      });
      select.value = localStorage.getItem("mteam-theme") || "default";
    }
  });
  waitForElement("body").then(() => {
    document.body.setAttribute("data-theme", localStorage.getItem("mteam-theme") || "default");
  });
  GM_addStyle(themeStyle);
})();
