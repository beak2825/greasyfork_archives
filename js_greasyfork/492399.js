// ==UserScript==
// @name         馒头配色调整系列-沙色
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  馒头暖色调沙色
// @author       lionhoho
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @match        https://*.m-team.cc/*
// @match        https://*.m-team.io/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-2.0

// @downloadURL https://update.greasyfork.org/scripts/492399/%E9%A6%92%E5%A4%B4%E9%85%8D%E8%89%B2%E8%B0%83%E6%95%B4%E7%B3%BB%E5%88%97-%E6%B2%99%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/492399/%E9%A6%92%E5%A4%B4%E9%85%8D%E8%89%B2%E8%B0%83%E6%95%B4%E7%B3%BB%E5%88%97-%E6%B2%99%E8%89%B2.meta.js
// ==/UserScript==


let weburl=unsafeWindow.location.href
if(weburl.indexOf('m-team.cc')!=-1)
{
   // 页面背景
   GM_addStyle('html {--bg-1:#F6F2E8 !important;}')

   // 中层背景
   GM_addStyle('.app-content__inner:after {background:#00000007 !important;}')

   // 导航背景
   GM_addStyle(':where(.css-1gwm2nm).ant-card {background:#ede4d0 !important;}')

   // 导航悬停
   GM_addStyle(':where(.css-1gwm2nm) a:hover {color:#fff1e1 !important;}')

   // 导航激活
   GM_addStyle(':where(.css-1gwm2nm) a:active {color:#fff1e1 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {color:#fffbf7 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected {background-color:#ac8860 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu:hover::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-active::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-open::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-open::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-open::after {border-bottom-color:#7f5d3e !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected::after, :where(.css-1gwm2nm).ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected::after, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected::after {border-bottom-color:#7f5d3e !important;}')

   // 导航下拉菜单
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light.ant-menu-submenu-popup>.ant-menu, :where(.css-1gwm2nm).ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu {background-color:#f9f1dd !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {background-color:#dfba87 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-menu-light .ant-menu-item-selected, :where(.css-1gwm2nm).ant-menu-light>.ant-menu .ant-menu-item-selected {color:#fffbf7 !important;}')

   // 种子列表悬停
   GM_addStyle('.ant-table-wrapper .ant-table-tbody .ant-table-row .ant-table-cell.ant-table-cell-row-hover, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover .ant-table-cell, .ant-table-wrapper .ant-table-tbody .ant-table-row:hover>th, .ant-table-wrapper .ant-table-tbody .ant-table-row>th.ant-table-cell-row-hover {background:#e7d2af !important;}')

   // 种子列表置顶背景
   GM_addStyle('.bg-sticky_top {background-color:rgb(246 226 189) !important;}')
   GM_addStyle('.bg-sticky_normal {background-color:#fff6d29e !important;}')

   // 种子列表
   GM_addStyle(':where(.css-1gwm2nm).ant-card .ant-card-head {background:#dfba87 !important;}')
   GM_addStyle('.ant-table-wrapper .ant-table-thead th.ant-table-column-sort {background:#dfba87 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-table-wrapper .ant-table {background:#fff7ea9e !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-table-wrapper .ant-table-thead >tr>th {background:#dfba87 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary.ant-btn-background-ghost {border-color:#7f5d3f !important;}')
   //GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary.ant-btn-background-ghost {background:#7f5d3f !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {background-color:#ad8861 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-checkbox-checked .ant-checkbox-inner {border-color:#7f5d3f !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner, :where(.css-1gwm2nm).ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {border-color:#7f5d3f !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-checkbox-indeterminate .ant-checkbox-inner:after {background-color:#7f5d3f !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {background-color:#dfba87 !important;}')

   // 种子详情
   GM_addStyle(':where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu, :where(.css-1gwm2nm).ant-dropdown-menu-submenu .ant-dropdown-menu {background-color:#f8f0e9 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover {background-color:#dfba87 !important;}')

   //论坛大标题背景
   GM_addStyle(':where(.css-1cv09li).ant-table-wrapper .ant-table-thead >tr>th {background:#dfba87 !important;}')

    //论坛分区背景
   GM_addStyle(':where(.css-1cv09li).ant-table-wrapper .ant-table {background:#fff7ea9e !important;}')

    //论坛引用回复
   GM_addStyle(':where(.css-1gwm2nm).ant-modal .ant-modal-content {background-color:#eee4d0 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-modal .ant-modal-header {background-color:#eee4d0 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary {background:#ad8861 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary {color:#fff1e1 !important;}')

   // 编辑器
   GM_addStyle('.editor-inner {background:#fffcf9 !important;}')

   // 详情页背景
   GM_addStyle('.bg-mt-gray {background-color:rgb(248 240 233) !important;}')

   // 详情页展开剩余
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-link {color:#7e4506 !important;}')

   // 首页站点数据
   GM_addStyle('.ant-descriptions.mt-desc-with-bg.ant-descriptions-bordered .ant-descriptions-view {background:#e7d4bb !important;}')

   // 瀑布流卡片
   GM_addStyle('.bg-mt-primary-3 {background-color:#dcd1ba !important;}')

   //演员
   GM_addStyle(':where(.css-1gwm2nm).ant-table-wrapper tr.ant-table-expanded-row >td {background:#f6e2bd !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-input-group-wrapper-outlined .ant-input-group-addon {background:rgb(0 0 0 / 8%) !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-row-middle .ant-row {background-color:rgb(220 210 192) !important;}')

   // 排行榜按钮
   GM_addStyle(':where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {background-color:#a78966 !important;}')
   GM_addStyle(':where(.css-1fsd2gv).ant-segmented .ant-segmented-item-selected {color:rgb(247 240 226 / 88%) !important;}')
   GM_addStyle(':where(.css-1fsd2gv).ant-segmented {background:#eee4d0 !important;}')

   // 魔力系统
   GM_addStyle('table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {background-color:#dfba87 !important;}')
   GM_addStyle('table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {color:#1b1710 !important;}')
   GM_addStyle('table.tablist td.colhead, table.tablist thead td, table.tablist tr.head>td {font-size: larger; !important;}')

   // 控制台页面
   GM_addStyle(':where(.css-1gwm2nm).ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {color:#563512 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-tabs .ant-tabs-tab {color:#563512 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {color:#563512 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {background-color:#ad8861 !important;}')

   // 控制台按钮
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary {background:#ad8861 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-primary {color:#fff1e1 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-switch.ant-switch-checked {background:#ad8862 !important;}')


   // 个人信息按钮
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-default {background-color:#f8f0e0 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-btn-default {border-color:#ad8861 !important;}')

   // 个人信息提醒
   GM_addStyle(':where(.css-1gwm2nm).ant-alert-info {background: #f8f0e0 !important;}')
   GM_addStyle(':where(.css-1gwm2nm).ant-alert-info {border: 1px solid #ad8861 !important;}')

   // 收件箱
   GM_addStyle('.colhead  {background: #ad8861 !important;}')

   // 载入
   GM_addStyle(':where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td, :where(.css-1gwm2nm).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder {background:#ddccb2 !important;}')



   // 下方内容可选

   // 种子列表间距
   //GM_addStyle(':where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-title, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, :where(.css-1gwm2nm).ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td {padding:1px 8px !important;}')
   //GM_addStyle(':where(.css-1gwm2nm).ant-row [class^="ant-row"], :where(.css-1gwm2nm).ant-row [class*=" ant-row"] {padding: 4px 0px !important;}')



}