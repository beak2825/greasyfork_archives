// ==UserScript==
// @name         腾讯课堂自动签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  腾讯课堂的自动签到，会在1-3秒内，自动签到
// @author       xiyu
// @homepage     https://greasyfork.org/zh-CN/scripts/401198-%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0
// @match        https://ke.qq.com/webcourse/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401198/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/401198/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css";
    document.head.appendChild(link);

    function toastr_success_tip(message, time=3000) {
        toastr.success(message, "", {
            timeOut: time,
            closeButton: true,
        })
    }

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }
    function main() {
     var observer = new MutationObserver(function (mutations, observer) {
                        mutations.forEach(mutationRecord => {
                            mutationRecord.addedNodes.forEach(item => {
                                // console.debug(mutationRecord);
                                // console.debug(item);
                                let button = item.querySelector("div.sign-dialog > div.im-dialog-wrap > div > div.btn-group > span")
                                if(button) {
                                    setTimeout(()=> {
                                        button.click()
                                        let str = `自动签到成功: ${new Date()}`
                                        toastr_success_tip(str, 0)

                                        console.log(str)
                                        setTimeout(()=> { button.click()}, 700);
                                    }, getRandomIntInclusive(1000, 3000))
                                }
                            })
                        })
                    });
        observer.observe(document.querySelector("#react-body"), {
            'childList': true,
        })
        toastr_success_tip("自动签到运行中")
        console.log("自动签到运行中");
    }
    main();
})();