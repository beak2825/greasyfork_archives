// ==UserScript==
// @name         ip.cn 删除广告 去广告（加强版）
// @version      1.0.2
// @description  双重去过大图片广告（文字广告保留）,仅推荐强迫症患者食用
// @author       ok！
// @namespace    https://greasyfork.org/zh-CN/scripts/388392-ip-cn-%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A-%E5%8E%BB%E5%B9%BF%E5%91%8A-%E5%8A%A0%E5%BC%BA%E7%89%88
// @match        http*://ip.cn/*
// @match        http*://www.ip.cn/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388392/ipcn%20%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%20%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%8A%A0%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/388392/ipcn%20%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%20%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%8A%A0%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

//第1重去广告

$('img#tp').css('height','0');
$('img#tp').css('width','110');


//第2重,如果另加载，再去广告
$(document).ready(function() {
    setTimeout(function(){
$('#result').css('display', 'block');
$('#tips').css('display', 'none');
$("#tp").remove();
$('img[src="//s.ip-cdn.com/img/115-10.jpg"]').remove();
    }, 500);
});
