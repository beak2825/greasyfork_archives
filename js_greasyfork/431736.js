// ==UserScript==
// @name         Twitter Persian Date
// @namespace    http://soozanchi.ir/
// @version      0.3.0
// @description  this script convert all date of twitte to shamsi date
// @author       Saleh Souzanchi(https://twitter.com/zoghal)
// @include     https://twitter.com/*
// @include     http://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431736/Twitter%20Persian%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/431736/Twitter%20Persian%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        document.querySelectorAll('time[datetime]:not([jalalized]').forEach(item=>{
            var d=item.getAttribute('datetime');
            d = new Date(d);
            d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
            //            console.log(d);
            item.innerText =d;
            item.setAttribute('jalalized',"");
            item.setAttribute('dir','ltr');
        });

        document.querySelectorAll("article[role='article'] > div > div > div >div >div:nth-of-type(3) a[href^='/'][role='link'] > span:not([jalalized]").forEach(item=>{
            var d=item.innerText;
            d =d.replace('·','');
            d = new Date(d);
            d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
            console.log(d);
            item.innerText =d;
            item.setAttribute('jalalized',"");
            item.setAttribute('dir','ltr');
        });
        document.querySelectorAll("article[role='article'] > div > div > div >div >div:nth-of-type(4) a[href^='/'][role='link'] > span:not([jalalized]").forEach(item=>{
            var d=item.innerText;
            d =d.replace('·','');
            d = new Date(d);
            d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
            console.log(d);
            item.innerText =d;
            item.setAttribute('jalalized',"");
            item.setAttribute('dir','ltr');
        });

    }, 3000);
})();