// ==UserScript==
// @name         Bing Wallpaper for Baidu
// @author       Yugle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Set Bing wallpaper on baidu.com
// @match        *.baidu.com/
// @note         Version 0.1    Bing Wallpaper for Baidu
// @icon         https://cn.bing.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect		 *
// @downloadURL https://update.greasyfork.org/scripts/428647/Bing%20Wallpaper%20for%20Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/428647/Bing%20Wallpaper%20for%20Baidu.meta.js
// ==/UserScript==

(function (){
	"use strict";

    const imgSourceUrl = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
    var imgSourceRes = GM_xmlhttpRequest({
        method: "GET",
        url: imgSourceUrl,
        onload: function(response){
            const res = response.response
            console.log("获取当日壁纸地址成功：" + res)
            const bingImgUrl = JSON.parse(res).images[0].url
			var bingImgMethod = "url({bingImgUrl})"

			document.body.style.backgroundImage = bingImgMethod
			document.body.style.backgroundImage = `url(https://bing.com${bingImgUrl})`

			let centerBox = document.getElementById("s_top_wrap")
			centerBox.style.opacity = 0.1
			document.getElementById("s_top_wrap").style.opacity = 0.1

			let leftDiv = document.getElementById("s-top-left")
			let leftAList = leftDiv.children
			for (let i = 0; i < leftAList.length; i++) {
				let leftA = leftAList[i]
				let leftAChilden = leftA.children
				if(leftAChilden != []){
					for (let j = 0; j < leftAChilden.length; j++){
						leftAChilden[j].style.color = "white"
					}
				}
				leftAList[i].style.color = "white"
			}

			let weatherSpanList = document.getElementsByClassName("show-weather")[0].children
			for (let i = 0; i < weatherSpanList.length; i++) {
				let weatherSpan = weatherSpanList[i].lastChild
				if(weatherSpan != null)
				weatherSpan.style.color = "white"
			}

			document.getElementById("s-usersetting-top").style.color = "white"
			document.getElementById("s-top-username").lastChild.style.color = "white"
        },
        onerror: function(response){
            console.log("获取当日壁纸地址失败：" + response.response)
        }
    });
})();