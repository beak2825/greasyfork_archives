// ==UserScript==
// @name         WAY-HEE mass reply 4chan
// @include      http://boards.4channel.org/*
// @include      https://boards.4channel.org/*
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @description:en    Mass reply to everyone and WAY-HEE!
// @version 0.0.1.20200402141949
// @namespace https://greasyfork.org/users/473762
// @description Mass reply to everyone and WAY-HEE!
// @downloadURL https://update.greasyfork.org/scripts/399350/WAY-HEE%20mass%20reply%204chan.user.js
// @updateURL https://update.greasyfork.org/scripts/399350/WAY-HEE%20mass%20reply%204chan.meta.js
// ==/UserScript==
 
(function(){
    'use strict';
    function addWH(qr){
        var wayheebtn = document.createElement("button");
        var wayheetext = document.createTextNode("WAY-HEE");
        wayheebtn.setAttribute("style","color:#8ba446;font-size:23px;background-color:#333333");
        wayheebtn.onclick = function(){
            // var arr = Array.from(document.querySelectorAll(".postContainer")).map(e=>{ return ">>"+e.id.slice(2)+" " }).join("")
            var arr = Array.from(document.querySelectorAll(".postContainer")).map(e=>{ return ">>" + e.id.slice(2) })
            document.querySelector('[placeholder="Comment"]').value = arr.slice(Math.max(arr.length - 150, 0)).join(" ") + "\n*WAY-HEE*";
        }
        wayheebtn.appendChild(wayheetext);
        qr.appendChild(wayheebtn);
    }
 
    var checkqrexists = new MutationObserver(function(mutations, me) {
        var qr = document.getElementById('qr');
        if(qr){
            addWH(qr);
            me.disconnect();
            return;
        }
    });
 
    checkqrexists.observe(document, { childList: true, subtree: true });
})();