// ==UserScript==
// @name              屏蔽百度广告
// @namespace         hyddg@outlook.com
// @version           0.27
// @description       测试
// @author            hyddg@outlook.com
// @match             *://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/374809/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/374809/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
{
    setInterval(()=> {
        //删除搜索广告
        let ads = document.querySelectorAll("#content_left>:not(.c-container):not(.hit_top_new)");
        ads.forEach(e=> {
            e.parentNode.removeChild(e);
        });
        let contents = document.querySelectorAll("#content_left>.c-container");
        contents.forEach(e=> {
            let adText = e.querySelector(".result>.f13>.m");
            if (adText && adText.innerText == "广告") {
                e.parentNode.removeChild(e)
            }
        });
        let fyb = document.querySelector(".FYB_RD");
        if (fyb) {
            fyb.parentNode.removeChild(fyb);
        }
        let adWidget = document.querySelector(".ad-widget");
        if (adWidget) {
            adWidget.parentNode.removeChild(adWidget);
        }
    }, 1500);
}