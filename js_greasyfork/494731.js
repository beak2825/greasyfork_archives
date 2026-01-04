// ==UserScript==
// @name					reCaptcha 验证码镜像加载pro
// @namespace			xyz.tree0
// @description		替换使用官方地址的 reCaptcha 为官方镜像地址，让墙内用户的 reCaptch 能正常显示。(可能对海外用户是减速2333似乎只能用于 reCaptcha v2。原作者很久没更新了，我做了一点小小改进
// @author				an_anthony，慕容恪
// @license MIT
// @version				0.1.2.4
// @grant					none
// @match             *://*/*
// @downloadURL https://update.greasyfork.org/scripts/494731/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BDpro.user.js
// @updateURL https://update.greasyfork.org/scripts/494731/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BDpro.meta.js
// ==/UserScript==
function square() {
var scrArr = document.getElementsByTagName("script");
for(var k = 0;k < scrArr.length;++k)
{

	if(scrArr[k].src !== null && scrArr[k].src.indexOf("https://www.google.com/recaptcha/") != -1){
        alert("已定位reCaptcha，点击确定替换.");
		var scrAppend = document.createElement("script");
    scrAppend.src = scrArr[k].src.replace("google.com","recaptcha.net");
		scrAppend.type = "text/javascript";
    scrAppend.async = true;
    scrArr[k].parentNode.appendChild(scrAppend);
    scrArr[k].parentNode.removeChild(scrArr[k]);
    alert("已替换该页面的 reCaptcha 地址，如果还未显示出 reCaptcha Logo，请稍等(约30s)\n如果依然没有正确显示，请暂时对该站点关闭跟踪器拦截功能");
	}
}
}
for (let i = 0; i <= 100; i++) {
    setTimeout(function () {
    square()
}, 5000* i);
}