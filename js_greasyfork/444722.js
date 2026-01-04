// ==UserScript==
// @name simplify weibo.cn HTML5 (CSS)
// @namespace https://greasyfork.org
// @version 0.3
// @description simplify weibo html5 m.weibo.cn . weibo weibo.cn m.weibo.cn. same https://greasyfork.org/scripts/39878
// @author chaosky
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.m.weibo.cn/*
// @downloadURL https://update.greasyfork.org/scripts/444722/simplify%20weibocn%20HTML5%20%28CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444722/simplify%20weibocn%20HTML5%20%28CSS%29.meta.js
// ==/UserScript==

(function() {
let css = `


.lite-topbar {
    position: absolute !important;
}
.weibo-text {
    font-size: 0.75rem !important;
    line-height: 1.4 !important;
}
.f-weibo > .card-wrap {
    padding-top: 0.25rem;
}
.f-weibo .weibo-og {
    padding: 0.125rem 0 0 .25rem !important;
}
.m-text-box h3 {
    font-size: 0.75rem !important;
}
.weibo-rp {
    margin-top: 0.1rem !important;
    padding: 0.25rem !important;
}
.f-footer-ctrl {
    height: auto !important;
    padding: 0.2rem 0.075rem 1rem 0 !important;
    margin: 0.2rem 0.75rem !important;
    font-size: 0.75rem !important;
}
.card .weibo-top .m-text-cut {
    float: left !important;
    margin-left: 10px !important;
}
.m-diy-btn h4 {
    font-size: 0.725rem !important;
}
.lite-iconf {
    font-size: 0.75rem !important;
}
.m-icon {
    display: none !important;
}

.lite-page-tab {
    height: auto !important;
    line-height: normal !important;
    padding: 0.2rem .75rem !important;
    margin-top: 0.2rem !important;
    font-size: 0.75rem !important;
}
.m-text-box h4 {
    font-size: .75rem !important;
    line-height: normal !important;
}
.comment-content .m-text-box h4 {
    color: #999 !important;
}
.comment-content .card-main {
    padding: 0.25rem 0 !important;
}
.comment-content .cmt-sub-txt {
    font-size: .75rem !important;
    line-height: normal !important;
    padding: 0.2rem .625rem !important;
}
.comment-content .lite-line {
    margin: 0 !important;
    padding: 0 !important;
}
.comment-content .m-img-box {
    width: 1.5rem !important;
    height: 1.5rem !important;
}

.m-box .lite-bot-link {
    font-size: .75rem !important;
}
.lite-page-editor {
    position: inherit !important;
}
div.main > div > div.wrap {
    display: none !important;
}
.m-avatar-box .m-img-box img {
    border-radius: 0 !important;
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
