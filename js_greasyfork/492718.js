// ==UserScript==
// @name         菜鸟教程助手
// @namespace    https://www.runoob.com/
// @version      0.2.0
// @description  优化菜鸟教程体验,控制滚动条，方便学习。
// @author       李恒道\冷山哥哥
// @match        http*://www.runoob.com/*
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492718/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492718/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    //ggnb 哥哥牛逼，哥哥你是最棒的
    //首先控制左侧整体的列表栏，让他对用户可见
    let ggnb = document.querySelector(".left-column")
    ggnb.scrollIntoView()
    //主宏队列，网页列表需要一次用户滚动触发渲染和resize，如果脚本只运行一次就会导致被网页的操作覆盖掉。
    setTimeout(() => {
        ggnb.scrollIntoView()
        //scriptcat 脚本管理器我只用脚本猫。开源、开放、请支持脚本猫。
        //获取左侧的教程所有项，与地址栏的url进行匹配，如果匹配一致则滚动列表栏到相应的教程标题位置，方便你点击学习。
        let scriptcat = document.querySelectorAll(".design>a")
        for (let index = 0; index < scriptcat.length; index++) {
            if (window.location.href == scriptcat[index].href) {
                scriptcat[index].scrollIntoView()
            }

        }
        //gghs 哥哥请喝水！！！
        //控制右侧主教程界面滚动到内容部分
        let gghs = document.querySelector(".article-body")
        gghs.scrollIntoView()
    }, 0)

    // Your code here...
})();