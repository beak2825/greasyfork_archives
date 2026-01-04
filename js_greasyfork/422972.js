// ==UserScript==
// @name         vs优化
// @description  vs
// @namespace    zvg-vs
// @version      0.0.2
// @author       zvg
// @license      Unlicense
// @match        *://www.verykship.com/*
// @match        *://www.hr-ex.com/*
// @match        *://www.vipshipper.ca/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422972/vs%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422972/vs%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
'use strict'
 
document.head.insertAdjacentHTML('beforeend', `<style>

/* 修改默认字体*/
table.table>thead>tr>th,
.key,
.price.price-render>.int,
.price.price-render>.decimal,
.font-impact,
body, h1, h2, h3, h4,
.modal-message .modal-body {
  font-family: "Goldman Sans","SF Pro SC","SF Pro Text","SF Pro Icons","PingFang SC","Helvetica Neue","Helvetica","Arial",sans-serif !important;
  font-size: 12px;
}
  
.font-impact {
  font-weight: bold;
}
 
li > em {
  font-style: normal;
}
 
/* 修改字体大小*/
.rebuild-form,
.list-unstyled li {
	font-size: 12px;
}
 
/* 显示时间时候,不需要背景色 */
.datetime {
  font-size: 12px;
  background: none;
  padding: 4px 8px;
}
 
/* 修改表格间距小*/
 
.table>thead>tr>th,
.table>tbody>tr>th,
.table>tfoot>tr>th,
.table>thead>tr>td,
.table>tbody>tr>td,
.table>tfoot>tr>td {
  padding: 4px;
}
 
/* 不让表格默认100% 宽度*/
 
.table {
  width: auto;
  max-width: 100%;
  margin-bottom: 1em;
}

</style>`.replace(/;/g, '!important;'))