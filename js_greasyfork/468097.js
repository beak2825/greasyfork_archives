// ==UserScript==
// @name         过滤京东非自营
// @description  弱化京东非自营商品的显示
// @version      0.2
// @author       lv7
// @copyright    lv7
// @include      http*://list.jd.com*
// @grant        none
// @namespace https://greasyfork.org/users/1092839
// @downloadURL https://update.greasyfork.org/scripts/468097/%E8%BF%87%E6%BB%A4%E4%BA%AC%E4%B8%9C%E9%9D%9E%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/468097/%E8%BF%87%E6%BB%A4%E4%BA%AC%E4%B8%9C%E9%9D%9E%E8%87%AA%E8%90%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
	document.querySelectorAll("#J_goodsList > ul > li").forEach((item,index)=>{
	if(-1 == item.innerHTML.indexOf("京东自营")){
		item.style.opacity = 0.1;
	}
});},2000);


})();