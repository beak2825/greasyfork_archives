// ==UserScript==
// @name         Peek-Boss [窥视Boss直聘]
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       maple
// @license      Apache License 2.0
// @description  偷偷查看Boss直聘;作用于公司上班环境，不适合查看boss的场景。修改了boss的图标以及标题。以及对色彩做了暗色处理，使它看起来不那么明显。
// @require      https://unpkg.com/maple-lib@1.0.3/log.js
// @match        https://www.zhipin.com/*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475787/Peek-Boss%20%5B%E7%AA%A5%E8%A7%86Boss%E7%9B%B4%E8%81%98%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/475787/Peek-Boss%20%5B%E7%AA%A5%E8%A7%86Boss%E7%9B%B4%E8%81%98%5D.meta.js
// ==/UserScript==
'use strict';

let logger = Logger.log("info")


class MockBossConfig {
    constructor() {
        this.title = "debug"
        this.iconUrl = "https://www.baidu.com/favicon.ico";
        this.logoUrl = "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png";
        this.logoText = "百度一下";
        this.dark = true;
    }

    getTitle() {
        return this.title;
    }

    getIconUrl() {
        return this.iconUrl;
    }
}

class PeekBoss {
    constructor() {
        this.mbc = new MockBossConfig()
        this.init();
    }

    init() {
        this.pageBeautification();
        this.registerStyle();
        try {
            this.mockTitle();
            this.mockIcon();
            this.mockLogo();
        } catch (e) {
            logger.debug("初始替换报错", e)
        }
        this.continueMock();
    }

    registerStyle() {
        // 页面logo替换 + pageHeader颜色修改
        GM_addStyle(`
        .logo a {
            display: block;
            background: url(${this.mbc.logoUrl}) 0 0 no-repeat;
            background-size: 113px 21px;
        }

        #header {
            background:transparent;
        }
        `)

        if (this.mbc.dark) {
            let bgColor = "#6b6b6b";
            /**
             * #main, #wrap 首页背景颜色
             * .home-body-wrapper .column-search-panel .btn-search 首页搜索按钮
             * .job-card-wrapper .job-card-right .company-tag-list li 公司标签
             * .job-card-wrapper .job-card-left .tag-list li 岗位标签
             * .city-area-select .area-select-wrapper 城市区域
             * .job-detail-section 详情页工作详情
             * condition-filter-select 条件筛选框
             * job-card-wrapper 每个工作选项卡
             * .job-card-wrapper .job-card-footer 工作选项卡底部
             * .job-card-wrapper .job-card-left .salary 薪资颜色
             * body html body
             * job-search-wrapper 顶部筛选选项卡
             * .job-card-wrapper .job-card-left .start-chat-btn 立即沟通按钮
             * job-search-box .job-search-form 搜索框
             * page-job-wrapper 整体背景色
             * .job-search-box .job-search-form .input-wrap .input 搜索框背景色
             * .job-search-box .job-search-form .city-label 地区背景色
             * .job-card-wrapper .job-card-right .company-logo img 图片黑白色
             * .job-card-wrapper .job-card-left .info-public 招聘人员名称职位
             */
            GM_addStyle(`
            #main, #wrap {background-color: ${bgColor};}
            .home-body-wrapper .column-search-panel .btn-search {background: transparent;}
            .home-body-wrapper .column-search-panel .search-form-con{border: 2px solid;}
            .job-body-wrapper .job-detail-section {background-color: ${bgColor};}
            .salary-calculate-entry {background: #333;}
            .job-body-wrapper .job-banner {background: #333;}
            .job-body-wrapper .detail-box .job-op .btn-container .btn-startchat {background-color: ${bgColor};}
            .job-body-wrapper .similar-job-wrapper {background: #333;}
        .job-card-wrapper .job-card-right .company-tag-list li{background: #3d3737;}
        .job-card-wrapper .job-card-left .tag-list li{background: #3d3737;}
        .job-body-wrapper .job-keyword-list li{background: #3d3737;}
        .job-body-wrapper .sider-company {background: #333;}
        .city-area-select .area-select-wrapper{background: transparent;}
        .condition-filter-select{background: transparent;}
        .condition-industry-select{background: transparent;}
        .condition-position-select.is-select .current-select{background: transparent;}
        .condition-filter-select.is-select .current-select{background: transparent;}
        .condition-position-select{background: transparent;}
        .job-card-wrapper {background-color: ${bgColor};}
        .job-card-wrapper .job-card-footer {background: #3d3737;}
        .job-card-wrapper .job-card-left .salary {color: #414a60;}
        .job-body-wrapper .similar-job-wrapper .similar-job-salary {color: #414a60;}
        .job-body-wrapper .job-banner .salary {color: #414a60;}
         body{background-color: ${bgColor};}
        .job-search-wrapper{background-color: ${bgColor};}
        .job-card-wrapper .job-card-left .start-chat-btn {background:none;}
        .job-search-box .job-search-form{width: 100%;background:none;border: 2px solid;}
        .page-job-wrapper {background-color: #999;}
        .job-search-box .job-search-form .input-wrap .input{background-color: ${bgColor};}
        .job-search-box .job-search-form .city-label{background-color: ${bgColor};}
         img {filter: grayscale(1);}
        .job-card-wrapper .job-card-left .info-public {background: #3d3737;}
        .page-sign {background: ${bgColor}}
        .sms-form-wrapper .sms-form-btn .sure-btn {background: ${bgColor}}
        .job-body-wrapper .smallbanner {background: #333;}
        .job-body-wrapper .smallbanner .name .badge {color: #414a60;}
        .job-body-wrapper .smallbanner .detail-op .btn-startchat {background: ${bgColor}}
        .job-body-wrapper .job-sider .sign-form {background: ${bgColor}}
        .job-body-wrapper .job-sider .form-btn .btn {background: ${bgColor}}
            `)
        }
    }

    pageBeautification() {
        // 首页背景图片
        DOMApi.delElement(".fast-register-box", true)
        // 详情页工资计算器
        DOMApi.delElement(".salary-calculate-entry", true)
        // 侧栏
        DOMApi.delElement(".job-side-wrapper")
        // 侧边悬浮框
        DOMApi.delElement(".side-bar-box")
        // 新职位发布时通知我
        DOMApi.delElement(".subscribe-weixin-wrapper", true)
        // 搜索栏登录框
        DOMApi.delElement(".go-login-btn")
        // 搜索栏去APP
        DOMApi.delElement(".job-search-scan", true)
        // 顶部面板
        // DOMApi.setElement(".job-search-wrapper",{width:"90%"})
        // DOMApi.setElement(".page-job-content",{width:"90%"})
        // DOMApi.setElement(".job-list-wrapper",{width:"100%"})
        GM_addStyle(`
        .job-search-wrapper,.page-job-content{width: 90% !important}
        .job-list-wrapper,.job-card-wrapper,.job-search-wrapper.fix-top{width: 100% !important}
        .job-card-wrapper .job-card-body{display: flex;justify-content: space-between;}
        .job-card-wrapper .job-card-left{width: 50% !important}
        .job-card-wrapper .start-chat-btn,.job-card-wrapper:hover .info-public{display: initial !important}
        .job-card-wrapper .job-card-footer{min-height: 48px;display: flex;justify-content: space-between}
        .job-card-wrapper .clearfix:after{content: none}
        .job-card-wrapper .job-card-footer .info-desc{width: auto !important}
        .job-card-wrapper .job-card-footer .tag-list{width: auto !important;margin-right:10px}
        .city-area-select.pick-up .city-area-dropdown{width: 80vw;min-width: 1030px;}
        .job-search-box .job-search-form{width: 100%;}
        .job-search-box .job-search-form .city-label{width: 10%;}
        .job-search-box .job-search-form .search-input-box{width: 82%;}
        .job-search-box .job-search-form .search-btn{width: 8%;}
        .job-search-wrapper.fix-top .job-search-box, .job-search-wrapper.fix-top .search-condition-wrapper{width: 90%;min-width:990px;}
        `)
        logger.debug("初始化【页面美化】成功")
    }

    continueMock() {
        setInterval(() => {
            this.mockTitle();
            this.mockIcon();
            this.mockLogo();
        }, 2000)
    }

    mockTitle() {
        document.title = this.mbc.getTitle();
    }

    mockIcon() {
        let listPageIcon = document.head.querySelector('[rel="shortcut icon"]');
        if (listPageIcon && listPageIcon.href !== this.mbc.getIconUrl()) {
            listPageIcon.href = this.mbc.getIconUrl();
        }

        // 获取<head>元素
        let head = document.head || document.getElementsByTagName('head')[0];
        let oldLink = head.querySelector('link[rel="icon"]');
        if (head && oldLink && oldLink.href === this.mbc.getIconUrl()) {
            return;
        }

        // 创建一个新的<link>元素
        let link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = this.mbc.getIconUrl();

        // 检查是否已经有favicon元素，如果有，就替换它
        if (oldLink) {
            oldLink.parentNode.removeChild(oldLink);
        }

        // 将新的<link>元素添加到<head>中
        head.appendChild(link);
    }

    mockLogo() {
        let logoDivTag = document.querySelector(".logo");
        if (!logoDivTag) {
            return;
        }
        let logoATag = logoDivTag.querySelector("a");
        logoATag.title = this.mbc.logoText;
    }


}

class DOMApi {
    static delElement(name, loop = false, el = document) {
        let count = 0;
        let t = setInterval(() => {
            const element = el.querySelector(name)
            if (!element) {
                if (!loop) {
                    clearInterval(t)
                }
                if (count++ > 5) {
                    clearInterval(t)
                }
                return
            }
            element.remove()
            clearInterval(t)
        }, 200)
    }
}


(function () {
    window.addEventListener("load", () => {
        new PeekBoss();
    })
})();