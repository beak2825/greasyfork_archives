// ==UserScript==
// @name           hwm_chat_informer
// @namespace      https://greasyfork.org/ru/users/170936
// @description    Оповещение о новых сообщениях чата
// @author         Kleshnerukij
// @version        1.2.1
// @include        https://www.heroeswm.ru/chat2020.php
// @include        https://www.lordswm.com/chat2020.php
// @include        http://178.248.235.15/chat2020.php
// @downloadURL https://update.greasyfork.org/scripts/416581/hwm_chat_informer.user.js
// @updateURL https://update.greasyfork.org/scripts/416581/hwm_chat_informer.meta.js
// ==/UserScript==

(function() {
var aud = new Audio();
aud.preload = 'auto';
aud.src = 'https://sound-pack.net/download/Sound_17211.mp3';

var msg_container = document.getElementById("chat_messages_container");
var new_child;
var new_id;
var name_author = '';
var your_name = 'RS51';
var room = document.getElementById("newroom");
var last_room;

var room_arr = new Array();

setInterval(function () {
    new_child = msg_container.lastChild;
    new_id = new_child.id;

    if (room_arr[room.value] == undefined) {
        room_arr[room.value] = new_id;
    }

    if (document.getElementById(new_id).getElementsByClassName("chat_name")[0] !== undefined) {
        name_author = document.getElementById(new_id).getElementsByClassName("chat_name")[0].innerHTML;
    }

    if (new_id > room_arr[room.value] && name_author !== your_name) {
        if (last_room == room.value) {
            aud.play();
            alert("");
        }
        room_arr[room.value] = new_id;
    }

    last_room = room.value;
}, 1000);
})();