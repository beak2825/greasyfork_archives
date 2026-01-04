// ==UserScript==
// @name           hwm_gi_battles_loader
// @author         omne
// @namespace      omne
// @connect daily.heroeswm.ru
// @description    Загрузка боёв ГИ
// @version        0.1
// @include        /^https{0,1}:\/\/((www|qrator|)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/pl_warlog.php/
// @grant    GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428176/hwm_gi_battles_loader.user.js
// @updateURL https://update.greasyfork.org/scripts/428176/hwm_gi_battles_loader.meta.js
// ==/UserScript==

(function() {

let pers_id = document.documentElement.innerHTML.match(/pl_hunter_stat\.php\?id=([0-9]+)/)[1];

let elem = document.getElementsByClassName('sh_ResourcesItem_icon')[0];
elem.addEventListener("click", get_data, false);

function get_data() {
    let last_page = get_last_page();
    let result;
    let battles;
    let data = '';
    let ch = 0;
    for (let i = 0; i < last_page; i++) {
        console.log(i);
        result = get_page(location.origin + '/pl_warlog.php?id=' + pers_id + '&page=' + i);
        battles = result.match(/&nbsp;&nbsp;.+?<!--110--><BR>/g);
        for (let j = 0; j < battles.length; j++) {
            data = data + battles[j].match(/warid=([0-9]+)/)[1] + "|" + battles[j].match(/show_for_all=([0-9a-zA-Z]+)/)[1] + ";";
            ch++;
        }

        if (ch > 100) {
            console.log('completed');
            get_daily('https://daily.heroeswm.ru/?' + data);
            data = '';
            ch = 0;
        }
    }
}


function get_last_page() {

    let result = get_page(location.origin + '/pl_warlog.php?id=' + pers_id + '&page=9999999');
    return result.match(/<a class=\"active\".+?([0-9]+)/)[1] - 1;
}

function get_page(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
}

function get_daily(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url
    });
}

})();

