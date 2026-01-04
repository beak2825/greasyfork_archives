// ==UserScript==
// @name        css_cozeRightColBigger
// @namespace   leizingyiu
// @match       *://*.coze.*/space/*
// @grant       none
// @version     0.1
// @author      leizingyiu
// @description 放大coze右边的栏。
// @license     GNU AGPLv3 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492901/css_cozeRightColBigger.user.js
// @updateURL https://update.greasyfork.org/scripts/492901/css_cozeRightColBigger.meta.js
// ==/UserScript==

GM_addStyle(`

@-moz-document url-prefix("https://www.coze.com/space/"), url-prefix("https://www.coze.cn/space/") {
.sidesheet-container {
	display: flex;
}
.sidesheet-container > * {
	flex: 1;
}
.sidesheet-container > *:last-child {
	flex: 3!important;
}

.sidesheet-container > * >*:first-child{
	display: none;
}


.semi-spin-children>*:first-child{
	padding: 2px;
	height: auto;
}
}

`);