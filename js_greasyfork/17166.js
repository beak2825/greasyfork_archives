// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/30310-adan1
// @name         爱图客去广告
// @description  去除爱图客网站的广告
// @icon		 http://www.itokoo.com/favicon.ico
// @author       Adan1
// @exclude      http://adan.homepage/
// @include      http://www.itokoo.com/*
// @grant        none
// @require		 http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @encoding     utf-8
// @date         15/02/2016
// @version      0.1
// @modified     15/02/2016
// @downloadURL https://update.greasyfork.org/scripts/17166/%E7%88%B1%E5%9B%BE%E5%AE%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/17166/%E7%88%B1%E5%9B%BE%E5%AE%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function removeById(id){
	$("#"+id).remove();
}



// 顶底广告
$("div.tac.mb5").remove();
// 内容广告
removeById("ft_couplet_left");
removeById("ft_couplet_right");
removeById("cpv6_left_lower");
removeById("__jx_dsp_div");






