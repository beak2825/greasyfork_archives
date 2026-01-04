// ==UserScript==
// @name 知乎移动版
// @namespace github.com/Labolasya
// @version 2025.09.22.03
// @description 使桌面版更接近移动风格
// @author Labolasya
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zhihu.com/*
// @match *://*.www.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/538511/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538511/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
let css = `

    /* ============ 全局布局 ============ */
    :root {
        --app-width: initial;
    }

    *:not(p) {
        font-size: clamp(16px, 2vw, 24px);
        min-width: 0;
    }

    body {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        -webkit-text-size-adjust: 100%;
        overflow-x: hidden;
        /* overscroll-behavior-y: contain; 可选 */
    }

    /* ============ 顶部导航栏 ============ */
    .AppHeader {
        min-width: initial;
        a[aria-label="知乎"] {
            display: none;
        }
        .QuestionHeader-content {
            max-width: 100vw;
            width: initial;
        }
        .PageHeader .QuestionHeader-title {
            white-space: initial;
        }
    }

    .AppHeader > .AppHeader-inner {
        min-width: initial;
        width: initial;
        padding: 0 8px;
    }
    
    .AppHeader nav:has(a[href="https://www.zhihu.com/follow"]),
    a[href="https://zhida.zhihu.com/"] {
        display: none;
    }
    .AppHeader .Popover:has(button[aria-label="私信"]),
    .AppHeader a[href="https://www.zhihu.com/creator"] {
        display: none;
    }
    
    .AppHeader .SearchBar-askContainer {
        display: none;
    }

    .AppHeader-userInfo {
        margin-left: 16px !important;
    }

    .AppHeader-userInfo button {
        margin-right: 8px;
    }

    /* ============ 首页内容流 ============ */
    .Topstory-container {
        width: initial;
        padding: 0;
    }

    .Topstory-container > :not(.Topstory-mainColumn) {
        display: none;
    }

    .Topstory-container > .Topstory-mainColumn {
        width: 100%;
        box-sizing: border-box;
    }

    /* 内容卡片操作按钮压缩 */
    .ContentItem-actions {
        flex-wrap: wrap;
        gap: 10px;
    }

    .ContentItem-actions > * {
        margin-left: 0;
    }

    .ContentItem-actions > span:first-child {
        display: flex;
        gap: 3px;
    }

    .ContentItem-actions [aria-label="反对"] {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ContentItem-actions > button:has(svg.Zi--Comment) {
        display: flex;
        justify-content: center;
        flex-basis: 30%;
        order: 2;
    }

    .ContentItem-actions > button:has(svg.Zi--ArrowDown) {
        order: 3;
    }

    .ContentItem-actions button:not(:has(.Zi--Comment, .Zi--TriangleUp, .Zi--Heart)) {
        font-size: 0;
    }

    .ContentItem-actions button span {
        line-height: 1;
        font-size: 14px;
    }

    /* ============ 弹窗样式 ============ */
    [style="opacity: 1; transform: none;"] {
        width: 90vw;
        max-width: 90%;
    }

    button[aria-label="关闭"] {
        position: fixed;
        z-index: 9999;
        top: 0;
        right: 0;
        padding: 4px;
    }

    /* ============ 问题页面 ============ */
    /* 问题顶部区域 */
    .QuestionHeader {
        padding: 8px;
        max-width: calc(100% - 16px);
    }

    .QuestionHeader-content {
        gap: 8px;
        flex-wrap: wrap;
        padding: 0;
        width: initial;
    }

    .QuestionHeader-content > .QuestionHeader-main {
        flex-basis: 100%;
    }
    .QuestionButtonGroup > button {
        margin-left: 0 !important;
    }

    .QuestionHeaderActions {
        gap: 8px;
        flex-wrap: wrap;
    }

    .QuestionHeaderActions > * {
        flex-basis: 40%;
        display: flex;
        justify-content: start;
        padding-left: 0;
        border: 0;
    }

    .QuestionFollowStatus > .NumberBoard {
        margin: 0;
    }

    .QuestionHeader-footer-main {
        padding-left: 0;
        gap: 8px;
        flex-wrap: wrap;
    }

    .QuestionHeader-footer-main > * {
        margin-left: 0 !important;
        flex-basis: 100%;
        max-width: 90vw;
    }

    .QuestionHeader-footer-main > .QuestionHeader-actions {
        flex-direction: row-reverse;
    }

    .QuestionHeader-main,
    .QuestionHeader-side,
    .Question-mainColumn {
        width: initial;
        min-width: initial;
        max-width: initial;
    }

    /* 关怀模式 */
    #Popover4-toggle {
        display: none;
    }

    /* 问题主体内容区域 */
    .Question-main {
        margin: 0;
        padding: 0;
    }
    
    .Question-main .Question-mainColumnLogin {
        display: none;
    }

    .Question-main > .Question-mainColumn {
        width: 90vw;
        padding: 0 16px;
    }

    .Question-main > .Question-sideColumn {
        display: none;
    }

    .Card.ViewAll {
        width: initial;
    }

    /* 富文本链接卡片 */
    .RichText-LinkCardContainer > a {
        margin: 0 !important;
        max-width: 80vw !important;
    }

    /* 作者徽章宽度修正 */
    .AuthorInfo-badgeText {
        width: initial !important;
    }

    figure {
        display: inline-block;
    }

    img {
        width: 100%;
        max-width: 90vw !important;
    }

    /* ============ 个人资料页 ============ */
    #ProfileHeader {
        width: initial;
    }

    .ProfileHeader-main > .ProfileHeader-avatar {
        max-width: 40vw;
        max-height: 40vw;
        top: -20vw !important;
    }
    .ProfileHeader-main > .ProfileHeader-content {
        border: 0;
        padding: 0;
        margin: 0;
        padding-top: 30vw;
    }
    .ProfileButtonGroup.ProfileHeader-buttons {
        position: initial;
        margin-top: 8px;
    }

    .ProfileHeader-title {
        flex-wrap: wrap;
    }

    .ProfileHeader-name {
        flex-basis: 100%;
    }
    .ProfileHeader-headline {
        margin-top: 8px;
    }

    .ProfileHeader-contentBody {
        width: initial;
        margin-bottom: 8px;
    }

    .ProfileHeader-contentFooter > .ProfileHeader-expandButton {
        margin-bottom: 8px;
    }

    .Profile-main {
        gap: 16px;
        flex-direction: column;
    }

    .Profile-main > .Profile-mainColumn {
        width: 100%;
        flex-basis: 100%;
    }

    .Profile-main > .Profile-sideColumn {
        width: 100%;
        max-width: initial;
        margin: 0;
    }

    /* ============ 专栏页 ============ */
    .Post-content {
        min-width: initial;
    }
    .Post-Row-Content {
        margin: 0;
        flex-direction: column;
        padding: 0;
    }
    .Post-Row-Content-left,
    .Post-Row-Content-right {
        width: 100% !important;
        margin: auto;
    }

    .Recommendations-BlockTitle {
        text-align: center;
    }

    .Recommendations-List {
        flex-direction: column;
        align-items: center;
        button {
            display: none;
        }
    }
    .PostItem {
        width: 330px;
    }

    /* ============ 登录面板 ============ */
    .signFlowModal {
        max-width: 100%;
    }
    
    .signQr-container {
        flex-direction: column;
        *:not(input) {
            width: initial
        }
    }
    .signQr-leftContainer > .Qrcode-container {
        padding-top: 0;
    }
    .signQr-rightContainer {
        order: -1;
    }

    .Login-socialButtonGroup {
        flex-basis: 150px;
    }

    /* 提示登录 */
    div > div:has([src="https://static.zhihu.com/heifetz/assets/liukanshan-peek.a71ecf3e.png"]) {
        display: none;
    }
    /* 登录弹窗和表情选择弹窗使用同一个样式，不可直接屏蔽 */

    /* ============ 热榜 ============ */
    .HotItem {
        flex-direction: column;
    }
    .HotItem-rank {
        float: left;
        clear: none;
    }
    .HotItem-label {
        position: relative;
        top: 4px;
        left: 4px;
        float: left;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
