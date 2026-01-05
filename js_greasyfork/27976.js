// ==UserScript==
// @name         Steamgifts Entry Helper
// @namespace    https://greasyfork.org/users/101370-fllp
// @version      1.04
// @description  自动检测任意页面SG Giveaway地址并提醒 -> 自动打开所有地址并参加 ->自动关闭所有打开的页面
// @author       fllp
// @include      https://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27976/Steamgifts%20Entry%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27976/Steamgifts%20Entry%20Helper.meta.js
// ==/UserScript==
setTimeout(function() {
    var links=document.querySelectorAll('a[href*="steamgifts.com/giveaway/"]');
    var windows=[];
    if(links.length>1){
        if(window.location.href.indexOf("steamgifts.com/giveaway/") < 1) {
    if (confirm('检测到'+links.length+'个Giveaways，是否打开所有页面并参加然后自动关闭？（关闭页面的时间延迟与打开页面的个数有关）')) {
        for(var i=0;i<links.length;i++){
            if (i == links.length - 1) {
                setTimeout(function() {
                for(var c=0;c<links.length;c++){
                    windows[c].close();
                }
                },1800*(links.length));
            }
    // Open it!
                windows[i]=window.open(links[i].href,"_blank");
        }
} else {
    // Do nothing!
}
        }else{

                      }
    }
        },2000);
var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function () {
        if (   this.lastPathStr  !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
        ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            init();
        }
    }
    , 200
);
function init(){setTimeout(function() {
     setTimeout(function() {
     var sb =document.getElementsByClassName("sidebar__entry-insert");
         sb[0].click();
},800);
               });
               }