// ==UserScript==
// @name            吾爱破解论坛自动签到 - 无道
// @description	    吾爱破解论坛自动签到脚本，很简单的一个脚本。主要就是自动签到，不用手动点击签到。
// @author			无道
// @namespace       52sign
// @version			1.0.2
// @date            2019.09.30
// @modified	    2020.11.25

//引用
// require			http://code.jquery.com/jquery-2.1.4.min.js
// @require			http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
//图标
// @icon            https://favicon.yandex.net/favicon/52pojie.cn

// @include			http*://www.52pojie.cn/
//功能
// @grant           unsafeWindow
// @grant           GM_log
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_info


// @encoding		utf-8
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/390901/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20-%20%E6%97%A0%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/390901/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20-%20%E6%97%A0%E9%81%93.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var $ = $ || window.$;
	$.get("./home.php?mod=task&do=draw&id=2");
	GM_log('sign');
})();