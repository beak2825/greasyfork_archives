// ==UserScript==
// @name         turkeyforum yönlendirmesiz link
// @namespace    http://www.turkeyforum.com
// @version      0.1
// @description  turkeyforum'da linklerin başındaki yönlendirme linki olan 50 karakteri siler
// @author       unknown
// @include     http://www.turkeyforum.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391510/turkeyforum%20y%C3%B6nlendirmesiz%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/391510/turkeyforum%20y%C3%B6nlendirmesiz%20link.meta.js
// ==/UserScript==

(function() {
    if(document.URL.indexOf("http://www.turkeyforum.com") !== -1){
        var atags = document.getElementsByTagName("a");
        for(var i = 0; i<atags.length; i++){
            if(atags[i].hasAttribute("href") && atags[i].hasAttribute("target") ){
                var newurl = atags[i].getAttribute("href");
                if(newurl.indexOf("http") < 0) newurl = "http://"+newurl;
                atags[i].setAttribute("href",newurl);
                atags[i].href = atags[i].href.substr(50);

            }
        }

    }

})();