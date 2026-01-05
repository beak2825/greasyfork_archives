// ==UserScript==
// @name         Bilibili Live Cover
// @name:zh-CN   哔哩哔哩(bilibili.com)直播封面
// @namespace    hoothin
// @version      0.5
// @description        Show Bilibili Live Cover
// @description:zh-CN  在哔哩哔哩直播页面中显示封面
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @author       hoothin
// @include      http*://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/25704/Bilibili%20Live%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/25704/Bilibili%20Live%20Cover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onreadystatechange = function(){
        if(document.readyState == "complete"){
            var anchorAvatar=document.querySelector(".head-info-section");
            var bigImg=document.createElement("img");
            bigImg.style.cssText="pointer-events: none;position:fixed;z-index:999";
            var uid=anchorAvatar.querySelector(".room-cover").href.replace(/[^\d]/gi,"");
            GM_xmlhttpRequest({
                method: 'GET',
                url: location.protocol+"//live.bilibili.com/bili/getRoomInfo/"+uid,
                onload: function(result) {
                    let infoJson;
                    try{
                        infoJson=JSON.parse(result.responseText.replace(/^\(|\);$/g,""));
                    }catch(e){
                        console.log(e);
                        return;
                    }
                    var coverA=document.createElement("a");
                    coverA.href=infoJson.data.cover;
                    coverA.target="_blank";
                    coverA.style.marginLeft="20px";
                    coverA.innerHTML='<div class="up-level-icon pointer" title="封面">封面</div>';
                    document.querySelector(".room-info-down-row").appendChild(coverA);
                    coverA.onmouseover=function(e){
                        bigImg.src=coverA.href;
                        document.body.appendChild(bigImg);
                    };
                    coverA.onmouseout=function(e){
                        document.body.removeChild(bigImg);
                    };
                    coverA.onmousemove=function(e){
                        bigImg.style.left=e.clientX+"px";
                        bigImg.style.top=e.clientY+"px";
                    };
                }
            });
        }
    };
})();