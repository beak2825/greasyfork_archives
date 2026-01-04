// ==UserScript==
// @name         luogu-chat-delete
// @match        https://www.luogu.com.cn/chat
// @description  洛谷删除私信脚本。
// @require      https://cdn.luogu.com.cn/js/jquery-2.1.1.min.js
// @version 0.0.1.20230528045348
// @namespace https://greasyfork.org/users/1085576
// @downloadURL https://update.greasyfork.org/scripts/467283/luogu-chat-delete.user.js
// @updateURL https://update.greasyfork.org/scripts/467283/luogu-chat-delete.meta.js
// ==/UserScript==
function delete_chat(id, csrf) {
    $.ajax({
        url: 'https://www.luogu.com.cn/api/chat/delete',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({id: id}),
        cache: false,
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrf
        },
        xhrFields: {
　　　　　　withCredentials: true
　　　　}
    });
}

function do_delete(uid, csrf) {
    $.get('https://www.luogu.com.cn/api/chat/record?user=' + uid, {}, function (res) {
        console.log(res);
        var t = res['messages']['result'];
        for (var i = 0; i < t.length; i++) {
            console.log(t[i].id + ' ' + t[i].content);
            delete_chat(t[i].id, csrf);
        }
    })
}

(function() {
    'use strict';
    window.onload = function () {
        var csrf = document.getElementsByName('csrf-token')[0].content;
        console.log(csrf);
        if (csrf == null || csrf == undefined) {
            alert('获取x-csrf-token失败！');
            return;
        }
        var name = prompt('请输入要删除私信的uid或用户名：');
        if (name == null || name == undefined) return;
        $.get('https://www.luogu.com.cn/api/user/search?keyword=' + name, {}, function (res) {
            var users = res['users'];
            for (var i = 0; i < users.length; i++) {
                if (users[i] != null) {
                    console.log(users[i]['uid'] + ' ' + users[i]['name']);
                    do_delete(users[i]['uid'], csrf);
                }
            }
        })
    }
})();