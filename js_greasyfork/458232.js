// ==UserScript==
// @name         必应去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除必应搜索的前几条广告
// @author       Liang
// @match        *.bing.com/search?q=*
// @include      *.bing.com/search?q=*
// @icon         https://cn.bing.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458232/%E5%BF%85%E5%BA%94%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458232/%E5%BF%85%E5%BA%94%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {

    var a = 1;

    for(var i = 1;i <= 10; i += 1){
        setTimeout(()=>{
            removeAd(a++);
        }, i*1000);
    }

    function removeAd(a){
        var ad = document.querySelector(".b_ad");
        var ad2 = document.querySelectorAll('#b_results li>h2');

        ad.style.display = 'none';

        ad2[0].parentElement.style.display = 'none';
        ad2[1].parentElement.style.display = 'none';
    }
    
})();