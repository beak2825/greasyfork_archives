// ==UserScript==
// @license MIT
// @name         ata 演示模式
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  给 ata 添加演示模式按钮
// @author       You
// @match        https://ata.alibaba-inc.com/articles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alibaba-inc.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459503/ata%20%E6%BC%94%E7%A4%BA%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/459503/ata%20%E6%BC%94%E7%A4%BA%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    console.log("好的，我们开始添加全屏按钮。");
    let myId="guangfeng_fullscreen"

    function hook(){
        var fullscreenButton=document.createElement('a');
        fullscreenButton.id=myId
        fullscreenButton.text="📺 进入演示模式";
        fullscreenButton.href="javascript:document.querySelectorAll('div[class^=left_],div[class^=nav_],div[class^=widget_]').forEach(el => el.style.display = 'none');document.querySelector('div[class^=body_] > div[class^=content_] > div[class^=content-inner_]').style.maxWidth='none';document.querySelector('div[class^=right_]').style.maxWidth='150px';document.querySelector('div[class^=right_]').style.minWidth='150px';localStorage.setItem('article-zoom-level','5');document.documentElement.requestFullscreen()";
        document.querySelector('div[class^=meta-action_]').appendChild(fullscreenButton);
        
    };

    var hookInterval = setInterval(function(){
        if(document.querySelector("#"+myId)){
            clearInterval(hookInterval);
            console.log("停止检查，注入成功。");
        }else{
            hook();
        }
    }, 200);
})();