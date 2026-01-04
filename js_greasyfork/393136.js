// ==UserScript==
// @name         hide S1 ads (x)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  隐藏大量发帖无人回复者（就是你，广告哥）的帖子，自动加载下一页以凑到30贴以上
// @author       whzfjk
// @match        https://bbs.saraba1st.com/2b/forum-*-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393136/hide%20S1%20ads%20%28x%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393136/hide%20S1%20ads%20%28x%29.meta.js
// ==/UserScript==

function killAds() {
    'use strict';

    var post_threshold = 4;
    var replied_threshold = 2;

    var rst = document.evaluate( '//*[starts-with(@id, "normalthread_")]', document, null, XPathResult.ANY_TYPE, null);
    var post = rst.iterateNext();
    var collect = new Map();
    var remain = 0;
    while (post) {
        remain += 1;
        var name = post.querySelector('cite > a').text;
        if (!collect.get(name)) {
            collect.set(name, {cnt: 0, noreply_cnt: 0, posts: []});
        }
        var ent = collect.get(name);
        ent.cnt += 1;
        var reply = parseInt(post.querySelector('tr > td.num > a').text);
        if (reply === 0) {
            ent.noreply_cnt += 1;
        }
        ent.posts.push(post);
        post = rst.iterateNext();
    }

    for (var [k, v] of collect) {
        if (v.cnt > post_threshold && v.cnt - v.noreply_cnt < replied_threshold) {
            console.log("prepare to hide " + k);
            for (var p of v.posts) {
                p.hidden = true;
            }
            remain -= v.posts.length;
        }
    }

    return remain;
}

(function() {
    'use strict';
    var nextPage = document.querySelector('#autopbn');
    for (var posts = killAds(); posts < 30; posts = killAds()) {
        console.log('need more posts');
        nextPage.click();
    }
})();