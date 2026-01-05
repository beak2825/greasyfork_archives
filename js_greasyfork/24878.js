// ==UserScript==
// @name          HWM_InstantParametersChange
// @version       1
// @namespace     Рианти
// @description   Мгновенная переброска параметров до заданных значений, не требует места в инвентаре для зелья. Использована форма от похожего скрипта авторства УжеЛежу.
// @include       *heroeswm*/home.php*
// @include       http://178.248.235.15/home.php*
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24878/HWM_InstantParametersChange.user.js
// @updateURL https://update.greasyfork.org/scripts/24878/HWM_InstantParametersChange.meta.js
// ==/UserScript==

var xmlHttp = false;
var host = location.host;
var rst = 1;

as = document.getElementsByTagName("a");
counter_stat_begin = 0;
counter_stat_end = 0;
tbl = false;
stats_names = ["attack", "defence", "power", "knowledge"];
urls = [];
stats = [];
counts_url = 0;
inc_all = true;
var tr_info = false;
var tbl = false;
var sendStatus = 0;
var parameter_sets = [];
var name_parameter_sets = [];
var count_parameter_sets = 0;
var tgr_stance;

imgs = document.getElementsByTagName("img");
for (id_img in imgs) {
    img = imgs[id_img].src;
    if (img && img.indexOf("s_luck.gif") > -1)
        tr_info = imgs[id_img].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
}

td_reset = tr_info.insertCell(2);
td_reset.align = "center";
td_reset.style= "vertical-align: top;";
style_button = "style='background-color:#F5F3EA;cursor:pointer;border-radius:4px;border:1px solid #5D413A;padding:3'";
style_delete = "style='background-color:#FF0000;cursor:pointer;border-radius:4px;border:1px solid #5D413A;padding:3;color:#FFFFFF'";

function init_reset_info() {
    var ii = 0;
    parameter_sets = [];
    name_parameter_sets = [];
    for (var i = 0; i < 10; i++) {
        if (localStorage['parameter_sets_' + i]) {
            parameter_sets[ii] = localStorage['parameter_sets_' + i];
            name_parameter_sets[ii] = localStorage['name_parameter_sets_' + i];
            if (i > ii) {
                delete localStorage['parameter_sets_' + i];
                localStorage['parameter_sets_' + ii] = parameter_sets[ii];
                delete localStorage['name_parameter_sets_' + i];
                localStorage['name_parameter_sets_' + ii] = name_parameter_sets[ii];
            }
            ii++;
        }
    }

    count_parameter_sets = parameter_sets.length;
    reset_info = "<table width=100%>";
    reset_info += "<tr align='center'><td colspan=7 " + style_button + " id=reset>Сбросить параметры</td></tr>";
    reset_info += "<tr align='center'><td colspan=7 " + style_button + " id=tgr_switch>Наборы статов</td></tr>";
    {
        reset_info += "<tr align='center' class='tgr'><td colspan=7>Наборы параметров:</td></tr>";
        if (parameter_sets.length == 0) {
            reset_info += "<tr align='center' class='tgr'><td colspan=6>0 наборов</td></tr>";
        } else {
            for (var j = 0; j < parameter_sets.length; j++) {
                set_infos = parameter_sets[j].split(".");
                set_info = "";
                for (var k = 0; k < set_infos.length; k++) {
                    if (set_infos[k] / 1 > 0) {
                        set_info += "+<b>" + set_infos[k] + "</b><img width=15 src='http://dcdn.heroeswm.ru/i/s_" + stats_names[k] + ".gif'>";
                    }
                }
                set_info = set_info.substr(1);
                set_info = (j + 1) + ". " + name_parameter_sets[j] + " " + "<span style='font-size:11px'>[" + set_info + "]</span>";
                reset_info += "<tr align='center' class='tgr'>";
                reset_info += "<td colspan=5 align=left>" + set_info + "</td>";
                reset_info += "<td id=apply_set_" + j + " " + style_button + " width=10 title='Применить'><b>(+)</b></td>";
                reset_info += "<td id=delete_set_" + j + " " + style_delete + " width=10 title='Удалить'><b>X</b></td>";
                reset_info += "</tr>";
            }
        }
        reset_info += "<tr align='center' class='tgr'><td colspan=7>Добавить набор:</td></tr>";
        reset_info += "<tr align='center' class='tgr'>";
        reset_info += "<td>Имя</td>";
        reset_info += "<td><img src='http://dcdn.heroeswm.ru/i/s_attack.gif'></td>";
        reset_info += "<td><img src='http://dcdn.heroeswm.ru/i/s_defence.gif'></td>";
        reset_info += "<td><img src='http://dcdn.heroeswm.ru/i/s_power.gif'></td>";
        reset_info += "<td><img src='http://dcdn.heroeswm.ru/i/s_knowledge.gif'></td>";
        reset_info += "<td id=add_set rowspan=2 colspan=2 " + style_button + ">Добавить</td>";
        reset_info += "</tr>";
        reset_info += "<tr align='center' class='tgr'>";
        reset_info += "<td><input id=set_name type=text size=10 maxlength=8></td>";
        reset_info += "<td><input id=set_a type=text size=1></td>";
        reset_info += "<td><input id=set_d type=text size=1></td>";
        reset_info += "<td><input id=set_p type=text size=1></td>";
        reset_info += "<td><input id=set_k type=text size=1></td>";
        reset_info += "</tr>";
        reset_info += "</table>";
        td_reset.innerHTML = reset_info;
        for (var k = 0; k < parameter_sets.length; k++) {
            $('apply_set_' + k).addEventListener(
                "click",
                function () {
                    var id = this.id;
                    count_set = id.split("_")[2];
                    set_infos = parameter_sets[count_set].split(".");
                    quickApplyParams(set_infos);
                }
            );
            $('delete_set_' + k).addEventListener(
                "click",
                function () {
                    var id = this.id;
                    count_set = id.split("_")[2];
                    console.log(localStorage['parameter_sets_' + count_set]);
                    if (localStorage['parameter_sets_' + count_set]) {
                        localStorage.removeItem('parameter_sets_' + count_set);
                        localStorage.removeItem('name_parameter_sets_' + count_set);
                        console.log(localStorage['parameter_sets_' + count_set]);
                        init_reset_info();
                    }
                }
            );
        }
        $('add_set').onclick = add_set;
    }
    $('reset').onclick = reset_parameters;
    $('tgr_switch').onclick = toggle_setups;
    if(tgr_stance == null){
        tgr_stance = 1;
        toggle_setups();
    }
}

init_reset_info();

function $( id ) {
    return document.getElementById( id );
}

function toggle_setups(){
    tgr_stance = (tgr_stance + 1) % 2;
    var tgr_rows = document.querySelectorAll('tr[class="tgr"]'),
        rid;
    for (rid = 0; rid < tgr_rows.length; rid++){
        if(!tgr_stance) tgr_rows[rid].style = 'visibility: collapse;';
        else tgr_rows[rid].style = 'visibility: initial;';
    }
}

function startAjax() {
    if (!xmlHttp && typeof XMLHttpRequest != 'undefined')
        xmlHttp = new XMLHttpRequest();
}

function send(url, afterSend) {
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = afterSend;
    xmlHttp.send(null);
}

function afterSend() {
    rst = xmlHttp.readyState;
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            if (sendStatus == 1) {
                sign = xmlHttp.responseText.split("sign=");
                sign = sign[1].substr(0, sign[1].indexOf("\""));
                if (sign) {
                    send("http://" + host + "/shop.php?b=reset_tube&cat=potions&sign=" + sign, afterSend);
                    sendStatus = 2;
                }
            } else if (sendStatus == 2) {
                send("http://" + host + "/inventory.php", afterSend);
                sendStatus = 3;
            } else if (sendStatus == 3) {
                text = xmlHttp.responseText;
                reset_tube = text.split("id=reset_tube");
                reset_tube = reset_tube[1].split("?dress=");
                reset_tube = reset_tube[1].substr(0, reset_tube[1].indexOf("'"));
                if (reset_tube) {
                    send("http://" + host + "/inventory.php?dress=" + reset_tube, afterSend);
                    sendStatus = 4;
                }
            } else if (sendStatus == 4) {
                location.href = "http://" + host + "/home.php";
            } else {
                counter_stat_end++;
                $("progress_stats").style.width = counter_stat_end * 100 / points + "%";
                $("progress_stats").innerHTML = "<b>" + counter_stat_end + "/" + points + "</b>";
                if (counter_stat_end == points)
                    location.href = "http://" + host + "/home.php";

                console.log(stats[counter_stat_end - 1]);
                n = tbl.rows[stats[counter_stat_end - 1]].cells[2].innerHTML;
                n = n.substr(n.indexOf("+") + 1);
                n = n.substr(0, n.indexOf("<"));
                tbl.rows[stats[counter_stat_end - 1]].cells[2].innerHTML = "<b style='color:red'>&nbsp;+" + (n / 1 + 1) + "</b>";
                m = tbl.rows[4].cells[0].innerHTML;
                m = m.substr(m.lastIndexOf(" ") + 1);
                console.log("m = '" + m + "'");
                tbl.rows[4].cells[0].innerHTML = "<b>Свободных очков от навыка:</b> " + (m / 1 - 1);
                rst = 0;
            }
        }
    }
}

function reset_parameters() {
    send("http://" + host + "/shop.php?cat=potions", afterSend);
    $("reset").innerHTML = "Сбросить параметры <img width=15 src='http://dcdn2.heroeswm.ru/i/loading.gif'>";
    sendStatus = 1;
}

function add_set() {
    var parameter_set = ($('set_a').value ? $('set_a').value : 0) + ".";
    parameter_set += ($('set_d').value ? $('set_d').value : 0) + ".";
    parameter_set += ($('set_p').value ? $('set_p').value : 0) + ".";
    parameter_set += ($('set_k').value ? $('set_k').value : 0);
    localStorage['parameter_sets_' + count_parameter_sets] = parameter_set;
    localStorage['name_parameter_sets_' + count_parameter_sets] = $('set_name').value ? $('set_name').value : "Набор" + (count_parameter_sets + 1);
    init_reset_info();
}

function quickApplyParams(stats) {
    var attack = parseInt(stats[0]),
        defence = parseInt(stats[1]),
        SM = parseInt(stats[2]),
        knowlege = parseInt(stats[3]);

    requestPage ('http://www.heroeswm.ru/skillwheel.php', function (dom) {
        var curPerks = dom.querySelector('object[classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"] param[name="FlashVars"]').value.split('|');
        curPerks[0] = curPerks[0].split('$');
        curPerks[0] = '$' + curPerks[0][curPerks[0].length - 1];
        var chosenPerks = [];

        for (var i = 8; i < curPerks.length; i += 9)
            if(curPerks[i] == '1') chosenPerks.push(curPerks[i - 8].replace('$', ''));

        var params = '', buildperks0 = '', t;

        for (var p = 0; p <=30; p++) {
            if(chosenPerks.length) {
                t = chosenPerks.shift();
                params = 'param' + p + '=' + t + '&' + params;
                buildperks0 += t + '%3B';
            } else {
                params = 'param' + p + '=&' + params;
            }
        }
        
        var enlightenmentStats = Math.floor(parseInt(document.body.innerHTML.match(/Боевой уровень: (\d+)/)[1]) / new Object({0: 99, 1: 4, 2: 3, 3: 2})[(buildperks0.match(/enlightenment/g) || []).length]);
        var maxStatId = [{i: 0, v: attack}, {i: 1, v: defence}, {i: 2, v: SM}, {i: 3, v: knowlege}].sort(function(a,b){return b.v > a.v})[0].i;
        var enlightenmentString = 'pstat3=0&pstat2=0&pstat1=0&pstat0=0'.replace('pstat' + maxStatId + '=0', 'pstat' + maxStatId + '=' + enlightenmentStats);

        var postVars = 'loading=true&rand=0%2E521691998932511&reset%5Fall=0&setall=1&setpstats=' + (enlightenmentStats > 0 ? 1 : 0) + '&' + params + 'buildperks0=' + buildperks0 + '&buildbaseid0=99&buildname0=&setstats=1&stat3=' + knowlege + '&stat2=' + SM + '&stat1=' + defence + '&stat0=' + attack + '&' + enlightenmentString + '&onData=%5Btype%20Function%5D';
        applyChanges('http://www.heroeswm.ru/skillwheel.php', postVars);
    });
}

function applyChanges(url, params) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function() {
    if(xmlhttp.status == 200)
        document.location.reload();
    }
}

function requestPage (url, onloadHandler) {
  console.log('[HWM_InstantParametersChange] loading: ', url);
  GM_xmlhttpRequest({
    overrideMimeType: 'text/plain; charset=windows-1251',
    synchronous: false,
    url: url,
    method: "GET",
    onload: function(response) {
      onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
    },
    onerror: function() { requestPage (url, onloadHandler) },
    ontimeout: function() { requestPage (url, onloadHandler) },
    timeout: 5000
  });
}

startAjax();