// ==UserScript==
// @name 百度知道 简洁版
// @namespace Waley.Z
// @version 0.0.1
// @description 去除百度知道的广告等
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.zhidao.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/407129/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/407129/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
let css = `
#answer-bar.exp-answerbtn-yh:after{
    display: none !important;
}
.task-list-button{
    display: none !important;
}
.jump-top-box{
    display: none !important;
}
.wgt-header-title .wgt-header-title-content .exp-topwld-tip{
    display: none !important;
}
.nav-menu-container .nav-show-control .nav-menu-layout .nav-menu .nav-menu-content .content-box .menu-right-section .menu-right-list .menu-right-list-item .menu-right-list-link .new-icon{
    display: none !important;
}
.nav-menu-container .nav-show-control .nav-menu-layout .nav-menu .nav-menu-content .content-box .menu-right-section .menu-right-list .menu-right-list-item .menu-right-list-link .phone-icon{
    display: none !important;
}
.qb-section .qb-side{
    display: none !important;
}
.question-all-answers-number .question-number-text-chain{
    display: none !important;
}
.qb-section .qb-content{
	width: 850px !important;
	border-right: none !important
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
