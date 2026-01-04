// ==UserScript==
// @name         微博批量清理工具(XHR)
// @version      1.0.0
// @description  批量删除微博工具XHR版本
// @author       Tobar
// @match        *://weibo.com/u/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @namespace https://greasyfork.org/users/142679
// @downloadURL https://update.greasyfork.org/scripts/430570/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7%28XHR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430570/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7%28XHR%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = () => {
        //睡眠函数
        function sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }

        function sendDelete(id) {
            var postData = {
                "id": id
            };
            var token = $.cookie("XSRF-TOKEN");
            console.info("token=" + token);
            $.ajax({
                url: "/ajax/statuses/destroy",
                contentType: "application/json;charset=UTF-8",
                type: "POST",
                dataType: "json",
                headers: {
                    "x-xsrf-token": token
                },
                data: JSON.stringify(postData)
            });
        }

        function deletePage(userId, pageNum) {
            var list;
            $.ajax({
                url: "/ajax/statuses/mymblog?uid=" + userId + "&page=" + pageNum + "&feature=0",
                type: "GET",
                //sync: false,
                dataType: "json"
            }).done(function (data, textStatus, jqXHR) {
                list = data;
                if (list != null && list.data != null && list.data.list != null) {
                    list.data.list.forEach(function (item) {
                        var id = item.id;
                        console.log(id);
                        sendDelete(id);
                        sleep(100);
                    });
                    sleep(1000);
                    deletePage(userId, pageNum + 1);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                var error = '状态码:' + jqXHR.status + ',异常:' + errorThrown;
                alert('读取数据失败,请稍后重试\n' + error);
            });

        }

        function startDelete() {
            //获取用户userid
            var userId;
            var patt = /weibo.com\/u\/(\d+)/i;
            var n = patt.exec(window.location.href);
            if (n != null && n.length > 1) {
                userId = n[1];
            }

            console.info("userId=" + userId);
            if (userId == null) {
                return;
            }
            deletePage(userId, 1);
        }

        var r = confirm("确定好要删除所有内容了吗，确定好了就点确定吧!");
        if (r === true) {
            startDelete();
        }

    };
})();