// ==UserScript==
// @name doubanResize
// @namespace mailto: fish404hsif@gmail.com
// @version 0.1.2
// @description resize douban short comment
// @author fish-404
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.douban.com/*
// @downloadURL https://update.greasyfork.org/scripts/468962/doubanResize.user.js
// @updateURL https://update.greasyfork.org/scripts/468962/doubanResize.meta.js
// ==/UserScript==

(function() {
let css = `
    /* 发现豆瓣的textarea使用的样式太多了... 或许直接使用 textarea tag 作为选择器更好？ */
    .comments-app-wrapper textarea /* 笔记的回复 */
    , .txd textarea /* 豆列的回复 */
    , .comment-warapper textarea /* 小组的回复 */
    , .basic-textarea /* 豆列的描述 */ 
    , text.comment /* 书影音短评 */
    , .textarea_basic /* 豆瓣书籍 音乐的信息编辑框 */
    ，#isay-cont
    { 
        resize: vertical;
    }
    
    /* 隐藏书影音短评弹出框阴影 */
    #overlay {
        display: none;
    }
    
    /* 书影音短评弹出框上移 */
    #dialog {
        top: 37% !important;
    }
    
    /* 书影音短评弹出框短评区域高度调整 按350字高度调整 */
    #dialog textarea {
        height: 178px;
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
