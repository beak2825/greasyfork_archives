// ==UserScript==
// @name        知乎标题栏毛玻璃
// @namespace   none
// @version     1.22
// @description 一款可以使知乎标题栏呈现毛玻璃效果的用户样式表。
// @description 问题反馈请到https://github.com/HanHan666666/zhihu-blur
// @author      hanplus
// @license     MIT
// @grant       GM_addStyle
// @run-at      document-start
// @match       *://www.zhihu.com/*
// @match       *://zhuanlan.zhihu.com/*
// @name        zhihu_theme
// @description a theme for zhihu.com
// @description 知乎
// @description zhihu
// @downloadURL https://update.greasyfork.org/scripts/425860/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E6%A0%8F%E6%AF%9B%E7%8E%BB%E7%92%83.user.js
// @updateURL https://update.greasyfork.org/scripts/425860/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E6%A0%8F%E6%AF%9B%E7%8E%BB%E7%92%83.meta.js
// ==/UserScript==

(function () {
    let css = `
    .css-1x8hcdw {
        background-color: #ffffff89!important;
        
        }
    .Menu-item.is-active {
            background: #ffffff45!important;
        }    
    .AppHeader {
        
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background-color: #ffffff89
        }
    .RichContent-actions.is-fixed {
        -webkit-backdrop-filter:  blur(20px);
        backdrop-filter:  blur(20px);
        background-color: #ffffff89
        }
    .RichContent-actions {
            -webkit-backdrop-filter:  blur(20px);
            backdrop-filter:  blur(20px);
            background-color: #ffffff89
        }
        
    .QuestionHeader-footer {
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            background-color: #ffffff89
        }
    .UserAvatarEditor-mask {
            -webkit-backdrop-filter:  blur(20px);
            backdrop-filter:blur(20px);
            background-color: #ffffff89
        }
    .ColumnPageHeader {
            -webkit-backdrop-filter:  blur(20px);
            backdrop-filter: blur(20px);
            background-color: #ffffff89
        }
    .Popover-content--fixed {
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter:  blur(20px);
            background-color: #ffffff89
        }
    .HoverCard-loading {
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            background-color: #ffffff89		
        }
    .HoverCard {
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            background-color: #ffffff89	
    }
    .Input-wrapper.Input-wrapper--grey {
        background-color: #ffffff66;
    }
    .SimpleSearchBar-input {
        background-color: #f6f6f666!important;
    }
    .css-n9os37 {
        background: rgb(255 255 255 / 89%)!important;
        backdrop-filter: blur(20px)!important;
    }
    .Notifications-footer {
        background: #e7373700;
    }
    .css-1ne387d {
        background-color: rgb(255 255 255 / 56%) !important;
        backdrop-filter: blur(20px) !important;
    }
    .CommentCollapseButton {        
        background-color: rgb(243 243 243 / 60%);
        backdrop-filter: blur(20px)}

    `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();
