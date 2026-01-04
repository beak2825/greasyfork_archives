// ==UserScript==
// @name         自动拒绝合作
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动拒绝合作消息
// @author       You
// @match        https://haohuo.jinritemai.com/ecommerce/trade/detail/*
// @match        https://buyin.jinritemai.com/mpa/pigeonIM*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516029/%E8%87%AA%E5%8A%A8%E6%8B%92%E7%BB%9D%E5%90%88%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516029/%E8%87%AA%E5%8A%A8%E6%8B%92%E7%BB%9D%E5%90%88%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer = true
    let style = `
        <style>
            a, div, img {
                -webkit-user-select:auto!important;
                user-select:auto!important
            }
        </style>
    `
    document.body.insertAdjacentHTML("beforeend", style)
    function auto(i) {
        if(timer) {
            let scrollDom = document.querySelector('.ReactVirtualized__Grid.ReactVirtualized__List')
            // 如果滚动条还没到最底部
            if(scrollDom.scrollTop < scrollDom.scrollHeight) {
                document.querySelectorAll('.ContactCard_contactCard_Diss1')[i].click()
                setTimeout(() => {
                    if(document.querySelectorAll('.QuickOperationArea_area-button_9_89m')[1]) document.querySelectorAll('.QuickOperationArea_area-button_9_89m')[1].click()
                    if(i >= 20) {
                        i = 0
                    }else {
                        i++
                    }
                    auto(i)
                },1000)
            }
        }
    }
    window.addEventListener('keydown', function (e) {
        if(e.altKey && e.keyCode == 192) {
            // alt + ~
            let i = 0
            timer = true
            auto(i)
        }else if(e.altKey && e.keyCode == 27) {
            // 暂停
            timer = false
        }
    })
    // Your code here...
})();