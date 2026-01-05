// ==UserScript==
// @name         AM_hwm_roulette
// @namespace    AlaMote
// @version      0.6
// @description  Авторулетка
// @author       AlaMote
// @homepage     https://greasyfork.org/ru/scripts/28587-am-hwm-roulette
// @include      http://*heroeswm.ru/*
// @include      *178.248.235.15/*
// @include      http://*lordswm.com/*
// @icon         http://www.hwm-img.totalh.net/favicon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28587/AM_hwm_roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/28587/AM_hwm_roulette.meta.js
// ==/UserScript==

(function (window, undefined) {
    if (location.href == "http://www.heroeswm.ru/" || location.href == "http://178.248.235.15/" || location.href == "http://www.lordswm.com/") {
        localStorage.removeItem("last_color");
    }

    var mirror = location.href.split("/")[2].split(".")[2] == "com" ? "com" : "ru";
    var b_l = {"com": "Ball landed on ", "ru": "Выпало число "};
    var colors = ["GREEN",

                  "RED", "BLACK", "RED",
                  "BLACK", "RED", "BLACK",
                  "RED", "BLACK", "RED",
                  "BLACK", "BLACK", "RED",

                  "BLACK", "RED", "BLACK",
                  "RED", "BLACK", "RED",
                  "RED", "BLACK", "RED",
                  "BLACK", "RED", "BLACK",

                  "RED", "BLACK", "RED",
                  "BLACK", "BLACK", "RED",
                  "BLACK", "RED", "BLACK",
                  "RED", "BLACK", "RED"];

    if (location.href.match(/gift_box_log.php/)) {

        var bets_count = 1000;
        localStorage.stat_spins = norm_count_spins(bets_count, bets_count) + " - ";

        var xmlhttp = new XMLHttpRequest();
        for (var i = 0; i < bets_count; i++) {
            xmlhttp.open('GET', "/inforoul.php?id=" + (parseInt(localStorage.last_spin_id) - i), false);
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    if(xmlhttp.status == 200) {
                        var re = new RegExp(b_l[mirror] + "(\\w+)");
                        var tmp_re = new RegExp("[\s\S]+(?=" + b_l[mirror] + " )");
                        var spin_num = xmlhttp.responseText.replace(tmp_re, "").replace(/<[\S\s]+?>/g, "");
                        spin_num = re.exec(spin_num);
                        localStorage.stat_spins = norm_count_spins(bets_count, i) + localStorage.stat_spins.substring(norm_count_spins(bets_count, i).length, localStorage.stat_spins.length) + spin_num[1] + "|";
                    }
                }
            };
            xmlhttp.send(null);
        }
    }

    /*if (location.href.match(/inforoul.php/)) {
        var re = new RegExp(b_l[mirror] + "(\\w+)");
        var spin_num = $("body").html();
        spin_num = spin_num.replace(/[\s\S]+(?=Ball )/, "").replace(/<[\S\s]+?>/g, "");
        alert(spin_num);
        spin_num = re.exec(spin_num);
        alert(spin_num);
    }*/

    if (location.href.match("allroul.php")) {

        localStorage.last_spins = "";
        var plot = {"ru": "Выпало число", "com": "Ball landed on"};

        var tr_start = $("td.wbcapt:contains('"+plot[mirror]+"')").parent().next();
        for (var i = 0; i < 18; i++) {
            var td_ = tr_start.children();
            localStorage.last_spins += parseInt(td_[2].innerText.trim()) + "|";
            tr_start = tr_start.next();
        }

        localStorage.last_spinned_color = colors[parseInt(localStorage.last_spins.split("|")[0])];
        var sec = 60;

        if (new Date().getMinutes() % 10 !== 0) {
            sec = 60 * (10 - new Date().getMinutes() % 10);
        }
        var interval_res = setInterval(function() {
            $("title").html(get_time(sec--) + " Последние игры");
            if (sec <= 0)
                location.reload();
        }, 1000);

        var l = $("a");
        var info = [];
        for (i = 0; i < l.length; i++) {
            if (l[i].outerHTML.match(/inforoul.php/)) {
                info.push(l[i].outerHTML);
            }
        }
        localStorage.last_spin_id = info[0].match(/=([0-9]+)\"/)[1];

        return;
    }


    if (location.href.split("/")[3] == "roulette.php") {
        var no_color = "#ff7979";
        var yes_color = "#8afd70";
        var no_title = {"ru": "Авто-рулетка выключена", "com": "Auto-roulette disable."};
        var yes_title = {"ru": "Авто-рулетка включена", "com": "Auto-roulette enable."};
        var gold_title = {"ru": "Золото", "com": "Gold"};
        var spin = {"ru": "Извините, ставки не принимаются - рулетка уже крутится", "com": "Sorry, no more bets - roulette is spinning already"};
        var density = {"ru": "Плотность", "com": "Density"};
        var color_div = localStorage.getItem("auto_play") == "yes" ? yes_color : no_color;
        var count_div = 0;
        var outerHTML_orig = "", outerHTML = "";
        var gold = parseInt($("img[title='"+gold_title[mirror]+"']").parent().next().get(0).innerHTML.split(",").join(""));
        localStorage.gold = gold;
        var refresh = 0;
        var max_bet = maxsum - parseInt(parseInt($("input[name='cur_pl_bet']").val()));

        var bet_size_value = localStorage.bet_size ? localStorage.bet_size : 100;
        var bet_size_max = maxsum - parseInt($("input[name='cur_pl_bet']").val());
        var strategy_value = localStorage.strategy ? localStorage.strategy : "";
        var show_field = localStorage.show_field == "hide" ? "checked" : "";
        var div_outerHTML = "<div id='sett_auto_roulette' class='wblight' style='position: absolute; top: 300px; left: 20px; text-align: -webkit-center; padding: 10px;'>" +
            "<input type='checkbox' id='chbox_show_field' "+show_field+"><label for='chbox_show_field'>Скрыть поле</label>" +
            "<br><select id='strat_select' style='margin-top: 10px; margin-bottom: 10px;'>" +
            "<option>RED / BLACK</option>" +
            "<option>Топ-3</option>" +
            "<option>RED / BLACK x2</option>" +
            "</select>" +
            "<br><input id='bet_size' type='number' min='100' max='"+bet_size_max+"' value='"+bet_size_value+"'>" +
            "</div>";

        $("body").prepend(div_outerHTML);
        $("#strat_select").val(strategy_value);
        var delay = 0;




        if (!localStorage.mult) {
            localStorage.mult = 1;
        }
        if (!localStorage.bet_size) {
            localStorage.bet_size = 100;
        }
        if (localStorage.show_field == "show") {
            $("form table tr:eq(1)").show();
        }
        else {
            $("form table tr:eq(1)").hide();
        }

        if (localStorage.show_sett == "visible")
            $("#sett_auto_roulette").show();
        else
            $("#sett_auto_roulette").hide();


        if (parseInt($("input[name='cur_pl_bet']").val()) === 0) {
            localStorage.bet = 0;
        }
        var bet_div = $("td[class='wblight']");
        for (var i = 0; i < bet_div.length; i++) {
            if (bet_div[i].innerHTML.indexOf("Ставка") != -1 || bet_div[i].innerHTML.indexOf("Stake") != -1) {
                outerHTML_orig = bet_div[i].outerHTML;
                outerHTML = outerHTML_orig.replace("class=\"wblight\"", "class=\"wblight\" id=\"auto_play\"");
                bet_div[i].outerHTML = outerHTML;
                count_div++;
            }
            if (bet_div[i].innerHTML.indexOf("Поле") != -1 || bet_div[i].innerHTML.indexOf("Bet on") != -1) {
                outerHTML_orig = bet_div[i].outerHTML;
                outerHTML = outerHTML_orig.replace("class=\"wblight\"", "class=\"wblight\" id=\"submit_bet\"");
                bet_div[i].outerHTML = outerHTML;
                count_div++;
            }
            if (count_div == 2) {
                break;
            }
        }

        $("#auto_play")
            .css("backgroundColor", localStorage.getItem("auto_play") == "yes" ? yes_color : no_color)
            .attr("title", localStorage.getItem("auto_play") == "yes" ? yes_title[mirror] : no_title[mirror])
            .css("cursor", "pointer")
            .click(function() {
            if (localStorage.getItem("auto_play") == "yes") {
                localStorage.auto_play = "no";
            }
            else {
                localStorage.auto_play = "yes";
            }
            $("#auto_play").css("backgroundColor", localStorage.getItem("auto_play") == "yes" ? yes_color : no_color);
            $("#auto_play").attr("title", localStorage.getItem("auto_play") == "yes" ? yes_title[mirror] : no_title[mirror]);
            location.reload();
        });
        $("#submit_bet").css("cursor", "pointer")
            .click(function() {
            if (localStorage.show_sett == "hidden") {
                localStorage.show_sett = "visible";
                $("#sett_auto_roulette").show();
            }
            else {
                localStorage.show_sett = "hidden";
                $("#sett_auto_roulette").hide();

            }
        });
        $("#bet_size").change(function() {
            var val = parseInt($("#bet_size").val());
            if (val < 100) {
                val = 100;
            }
            else if (val > max_bet) {
                val = max_bet;
            }
            localStorage.bet_size = val;
        });
        $("#strat_select").change(function() {
            localStorage.strategy = $("#strat_select").val();
            location.reload();
        });
        $("#chbox_show_field").click(function() {
            if (localStorage.show_field == "show") {
                localStorage.show_field = "hide";
                $("form table tr:eq(1)").hide();
            }
            else {
                localStorage.show_field = "show";
                $("form table tr:eq(1)").show();
            }
        });

        var bets_count = 3;
        var bets = [];
        for (i = 0; i < bets_count; i++) {
            var tmp = $("b:contains('"+density[mirror]+"')").parent().next().children().children()[i + 1].innerHTML;
            bets.push(tmp.substring(tmp.indexOf("<td class=\"wblight\">") + "<td class=\"wblight\">".length, tmp.length - 5));
            //alert(bets[i]);
        }

        var strategy = localStorage.strategy;
        if (strategy == "RED / BLACK" || strategy == "RED / BLACK x2") {
            bets_count = 1;
        }
        else if (strategy == "Топ-3"){
            bets_count = 3;
        }
        else {
            alert("Неизвестная стратегия игры :(");
        }

        if (parseInt(localStorage.minutes) === 0) {
            localStorage.minutes = Math.floor(Math.random() * 4) + 3;
        }

        if (localStorage.getItem("auto_play") == "yes" && parseInt(localStorage.bet) < bets_count && gold > 100 && new Date().getMinutes() % 10 > localStorage.minutes) {

            var field = "";
            var bet = $("input[name='bet']");
            var bettype = $("input[name='bettype']");
            var bet_size = parseInt(localStorage.bet_size);
            if (bet_size > gold) {
                bet_size = gold;
            }
            var LSbet = parseInt(localStorage.bet);

            if (strategy == "RED / BLACK") {
                field = Math.floor(Math.random() * 2) === 0 ? "RED" : "BLACK";
            }
            else if (strategy == "Топ-3") {
                field = bets[LSbet];
            }
            else if (strategy == "RED / BLACK x2") {
                var last_spins = localStorage.last_spins.split("|");
                var first_bet = false;

                if (!localStorage.last_color) {
                    field = localStorage.last_spinned_color == "RED" ? "BLACK" : "RED";
                    localStorage.last_color = field;
                    first_bet = true;
                }
                if (!first_bet) {
                    var last_color = localStorage.last_color;
                    if (last_color != localStorage.last_spinned_color) {
                        localStorage.mult = parseInt(localStorage.mult) * 2;
                        field = last_color;
                    }
                    else if (last_color == localStorage.last_spinned_color) {
                        localStorage.mult = 1;
                        field = colors[parseInt(last_spins[0])] == "RED" ? "BLACK" : "RED";
                    }

                    bet_size *= parseInt(localStorage.mult);
                    if (bet_size > max_bet) {
                        bet_size = max_bet;
                    }
                    if (bet_size > gold) {
                        bet_size = gold;
                    }

                    localStorage.last_color = field;
                }
            }
            else {
                alert("Неизвестная стратегия игры :(");
                return;
            }

            bet.val(bet_size);
            bettype.val(field);

            document.forms.rform.submit();
            LSbet++;

            localStorage.bet = LSbet;
            localStorage.minutes = 0;


        }
        if (localStorage.getItem("auto_play") == "yes") {

            var sec_ = 60 + Math.floor(Math.random() * 30);

            if (parseInt(localStorage.bet) !== 0) {
                sec_ = 60 * (10 - new Date().getMinutes() % 10 + 1);
            }
            var interval_game = setInterval(function() {
                $("title").html(get_time(sec_--) + " Рулетка");
                if (sec_ <= 0)
                    location.reload();
            }, 1000);
        }
    }

})(window);
function get_time(delay) {
    if (delay <= 60) {
        return "00:" + norm_nul(delay);
    }
    var sec = delay % 60;
    delay -= sec;
    var min = delay / 60;

    return norm_nul(min) + ":" + norm_nul(sec);

}
function norm_nul(x) {
    if (x < 10) {
        return "0" + x;
    }
    else
        return x;
}
function norm_count_spins(count, curr) {
    var str_curr = curr + "";
    var str_count = count + "";
    var len = str_count.length - str_curr.length;

    //alert("len - " + len);
    for (var i = 0; i < len; i++) {
        str_curr = "0" + str_curr;
        //alert(i + " - " + str_curr);
    }

    return str_curr;
}





