// ==UserScript==
// @name          Switch520广告去除。
// @description   去除Switch520广告。
// @version       1.0.2
// @namespace     Switch520广告去除
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *www.gamer520*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491577/Switch520%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/491577/Switch520%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%82.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function removeHtmlTags(str) {
  return str.replace(/(<([^>]+)>)/gi, "");
}

function extractUrls(str) {
    const urlRegex = /'(?<url>https?:\/\/[^']+)/g;
    let match;
    const urls = [];

    while ((match = urlRegex.exec(str))) {
        urls.push(match.groups.url);
    }

    return urls;
}

function init() {
    $.each($('.lazyload'), function(index, val) {
        console.log(index, val);
        var obj = $(this);
        var src = obj.data('src');

        obj.attr('src', src);
        obj.removeClass('lazyload');
    });

	var pay_btn = $('.pay-box');
	var pay_obj = pay_btn.find('a');
	var pay_id = pay_obj.data('id');

    pay_obj.attr('href', 'https://www.gamer520.blog/go?post_id='+ pay_id);

    /*
    pay_obj.click(function(){
        // 标准ajax
        $.ajax({
            // 提交数据的类型 POST GET
            type: "POST",
            // 提交的网址
            url: "/wp-admin/admin-ajax.php",
            // 提交的数据
            data: {
                action: 'user_down_ajax',
                post_id: pay_id,
            },
            //返回数据的格式
            dataType: "json", //"xml", "html", "script", "json", "jsonp", "text".
            // true：默认异步请求 false:同步请求
            // async:true,
            // 请求前
            beforeSend: function () {
            },
            // 成功返回之后调用的函数
            success: function(data) {
                // pay_obj.attr('href', 'https://www.gamer520.blog/go?post_id='+ pay_id);

                window.open(data.msg, '_blank');
            },
            // 请求完成
            complete: function () {
            },
            // 调用出错执行的函数
            error: function() {
                //请求出错处理
                console.log('Ajax Error');
            }
        });
    });
    */

    var str = removeHtmlTags($('html').html());
    var prefix = "window.location";

    if(str.startsWith(prefix)) {
        var url = extractUrls(str);
        // console.log(extractUrls(str));
        window.location.href=url[0];
    }
}