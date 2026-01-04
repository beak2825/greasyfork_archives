// ==UserScript==
// @name         sakugabooru搜索相关微博
// @namespace    https://github.com/VonXXGhost
// @version      0.1.1
// @description  在sakugabooru页面添加搜索微博账号@sakugabooru中的相关微博
// @author       VonXXGhost
// @match        https://sakuga.yshi.org/*
// @match        https://www.sakugabooru.com/*
// @require      http://code.jquery.com/jquery-3.2.1.js
// @downloadURL https://update.greasyfork.org/scripts/36101/sakugabooru%E6%90%9C%E7%B4%A2%E7%9B%B8%E5%85%B3%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/36101/sakugabooru%E6%90%9C%E7%B4%A2%E7%9B%B8%E5%85%B3%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

function addSearchButton(){
    var options = $('#post-view > div.sidebar > div:nth-child(5) > ul > li:nth-child(8)');
    //var re = /(?<=post\/show\/)(\d+)/;
    var re = /([a-zA-Z\.\/:]*)(\d+)/;
    var number = re.exec(window.location.href)[2];
    var code = '<li><a href="https://weibo.com/5721599343/profile?is_search=1&key_word=' + number + '" target="_blank">搜索微博</a></li>';
    options.append(code);
}

addSearchButton();