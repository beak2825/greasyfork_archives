// ==UserScript==
// @name         SCBOY论坛黑名单插件
// @namespace    *://www.scboy.cc/
// @version      1.2
// @description  黑名单插件功能
// @author       spaghetti
// @match        *://*.scboy.cc/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456950/SCBOY%E8%AE%BA%E5%9D%9B%E9%BB%91%E5%90%8D%E5%8D%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456950/SCBOY%E8%AE%BA%E5%9D%9B%E9%BB%91%E5%90%8D%E5%8D%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


function remove_id_SCboy(name_id) {
    var a = document.getElementsByClassName('media post');
    for (var i = 0; i < a.length; i++) {
        if (a[i].getAttribute('data-uid') == name_id) {
            a[i].remove();
            i = i - 1;
        }
    };
    var b = document.getElementsByClassName('text-left media');
    for (var i = 0; i < b.length; i++) {
        if (b[i].getElementsByTagName('a')[0].getAttribute('href') == ('?user-' + name_id + '.htm')) {
            b[i].remove();
            i = i - 1;
        }
    }
    var c = document.getElementsByClassName('media thread tap  ');
    for (var i = 0; i < c.length; i++) {
        if (c[i].getElementsByTagName('a')[0].getAttribute('href') == ('?user-' + name_id + '.htm')) {
            c[i].remove();
            i = i - 1;
        }
    }
    var d = document.getElementsByClassName('notice media text-small isread');
    for (var i = 0; i < d.length; i++) {
        if (d[i].getElementsByTagName('a')[0].getAttribute('href') == ('?user-' + name_id + '.htm')) {
            d[i].remove();
            i = i - 1;
        }
    }

}

document.getElementsByClassName('usercard-content')[0].getElementsByClassName('list')[0].getElementsByTagName('p')[0].getElementsByTagName('button')[0].insertAdjacentHTML('beforebegin', '<span data-toggle="tooltip" data-placement="top" id="usercard_black_list" title="拉黑他" class="icon icon7"></span>');

var uid_black;
var uname_black;

$(function () {
    $(".avatar-3,.avatar-2").hover(function () {
        uid_black = $(this).attr('uid')
    })
});

$(document).on('click', '.icon.icon7', function () {

    $.ajax({
        url: 'https://www.scboy.cc/?user-' + uid_black + '.htm',
        type: "get",
        dataType: "html",
        success: function (data, status) {
            var searchPattern = '<b>(.*)</b>'
            var index = data.match(searchPattern)[1];
            console.log(index);
            $.xpost(xn.url('my-blacklist_prevent'), {
                user_name: index
            }, function (code, message) {
                if (code == 0) {
                    $.alert(message).delay(2000).location();
                } else {
                    $.alert(message);
                }
            });
        },

        error: function () {}
    })
});


function refresh() {
    var blackList = [];
    $.ajax({
        url: "https://www.scboy.cc/?my-blacklist.htm",
        type: "get",
        dataType: "html",
        success: function (data, status) {
            var searchPattern = 'user-([0-9]*)\.htm'
            var index = Array.from(data.matchAll(searchPattern));
            for (var i = 0; i < index.length; i++) {
                remove_id_SCboy(index[i][1])
            }
        },
    
        error: function () {}
    }
	)
}


refresh()
