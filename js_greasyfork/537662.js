// ==UserScript==
// @name         粉色+夜间模式的馒头站主题
// @namespace    https://greasyfork.org/users/1250762
// @version    0.4.7
// @description  将馒头站主题配色改为粉色系+黑色系，提升阅读体验。本脚本基于原作者 lionhoho 的“馒头配色调整系列-沙色”脚本进行修改。
// @author       L4O8(修改者), lionhoho (原作者)
// @license      GPL-2.0
// @match        https://*.m-team.cc/*
// @match        https://*.m-team.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/537662/%E7%B2%89%E8%89%B2%2B%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E7%9A%84%E9%A6%92%E5%A4%B4%E7%AB%99%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/537662/%E7%B2%89%E8%89%B2%2B%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E7%9A%84%E9%A6%92%E5%A4%B4%E7%AB%99%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const STORAGE_KEY = 'mt_theme_mode';
    const MODE_PINK = 'pink';
    const MODE_DARK = 'dark';

    // 根据域名返回对应的样式参数
    function getStylesByDomain(mode) {
        const hostname = window.location.hostname;
        const isNextDomain = /next\.m-team\.cc/i.test(hostname);

        if (mode === MODE_PINK) {
            return isNextDomain ?
                `html {--bg-1:#ffffff !important;}
				div.flex.justify-between.items-center.bg-white {position:fixed !important; top:0 !important; left:0; right:0; z-index:9999 !important; background-color:#fcf0f6 !important;}
                body {padding-top:55px;}
                /* 置顶综合栏/搜索栏 */
                div[class="px-\\[40px\\]"] { background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;height: 67px !important; }
                /* 个人信息栏 */
                /* 首页设置-开始*/
                div[class=ant-card-head] { background-color:#f4b6d6 !important; margin-left: -0px !important; margin-right: -0px !important; padding-left: 15px !important;padding-right: 15px !important;}
                div[class=ant-card-head-title] {transform: translateX(15px) !important;}
                /* 卡片标题  */
                div.ant-card { background-color: transparent !important; }
                div.ant-card-body { background-color: rgba(252, 240, 246, 0.6) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                /* 免责声明 */
                p.mb-0.text-\\[\\#413D38\\].leading-\\[1\\.57\\] { color: #000 !important;}
                /*首页设置-结束*/
                /*论坛设置-开始*/
                /*论坛主页*/
                div.app-content__inner {transform: translateY(15px) !important;}
                div.mx-auto.w-full:has(div.ant-table-wrapper) {border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                div.mx-auto.w-full:has(div.ant-table-wrapper) h2.ant-typography {padding-top: 7px !important;padding-bottom: 7px !important; border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;!important;background-color: #f4b6d6 !important;position: relative !important;z-index: 1 !important;padding-left: 15px !important;padding-right: 15px !important;}
                div.mx-auto.w-full ant-input-group-wrapper.ant-input-group-wrapper-outlined.css-5tmopf.ant-input-search.w-full.mt-search-input.my-5 {background-color: #f4b6d6 !important}
                /*帖子*/
                div.mx-auto.w-full:has(div.flex.justify-between.py-5.items-center) {border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                div.flex.justify-between.py-5.items-center {position: relative !important;transform;padding-bottom: -200px !important;background-color: transparent !important;background-color: #f4b6d6 !important;border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;}
                div.ant-col.p-3.bg-white.css-5tmopf {background-color:#faf0f6 !important;}
                div.ant-row.ant-row-space-between.sticky {background-color:#faf0f6 !important;position: static !important;}
                /*论坛设置-结束*/
                /*种子页面-开始*/
                div.mx-auto.w-full:has(div.ant-spin-nested-loading) {border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                div.mx-auto.w-full:has(div.ant-dividerg) {padding-left: 15px !important;padding-right: 15px !important;border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                span.ant-btn-icon span[role="img"][style*="color: gold"] {color: gold !important;}
                span.ant-btn-icon span[role="img"]:not([style*="color: gold"]) {color: #888 !important;}
                /*种子详细页面*/
                div.absolute.top-0 {background-image: none !important;background-color: transparent !important;background: none !important;backdrop-filter: none !important;}
                a.text-white {color: #000 !important;}
                span.text- {color: #000 !important;}
                span.ant-tag.mt-default {color: #000 !important;}
                div.ant-typography.ant-typography-ellipsis.leading-normal {color: #000 !important;}
                span,ant-typography {color: #000 !important;}
                div.mx-auto.w-full:has(div.flex.py-5.mb-5.border-0.border-b.border-solid) {padding-left: 15px !important;padding-right: 15px !important;border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                div.mx-auto.w-full div.flex.py-5.mb-5.border-0.border-b.border-solid {background-color: transparent !important;border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;position: relative;}
                /*种子页面-结束*/
                /*求种详细页面*/
                div.app-content__inner div.mx-auto.w-full:has(div.sticky.top-0.bg-mt-primary-2) {border-radius: 8px !important;background-color: rgba(252, 240, 246, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;padding-left: 15px !important;padding-right: 15px !important;}
                div.sticky.top-0.bg-mt-primary-2 {background-color: transparent !important;position: static !important;}
                div.sticky.top-0.bg-mt-primary-2 .* {position: static !important;}
                ` :
            `html {--bg-1:#ffffff !important;}
				.app-content__inner:after {background:rgba(248,216,230,0.5)!important; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);}
                .ant-card.ant-card-small.css-khj4yb .ant-card-body {background:rgba(255,255,255,0.5)!important; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.2);}
                :where(.css-1gwm2nm).ant-card {background:rgba(255,214,231,0.50)!important; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(0,0,0,0.1);}
				:where(.css-1gwm2nm) a:hover {color:#ff4fa3 !important;}
				:where(.css-1gwm2nm) a:active {color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {background-color:#ff9ecb !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-open::after {border-bottom-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected::after {border-bottom-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-submenu-popup>.ant-menu, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu {background-color:#ffeef6 !important;}
				:where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {background-color:#ffc2e0 !important;}
				:where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {color:#ff4fa3 !important;}
				.ant-table-wrapper .ant-table-tbody .ant-table-row .ant-table-cell.ant-table-cell-row-hover, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover .ant-table-cell, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover>th, .ant-table-wrapper .ant-table-tbody .ant-table-row>th.ant-table-cell-row-hover {background:#ffeff6 !important;}
				.bg-sticky_top {background-color:#ffddee !important;}
				.bg-sticky_normal {background-color:#ffeff6 !important;}
				:where(.css-khj4yb).ant-card.ant-card-small {background-color: #F8D8E6 !important;}
				.ant-card-head { background-color: #FFB3D8 !important; color: white !important; }
				.ant-card-body { background-color: #ffeff6 !important; color: white !important; }
				.ant-card-body [style*= "text-align: center"] {color: #000 !important; }
				.ant-card-body [style*= "font-size: 12px;"] {color: #000 !important; }
				.ant-card-body [style*= "min-height: 100px; margin-top: 30px;"] {color: #000 !important; }
				.mb-0 {color: #000 !important; }
				.ant-table-cell { background-color: #FCF0F6 !important; }
				.bg-\\[\\#2f4879\\] .border.border-solid.border-black.p-2 { background-color: rgb(244,182,214) !important; }
				.bg-sticky_top .border.border-solid.border-black.p-2 { background-color: rgb(249,222,237) !important; }
				.border.border-solid.border-black.p-2:not(.bg-\\[\\#2f4879\\] .border.border-solid.border-black.p-2):not(.bg-sticky_top .border.border-solid.border-black.p-2) { background-color: rgb(252,240,246) !important; }
				.mt-4.app-content__inner .ant-card-body .ant-card-head-wrapper .ant-card-head-title { color: #000 !important; }
				.mt-4.app-content__inner .ant-card-body .mb-4 { color: #000 !important; }
				.ant-card.css-khj4yb .ant-card-body .ant-card.ant-card-bordered.ant-card-small.css-khj4yb .ant-card-body { color: #666 !important; }
				.mt-4.app-content__inner .ant-card-body .tablist.mb-3 * { color: #000 !important; }
				:where(.css-1gwm2nm).ant-card .ant-card-head {background:#ffc2e0 !important;}
				.ant-table-wrapper .ant-table-thead th.ant-table-column-sort {background:#ffc2e0 !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table {background:#fff9fc !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table-thead >tr>th {background:#ffc2e0 !important;}
				:where(.css-1gwm2nm).ant-btn-primary.ant-btn-background-ghost {border-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {background-color:#ff9ecb !important;}
				:where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {border-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner, :where(.css-1gwm2nm).ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {border-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-checkbox-indeterminate .ant-checkbox-inner:after {background-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {background-color:#ffc2e0 !important;}
				:where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu, :where(.css-1gwm2nm).ant-dropdown-menu-submenu .ant-dropdown-menu {background-color:#fff9fc !important;}
				:where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover {background-color:#ffc2e0 !important;}
				:where(.css-1cv09li).ant-table-wrapper .ant-table-thead >tr>th {background:#ffc2e0 !important;}
				:where(.css-1cv09li).ant-table-wrapper .ant-table {background:#ffffff !important;}
				:where(.css-1gwm2nm).ant-modal .ant-modal-content {background-color:#fff9fc !important;}
				:where(.css-1gwm2nm).ant-modal .ant-modal-header {background-color:#fff9fc !important;}
				:where(.css-1gwm2nm).ant-btn-primary {background:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {color:#ffffff !important;}
				.editor-inner {background:#ffffff !important;}
				.bg-mt-gray {background-color:#ffffff !important;}
				:where(.css-1gwm2nm).ant-btn-link {color:#ff4fa3 !important;}
				.ant-descriptions.mt-desc-with-bg.ant-descriptions-bordered .ant-descriptions-view {background:#ffddee !important;}
				.bg-mt-primary-3 {background-color:#ffd6e7 !important;}
				:where(.css-1gwm2nm).ant-table-wrapper tr.ant-table-expanded-row >td {background:#ffddee !important;}
				:where(.css-1gwm2nm).ant-input-group-wrapper-outlined .ant-input-group-addon {background:#ffeff6 !important;}
				:where(.css-1gwm2nm).ant-row-middle .ant-row {background-color:#ffd6e7 !important;}
				:where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {background-color:#ff4fa3 !important;}
				:where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {color:#ffffff !important;}
				:where(.css-1fsd2gv).ant-segmented {background:#fff9fc !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {background-color:#ffc2e0 !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {color:#000000 !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {font-size: larger; !important;}
				:where(.css-1gwm2nm).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-tabs .ant-tabs-tab {color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {background-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {background:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {color:#ffffff !important;}
				:where(.css-1gwm2nm).ant-switch.ant-switch-checked {background:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-btn-default {background-color:#ffffff !important;}
				:where(.css-1gwm2nm).ant-btn-default {border-color:#ff4fa3 !important;}
				:where(.css-1gwm2nm).ant-alert-info {background: #fff9fc !important;}
				:where(.css-1gwm2nm).ant-alert-info {border: 1px solid #ff4fa3 !important;}
				.colhead  {background: #ffc2e0 !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder {background:#ffeff6 !important;}
`;
        } else {
            return isNextDomain ?
                `html {--bg-1:#0D1021 !important;}
                 div.flex.justify-between.items-center.bg-white {position:fixed !important; top:0 !important; left:0; right:0; z-index:9999 !important; background-color:rgba(13, 16, 33, 0.9) !important;}
                 body {padding-top:55px; background-color:#0D1021 !important; color:#B5C2D9 !important;}
                 div[class="px-\\[40px\\]"] { background-color: rgba(13, 16, 33, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;height: 67px !important; }
                 div[class=ant-card-head] { background-color:#4A3F6B !important; margin-left: -0px !important; margin-right: -0px !important; padding-left: 15px !important;padding-right: 15px !important;}
                 div[class=ant-card-head-title] {transform: translateX(15px) !important; color:#B5C2D9 !important;}
                 div.ant-card { background-color: transparent !important; }
                 div.ant-card-body { background-color: rgba(13, 16, 33, 0.6) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important; color:#B5C2D9 !important;}
                 p.mb-0.text-\\[\\#413D38\\].leading-\\[1\\.57\\] { color: #B5C2D9 !important;}
                 div.app-content__inner {transform: translateY(15px) !important;}
                 div.mx-auto.w-full:has(div.ant-table-wrapper) {border-radius: 8px !important;background-color: rgba(13, 16, 33, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;padding-left: 15px !important;padding-right: 15px !important;}
                 div.mx-auto.w-full:has(div.ant-table-wrapper) h2.ant-typography {padding-top: 7px !important;padding-bottom: 7px !important; border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;!important;background-color: #4A3F6B !important;position: relative !important;z-index: 1 !important; color:#B5C2D9 !important;}
                 div.mx-auto.w-full:has(div.ant-table-wrapper) ant-input-group-wrapper.ant-input-group-wrapper-outlined.css-5tmopf.ant-input-search.w-full.mt-search-input.my-5 {background-color: #4A3F6B !important}
                 div.mx-auto.w-full:has(div.flex.justify-between.py-5.items-center) {border-radius: 8px !important;background-color: rgba(13, 16, 33, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                 div.flex.justify-between.py-5.items-center {position: relative !important;transform;padding-bottom: -200px !important;background-color: transparent !important;background-color: #4A3F6B !important;border-top-left-radius: 8px !important; border-top-right-radius: 8px !important; color:#B5C2D9 !important;}
                 div.ant-col.p-3.bg-white.css-5tmopf {background-color:rgba(13, 16, 33, 0.7) !important;}
                 div.ant-row.ant-row-space-between.sticky {background-color:rgba(13, 16, 33, 0.7) !important;position: static !important;}
                 div.mx-auto.w-full:has(div.ant-spin-nested-loading) {background-color: rgba(13, 16, 33, 0.7) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                 span.ant-btn-icon span[role="img"][style*="color: gold"] {color: gold !important;}
                 span.ant-btn-icon span[role="img"]:not([style*="color: gold"]) {color: #B5C2D9 !important;}
                 div.absolute.top-0 {background-image: none !important;background-color: transparent !important;background: none !important;backdrop-filter: none !important;}
                 a.text-white {color: #B5C2D9 !important;}
                 span.text- {color: #B5C2D9 !important;}
                 span.ant-tag.mt-default {color: #B5C2D9 !important;}
                 div.ant-typography.ant-typography-ellipsis.leading-normal {color: #B5C2D9 !important;}
                 span,ant-typography {color: #B5C2D9 !important;}
                 div.mx-auto.w-full:has(div.flex.py-5.mb-5.border-0.border-b.border-solid) {padding-left: 15px !important;padding-right: 15px !important;border-radius: 8px !important;background-color: rgba(13, 16, 33, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;}
                 div.mx-auto.w-full div.flex.py-5.mb-5.border-0.border-b.border-solid {background-color: transparent !important;border-top-left-radius: 8px !important; border-top-right-radius: 8px !important;position: relative;}
                 div.mx-auto.w-full:has(div.p-5.mb-5.relative) {border-radius: 8px !important;background-color: rgba(13, 16, 33, 0.8) !important; backdrop-filter: blur(10px) saturate(180%) !important; -webkit-backdrop-filter: blur(10px) saturate(180%) !important;padding-left: 15px !important;padding-right: 15px !important;}
                 div.sticky.top-0.bg-mt-primary-2 {background-color: transparent !important;position: static !important;}
                 div.sticky.top-0.bg-mt-primary-2 .* {position: static !important;}
                 /*字体设置*/
                 div.ant-row.ant-form-item-row {background-color: #B5C2D9 !important;}
                 div.toolbar.flex.justify-between {background-color: transparent !important;}
                 div.editor-inner {background-color: transparent !important;}
                 a.text-black {color:#B7C2D7 !important;}
                 th.ant-table-cell {color:#B7C2D7 !important;}
                 div.bg-white.rounded-xl.p-5 {background-color: transparent !important;}

                 ` :
            `html {--bg-1:#121212 !important;}
				.app-content__inner:after {background:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-card {background:#1a3a5f !important;}
				:where(.css-1gwm2nm) a:hover {color:#4fd1ff !important;}
				:where(.css-1gwm2nm) a:active {color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {background-color:#2a4a6f !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-open::after {border-bottom-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected::after {border-bottom-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-menu-light.ant-menu-submenu-popup>.ant-menu, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu {background-color:#252540 !important;}
				:where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {background-color:#303050 !important;}
				:where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {color:#4fd1ff !important;}
				.ant-table-wrapper .ant-table-tbody .ant-table-row .ant-table-cell.ant-table-cell-row-hover, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover .ant-table-cell, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover>th, .ant-table-wrapper .ant-table-tbody .ant-table-row>th.ant-table-cell-row-hover {background:#2a2a2a !important;}
				.bg-sticky_top {background-color:#2a3a5a !important;}
				.bg-sticky_normal {background-color:#1e2a3f !important;}
				:where(.css-khj4yb).ant-card.ant-card-small {background-color: #1a2a4a !important;}
				.ant-card-head { background-color: #1a3a5f !important; color: #e0e0e0 !important; }
				.ant-card-body { background-color: #252535 !important; color: #e0e0e0 !important; }
				.ant-card-body [style*= "text-align: center"] {color: #e0e0e0 !important; }
				.ant-card-body [style*= "font-size: 12px;"] {color: #e0e0e0 !important; }
				.ant-card-body [style*= "min-height: 100px; margin-top: 30px;"] {color: #e0e0e0 !important; }
				.mb-0 {color: #e0e0e0 !important; }
				.ant-table-cell { background-color: #1e1e2d !important; }
				.bg-\\[\\#2f4879\\] .border.border-solid.border-black.p-2 { background-color: #2a3a5a !important; }
				.bg-sticky_top .border.border-solid.border-black.p-2 { background-color: #2a3a5a !important; }
				.border.border-solid.border-black.p-2:not(.bg-\\[\\#2f4879\\] .border.border-solid.border-black.p-2):not(.bg-sticky_top .border.border-solid.border-black.p-2) { background-color: #252535 !important; }
				.ant-card-body .ant-row.ant-row-space-between.ant-row-middle.mt-2.text-sm.css-khj4yb .ant-col.css-khj4yb .ant-space.css-khj4yb.ant-space-horizontal.ant-space-align-center .ant-space-item * *:not(.text-mt-light-blue) {color:#80A0FF !important}
				.ant-card-body .ant-row.ant-row-space-between.ant-row-middle.mt-2.text-sm.css-khj4yb .ant-col.css-khj4yb .ant-space.css-khj4yb.ant-space-horizontal.ant-space-align-center .ant-space-item .ant-typography.whitespace-nowrap.css-khj4yb {color:#CCCCDD!important}
				.ant-card.ant-card-small.css-khj4yb .ant-card-body .ant-menu-overflow.ant-menu.ant-menu-root.ant-menu-horizontal.ant-menu-light.css-khj4yb .ant-menu-title-content .font-medium {color: #CCCCDD !important;}
				.ant-card-body .ant-row.ant-row-space-between.ant-row-middle.css-khj4yb .ant-col.css-khj4yb .ant-space.css-khj4yb.ant-space-horizontal.ant-space-align-center.ant-space-gap-row-small.ant-space-gap-col-small .ant-space-item .ant-typography.css-khj4yb{color: #CCCCDD !important}
				.slick-track .slick-slide.slick-active.slick-current * *{color:#000!important;}
				.ant-collapse-content-box .p-4.bg-mt-gray .whitespace-pre-wrap.mb-1{color:#000!important;}
				.ant-card-body a[href^="/forum/"] {color: #80A0FF !important;}
				.ant-card-body h2 {color: #CCCCDD !important;}
				.mb-0 a[href^="/redirect/topic"] {color: #AAAAAA !important;}
				.markdown-body .mb-1 {color: #AAAAAA !important;}
				.tablist .ant-typography {color: #AAAAAA !important;}
				.mt-4.app-content__inner .ant-card-body .ant-card-head-wrapper .ant-card-head-title { color: #e0e0e0 !important; }
				.mt-4.app-content__inner .ant-card-body .mb-4 { color: #e0e0e0 !important; }
				.ant-card-body .mb-4 * { background-color: #3B3B4F !important; }
				.ant-card.css-khj4yb .ant-card-body .ant-card.ant-card-bordered.ant-card-small.css-khj4yb .ant-card-body { color: #d0d0d0 !important; }
				.mt-4.app-content__inner .ant-card-body .tablist.mb-3 * { color: #e0e0e0 !important; }
				:where(.css-1gwm2nm).ant-card .ant-card-head {background:#1a3a5f !important;}
				.ant-table-wrapper .ant-table-thead th.ant-table-column-sort {background:#1a3a5f !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table {background:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table-thead >tr>th {background:#1a3a5f !important;}
				:where(.css-1gwm2nm).ant-btn-primary.ant-btn-background-ghost {border-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {background-color:#2a4a6f !important;}
				:where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {border-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner, :where(.css-1gwm2nm).ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {border-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-checkbox-indeterminate .ant-checkbox-inner:after {background-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {background-color:#2a3a5a !important;}
				:where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu, :where(.css-1gwm2nm).ant-dropdown-menu-submenu .ant-dropdown-menu {background-color:#252540 !important;}
				:where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover {background-color:#303050 !important;}
				:where(.css-1cv09li).ant-table-wrapper .ant-table-thead >tr>th {background:#1a3a5f !important;}
				:where(.css-1cv09li).ant-table-wrapper .ant-table {background:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-modal .ant-modal-content {background-color:#252540 !important;}
				:where(.css-1gwm2nm).ant-modal .ant-modal-header {background-color:#252540 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {background:#1a6aa9 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {color:#ffffff !important;}
				.editor-inner {background:#1e1e2d !important;}
				.bg-mt-gray {background-color:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-btn-link {color:#4fd1ff !important;}
				.ant-descriptions.mt-desc-with-bg.ant-descriptions-bordered .ant-descriptions-view {background:#1a3a5f !important;}
				.bg-mt-primary-3 {background-color:#1a3a5f !important;}
				:where(.css-1gwm2nm).ant-table-wrapper tr.ant-table-expanded-row >td {background:#252540 !important;}
				:where(.css-1gwm2nm).ant-input-group-wrapper-outlined .ant-input-group-addon {background:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-row-middle .ant-row {background-color:#1a3a5f !important;}
				:where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {background-color:#1a6aa9 !important;}
				:where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {color:#ffffff !important;}
				:where(.css-1fsd2gv).ant-segmented {background:#1e1e2d !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {background-color:#1a3a5f !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {color:#e0e0e0 !important;}
				table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {font-size: larger; !important;}
				:where(.css-1gwm2nm).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-tabs .ant-tabs-tab {color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {background-color:#1a6aa9 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {background:#1a6aa9 !important;}
				:where(.css-1gwm2nm).ant-btn-primary {color:#ffffff !important;}
				:where(.css-1gwm2nm).ant-switch.ant-switch-checked {background:#1a6aa9 !important;}
				:where(.css-1gwm2nm).ant-btn-default {background-color:#1e1e2d !important;}
				:where(.css-1gwm2nm).ant-btn-default {border-color:#4fd1ff !important;}
				:where(.css-1gwm2nm).ant-alert-info {background: #252540 !important;}
				:where(.css-1gwm2nm).ant-alert-info {border: 1px solid #1a6aa9 !important;}
				.colhead  {background: #1a3a5f !important;}
				:where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder {background:#2a2a2a !important;}
`;
        }
    }

    function createBackground() {
        const bgOverlay = document.createElement('div');
        Object.assign(bgOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '-9999',
            pointerEvents: 'none'
        });
        document.body.appendChild(bgOverlay);
        document.body.style.minHeight = '100vh';
        return bgOverlay;
    }
    function createModeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'mt-theme-toggle';
        toggleButton.textContent = '';
        Object.assign(toggleButton.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: '10000',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
        });

        document.body.appendChild(toggleButton);
        return toggleButton;
    }

    function applyPinkMode(bgOverlay) {
        bgOverlay.style.backgroundColor = "#B7C2D7";
        bgOverlay.style.background = "url('https://i.miji.bid/2025/05/30/470b465837a479bb869e3c16cf83de03.jpeg') center/cover no-repeat";

        const darkStyle = document.getElementById('mt-dark-style');
        if (darkStyle) darkStyle.remove();

        if (!document.getElementById('mt-pink-style')) {
            const style = document.createElement('style');
            style.id = 'mt-pink-style';
            style.textContent = getStylesByDomain(MODE_PINK);
            document.head.appendChild(style);
        }
    }

    function applyDarkMode(bgOverlay) {
        bgOverlay.style.background = 'none';
        document.body.style.background = '#121212';

        const pinkStyle = document.getElementById('mt-pink-style');
        if (pinkStyle) pinkStyle.remove();

        if (!document.getElementById('mt-dark-style')) {
            const style = document.createElement('style');
            style.id = 'mt-dark-style';
            // 关键修改：根据域名获取不同样式
            style.textContent = getStylesByDomain(MODE_DARK);
            document.head.appendChild(style);
        }
    }

    function init() {
        const bgOverlay = createBackground();
        const toggleButton = createModeToggle();

        // 从存储获取当前模式，默认为粉色模式
        const currentMode = GM_getValue(STORAGE_KEY, MODE_PINK);

        // 应用初始模式
        if (currentMode === MODE_PINK) {
            applyPinkMode(bgOverlay);
            toggleButton.textContent = '🌸';
            toggleButton.style.background = '#ff4fa3';
            toggleButton.style.color = '#fff';
        } else {
            applyDarkMode(bgOverlay);
            toggleButton.textContent = '🌙';
            toggleButton.style.background = '#6200ea';
            toggleButton.style.color = '#fff';
        }

        // 添加切换事件
        toggleButton.addEventListener('click', () => {
            const newMode = toggleButton.textContent === '🌸' ? MODE_DARK : MODE_PINK;

            if (newMode === MODE_PINK) {
                applyPinkMode(bgOverlay);
                toggleButton.textContent = '🌸';
                toggleButton.style.background = '#ff4fa3';
                toggleButton.style.color = '#fff';
            } else {
                applyDarkMode(bgOverlay);
                toggleButton.textContent = '🌙';
                toggleButton.style.background = '#6200ea';
                toggleButton.style.color = '#fff';
            }

            // 保存模式选择
            GM_setValue(STORAGE_KEY, newMode);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();