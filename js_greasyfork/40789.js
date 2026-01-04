// ==UserScript==
// @name            kill_all_link
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.1
// @description     xxx
// @include         *
// @require         http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/40789/kill_all_link.user.js
// @updateURL https://update.greasyfork.org/scripts/40789/kill_all_link.meta.js
// ==/UserScript==

(function(){
	$("a").attr("href","http://baidu.com");
})();