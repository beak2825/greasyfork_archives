// ==UserScript==
// @name         多栏显示百度搜索结果 - 基于 BaiduX 的油猴版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不想再装一个Stylish扩展，就把BaiduX（https://userstyles.org/styles/158871/dark-mode-baidux）改成了油猴版！
// @author       You
// @match        *.baidu.com/s?*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388365/%E5%A4%9A%E6%A0%8F%E6%98%BE%E7%A4%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20-%20%E5%9F%BA%E4%BA%8E%20BaiduX%20%E7%9A%84%E6%B2%B9%E7%8C%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/388365/%E5%A4%9A%E6%A0%8F%E6%98%BE%E7%A4%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20-%20%E5%9F%BA%E4%BA%8E%20BaiduX%20%E7%9A%84%E6%B2%B9%E7%8C%B4%E7%89%88.meta.js
// ==/UserScript==

var style = `
body {
overflow-x: hidden;
min-width: 600px;
}
/*关键词高亮无框*/

em,
font[color="#CC0000"] {
color: #C00 !important;
text-decoration: none !important;
}
/*去除贴吧知道*/
/*
#rs, .to_tieba, .to_zhidao_bottom
{
display: none;
}*/
/*关键词高亮带框*/
/*em, font[color="#CC0000"]
{
background-color: rgba(51,133,255,0.1) !important;
color: #C00 !important;
text-decoration: none !important;
border: 1px solid #3385ff !important;
border-radius: 5px !important;
}*/

.wrapper_l .s_form {
width: 760px !important;
margin: 0 auto !important;
transform: translatex(-40px);
}

.s_tab,
.nums,
.search_tool_conter,
#rs,
.to_tieba,
.to_zhidao_bottom {
margin: 0 auto !important;
}

.headBlock {
margin-left: 0;
}

.headBlock>div {
margin: auto;
}

.head_nums_cont_inner>div {
width: 600px;
}

#page,
#s_tab {
padding-left: 0px !important;
text-align: center !important;
}

#container {
width: 100%;
}

#content_right {
display: none;
}

#content_left {
padding: 0;
width: 96%;
padding-left: 2%;
display: block;
/*counter-reset: results;*/
column-gap: 0;
-moz-column-gap: 0;
-webkit-column-gap: 0;
}

.rrecom-container,
.xpath-log:not(.c-container) {
transform: scale(0);
}

@media (min-width: 1201px) and (max-width: 1700px) {
#content_left {
column-count: 2;
-moz-column-count: 2;
-webkit-column-count: 2;
}
}

@media (min-width: 1701px) and (max-width: 2200px) {
#content_left {
padding-left: 3%;
column-count: 3;
-moz-column-count: 3;
-webkit-column-count: 3;
}
}

@media (min-width: 2201px) {
#content_left {
padding-left: 4%;
column-count: 4;
-moz-column-count: 4;
-webkit-column-count: 4;
}
}

#content_left>div:not([class^="result"]) {
position: absolute;
margin-top: -1em;
margin-left: 1em;
}

#content_left>div[class^="result"] {
display: inline-block;
width: 91%;
padding: 15px 15px;
margin: 1em;
word-break: normal;
word-wrap: normal;
position: relative;
z-index: 1;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
border-radius: 2px;
background-color: white;
overflow: hidden;
}

#content_left>div[class^="result"]:before {
/*counter-increment: results;
content: counter(results);*/
z-index: -10;
color: #eee;
font-size: 4.5em;
position: absolute;
text-align: right;
width: 96%;
line-height: 1em;
top: 6px;
}

#content_left>div[class^="result"] .sitelink {
word-wrap: break-word;
}

#content_left .result-op>div {
width: 540px;
}

.c-border {
border: 0;
box-shadow: none;
}

.to_tieba {
display: none;
}

.hint_common_restop {
display: none;
}

#rs {
width: 100%;
text-align: center;
padding: 0;
margin: 0;
margin-top: 10px;
}

#rs .tt,
#rs table,
#rs tr,
#rs td,
#rs th {
display: inline;
padding: 0 5px;
}

#page {
margin: 15px 0 !important;
text-align: centre !important;
padding: 0 !important;
}

#page .fk {
display: none !important;
}

#page>a,
#page>strong {
height: auto !important;
}

#foot {
margin-top: 35px !important;
text-align: center !important;
}

#foot #help {
float: none !important;
padding: 0 !important;
}

div#head {
min-height: 0px !important;
-webkit-backdrop-filter: blur(20px);
backdrop-filter: blur(20px);
background-color: rgba(255, 255, 255, 0.8);
}

div#head_wrapper {
min-height: 0px !important
}

div#bottom_container {
display: none !important
}

a.s-treasure {
display: none !important
}

a.mnav,
a.s-skin,
a.s-msg,
span.user-name,
span.setting-text {
text-decoration: none !important
}

a:hover {
text-decoration: none !important
}

* {
text-decoration: none !important
}

.t:hover>a {
text-shadow: 1px 1px 20px #aaa;
}

.t {
position: relative;
}

.t:before {
content: "";
position: absolute;
left: 0%;
bottom: -2px;
width: 0;
height: 2px;
background-color: #3385ff;
transition: all .3s;
}

.t:hover:before {
width: 91%;
left: 0;
right: 0;
}
`;

loadStyleString(style);

function loadStyleString(css){
    var style = document.createElement("style");
    style.type = "text/css";
    try{
        style.appendChild(document.createTextNode(css));
    } catch (ex){
        style.styleSheet.cssText = css;
    }
    //var head = document.getElementsByTagName("head")[0];
    //head.appendChild(style);
    document.head.appendChild(style);
}