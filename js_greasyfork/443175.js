// ==UserScript==
// @name         Moby Notify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moby 站点通知
// @author       wujiandao
// @match        https://moby.gg/?tab=Mints
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moby.gg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443175/Moby%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/443175/Moby%20Notify.meta.js
// ==/UserScript==

var a1 = document.querySelector("#main-view > div.border-r.pt-16.lg\\:pt-0.dark\\:border-light-border.border-white-border > div > div:nth-child(2) > div:nth-child(2) > div > div > ul > a:nth-child(1)")
while(a1){
 a1 = a1.innerHTML;
}

async function notifyTimer() {
   var a2 = document.querySelector("#main-view > div.border-r.pt-16.lg\\:pt-0.dark\\:border-light-border.border-white-border > div > div:nth-child(2) > div:nth-child(2) > div > div > ul > a:nth-child(1)").innerHTML;
    if(a1 == a2){
        return;
    }else{
        var a3 = document.querySelector("#main-view > div.border-r.pt-16.lg\\:pt-0.dark\\:border-light-border.border-white-border > div > div:nth-child(2) > div:nth-child(2) > div > div > ul > a:nth-child(1) > li > div > div > div.min-w-0.flex-1.flex.items-center > div.flex-1.px-4.md\\:grid.md\\:gap-4 > div > div.text-sm.flex.items-center.font-bold.text-gray-700.dark\\:hover\\:text-blue-400.hover\\:text-blue-500.dark\\:text-gray-100.truncate > a");
        var icon = document.querySelector("#main-view > div.border-r.pt-16.lg\\:pt-0.dark\\:border-light-border.border-white-border > div > div:nth-child(2) > div:nth-child(2) > div > div > ul > a:nth-child(1) > li > div > div > div.min-w-0.flex-1.flex.items-center > div.rounded-full.items-center.content-center.justify-center.overflow-hidden.w-10.h-10 > img");
        a1 = a2;
        var notify = new Notification("moby notify",{
            body: a3.text,
            icon: icon.src,
            tag: 'moby',
            renotify: true
        });
        notify.onclick = e => {
            window.open(a3.href);
        }
    }
}
(function() {
    'use strict';
setInterval(notifyTimer,200)
    // Your code here...
})();