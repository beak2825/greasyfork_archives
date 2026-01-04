// ==UserScript==
// @name         Youtube Short Auto Next
// @name:en      Youtube Short Auto Next
// @name:fa      خودکار به ویدیو بعدی رفتن
// @namespace    MiraliPD
// @version      1.0.4
// @description  	A script that allows you to go to the next video without clicking after the end of the short video on YouTube Automatically.
// @description:en  	A script that allows you to go to the next video without clicking after the end of the short video on YouTube Automatically.
// @description:fa  	اسکریپتی که به شما امکان می دهد بدون کلیک کردن پس از پایان ویدیوی کوتاه در یوتیوب به صورت خودکار به ویدیوی بعدی بروید.
// @author       MiraliPD
// @match        https://*.youtube.com/shorts/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471024/Youtube%20Short%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/471024/Youtube%20Short%20Auto%20Next.meta.js
// ==/UserScript==

let selectedElm = null;
setInterval(()=>{
    if(selectedElm == null){
        document.querySelectorAll("video").forEach((elm,index)=> {if(elm.currentTime > 0.2) selectedElm = elm;})
    }
	if(selectedElm.currentTime > (selectedElm.duration - 0.1)){
        	document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-xl yt-spec-button-shape-next--icon-button ')[document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-xl yt-spec-button-shape-next--icon-button ').length-1].click()
	}

},1)
