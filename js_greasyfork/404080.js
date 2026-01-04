// ==UserScript==
// @name         github下载加速
// @namespace    xuexizuoye.com
// @version      1.01
// @description  将github克隆按钮的地址替换为国内cnpm的镜像文件地址，方便下载，避免0kb的速度！
// @author       huansheng
// @include       *://github.com/*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/404080/github%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/404080/github%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
window.onload = function() {
	console.log("网页加载完毕，尝试替换文件地址！……");
	var handchange = setInterval(function() {
		var downbtndom = document.getElementsByClassName('clone-options https-clone-options')[0];
		console.log("按钮:" + downbtndom);
		if (document.getElementsByClassName('clone-options https-clone-options') && downbtndom) {
			console.log("按钮存在:" + downbtndom, downbtndom.offsetWidth);
			if (downbtndom.offsetWidth) {
				console.log(downbtndom, downbtndom.offsetWidth);
				console.log("准备修改！……");
				replacegit()
			}
		} else {
			console.log("暂未找到下载按钮，等待中！……")
		}
	},
	1000);
	console.log("handchange:" + handchange);
	function replacegit() {
		console.log("尝试修改下载按钮样式->starting……");
		GM_addStyle(".flex-1.btn.btn-outline.get-repo-btn {color: #fff;background-color: #28a745;background-image: linear-gradient(-180deg,#34d058,#28a745 90%);border-radius: 15px}.input-group>input {background-color:#40a728bd;color:white;border-radius: 5px}");
		console.log("修改下载按钮样式，如果按钮为绿色且有圆角正面修改成功，反之欢迎反馈！->end……");
		console.log("尝试修改下载按钮地址->开始……");
		var downbtn = document.getElementsByClassName('flex-1 btn btn-outline get-repo-btn')[0];
		var downurl = downbtn.href;
		console.log("下载按钮地址:" + downurl);
		downurl = downurl.replace("://github.com", "://github.wuyanzheshui.workers.dev");
		downbtn.href = downurl;
		console.log("下载按钮地址:" + downbtn.href);
		console.log("尝试修改下载按钮地址->结束……");
		clearInterval(handchange);
		handchange = undefined;
		console.log("程序结束！……")
	}
} ();