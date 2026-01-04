// ==UserScript==
// @name         buff饰品挂刀比例
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0.0
// @description  简单的计算挂刀比例脚本，仅在饰品详情界面有效，仅使用buff自带的数据
// @author       Logs404
// @match        https://buff.163.com/goods/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455728/buff%E9%A5%B0%E5%93%81%E6%8C%82%E5%88%80%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455728/buff%E9%A5%B0%E5%93%81%E6%8C%82%E5%88%80%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==
let lock = 0;
let sell = 0;
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function calc() {
    // 计算比例
    if (lock == 0) {
        lock = 1;
        while (document.querySelector("table .selling .f_Strong") == null) {
            console.log("等待数据加载...")
            await sleep(500);
        }
        document.querySelectorAll("table .selling .f_Strong").forEach(bye => {
            let buy = bye.textContent.split(" ")[1] - 0;
            let small = document.createElement("small")
            let bl = (buy / sell).toFixed(2)
            small.textContent = `${bl}`
            bye.parentElement.appendChild(small)
        })
        await sleep(50)
        lock = 0;
    }

}
(async function () {
    'use strict';
    // 计算实际收款
    document.querySelector(".detail-cont .f_Strong small").remove()
    sell = ((document.querySelector(".detail-cont .f_Strong").textContent.split(" ")[1] - 0) * .85).toFixed(2);
    let node = document.querySelector(".detail-cont .detail-summ>span").cloneNode(true);
    node.querySelector("label").textContent = '实际收款|'
    node.querySelector("strong big").textContent = parseInt(sell - 0)
    node.querySelector("strong big").nextSibling.textContent = '.' + sell.split(".")[1]
    let aa = document.querySelector(".detail-cont .detail-summ>a");
    document.querySelector(".detail-cont .detail-summ").insertBefore(node, aa)

    //计算比例
    calc()

    // 监听翻页
    var observe = new MutationObserver(() =>{
        console.log('change')
        calc()
    });
    observe.observe(document.querySelector(".detail-tab-cont"), { childList: true });

})();