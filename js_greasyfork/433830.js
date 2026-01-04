// ==UserScript==
// @name         xsss
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  you know what
// @author       xsss
// @match        *://www.zhihu.com
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433830/xsss.user.js
// @updateURL https://update.greasyfork.org/scripts/433830/xsss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function have_video(dom) {
        // console.log(dom);
        let attr = dom.dataset;
        if (!attr) {
            return false;
        }
        if (attr.zop) {
            let mp = JSON.parse(attr.zop);
            if (mp.type == "zvideo") {
                return true;
            }
        }
        if (attr.zaExtraModule) {
            let mp = JSON.parse(attr.zaExtraModule);
            if (mp.card.has_video) {
                return true;
            }
        }
        return false;
    }

    setInterval(function(){
        document.title = "XJOI";

        let list =
            Array.from(document.getElementsByClassName("ContentItem"))
            .concat(Array.from(document.getElementsByClassName("AnswerItem")));
        for (let it of list) {
            if (have_video(it)) {
                console.log("undisplay a video");
                it.parentNode.parentNode
                  .style.display = "none";
            }
        }
    }, 2000);

    setTimeout(function(){
        let setIcon = document.createElement('link');
        setIcon.rel = "shortcut icon";
        setIcon.href = "https://static.production.xjoi.net/images/xjoi-new/favicon.ico";
        document.head.appendChild(setIcon);
    }, 1000);
})();