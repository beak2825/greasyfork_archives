// ==UserScript==
// @name         Block Oursteps IDs,新足迹屏蔽部分ID贴专用
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Nice world
// @author       Chinese
// @match        http*://www.oursteps.com.au/bbs/forum.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390228/Block%20Oursteps%20IDs%2C%E6%96%B0%E8%B6%B3%E8%BF%B9%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86ID%E8%B4%B4%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/390228/Block%20Oursteps%20IDs%2C%E6%96%B0%E8%B6%B3%E8%BF%B9%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86ID%E8%B4%B4%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';


    var uids = ['uid=258273', 'uid=100','uid=358444', 'uid=358942', 'uid=72541','uid=61957','uid=358570','uid=20058','uid=184479','uid=133021','uid=182868','uid=616'];
    var posts = document.querySelectorAll('div[id^="post_"]');
    var repost = new RegExp("^post_([0-9]*)$");
    for(var i = 0;i < posts.length;i++){
        var idpost = posts[i].id;
        if (!repost.test(idpost)){
            continue;
        }
        var readPost = posts[i].getElementsByClassName('authi')[0].innerHTML;
        var length = readPost.length;
        while(length--) {
            if (readPost.indexOf(uids[length]+'"')!=-1) {
                posts[i].style.display="none";
                //console.log(readPost)
            }
        }
    }
})();