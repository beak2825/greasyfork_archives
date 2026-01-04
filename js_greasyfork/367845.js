// ==UserScript==
// @name         巴哈姆特公會新串通知
// @namespace    http://www.isaka.idv.tw/
// @version      1.0
// @description  公會有新串的時候就會發出通知呦～
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://guild.gamer.com.tw/*
// @match        http://guild.gamer.com.tw/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/367845/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E6%96%B0%E4%B8%B2%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/367845/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E6%96%B0%E4%B8%B2%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==
var config = {
    showDesktopNotifications: true,
    reload_time: 5000,
    guild_id: []
};
var newestContent = {};

(function() {
    'use strict';

    if (Notification.permission !== 'granted' && config.showDesktopNotifications) {
        Notification.requestPermission();
    }

    var status = false;

    $('.BH-menuE').append('<li id="script_li_btn"><a>啟動新串通知</a></li>');

    var intervalArr = [];

    $('#script_li_btn').click(function() {
        if (!status) {
            var gsnRegex = /(?:guild\.php\?sn|&gsn)\=([\d]*)/;
            var url = window.location.href;
            var currentGsn = url.match(gsnRegex);
            if (currentGsn != undefined) {
                if (config.guild_id.indexOf(currentGsn[1]) == -1)
                    config.guild_id.push(currentGsn[1]);
            }
            if (config.guild_id.length == 0) {
                alert('你尚未在腳本裡設定公會編號，或者是沒有在特定公會內啟動！');
                return;
            }

            $.each(config.guild_id, function(index, value) {
                var intervalName = window.setInterval(function() {
                    //console.log(config);
                    //console.log("starting readContent in " + value);
                    readContent(value);
                }, config.reload_time);
                intervalArr.push(intervalName);
            });
            $('#script_li_btn a').text('關閉新串通知');
            status = true;
        } else {
            $.each(intervalArr, function(index, value) {
                clearInterval(value);
            });
            $('#script_li_btn a').text('啟動新串通知');
        }
    });

})();

function readContent(guild_id) {
    'use strict';

    $.get({
        url: 'https://api.gamer.com.tw/guild/v1/post_list.php',
        method: 'GET',
        data: {
            gsn: guild_id
        },
        xhrFields: {
            withCredentials: true
        }
    }, function(data, status) {
        if (status != 'success') {
            console.log('link error in guild_id');
            console.log(data);
        }
        //console.log(data);

        //console.log(contentObj);
        if (newestContent[guild_id] == undefined) {
            console.log('update!')
            newestContent[guild_id] = data.data.postList[0][0];
        } else if (newestContent[guild_id].id !== data.data.postList[0][0].id) {
            var notificationTitle = "來自" + data.data.postList[0][0].to.name + "的新訊息!";
            var notificationText = data.data.postList[0][0].content.substring(0, 30);
            newestContent[guild_id] = data.data.postList[0][0];
            notifyMe(guild_id, data.data.postList[0][0].id, notificationTitle, notificationText);
        }
        console.log('current id:', newestContent[guild_id].id)
        console.log('new id:', data.data.postList[0][0].id)
    });
}

function notifyMe(guild_id, sn, title, message) {
    'use strict';
    if (!config.showDesktopNotifications || !Notification) {
        console.log('Notification Request Deny!')
        return;
    } else {
        var icon_url = 'https://p2.bahamut.com.tw/B/GUILD/c/4/' + guild_id.padStart(10, "0") + '.PNG';
        GM_notification( {
            text: message,
            title:"新串通知！",
            onclick: function() {
                var url = 'https://guild.gamer.com.tw/singlePost.php?sn=' + sn + '&gsn=' + guild_id;
                GM_openInTab(url, false);
                this.close();
            }
        })
    }
}