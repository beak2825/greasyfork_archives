// ==UserScript==
// @name            知乎摸鱼版
// @version         0.0.5
// @author          daji
// @license          daji authorized
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
// @downloadURL https://update.greasyfork.org/scripts/470321/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470321/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E7%89%88.meta.js
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

    console.log("pageType:" + pageType);

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
            //addTypeTips();
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
        cssFix.innerHTML += '.QuestionPage{width:80% !important;margin:10px auto;}'
        cssFix.innerHTML += '.QuestionPage>div:nth-child(1){margin:0; !important}'
        cssFix.innerHTML += '.QuestionHeader-content{width:100% !important;padding:0;}'
        cssFix.innerHTML += '.QuestionHeader-footer{display:none !important;}'
        cssFix.innerHTML += '.QuestionHeader-main {width:97% !important; margin:10px;}'
        cssFix.innerHTML += '.QuestionHeader-title {font-size:18px; font-weight:500;}'
        cssFix.innerHTML += '.QuestionHeader{width:80%;margin:0;padding:0;min-width:auto;}'
        cssFix.innerHTML += '.css-4cffwv{display:none !important;}'
        cssFix.innerHTML += '.List{width:80% !important;}'

        cssFix.innerHTML += '.Avatar{display:none !important;}'
        cssFix.innerHTML += '.AuthorInfo{font-size:15px !important;}'
        cssFix.innerHTML += '.AuthorInfo-detail{display:none !important;}'
        cssFix.innerHTML += '.ContentItem-meta>div:nth-child(3){display:none !important;}'
        cssFix.innerHTML += '.AuthorInfo.AnswerItem-authorInfo.AnswerItem-authorInfo--related>button{display:none !important;}'
        cssFix.innerHTML += 'body>div:nth-child(43)>div>div>div{display:none !important;}'

		cssFix.innerHTML += '.ContentItem-time{font-size:12px;}'
		cssFix.innerHTML += '.ContentItem-actions{margin: -15px -20px -15px;}'
		cssFix.innerHTML += '.Reward{display:none !important;}'
		// 赞同按钮素色  by daji
        cssFix.innerHTML += '.VoteButton{background:transparent !important;color:#8590a6 !important;}'
        // 隐藏分享按钮  by daji
        cssFix.innerHTML += '.ShareMenu{display:none !important;}'
        // 分享等按钮缩小  by daji
        cssFix.innerHTML += '.ContentItem-action{font-size:6px !important;}'
        // 分享等按钮缩小  by daji
        cssFix.innerHTML += '.FEfUrdfMIKpQDJDqkjte{font-size:6px !important;}'
        // 分享等按钮缩小  by daji
		// 未展开时内容居中
        cssFix.innerHTML += '.ListShortcut{margin:0 auto;}'
        // 展开时居中
        cssFix.innerHTML += '.Question-sideColumn{display:none;}'
        cssFix.innerHTML += '.Question-main{width:100% !important; margin:0 auto; padding:0 !important}'
        cssFix.innerHTML += '.Question-mainColumn{width:80% !important;}'
        cssFix.innerHTML += '.ListShortcut{width:125% !important;margin:0 !important}'
        // 内容图片/视频最大200px
        cssFix.innerHTML += '.origin_image{max-width:200px !important;}'
        cssFix.innerHTML += 'img{max-width:200px !important;max-height:200px !important;}'
        cssFix.innerHTML += '.RichText-video{max-width:200px !important;}'
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
        document.getElementsByClassName('Question-main')[0].style.width = '100%'
        document.getElementsByClassName('Question-main')[0].style.padding = '0'
        document.getElementsByClassName('Question-mainColumn')[0].style.margin =
            '0'
    }

    function fixZhuanLan () {
        let cssFix = document.createElement('style')
        cssFix.innerHTML += '.ColumnPageHeader\{display:none !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }

    function fixHomePage () {
        let cssFix = document.createElement('style')
		// 隐藏问题下的评论点赞栏  by daji
        //cssFix.innerHTML += '.ContentItem-actions{display:none !important;}'
		// 调整问题标题字号样式  by daji
        cssFix.innerHTML += '.ContentItem-title{font-size:18px !important;font-weight:500 !important;text-decoration: underline !important;}'
		// 调整回答正文字号样式  by daji
        //cssFix.innerHTML += '.RichContent{font-size:15px !important;}'
        // 隐藏图片  by daji
        cssFix.innerHTML += '.RichContent-cover{display:none !important;}'
        // 隐藏作者头像  by daji
        cssFix.innerHTML += '.Avatar{display:none !important;}'
        // 图片最大180  by daji
        cssFix.innerHTML += 'figure{max-width:180px !important;}'
        // 赞同按钮素色  by daji
        cssFix.innerHTML += '.VoteButton{background:transparent !important;color:#8590a6 !important;}'
        // 隐藏分享按钮  by daji
        cssFix.innerHTML += '.ShareMenu{display:none !important;}'
        // 分享等按钮缩小  by daji
        cssFix.innerHTML += '.ContentItem-action{font-size:6px !important;}'
        // 分享等按钮缩小  by daji
        cssFix.innerHTML += '.FEfUrdfMIKpQDJDqkjte{font-size:6px !important;}'
        // 分享等按钮缩小  by daji
        cssFix.innerHTML += '.FeedSource{display:none !important;}'
        cssFix.innerHTML += '.ContentItem-actions>button:nth-child(1){display:none !important;}'
        cssFix.innerHTML += '.VoteButton--down{margin-left:-20px !important;}'
        cssFix.innerHTML += 'img{max-width:180px !important;}'
        cssFix.innerHTML += '.css-1qyytj7{display:none !important}'
        cssFix.innerHTML += '.GlobalSideBar{display:none !important;}'
        cssFix.innerHTML += '.Topstory-container{width:80% !important;padding:0 !important}'
        cssFix.innerHTML += '.Topstory-mainColumn{width:80% !important;}'
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
