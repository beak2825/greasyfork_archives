// ==UserScript==
// @namespace			xyz.tree0
// @name					reCaptcha 验证码镜像加载
// @description		替换使用官方地址的 reCaptcha 为官方镜像地址，让墙内用户的 reCaptch 能正常显示。(可能对海外用户是减速2333
// @description		似乎只能用于 reCaptcha v2
// @author				an_anthony
// @version				0.1.2.2
// @grant					none
// @match             *://*/*
// @downloadURL https://update.greasyfork.org/scripts/387185/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/387185/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

var scrArr = document.getElementsByTagName("script");
for(var k = 0;k < scrArr.length;++k)
{
	if(scrArr[k].src !== null && scrArr[k].src.indexOf("https://www.google.com/recaptcha/api") != -1){
		var scrAppend = document.createElement("script");
    scrAppend.src = scrArr[k].src.replace("google.com","recaptcha.net");
		scrAppend.type = "text/javascript";
    scrAppend.async = true;
    scrArr[k].parentNode.appendChild(scrAppend); 
    scrArr[k].parentNode.removeChild(scrArr[k]);
    alert("已替换该页面的 reCaptcha 地址，如果还未显示出 reCaptcha Logo，请稍等(约30s)\n如果依然没有正确显示，请暂时对该站点关闭跟踪器拦截功能");
	}
	
}
