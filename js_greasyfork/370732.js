// ==UserScript==
// @name         和讯理财看全文你大爷
// @namespace    http://www.cnblogs.com/Chary/
// @version      0.5
// @description  把看全文的那个啥玩意儿给干掉
// @author       CharyGao
// @match        *hexun.com/*
// @grant        GM_addStyle
// @icon         http://www.hexun.com/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/370732/%E5%92%8C%E8%AE%AF%E7%90%86%E8%B4%A2%E7%9C%8B%E5%85%A8%E6%96%87%E4%BD%A0%E5%A4%A7%E7%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/370732/%E5%92%8C%E8%AE%AF%E7%90%86%E8%B4%A2%E7%9C%8B%E5%85%A8%E6%96%87%E4%BD%A0%E5%A4%A7%E7%88%B7.meta.js
// ==/UserScript==
GM_addStyle(
	'.art_contextBox{height:auto!important;}'
	+'.aImgDl, .fttBox, .showAll ,.showAllImg ,.appDl{display: none!important;}'
	+' .layout{width: auto!important;}' 
	+' .w600{width: auto!important; margin: 0px 5%!important;}'
	+' body{background-color: #CCE8CF!important;}'
	+' table{margin: 0 auto;}'
);//直接下载所有图片
(function() {
    'use strict';
})();
