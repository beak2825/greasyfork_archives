// ==UserScript==
// @name        解决微博限流
// @namespace    https://dixcouleur.top
// @version      2.0
// @description  让微博个人主页按时间排序，可以解决微博限流
// @author       DixCouleur
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370300/%E8%A7%A3%E5%86%B3%E5%BE%AE%E5%8D%9A%E9%99%90%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/370300/%E8%A7%A3%E5%86%B3%E5%BE%AE%E5%8D%9A%E9%99%90%E6%B5%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var is_home = window.location.pathname.split('/')[2] == 'home';
    var is_sorted = window.location.href.indexOf('is_search=1') != -1;
    var right_search = 'is_search=1';
    var sorted_url = window.location.pathname + '?' + right_search;
    if (is_home && !is_sorted) {
        window.location = sorted_url;
    } else {
        document.addEventListener('click', function (e) {
            var is_target_a = e.target.href !== undefined;
            var the_target = e.target;
            if (!is_target_a) the_target = e.target.parentNode;
            if (the_target.href !== undefined) {
                var slash_path = 2;
                if (the_target.href.indexOf('://') != -1) {
                    slash_path = 4;
                }
                if (the_target.href.split('/')[slash_path].indexOf('home') === 0) {
                    e.preventDefault();
                    if (the_target.href.indexOf('page=') != -1) {
                        e.preventDefault();
                        var new_href = the_target.href.replace(/pids=Pl_Content_HomeFeed/, '');
                        window.location = new_href;
                    } else window.location = sorted_url;
                }
            }
        }, true);
    }
})();