// ==UserScript==
// @name         腾讯课堂去除漂浮水印
// @namespace    wxyedward@gmail.com
// @version      0.1
// @description  去除网页版腾讯课堂观看时的“xxx正在观看视频”的漂浮水印
// @author       Edward Wang
// @match        *ke.qq.com/webcourse/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400029/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8E%BB%E9%99%A4%E6%BC%82%E6%B5%AE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/400029/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8E%BB%E9%99%A4%E6%BC%82%E6%B5%AE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
	setInterval(function(){
        var obj=document.querySelector('#x-tcp-container > txpdiv');
		if(obj != null){obj.remove()}
	},200)
})();