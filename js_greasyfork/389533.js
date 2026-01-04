// ==UserScript==
// @name         Make wechat to dingTalk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       none
// @match        https://wx.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389533/Make%20wechat%20to%20dingTalk.user.js
// @updateURL https://update.greasyfork.org/scripts/389533/Make%20wechat%20to%20dingTalk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector('[type="image/x-icon"]').href = 'https://g.alicdn.com/dingding/web/0.1.8/img/logo.png'

    var config = { childList: true, attributes: true, subtree: true };
    var title = document.querySelector("title");

    new MutationObserver((x) => {
        if (x.length>0 && x[0].addedNodes.length >= 1 && x[0].addedNodes[0].textContent !== "DingTalk") {
            document.title = "DingTalk";
        }
    }).observe(title, config);

    document.title = "DingTalk";
    var cssT = `.main:before {
content:'';
display:block;
margin:0 auto;
width: 1000px;
height: 60px;
background-size: auto 28px!important;
border-bottom: 1px solid #e6e5e6;
border-top-left-radius: 3px;
border-top-right-radius: 3px;
background: url(https://g.alicdn.com/DingTalkWeb/web/3.8.7/assets/webpack-img/logo_en.png) no-repeat 35px 18px scroll #008cee;
position: relative;
-webkit-app-region: drag;
}
.panel {
border:1px solid #d6d6d6;
}
.panel, .chat_item.top {
background: #f5f9ff;
}
.chat_item.active {
background:#d5edfe;
}
.chat_item.active .ext, .chat_item.active .info .msg {
color:#777;
}
.chat_item .avatar .img {
box-sizing: border-box;
background-size: cover;
background-clip: content-box;
background-position: 50%;
border-radius: 50%;
height:46px;
width:46px;
}
.chat_item .info .nickname {
color:#222;
font-size:14px;
}
.chat_item {
border:none;
padding: 9px 18px 9px;
}
.download_entry {
display:none;
}
.panel.give_me .nav_view {
top: 120px;
}
.header .info .nickname .display_name {
color:#333;
}
body {
background: url(https://g.alicdn.com/DingTalkWeb/web/3.8.7/assets/webpack-img/main-bg.png) no-repeat #5a83b7;
background-size: cover;
}
.tab {
display:none;
}
.search_bar .frm_search {
background-color: white;
}
.main_inner {
width:1000px;
height:600px;
}
.recommendation {
box-shadow:0 0 10px #d3d9e4;
background-color:white;
}
.recommendation .contact_title {
background-color:white;
}
.recommendation .contact_item.on {
background-color:#e4f1ff;
}
.recommendation .contact_item {
border-bottom:1px solid #c9d8f1;
background-color:white;
}
.recommendation .info .nickname {
color:black;
}
.search_bar .frm_search {
color:black;
}
.box_hd .title_wrap {
height:38px;
padding-left:20px;
padding-top:5px;
}
.box_hd {
text-align:left;
}
.box_hd .title.poi:after {
display: block;
content:"阿里巴巴(CCO 线-集团客户体验事业部)";
height: 20px;
font-size: 12px;
color: #a0a0a0;
margin-top: -10px
}
.box, .box_hd .title_wrap {
background:#f8fbff;
}
.bubble_cont .plain {
border: 1px solid #e1e0e4;
border-radius: 6px;
padding: 6px 10px;
}
.bubble.bubble_primary {
border: 1px solid #38adff;
background-color: #38adff;
border-radius: 6px;
color:white;
}
.bubble.bubble_primary .plain {
border:none;
}`;

    function addStyle(styles) {

        /* Create style document */
        var css = document.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet)
            css.styleSheet.cssText = styles;
        else
            css.appendChild(document.createTextNode(styles));

        /* Append style to the tag name */
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    addStyle(cssT);

})();