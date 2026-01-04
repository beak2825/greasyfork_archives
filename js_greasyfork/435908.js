// ==UserScript==
// @name         Boylove Img Cache
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  boylove 图片缓存
// @author       FuMan
// @match        https://boylove.house/home/book/capter/id/*
// @match        https://boylove.cc/home/book/capter/id/*
// @icon         https://www.google.com/s2/favicons?domain=boylove.cc
// @grant        unsafeWindow
// @run-at       document-idle
// @connect      imgcache.tk
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/435908/Boylove%20Img%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/435908/Boylove%20Img%20Cache.meta.js
// ==/UserScript==

const quality = 75;
const force_reload = false;

function isForceReload(){
    return force_reload? "&force_reload": "";
}

function getQuality(){
    return (quality==100)? "": `&quality=${quality}`;
}

(function() {
    'use strict';

    let imgs = document.querySelectorAll("img[class=\"lazy\"]");
    imgs.forEach(function(v){
        let url = v.getAttribute("data-original");
        url = encodeURIComponent(`${window.location.origin}${url}`);
        let u = `https://imgcache.tk/proxy?url=${url}${isForceReload()}${getQuality()}`;
        GM_xmlhttpRequest({
            url: u,
            responseType: "blob",
            onload: function(xhr){
                if(xhr.status!=200){
                    return;
                }
                let reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    v.setAttribute("data-original", base64data);
                    v.setAttribute("src", base64data);
                }
            },
            onerror: function(){
            }
        });
    })
})();
