// ==UserScript==
// @name         BLOCK
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  本脚本用于在 xiaozh.xyz 网站上屏蔽特定用户的帖子和评论。用户可以通过修改脚本中的 `block_list` 数组来添加需要屏蔽的 UID。
// @author       You
// @match        https://xiaozh.xyz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532265/BLOCK.user.js
// @updateURL https://update.greasyfork.org/scripts/532265/BLOCK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        'use strict';

    // Your code here...
    debugger;
    //uid黑名单
    var block_list = ['3228','280','7909'];
    //获取帖子列表
    var post_list = document.getElementsByClassName('media thread tap');
    //遍历帖子
    for(var i = 0; i < post_list.length; i++){
        var uid = post_list[i].getElementsByClassName('username text-grey mr-1')[0].getAttribute('uid');
        //如果id在黑名单中
        if(block_list.indexOf(uid) > -1){
            post_list[i].style.display = 'none';
        }
    }
    //获取评论列表
    var comment_list = document.getElementsByClassName('media post');
    //遍历id
    for(i = 0; i < comment_list.length; i++){
        uid = comment_list[i].getAttribute('data-uid');
        var comment_html = comment_list[i].innerHTML;

        // 检查是否为黑名单用户的回帖，或者是否引用了黑名单用户
        if (block_list.includes(uid) || block_list.some(uid => comment_html.includes(`?user-${uid}.htm`))) {
            comment_list[i].style.display = 'none';
        }
    }
})();