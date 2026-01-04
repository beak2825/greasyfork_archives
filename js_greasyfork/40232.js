// ==UserScript==
// @name         Bilibili Live Cover
// @version      0.6
// @description        Show Bilibili Live Cover
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @author       i9602097
// @include      http*://live.bilibili.com/*
// @namespace https://greasyfork.org/users/106880
// @downloadURL https://update.greasyfork.org/scripts/40232/Bilibili%20Live%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/40232/Bilibili%20Live%20Cover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bigImg=document.createElement("img");
    bigImg.style.cssText='pointer-events:none;position:fixed;z-index:999;box-shadow:0 0 5px rgba(0, 0, 0, 0.5);border:1px solid #e9eaec;border-radius:12px;background-color:black;';
    var coverA=document.createElement("a");
    coverA.id="cover";
    coverA.target="_blank";
    coverA.style.marginLeft="20px";
    coverA.innerHTML='<div class="up-level-icon pointer" title="封面">封面</div>';
    function initFunction(){
        if(document.readyState == "complete" && location.pathname.match(/\/(\d+)/) && document.querySelector(".room-info-down-row") && !document.querySelector(".room-info-down-row").querySelector("a#cover")){
            GM_xmlhttpRequest({
                method: 'GET',
                url: location.protocol+"//api.live.bilibili.com/room/v1/Room/get_info?room_id="+location.pathname.match(/\/(\d+)/)[1],
                onload: function(result) {
                    let infoJson;
                    try{
                        infoJson=JSON.parse(result.responseText.replace(/^\(|\);$/g,""));
                    }catch(e){
                        console.log(e);
                        return;
                    }
                    if(infoJson.code || !document.querySelector(".room-info-down-row"))return;
                    if(infoJson.data.user_cover)coverA.firstChild.innerHTML='封面';else coverA.firstChild.innerHTML='無封面';
                    if(infoJson.data.user_cover)coverA.firstChild.title='封面';else coverA.firstChild.title='無封面';
                    coverA.href=infoJson.data.user_cover || 'javascript:alert("無封面")';
                    document.querySelector(".room-info-down-row").appendChild(coverA);
                    if(infoJson.data.user_cover){
                        coverA.onmouseover=function(e){
                            bigImg.src=infoJson.data.user_cover.replace(/^https?\:/, location.protocol);
                            bigImg.style.maxWidth=document.querySelector("#live-player-ctnr").offsetWidth/2+"px";
                            bigImg.style.maxHeight=document.querySelector("#live-player-ctnr").offsetHeight/2+"px";
                            document.body.appendChild(bigImg);
                        };
                        coverA.onmouseout=function(e){
                            document.body.removeChild(bigImg);
                        };
                        coverA.onmousemove=function(e){
                            bigImg.style.left=e.clientX+"px";
                            bigImg.style.top=e.clientY+"px";
                        };
                    }else{
                        coverA.onmouseover=null;
                        coverA.onmouseout=null;
                        coverA.onmousemove=null;
                        document.body.removeChild(bigImg);
                    }
                }
            });
        }
    }
    document.onreadystatechange = initFunction;
    initFunction();
})();