// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http*://www.sayhuahuo.com/forum.php?mod=post&action=edit*
// @include      http*://www.sayhuahuo.com/*thread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419013/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/419013/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.includes('edit')){
        document.querySelector('#typeoption_gameLink').onblur=function(){
        document.querySelector('#typeoption_gamePassword').value=this.value.match(/链接:([\d\D]*) 提取码:([\d\w]*)/)[2];
        this.value=this.value.match(/链接:([\d\D]*) 提取码:([\d\w]*)/)[1];
        }
    }
    if(location.href.includes('thread')){
        document.querySelector('tbody > tr:nth-child(1) > td.plc > div.pct > div > div.typeoption > table > tbody > tr:nth-child(7)> td').onmouseenter=function(){
            document.onselectstart= function(){};
            document.documentElement.style.userSelect='auto';
        }
        document.querySelector('tbody > tr:nth-child(1) > td.plc > div.pct > div > div.typeoption > table > tbody > tr:nth-child(7) > td').onmouseleave=function(){
            document.onselectstart= function(e){e.preventDefault();};
            document.documentElement.style.userSelect='none';
        }
    }
    // Your code here...
})();