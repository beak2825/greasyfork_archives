// ==UserScript==
// @name         猫咪av
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  破解vip视频免费观看
// @author       Ths
// @match        https://www.223gw.com/*
// @match        *://www.f2c013d5bbbb.com/*
// @match        *://www.9805e4a39257.com/*
// @match        *://www.7bfbb776da4a.com/*
// @match        *://www.bc53k.com/*
// @match        *://www.8ca6c74fb1f9.com/*
// @match        *://*/index/home.html
// @match        *://*/vip/index.html
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f2c013d5bbbb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459804/%E7%8C%AB%E5%92%AAav.user.js
// @updateURL https://update.greasyfork.org/scripts/459804/%E7%8C%AB%E5%92%AAav.meta.js
// ==/UserScript==
 
function replaceAllUrl(){
    document.querySelectorAll("a.video-pic").forEach( (a) => {
        //console.log(a);
        a.href=a.href.replace("/vip/play-","/shipin/detail-");
    });
}
 
(function() {
    'use strict';
 
    //document.body.innerHTML=document.body.innerHTML.replace("/vip/play-","/shipin/detail-");
    //if(-1!==document.body.innerHTML.match("/vip/play-")){document.location.href=document.location.href.replace("/vip/play-","/shipin/detail-");}
    setTimeout( () => {
        replaceAllUrl();
    }, 500);
})();