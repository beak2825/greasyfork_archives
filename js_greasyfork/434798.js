// ==UserScript==
// @name         Rainbow ID
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Rainbow gradient to your site ID
// @author       ootruieo
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434798/Rainbow%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/434798/Rainbow%20ID.meta.js
// ==/UserScript==

//v0.5.1 bug fixed
//v0.5   add option for disable logout & fixed lost frames
//v0.4   add option for zoom & animation
//v0.3   disable logout
//v0.2   修复部分站点未生效的问题

(function() {
    'use strict';

    // Your code here...
    if (window.top !== window.self) return;

    var RainbowZoomId = GM_getValue('RainbowZoomId');
    if(RainbowZoomId === undefined){
        RainbowZoomId = false;
    }
    GM_registerMenuCommand(`放大显示(${RainbowZoomId?'开启':'关闭'})`,function(){
        RainbowZoomId = !RainbowZoomId;
        GM_setValue('RainbowZoomId', RainbowZoomId);
        console.log(`已${RainbowZoomId?'开启':'关闭'}[放大显示]功能(刷新页面后生效)`);
    });

    var RainbowAnimationId = GM_getValue('RainbowAnimationId');
    if(RainbowAnimationId === undefined){
        RainbowAnimationId = false;
    }
    GM_registerMenuCommand(`动态显示(${RainbowAnimationId?'开启':'关闭'})`,function(){
        RainbowAnimationId = !RainbowAnimationId;
        GM_setValue('RainbowAnimationId', RainbowAnimationId);
        console.log(`已${RainbowAnimationId?'开启':'关闭'}[动态显示]功能(刷新页面后生效)`);
    });

    var RainbowDisableLogout = GM_getValue('RainbowDisableLogout');
    if(RainbowDisableLogout === undefined){
        RainbowDisableLogout = false;
    }
    GM_registerMenuCommand(`禁用退出(${RainbowDisableLogout?'开启':'关闭'})`,function(){
        RainbowDisableLogout = !RainbowDisableLogout;
        GM_setValue('RainbowDisableLogout', RainbowDisableLogout);
        console.log(`已${RainbowDisableLogout?'开启':'关闭'}[禁用退出]功能(刷新页面后生效)`);
    });

    var x = document.querySelectorAll("a");
    for (var i = 0; i < x.length; i++) {
        if((((x[i].href.indexOf("userdetails.php") != -1 || x[i].href.indexOf("user.php") != -1) && x[i].href.indexOf("id=") != -1)
            ||x[i].className != null && x[i].className.indexOf('username') != -1)
            && x[i].innerText != '' && x[i].className.indexOf("menu-item") == -1) {
            FindBottomChild(x[i]);
            break;
        }
    }
    if(RainbowDisableLogout){
        for (var j = 0; j < x.length; j++) {
            if(x[j].href.indexOf("logout") != -1 || (x[j].onclick!=null && x[j].onclick.toString().indexOf("logout") != -1)){
                x[j].style.pointerEvents = "none";
                break;
            }
        }
    }

    var fontSize = 0;
    function FindBottomChild(element)
    {
        if(element.className != null && element.className.indexOf('Guarder_Name') == -1 && element.className.indexOf('_Name') != -1){
            element.id = 'siteusername';
        }
        else if(element.hasChildNodes()){
            FindBottomChild(element.childNodes[0]);
        }else{
            element.parentNode.id = 'siteusername';
        }
    }

    if(RainbowAnimationId){
        GM_addStyle(`#siteusername {background-image:linear-gradient(to right, #FF0000 4%,#FF7F00 12%,#FFFF00 20%,#00FF00 29%,#00FFFF 37%,#0000FF 45%,#8B00FF 54%,#0000FF 62%,#00FFFF 70%,#00FF00 79%,#FFFF00 87%,#FF7F00 95%,#FF0000);-webkit-text-fill-color: transparent;${RainbowZoomId? 'font-size: 20px;': ''}-webkit-background-clip: text;-webkit-background-size: 200% 100%;-webkit-animation: maskedAnimation 6s infinite linear alternate;}`);
        GM_addStyle("@keyframes maskedAnimation {0% { background-position: 0 0;} 100% {background-position: -100% 0;}");
    }else{
        GM_addStyle(`#siteusername {background-image:linear-gradient(to right, #FF0000 ,#FF7F00 17%,#FFFF00 34%,#00FF00 50%,#00FFFF 67%,#0000FF 84%,#8B00FF);-webkit-background-clip: text;color: transparent;${RainbowZoomId? 'font-size: 20px;': ''}}`);
    }
})();