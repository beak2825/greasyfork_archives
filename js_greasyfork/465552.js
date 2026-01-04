// ==UserScript==
// @name         CSDN pdf下载专用清理 脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  等待页面加载完毕后，按下键盘“F2”，一键删除多余内容
// @author       Ikaros
// @match        https://blog.csdn.net/*/article/details/*
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/scripts/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465552/CSDN%20pdf%E4%B8%8B%E8%BD%BD%E4%B8%93%E7%94%A8%E6%B8%85%E7%90%86%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465552/CSDN%20pdf%E4%B8%8B%E8%BD%BD%E4%B8%93%E7%94%A8%E6%B8%85%E7%90%86%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    // 传递传递参数event
	function keydown(event) {
		// “113”为按键F2，可根据需要修改为其他
		if (event.keyCode == 113) {
			document.getElementsByClassName("recommend-right align-items-stretch clearfix")[0].remove();
			document.getElementsByClassName("blog_container_aside")[0].remove();
			document.getElementsByClassName("more-toolbox-new more-toolbox-active")[0].remove();
			document.getElementsByClassName("recommend-box insert-baidu-box recommend-box-style ")[0].remove();
			document.getElementsByClassName("blog-footer-bottom")[0].remove();
			document.getElementsByClassName("recommend-nps-box common-nps-box")[0].remove();
			document.getElementById("csdn-toolbar").remove();
			document.getElementsByClassName("csdn-side-toolbar")[0].remove();
			document.getElementsByClassName("container clearfix")[0].style.width="100%";
			document.getElementsByClassName("container clearfix")[0].getElementsByTagName("main")[0].style.width="100%";

            try {
                for(var i = 0; i < document.getElementsByClassName("recommend-box").length; i++) {
                    document.getElementsByClassName("recommend-box")[0].remove()
                }
            } catch(e) {
                console.error(e);
            }
		}
	}

	document.addEventListener("keydown", keydown);
})