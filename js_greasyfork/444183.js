// ==UserScript==
// @namespace			xyz.tree0
// @name					reCaptcha 验证码镜像加载
// @description		替换使用官方地址的 reCaptcha 为官方镜像地址，让墙内用户的 reCaptch 能正常显示。
// @author				an_anthony  WA-YI
// @version				0.1.0.0
// @grant					none
// @match             https://www.google.com/recaptcha/
// @downloadURL https://update.greasyfork.org/scripts/444183/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444183/reCaptcha%20%E9%AA%8C%E8%AF%81%E7%A0%81%E9%95%9C%E5%83%8F%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

var scrArr = document.getElementsByTagName("script");
for(var k = 0;k < scrArr.length;++k)
{
	if(scrArr[k].src !== null && scrArr[k].src.indexOf("https://www.google.com/recaptcha/") != -1){
		var scrAppend = document.createElement("script");
        // scrAppend.src = "https://www.gstatic.com/recaptcha/releases/85AXn53af-oJBEtL2o2WpAjZ/recaptcha__zh_cn.js?onload=onRecaptchaLoaded&render=explicit"
        // scrAppend.src = scrArr[k].src.replace("www.google.com","recaptcha.google.cn");
        scrAppend.src = scrArr[k].src.replace("google.com","recaptcha.net");
		scrAppend.type = "text/javascript";
    scrAppend.async = true;
    scrArr[k].parentNode.appendChild(scrAppend); 
    scrArr[k].parentNode.removeChild(scrArr[k]);
    console.log("已替换该页面的 reCaptcha 地址");
	}
}
