// ==UserScript==
// @name           hwm_gi_battles_loader
// @author         omne
// @namespace      omne
// @connect daily.heroeswm.ru
// @description    Загрузка боёв ГИ
// @version        0.3
// @encoding 	   utf-8
// @include        /^https{0,1}:\/\/((www|qrator|)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(pl_warlog|war).php/
// @grant    GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429032/hwm_gi_battles_loader.user.js
// @updateURL https://update.greasyfork.org/scripts/429032/hwm_gi_battles_loader.meta.js
// ==/UserScript==
 
(function() {
 
if (/pl_warlog/.test(location.href)) {
    let pers_id = document.documentElement.innerHTML.match(/pl_hunter_stat\.php\?id=([0-9]+)/)[1];
    let data = '';
    let ch = 0;
    let all_ch = 0;
    let elem = document.getElementsByClassName('sh_ResourcesItem_icon')[0];
 
    if (elem === undefined) {
        elem = document.getElementsByClassName('rs')[0];
    }
 
    elem.addEventListener("click", get_data, false);
 
    function get_data() {
        let elem = document.getElementsByClassName('global_container_block_header global_a_hover')[0].nextElementSibling;
        elem.insertAdjacentHTML("afterbegin", "<center><span id = 'loader'>Загрузка боёв ГИ:</span></center><BR>");
        let last_page = get_last_page();
        get_page('/pl_warlog.php?id=' + pers_id + '&page=', 0, last_page);
    }
 
    function get_last_page() {
        let result = get_hwm('/pl_warlog.php?id=' + pers_id + '&page=9999999');
        return result.match(/<a class=\"active\".+?([0-9]+)/)[1];
    }
 
    function get_page(url, page, count) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url + page,
            onload: function(response) {
                let battles = response.responseText.match(/&nbsp;&nbsp;.+?<!--110--><BR>/g);
                if (battles !== null) {
                    for (let j = 0; j < battles.length; j++) {
                        data = data + battles[j].match(/warid=([0-9]+)/)[1] + "|" + battles[j].match(/(show_for_all|show)=([0-9a-zA-Z\-\_]+)/)[2] + ";";
                        ch++;
                        all_ch++;
                    }
                }
                if (ch > 100) {
                    get_daily('https://daily.heroeswm.ru/services/help/gi.php?data=' + data);
                    data = '';
                    ch = 0;
                }
 
                page++;
                if (page <= count) {
                    document.getElementById('loader').innerHTML = 'Загрузка боёв ГИ: страниц ' + page + '/' + count + '. Боёв найдено: ' + all_ch;
                    get_page('/pl_warlog.php?id=' + pers_id + '&page=', page, count);
                }
 
                else {
                    get_daily('https://daily.heroeswm.ru/services/help/gi.php?data=' + data);
                }
 
            }
        });
    }
}
 
if (/war\.php/.test(location.href)) {
    let btype = document.documentElement.innerHTML.match(/btypeo\|([0-9]+)/)[1];
    if (btype == 110) {
        get_daily('https://daily.heroeswm.ru/services/help/gi.php' + location.search);
    }
}
function get_daily(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url
    });
}
 
function get_hwm(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
}
})();
 