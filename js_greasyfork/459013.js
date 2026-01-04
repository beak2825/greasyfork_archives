// ==UserScript==
// @name         虎扑网页端优化
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/Trrrrw/UserScript
// @version      0.1.3
// @description  优化虎扑网页端
// @author       Trrrrw
// @match        https://bbs.hupu.com/*
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        window.onload
// @grant        window.history
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/459013/%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459013/%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//帖子在当前页面打开
function set_title() {
    for (var k = 0; k < document.getElementsByClassName('p-title').length; k++) {
        document.getElementsByClassName('p-title')[k].target = '_self';
    }
}

/**
 * 这个函数用于删除传入的元素
 * @param {string} selector - 要删除的元素
 */
function del_dom(selector) {
    GM_addStyle(`${selector}{display:none !important;}`)
}

(function () {
    //删除元素
    var domToDel = [
        '.hu-pc-navigation-type',//话题广场
        '.hu-pc-navigation-topic-type-item',
        '.index_game-center-sidebar__xz6S_',//虎扑游戏悬浮窗
        '.index_game-center-entrance-container-title__BNope', '#game-center-entrance-container',//虎扑游戏中心
        '.index_right-post__Yuzlv:nth-of-type(2)',//热门游戏
        '.index_download-app__ui5ia',//下载虎扑侧栏
        '.index_qrcodeBox__zLFSV',//下载虎扑二维码
        '.index_right-post__Yuzlv'//崩坏3最热帖
    ];
    domToDel.forEach(selector => {
        del_dom(selector)
    });

    //调整元素
    GM_addStyle('.index_bbs-post-web-body-left-wrapper__O14II{flex: auto;width: auto;}')//调整帖子样式
    // GM_addStyle('.backToTop_2mZa6{bottom:10px;right:8px;}')//右下按钮
    // GM_addStyle('.index_backToTop__rx3__{bottom:10px !important;right:8px !important;}')//帖子内右下按钮
    GM_addStyle('.index_bbs-post-web-body-right-wrapper__WvQ4Q{flex:0;}')//主贴右侧
    // 修改图片大小
    //GM_addStyle('p.image-wrapper > span > div > img{height:233px !important;}')
    //// GM_addStyle('.thread-content-detail > p{display:inline-block;width: fit-content;}')

    //删除顶部红条
    GM_addStyle('.hp-pc-rc-TopMenu{height: 24px !important;}')
    GM_addStyle('.hp-pc-rc-TopMenu-banner{display:none !important;}')
    // //最上方一栏 #c60100
    GM_addStyle('.hp-pc-rc-TopMenu-top-container{background-color: #fff;box-shadow: 0px 0.1px 0px black;}'); GM_addStyle('.hp-pc-rc-TopMenu-top{background-color: #fff;}')
    // //字体颜色
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-topLogin-info .hasLogin li a {color: #fff;}')
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-topLogin-info .hasLogin li a:hover {color: #dedede;}')
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-topLogin-info {color: #fff;}')
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-topLogin-info .hasLogin .hp-topNotificat:hover {color: #dedede;}')
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-quickNav a {color: #fff;}')
    // GM_addStyle('.hp-pc-rc-TopMenu-top .hp-quickNav a:hover {color: #dedede;}')
    //帖子在当前页面打开
    set_title()
    document.onmouseup = function () {
        set_title()
    }

    window.onload = function () {
        //深色模式版头图片
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 系统处于深色模式
            try {
                console.log('系统处于深色模式')
                var topPic = document.getElementsByClassName('bbs-sl-web-intro')[0]
                const topPicStyle = topPic.style.cssText
                const darkTopPicStyle = topPicStyle.replace(/rgb\(255, 255, 255\)/g, 'rgba(0, 0, 0, 0.95)').replace(/rgba\(255, 255, 255, 0.9\)/g, 'rgba(0, 0, 0, 0.9)');
                topPic.style.cssText = darkTopPicStyle
                GM_addStyle('#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div.bbs-sl-web-intro > div.bbs-sl-web-intro-avatar > img{background: linear-gradient(90deg, rgba(0, 0, 0, 0.95) 20%, rgba(0, 0, 0, 0.9));}')
                GM_addStyle('.hp-pc-rc-TopMenu-top-container{background-color: #181a1b;box-shadow: 0px 0.1px 0px black;}'); GM_addStyle('.hp-pc-rc-TopMenu-top{background-color: #181a1b;}')
            }
            catch {
                console.log('...')
            }
        } else {
            // 系统处于浅色模式
            try {
                console.log('系统处于深色模式')
            }
            catch {
                console.log('...')
            }
        };
        //添加返回按钮
        var backLink = document.querySelector("#__next > div > div.index_bbs-post-web-container___cRHg > div.index_bbs-post-web-body__XQ5Sq > div.index_bbs-post-web-body-left-wrapper__O14II > div > div > div:nth-child(1) > section > span:nth-child(3) > a").href
        GM_addStyle('.iconxiazaihupu{display:none !important}')
        GM_addElement('link', {
            rel: 'stylesheet',
            href: 'https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css'
        });
        GM_addElement(document.getElementsByClassName('index_link__U4H39')[0], 'i', {
            class: 'fa fa-arrow-left index_icon__lUGzK',
            'aria-hidden': 'true'
        })
        document.getElementsByClassName('index_text__XBhts')[0].innerText = '返回'; document.getElementsByClassName('index_text__XBhts')[1].innerText = '上级'
        document.getElementsByClassName('index_box__x5WWh')[0].onclick = function () {
            // window.history.back();
            window.open(backLink, '_self')
        };

        //添加跳转到评论区
        document.getElementsByClassName('index_text__XBhts')[2].innerText = '前往'; document.getElementsByClassName('index_text__XBhts')[3].innerText = '评论'
        var commentButton = document.getElementsByClassName("index_link__U4H39")[1];
        commentButton.removeAttribute("target");
        // commentButton.setAttribute("href","#commentArea");
        var commentAreaId = 'commentArea'
        try {
            document.getElementsByClassName("wrapper-container index_margin-top-10__gRpdR")[0].id = "commentArea";
        } catch (error) {
            console.log(error)
            commentAreaId = 'hupu-compact-editor'
            // var commentAreaElement = document.createElement("div")
            // commentAreaElement.id = "commentArea"
            // commentAreaElement.style.display = "none"
            // document.getElementsByClassName('index_bbs-post-web-main__D_K6v')[0].appendChild(commentAreaElement);
        }
        commentButton.addEventListener('click', function (event) {
            // 取消默认的点击行为
            event.preventDefault();
            // 获取目标元素
            var targetElement = document.getElementById(commentAreaId);
            // 计算目标位置
            var targetPosition = targetElement.offsetTop;
            // 滚动到目标位置
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth' // 平滑滚动
            });
        });
    }
})();