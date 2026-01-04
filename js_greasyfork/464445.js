// ==UserScript==
// @name         魂+域名替换
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  修改帖子中的链接的域名为当前页面域名
// @author       You
// @license      MIT
// @grant        none
// @match        *://*.spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://*.south-plus.org/*
// @match        *://*.east-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://south-plus.net/*
// @match        *://north-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://level-plus.net/*
// @match        *://white-plus.net/*
// @match        *://imoutolove.me/*
// @match        *://south-plus.org/*
// @match        *://east-plus.net/*
// @match        *://blue-plus.net/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/464445/%E9%AD%82%2B%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/464445/%E9%AD%82%2B%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    //location.host
    var domain = ['www.white-plus.net', 'www.summer-plus.net', 'www.soul-plus.net', 'www.south-plus.net', 'www.north-plus.net', 'www.snow-plus.net', 'www.level-plus.net', 'www.white-plus.net', 'www.imoutolove.me', 'www.south-plus.org', 'www.east-plus.net', 'www.blue-plus.net', 'bbs.white-plus.net', 'bbs.summer-plus.net', 'bbs.soul-plus.net', 'bbs.south-plus.net', 'bbs.north-plus.net', 'bbs.snow-plus.net', 'bbs.level-plus.net', 'bbs.white-plus.net', 'bbs.imoutolove.me', 'bbs.south-plus.org', 'bbs.east-plus.net', 'bbs.blue-plus.net', 'white-plus.net', 'summer-plus.net', 'soul-plus.net', 'south-plus.net', 'north-plus.net', 'snow-plus.net', 'level-plus.net', 'white-plus.net', 'imoutolove.me', 'south-plus.org', 'east-plus.net', 'blue-plus.net']
    var good_url = location.host
    if (location.href.indexOf('simple') == -1) {
        var contents = document.getElementsByClassName("tpc_content ")
        for (let i = 0; i < contents.length; i++) {
            var urls = contents[i].getElementsByTagName("a");
            for (let j = 0; j < urls.length; j++) {
                var url = urls[j].href;
                if (url.indexOf(good_url) == -1) {
                    for (let item of domain.values()) {
                        if (url.indexOf(item) != -1) {
                            url = url.replace(item, good_url)
                            urls[j].href = url
                            break
                        }
                    }
                }

            }
        }
    }
    else {
        contents = document.getElementsByClassName("card-text")
        for (let i = 0; i < contents.length; i++) {
            urls = contents[i].getElementsByTagName("a");
            for (let j = 0; j < urls.length; j++) {
                url = urls[j].href;
                if (url.indexOf(good_url) == -1) {
                    for (let item of domain.values()) {
                        if (url.indexOf(item) != -1) {
                            url = url.replace(item, good_url)
                            urls[j].href = url
                            break
                        }
                    }

                }
            }
        }
    }


 if(location.href.includes('thread.php?fid-173')||location.href.includes('thread_new.php?fid-173')||location.href.includes('thread.php?fid-5')||location.href.includes('thread_new.php?fid-5')||location.href.includes('thread.php?fid-4')||location.href.includes('thread_new.php?fid-4')||location.href.includes('thread.php?fid-172')||location.href.includes('thread_new.php?fid-172')){

        var tag = document.getElementsByClassName('fn')
        //alert(tag.length)
        for (let i = 0; i < tag.length; i++) {
           tag[i].href =tag[i].href.replace('thread','thread_new')
        }
    }

}
) ();