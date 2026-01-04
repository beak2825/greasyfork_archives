// ==UserScript==
// @name         什么值得买 批量删除自己的评论 smzdm helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  make smzdm more useable
// @author       Shae
// @match        https://zhiyou.smzdm.com/user/fachupinglun/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411140/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%87%AA%E5%B7%B1%E7%9A%84%E8%AF%84%E8%AE%BA%20smzdm%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411140/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%87%AA%E5%B7%B1%E7%9A%84%E8%AF%84%E8%AE%BA%20smzdm%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doNothing() {}

	var eles = document.querySelectorAll(".juBao");
	var cnt = eles.length;
    for (var i = 0; i < cnt; i++) {
		eles[i].click();
		setTimeout(doNothing, 100);
		document.querySelector("#layerBtnL").click();
		setTimeout(doNothing, 100);
	}
    if (cnt > 0) {
        location.reload();
    }
})();
