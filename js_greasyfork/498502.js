// ==UserScript==
// @name         找色差脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  玩游戏就得开。。。
// @author       fankq
// @match        https://www.shj.work/tools/secha/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shj.work
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498502/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/498502/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = 0;
    setTimeout(()=>{
        start();
    },1000);
    function start(){
        setTimeout(()=>{
            let dialog = document.getElementById("dialog").style.display
            let room = document.getElementById("room").style.display
            if(dialog == 'none' && room != 'none' && room != '') {
                let box = document.getElementById("box")
                let list = box.getElementsByTagName('span') || []
                var tag = 0;
                var tag2 = 0;
                let list1 = [];
                let list2 = [];
                list1.push(list[0].style.backgroundColor)
                for(var i= 1; i<list.length; i++){
                    let item = list[i];
                    if(list1.includes(item.style.backgroundColor)) {
                        list1.push(item.style.backgroundColor)
                        tag = i
                    } else {
                        tag2 = i
                    }
                }
                if(list1.length == 1) {
                    console.log(tag);
                    list[tag].click()
                } else {
                    console.log(tag2);
                    list[tag2].click()
                }
                count = 0;
                start()
            }else {
                count++;
                if(count > 100){// 3000
                    console.log('停止')
                    return
                }
                start();
            }
        }, 100)

    };


    // Your code here...
})();