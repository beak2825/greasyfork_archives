// ==UserScript==
// @name         简化 CSDN Blog 详情 - Fuck CSDN Blog
// @namespace    github.com/yuunie
// @version      1.2
// @description  简化 CSDN 博客详情页面，免登录复制
// @author       1591216902@qq.com
// @license      MIT
// @match        *://blog.csdn.net/*
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @grant        GM_addStyle
// @grabt        PRO_addStyle
// @grabt        addStyle
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448824/%E7%AE%80%E5%8C%96%20CSDN%20Blog%20%E8%AF%A6%E6%83%85%20-%20Fuck%20CSDN%20Blog.user.js
// @updateURL https://update.greasyfork.org/scripts/448824/%E7%AE%80%E5%8C%96%20CSDN%20Blog%20%E8%AF%A6%E6%83%85%20-%20Fuck%20CSDN%20Blog.meta.js
// ==/UserScript==

function addCss(css) {
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
}

function runCss() {
    const css = `
body {
background: #f5f6f7!important;
}
#csdn-toolbar {

}
.toolbar-menus.csdn-toolbar-fl {
display:none!important;
}
.toolbar-container-middle {
display:none!important;
}
.toolbar-btn.toolbar-btn-vip {
display:none!important;
}
.toolbar-btn.toolbar-btn-dynamic.toolbar-mp-menubox {
display:none!important;
}
#toolBarBox .left-toolbox {
display:none!important;
}
.recommend-box.insert-baidu-box.recommend-box-style {
display:none!important;
}
#recommendNps {
display:none!important;
}
#blogColumnPayAdvert {
display:none!important;
}
.icon-option-beta{
display:none!important;
}
.blog_container_aside {
display: none!important;
}
main {
float: none!important;
margin-left: auto!important;
margin-right: auto!important;
}
#content_views pre {
    -webkit-touch-callout: initial!important;
    -webkit-user-select: initial!important;
    -khtml-user-select: initial!important;
    -moz-user-select: initial!important;
    -ms-user-select: initial!important;
    user-select: initial!important;
}
#content_views pre code {
    -webkit-touch-callout: initial!important;
    -webkit-user-select: initial!important;
    -khtml-user-select: initial!important;
    -moz-user-select: initial!important;
    -ms-user-select: initial!important;
    user-select: initial!important;
}
.hljs-button.signin {
display:none!important;
}
#csdn-toolbar .toolbar-container, #csdn_tool_otherPlace .toolbar-container {
min-width: 1000px!important;
max-width: 1000px!important;
}
.toolbar-btn.toolbar-btn-write > a > i {
display:none!important;
}
.option-box.sidecolumn {
display:none!important;
}
    `
    // 添加样式
    addCss(css)
}

function runJs() {
    $('.option-box.sidecolumn.sidecolumn-hide').click()
    const interval = setInterval(() => {
        $('.option-box.sidecolumn.sidecolumn-hide').click()
    }, 100)
    setTimeout(() => {
        clearInterval(interval)
    }, 2000)
}


(function () {
    'use strict';
    runCss()
    window.onload = function () {
        runCss()
        runJs()
    }
})();
