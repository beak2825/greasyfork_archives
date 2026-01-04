// ==UserScript==
// @name         洛谷屏蔽灌水区讨论
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  开了学术还是忍不住查看灌水区的讨论怎么办？没关系！这款插件可以帮到你！（与洛谷官方学术模式功能一起使用效果更佳）
// @author       rui_er
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411371/%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E7%81%8C%E6%B0%B4%E5%8C%BA%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411371/%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E7%81%8C%E6%B0%B4%E5%8C%BA%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
  $('document').ready(function(){setTimeout(function() {
    'use strict';
    var block = localStorage.doBlock;
    if(block == undefined || block == "undefined") {
        block = 0;
    }
    localStorage.doBlock = block;
    if(location.pathname == "/") {
        console.log("matched 2!");
        $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
        $firstele = $($sidebar.children()[0]);
        $finder = $(`
          <div class="lg-article" id="block-water">
            <h2>屏蔽灌水区讨论</h2>
            <script>
function do_change_status() {
    var block = parseInt(localStorage.doBlock);
    if(block != 0 && block != 1) {
        block = 0;
    }
    block = 1 - block;
    localStorage.doBlock = block;
    location.href="/";
}
var block = parseInt(localStorage.doBlock);
var html = "<p ";
if(block == 1) {
    html += "style='color:red;'>屏蔽</p>";
}
else {
    html += "style='color:green;'>允许</p>";
}
document.getElementById("status-show").innerHTML = html;
            </script>
            <button class="am-btn am-btn-sm am-btn-primary" id="change-status-button" onclick="do_change_status()" style="margin-top:16px">更改状态</button>
            <p>当前状态：</p>
            <span><div id="status-show"></div></span>
          </div>
        `);
        $finder.insertAfter($firstele);
    }
    if($(".colored").text()=="灌水区") {
        if(parseInt(localStorage.doBlock) == 1) {
            show_alert("好像哪里有点问题", "您正在浏览灌水区讨论");
            window.history.go(-1);
        }
    }
    if(location.search.match(/forumname=relevantaffairs/)) {
        if(parseInt(localStorage.doBlock) == 1) {
            show_alert("好像哪里有点问题", "您正在浏览灌水区讨论列表");
            window.history.go(-1);
        }
    }
  },500)});
})();