// ==UserScript==
// @name         盘友社区自动回复
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  盘友社区自动回复帖子，并自动删除内容，基于协议无痕无打打扰
// @author       xx025
// @homepage     https://github.com/xx025/strawberry
// @match        https://panyoubbs.xyz/thread/*
// @match        https://panyoubbs.com/thread/*
// @match        https://ali.pan123456789.com/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panyoubbs.com
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463957/%E7%9B%98%E5%8F%8B%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/463957/%E7%9B%98%E5%8F%8B%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==


//先检查登录状态,如果未登录则脚本不执行任何操作
// 登录状态判别方式为cookie[think_uid]
if (undefined !== $.cookie('think_uid')) {

    //检查是否是在帖子页面
    //通过url判断 https://www.panyoubbs.com/thread/*.html
    if (document.location.href.search('/thread/') > -1) {
        //检查当前帖子是否需要回复可见
        let jm = $('.jm')
        if (jm.length > 0) {
            if ($(jm[0]).text() === '该网盘链接需要回复后才能查看，请先[点击回复]。') {
                let content_text = '谢谢'
                $.ajax({
                    url: '/index/post/reply.html',
                    type: 'POST',
                    data: {
                        'content': content_text,
                        'thread_id': $('.thread-post [name="thread_id"]').val(),
                        'user_id': $('.thread-post [name="user_id"]').val(),
                        'quotepid': '0',
                        'isfirst': '1',
                        'thread_userid': $('.thread-post [name="thread_userid"]').val(),
                        '__token__': $('.thread-post [name="__token__"]').val()
                    },
                    datatype: 'json',
                    success: function (res) {
                        if (res.code === 1) {
                            location.reload()
                        }
                    },
                })
            }
        }


        //检查是否回复过，如果回复过则删除回复
        let dels = $('.layui-icon-delete')

        if (dels.length > 0) {
            // 对删除接口发送所有回复的id,删除回复
            let id2 = $(dels[0]).parent().attr('pid');
            $.ajax({
                url: '/index/thread/replydel',
                type: 'POST',
                data: {id: id2},
                dataType: 'json',
                success: function () {
                    location.reload()
                }
            });
        }

    }
}
