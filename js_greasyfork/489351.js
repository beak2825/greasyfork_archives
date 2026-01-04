// ==UserScript==
// @name         知乎简洁浏览脚本
// @namespace    dreamcenter
// @version      2024-03-09
// @description  浏览知乎内容时，自动关闭登录，并且显示全部
// @author       dreamcenter
// @license      GPLv3
// @match        https://www.zhihu.com/question/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489351/%E7%9F%A5%E4%B9%8E%E7%AE%80%E6%B4%81%E6%B5%8F%E8%A7%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489351/%E7%9F%A5%E4%B9%8E%E7%AE%80%E6%B4%81%E6%B5%8F%E8%A7%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var item
    window.onload=function(){
        document.title="~%?…,# *'☆&℃$︿★?"

        // 自动关闭登录
        let closeEl = document.getElementsByClassName('Modal-closeButton')
        closeEl[0].click()

        // 自动去除侧边栏
        let sideEl = document.getElementsByClassName('Question-sideColumn')
        sideEl[0].style.opacity=0

        // 自动去除标题
        let titleEls = document.getElementsByClassName('AppHeader')
        for(item of titleEls){
            item.style.display='none'
        }

        // 查看全部
        let viewAllEl = document.getElementsByClassName('ViewAll-QuestionMainAction')
        if (viewAllEl.length != 0 ) viewAllEl[0].click()

        // 关闭后登录
        setInterval(() => {
            let afLoginEls = document.getElementsByClassName('css-1wq6v87')
            console.log(afLoginEls)
            for(item of afLoginEls){
                item.style.display='none'
            }
        }, 5000)

    };
})();