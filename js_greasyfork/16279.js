// ==UserScript==
// @name         全局鍵盤功能
// @namespace    https://greasyfork.org/zh-CN/scripts/16279-%E5%85%A8%E5%B1%80%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD
// @version      0.2
// @description  try to take over the world!
// @author       zzzmoz
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16279/%E5%85%A8%E5%B1%80%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/16279/%E5%85%A8%E5%B1%80%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//頁面滾動
function scroll(direction){
    var h=window.innerHeight;
    if(direction<0){
        h=0-h;
    }
    var top=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    window.scroll(0,h+top);
}
//添加全局事件
document.addEventListener("keypress",function(e){
    var ikeyCode=e.keyCode-32;
    console.log("a:........"+ikeyCode);
    console.log(e);
    if(e.target.tagName=="INPUT"|| e.target.tagName=="TEXTAREA"){
        return null;
    }
    switch(ikeyCode){
        case 87://w,只能關閉由他自己打開的window
            window.close();
            break;
        case 74: //j
            scroll(1);
            break;
        case 75: //k
            scroll(-1);
            break;
    }
});
