// ==UserScript==
// @name         Styled Xueersi
// @namespace    https://code.xueersi.com/
// @version      0.4.5
// @description  给 Xueersi Coding 加点样式
// @author       lrs2187
// @license      GPL-3.0
// @match        https://login.xueersi.com/*
// @match        https://code.xueersi.com/*
// @icon         https://static0.xesimg.com/talcode/assets/logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526434/Styled%20Xueersi.user.js
// @updateURL https://update.greasyfork.org/scripts/526434/Styled%20Xueersi.meta.js
// ==/UserScript==

(() => {
    "use strict";

    /**
     * 样式加载器
     */
    class StyleLoader {
        /**
         * 检查器类型
         * @typedef {(url: string) => void} CheckerType
         */

        constructor() {
            /**
             * 检查器列表
             * @type {[CheckerType, string][]}
             */
            this.checkers = [];
            this.onload = new Function();
        }

        /**
         * 添加规则
         * @param {CheckerType} checker 检查器函数
         * @param {string} style 样式代码
         */
        addRule(checker, style) {
            this.checkers.push([checker, style]);
        }

        /**
         * 加载样式
         */
        load() {
            let currentStyle = "/* Styled Xueersi Style */";
            for (let [checker, style] of this.checkers) {
                if (checker(location.href)) {
                    currentStyle = `${currentStyle}\n\n${style}`;
                }
            }

            const styleElement = document.createElement("style");
            styleElement.id = "styled-xueersi-style";
            styleElement.innerHTML = currentStyle;
            document.body.appendChild(styleElement);

            this.onload();
        }

        /**
         * 重新加载样式
         */
        reload() {
            const styleElement = document.querySelector(
                "#styled-xueersi-style"
            );
            if (styleElement) {
                styleElement.remove();
            }
            this.load();
        }
    }

    const loader = new StyleLoader();

    let config = localStorage.getItem("StyledXueersi-Config");
    if (config) {
        config = JSON.parse(config);
    } else {
        config = {
            background:
                "https://livefile.xesimg.com/programme/python_assets/8de0c0221910b2dbb58375998b024329.jpg",
        };
        localStorage.setItem("StyledXueersi-Config", JSON.stringify(config));
    }

    loader.addRule(
        url => url.startsWith("https://login.xueersi.com/"),
        `.login-left,
.info-input,
.input-account,
.input-password,
.phone-input,
.code-input {
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(6px);
    box-shadow: rgba(142, 142, 142, 0.19) 0 6px;
}

.input-account:hover,
.input-password:hover,
.phone-input:hover,
.code-input:hover {
    background-color: rgba(255, 255, 255, 0.5) !important;
}`
    );

    loader.addRule(
        url =>
            url.startsWith("https://code.xueersi.com/") &&
            !url.startsWith("https://code.xueersi.com/toolkit/template") &&
            !url.startsWith("https://code.xueersi.com/project/publish/modal"),
        `body,
.que {
    background-image: url(${config.background}) !important;
    background-attachment: fixed !important;
    background-size: cover !important;
}

#loading-dom,
#homePageKeduoGuide,
div[title="猫博士的开眼课堂"],
.share-component,
.header-left-nav-item-create[data-clickname=jiuge_official_web_ide_btn_click],
.floor-bar-wrapper {
    display: none !important;
}

.search-wrapper,
.search-center-wrapper,
.app-navbar,
.layout,
.layout[data-v-704641f8],
.header,
.project-group[data-v-fb0628ee],
.project-group,
#comment-box {
    background: transparent !important;
}

.home-component-cursor-follow {
    visibility: hidden;
}

.header.is-homepage[data-v-42519053] {
    background: hsla(0, 0%, 100%, .7) !important;
}

.app-navbar > .header,
.card,
.back-to-top,
.user-tabs,
.rank-content,
.detail-container,
.user-menu,
.user-introduction,
.work-menu,
.tag_search,
.message-container,
.message-con,
.suggestion-con,
.menu-tab[data-v-1f68a1ae],
.follow-list,
.follow-operate,
.show_medal,
.user-honor,
.work-card,
.user-page-operate > span[data-v-d3f2a2b4],
.user-master-thumbnail,
.user-master-title,
li[data-v-91103884],
.detail-content,
.user-access-con,
.project-description-scratch,
.project-recommend-scratch,
.xes-textarea,
.project-operate-left > div,
.project-operate-right > div,
.work-tags > span,
.focus-btn,
.reply-comment-con,
.reply-comment-box,
.more-opreate,
.normal_download_col,
.normal_download_btn,
.component-search-box-input,
.search-center_search-box,
.search-center_module.card-style,
.search-center-component-work-card,
.search-center_fixed-header,
.search-center-component-video-card,
.component-search-box-recommend,
.publish,
.no-focus-wrapper,
.has_focus,
.to_focus {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(6px) !important;
}

.banner-left-arrow,
.banner-right-arrow {
    backdrop-filter: blur(6px) !important;
}

.header-menu {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(6px) !important;
}

.xes-modal-warp,
.modal-background,
.modal-mask,
dialog:-internal-dialog-in-top-layer::backdrop {
    background: unset !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(6px) !important;
}


.user-master-icon,
.search-center_search-box {
    z-index: 5;
}

.search-center_search-box {
    position: relative;
}

.floor-nav > .nav-list-item > .nav-item-content,
.rank-author,
.rank-detail > *,
.search-center_summary,
.user-menu > *,
.user-page-operate > *,
.suggestion-tag-radio input[type=radio] ~ label[data-v-1ae567e1],
.card-bottom-data,
.work-list,
.focus-btn,
.description-con,
.user-name,
.comtent-area,
.grey-span,
.emoji-btn,
.comment-detail > *,
.card-line > *,
.tag-list > li,
span[data-v-06e5a24a],
#comment-box {
    color: #333 !important;
}

#comment-box::-webkit-input-placeholder {
    color: #555 !important
}

#comment-box::-moz-placeholder {
    color: #555 !important
}

.suggestion-tag-radio input[type=radio]:checked ~ label[data-v-1ae567e1] {
    color: #4461fc !important;
}

.card-bottom-data-right-like::before,
.icon-zan::before,
.like_icon::before,
.card-line-like::before {
    background: none !important;
    content: "👍" !important;
    vertical-align: unset !important;
}

.card-bottom-data-right-unlike::before,
.icon-cai::before,
.unlike_icon::before {
    background: none !important;
    content: "👎" !important;
    transform: none !important;
    vertical-align: unset !important;
}

.card-bottom-data-right-view::before,
.icon-view::before,
.view_icon::before,
.card-line-view::before {
    background: none !important;
    content: "👀" !important;
    vertical-align: unset !important;
}

.user-introduction {
    background-image: none !important;
}

::-webkit-scrollbar {
    width: 10px !important;
}

::-webkit-scrollbar-track {
    border-radius: 5px !important;
}

#comment-box::-webkit-scrollbar {
    width: 5px !important;
}

#comment-box::-webkit-scrollbar-track {
    background: transparent !important;
}

::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
}

@media (prefers-color-scheme: light) {
    ::-webkit-scrollbar-track {
        background-color: #f1f1f1 !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888 !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #555 !important;
    }

}

@media (prefers-color-scheme: dark) {
    ::-webkit-scrollbar-track {
        background-color: #555 !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888 !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #aaa !important;
    }

}

#StyledXueersiSettingsDialog {

}

#StyledXueersiSettingsDialog > * {
    margin: 0 0 5px 0;
}`
    );

    loader.addRule(
        url =>
            url === "https://code.xueersi.com/" ||
            url === "https://code.xueersi.com/?action=loginToHome",
        `.project-group-home.project-group.container {
    margin-top: -311px;
}`
    );

    loader.addRule(
        url =>
            url.startsWith("https://code.xueersi.com/newtab?type=codeup") ||
            url.startsWith("https://code.xueersi.com/codeup/") ||
            url.startsWith("https://code.xueersi.com/codeUp/"),
        `.banner_logo,
.dropdown-list > .dropdown-item,
div[data-v-0a8d97f9] > div:nth-child(2),
.el-table,
.el-table__header-wrapper > table > thead > tr {
    background: transparent !important;
}

.recommend-container,
.recommend-container > .content,
.left-tab-item,
.right-down-item,
.table_area,
.practice_list > table,
.practice_list > table > thead > tr > th,
.pagination > ul > li,
.pagination_pre_page,
.pagination_next_page,
.show-total-input,
.sidebar,
.dropdown-list,
.main-container,
.list-main-table > table,
.list-main-table > table > thead,
.rpanel-content,
.modal-content,
.exam_list_header,
.tab,
.exam_list_search,
.exam_list_search_input,
.label,
.exam_list > table,
ul[data-v-4ddf874e] > li,
div[data-v-ec7d9832].item,
.race_detail_content,
.el-table__header-wrapper > table,
.el-table__header-wrapper > table > thead > tr > th,
.warning-row,
.que-left,
.enter_btn {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(6px) !important;
}

.left-tab-item {
    border-top-right-radius: 0 !important;
}

.left-tab-item.active {
    background-color: rgba(238, 245, 254, 0.5) !important;
}

.practice_list > table,
.list-main-table > table,
.dropdown-list,
.el-table {
    border: white solid 1px;
    border-radius: 15px;
}

.answer-iframe {
    border-radius: 5px;
    overflow: hidden !important;
}

.exam_list_header {
    margin-bottom: 10px;
}

.exam_list_search_button {
    z-index: 5;
}

.race-bg {
    position: absolute;
    top: 0;
}

.race_content {
    position: relative !important;
    left: unset !important;
    -webkit-transform: unset !important;
    transform: unset !important;
    top: unset !important;
    width: unset !important;
    min-height: unset !important;
    margin-top: 80px;
}

.race_container {
    position: unset !important;
    height: unset !important;
}

.pagination > * {
    color: #333 !important;
}`
    );

    loader.addRule(
        url =>
            url.startsWith(
                "https://code.xueersi.com/static/codeUPhtml/topic.html"
            ),
        `#exam-app {
    overflow: hidden !important;
}`
    );

    loader.addRule(
        url => url.startsWith("https://code.xueersi.com/project/publish/modal"),
        `.publish {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(6px) !important;
}

.publish-modal {
    background: unset !important;
    background-color: rgba(0, 0, 0, 0.25) !important;
    backdrop-filter: blur(6px) !important;
}

.tag-list > li {
    color: #333 !important;
}`
    );

    loader.addRule(
        url => url.startsWith("https://code.xueersi.com/ide/code/"),
        `@font-face {
    font-family: "Maple Mono";
    src: url("https://livefile.xesimg.com/programme/python_assets/2fe890fea4f82a3585612f4237cceee5.ttf");
}

.ace_editor {
    font-family: "Maple Mono", monospace  !important;
}

.editor-group {
    height: calc(100% - 60px) !important;
}

.warp[data-v-b7fedb40],
.editor-group-term,
.file-preview,
.console-trem,
.ace-editor[data-v-47a29dd8] {
    height: 100% !important;
}

.notification {
    border-radius: 0 !important;
}

.headercon,
.tabs-wrapper {
    background: transparent !important;
}

.idecontainer,
.headercon-right__btn,
.headercon-input {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(6px) !important;
}

.headercon-right__btn:hover {
    background: unset !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(6px) !important;
}

.headercon-right__btn:last-child,
.qr-code-wrapper_modal {
    display: none;
}

.tile.is-5[data-v-47a29dd8],
.tile.is-7[data-v-47a29dd8] {
    padding: 0 !important;
}

.output-group {
    margin: 0 10px !important;
}

.headercon-right__btn {
    color: #333 !important;
}

.line[data-v-e5f7b998] {
    background-color: #efefef
}`
    );

    loader.onload = () => {
        setTimeout(() =>{
            if (location.href.startsWith("https://code.xueersi.com")) {
                const settingsBtnHTML = `
<div data-v-4bacdad2="" id="StyledXueersiSettingsBtn" class="header-right-notifition" style="">
    <div data-v-4bacdad2="" class="header-right-notifition-title">
        <img data-v-4bacdad2="" src="https://static0.xesimg.com/talcode/assets/logo.ico" alt="" style="margin-top: 2px;" />
        <div data-v-4bacdad2="" class="header-right-notifition-title-text">样式设置</div>
    </div>
</div>`;

                const settingsDialogHTML = `
<div id="StyledXueersiSettingsDialog" style="min-width: 400px; min-height: 300px;">
    <p>StyledXueersi 样式设置</p>

    <div>
        背景图片：<input value="${config.background}" id="SXS_BgImg" required />
    </div>

    <form method="dialog">
        <button>取消</button>
        <button id="SXS_Ok">确定</button>
    </form>
</div>`;

                const navbarRight = document.querySelector(".header-right");
                // navbarRight.innerHTML = settingsBtnHTML + navbarRight.innerHTML;
                const settingsBtn = document.createElement("div");
                settingsBtn.innerHTML = settingsBtnHTML;
                navbarRight.insertBefore(settingsBtn, navbarRight.childNodes[0])

                const appContainer = document.querySelector("body");
                const settingsDialog = document.createElement("dialog");
                settingsDialog.innerHTML = settingsDialogHTML
                appContainer.appendChild(settingsDialog)

                // const settingsBtn = document.querySelector(
                //     "#StyledXueersiSettingsBtn"
                // );
                const settingsOkBtn = document.querySelector("#SXS_Ok");

                /**
                 * @type {HTMLInputElement}
                 */
                const settingsBackgroundImageInput =
                    document.querySelector("#SXS_BgImg");

                /**
                 * @type {HTMLDivElement}
                 */
                // const settingsDialog = document.querySelector(
                //     "#StyledXueersiSettingsDialog"
                // );

                settingsBtn.addEventListener("click", () => {
                    settingsDialog.showModal();
                });

                settingsOkBtn.addEventListener("click", () => {
                    config.background = settingsBackgroundImageInput.value;
                    localStorage.setItem(
                        "StyledXueersi-Config",
                        JSON.stringify(config)
                    );
                    if (confirm("配置已更新，现在刷新？")) location.reload();
                });
            }
        }, 1000);
    }

    loader.load();

    window.StyledXueersiLoader = loader;

    // https://blog.csdn.net/qq_44697303/article/details/120412469
    const bindHistoryEvent = function (type) {
        const historyEvent = history[type];
        return function () {
            const newEvent = historyEvent.apply(this, arguments); //执行history函数
            const e = new Event(type); //声明自定义事件
            e.arguments = arguments;
            window.dispatchEvent(e); //抛出事件
            return newEvent; //返回方法，用于重写history的方法
        };
    };

    history.pushState = bindHistoryEvent("pushState");
    window.addEventListener("pushState", _ => {
        setTimeout(() => loader.reload(), 500);
    });
})();
