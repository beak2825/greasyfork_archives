// ==UserScript==
// @name hwm_pz_scaner
// @namespace https://greasyfork.org/ru/users/170936
// @description Поик открытых тем
// @author Kleshnerukij
// @version 1.0.4
// @include https://www.heroeswm.ru/forum_thread.php?id=25*
// @include https://www.lordswm.com/forum_thread.php?id=25*
// @include http://178.248.235.15/forum_thread.php?id=25*
// @downloadURL https://update.greasyfork.org/scripts/424921/hwm_pz_scaner.user.js
// @updateURL https://update.greasyfork.org/scripts/424921/hwm_pz_scaner.meta.js
// ==/UserScript==

(function() {
    var num_page = "10";
    var cur_page = "0";
    var res = "";
    var url = "";
    var page = "";
    var full_res = "";
    var full_file = "";
    var start_temp = '';
    var end_temp = '';
    var xhr = new XMLHttpRequest();
    var search_opth = /<tr( class='second'|)><td style=\'padding-top:6px;padding-bottom:6px;\'><a href=\'forum_messages\.php\?tid=(\d+)\'>(.*?)<\/a><\/td><td>.*?<\/td><td>\d+<\/td><td><a.*?href=\'pl_info\.php\?id=(\d+)\'>(.*?)<\/a>/igm;
    var search_tdata = /tid=(\d+)\'>(.*?)<.*?id=(\d+)\'>(.*?)</i;

    var c_head_table = document.getElementsByClassName('table3 forum c_darker td_bordered')[0];
    var c_head_tr = document.getElementsByClassName('table3 forum c_darker td_bordered')[0].getElementsByTagName('tr')[0];
    var c_head = document.getElementsByClassName('table3 forum c_darker td_bordered')[0].getElementsByTagName('th')[0];

    var c_div_star = document.createElement('div');
    c_div_star.style.display = "none";
    c_div_star.id = "c_div_star";
    var c_span_star = document.createElement('span');
    c_span_star.innerHTML = " &#10031;";
    c_span_star.onclick = function(){c_div_star.style.display = "inline-block";c_div_star.style.display = "inline-block";c_span_star.style.display = "none";};
    c_span_star.style.cursor = "pointer";

    var c_span_from = document.createElement('span');
    c_span_from.innerHTML = "  с ";
    var c_span_before = document.createElement('span');
    c_span_before.innerHTML = " по ";
    var c_span_nbsp = document.createElement('span');
    c_span_nbsp.innerHTML = " ";
    var c_span_nbsp2 = document.createElement('span');
    c_span_nbsp2.innerHTML = " ";

    var c_from = document.createElement('input');
    c_from.id = "c_from";
    c_from.style.width = "50px";
    var c_before = document.createElement('input');
    c_before.id = "c_before";
    c_before.style.width = "50px";

    var c_button = document.createElement('input');
    c_button.type = "button";
    c_button.value = "Искать";
    c_button.onclick = start_search;

    var c_status = document.createElement('span');
    c_status.id = "res_search";
    c_status.innerHTML = "";

    var download_link = document.createElement("a");
    download_link.title = "Скачать итоговый файл (csv)";
    download_link.download = "thread_list.csv";
    download_link.appendChild(document.createTextNode('Скачать'));

    var c_res_tr = document.createElement('tr');
    var c_res_td = document.createElement('td');

    c_div_star.appendChild(c_span_from);
    c_div_star.appendChild(c_from);
    c_div_star.appendChild(c_span_before);
    c_div_star.appendChild(c_before);
    c_div_star.appendChild(c_span_nbsp);
    c_div_star.appendChild(c_button);
    c_div_star.appendChild(c_span_nbsp2);
    c_div_star.appendChild(c_status);

    c_head.appendChild(c_span_star);
    c_head.appendChild(c_div_star);


    var res_search = document.getElementById('res_search');

    function start_search() {
        start_temp = document.getElementById('c_from').value;
        end_temp = document.getElementById('c_before').value;
        getPage((start_temp-1), end_temp);
    }

    function getPage(start_pg, end_pg) {
        url = "https://www.heroeswm.ru/forum_thread.php?id=25&page="+start_pg;

        xhr.open('GET', url);
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка

            } else {
                page = xhr.responseText;
                var page = page.match(search_opth);

                if (page != undefined) {
                    page.forEach(GetOpenTheme);
                }
                res_search.innerHTML = "Обработано: "+(start_pg+1)+"/"+end_pg+" ";
                start_pg++;

                if (start_pg < end_pg) {
                    getPage(start_pg, end_pg);
                } else {

                    let del_end = true;
                    while (del_end) {
                        if (c_head_table.getElementsByTagName("tr")[1] !== undefined) {
                            var del_tr = c_head_table.getElementsByTagName("tr")[1];
                            del_tr.remove();
                        } else {
                            del_end = false;
                        }
                    }

                    c_head_table.innerHTML += full_res;
                    var uri = 'data:text/csv;charset=utf-8,' + full_file;

                    download_link.href = uri;
                    document.getElementById("c_div_star").appendChild(download_link);
                }
            }
        }
    }

    function GetOpenTheme(item, index) {
        var res = item.match(search_tdata);
        full_res += '<tr><td><a href="https://www.heroeswm.ru/forum_messages.php?tid='+res[1]+'">'+res[2]+'</a></td><td colspan="4"><a href="https://www.heroeswm.ru/pl_info.php?id='+res[3]+'">'+res[4]+'</a></td></tr>';
        full_file += 'https://www.heroeswm.ru/forum_messages.php?tid='+res[1]+'\n';
    }
})();