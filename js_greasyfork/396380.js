// ==UserScript==
// @name         Auto delete weibo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动删除你的所有微博
// @author       ihipop
// @match        https://www.weibo.com/p/*/home?is_all=1&delete=yes
// @grant        none
// @require http://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396380/Auto%20delete%20weibo.user.js
// @updateURL https://update.greasyfork.org/scripts/396380/Auto%20delete%20weibo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function($) {
        var deleteTimer = setInterval(function() { //使用一个定时器来防止操作频繁的提示
            if (!$('a[action-type="feed_list_delete"]').length) {
                clearInterval(deleteTimer) //在重载页面的时候不反复发起页面重载
                if (parseInt($('#Pl_Core_T8CustomTriColumn__3 span:contains("微博")').parent().text()) >= 10) { //判断是否还剩余微博 微博后期更新页面结构可能需要更改此处
                    setInterval(function() {
                        location.href = location.href; //在删除很老的微博的时候，加载会很慢 这里设置一个超时避免频繁刷新或者刷新失败
                    }, 10 * 1000)
                } else {
                    alert('清理结束');
                }
            } else {
                $('a[action-type="feed_list_delete"]')[0].click();
                $('a[action-type="ok"]')[0].click();
                try {
                    $('.W_layer_close a')[0].click(); //如果出现操作频繁提示就关掉她
                } catch (error) {
                    console.log(error)
                }
            }
        }, 800);
    });
})();