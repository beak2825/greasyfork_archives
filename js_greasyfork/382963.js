// ==UserScript==
// @name         网易邮箱去广告（默认关闭考拉，严选等标签页）
// @namespace    http://zhangbohun.github.io
// @version      0.6.1
// @description  自动关闭网页版网易邮箱考拉，严选等推广标签页
// @author       zhangbohun
// @match        https://*.mail.163.com/js6/main.jsp*
// @icon https://mail.163.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382963/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E8%80%83%E6%8B%89%EF%BC%8C%E4%B8%A5%E9%80%89%E7%AD%89%E6%A0%87%E7%AD%BE%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/382963/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E8%80%83%E6%8B%89%EF%BC%8C%E4%B8%A5%E9%80%89%E7%AD%89%E6%A0%87%E7%AD%BE%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var textList=['考拉海购','免费课程','网易严选','PLUS会员','携程','携程旅行','半个电台','企业邮箱'];
	for(var text of textList){
		var kl=document.querySelector("li[title='"+text+"']>a");
		if(kl){
			kl.click();
		}
	}
})();