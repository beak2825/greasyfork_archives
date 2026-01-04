// ==UserScript==
// @name         自动刷卡包
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动刷新开智卡包
// @author       氦客船长<TanGuangZhi@qq.com>
// @match        https://m.openmindclub.com/stu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js

// @downloadURL https://update.greasyfork.org/scripts/427271/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%8D%A1%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/427271/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%8D%A1%E5%8C%85.meta.js
// ==/UserScript==

(function () {
    var time =521;
    $('#root').before('<input type="button" id="google" value="刷520个卡包" class="btn self-btn bg s_btn" style="background-color:#a8a8a8;" />');
    $('#google').after('<input type="button" id="stop" value="停止" class="btn self-btn bg s_btn" style="background-color:#a8a8a8;" />');
    $("#google").click(function () {
        time = 0
        setInterval()
    });
     $("#stop").click(function () {
         time=521
    });

    setInterval(function() {
        if (time <= 520) {
             let target = document.querySelector("div#content img.switch-next")
             let target2 = document.querySelector('div#content button[type="button"]')
                 if(target){
                     target.click()
                 if(target2){
                     target2.click();
                 }
             }
            time++;
        } else {
            return;
        }
    }, 500);

    /**
    * 监测页面地址
    * @param path    页面地址片段
    * @param time    延时，负数：延时->执行，正数：执行->延时
    * @param desc
    * @returns {Promise<unknown>}
    */
    function obsPage(path, time = 0, desc = 'page') {
        return new Promise(resolve => {
            //obs page
            let page = setInterval(() => {
                if (location.href.toLowerCase().search(path.toLowerCase()) > -1) {
                    clearInterval(page)
                    if (time < 0) {
                        setTimeout(() => {
                            console.log(desc, path)
                            resolve(path)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        setTimeout(() => {
                            console.log(desc, path)
                            resolve(path)
                        }, Math.abs(time) * 1000)
                    } else {
                        console.log(desc, path)
                        resolve(path)
                    }
                } else {
                    return
                }
            }, 100)
        })
    }
    // $('#root').before('<input type="button" id="autoClick" value="自动点击" class="btn self-btn bg s_btn" style="background-color:grey;" onclick="autoClick" />');
    // $("#autoClick").click(function() {
    //     autoClick();
    // });
    // function autoClick(){
    //     console.log("1")
    //     var btn = document.getElementsByClassName("div#content img.switch-next")
    //     btn.click();
    //     console.log("2")
    // }
})();