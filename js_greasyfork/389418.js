// ==UserScript==
// @name         知乎排版修改
// @namespace    https://github.com/chthub/changeZhiHuCSS
// @version      2.0.1
// @author       CH
// @description  修改了一些排版样式
// @match        https://www.zhihu.com/follow
// @match        https://www.zhihu.com/hot
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/search?*
// @match        https://www.zhihu.com
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389418/%E7%9F%A5%E4%B9%8E%E6%8E%92%E7%89%88%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/389418/%E7%9F%A5%E4%B9%8E%E6%8E%92%E7%89%88%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict'
    var path = location.pathname.slice(0);
        (function () {
            // 修改主页样式
            if (path == '/' || path == '/follow' || path == '/hot') {
                //移除右侧栏
                var node1 = document.querySelector('.GlobalSideBar')
                node1.remove()
                //移除反馈框
                var node2 = document.querySelector('.CornerButtons')
                node2.remove()
                // 定制主框
                var node3 = document.querySelector(".Topstory-container")
                node3.style.width = '97%'
                node3.style.backgroundColor = '#d8e2c8'
                var inner = document.querySelector('.Topstory-mainColumn')
                inner.style.width = '100%'
                inner.style.fontFamily = 'Times New Roman,楷体'
                inner.style.fontSize = '22px'
                // 定制评论栏
                let doCSS = document.createElement('style')
                doCSS.innerHTML += '.RichContent-actions{height:12px !important;}'
                doCSS.innerHTML += ".Topstory-noMarginCard,.TopstoryItem-isRecommend,.ContentItem-actions,.AppHeader,#root,.TopstoryItem,.HotItem,.HotListNav-wrapper,.CommentsV2 ,.Topbar,.CommentsV2-footer{background-color: #d8e2c8 !important}"
                doCSS.innerHTML += '.VoteButton{color:#999 !important;background: #d8e2c8 !important;height:12px !important}'
                doCSS.innerHTML += ".ContentItem-title {font-size: 22px;}"
                doCSS.innerHTML += ".HotListNav-item{background-color: #bad889 !important}"
                //图片和视频的显示区域大小
                doCSS.innerHTML += '.origin_image{max-width:500px !important}'
                doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
                //文章内代码区
                doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
                document.getElementsByTagName('head')[0].appendChild(doCSS)
                // 固定顶部导航栏
                let header = document.getElementsByTagName('header')[0]
                window.onscroll = function () {
                    header.className = "Sticky AppHeader"
                    let sticky = document.querySelector('.Sticky--holder')
                    if (sticky) {
                        sticky.style.position = "absolute"
                        sticky.style.height = 0
                    }
                }
            }
        })();
        (function () {
            //修改专栏样式
            if (path.match(/\/p\/\d+/g)) {
                    window.onload = function () {
                        //左侧的点赞框
                    window.onscroll = function () {
                        let inner1 = document.querySelector(".Post-SideActions")
                        if (inner1) {
                            inner1.style.visibility = "hidden"
                        }
                    }
                    //上方的导航栏
                    var node = document.querySelector('.ColumnPageHeader-Wrapper')
                    node.remove()
                    //背景颜色
                    var backG = document.querySelector('.Post-content')
                    backG.style.backgroundColor = '#d8e2c8'
                    //正文
                    var contentTxt = document.querySelector('.Post-RichTextContainer')
                    contentTxt.style.width = '95%'
                    contentTxt.style.fontSize = '30px'
                    contentTxt.style.fontFamily = 'Times New Roman,楷体'
                    contentTxt.style.backgroundColor = '#d8e2c8'

                    //右侧的反馈框
                    var inner2 = document.querySelector('.CornerButtons')
                    inner2.remove()
                    //推荐框
                    var inner7 = document.querySelector('.Post-NormalSub>div.Recommendations-Main')
                    inner7.style.width = '100%'
                    inner7.style.backgroundColor = '#d8e2c8'
                    //评论框
                    var inner8 = document.querySelector('.Post-NormalSub>div.Comments-container')
                    inner8.style.width = '100%'
                    inner8.style.backgroundColor = '#d8e2c8'
                    var inner9 = document.querySelector(".CommentsV2-withPagination")
                    inner9.style.backgroundColor = '#d8e2c8'
                    // 评论栏定制
                    let doCSS = document.createElement('style')
                    doCSS.innerHTML += '.RichContent-actions {bottom:auto !important;background-color: #d8e2c8 !important}'
                    doCSS.innerHTML += '.VoteButton,.ContentItem-actions,.Topbar,.CommentsV2-footer,.App-main{background-color: #d8e2c8 !important}'
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
                    // 移除右侧栏
                    var re = document.querySelector('.Question-sideColumn')
                    re.remove()
                    //修改回答区的宽度，字体大小
                    var inner0 = document.querySelector('.Question-main')
                    inner0.style.width = '97%'
                    var inner = document.querySelector('.Question-mainColumn')
                    inner.style.width = '100%'
                    inner.style.fontSize = '30px'
                    inner.style.fontFamily = 'Times New Roman,楷体'
                    //移除反馈按钮
                    var inner1 = document.querySelector(".CornerButtons")
                    inner1.remove()
                    // 评论栏定制
                    let doCSS = document.createElement('style')
                    doCSS.innerHTML += '.RichContent-actions{bottom:auto !important}'
                    doCSS.innerHTML += '.VoteButton{color:#999 !importantbackground: none !important}'
                    doCSS.innerHTML += '.QuestionHeader,.QuestionHeader-footer,#root,.List,.ContentItem-actions,.CommentsV2,.Topbar,.CommentsV2-footer{background-color: #d8e2c8 !important}'
                    //图片和视频的显示区域大小
                    doCSS.innerHTML += '.origin_image{max-width:500px !important}'
                    doCSS.innerHTML += '.RichText-video{max-width:500px !important}'
                    //文章内代码区
                    doCSS.innerHTML += '.highlight pre{font-size:medium !important;background-color: #cbde8c !important;}'
                    document.getElementsByTagName('head')[0].appendChild(doCSS)
                    // 顶部导航栏移除
                    let header = document.querySelector('.AppHeader')
                    header.remove()

                }
            }
        })();
    (function () {
        // 搜索页定制
        if (path.match(/\/search?.*/g)) {
            //移除侧栏
            var node = document.querySelector('.SearchSideBar')
            node.remove()
            //修改正文区域
            var inner0 = document.querySelector('.Search-container')
            inner0.style.width = '90%'

            var inner1 = document.querySelector('.SearchMain')
            inner1.style.width = '100%'
            inner1.style.fontFamily = 'Times New Roman,楷体'
            inner1.style.fontSize = '26px !important'
            // 定制评论栏
            let doCSS = document.createElement('style')
            doCSS.innerHTML += '.RichContent-actions{height:12px !important;}'
            doCSS.innerHTML += ".Topstory-noMarginCard,.TopstoryItem-isRecommend,.ContentItem-actions,.AppHeader,#root,.TopstoryItem,.SearchTabs,.HotItem,.HotListNav-wrapper,.CommentsV2 ,.Topbar,.CommentsV2-footer,.SearchResult-Card{background-color: #d8e2c8 !important}"
            doCSS.innerHTML += '.VoteButton{color:#999 !important;background: #d8e2c8 !important;height:12px !important}'
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