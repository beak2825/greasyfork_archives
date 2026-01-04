// ==UserScript==
// @name         一键举报 for 百度贴吧
// @namespace    https://github.com/raizocn/One-Click-Report
// @version      0.11
// @description  在浏览百度贴吧时，在每一个帖子左上角显示的回复数位置加入一个"举报"按键。(打开一个贴吧，右键点击插件栏Tampermonkey图标，如图点击选项启动脚本)
// @author       Raizo_cn
// @supportURL   https://github.com/raizocn/One-Click-Report
// @grant        none

// @include        http://tieba.baidu.com/*
// @include        https://tieba.baidu.com/*
// @match          http://tieba.baidu.com/*
// @match          https://tieba.baidu.com/*
// @run-at              context-menu
// @downloadURL https://update.greasyfork.org/scripts/370526/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5%20for%20%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/370526/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5%20for%20%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var append_div = document.getElementsByClassName(' j_thread_list clearfix');
    var append_location = document.getElementsByClassName('col2_left j_threadlist_li_left');

    var x, i;

    for (i = 0; i < append_location.length; i++) {


        x = append_location[i];
        var btn = document.createElement('a');
        btn.innerText = '举报';
        btn.setAttribute('href', '#')
        var id = JSON.parse(append_div[i].getAttribute('data-field')).id;
        var first_post_id = JSON.parse(append_div[i].getAttribute('data-field')).first_post_id;
        var oneclickContent = "window.open('http://tieba.baidu.com/complaint/info?type=2&cid=0&tid=" + id + "&pid=" + first_post_id + "','newwindow', 'height=900, width=800, toolbar =no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no');return false;"
        console.log(oneclickContent)
        btn.setAttribute('onclick', oneclickContent)
        x.appendChild(btn)
    }

    console.log("done");
})();