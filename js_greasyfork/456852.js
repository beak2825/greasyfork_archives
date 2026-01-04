// ==UserScript==
// @name         bilibiliClearNotifications
// @namespace    https://iconquestion.github.io/
// @version      0.121
// @description  Clear bilibili 20 top notifications
// @author       iconquestion
// @match        https://message.bilibili.com/run
// @match        https://t.bilibili.com/c
// @icon         https://live.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456852/bilibiliClearNotifications.user.js
// @updateURL https://update.greasyfork.org/scripts/456852/bilibiliClearNotifications.meta.js
// ==/UserScript==

(function() {
    var unfollowedMsgNum = 0;
    fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread', {
        method: 'GET',
        credentials: 'include',
    }).then(function(res) {
        return res.json();
    }).then(function(jsondata) {
        unfollowedMsgNum = jsondata.data.unfollow_unread + jsondata.data.unfollow_push_msg + jsondata.data.follow_unread;
        console.log(unfollowedMsgNum + ' unread msg(s)');
        //获取未读信息发件人talker_id
        if (unfollowedMsgNum) {
            console.log('Working...');
            var talkerIds = [];
            fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions?session_type=1&sort_rule=2', {
                method: 'GET',
                credentials: 'include'
            }).then(function(res) {
                return res.json();
            }).then(function(jsondata) {
                jsondata.data.session_list.forEach(function(ele, eleindex) {
                    if (ele.unread_count) {
                        talkerIds.push(ele.talker_id);
                    }
                })
                //批量确认消息已读
                var csrftoken = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];
                for (var i = 0; i < talkerIds.length; i++) {
                    console.log('Marking id: ' + talkerIds[i]);
                    fetch('https://api.vc.bilibili.com/session_svr/v1/session_svr/update_ack', {
                        method: 'POST',
                        mode: 'no-cors',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': 'https://message.bilibili.com/',
                            'Origin': '',
                            'Accept': 'application/json, text/plain, */*'
                        },
                        body: 'talker_id=' + talkerIds[i] + '&session_type=1&csrf=' + csrftoken
                    });
                }
            })
        }
    })
})();
