// ==UserScript==
// @name        替换gravatar头像
// @namespace    https://wangtwothree.com/
// @version      0.3
// @description  将gravatar头像替换为国内镜像链接，加快打开速度
// @author        wangtwothree
// @match *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460422/%E6%9B%BF%E6%8D%A2gravatar%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460422/%E6%9B%BF%E6%8D%A2gravatar%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
  window.addEventListener('load', function() {
	var imgs = document.getElementsByTagName('img')
	for(var i=0;i< imgs.length;i ++ ){
		var img = imgs[i]
		img.src = img.src.replace(/secure.gravatar.com/, "cravatar.cn")
	}
  });
})();