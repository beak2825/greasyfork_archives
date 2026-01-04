// ==UserScript==
// @name	删除百度lite图标
// @namespace	https://greasyfork.org/users/91873
// @version	1.0.0.0
// @description	移除百度lite图标
// @author	wujixian
// @include	*://www.baidu.com/*
// @grant	none
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/393021/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6lite%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/393021/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6lite%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

window.onload=function(){
    $('#form .s_btn_wr').removeClass('s_btn_wr' );
};