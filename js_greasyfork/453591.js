// ==UserScript==
// @name         直播间默认全屏并隐藏评论
// @namespace    mscststs
// @version      0.2
// @description  进入直播间后默认网页全屏
// @author       mscststs
// @include     /^https:\/\/live\.bilibili\.com\/(?:blanc\/)?\d/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1025381
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453591/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E5%85%A8%E5%B1%8F%E5%B9%B6%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/453591/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E5%85%A8%E5%B1%8F%E5%B9%B6%E9%9A%90%E8%97%8F%E8%AF%84%E8%AE%BA.meta.js
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
        document.querySelector("video").dispatchEvent(click);
        let re = await mscststs.wait("#aside-area-toggle-btn");
        re.dispatchEvent(new Event("click"))
        //re.className = re.className.replace(" hide-aside-area", "");
    }
})();