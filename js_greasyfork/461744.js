// ==UserScript==
// @name         知学云视频不暂停
// @version      1.0
// @description  知学云视频播放不暂停
// @author       海北里
// @namespace    haibeili.com
// @match        *://*.zhixueyun.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461744/%E7%9F%A5%E5%AD%A6%E4%BA%91%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/461744/%E7%9F%A5%E5%AD%A6%E4%BA%91%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==
(function() {
    setInterval(autoContinue, 1000);
    function autoContinue() {

        var containerEle = document.querySelector(".alert-shadow.new-alert-shadow");
        var playFlag = document.querySelector(".vjs-play-control.vjs-control.vjs-button.vjs-playing");
        if(playFlag){
            setTimeout(updateZxyPlayFlag, 5, true);
        }else{
            setTimeout(updateZxyPlayFlag, 3000, false);
        }

        if(containerEle !=null && containerEle.style !=null && containerEle.style.display != 'none'){
            if(window.zxyPlayFlag){
                var continueBtn = containerEle.querySelector(".btn-ok.btn");
                if (continueBtn && continueBtn.click) {

                    var imitateMousedown = document.createEvent("MouseEvents");
                    imitateMousedown.initEvent("mousedown", true, true);
                    continueBtn.dispatchEvent(imitateMousedown);
                    continueBtn.click();

                    if (console && console.log) {
                        console.log('找到并点击了[继续学习]');
                    }
                }
            }else{
                console.log('暂停了不点击播放');
            }
        }
    }

    function updateZxyPlayFlag(flag) {
        window.zxyPlayFlag = flag;
    }
})();