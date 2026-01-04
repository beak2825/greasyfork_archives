// ==UserScript==
// @name         微软CRX下载器
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  使非Edge浏览器，也能从微软扩展商店下载CRX文件
// @author       tutu辣么可爱
// @include      *://*.microsoft.com/*
// @icon         https://i.loli.net/2021/08/18/mMtybsTwCBkFPW5.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430849/%E5%BE%AE%E8%BD%AFCRX%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/430849/%E5%BE%AE%E8%BD%AFCRX%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
(function() {
	//获取UA类型
	function getUA() {
		var uaStr = "others";
		if (/Chrome/i.test(navigator.userAgent)) {
			uaStr = "chromium";
		}
		return uaStr;
	}
	//判断是否为detail页
	function checkURL() {
		var URLType;
		if (location.hostname === "microsoftedge.microsoft.com") {
			if (location.pathname.search("/detail") !== -1) {
				URLType = "detail";
			} else {
				URLType = "others";
			}
		} else if (location.hostname === "edge.microsoft.com") {
			if (location.pathname === "/extensionwebstorebase/v1/crx") {
				URLType = "download";
			}
		}
		return URLType;
	}
	//changeButton方法用于替换原图标
	function changeButton(crxid, buttonOBJ) {
		//crxid写入下载器URL
		var downloaderURL =
			"https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&acceptformat=crx3&x=id%3D" +
			crxid + "%26installsource%3Dondemand%26uc";
		if (getUA() === "chromium") {
			downloaderURL = downloaderURL.replace("https", "http");
		}
		//替换内容、样式、功能
		var buttonOBJtextClass = buttonOBJ.children[0].className;
		buttonOBJ.style =
			"min-width: 100px !important;opacity:1;z-index: 999;cursor:pointer !important;margin-inline-end: 8px;background:#1683D8;";
		buttonOBJ.innerHTML = "<a class=" + buttonOBJtextClass + " href=" + downloaderURL +
			" target='_blank' style='color: white;text-decoration:none;width:100%'><b>下载 CRX</b></a>";
		//解除button的禁用
		buttonOBJ.disabled = false;
		//被替换图标加上name属性,防止一直被遍历赋值
		buttonOBJ.name = "ISnewButton";
		buttonOBJ.onmouseover = function() {
			buttonOBJ.style.background = "#006CBE";
		}
		buttonOBJ.onmouseleave = function() {
			buttonOBJ.style.background = "#1683D8";
		}
		//detail页专属设置
		if (checkURL() === "detail") {
			//图标宽度设置
			buttonOBJ.style.width = "max-content";
			//隐藏原有polite
			var politePareOBJ = buttonOBJ.parentElement.children;
			for (let i = 0; i < politePareOBJ.length; i++) {
				if (politePareOBJ[i].getAttribute("aria-live") === "polite") {
					politePareOBJ[i].style.display = "none";
				}
			}
		}
	}
	//SearchCRXbutton方法用于搜索需要替换的原图标
	function SearchCRXbutton() {
		//获取所有button对象
		var AllButtonObj = document.getElementsByTagName("button");
		//遍历所有button,找到“获取”图标(button id:getOrRemoveButton-xxxxxx)
		for (let i = 0; i < AllButtonObj.length; i++) {
			var ButtonObj = AllButtonObj[i];
			var ButtonObjID = ButtonObj.id;
			var ButtonObjName = ButtonObj.name;
			if ((ButtonObjID.search("getOrRemoveButton-") !== -1) && (ButtonObjName !== "ISnewButton")) {
				//从button id中获取crxid
				var crxid = ButtonObjID.slice("getOrRemoveButton-".length);
				//crxid一般为32位
				crxid = crxid.slice(0, 32);
				//调用方法替换原图标
				changeButton(crxid, ButtonObj);
			}
		}
	}
	//DownloadCRXforChromium方法为chromium内核浏览器专属下载方法
	function DownloadCRXforChromium() {
		var url = location.href;
		url=/^https:\/\//i.test(url)?true:"https://" + url.replace(/^(http:)?\/\//,"");
		if(url===true){
			return false;
		}
		var crxID=url.split("%3D")[1].split("%26")[0];
		crxID=crxID?crxID:"Edge插件";
		var btn=document.getElementsByTagName("pre")[0];
		if(btn){
			btn.innerHTML="若没有自动下载插件，请点击<a href='"+url+"' download='"+crxID+".crx'>这里</a>";
		}
		var a=document.createElement("a");
		a.href=url;
		a.download=crxID+".crx";
		a.click();
	}
	//CRXdownloaderMain方法为脚本入口main
	function CRXdownloaderMain() {
		if (checkURL() === "download" && getUA() === "chromium") {
			DownloadCRXforChromium();
		} else {
			if (document.getElementById("headerArea") !== null) {
				document.getElementById("headerArea").style.zIndex = "1000";
			}
			//设置定时器,单位ms
			var crxdownloaderSetTimer = 100;
			//启动定时器
			var crxdownloaderTimer = setInterval(function() {
				SearchCRXbutton();
			}, crxdownloaderSetTimer);
			//控制台输出定时器ID,可随时通过控制台停止
			console.log(crxdownloaderSetTimer + "ms定时器ID:" + crxdownloaderTimer);
		}
	}
	//调用Main方法
	CRXdownloaderMain(); //判断是否执行
})();
