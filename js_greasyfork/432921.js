// ==UserScript==
// @name 屏蔽斗鱼Dota2区烦人的指人图房间
// @version 0.0.2
// @author lrouger
// @match https://www.douyu.com/g_DOTA2
// @description 眼不见为净
// @namespace https://greasyfork.org/zh-CN/scripts/432921
// @downloadURL https://update.greasyfork.org/scripts/432921/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BCDota2%E5%8C%BA%E7%83%A6%E4%BA%BA%E7%9A%84%E6%8C%87%E4%BA%BA%E5%9B%BE%E6%88%BF%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/432921/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BCDota2%E5%8C%BA%E7%83%A6%E4%BA%BA%E7%9A%84%E6%8C%87%E4%BA%BA%E5%9B%BE%E6%88%BF%E9%97%B4.meta.js
// ==/UserScript==
(function() {
	setInterval(function() {
		var targer = document.querySelector("[href='/500269']");
		if (targer) {
			targer.parentNode.parentNode.remove();
		}
	});
})();