// ==UserScript==
// @name         腾讯快看漫画导出用
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Mr.NullNull
// @author       启用脚本后漫画页面左上角会显示文字按钮，请确保图片加载完毕后再点击，否则会保存失败。脚本仅供群内学习交流使用，请勿外放！
// @match        https://ac.qq.com/ComicView/index/id/*
// @match        https://www.kuaikanmanhua.com/web/comic/*
// @match        https://www.manhuafen.com/comic/*/*.html
// @match        https://newtoki84.com/webtoon/*
// @match        https://newtoki85.com/webtoon/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416082/%E8%85%BE%E8%AE%AF%E5%BF%AB%E7%9C%8B%E6%BC%AB%E7%94%BB%E5%AF%BC%E5%87%BA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/416082/%E8%85%BE%E8%AE%AF%E5%BF%AB%E7%9C%8B%E6%BC%AB%E7%94%BB%E5%AF%BC%E5%87%BA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
	'use strict';

	console.log("Start");

	var url = document.URL;

	function Main() {
		var divBtn = document.createElement("div");
		divBtn.id = "my_startBtn";
		divBtn.innerHTML = "导出重排,请确认所有图片加载完毕后按我"
		divBtn.style = `
            position: fixed;
            margin: 5px;
            padding: 2px;
            background-color: #ffffffd0;
            z-index: 99999999;
            top: 0px;
            outline: 1.5px solid #555;
            font-size: 12px;
        `;
		document.querySelector("body").appendChild(divBtn);

		document.querySelector("div#my_startBtn").onclick = Start;
	}

	function GerImgAdds() {
		var imgAddsTmp;
		var imgHtmlStr = "";

		if (url.match(/(ac\.qq\.com)/g) != null) {
			imgAddsTmp = document.querySelectorAll("ul#comicContain > li > img");
			for (let i = 0; i < imgAddsTmp.length; i++) {
				var src = imgAddsTmp[i].getAttribute("src");
				if (src == "//ac.gtimg.com/media/images/pixel.gif") { return []; }
				imgHtmlStr += `<img src="${src}">\r\n`;
			}
		} else if (url.match(/(www\.kuaikanmanhua\.com)/g) != null) {
			imgAddsTmp = document.querySelectorAll("div.imgList > img");
			for (let i = 0; i < imgAddsTmp.length; i++) {
				imgHtmlStr += `<img src="${imgAddsTmp[i].getAttribute("data-src")}">\r\n`;
			}
		} else if (url.match(/(www\.manhuafen\.com)/g) != null) {
			imgAddsTmp = document.querySelectorAll("div#images > img");
			for (let i = 0; i < imgAddsTmp.length; i++) {
				imgHtmlStr += `<img src="${imgAddsTmp[i].getAttribute("src")}">\r\n`;
			}

		} else if (url.match(/(newtoki8\d?\.com)/g) != null) {

			console.log(url.match(/(newtoki8\d?\.com)/g).toString());

			imgAddsTmp = document.querySelectorAll(".view-padding > div");
			//获取className
			var tmpClass = document.querySelectorAll(".view-padding > div");
			for (var i = 0; i < tmpClass.length; i++) {
				var tmp = tmpClass[i].className;
				if (tmp != "view-img") { tmpClass = tmp; break; }
			}

			//筛选出正确的组
			imgAddsTmp = document.querySelectorAll(`.${tmpClass}`);
			var idx = 0;
			for (var i = 0; i < imgAddsTmp.length; i++) {
				if (imgAddsTmp[i].querySelector("p").getAttribute("style") == null) { idx = i; break; }
			}
			imgAddsTmp = imgAddsTmp[idx];
			imgAddsTmp = imgAddsTmp.querySelectorAll("img");
			// console.log(imgAddsTmp);

			//获取img属性名
			var dataName = imgAddsTmp[0].parentNode.innerHTML
			dataName = dataName.match(/data-\S{5,15}=/g).toString();
			dataName = dataName.substring(0, dataName.length - 1);
			// console.log(dataName);

			//通过属性名获得正确的图片地址数组1
			for (let i = 0; i < imgAddsTmp.length; i++) {
				imgHtmlStr += `<img src="${imgAddsTmp[i].getAttribute(dataName)}">\r\n`;
			}

		}


		//本地手动调用
		// imgAddsTmp = document.querySelectorAll("div.imgList > img");
		// imgAddsTmp = document.querySelectorAll("ul#comicContain > li > img");

		//for (let i = 0; i < imgAddsTmp.length; i++) {
		//	imgHtmlStr += `<img src="${imgAddsTmp[i].getAttribute("src")}">\r\n`;
		//}

		return imgHtmlStr;
	}

	function Start() {
		console.log("开始重排");

		var title = document.querySelector("title").innerHTML;

		var imgHtmlStr = GerImgAdds();
		if (imgHtmlStr.length == 0) { alert("重排失败，有漫画页面未加载完成"); return; }
		console.log(imgHtmlStr);

		var htmlTxt = `
            <html>
            <head>
                <title>${title}</title>
				<style>
					* { margin: 0px; padding: 0px; }
                    .my_main { width: 160px; }
                    .my_main>* { float: left; }
                </style>
            </head>

            <body>
                <div class="my_main">
                ${imgHtmlStr}
                </div>
            </body>
            </html>
        `;

		document.querySelector("html").innerHTML = htmlTxt;
	}


	Main();

})();