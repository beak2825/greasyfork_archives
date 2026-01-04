// ==UserScript==
// @name         直播间默认全屏
// @namespace    mscststs
// @version      0.2
// @description  进入直播间后默认网页全屏
// @author       mscststs
// @include     /^https:\/\/live\.bilibili\.com\/(?:blanc\/)?\d/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1025381
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441235/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/441235/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(async function() {
    'use strict';



    while( 1 ){
        await mscststs.sleep(300)
        if(window.livePlayer){
            init();
            return;
        }
    }



    async function init(){
        await mscststs.wait("video");
        let click = new Event("dblclick", {bubbles:true});
        document.querySelector("video").dispatchEvent(click)
    }
})();