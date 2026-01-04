// ==UserScript==
// @name         屏蔽网易云音乐评论
// @namespace    https://github.com/Zhangzijing/NoNeteaseMusicComments
// @version      1.1
// @description  屏蔽那些无聊做作的评论
// @author       pluvet
// @match        *://music.163.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377755/%E5%B1%8F%E8%94%BD%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/377755/%E5%B1%8F%E8%94%BD%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
	$("#comment-box").css("display","none");
	$(".m-multi").css("display","none");
	$(".m-subnav").css("display","none");
	$(".m-ft").css("display","none");
})();