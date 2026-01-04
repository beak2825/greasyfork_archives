// ==UserScript==
// @name         定制脚本
// @namespace    http://tampermonkey.net/
// @version      0.26
// @author       xy
// @match        http://www.hkmt.top/
// @description  定制脚本0.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hkmt.top
// @grant        none
// @license     AGPL3.0
// @downloadURL https://update.greasyfork.org/scripts/453617/%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453617/%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
window.onload = function () {
    {   
        let clickNum = 0;
        const el = document.querySelectorAll(".oprate-buttons")[1].querySelectorAll("div")[3];
        function loop() {
            console.log("脚本正常值守中")
            el.innerText = `立即提交(${clickNum})`;
            if (document.querySelector(".b1")) {
                document.querySelector(".b1").click();
                setTimeout(() => {
                    location.reload();
                },10000)
            }
            if (isClick()) {
                clickNum++;
                el.click()
            }
            setTimeout(() => {
                loop()
            }, 500)
        }
        loop();
        function isClick(){
            let fen = new Date().getMinutes() % 6;
            if(fen === 0 && new Date().getSeconds() === 0){
                return true;
            } else {
                return false;
            }
        }
    }
}
    // Your code here...
})();