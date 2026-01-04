// ==UserScript==
// @name         漫畫聯合國免翻頁
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  漫畫聯合國的單集圖片一次加載完畢，使用情境每一章第一頁(三秒後開始加載)。
// @author       You
// @match        https://www.comicun.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/438263/%E6%BC%AB%E7%95%AB%E8%81%AF%E5%90%88%E5%9C%8B%E5%85%8D%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/438263/%E6%BC%AB%E7%95%AB%E8%81%AF%E5%90%88%E5%9C%8B%E5%85%8D%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==
 
setTimeout(function() {
    addElementImg();
}, 3000); 

//漫畫聯合國 連續顯示圖片
function addElementImg() {
		//取得網址
		var tmpUrl = location.href.split("-");
		//取得id
		var tmpID = tmpUrl[tmpUrl.length-1];
		//取得圖片顯示的元件
		var tmpEle = document.getElementsByClassName("e")[0];
		//取得第一張圖片的代號
		var tmpEleImg = document.getElementsByClassName("e")[0].firstChild.src;
		//先切割 / 
		tmpEleImg = tmpEleImg.split("/");
		var tmpEleImgSplit_0 = tmpEleImg[tmpEleImg.length-5];
		var tmpEleImgSplit_1 = tmpEleImg[tmpEleImg.length-4];
		var tmpEleImgSplit_2 = tmpEleImg[tmpEleImg.length-3];
		var tmpEleImgSplit_3 = tmpEleImg[tmpEleImg.length-1];
		//再切割 . 
		tmpEleImgSplit_3 = tmpEleImgSplit_3.split(".");
		var tmpEleImgSplit_4 = tmpEleImgSplit_3[0];
		//轉數字才能運算
		tmpEleImgSplit_4 = parseInt(tmpEleImgSplit_4, 10);
		for(var i=0;i<60;i++)
		{
			var tmpImg = document.createElement("img");
			//用代號繼續往下加
			tmpImg.src = "https://img.comicun.com/upload/"+ tmpEleImgSplit_0 + "/" + tmpEleImgSplit_1 + "/" + tmpEleImgSplit_2 + "/"+ tmpID +"/"+(tmpEleImgSplit_4+i)+".jpg";
			tmpEle.appendChild(tmpImg);
		}
　　}
addElementImg();