// ==UserScript==
// @name FK CSDN
// @namespace joyhooian.styles
// @version 0.4
// @description 对CSDN的文章布局优化
// @author joyhooian
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://blog.csdn.net/.*/article/details/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/459991/FK%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/459991/FK%20CSDN.meta.js
// ==/UserScript==

(function() {
let css = `
* {
    user-select: auto !important;
}

aside {
    display: none;
}

#mainBox {
    display: flex;
    justify-content: center;
}

.toolbar-inside {
    display: none;
}

body {
    min-width: unset;
}

@media screen and (max-width: 1320px) {
    .nodata .container main {
        width: 95vw;
    }
}

@media screen and (min-width: 1550px) {
    .nodata .container {
        margin-right: 0px;
    }
}

.article-type-img {
    display: none;
}

.blog-tags-box {
    display: none!important;
}

.article-time-img {
    display: none!important;
}

.article-read-img {
    display: none!important;
}

.read-count {
    display: none;
}

#blog_detail_zk_collection {
    display: none!important;
}

div .operating {
    display: none;
}

.article-bar-top {
    display: flex;
    width: 100%!important;
}

.bar-content {
    width: 100%!important;
    padding-right: 12px!important;
}

.up-time {
    display: none!important;
}

#blogHuaweiyunAdvert {
    display: none;
}

#blogColumnPayAdvert {
    display: none;
}

pre.set-code-hide {
    height: unset!important;
    overflow-y: unset!important;
}

pre {
    margin: 0 0!important;
}

.hide-preCode-box {
    display: none;
}

.hljs-button {
    display: none!important;
}

#treeSkill {
    display: none!important;
}

#toolBarBox {
    display: none;
}

.recommend-box {
    display: none!important;
}

#pcCommentBox {
    display: none!important;
}

.blog-footer-bottom {
    display: none;
}

.template-box {
    display: none;
}

#rightAside {
    display: none!important;
}

.csdn-side-toolbar  {
    display: none!important;
}

body {
    background: unset;
    background-color: black;
    background-image: unset!important;
}

.container {
    margin-left: unset!important;
}

#recommendNps {
        display: none!important;
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
