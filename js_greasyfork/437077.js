// ==UserScript==
// @name         自用-屏蔽知乎首页活动广告
// @version      2
// @author       none
// @description  抄了个代码,屏蔽知乎首页活动广告
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace    nothing
// @downloadURL https://update.greasyfork.org/scripts/437077/%E8%87%AA%E7%94%A8-%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%B4%BB%E5%8A%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/437077/%E8%87%AA%E7%94%A8-%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E6%B4%BB%E5%8A%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

//代码来源 https://github.com/XIU2/UserScript
(function() {
    'use strict';
    addStyle();

    // 添加样式
    function addStyle() {
        let style = `/* 屏蔽登录提示（问题页中间的元素） */
.Question-mainColumnLogin {display: none !important;}
/* 屏蔽回答页广告 */
.Pc-card.Card {display: none !important;}
/* 屏蔽文章页推荐文章 */
.Recommendations-Main {display: none !important;}
`,
            style_index = `/* 屏蔽首页广告 */
.TopstoryItem--advertCard {display: none !important;}
/* 屏蔽首页活动广告 */
main.App-main > .Topstory > div:not(.Topstory-container) {display: none !important;}
html[data-theme="light"] header.AppHeader {background-color: #ffffff !important; -webkit-box-shadow: 0 1px 3px rgba(18,18,18,.1) !important; box-shadow: 0 1px 3px rgba(18,18,18,.1) !important;}
html[data-theme="light"] header.AppHeader a[aria-label="知乎"] svg {filter: invert(57%) sepia(71%) saturate(949%) hue-rotate(190deg) brightness(86%) contrast(188%) !important;}
html[data-theme="light"] .AppHeader-TabsLink {color: #8590a6 !important; font-weight: normal !important;}
html[data-theme="light"] .AppHeader-userInfo Button svg, .SearchBar-searchButton svg {color: inherit !important;}
html[data-theme="light"] .Input-wrapper.Input-wrapper--grey {background: #f6f6f6 !important;}
html[data-theme="light"] .AppHeader-SearchBar input.Input {color: #121212 !important;}
html[data-theme="light"] .AppHeader-SearchBar input::-webkit-input-placeholder {color: #a4a4a4 !important;}
html[data-theme="light"] .AppHeader-SearchBar input:-moz-placeholder {color: #a4a4a4 !important;}
html[data-theme="light"] .AppHeader-SearchBar input::-moz-placeholder {color: #a4a4a4 !important;}
html[data-theme="light"] .Button--primary.Button--blue {color: #fff !important;background-color: #06f !important;}
            `,
            style_3 = `/* 向下翻时自动隐藏顶栏*/
header.is-hidden {display: none;}
`
        let style_Add = document.createElement('style');

        if (location.pathname === '/' || location.pathname === '/hot' || location.pathname === '/follow') style += style_index;

        // 向下翻时自动隐藏顶栏
        style += style_3;

        if (document.lastChild) {
            document.lastChild.appendChild(style_Add).textContent = style;
        } else { // 避免网站加载速度太慢的备用措施
            let timer1 = setInterval(function(){ // 每 300 毫秒检查一下 html 是否已存在
                if (document.lastChild) {
                    clearInterval(timer1); // 取消定时器
                    document.lastChild.appendChild(style_Add).textContent = style;
                }
            },300);
        }
    }
})();