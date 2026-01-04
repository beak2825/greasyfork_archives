// ==UserScript==
// @name         挂刀站自动排序
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-03-08
// @description  挂刀站自动排序1
// @author       You
// @match        https://www.youpin898.com/goodInfo?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steam.iflow.work
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489352/%E6%8C%82%E5%88%80%E7%AB%99%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489352/%E6%8C%82%E5%88%80%E7%AB%99%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    let aaa = console
    console = {}
    //console.log(123)

    // UUYP
    let eventClick = new MouseEvent("click");

    let chushou = document.querySelector('.tabsNavBar .ant-tabs-nav >  div > div:nth-child(1)')
    if (chushou) {
        chushou.dispatchEvent(eventClick);


        /*
        const observer = new MutationObserver(function (mutations, mutationInstance) {
            aaa.log('aaabb')
            let paixu = document.querySelector('.goodsDetail > div > div.ant-select > div')
            aaa.log(paixu)
            if (paixu) {
                aaa.log('aaabbcc')
                aaa.log(paixu)
                setTimeout(()=>{
                aaa.log('dispatchEventdispatchEvent')
                    paixu.dispatchEvent(new MouseEvent("click"));
                },1000)
                mutationInstance.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        */
    }

})();