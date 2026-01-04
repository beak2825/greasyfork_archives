// ==UserScript==
// @name         腾讯视频增强
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  关闭弹幕，自动切换分辨率
// @author       Freeman
// @match        *://v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377104/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/377104/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
var a=true;//关闭弹幕，改为false可以禁用
var b=true;//切换分辨率，改为false可以禁用
var index=2;//切换分辨率的默认值，会员1080P为2，超清720P为3，高清480P为4
window.addEventListener ("load", main, false);
if (document.readyState == "complete") {
    main();
}

function main() {
    if(a){
        var btn=document.getElementsByClassName("txp_btn_toggle");
        if(btn.length>0){
            btn[0].click();
        }

    }
    if(b){
        var fhd=document.getElementsByClassName("txp_menuitem");
        if(fhd.length>0){
            fhd[index].click();
        }
    }
}

