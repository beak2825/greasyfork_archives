// ==UserScript==
// @name         修复Discuz下一页滚动
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Discuz论坛在Chromium新版本下，点击下一页会滚动到最下面，导致难以识别刚才看到哪个帖子，这个脚本用来恢复以前的行为：点击下一页后不滚动。
// @author       rcocco
// @match        http*://*/*forum-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409932/%E4%BF%AE%E5%A4%8DDiscuz%E4%B8%8B%E4%B8%80%E9%A1%B5%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/409932/%E4%BF%AE%E5%A4%8DDiscuz%E4%B8%8B%E4%B8%80%E9%A1%B5%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let checkNextExist = setInterval(function(){
        let nextButton = document.querySelector("#autopbn");
        if(nextButton !== null){
            clearInterval(checkNextExist);
            nextButton.addEventListener("click", () => {
                let oldLastChild = document.getElementById("threadlisttableid").lastElementChild;
                let yOffset = window.pageYOffset;
                let checkNextLoaded = setInterval(function(){
                    if(oldLastChild !== document.getElementById("threadlisttableid").lastElementChild){
                        clearInterval(checkNextLoaded);
                        window.scrollTo({top:yOffset});
                    }
                },100);
            });
        }
    },100);
})();