// ==UserScript==
// @name         贴吧楼层锚点
// @namespace    https://greasyfork.org/zh-CN/scripts/11840-%E8%B4%B4%E5%90%A7%E6%A5%BC%E5%B1%82%E9%94%9A%E7%82%B9
// @version      1.0
// @description  用于分享帖子时直接转到特定楼层
// @author       iamGates
// @match        http://tieba.baidu.com/p/*
// @grant        none
// @run-at       document-end
// @license      GPL version 3
// @encoding     utf-8
// @date         19/08/2015
// @modified     19/08/2015
// @downloadURL https://update.greasyfork.org/scripts/11840/%E8%B4%B4%E5%90%A7%E6%A5%BC%E5%B1%82%E9%94%9A%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/11840/%E8%B4%B4%E5%90%A7%E6%A5%BC%E5%B1%82%E9%94%9A%E7%82%B9.meta.js
// ==/UserScript==

function get_l_Link(e){
    var pid = e.target.getAttribute('data');
    var url = 'http://tieba.baidu.com/p/'+ PageData.thread.thread_id + '?pid=' + pid + '#' + pid;
    prompt("按下Ctrl+C复制到剪贴板", url);
}

(function addAnchor(){
    $('.l_post.l_post_bright.j_l_post.clearfix').each(function(){
        var pid = $.parseJSON(this.getAttribute('data-field')).content.post_id;
        var tw = this.querySelector('.post-tail-wrap');
        $(tw).append('<a class="addup_l tail-info" href="#" onclick="return false" data="' + pid + '" style="color=#999">锚点</a>');
        tw.querySelector('.addup_l').addEventListener('click', get_l_Link);
    })
})();