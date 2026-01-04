// ==UserScript==
// @name         Instagram Persian Date
// @namespace    http://soozanchi.ir/
// @version      0.1
// @description  this script convert all date of Instagram to Shamsi date
// @author       Saleh Souzanchi(https://twitter.com/zoghal)
// @include     https://www.instagram.com/p/*
// @include     http://www.instagram.com/p/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432048/Instagram%20Persian%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/432048/Instagram%20Persian%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        document.querySelectorAll('time[datetime]:not([jalalized]').forEach(item=>{
            var d=item.getAttribute('datetime');
            d = new Date(d);
            d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
            //console.log(d);
            item.innerText =d;
            item.setAttribute('jalalized',"");
        });
    }, 3000);
})();