// ==UserScript==
// @name            hwm_easy_rools
// @author          Kleshnerukij
// @description     Скрипт ускоряющий игру в рулетку.
// @version         1.8.1
// @homepage        https://greasyfork.org/ru/scripts/11127-hwm-easy-rools
// @namespace       https://greasyfork.org/ru/scripts/11127-hwm-easy-rools
// @include         http://www.heroeswm.ru/roulette.php
// @include         http://qrator.heroeswm.ru/roulette.php
// @include         http://178.248.235.15/roulette.php
// @include         http://www.lordswm.com/roulette.php
// @include         https://www.heroeswm.ru/roulette.php
// @include         https://qrator.heroeswm.ru/roulette.php
// @include         https://178.248.235.15/roulette.php
// @include         https://www.lordswm.com/roulette.php
// @encoding 	    utf-8
// @downloadURL https://update.greasyfork.org/scripts/11127/hwm_easy_rools.user.js
// @updateURL https://update.greasyfork.org/scripts/11127/hwm_easy_rools.meta.js
// ==/UserScript==

// (c) Клешнерукий http://www.heroeswm.ru/pl_info.php?id=7076906

window.onload = function() {

var rs_user_gold = new RegExp('gold\\.png.*?class="rs".*?<\\/td><td>([\\d,]*)<\\/td>','i');
var rs_min_cur = new RegExp('Минимальная ставка:.*?Золото.*?<td>(.*?)<\\/td>','i');
var rs_max_cur = new RegExp('Максимальная сумма ставок:.*?Золото.*?<td>(.*?)<\\/td>','i');
var rs_all = new RegExp('<input type=\\"hidden\\" name=\\"cur_pl_bet\\".*?(\\d+)','i');

var user_gold = rs_user_gold.exec(document.body.innerHTML);
user_gold = getCorrectNumber(user_gold[1]);

var min_cur = rs_min_cur.exec(document.body.innerHTML);
min_cur = getCorrectNumber(min_cur[1]);

var max_cur = rs_max_cur.exec(document.body.innerHTML);
max_cur = getCorrectNumber(max_cur[1]);

var all = rs_all.exec(document.body.innerHTML);
all = getCorrectNumber(all[1]);

var remainder = max_cur-all; // остаток для ставок
remainder = (user_gold < remainder) ? user_gold : remainder;

document.getElementsByTagName('table')[34].onclick = function(event) {
    if (document.getElementById('cForm') !== null) {
        document.getElementById("cForm").remove();
    }
    var field = event.target;

    while (field != document.getElementsByTagName('table')[34]) {
        if (field.tagName == 'IMG') {
            cFormCreate(field, event);
            break;
        }
        field = field.parentNode;
    }
	document.getElementsByName('bettype')[0].value = field.title;
};

function cFormCreate(field, event) {
    var host = window.location.hostname;
    var rs_name_img = new RegExp('.*\\/(.*)\\.gif','i');
    var name_img = rs_name_img.exec(field.src)[1];
    document.getElementsByName('bettype')[0].value = "";
    document.getElementsByName('bet')[0].value = "";

    var c_form = document.createElement('div');
    c_form.id = "cForm";
    c_form.style.position = "absolute";
    c_form.style.width = "200px";
    //c_form.style.minHeight = "170px";
    c_form.style.margin = "0px";
    c_form.style.padding = "0px";
    c_form.style.background = "#E4E0D3";

    c_form.style.WebkitBoxShadow = "0px 0px 15px #000";
    c_form.style.MozBoxShadow = "0px 0px 15px #000";
    c_form.style.BoxShadow = "0px 0px 15px #000";
    c_form.style.top = event.clientY;
    c_form.style.left = event.clientX;

    var author = document.createElement('div');
    author.id = "author";
    author.style.height = "25px";
    author.style.width = "100%";
    author.style.margin = "20px 0px -5px 35px";
    author.style.cursor = "pointer";
    author.style.color = "#000";
    author.innerHTML = "<a href=\"http://"+host+"/sms-create.php?mailto=%CA%EB%E5%F8%ED%E5%F0%F3%EA%E8%E9&subject=%CF%EE+%EF%EE%E2%EE%E4%F3+%F1%EA%F0%E8%EF%F2%E0+hwm_easy_rools\">Сообщить об ошибке</a>";

    var c_form_head = document.createElement('div');
    c_form_head.id = "c_form_head";
    c_form_head.style.height = "25px";
    c_form_head.style.width = "196px";
    c_form_head.style.margin = "2px 2px 0px 2px";
    c_form_head.style.background = "#2B903D";
    c_form_head.style.color = "#000";

    var c_form_head_num = document.createElement('div');
    c_form_head_num.id = "c_form_head_num";
    c_form_head_num.style.height = "23";
    c_form_head_num.style.float = "left";
    c_form_head_num.style.fontSize = "15px";
    c_form_head_num.innerHTML = field.title;
    c_form_head_num.style.color = "#fff";
    c_form_head_num.style.padding = "2px 0 0 0";

    var c_form_head_close = document.createElement('div');
    c_form_head_close.id = "close_form";
    c_form_head_close.innerHTML = "X";
    c_form_head_close.style.width = "21px";
    c_form_head_close.style.height = "25px";
    c_form_head_close.style.float = "right";
    c_form_head_close.style.padding = "0px 0px 0px 6px";
    c_form_head_close.style.fontSize = "20px";
    c_form_head_close.style.color = "#fff";
    c_form_head_close.style.background = "#CC3322";
    c_form_head_close.style.cursor = "pointer";

    c_form_head_close.onclick = function() {
        var elem = document.getElementById("cForm");
        elem.remove();
    };

// Объявление второстепенных переменных

    var message = document.createElement('text');
    message.id = "message";

    var t = document.createElement('table');
    var tbody = document.createElement('tbody');

    var step = 2;
    var td;

    var end = false;
    var last_print = 0;
    var tr = document.createElement('tr');

    var last = Math.floor((Number(min_cur)+100)/100)*100;

    if (min_cur > user_gold) {
        message.innerHTML = "Недостаточно средств";
    } else if (min_cur > remainder) {
        message.innerHTML = "Вы уже поставили максимум";
    } else {

        // Переделать обязательно!
        td = createTd(field, min_cur, min_cur);
        tr.appendChild(td);
        last_print = min_cur;

        if (last > 1000) {
            last = Math.floor((Number(last)+1000)/1000)*1000;
        }

        if (last <= user_gold && last <= remainder) {
            while (!end) {
                for (last; last <= 900; last += 100) {

                    if (last <= user_gold && last <= remainder && last <= max_cur) {
                        td = createTd(field, last, last);
                        tr.appendChild(td);
                        last_print = last;

                        if (step % 4 === 0) {
                            tbody.appendChild(tr);
                            tr = document.createElement('tr');
                        }
                        step++;

                    } else {
                        end = true;
                        break;
                    }
                }

                for (last; last <= 9000; last += 1000) {
                    if (last <= user_gold && last <= remainder && last <= max_cur) {
                        td = createTd(field, last, (last/1000)+'к');
                        tr.appendChild(td);
                        last_print = last;

                        if (step % 4 === 0) {
                            tbody.appendChild(tr);
                            tr = document.createElement('tr');
                        }
                        step++;

                    } else {
                        end = true;
                        break;
                    }
                }

                for (last; last <= 18000; last += 2000) {
                    if (last <= user_gold && last <= remainder && last <= max_cur) {
                        td = createTd(field, last, (last/1000)+'к');
                        tr.appendChild(td);
                        last_print = last;

                        if (step % 4 === 0) {
                            tbody.appendChild(tr);
                            tr = document.createElement('tr');
                        }
                        step++;

                    } else {
                        end = true;
                        break;
                    }
                }

                for (last; last <= 35000; last += 5000) {
                    if (last <= user_gold && last <= remainder && last <= max_cur) {
                        td = createTd(field, last, (last/1000)+'к');
                        tr.appendChild(td);
                        last_print = last;

                        if (step % 4 === 0) {
                            tbody.appendChild(tr);
                            tr = document.createElement('tr');
                        }
                        step++;

                    } else {
                        end = true;
                        break;
                    }
                }

                for (last; last <= 100000; last += 10000) {
                    if (last <= user_gold && last <= remainder && last <= max_cur) {
                        td = createTd(field, last, (last/1000)+'к');
                        tr.appendChild(td);
                        last_print = last;

                        if (step % 4 === 0) {
                            tbody.appendChild(tr);
                            tr = document.createElement('tr');
                        }
                        step++;

                    } else {
                        end = true;
                        break;
                    }
                }

                end = true;
            }
        }
    }

    if (last_print < remainder && remainder >= min_cur) {
        td = createTd(field, remainder, remainder);
        tr.appendChild(td);
    }
    tbody.appendChild(tr);

    t.appendChild(tbody);

    c_form_head.appendChild(c_form_head_num);
    c_form_head.appendChild(c_form_head_close);
    c_form.appendChild(c_form_head);
    c_form.appendChild(t);
    c_form.appendChild(message);
    c_form.appendChild(author);
    document.body.appendChild(c_form);
}

function createTd(field, bet_num, text_field) {
    var td = document.createElement('td');
    td.style.width = "42px";
    td.style.height = "20px";
    td.style.padding = "0px 3px";
    td.style.color = "#fff";
    td.style.background = "#2B903D";
    td.style.fontSize = "13px";
    td.style.cursor = "pointer";

    td.onmouseover = function(){
        this.style.background = "#DDD9CD";
        this.style.color = "#000";
    };
    td.onmouseout = function(){
        this.style.background = "#2B903D";
        this.style.color = "#fff";
    };

    td.style.title = bet_num;
    td.innerHTML = text_field;

    td.ondblclick = function () {
        document.getElementsByName('bettype')[0].value = field.title;
        document.getElementsByName('bet')[0].value = this.style.title;
        document.getElementsByName('rform')[0].submit();
    };

    return td;
}

function getCorrectNumber (num) {
    num = Number(num.replace(/,/i,""));
    return num;
}

}();