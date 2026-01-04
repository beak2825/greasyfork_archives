// ==UserScript==
// @name            hwm_remote_br
// @author          Kleshnerukij
// @description     Удаляет всякую поебень от Ветра
// @version         1.0.0
// @include         http://www.heroeswm.ru/forum_messages.php?tid=*
// @include         http://qrator.heroeswm.ru/forum_messages.php?tid=*
// @include         http://178.248.235.15/forum_messages.php?tid=*
// @include         http://www.lordswm.com/forum_messages.php?tid=*
// @encoding 	    utf-8
// @namespace       https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/34740/hwm_remote_br.user.js
// @updateURL https://update.greasyfork.org/scripts/34740/hwm_remote_br.meta.js
// ==/UserScript==

// (c) Клещнерукий - http://www.heroeswm.ru/pl_info.php?id=7076906

window.onload = function() {
    var page = document.getElementsByTagName('body')[0].innerHTML;
    var r = /<br>(\n<br>)*/g;
    var result = page.replace(r, "<br>");
    document.getElementsByTagName('body')[0].innerHTML = result;
};