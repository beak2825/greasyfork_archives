// ==UserScript==
// @name         复制魅族云相册 Token
// @namespace    moreant.mzStorage.getToken
// @version      0.1.1
// @description  一键复制魅族云相册的 Token
// @author       moreant
// @match        https://photos.flyme.cn/*
// @icon         https://www.google.com/s2/favicons?domain=flyme.cn
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/431495/%E5%A4%8D%E5%88%B6%E9%AD%85%E6%97%8F%E4%BA%91%E7%9B%B8%E5%86%8C%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/431495/%E5%A4%8D%E5%88%B6%E9%AD%85%E6%97%8F%E4%BA%91%E7%9B%B8%E5%86%8C%20Token.meta.js
// ==/UserScript==
var observer = new MutationObserver(callback);
(function() {
    'use strict';

    // Your code here...
    observer.observe(document,{
        childList: true,
        subtree: true
    });

})();

function callback(){
    var button = document.createElement("button");

    let bar = document.querySelector("#root > div > header")
    if(bar!= null ||bar!=undefined){
        setTimeout(function () {
            console.log("ok")
            button.style.marginTop = '23px'
            button.append("复制 Token")
            button.addEventListener('click',function(){getCookie("_utoken")});
            bar.append(button);

        },0)
        observer.disconnect();
    }
}

function getCookie(name) {
    console.log("copy")
    var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
        GM.setClipboard( decodeURIComponent(arr[2]))
    } else {
        return null
    }
}
