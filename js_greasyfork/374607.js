// ==UserScript==
// @name          intelligent_parameters
// @namespace     intelligent_parameters
// @author        https://www.heroeswm.ru/pl_info.php?id=2058822
// @description   Asynchronous distribution of parameters, sets of parameters
// @version       3.1.4
// @homepage      https://greasyfork.org/en/scripts/374607-intelligent-parameters
// @include       https://www.heroeswm.ru/home.php*
// @include       https://www.lordswm.com/home.php*
// @include       http://178.248.235.15/home.php*
// @downloadURL https://update.greasyfork.org/scripts/374607/intelligent_parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/374607/intelligent_parameters.meta.js
// ==/UserScript==

(function(){
var xmlHttp = new XMLHttpRequest();
var host = location.hostname;
var url_curr = location.protocol+'//'+location.hostname;
var rst = 0;

var as = document.getElementsByTagName("a");
var counter_stat_begin = 0;
var counter_stat_end = 0;
var tbl = false;
var statsNames = ["attack", "defence", "power", "knowledge"];
var statsImages = ["attr_attack", "attr_defense", "attr_magicpower", "attr_knowledge"];
var urls = [];
var stats = [];
var tr_info = false;
var sendStatus = 0;
var parameter_sets = [];
var name_parameter_sets = [];
var count_parameter_sets = 0;
var points = 0;
var maxCountStats = 0;
var maxCountStatsId = 0;
var sumStats = 0;
var langId = (host == "www.lordswm.com" ? 1 : 0);

var lang = [
    ["Сбросить параметры", "Reset parameters"],
    ["Наборы параметров", "Parameter sets"],
    ["Боевой уровень", "Combat level"],
    ["Не распределено статов", "Not allocated parameters"],
    ["Свободных очков", "Available points"],
    ["Прогресс", "Progress"],
    ["Добавить набор", "Add a set"],
    ["Имя", "Name"],
    ["Добавить", "Add"],
    ["Применить", "Apply"],
    ["Удалить", "Delete"],
    ["Набор", "Set"],
    ["наборов", "sets"]
];

var imgs = document.getElementsByTagName("img");
for (var id_img in imgs) {
    var img = imgs[id_img].src;
    if (img && img.indexOf("attr_fortune.png") > -1)
        tr_info = imgs[id_img].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
}

var td_reset = tr_info.insertCell(3);
td_reset.align = "center";
td_reset.style.width = "48%";
var crossSpan = "<span style='cursor:pointer;background:#d33;color:white;padding:0 4 2 4;border-radius:3px;box-shadow:2px 2px 3px black;'><b>x</b></span>";
var showSets = localStorage['ip#show_sets'];
if (!showSets)
    showSets = 0;
var imagesSetDetails = ["set_details", "set_details1"];

function getSpan(val, padding) {
    if (!padding) padding = "0 4 2 4";
    return "<span style='cursor:pointer;border:1px solid #888;border-radius:3px;box-shadow:2px 2px 3px black;padding:" + padding + ";'>" + val + "</span>";
}

function init_reset_info() {
    var ii = 0;
    parameter_sets = [];
    name_parameter_sets = [];
    for (var i = 0; i < 20; i++) {
        if (localStorage['parameter_sets_' + i]) {
            parameter_sets[ii] = localStorage['parameter_sets_' + i];
            name_parameter_sets[ii] = localStorage['name_parameter_sets_' + i];
            if (i > ii) {
                delete localStorage['parameter_sets_' + i];
                localStorage['parameter_sets_' + ii] = parameter_sets[ii];
                delete localStorage['name_parameter_sets_' + i];
                localStorage['name_parameter_sets_' + ii] = name_parameter_sets[ii];
            }
//            alert(i + " - " + ii + " - " + parameter_sets[ii] + ": " + parameter_sets.length);
            ii++;
        }
    }
    count_parameter_sets = parameter_sets.length;
//    alert("count_parameter_sets = " + count_parameter_sets);
    if (tbl)
        showSets = 1;
    var reset_info = "<table width=100%>" +
        "<tr align='center'><td colspan=7 id=sets_params style='padding-top:7px;cursor:pointer;'>[ " + getMessage(1) + ":</b> <img src='https://dcdn.heroeswm.ru/i/" + imagesSetDetails[showSets] + ".gif' width=15 height=15 border=0 style='vertical-align:middle'> ]</td></tr>";
    if (showSets == 0) {
        reset_info += "</table>";
        td_reset.innerHTML = reset_info;
    } else {
        if (parameter_sets.length == 0) {
            reset_info += "<tr align='center'><td colspan=6>0 " + getMessage(12) + "</td></tr>";
        } else {
            for (var j = 0; j < parameter_sets.length; j++) {
                set_infos = parameter_sets[j].split(".");
                set_info = "";
                // determine sum points for current set
                var ss = 0;
                for (var k = 0; k < set_infos.length; k++) {
                    var countStats = parseInt(set_infos[k]);
                    if (countStats > 0) {
                        set_info += "+<b>" + countStats + "</b><img width=15 src='https://dcdn.heroeswm.ru/i/icons/" + statsImages[k] + ".png?v=1'>";
                    }
                    ss += countStats;
                }
                set_info = set_info.substr(1);
                set_info = (j + 1) + ". " + name_parameter_sets[j] + " " + "<span style='font-size:11px'>[" + set_info + "]</span>";
                if (ss < points) {
                    set_info += "<br><i style='font-size: 11px;'>" + getMessage(3) + ": <b>" + (points - ss) + "</b>!</i>";
                }
                reset_info += "<tr align='center'>" +
                    "<td colspan=5 align=left>" + set_info + "</td>" +
                    "<td id=apply_set_" + j + " width=10 title='" + getMessage(9) + "'>" + getSpan("<b>(+)</b>") + "</td>" +
                    "<td id=delete_set_" + j + " width=10 title='" + getMessage(10) + "'>" + crossSpan + "</td>" +
                    "</tr>";
            }
        }
        reset_info += "<tr align='center'><td colspan=7><b>" + getMessage(6) + ":</b></td></tr>" +
            "<tr align='center'>" +
            "<td>" + getMessage(7) + "</td>";
        for (var i = 0; i < 4; i++)
            reset_info += "<td><img width=24 height=24 src='https://dcdn.heroeswm.ru/i/icons/" + statsImages[i] + ".png?v=1'></td>";
        reset_info += "<td id=add_set rowspan=2 colspan=2>" + getSpan(getMessage(8), "4 4 4 4") + "</td>" +
            "</tr>" +
            "<tr align='center'>" +
            "<td><input id=set_name type=text size=10 maxlength=10></td>" +
            "<td><input id=set_a type=text size=1 maxlength=2 style='width:30px'></td>" +
            "<td><input id=set_d type=text size=1 maxlength=2 style='width:30px'></td>" +
            "<td><input id=set_p type=text size=1 maxlength=2 style='width:30px'></td>" +
            "<td><input id=set_k type=text size=1 maxlength=2 style='width:30px'></td>" +
            "</tr>" +
            "</table>";
        td_reset.innerHTML = reset_info;
        for (var k = 0; k < parameter_sets.length; k++) {
            $('apply_set_' + k).addEventListener(
                "click",
                function () {
                    var id = this.id;
                    var setId = id.split("_")[2];
                    var currentStats = parameter_sets[setId].split(".");
                    for (var i = 0; i < 4; i++)
                        currentStats[i] = parseInt(currentStats[i]);
                    applyParams(currentStats);
                }
            );
            $('delete_set_' + k).addEventListener(
                "click",
                function () {
                    var id = this.id;
                    var setId = id.split("_")[2];
                    if (localStorage['parameter_sets_' + setId]) {
                        delete localStorage['parameter_sets_' + setId];
                        delete localStorage['name_parameter_sets_' + setId];
                        init_reset_info();
                    }
                }
            );
        }
        $('add_set').onclick = add_set;
    }
    $('sets_params').onclick = function() {
        if (!tbl) {
            showSets = 1 - showSets;
            localStorage['ip#show_sets'] = showSets;
            init_reset_info();
        }
    };
}

for (var i = 0; i < as.length; i++) {
    var aHref = as[i].href;
    if (aHref && aHref.indexOf("increase=") > -1) {
        if (!tbl) {
            points = document.body.innerHTML.split("<b>+</b>")[4].split(":</b> ")[1];
            points = points.substr(0, points.indexOf("<"));
            tbl = as[i].parentNode.parentNode.parentNode;
            inner = "<tr align=center><td colspan=4><table width=100%><tr>" +
                "</tr></table></td></tr>" +
                "<tr><td colspan=4><div class=wblight style='border-radius:5px'>" +
                "<div id=progress_stats style='border-radius:4px;font-size:9px;padding-top:1px;padding-bottom:1px;background-color:#592C08;color:white'>&nbsp;&nbsp;" + getMessage(5) + "...</div>" +
                "</div>" +
                "</td></tr>";
            tbl.innerHTML += inner;
        }
        as[i].href = "javascript:void(0);";
        var stat = aHref.substr(aHref.indexOf("=") + 1);
        if (stat == statsNames[0])
            as[i].onclick = function () {
                increase(0)
            };
        else if (stat == statsNames[1])
            as[i].onclick = function () {
                increase(1)
            };
        else if (stat == statsNames[2])
            as[i].onclick = function () {
                increase(2)
            };
        else if (stat == statsNames[3])
            as[i].onclick = function () {
                increase(3)
            };
    }
}

init_reset_info();

function $(id) {
    return document.getElementById(id);
}

function send(method, url, params, afterSend) {
    xmlHttp.open(method, url, true);
    if (method == "POST")
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlHttp.onreadystatechange = afterSend;
    xmlHttp.send(params);
}

function afterSend() {
    rst = xmlHttp.readyState;
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            if (sendStatus == 1) {
                sign = xmlHttp.responseText.split("sign=");
                sign = sign[1].substr(0, sign[1].indexOf("\""));
                if (sign) {
                    send("GET", url_curr + "/shop.php?b=reset_tube&reset=1&cat=potions&sign=" + sign, null, afterSend);
                    sendStatus = 4;
                }
            } else if (sendStatus == 4) {
                location.href = url_curr + "/home.php";
            } else {
                counter_stat_end++;
                var progress_status_width = counter_stat_end * 100 / points;
                if (progress_status_width < 25)
                    progress_status_width = 25;
                $("progress_stats").style.width = progress_status_width + "%";
                $("progress_stats").innerHTML = "<b>&nbsp;&nbsp;" + counter_stat_end + "/" + points + "</b>";
                if (counter_stat_end == points || stats[counter_stat_end - 1] == maxCountStatsId && sumStats >= points)
                    location.href = url_curr + "/home.php";

                console.log(stats[counter_stat_end - 1]);
                var n = tbl.rows[stats[counter_stat_end - 1]].cells[2].innerHTML;
                n = n.substr(n.indexOf("+") + 1);
                n = n.substr(0, n.indexOf("<"));
                var countStats = parseInt(n);
                if (isNaN(countStats)) countStats = 0;
                //alert(sumStats + " - " + points);
                if (stats[counter_stat_end - 1] == maxCountStatsId && sumStats >= points)
                    countStats += maxCountStats;
                else
                    countStats++;
                tbl.rows[stats[counter_stat_end - 1]].cells[2].innerHTML = "<b style='color:red'>&nbsp;+" + countStats + "</b>";
                var m = tbl.rows[4].cells[0].innerHTML;
                m = parseInt(m.substr(m.lastIndexOf(" ") + 1));
                console.log("m = '" + m + "'");
                tbl.rows[4].cells[0].innerHTML = "<b>" + getMessage(4) + ":</b> " + (m - 1);
                rst = 0;
            }
        }
    }
}

function add_set() {
    var S = [];
    S[0] = parseInt($('set_a').value) || 0;
    S[1] = parseInt($('set_d').value) || 0;
    S[2] = parseInt($('set_p').value) || 0;
    S[3] = parseInt($('set_k').value) || 0;
    localStorage['parameter_sets_' + count_parameter_sets] = S[0] + "." + S[1] + "." + S[2] + "." + S[3];
    localStorage['name_parameter_sets_' + count_parameter_sets] = $('set_name').value ? $('set_name').value : getMessage(11) + (count_parameter_sets + 1);
    init_reset_info();
}

function increase(stat) {
    var url = url_curr + "/home.php?increase=" + statsNames[stat];
    if (counter_stat_begin < points) {
        stats[counter_stat_begin] = stat;
        urls[counter_stat_begin++] = url;
    }
    //alert(n);
}

function increaseStat() {
    if (counter_stat_end < urls.length && rst == 0) {
        send("GET", urls[counter_stat_end], null, afterSend);
        rst = 777;
        sendStatus = 0;
    }
    if (points > 0)
        setTimeout(increaseStat, 100);
}

function applyParams(stats) {
    send("GET", url_curr + "/skillwheel.php", null, function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var dom = new DOMParser().parseFromString(xmlHttp.responseText, 'text/html').documentElement;
            var perksList = dom.querySelector('object[classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"] param[name="FlashVars"]');
                //flash: <param name="FlashVars" value='param=stats=20;0;0;0;0;0;0;0;0;builds=
                //html:  init_skills("skill_wheel", "https://dcdn.heroeswm.ru/i/", 540, 540, 2, "stats=20;0;0;0;0;0;0;0;0;builds=@20;
            if(!perksList){
              pl = /stats=[^"]*/.exec(xmlHttp.responseText);
              perksList = pl[0];
              if(!perksList){
                console.log('intelligent_parameters: stats not found - aborting');
                return;
              }
            } else {
              perksList = perksList.value;
            }

            var curPerks = perksList.split('|');
            curPerks[0] = curPerks[0].split('$');
            curPerks[0] = '$' + curPerks[0][curPerks[0].length - 1];
            var chosenPerks = [];
            for (var i = 8; i < curPerks.length; i += 9)
                if (curPerks[i] == '1') chosenPerks.push(curPerks[i - 8].replace('$', ''));

            var params = '';
            for (var p = 0; p < chosenPerks.length; p++) {
                params += '&param' + p + '=' + chosenPerks[p];
            }
            if (params == '')
                params = '&param0=' + curPerks[0].replace('$', '');
            var re = new RegExp(getMessage(2) + ": (\\d+)", 'g');
            var enlightenmentStats = Math.floor(parseInt(document.body.innerHTML.match(re)[1]) / new Object({0: 99, 1: 4, 2: 3, 3: 2})[(params.match(/enlightenment/g) || []).length]);
            var maxStatId = [
                {i: 0, v: stats[0]},
                {i: 1, v: stats[1]},
                {i: 2, v: stats[2]},
                {i: 3, v: stats[3]}
            ].sort(function (a, b) {
                    return b.v > a.v
                })[0].i;
            var enlightenmentString = 'pstat3=0&pstat2=0&pstat1=0&pstat0=0'.replace('pstat' + maxStatId + '=0', 'pstat' + maxStatId + '=' + enlightenmentStats);
            var postVars = 'setall=1&setpstats=1' + params + '&setstats=1&stat3=' + stats[3] + '&stat2=' + stats[2] + '&stat1=' + stats[1] + '&stat0=' + stats[0] + '&' + enlightenmentString;
            if ($("progress_stats")) {
                $("progress_stats").style.width = '50%';
                $("progress_stats").innerHTML = "<b>&nbsp;&nbsp;" + Math.floor(points / 2) + "/" + points + "</b>";
            }
            send("POST", 'https://' + host + '/skillwheel.php', postVars, afterSend);
            sendStatus = 4;
        }
    });
}

function getMessage(id) {
    return lang[id][langId];
}

increaseStat();
})();