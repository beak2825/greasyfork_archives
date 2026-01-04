// ==UserScript==
// @name         雪山监控
// @namespace    http://tampermonkey.net/
// @version      1.07 雪山弟子监控
// @description  个人专用
// @author       Yu
// @include      http://*.yytou.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394711/%E9%9B%AA%E5%B1%B1%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/394711/%E9%9B%AA%E5%B1%B1%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

var assistant = 'u6965572';
var assistant1 = 'u4253282';

//获取当前地图npcArr
function getNpcArr() {
    var post_list = [];
    setInterval(function () {
        var room = g_obj_map.get('msg_room');
        if(room){
            for (var t, i = 1; (t = room.get('npc' + i)) != undefined; i++) {
                t = t.split(',');
                var msg = '';
                var map_id = room.get('map_id');
                var room_name = room.get('short');
                if (post_list.indexOf(t[0]) < 0){
                    if (t[1] == '白衣神君' || t[1] == '白自在') {
                        post_list.push(t[0]);
                        msg = t[1] + '位于' + map_id + '-' + room_name;
                    }
                }
                
                if (msg) {
                    console.log(msg);
                    var me_msg = ' ASSIST/XUESHAN/find/' + msg;
                    clickButton('tell ' + assistant + me_msg);
                    clickButton('tell ' + assistant1 + me_msg);

                    var new_msg = '发现' + msg;
                    var data = { cate: '定位', value: new_msg, notify: 1, expiredminu: 30 };
                    $.post('http://122.112.197.227:8100/home/LogCommon', data).error(function (xhr) {
                        console.log('error: ' + xhr.status + ' ' + xhr.statusText);
                    });
                }
            }
        }
    }, 1000);
}
getNpcArr();