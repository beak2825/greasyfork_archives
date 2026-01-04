// ==UserScript==
// @name         粤嵌自动签到
// @namespace    xiyu
// @version      0.5
// @description  粤嵌自动签到脚本：会在1到3秒内进行自动签到
// @author       xiyu
// @homepage     https://greasyfork.org/zh-CN/scripts/400130-%E7%B2%A4%E5%B5%8C%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0
// @include        *://www.geconline.cn/*
// @include        *://open.talk-fun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400130/%E7%B2%A4%E5%B5%8C%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/400130/%E7%B2%A4%E5%B5%8C%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
    }
    
    let main = function() {
     switch(window.location.host) {
        case "www.geconline.cn":
            {
                let reg = /.*\/live_entry/
                let isEntry = reg.test(window.location.pathname)
                if(isEntry) {
                    let go = function() {
                        let a = document.querySelector("body > iframe")
                        if (a) {
                            window.location = a.src
                        }
                    }
                    setInterval(go, 500);
                }
            }
            break;
        case "open.talk-fun.com":
            {
                // in room
                let reg = /room/
                let isRoom = reg.test(window.location.pathname)
                if(isRoom) {
                    var observer = new MutationObserver(function (mutations, observer) {
                        mutations.forEach(mutationRecord => {
                            mutationRecord.addedNodes.forEach(item => {
                                // console.debug(mutationRecord);
                                // console.debug(item);
                                let button = item.querySelector(".sign_btn > span")
                                if(button) {
                                    setTimeout(()=> {
                                        button.click()
                                        console.log("自动签到成功", new Date())
                                    }, getRandomIntInclusive(1000, 3000))
                                }
                            })
                        })
                    });
                    observer.observe(document.body, {
                        'childList': true,
                    })
                    console.log("自动签到运行中");
                }
            }
            break;
    }
    }
    main();
   
})();