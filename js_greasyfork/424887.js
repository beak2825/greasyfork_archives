// ==UserScript==
// @name         提取115原图链
// @namespace    http://www.busjav.cam/forum
// @version      0.1
// @description  提取115图片原图链接
// @author       zfy
// @match        *
// @match        *://www.busjav.cam/*
// @match        *://sukebei.nyaa.si/*
// @match        *://nyaa.si/*
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424887/%E6%8F%90%E5%8F%96115%E5%8E%9F%E5%9B%BE%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/424887/%E6%8F%90%E5%8F%96115%E5%8E%9F%E5%9B%BE%E9%93%BE.meta.js
// ==/UserScript==


javascript: 
function imgURL() {
	if(typeof thisPic == "undefined"){ 
	  let thisPic = $("[data-rel='pic']")[0].currentSrc;
	}
	thisPic = $("[data-rel='pic']")[0].currentSrc;
	if(thisPic == "") {
		console.log("-------------------------!\n"+"捕捉失败\n"+"-------------------------!");
	}
	else {
		console.log("原图地址："+thisPic);
		if(typeof picList == "undefined"){ 
		  let picList = [];
		}
		picList = [];
		if(localStorage.getItem("picURLs") == null) {
		    localStorage.setItem("picURLs", "");
		}
		else {
		    picList = localStorage.getItem("picURLs").split("\n");
		}
		if(picList.indexOf(thisPic) == -1) {
		    picList.push(thisPic);
		}
		localStorage.setItem("picURLs", picList.join("\n"));
		console.log("已收集 "+picList.length+" 张");
	}
}
if(document.getElementsByClassName("pvo-org-pic").length != 0 && document.getElementsByClassName("pvo-org-pic")[0].style.display != "none") {
	document.getElementsByClassName("pvo-org-pic")[0].click();
	console.log("开始加载原图");
	new Promise((resolve) => {
		if(typeof myTime == "undefined"){
		  let myTime = setInterval(function(){
				if($("[is_org='1']")[0] != null) {
					resolve("success");
					clearTimeout(myTime);
				}
			}, 200);
		}
	}).then(data => {
		console.log("原图加载完毕，等待捕获原图");
		return new Promise((resolve)=> {
			if(typeof myTime2 == "undefined"){
				let myTime2 = setInterval(function(){
					if(typeof thisPic == "undefined"){
						let thisPic = $("[data-rel='pic']")[0].currentSrc;
					}
					thisPic = $("[data-rel='pic']")[0].currentSrc;
					if(thisPic != "") {
						console.log("原图链接已加载");
						resolve("success");
						clearTimeout(myTime2);
					}
				}, 200);
			}
		})
	}).then(data=> {
		imgURL();
	})
}
else {
	console.log("不需要加载原图");
	imgURL();
}





// 清空
javascript: 
window.localStorage.removeItem("picURLs");


// 控制台打印数组
javascript: 
console.log(localStorage.getItem("picURLs").split("\n"));





