// ==UserScript==
// @name         在豆瓣显示微信读书可读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jim
// @match        https://book.douban.com/*
// @grant        GM.xmlHttpRequest

// @downloadURL https://update.greasyfork.org/scripts/394514/%E5%9C%A8%E8%B1%86%E7%93%A3%E6%98%BE%E7%A4%BA%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8F%AF%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394514/%E5%9C%A8%E8%B1%86%E7%93%A3%E6%98%BE%E7%A4%BA%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8F%AF%E8%AF%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var weread = '<span style="background-color:#32A6FE;color:white;">微</span>'

    function substringToSymbol(title, symbol) {
        if(title.includes(symbol)) {
            title = title.substr(0, title.indexOf(symbol))
        };
        return title
    }

    function clear(title) {
        title = substringToSymbol(title, ':')
        title = substringToSymbol(title, '（')
        title = substringToSymbol(title, '？')
        title = substringToSymbol(title, '：')
        return title.trim();
    }

    function query_book(dom_obj, title) {
        var url = "https://weread.qq.com/web/search/search_suggest?keyword=" + title;

        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                var has_book = false;
                for(var i = 0; i < result.records.length; i++) {
                    var cur_title = result.records[i].word
                    if(title == clear(cur_title)) {
                        has_book = true
                        break;
                    }
                }
                if(has_book == true) {
                    dom_obj.append(weread)
                }
            }
        });
    }

    function check_booklist() {
        console.log('check book list')
        $('ul.interest-list h2').each(function() {
            var cur = $(this)
            var title = $(this).children('a').text()
            title = clear(title)
            query_book(cur, title)
        });
    }

    function check_onebook() {
        var cur = $('h1').children('span')
        var title = cur.text()
        title = clear(title)
        console.log('check one book')
        query_book(cur, title)

    }

    var pathname = window.location.pathname;
    if(pathname.includes('people')) {
        check_booklist()
    } else if(pathname.includes('subject')) {
        check_onebook()
    }

})();