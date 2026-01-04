// ==UserScript==
// @name         delete-sina-weibo-posts
// @namespace    https://ox0spy.github.io/
// @version      0.2
// @description  删除所有微博，需要进入个人页面才会触发；删除微博代码取自：https://gist.github.com/mariotaku/e00b6b93663f2f420ef9
// @author       ox0spy
// @match        https://weibo.com/*/profile*
// @match        https://www.weibo.com/*/profile*
// @match        https://weibo.com/*/profile*
// @match        https://www.weibo.com/*/profile*
// @match        https://weibo.com/p/*
// @match        https://www.weibo.com/p/*
// @compatible   chrome  支持
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370558/delete-sina-weibo-posts.user.js
// @updateURL https://update.greasyfork.org/scripts/370558/delete-sina-weibo-posts.meta.js
// ==/UserScript==

'use strict';

window.setTimeout(deletePosts,1000 * 3);

function deletePosts() {
    var http = new XMLHttpRequest();
    var anchors = document.getElementsByTagName("div");
    var i = 0;
    for (i = 0; i < anchors.length; i++) {
        // 找到有mid属性的div元素
        var mid = anchors[i].getAttribute("mid");
        if (mid) {
            console.log("Deleting " + mid);
            // 这是微博的删除接口
            var url = "/aj/mblog/del?ajwvr=6";
            var params = "mid=" + mid;
            http.open("POST", url, false);
            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(params);
        }
    }

    window.location.reload();
}