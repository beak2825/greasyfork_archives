// ==UserScript==
// @name         继续教育自动播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  自用继续教育自动播放
// @author       GGY
// @match        https://www.tampermonkey.net/scripts.php?ext=dhdg
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @include      http://180.101.236.114:8283/rsrczxpx/tec/play*
// @downloadURL https://update.greasyfork.org/scripts/440551/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/440551/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

     // 获取视频播放元素
    window.onload = function () {
        const video = document.getElementById("player-container-id_html5_api");
        // 监听播放暂停
        //video.addEventListener('pause', confimRun);
        //confimRun();
        setInterval(confimRun,30000);
         // 监听播放完成
        video.addEventListener('ended', delayTheNextOne);

        function delayTheNextOne() {
            setTimeout(function () {
                // 获取播放列表元素
                var ctitle=document.getElementsByClassName('backClass2td');
                var caas=ctitle[0].innerHTML;
                var lis = document.getElementById('content').getElementsByTagName('li');
                // 是否触发点击事件
                let isClick = false;
                // 遍历元素，获取待播放的视频
                for (let i = 0; i < lis.length; i++) {
                    let li = lis[i];
                    var ls = li.getElementsByTagName('a');
                    if(ls.length>1){
                         // 设置点击下一个视频
                        var substr=ls[0].title;
                        if(caas.indexOf(substr) < 0){
                            isClick = true;
                        }
                    }
                    // 点击下一个视频
                    if (isClick) {
                        isClick = false;
                        ls[1].click();
                        return;
                    }
                }

            }, 3000)
        }

        function confimRun() {
            //confimRun();
            // 监听播放完成
            if(document.getElementById("player-container-id_html5_api")==null){
                // 获取播放列表元素
                var ctitle1=document.getElementsByClassName('backClass2td');
                var caas1=ctitle1[0].innerHTML;
                var lis1 = document.getElementById('content').getElementsByTagName('li');
                // 是否触发点击事件
                let isClick = false;
                // 遍历元素，获取待播放的视频
                //alert(lis1.length);
                for (let i = 0; i < lis1.length; i++) {
                    let li1 = lis1[i];
                    var ls1 = li1.getElementsByTagName('a');
                    if(ls1.length>1){
                         // 设置点击下一个视频
                        var substr1=ls1[0].title;
                        if(caas1.indexOf(substr1) < 0){
                            isClick = true;
                        }
                    }
                    // 点击下一个视频
                    if (isClick) {
                        isClick = false;
                        ls1[1].click();
                        return;
                    }
                }
            }
            if(video.paused){
                //alert('3322');
                window.location.reload();
            }
            if(video.ended){
                //alert('3322');
                // 获取播放列表元素
                var ctitle=document.getElementsByClassName('backClass2td');
                var caas=ctitle[0].innerHTML;
                var lis = document.getElementById('content').getElementsByTagName('li');
                // 是否触发点击事件
                let isClick = false;
                // 遍历元素，获取待播放的视频
                for (let i = 0; i < lis.length; i++) {
                    let li = lis[i];
                    var ls = li.getElementsByTagName('a');
                    if(ls.length>1){
                         // 设置点击下一个视频
                        //alert(caas);
                        //alert(ls[0].title);
                        var substr=ls[0].title;
                        if(caas.indexOf(substr) < 0){
                            isClick = true;
                        }
                    }
                    // 点击下一个视频
                    if (isClick) {
                        isClick = false;
                        ls[1].click();
                        return;
                    }
                }
            }

        }
        function fireKeyEvent(el, evtType, keyCode){
            var doc = el.ownerDocument,
                win = doc.defaultView || doc.parentWindow,
                evtObj;
            if(doc.createEvent){
                if(win.KeyEvent) {
                    evtObj = doc.createEvent('KeyEvents');
                    evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
                }
                else {
                    evtObj = doc.createEvent('UIEvents');
                    Object.defineProperty(evtObj, 'keyCode', {
                        get : function() { return this.keyCodeVal; }
                    });
                    Object.defineProperty(evtObj, 'which', {
                        get : function() { return this.keyCodeVal; }
                    });
                    evtObj.initUIEvent( evtType, true, true, win, 1 );
                    evtObj.keyCodeVal = keyCode;
                    if (evtObj.keyCode !== keyCode) {
                        console.log("keyCode " + evtObj.keyCode + " å (" + evtObj.which + ") ä¸å¹é");
                    }
                }
                el.dispatchEvent(evtObj);
            }
            else if(doc.createEventObject){
                evtObj = doc.createEventObject();
                evtObj.keyCode = keyCode;
                el.fireEvent('on' + evtType, evtObj);
            }
        }
    }
})();