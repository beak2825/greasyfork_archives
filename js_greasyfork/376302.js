// ==UserScript==
// @name         getFavlist of bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       l120
// @description  get url of bilibili favlist
// @match        https://space.bilibili.com/*
// @match        http://space.bilibili.com/*
// @require	        https://code.jquery.com/jquery-1.11.2.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/376302/getFavlist%20of%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/376302/getFavlist%20of%20bilibili.meta.js
// ==/UserScript==
var timer = setInterval(a,1000);
function addBtn(insertPlace,btn){
    var favlist=document.getElementsByClassName("cover cover-normal");
    insertPlace[0].insertBefore(btn,insertPlace[0].firstElementChild);
    btn.addEventListener("click", function(){
    var list = '';
    for(var i=0;i<favlist.length;i++){
        list += (favlist[i].getAttribute("href").replace("//","") + '\n');
    }
    GM_setClipboard(list);
    //console.log(list);
}, false);
}
function a()
{
	if(document.getElementsByClassName("fav-filters").length)
	{
		clearInterval(timer);
        var btn = document.createElement("div");
        btn.classList.add("filter-item");
        btn.style.cssText ="float:left";
        btn.innerHTML=("<span class=\"text\">获取链接</span>");
        var insertPlace = document.getElementsByClassName("fav-filters");
        addBtn(insertPlace,btn)
	}else{
        console.log("in?")
    }
}