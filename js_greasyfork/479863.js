// ==UserScript==
// @name         97d
// @namespace    叮当社区
// @version      0.1.1
// @description  叮当社区辅助工具
// @author       You
// @match        http*://d66e.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d66e.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479863/97d.user.js
// @updateURL https://update.greasyfork.org/scripts/479863/97d.meta.js
// ==/UserScript==

jQuery(function() {
    var res = '';
    var urls = jQuery('a.s.xst');
    var s_urls = [];
    var defer = jQuery.Deferred();

    for (i = 0; i < urls.length; i++) {
        console.log(i);
        var url = urls[i].href;
        s_urls.push(url);
    }
    //这一步必须要写，要不然下面的then无法使用
    defer.resolve(jQuery("#content_2015195").append(""));
    jQuery.each(s_urls, function(i, e) { //i 是序列，e是数值
        defer = defer.then(function() {
            return jQuery.ajax({
                url: e,
                method: 'get',
                success: function(data) {
                    res = data.match(/class\=\"zoom\"\ src\=\"(.*?)\"\ onmouseover/i);
                    if (res !== null) {
                        console.log(e + '------' + res[1]);
                   jQuery('a.s.xst').eq(i).append('\n <img src="'+res[1]+'" width=500 />');
                    } else {
                        res = data.match('file="(.*?)" class="zoom" ');
                        if (res !== null) {
                            jQuery('a.s.xst').eq(i).append('\n <img src="'+res[1]+'" width=500 />');
                        }
                    }
                }
            })
        });
    });
    defer.done(function() {
        jQuery("#content_2015195").append("ajax全部执行完成<br/>")
    });
})