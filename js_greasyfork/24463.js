// ==UserScript==
// @name          去除360搜索的广告
// @description   去除360搜索页面的广告
// @include       *://*.www.so.com/*
// @version 0.0.1.20200814090017
// @namespace https://greasyfork.org/users/75930
// @downloadURL https://update.greasyfork.org/scripts/24463/%E5%8E%BB%E9%99%A4360%E6%90%9C%E7%B4%A2%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/24463/%E5%8E%BB%E9%99%A4360%E6%90%9C%E7%B4%A2%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
function hiddenAd(){
    var ad_left = document.getElementById("m-spread-left");
    var ad_bottom = document.getElementById("m-spread-bottom");
    var ad_right1 = document.getElementsByClassName("mh-mediav-wrap mh-js-mediav-slot");
	var ad_right2 = document.getElementById("so_kw-ad");
	var ad_right3 = document.getElementById("mediav-rightbottom");
	var ad_top = document.getElementByClassName("res-mediav");
	var ad_bottom2 = document.getElementById("spread spread_test_height ");
    if(ad_left || ad_bottom || ad_right1 || ad_right2 || ad_right3 || ad_top || ad_bottom2){
        ad_left.parentNode.removeChild(ad_left);
		ad_bottom.parentNode.removeChild(ad_bottom);
		ad_right1[0].remove();
		ad_right2.parentNode.removeChild(ad_right2);
		ad_right3.parentNode.removeChild(ad_right3);
		ad_top[0].remove();
		ad_bottom2[0].remove();
    }
}
window.onload=hiddenAd();