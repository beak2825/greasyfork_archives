// ==UserScript==
// @name         Gartic IO Quick Draw
// @namespace    http://tampermonkey.net/
// @version      2025-04-03
// @description  While drawing, it automatically adds an image related to the word you select behind the canvas using the Google search engine. (Translate)
// @description:tr  Çizim yaparken kanvasın arkasına seçtiğiniz kelimeyle alakalı Google arama altyapısı kullanarak otomatik olarak görsel ekler.
// @author       YGN
// @match        https://gartic.io/*
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531775/Gartic%20IO%20Quick%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/531775/Gartic%20IO%20Quick%20Draw.meta.js
// ==/UserScript==

if(window.location.href.indexOf("gartic")>-1){
    GM_addValueChangeListener("imgdata",function(a,b,c,d){document.querySelector("#drawing").style=`background-blend-mode: lighten;background-color: rgba(255,255,255,0.7);background-size:80% 80%;background-image:url(`+c+`) !important;`})

    document.querySelector("#background").innerHTML+=`<iframe src="#" style="position:absolute;margin-left:-3000px;" class="mif" width="800" height="400" allow="autoplay" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>`

    function imgreq(param){let paramnext=encodeURI(param.split(" ").join("+"));document.querySelector(".mif").setAttribute("src","https://www.google.com/search?q="+paramnext+"+png+vector+icon&udm=2&biw=1536&bih=714&uact=5&oq="+paramnext+"+png+vector+icon&sclient=img&igu=1&returnfirstimg")}

    let originalSend = WebSocket.prototype.send,setTrue=false;
    window.wsObj={}

    WebSocket.prototype.send=function(data){originalSend.apply(this, arguments);if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}};

    window.eventAdd=()=>{if(!setTrue){setTrue=1;window.wsObj.addEventListener("message",(msg)=>{try{let data=JSON.parse(msg.data.slice(2));if(data[0]==34){imgreq(data[1])}if(data[0]==25||data[0]==18||data[0]==28){document.querySelector("#drawing").style=`background-size:100%;background-image:url(https://gartic.io/static/images/marcadagua.svg?v=1) !important;`}}catch(err){}})}}
}

if(window.location.href.indexOf("returnfirstimg")>-1){GM_setValue("imgdata",document.querySelector("div[data-id=mosaic]").querySelector("img").src)}