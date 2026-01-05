// ==UserScript==
// @name            HDChina.hdwing.Auto.Thanks
// @namespace       HDChina.hdwing.Auto.Thanks
// @description     浏览 HDChina.org 资源详情页面时使用 AJAX 方式在后台自动感谢发布者。如果您觉得这不足以表达谢意，请使用奖励积分功能。
// @match           https://hdchina.club/details.php*
// @match           http://hdchina.club/details.php*
// @match           https://pthome.net/details.php*
// @match           https://hdhome.org/details.php*
// @match           https://yingk.com/details.php*
// @match           https://www.bitcool.me/details.php*
// @match           https://*.moecat.best/details.php*
// @match           https://*.hddisk.org/details.php*
// @match           https://*.ptdream.net/details.php*
// @match           https://*.cnscg.club/details.php*
// @match           https://pt.m-team.cc/details.php*
// @match           */details.php*


// @version 0.0.1.20190823173456
// @downloadURL https://update.greasyfork.org/scripts/25020/HDChinahdwingAutoThanks.user.js
// @updateURL https://update.greasyfork.org/scripts/25020/HDChinahdwingAutoThanks.meta.js
// ==/UserScript==

(function() {
	var btn;
	(btn=document.getElementById('saythanks'))&&(btn.click());
})();