// ==UserScript==
// @name     知乎回答界面排版、字体、字号优化
// @namespace JohnRowton
// @version  20200405
// @descriptio  本脚本用于优化知乎(zhihu.com)在PC上的Chrome等主流浏览器上的阅读体验。
// @author   JohnRowton
// @match        https://www.zhihu.com/follow
// @match        https://www.zhihu.com/hot
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/search?*
// @match        https://www.zhihu.com
// @match        https://zhuanlan.zhihu.com/p/*
// @description 通过拉伸回答区域的屏幕占比、修改回答字体(微软雅黑)、增大字号(24px)、图片居中来增强1080P荧幕上的阅读体验。
// @downloadURL https://update.greasyfork.org/scripts/399469/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E7%95%8C%E9%9D%A2%E6%8E%92%E7%89%88%E3%80%81%E5%AD%97%E4%BD%93%E3%80%81%E5%AD%97%E5%8F%B7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399469/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E7%95%8C%E9%9D%A2%E6%8E%92%E7%89%88%E3%80%81%E5%AD%97%E4%BD%93%E3%80%81%E5%AD%97%E5%8F%B7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict'
    var path = location.pathname.slice(0);
        (function () {
            // 修改主页样式
            if (path == '/' || path == '/follow' || path == '/hot') {
                // 定制主框
                var node3 = document.querySelector(".Topstory-container")
                node3.style.width = '97%'
                var inner = document.querySelector('.Topstory-mainColumn')
                inner.style.width = '100%'
                inner.style.fontFamily = 'Times New Roman,微软雅黑'
                inner.style.fontSize = '24px'
                // 定制评论栏
                let doCSS = document.createElement('style')
                doCSS.innerHTML += '.RichContent-actions{height:12px !important;}'
                doCSS.innerHTML += ".Topstory-noMarginCard,.TopstoryItem-isRecommend,.ContentItem-actions,.AppHeader,#root,.TopstoryItem,.HotItem,.HotListNav-wrapper,.CommentsV2 ,.Topbar,.CommentsV2-footer{background-color: ffffff !important}"
                doCSS.innerHTML += '.VoteButton{color:#999 !important;background: ffffff !important;height:12px !important}'
                doCSS.innerHTML += ".ContentItem-title {font-size: 22px;}"
                doCSS.innerHTML += ".HotListNav-item{background-color: #bad889 !important}"
                //图片和视频的显示区域大小
                doCSS.innerHTML += '.origin_image{max-width:500px !important}'
                doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
                //文章内代码区
                doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
                document.getElementsByTagName('head')[0].appendChild(doCSS)
            }
        })();
        (function () {
            //修改专栏样式
            if (path.match(/\/p\/\d+/g)) {
                    window.onload = function () {
                    //正文
                    var contentTxt = document.querySelector('.Post-RichTextContainer')
                    contentTxt.style.width = '95%'
                    contentTxt.style.fontSize = '30px'
                    contentTxt.style.fontFamily = 'Times New Roman,微软雅黑'
                    contentTxt.style.backgroundColor = 'ffffff'
                    //推荐框
                    var inner7 = document.querySelector('.Post-NormalSub>div.Recommendations-Main')
                    inner7.style.width = '100%'
                    inner7.style.backgroundColor = 'ffffff'
                    //评论框
                    var inner8 = document.querySelector('.Post-NormalSub>div.Comments-container')
                    inner8.style.width = '100%'
                    inner8.style.backgroundColor = 'ffffff'
                    var inner9 = document.querySelector(".CommentsV2-withPagination")
                    inner9.style.backgroundColor = 'ffffff'
                    // 评论栏定制
                    let doCSS = document.createElement('style')
                    doCSS.innerHTML += '.RichContent-actions {bottom:auto !important;background-color: ffffff !important}'
                    doCSS.innerHTML += '.VoteButton,.ContentItem-actions,.Topbar,.CommentsV2-footer,.App-main{background-color: ffffff !important}'
                    //图片和视频的显示区域大小
                    doCSS.innerHTML += '.origin_image,.TitleImage{max-width:500px !important}'
                    doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
                    //文章内代码区
                    doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
                    document.getElementsByTagName('head')[0].appendChild(doCSS)
                }

            }
        })();
        (function () {
            //这里修改回答页的样式
            if (path.match(/\/question\/\d+/g)) {
                window.onload = function () {
                    //修改回答区的宽度，字体大小
                    var inner0 = document.querySelector('.Question-main')
                    inner0.style.width = '97%'
                    var inner = document.querySelector('.Question-mainColumn')
                    inner.style.width = '100%'
                    inner.style.fontSize = '30px'
                    inner.style.fontFamily = 'Times New Roman,微软雅黑'
                    // 评论栏定制
                    let doCSS = document.createElement('style')
                    doCSS.innerHTML += '.RichContent-actions{bottom:auto !important}'
                    doCSS.innerHTML += '.VoteButton{color:#999 !importantbackground: none !important}'
                    doCSS.innerHTML += '.QuestionHeader,.QuestionHeader-footer,#root,.List,.ContentItem-actions,.CommentsV2,.Topbar,.CommentsV2-footer{background-color: ffffff !important}'
                    //图片和视频的显示区域大小
                    doCSS.innerHTML += '.origin_image{max-width:500px !important}'
                    doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
                    //文章内代码区
                    doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
                    document.getElementsByTagName('head')[0].appendChild(doCSS)
                }
            }
        })();
    (function () {
        // 搜索页定制
        if (path.match(/\/search?.*/g)) {
            //修改正文区域
            var inner0 = document.querySelector('.Search-container')
            inner0.style.width = '100%'

            var inner1 = document.querySelector('.SearchMain')
            inner1.style.width = '100%'
            inner1.style.fontFamily = 'Times New Roman,微软雅黑'
            inner1.style.fontSize = '26px !important'
            // 定制评论栏
            let doCSS = document.createElement('style')
            doCSS.innerHTML += '.RichContent-actions{height:12px !important;}'
            doCSS.innerHTML += ".Topstory-noMarginCard,.TopstoryItem-isRecommend,.ContentItem-actions,.AppHeader,#root,.TopstoryItem,.SearchTabs,.HotItem,.HotListNav-wrapper,.CommentsV2 ,.Topbar,.CommentsV2-footer,.SearchResult-Card{background-color: ffffff !important}"
            doCSS.innerHTML += '.VoteButton{color:#999 !important;background: ffffff !important;height:12px !important}'
            doCSS.innerHTML += ".ContentItem-title {font-size: 22px !important;};.RichText {font-size: 20px !important;}"
            doCSS.innerHTML += ".HotListNav-item{background-color: #bad889 !important}"
            //图片和视频的显示区域大小
            doCSS.innerHTML += '.origin_image{max-width:500px !important}'
            doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
            //文章内代码区
            doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
            document.getElementsByTagName('head')[0].appendChild(doCSS)
        }
    })();
})()