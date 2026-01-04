// ==UserScript==
// @name         vjudge+ better
// @namespace    https://github.com/dffxd-suntra/vjudge-plus
// @version      1.5
// @description  基于by Suntra的vjudge+，只不过让导航栏变得更美观了
// @author       Suntra
// @homepageURL  https://github.com/dffxd-suntra/vjudge-plus
// @supportURL   https://github.com/dffxd-suntra/vjudge-plus
// @match        https://vjudge.net
// @match        https://vjudge.net/*
// @icon         data:image/x-icon;base64,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
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543590/vjudge%2B%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/543590/vjudge%2B%20better.meta.js
// ==/UserScript==

(function() {
    // 对于-1,有两种情况,一种是404,一种是主页
    var regList = [
        // 0 题目列表
        /\/problem$/,
        // 1 题目详情
        /\/problem\/[^\/]+$/,
        // 2 跳转到原oj的原题
        /\/problem\/[^\/]+\/origin$/,
        // 3 题目详情的iframe
        /\/problem\/description\/[^\/]+$/,


        // 4 提交状态列表
        /\/status$/,
        // 5 跳转到原oj这次提交的页面
        /\/solution\/[^\/]+\/origin$/,
        // 6 如果打开分享文字(Share text)的页面
        /\/solution\/[^\/]+\/[^\/]+$/,


        // 7 赛事列表
        /\/contest$/,
        // 8 赛事详情
        /\/contest\/[^\/]+$/,
        // 9 好像是赛事统计
        /\/contest\/statistic$/,


        // 10 题单列表
        /\/workbook$/,
        // 11 创建题单,创建讨论
        /\/article\/create$/,
        // 12 题单详情
        /\/article\/[^\/]+$/,


        // 13 用户列表
        /\/user$/,
        // 14 用户详情
        /\/user\/[^\/]+$/,


        // 15 小组列表
        /\/group$/,
        // 16 小组详情
        /\/group\/[^\/]+$/,


        // 17 社区(论坛)
        /\/comment$/,


        // 18 发消息(如果要发消息就要先找到它的用户界面,就是14,然后点击信封图标就可
        /\/message$/,
    ];

    function getPage() {
        for(var key in regList) {
            if(regList[key].test(pathName)) {
                return key;
            }
        }
        return -1;
    }

    var pathName = location.pathname;
    while(pathName[pathName.length-1] == "/") {
        pathName = pathName.substr(0,pathName.length-1);
    }
    var pageId = getPage();

    // 特判404
    if(pageId == -1&&pathName!="") {
        console.log("404");
    }
    else {
        console.log(pageId);
    }

    if(pageId==-1) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==0) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }if(pageId==1) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==2) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==3) {
        GM_addStyle(
            "dd {background-color: rgba(255,255,255,70%) !important;border-radius: 0.25rem !important;}"
        );
    }
    if(pageId==4) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==5) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==6) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==7) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==8) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==9) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==10) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==11) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==12) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==13) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==14) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==15) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==16) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==17) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }
    if(pageId==18) {
        GM_addStyle("body {background: #f0f0f0 url(http://static.rqnoj.cn/images/bg.jpg) no-repeat center top fixed;background-size: 100% 100%;-moz-background-size: 100% 100%;}");
        $("body").prepend("<nav style='height: 60px'></nav>");
    }

    // 对于所有页面
    GM_addStyle(`
    /* 顶部导航栏 - 默认透明度 75% */
    .navbar {
        border-radius: 0rem;
        background-color: rgba(255, 255, 255, 0.75) !important;
        color: #000 !important;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: background-color 0.2s ease, opacity 0.2s ease;
    }

    .navbar a, .navbar .nav-link, .navbar .navbar-brand {
        color: #000 !important;
        font-weight: normal;
        transition: background-color 0.2s ease, opacity 0.2s ease;
    }

    /* 鼠标悬停时背景更白、透明度增强 */
    .navbar a:hover, .navbar .nav-link:hover {
        background-color: rgba(255,255,255,1.0);
        opacity: 1;
        color: #000 !important;
    }

    /* 当前选中项加粗 */
    .navbar .nav-item.active > .nav-link {
        font-weight: bold !important;
    }

    /* 去除滚动条 */
    ::-webkit-scrollbar {
        display: none;
    }

    /* 去除广告和支持按钮 */
    #prob-ads,
    #img-support {
        display: none !important;
    }

    /* 卡片统一柔和背景 */
    .card, .list-group-item, .btn-secondary, .page-link,
    .page-item.disabled .page-link, .dropdown-menu {
        background-color: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(3px);
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;
    }

    .card:hover, .dropdown-menu:hover {
        background-color: rgba(255, 255, 255, 0.8) !important;
    }

    /* 模态框 */
    .modal-content {
        background-color: rgba(255, 255, 255, 0.9) !important;
        border-radius: 0.5rem;
    }

    /* 输入框 */
    .form-control {
        background-color: rgba(255, 255, 255, 0.5) !important;
        border: 1px solid #ccc;
    }

    /* 标签内容区 */
    .tab-content {
        background-color: rgba(255, 255, 255, 0.5);
        border: 2px solid #eceeef;
        border-radius: 0.25rem;
        padding: 20px;
    }

    /* 页脚样式 */
    .body-footer {
        color: #444;
        background: rgba(255, 255, 255, 0.8);
        padding: 1em;
        border-top: 1px solid #ddd;
    }

    /* 响应式适配 */
    @media (max-width: 768px) {
        .navbar {
            font-size: 14px;
        }
    }
`);

    $("body > div.body-footer").append("<p>Theme powered by <a href=\"https://github.com/dffxd-suntra/vjudge-plus\">vjudge+</a></p>");
})();