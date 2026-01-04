// ==UserScript==
// @name         126邮箱去广告
// @version      0.2
// @description  自动关闭网页版网易邮箱考拉，严选等推广标签页
// @author       zhangbohun
// @match        https://*.mail.126.com/js6/main.jsp*
// @namespace https://greasyfork.org/users/691197
// @downloadURL https://update.greasyfork.org/scripts/416064/126%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/416064/126%E9%82%AE%E7%AE%B1%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
	var textList=['考拉海购','免费课程','网易严选','PLUS会员','携程','携程旅行','半个电台','天气','限时惠','官方App','开通邮箱会员','邮推荐','邮福利','看世界'];
	for(var text of textList){
		var kl=document.querySelector("li[title='"+text+"']>a");
		if(kl){
			kl.click();
		}
	}
})();