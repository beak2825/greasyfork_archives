// ==UserScript==
// @name         MissavNoPause
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Missav切换页面或者失去焦点都会自动暂停，此插件就是阻止视频自动暂停，不影响空格或者单击导致的暂停。注意：使用manifestV3实现后，可能每次需要手动授权才会运行，首次使用，如果需要授权，请选择总是允许(chrome不需要，firefox需要)，这样下次打开页面就会自动运行了。当游猴不能运行远程脚本时，可以直接安装插件，源代码及更多详情见：https://github.com/ChangShaJackMa/MissavNoPause。
// @author       ChangShaJackMa
// @match        https://missav.com/*
// @icon         https://github.com/ChangShaJackMa/MissavNoPause/tree/main/ExtensionSource_Firefox/noPause.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470465/MissavNoPause.user.js
// @updateURL https://update.greasyfork.org/scripts/470465/MissavNoPause.meta.js
// ==/UserScript==
function run() {
    console.log("I am work")
    document.addEventListener("visibilitychange",(event)=>{
        //console.log("I am document.visibilitychange")
        event.stopImmediatePropagation();
        event.stopPropagation()
    });
    window.addEventListener("blur",(event)=>{
        //console.log("I am window.blur")
        event.stopImmediatePropagation();
        event.stopPropagation()
    });
    document.addEventListener("blur",(event)=>{
        //console.log("I am documetn.blur")
        event.stopImmediatePropagation();
        event.stopPropagation()
    });
};
run()//run_at document_start