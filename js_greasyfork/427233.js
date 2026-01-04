// ==UserScript==
// @name         b站收藏夹优化
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  缩小收藏夹,关注列表的间距，可设置是否显示横向滚动条与纵向滚动条
// @author       aotmd
// @match        https://*.bilibili.com/*
// @exclude      https://live.bilibili.com/p/html/live-fansmedal-wall/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @compatible   chrome Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/427233/b%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427233/b%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    let styleElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(`
        a.text {
            overflow: visible!important;
        }`)
    );
    // 根据存储的设置更新滚动条的可见性
    function updateXScrollbar() {
        const isEnabled = GM_getValue('horizontalScrollbarEnabled', false); // 默认关闭
        if (isEnabled) {
            styleElement.firstChild.nodeValue=`
            /* 整体滚动条宽度 */
            ::-webkit-scrollbar {
                width: 6px;  /* 纵向滚动条宽度 */
                height: 6px; /* 横向滚动条高度 */
            }

            /* 滚动条轨道 */
            ::-webkit-scrollbar-track {
                background: #f1f1f1;  /* 滚动条轨道背景色 */
                border-radius: 10px;  /* 圆角 */
            }

            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
                background: #888;  /* 滚动条滑块颜色 */
                border-radius: 10px;  /* 圆角 */
            }

            /* 滚动条滑块在悬停状态下 */
            ::-webkit-scrollbar-thumb:hover {
                background: #555;  /* 悬停时的滑块颜色 */
            }
            a.text {
                overflow: auto!important;
            }` // 显示滚动条
        } else {
            styleElement.firstChild.nodeValue=`
            a.text {
                overflow: visible!important;
            }`
            // 隐藏滚动条
        }
    }

    // 切换滚动条设置并弹出确认框
    function toggleScrollbar() {
        const isEnabled = GM_getValue('horizontalScrollbarEnabled', false);
        const userChoice = window.confirm(`当前横向滚动条是${isEnabled ? '启用' : '禁用'}状态。是否要${isEnabled ? '禁用' : '启用'}它？`);
        if (userChoice) {
            GM_setValue('horizontalScrollbarEnabled', !isEnabled);
            updateXScrollbar();
        }
    }

    // 注册菜单命令以切换滚动条并确认
    GM_registerMenuCommand('切换横向滚动条', toggleScrollbar);

    // 应用初始滚动条设置
    updateXScrollbar();


    let styleElement2 = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement2);
    styleElement2.appendChild(document.createTextNode(`
            /*收藏夹列表全部显示*/
            #page-fav .fav-sidenav .fav-list-container {
                max-height: none!important;
            }`)
    );
    // 根据存储的设置更新滚动条的可见性
    function updateYScrollbar() {
        const isEnabled = GM_getValue('verticalScrollbarEnabled', false); // 默认关闭
        if (isEnabled) {
            styleElement2.firstChild.nodeValue=`
            /*收藏夹列表显示大部分*/
            #page-fav .fav-sidenav .fav-list-container#fav-createdList-container {
                max-height: max(700px,70vh)!important;
            }
            #page-fav .fav-sidenav .fav-list-container#fav-list-container {
                max-height: max(420px,30vh)!important;
            }`
        } else {
            styleElement2.firstChild.nodeValue=`
            /*收藏夹列表全部显示*/
            #page-fav .fav-sidenav .fav-list-container {
                max-height: none!important;
            }`
        }
    }

    // 切换滚动条设置并弹出确认框
    function toggleScrollbar2() {
        const isEnabled = GM_getValue('verticalScrollbarEnabled', false);
        const userChoice = window.confirm(`当前纵向滚动条是${isEnabled ? '启用' : '禁用'}状态。是否要${isEnabled ? '禁用' : '启用'}它？`);
        if (userChoice) {
            GM_setValue('verticalScrollbarEnabled', !isEnabled);
            updateYScrollbar();
        }
    }

    // 注册菜单命令以切换滚动条并确认
    GM_registerMenuCommand('切换纵向滚动条', toggleScrollbar2);

    // 应用初始滚动条设置
    updateYScrollbar();




    addStyle(`
    /*视频页选择收藏夹页面*/
    .collection-m .content .group-list li {
        padding-bottom: 0px!important;
    }
    /*新版播放列表*/
    .collection-m-exp .content .group-list li {
        padding-bottom: 0px;
    }
    .collection-m-exp ul {
        line-height: 1!important;
    }

    /*顶栏下拉菜单*/
    .be-dropdown .dropdown-popup .bex-dropdown-item {
        justify-content: flex-start!important;
    }
    .dropdown-popup .bex-dropdown-item {
        line-height: normal;
        padding: 0px 16px!important;
        text-align: left!important;
    }
    /*有两个版本*/
    .v-dropdown .dropdown-menu li {
    text-align: left;
    padding: 0px 16px;
    }



    /*我的收藏页面*/
    #page-fav .fav-sidenav .text {
        line-height: normal!important;
    }
    .be-dropdown-trigger {
        height: 20px!important;
    }
    /*弹出菜单位置偏移修复*/
    ul.be-dropdown-menu.menu-align- {
        margin-top: -10px;
    }
    /*收藏页面的改变收藏夹列表间距*/
    .wrapper .edit-video-modal .target-favlist .target-favitem {
        height: auto!important;
        margin-bottom: 0px!important;
    }
    /*左右浮动,将两个p标签合并为一行*/
    p.fav-state {
        margin-left: 10px;
        float: right;
    }
    p.fav-name {
        float: left;
    }
    /*文字尽量显示出来*/
    #page-fav .fav-sidenav .text {
        text-overflow: clip;
    }
    /*也缩小关注页间距和全部显示*/
    .follow-item a.text {
        line-height: inherit!important;
    }
    .be-scrollbar.follow-list-container.ps {
        max-height: inherit!important;
    }
    .follow-dialog-wrap .follow-dialog-window .content .group-list li {
        padding-bottom: 0px!important;
    }
    .group-list {
        max-height: inherit!important;
    }
    .bili-dialog-bomb .follow-dialog-wrap-exp .follow-dialog-window .content .group-list li {
        padding-bottom: 0px;
    }
    /*压缩列表间距*/
    #page-follows .list-item .content {
        margin-top: 0px!important;
    }
    .list-item {
        padding: 5px 0!important;
    }
    .list-item .title {
        height: auto!important;
    }
    /*1.1.4 私聊页面修正*/
    .list-item .verify-box {
        bottom: 5px;
        left: 28px;
    }
    /*1.1.7 修正位置*/
    #page-fav .fav-sidenav .fav-item > * {
        vertical-align: bottom!important;
    }
    `);

    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent(func) {
        let oldOnload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                try {
                    oldOnload();
                } catch (e) {
                    console.log(e);
                } finally {
                    func();
                }
            }
        }
    }

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
})();