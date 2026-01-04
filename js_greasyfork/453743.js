// ==UserScript==
// @name         财乎-视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更加方便下载财乎的视频
// @author       攸泠
// @license      MIT
// @match        http://www.caihuapp.com/mobile/
// @icon         http://www.caihuapp.com/mobile/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453743/%E8%B4%A2%E4%B9%8E-%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453743/%E8%B4%A2%E4%B9%8E-%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    window.onload = function() {
        setTimeout(()=>{
            const url = document.querySelector('video').src
            console.log(url)
            const a = document.createElement("a")
            const titleEle = document.querySelector('.title')
            a.href = "javascript:void(0)"
            a.innerText = "下载"
            a.onclick = () => {
                downloadMp4(url, titleEle.innerText + ".mp4")
            }
            a.style = "border: 1px solid #ddb888;padding: 10px 5px;display: block;text-align: center;background: #ddb888;border-radius: 50px;"
            if(url != ""){
                titleEle.append(a)
            }
        }, 1000)
    }
})();

function downloadMp4(url,name){
	fetch(url)
	.then(res => res.blob())
	.then(blob => {
		const a = document.createElement("a");
		const objectUrl = window.URL.createObjectURL(blob);
		a.download = name;
		a.href = objectUrl;
		a.click();
		window.URL.revokeObjectURL(objectUrl);
		a.remove();
	})
}