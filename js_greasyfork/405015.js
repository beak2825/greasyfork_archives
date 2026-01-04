// ==UserScript==
// @name            hwm_battle_add_omne
// @author          Kleshnerukij
// @description     Отправка ссылок на ивентовые бои к omne
// @version         1.1
// @include         https://www.heroeswm.ru/pl_warlog.php*
// @include         https://qrator.heroeswm.ru/pl_warlog.php*
// @include         http://178.248.235.15/pl_warlog.php*
// @include         https://www.lordswm.com/pl_warlog.php*
// @namespace       https://greasyfork.org/ru/scripts/405015-hwm-battle-add-omne
// @encoding 	    utf-8

// @downloadURL https://update.greasyfork.org/scripts/405015/hwm_battle_add_omne.user.js
// @updateURL https://update.greasyfork.org/scripts/405015/hwm_battle_add_omne.meta.js
// ==/UserScript==

// (c) Клещнерукий - http://www.heroeswm.ru/pl_info.php?id=7076906

(function () {
var page_content = document.getElementsByTagName('body')[0].innerHTML;
var search_string = /<a href="warlog\.php\?warid=\d+.*?">\d+-\d+-\d+ \d+:\d+<\/a>/igm;
var search_data = /href=\"warlog\.php\?warid=(\d+)\&amp;show_for_all=([a-zA-Z0-9]+)\"/i;
var check_correct = /^\d+-\d+-\d+ \d+:\d+$/i;

var res = page_content.match(search_string);
var arr_corr = [];
var step = 0;

// Собираем номера строк в которых есть бои с секретной ссылкой
res.forEach(myFunction);
function myFunction(item, index) {
    if (item.match(search_data) != null) {
        let temp_arr = item.match(search_data);
        arr_corr[step] = [temp_arr[1], temp_arr[2]];
    }
    step++;
}

// Добавляем ссылки для пересылки в сервис omne
let elements = document.querySelectorAll('center>table>tbody>tr>td>a');
step = 0;
for (let elem of elements) {
    let el = elem.innerHTML;
    if (el.search(check_correct) != -1) {
        console.log(step);
        if (typeof(arr_corr[step]) != "undefined" && arr_corr[step] !== null) {
            elem.innerHTML = el+' <a style="color: #000000" href="http://daily.heroeswm.ru/leader_rogues.php?url=warid='+arr_corr[step][0]+'+show_for_all='+arr_corr[step][1]+'"> >> </a>';
        } else {
            elem.innerHTML = el+' <span style="color: #aaaaaa"> >> </span>';
        }
    step++;
    }
}


function insertAfter(parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling);
}
})();