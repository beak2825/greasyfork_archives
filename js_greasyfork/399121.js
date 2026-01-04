// ==UserScript==
// @name         MCBBS愚人节
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  MCBBS愚人节特供脚本
// @author       我是绵羊Yang_g
// @include     http*://*.mcbbs.net*
// @match       http://*.mcbbs.net/
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399121/MCBBS%E6%84%9A%E4%BA%BA%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/399121/MCBBS%E6%84%9A%E4%BA%BA%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var nv_ul = document.getElementsByClassName("nv_ul")//.style.transform = "rotate(1deg)";

    //nv_ul.style.transform = "rotate(1deg)";
    //nv_ul.setAttribute("style", "transform:rotate(1deg);");

    var cssStr = ".nv_ul {transform:rotate(181deg);}";
    cssStr += ".nv_ul a {transform:rotate(540deg);}";
    cssStr += "#nv_right {transform:rotate(-2deg);}";
    cssStr += ".boardnav {transform:rotate(-1deg);}";
    cssStr += "#toptb {transform:rotate(-1deg);}";
    cssStr += ".z {transform:rotate(1deg);}";
    cssStr += "#postlist {transform:rotate(-1deg);}";
    cssStr += "#pgt img {transform:rotate(1deg);}";
    cssStr += "#vfastpostform {transform:rotate(2deg);}";
    cssStr += "#p_btn {transform:rotate(3deg);}";
    cssStr += ".sign {transform:rotate(2deg);}";
    cssStr += ".avatar {transform:rotate(4deg);}";
    cssStr += ".z a {transform:rotate(2deg);}";
    cssStr += ".hdc a img {transform:rotate(2deg);}";
    cssStr += "#visitedforums {transform:rotate(2deg);}";
    cssStr += ".xl1 li {transform:rotate(2deg);}";
    cssStr += "#post_replytmp {transform:rotate(2deg);}";
    cssStr += "#fastpostform {transform:rotate(1deg);}";
    cssStr += "#visitedforumstmp {transform:rotate(2deg);}";
    cssStr += "#newspecial {transform:rotate(2deg);}";
    cssStr += "#fastpostform {transform:rotate(2deg);}";
    cssStr += "#ft {transform:rotate(2deg);}";
    cssStr += ".move-span {transform:rotate(-1deg);}";
    cssStr += ".portal_left_dev {transform:rotate(1deg);}";
    cssStr += ".bmw {transform:rotate(1deg);}";
    cssStr += "#postsubmit {transform:rotate(180deg);}";
    cssStr += "#e_body {transform:rotate(1deg);}";
    cssStr += ".xs2 {transform:rotate(180deg);padding:0 0 0 160px;}";
    cssStr += ".forum_index_title h2 {transform:rotate(180deg);padding:0 0 0 520px;}";
    cssStr += "div .special_info {transform:rotate(180deg);}";
    cssStr += ".special_user_info2 {transform:rotate(180deg);}";
    cssStr += ".appl {transform:rotate(180deg);}";
    cssStr += ".slideshow img {transform:rotate(180deg);}";
    cssStr += ".user_tools a {transform:rotate(180deg);}";
    cssStr += ".y_search {transform:rotate(180deg);}";
    cssStr += ".fl_by {transform:rotate(180deg);}";
    cssStr += "#thread_types li {transform:rotate(180deg);}";
    cssStr += "#scrolltop .scrolltopa {background: url(https://attachment.mcbbs.net/forum/202004/01/122018pbdp4e6er4wqw6wv.png) left top no-repeat !important}";
    cssStr += ".authi .xw1 {transform:rotate(180deg);padding:0 0 0 10px;display:block;}";
    cssStr += ".icn {transform:rotate(180deg);}";
    //cssStr += ".nv_ul li {filter:blur(5px);}";
    //cssStr += ".avatar a img {filter:blur(5px);}";
    cssStr += "#e_iframe {filter: grayscale(100%);}";
    cssStr += "";

    if (window.location.pathname == "/forum-the_end-1.html") {
        cssStr += "body {filter:blur(2px);}";
    }

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = cssStr;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);



})();