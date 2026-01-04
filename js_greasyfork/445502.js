// ==UserScript==
// @name         哔哩哔哩（B站）评论区翻页功能
// @description  （2022/09可用）以一种十分不安全的方式强行恢复了哔哩哔哩评论区的翻页功能
// @author       Tinhone
// @namespace    A script by Tinhone
// @license      GPL-3.0
// @version      0.2
// @icon         https://app.bilibili.com/favicon.ico
// @grant        none
// @compatible   firefox V70+
// @compatible   edge V70+
// @compatible   chrome V70+
// @match        *://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/445502/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%BF%BB%E9%A1%B5%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445502/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%BF%BB%E9%A1%B5%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //切记！本脚本十分不安全！请在确认有使用的需要之后再开启本脚本，使用完毕后务必关闭。若使用过程中出现意外状况请立刻关闭脚本！
    //切记！本脚本十分不安全！请在确认有使用的需要之后再开启本脚本，使用完毕后务必关闭。若使用过程中出现意外状况请立刻关闭脚本！
    //切记！本脚本十分不安全！请在确认有使用的需要之后再开启本脚本，使用完毕后务必关闭。若使用过程中出现意外状况请立刻关闭脚本！
    if (window.location.href.split("#")[1]==undefined){
        window.location.replace(window.location.href.split("#")[0]+"#reply1")
        var awa=0
        var owo = setInterval(() => {
            if (document.querySelector("div.common div.comment div.bb-comment div.comment-header.clearfix div.tabs-order ul.clearfix li.hot-sort")){
                document.querySelector("div.common div.comment div.bb-comment div.comment-header.clearfix div.tabs-order ul.clearfix li.hot-sort").click()
                document.documentElement.scrollTop=0 //返回页面顶部
                awa+=1
                if (awa>=2){
                    window.clearInterval(owo) //大于等于二次就关闭setInterval，脚本结束
                }
            }
        },1400)
    }
})();