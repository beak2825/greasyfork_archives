// ==UserScript==
// @name         simplify zhihu
// @namespace    https://greasyfork.org/scripts/38774
// @version      0.9
// @description         simplify zhihu. simple, simplified, simply.
// @description:zh-CN   知乎简化版,去掉固定和浮动内容, 只保留最基本的正文. 简化，精简知乎。
// @description:zh-CN   v0.8 解决专栏回到顶部闪烁问题
// @description:zh-CN   v0.9 增加专栏匹配。禁止问题页面登录弹窗；评论区隐藏输入框
// @description:zh-CN   参考：极简知乎 https://greasyfork.org/en/scripts/37823
// @description:zh-CN   参考：知乎免登陆自动跳转发现页 https://greasyfork.org/en/scripts/404602
// @author       chaosky
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/people/*
// @match        https://www.zhihu.com/topic/*
// @match        https://www.zhihu.com/search?*
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/follow
// @match        https://www.zhihu.com
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        GM_log
// @grant        GM_addStyle
// @
// @downloadURL https://update.greasyfork.org/scripts/38774/simplify%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/38774/simplify%20zhihu.meta.js
// ==/UserScript==

(function() {
    GM_addStyle (`
.CommentEditor-input { display: none !important; }
.CommentEditor-singleButton { display: none !important; }

.Sticky.is-fixed { position: relative !important; }
.Sticky--holder { display: none !important; }

.Modal-backdrop{background-color: transparent;}
.signFlowModal{display:none !important;}

.Question-sideColumn--sticky { position: relative !important; }
.AppHeader { display: none !important; }
.GlobalSideBar { display: none !important; }
.Question-sideColumn { display: none !important; }
.AdblockBanner { display: none !important; }
.Post-SideActions { display: none !important; }
    `);
    // 问题页面登录弹窗
    GM_addStyle (`
html { overflow: auto !important;}
.Modal-wrapper { display:none !important; }
.Modal-backdrop { display:none !important; background-color: transparent; }
.signFlowModal { display:none !important; }
    `);
    // 评论区隐藏输入框
    GM_addStyle (`
.CommentEditorV2--normal { display: none !important; }
.CommentEditor-singleButton { display: none !important; }
 `);
})();
