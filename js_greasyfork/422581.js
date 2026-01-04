// ==UserScript==
// @name         小站过滤器
// @namespace    mudiv
// @version      0.1
// @description  屏蔽不美好
// @author       mudiv
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @include https://xiaozh.xyz/*
// @downloadURL https://update.greasyfork.org/scripts/422581/%E5%B0%8F%E7%AB%99%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/422581/%E5%B0%8F%E7%AB%99%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

var black_list = [];
var strict_block = true;

var black_list_url = [];
for(var black_list_index = 0; black_list_index < black_list.length; black_list_index++) {
    black_list_url.push('https://xiaozh.xyz/?user-' + black_list[black_list_index] + '.htm');
}

var thread_list = document.getElementsByClassName("media thread tap  ");
if(thread_list) {
    var blocked_thread = [];
    for(var thread_index = 0; thread_index < thread_list.length; thread_index++) {
        var thread = thread_list[thread_index];
        if(black_list_url.includes(thread.getElementsByTagName("a")[0].href)) {
            blocked_thread.push(thread);
        }
    }
    for(var blocked_thread_index = 0; blocked_thread_index < blocked_thread.length; blocked_thread_index++) {
        blocked_thread[blocked_thread_index].remove();
    }
}

var post_list = document.getElementsByClassName("media post");
if(post_list) {
    var blocked_post = [];
    for(var post_index = 0; post_index < post_list.length; post_index++) {
        var post = post_list[post_index];
        if(black_list_url.includes(post.getElementsByTagName("a")[0].href)) {
            blocked_post.push(post);
        } else if(strict_block && post.getElementsByClassName("text-small text-muted user").length > 0 && black_list_url.includes(post.getElementsByClassName("text-small text-muted user")[0].href)) {
            blocked_post.push(post);
        }
    }
    for(var blocked_post_index = 0; blocked_post_index < blocked_post.length; blocked_post_index++) {
        blocked_post[blocked_post_index].remove();
    }
}