// ==UserScript==
// @name         FB Mobile: Last Online Activity
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get last active time
// @author       You
// @match        https://m.facebook.com/messages/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39137/FB%20Mobile%3A%20Last%20Online%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/39137/FB%20Mobile%3A%20Last%20Online%20Activity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var el = document.querySelector(".fbLastActiveTimestamp abbr");
    if (el)
    {
        var json = JSON.parse(el.getAttribute("data-store"));
        var ltime = +json.time;
        function gettime(t){
            function lz(x){x<<=0;var p=x<10?"0"+x:x+"";return p=="00"?"":p+":";}
            var d=lz(t/86400);
            var h=lz(t/3600%24);
            var m=lz(t/60%60);
            var s=lz(t%60);
            var r = d+h+m+s;
            return r.slice(0,-1);
        }//
        var ttime = gettime(new Date/1e3-ltime), lat = new Date(ltime*1e3);
        var ne = document.createElement("span");
        ne.innerHTML = `<abbr>`+ttime + " (" + lat + ")"+`</abbr>`;
        ne.setAttribute("class", "fbLastActiveTimestamp mfss fcg");
        ne.setAttribute("style", "display:block");
        el.parentNode.appendChild(ne);
        console.warn("Elapsed:", ttime);
        console.warn("Last Active Date:", lat);
    }
    // Your code here...
})();