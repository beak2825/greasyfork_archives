// ==UserScript==
// @name         ID获取辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取微博和评论id
// @author       chinshry
// @include      /https?:\/\/weibo\.com/\d+/.+/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422195/ID%E8%8E%B7%E5%8F%96%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/422195/ID%E8%8E%B7%E5%8F%96%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function($) {
    setTimeout(function(){
        'use strict';
        console.log("hello");

        function addWeiboId() {
            var item = $('.WB_detail').find('.WB_from ');
            let weiboId = $(item).children().eq(0).attr('name');
            console.log(weiboId)
            $(item).append(`<a> 微博ID <strong>${weiboId}</strong></a>`);
        }

        function addReplyId() {
            var items = $('.WB_func');
            $.each(items, function (index, node) {
                var weiboNode = $(node).parent().children().eq(0).text()
                console.log(weiboNode)
                var replyNodes = $(node).find(".S_txt1")
                var replyNode = replyNodes.filter(function(){
                    return $(this).attr("action-type") == 'reply';
                })
                var replyId = getSearchString('cid', replyNode.eq(0).attr('action-data'))
                var timeNode = $(node).children().eq(1)
                console.log(replyId)
                if ($(timeNode).text().indexOf(replyId) == -1){
                    if(weiboNode.indexOf('李现') != -1 || weiboNode.indexOf('lx') != -1){
                        $(node).parent().css("background-color","orange")
                    }
                    $(timeNode).text(`${$(timeNode).text()} ${replyId}`);
                }
            })
        }

        function getSearchString(key, Url) {
            var str = Url;
            str = str.substring(1, str.length);
            var arr = str.split("&");
            var obj = new Object();
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=")
                var tmp_arr_emp_list = [];
                var tmp_arr_emp = decodeURIComponent(tmp_arr[1]).split(",");
                for (var j = 0; j < tmp_arr_emp.length; j++) {
                    tmp_arr_emp_list.push(tmp_arr_emp[j])
                }
                obj[decodeURIComponent(tmp_arr[0])] = tmp_arr_emp_list;
            }
            return obj[key];
        }

        addWeiboId();
        addReplyId();

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        const observer = new MutationObserver(function() {
            setTimeout(function(){
                addReplyId();
            }, 1500)
        });

        observer.observe(document.body, {
            childList:true,
            subtree:true
        });
    }, 3000)
})(window.jQuery.noConflict(true));