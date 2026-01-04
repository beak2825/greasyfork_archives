// ==UserScript==
// @name         chatglm.cn clean
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  紧凑chatglm.cn网站
// @author       zsz
// @match        https://chatglm.cn/main/alltoolsdetail
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatglm.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498211/chatglmcn%20clean.user.js
// @updateURL https://update.greasyfork.org/scripts/498211/chatglmcn%20clean.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loop(){
        var els=document.querySelectorAll("aside")
        console.log('looping')
        if(els.length>0){
            if(els[0].style.display!="none"){
                els[0].style.display = "none";
                return;
            }
        }
        setTimeout(loop,1000);
    }
    loop();
})();