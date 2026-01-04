// ==UserScript==
// @name         页面滚动脚本
// @namespace    http://mooc1.chaoxing.com/ztnodedetailcontroller
// @version      0.12
// @description  页面自动滚动脚本
// @author       xiaoso
// @match        http://mooc1.chaoxing.com/ztnodedetailcontroller/visitnodedetail?*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435366/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435366/%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';



        let curY = 0;
        let grow = 1;
        let times = 0;
        let times2 = 0;
        function startscroll(){
            curY += grow * Math.random() * 6;
            times++;
            times2++;
            if(times2>3000){
               let aBtn = document.getElementsByClassName("ml40 nodeItem r")[0];
              aBtn.click();
            }
            window.scrollTo(100,curY);
            if(curY>6000 || times>800){
                times = 0;
                grow = -1;
            }else if(curY<100){
                grow = 1;

            }

        }
        setInterval(startscroll,20)


    // Your code here...
})();