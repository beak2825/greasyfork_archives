// ==UserScript==
// @name            SMZDM隐藏0评论
// @version         0.1.1
// @author          everbell
// @namespace       smzdm.com/
// @supportURL      smzdm.com/
// @description     隐藏什么值得买搜索结果中评论数量为0的结果
// @match           *://search.smzdm.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/430715/SMZDM%E9%9A%90%E8%97%8F0%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/430715/SMZDM%E9%9A%90%E8%97%8F0%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let cssFix = document.createElement('style')
	cssFix.innerHTML += '#feed-side{display:none !important;}'//隐藏侧边导航栏
	document.getElementsByTagName('head')[0].appendChild(cssFix)

})();