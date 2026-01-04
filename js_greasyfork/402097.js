// ==UserScript==
// @name         清爽奈菲
// @namespace    https://borber.cn
// @version      0.0.5
// @description  去除 奈菲影视 的广告 (我本身是不排斥清爽的广告的 但是该网站TG群的 "沁沁" 管理员说了点不太好听的)
// @author       Borber
// @match        https://www.nfmovies.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402097/%E6%B8%85%E7%88%BD%E5%A5%88%E8%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/402097/%E6%B8%85%E7%88%BD%E5%A5%88%E8%8F%B2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    if(document.getElementById("adleft")){
        document.getElementById("adleft").style.cssText = 'position:fixed; top:-300px; right:5px;';
    }
    if(document.getElementById("adright")){
        document.getElementById("adright").style.cssText = 'position:fixed; top:-300px; right:5px;';
    }
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++){
        if (imgs[i].src.startsWith("https://www.nfmovies.com/pic/tu/")) {
            imgs[i].style.cssText = 'position:fixed; top:-300px; right:5px;';
        }
    }
    //视频广告 暂未实现
    if (window.location.href.startsWith("https://www.nfmovies.com/video/")){
        setTimeout(function () {
            if(document.getElementById('cciframe')){
                document.getElementById('cciframe').contentWindow.closeAd();
                document.getElementById('cciframe').contentDocument.getElementById('zzzif2').contentDocument.querySelector("#playerCnt > div > img").setAttribute("src","https://www.z4a.net/images/2020/04/27/pause.png")
                document.getElementById('cciframe').contentDocument.getElementById('zzzif2').contentDocument.querySelector("#playerCnt > div").removeAttribute("onclick");
                document.getElementById('cciframe').contentDocument.getElementById('zzzif2').contentDocument.querySelector("#playerCnt > div").style.cssText = "text-align: center; width: 100%;";
            }
        },2500)
    }
})();
