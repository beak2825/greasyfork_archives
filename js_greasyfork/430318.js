// ==UserScript==
// @name            《论如何在知乎上优雅的摸鱼》
// @version         0.0.1
// @author          adlered
// @namespace       https://github.com/adlered
// @description     隐藏知乎的状态栏，清除主页广告，优化排版，假装成GitHub的标题和图标，区分问题/视频/专栏等等。好（享）好（受）工（摸）作（鱼）哦（吧）。
// @match           *://www.zhihu.com/question/*
// @match           *://www.zhihu.com/search*
// @match           *://www.zhihu.com/hot
// @match           *://www.zhihu.com/follow
// @match           *://www.zhihu.com/
// @match           *://zhuanlan.zhihu.com/*
// @match           *://www.zhihu.com/signin*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/430318/%E3%80%8A%E8%AE%BA%E5%A6%82%E4%BD%95%E5%9C%A8%E7%9F%A5%E4%B9%8E%E4%B8%8A%E4%BC%98%E9%9B%85%E7%9A%84%E6%91%B8%E9%B1%BC%E3%80%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430318/%E3%80%8A%E8%AE%BA%E5%A6%82%E4%BD%95%E5%9C%A8%E7%9F%A5%E4%B9%8E%E4%B8%8A%E4%BC%98%E9%9B%85%E7%9A%84%E6%91%B8%E9%B1%BC%E3%80%8B.meta.js
// ==/UserScript==
(function() {
    const pathName = window.location.pathname
    const hostName = window.location.hostname
    let pageType
    if (pathName.indexOf('question') >= 0) {
        pageType = 'question'
    } else if (pathName.indexOf('search') >= 0) {
        pageType = 'search'
    } else if (pathName.indexOf('hot') >= 0 || pathName.indexOf('follow') >= 0 || window.location.href === "https://www.zhihu.com/") {
        pageType = 'hot'
    } else if (pathName.indexOf('signin') >= 0) {
        pageType = 'signin'
    } else if (hostName === "zhuanlan.zhihu.com") {
        pageType = 'zhuanlan'
    }

    'use strict'
    console.log("知乎 -> GitHub 魔法变身中...");
    window.onload = function () {
    const fake_title = 'GitHub'
    const fake_icon = 'https://github.githubassets.com/favicon.ico'
    let link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link')
    window.document.title = fake_title
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = fake_icon
    document.getElementsByTagName('head')[0].appendChild(link)
    }

    console.log(pageType);

    switch (pageType) {
        case 'question':
            fixQuestionPage()
            break
        case 'search':
            break
        case 'hot':
            fixHomePage()
            EventXMLHttpRequest()
            break
        case 'signin':
            break
        case 'zhuanlan':
            fixZhuanLan()
            break
    }

    // 监听 XMLHttpRequest 事件
    function EventXMLHttpRequest() {
        var _send = window.XMLHttpRequest.prototype.send
        function sendReplacement(data) {
            addTypeTips();
            return _send.apply(this, arguments);
        }
        window.XMLHttpRequest.prototype.send = sendReplacement;
    }

    function fixQuestionPage () {
        const sConfig = window.localStorage
        let cssFix = document.createElement('style')
        // 吸底的评论栏
        cssFix.innerHTML += '.RichContent-actions{bottom:auto !important;}'
        // 问题页面登录弹窗
        cssFix.innerHTML += '.Modal-backdrop{background-color: transparent;}'
        cssFix.innerHTML += '.signFlowModal{display:none !important;}'
        // 顶部关键词
        cssFix.innerHTML += '.QuestionHeader-tags{display:none !important;}'
        // 问题相关撑满
        cssFix.innerHTML += '.QuestionHeader-content{width:694px !important;padding:0;}'
        cssFix.innerHTML += '.QuestionHeader-footer{display:none !important;}'
        cssFix.innerHTML += '.QuestionHeader-main {margin:10px;}'
        cssFix.innerHTML += '.QuestionHeader{width:694px;margin:0 auto;padding:0;min-width:auto;}'
        // 未展开时内容居中
        cssFix.innerHTML += '.ListShortcut{margin:0 auto;}'
        // 展开时居中
        cssFix.innerHTML += '.Question-sideColumn{display:none;}'
        cssFix.innerHTML += '.Question-mainColumn{margin:0 auto;}'
        // 内容图片/视频最大300px
        cssFix.innerHTML += '.origin_image{max-width:300px !important;}'
        cssFix.innerHTML += '.RichText-video{max-width:300px !important;}'
        // 内容链接去特征
        cssFix.innerHTML +=
            '.LinkCard{margin:auto !important;display:inline !important;}.LinkCard-content{background-color: transparent;}.LinkCard-title{color:#999 !important}'
        // 点赞
        cssFix.innerHTML +=
            '.VoteButton{color:#999 !important;background: none; !important}'
        // 评论展开宽度
        cssFix.innerHTML += '.Modal--fullPage{width:650px}'
        // 评论展开关闭按钮复位
        cssFix.innerHTML += '.Modal-closeButton{right:0;}'
        cssFix.innerHTML += '.Modal-closeIcon{fill:#919191;}'
        // 广告商品链接
        cssFix.innerHTML +=
            '.RichText-MCNLinkCardContainer{display:none !important;}'
        // 夹缝广告
        cssFix.innerHTML +=
            '.Pc-word{display:none !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
        // 右侧问题相关
        document.getElementsByClassName('QuestionHeader-side')[1].style.display =
            'none'
        document.getElementsByClassName('Question-sideColumn')[0].style.display =
            'none'
        // 顶部问题标题
        document.getElementsByTagName('header')[0].style.display = 'none'
        // 内容撑满
        document.getElementsByClassName('Question-main')[0].style.width = 'auto'
        document.getElementsByClassName('Question-main')[0].style.padding = '0'
        document.getElementsByClassName('Question-mainColumn')[0].style.margin =
            '0 auto'
    }

    function fixZhuanLan () {
        let cssFix = document.createElement('style')
        cssFix.innerHTML += '.ColumnPageHeader\{display:none !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }

    function fixHomePage () {
        let cssFix = document.createElement('style')
        cssFix.innerHTML += '.GlobalSideBar{display:none !important;}'
        cssFix.innerHTML += '.Topstory-container{width:100% !important;padding:0 !important}'
        cssFix.innerHTML += '.Topstory-mainColumn{width:100% !important;}'
        cssFix.innerHTML += '.AppHeader\{display:none !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }

    function addTypeTips() {
        // URL 匹配正则表达式
        let patt_zhuanlan = /zhuanlan.zhihu.com/,
            patt_question = /question\/\d+/,
            patt_question_answer = /answer\/\d+/,
            patt_video = /\/zvideo\//,
            patt_tip = /zhihu_e_tips/
        let postList = document.querySelectorAll('h2.ContentItem-title a');
        postNum = document.querySelectorAll('small.zhihu_e_tips');
        //console.log(`${postList.length} ${postNum.length}`)
        if (postList.length > postNum.length) {
            for (let num = postNum.length;num<postList.length;num++) {
                if (!patt_tip.test(postList[num].innerHTML)) { //                判断是否已添加
                    if (patt_zhuanlan.test(postList[num].href)) { //             如果是文章
                        postList[num].innerHTML = `<small class="zhihu_e_tips" style="color: #ffffff;font-weight: normal;font-size: 12px;padding: 0 3px;border-radius: 2px;background-color: #2196F3;display: inline-block;height: 18px;">文章</small> ` + postList[num].innerHTML
                    } else if (patt_question.test(postList[num].href)) { //      如果是问题
                        if (!postList[num].getAttribute('data-tooltip')) { //    排除用户名后面的蓝标、黄标等链接
                        if (patt_question_answer.test(postList[num].href)) { //  如果是指向回答的问题（而非指向纯问题的链接）
                            postList[num].innerHTML = `<small class="zhihu_e_tips" style="color: #ffffff;font-weight: normal;font-size: 12px;padding: 0 3px;border-radius: 2px;background-color: #f68b83;display: inline-block;height: 18px;">问题</small> ` + postList[num].innerHTML
                        } else {
                            postList[num].innerHTML = `<small class="zhihu_e_tips" style="color: #ffffff;font-weight: normal;font-size: 12px;padding: 0 3px;border-radius: 2px;background-color: #ff5a4e;display: inline-block;height: 18px;">问题</small> ` + postList[num].innerHTML
                        }
                        }
                    } else if (patt_video.test(postList[num].href)) { //         如果是视频
                        postList[num].innerHTML = `<small class="zhihu_e_tips" style="color: #ffffff;font-weight: normal;font-size: 12px;padding: 0 3px;border-radius: 2px;background-color: #00BCD4;display: inline-block;height: 18px;">视频</small> ` + postList[num].innerHTML
                    }
                    //postNum += 1;
                }
            }
        }
        // 主页去广告的，一起塞到这里吧
        Array.prototype.forEach.call(document.getElementsByClassName("Pc-feedAd-container"), function (element) {
        element.parentNode.remove();
});
    }
})();
