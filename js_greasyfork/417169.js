// ==UserScript==
// @name           hwm_chat_mod
// @description    Изменение стилей чата
// @author         Kleshnerukij
// @version        1.0.3
// @include        https://www.heroeswm.ru/chat2020.php
// @include        https://www.lordswm.com/chat2020.php
// @include        http://178.248.235.15/chat2020.php
// @namespace https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/417169/hwm_chat_mod.user.js
// @updateURL https://update.greasyfork.org/scripts/417169/hwm_chat_mod.meta.js
// ==/UserScript==

(function() {

document.getElementsByClassName("horizont_chat")[0].style.background = "#151515"; //Меняем фон чата
document.getElementsByClassName("chat_messages_container")[0].style.opacity = "0.9"; //Меняем фон чата
document.getElementsByClassName("chat_input_message")[0].style.borderColor = "#555555";
document.getElementById("message_line").style.color = "#DDDDDD";

document.getElementsByClassName("chat_user_panel")[0].style.background = "#111111"; //Меняем фон панель участников чата
document.getElementsByClassName("chat_user_list")[0].style.color = "#bcd206"; //Меняем цвет списка участников чата
document.getElementById("chat_room_name").style.color = "#dedede";

document.getElementsByClassName("chat_rbutton")[0].style.background = "#802121";
document.getElementsByClassName("chat_rbutton")[0].style.boxShadow = "inset 0 0 0 0px #b71b1b, inset 0 0 0 1px #dfdfdf, inset 0 0 0 3px #7b1717";
document.getElementsByClassName("chat_rbutton")[1].style.background = "#802121";
document.getElementsByClassName("chat_rbutton")[1].style.boxShadow = "inset 0 0 0 0px #b71b1b, inset 0 0 0 1px #dfdfdf, inset 0 0 0 3px #7b1717";
document.getElementsByClassName("chat_send_button")[0].style.background = "#802121";
document.getElementsByClassName("chat_send_button")[0].style.boxShadow = "inset 0 0 0 0px #b71b1b, inset 0 0 0 1px #dfdfdf, inset 0 0 0 3px #7b1717";

/*
#cccccc простое
#c4dcb1 направленное
#d8beaa приват
#ccc2d6 открытый приват
*/
})();