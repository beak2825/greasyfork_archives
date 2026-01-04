// ==UserScript==
// @name         unicode-table.com 自动展开右侧目录
// @version      0.1.0.1
// @icon         https://unicode-table.com/favicon.ico
// @description  unicode-table.com 右侧的分类目录自动展开成鼠标悬停的状态。
// @author       You!
// @grant        GM_addStyle
// @include      *://unicode-table.com/*/blocks/*
// @run-at       document-start
// @namespace    https://greasyfork.org/zh-CN/scripts/368594-unicode-table-com-自动展开右侧目录
// @downloadURL https://update.greasyfork.org/scripts/368594/unicode-tablecom%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%8F%B3%E4%BE%A7%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/368594/unicode-tablecom%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%8F%B3%E4%BE%A7%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
	GM_addStyle(
		'div.wrapper{margin:0!important;}'+
		'div.block-side{left:720px!important;margin:0!important;width:520px!important;}'+ //目录总宽度和滚动区高度
		'div.block-side *{white-space:nowrap!important;}'+ //取消换行
		'div.box{width:380px!important;}'+ //目录条目宽度（取消水平滚动）
		'span.range{text-align:right!important;top:1px!important;left:-95px!important;display:inline-block!important;}'+ //修改编码范围样式与悬停状态一致
		''
	);
})();