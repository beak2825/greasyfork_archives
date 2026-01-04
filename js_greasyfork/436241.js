// ==UserScript==
// @name         csdn页面阅读优化
// @namespace    https://github.com/damiancritchfield
// @version      0.7
// @description  对csdn博客内容进行阅读优化，包括去掉顶部导航，去掉日历等，仅留下文章和评论
// @author       damiancritchfield
// @connect      www.csdn.net
// @include      *://*.csdn.net/*
// @match        *://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT

// @supportURL   https://github.com/damiancritchfield
// @contributionURL https://github.com/damiancritchfield
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @antifeature  本脚本不会收集用户数据
// @note         2021-12-09 0.5 免登录进行代码复制
// @note         2021-12-02 0.2 免登录进行代码复制
// @downloadURL https://update.greasyfork.org/scripts/436241/csdn%E9%A1%B5%E9%9D%A2%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436241/csdn%E9%A1%B5%E9%9D%A2%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var cssStyle = '.blog_container_aside{display:none}.recommend-box{display:none}.csdn-side-toolbar{display:none}#rightAside{display:none}#csdn-toolbar{display:none}pre:hover .hljs-button{display:none}.nodata .container main{width:100%;max-width:100%}#mainBox{margin-left:0rem}.nodata .container{width:100%}';

(function() {
    'use strict';

    // 添加自定义样式
	setStyleTag(cssStyle);
	
    $("#csdn-toolbar").remove();
	
	// 免登录进行代码复制
	$("code").css("user-select","auto");
	$("#content_views").css("user-select","auto");
	$("pre").css("user-select","auto");
	
	// 评论栏全屏
	$(".left-toolbox").attr("style","position: relative;z-index: 10;left: 0px;bottom: 0px;width: 100%;");
	
})();

function setStyleTag(cssContent){
	var style_tag = document.createElement('style');
	style_tag.innerHTML = cssContent;
	document.head.appendChild(style_tag);
}