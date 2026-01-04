// ==UserScript==
// @name         华建学习挂机脚本
// @namespace    lvqingke专享
// @version      3.2.2
// @description  懒人有懒法
// @author       lqk
// @match        *://ent.toujianyun.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444538/%E5%8D%8E%E5%BB%BA%E5%AD%A6%E4%B9%A0%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444538/%E5%8D%8E%E5%BB%BA%E5%AD%A6%E4%B9%A0%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

 setInterval(function () {
        var current_video = document.getElementsByTagName('video')[0]
        current_video.play()
    }, 1000)


//setInterval(function() {
	//document.getElementsByClassName("btn btn-blue")[1].click()
//},1000)

setInterval(function() {
	document.getElementsByClassName("btn btn-blue")[0].click()
},1000)



setInterval(function() {
	var i;

if(document.getElementsByClassName("chapter-title")[1].innerText[2]>=0)
{
i = document.getElementsByClassName("chapter-title")[1].innerText[1] + document.getElementsByClassName("chapter-title")[1].innerText[2] ;

}
else
{
i = document.getElementsByClassName("chapter-title")[1].innerText[1];
}
if (document.getElementsByClassName("prism-ended-title")[0]){
document.getElementsByClassName("title")[i].click();
}
},1000)

