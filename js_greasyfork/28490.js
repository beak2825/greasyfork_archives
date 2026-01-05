// ==UserScript==
// @name            北邮人pt自动感谢
// @namespace       bt.byr.Auto.Thanks
// @description     浏览 bt.byr.cn 资源详情页面时使用 AJAX 方式在后台自动感谢发布者。
// @match           https://bt.byr.cn/details.php*
// @match           http://bt.byr.cn/details.php*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/28490/%E5%8C%97%E9%82%AE%E4%BA%BApt%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/28490/%E5%8C%97%E9%82%AE%E4%BA%BApt%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
	var btn;
	(btn=document.getElementById('saythanks'))&&(btn.click());
})();