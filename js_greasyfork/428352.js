// ==UserScript==
// @name         必应壁纸下载
// @author       Yugle
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  必应壁纸下载：点击必应首页右下ⓘ符号即可下载当前必应壁纸
// @match        *.bing.com/
// @match        *.bing.com/?*
// @note         Version 1.2.5    必应壁纸下载
// @icon         https://cn.bing.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/428352/%E5%BF%85%E5%BA%94%E5%A3%81%E7%BA%B8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428352/%E5%BF%85%E5%BA%94%E5%A3%81%E7%BA%B8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (){
	"use strict";
	var infoA = document.getElementById("sh_cp");
	infoA.addEventListener("click", refreshDownloadButton);

	function getImgUrl(){
		var background = document.getElementById("bgLink");
		var imgUrl = background.href;
		
		return imgUrl;
	};

	const currentUrl = "https://cn.bing.com/"
	var nextButton = document.getElementById("sh_igr");
	
	function refreshDownloadButton(){
		var imgUrl = getImgUrl();

		if(nextButton.hasAttribute("aria-disabled") == false){
			var backgroundDiv = document.getElementById("bgDiv");
			var style = backgroundDiv.getAttribute("style").split(";");

			var backgroundImg;
			style.forEach(function (value){
				if(value.indexOf("background-image") != -1){
					backgroundImg = value.split('"')[1]
				}
			});

			imgUrl = currentUrl + backgroundImg.replace("/", "");
		}

		var currentBackgroundImg = infoA.getAttribute("title")
		infoA.setAttribute("download", currentBackgroundImg);

		infoA.setAttribute("href", imgUrl)
	}
})();