// ==UserScript==
// @name         知乎刷新时滚动页面到顶部并关闭广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       shihuang
// @match        https://www.zhihu.com/
// @include        *://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434181/%E7%9F%A5%E4%B9%8E%E5%88%B7%E6%96%B0%E6%97%B6%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%E5%88%B0%E9%A1%B6%E9%83%A8%E5%B9%B6%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/434181/%E7%9F%A5%E4%B9%8E%E5%88%B7%E6%96%B0%E6%97%B6%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%E5%88%B0%E9%A1%B6%E9%83%A8%E5%B9%B6%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var closeIcon = document.querySelector('.Topstory--old svg');
    if (closeIcon) {
        closeSvgClick(closeIcon)
    } else {
        var times = 0

        var intervalHandler = setInterval(() => {
            var closeIcon = document.querySelector('.Topstory--old svg');
            closeSvgClick()
            times++;
            if (times === 5) clearInterval(intervalHandler)
        }, 1000)
        }




    window.onbeforeunload = function(event){
        window.scrollTo(0, 0);
    }
    window.onload = function() {
        // 以防网速太慢，加载太卡问题
        closeSvgClick()

        // 删除信息流中的广告
        delAdFromAnswerList()
        listenTabClick()
    }

    function closeSvgClick(svgDom) {
        var closeIcon = svgDom || document.querySelector('.Topstory--old svg');
        if (closeIcon) {
            // 创建 svg 点击事件
            var svgEvent = document.createEvent("SVGEvents");
            svgEvent.initEvent("click",true,true);
            closeIcon.dispatchEvent(svgEvent);
        }

    }


    function listenTabClick() {
        var tabs = document.querySelectorAll('nav.TopstoryTabs>a')
        tabs && tabs.forEach(tab =>{
            tab.addEventListener('click', () => {
                var count = 0
                var intervalHandler = setInterval(() => {
                    var list = document.querySelector('#TopstoryContent div[role=list]')
                    if (list || count >= 6) {
                        delAdFromAnswerList()
                        clearInterval(intervalHandler)
                        return
                    }
                    count++
                }, 1000)
                })
        })
    }

    // 关闭嵌套在列表里广告，烦人！
    function delAdFromAnswerList() {
        var list = document.querySelector('#TopstoryContent div[role=list]')

        var delFn = function () {
            if(!list) return
            var ads = list.querySelectorAll('.TopstoryItem--advertCard')
            // 循环删除
            ads.forEach(ad => ad && ad.remove())
        }

        delFn()


        // 当滚动新增了之后，继续删除
        list && list.addEventListener('DOMNodeInserted', function () {
            delFn()
        })
    }
})();