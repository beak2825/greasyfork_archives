// ==UserScript==
// @name         Yonlendirmesiz Donanimhaber - DH Skip
// @namespace    https://forum.donanimhaber.com
// @version      0.1
// @description  Donanımhaberdeki yönlendirmeli linkleri atlar
// @author       FreakDevil
// @include     https://forum.donanimhaber.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37028/Yonlendirmesiz%20Donanimhaber%20-%20DH%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/37028/Yonlendirmesiz%20Donanimhaber%20-%20DH%20Skip.meta.js
// ==/UserScript==

(function() {
    if(document.URL.indexOf("https://forum.donanimhaber.com") !== -1){
        var atags = document.getElementsByTagName("a");
        for(var i = 0; i<atags.length; i++){
            if(atags[i].hasAttribute("data-href") && atags[i].hasAttribute("target") ){
                var newurl = atags[i].getAttribute("data-href");
                if(newurl.indexOf("http") < 0) newurl = "http://"+newurl;
                atags[i].setAttribute("href",newurl);
                atags[i].removeAttribute("onclick");
            }
        }

    }

})();