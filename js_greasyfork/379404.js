// ==UserScript==
// @name         163云课堂去除二维码，自动点击播放 2019.3.8
// @version      0.1
// @description  163云课堂去除二维码，自动点击播放
// @author       yuan@wx:yuanshuai1995
// @match        https://study.163.com/course/courseLearn.htm?courseId=*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @namespace https://greasyfork.org/users/256164
// @downloadURL https://update.greasyfork.org/scripts/379404/163%E4%BA%91%E8%AF%BE%E5%A0%82%E5%8E%BB%E9%99%A4%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%20201938.user.js
// @updateURL https://update.greasyfork.org/scripts/379404/163%E4%BA%91%E8%AF%BE%E5%A0%82%E5%8E%BB%E9%99%A4%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%20201938.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var intervalId = setInterval(function() {
		debugger
       var ad = $(".um-message-component-qrcode_img");
	   if(ad != undefined && ad != null && ad.length>=1){
		   $("#ux-modal").parent().hide();
			$(".bbg").click();
			clearInterval(intervalId);
		   }
	}, 60);

    // Your code here...
})();