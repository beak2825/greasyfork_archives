// ==UserScript==
// @name           DailyHelper
// @author         omne
// @namespace      omne
// @connect        daily.heroeswm.ru
// @description    Помощь
// @version        0.1
// @include        /^https{0,1}:\/\/((www|qrator|)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(leader_guild|war).php/
// @grant          GM_xmlhttpRequest
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454098/DailyHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/454098/DailyHelper.meta.js
// ==/UserScript==

(function() {

var host = location.host;
var imgHost = host.includes("my.") ? "//cfcdn.lordswm.com" : "//dcdn.heroeswm.ru";
var dailyHost = host.includes("my.") ? "//daily.lordswm.com" : "//daily.heroeswm.ru";
if (/leader_guild/.test(location.href)) {
    if (document.documentElement.innerHTML.indexOf("Опасная цель устранена!") != -1) {
        let cent = document.createElement('center');
        cent.innerHTML = "Вы молодцы! Приходите завтра."
        document.querySelector('.wbwhite').append(cent);
    } else {
        var lg;
        if (document.documentElement.innerHTML.indexOf("Ваша армия слишком слаба") == -1) {
            lg = Math.ceil((Number(document.documentElement.innerHTML.match("attr_leadership.+?<b>([^<]+)")[1].replace(",", "")) - 10001)/1000);
        } else {
            lg = Math.ceil((Number(document.documentElement.innerHTML.match("на ([0-9,]+) или больше очков")[1].replace(",", "")) - 9999)/1000);
        }
        var creatures = {};
        getCol();
    }
}

function getCol() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "/leader_army.php",
        onload: function(res) {
            let data = res.responseText;
            let monsters = [];
            monsters[0] = data.match(/obj\[[0-9]+\]\[\'monster_id\'\] = \'[^\']+\'/g);
            monsters[1] = data.match(/obj\[[0-9]+\]\[\'count\'\] = [0-9]+/g);
            for (let i = 0; i < monsters[0].length; i++) {
                let id = monsters[0][i].match(/obj\[[0-9]+\]\[\'monster_id\'\] = \'([^\']+)\'/)[1];
                let count = monsters[1][i].match(/obj\[[0-9]+\]\[\'count\'\] = ([0-9]+)/)[1];
                creatures[id] = Number(count);
            }
            getLgd(dailyHost + "/api.php?t=lgd&lg=" + lg);
        }
    });
}

function getCre(id, img, rarity, count, flag) {
     return '<div class="cre_creature" style="width: 45px"><div class="cre_mon_parent" style="height:37px">' +
                        '<img src="' + imgHost + '/i/army_html/fon_lvl' + rarity + '.png?v=1" width="45" height="37" class="cre_mon_image2">' +
                        '<img src="' + imgHost + '/i/portraits/' + img + 'anip33.png" width="45" height="37" class="cre_mon_image1">' +
                        '<img src="' + imgHost + '/i/army_html/frame_lvl' + rarity + '.png?v=1" width="45" height="37" class="cre_mon_image2" title="" border="0">' +
                        '</div>' +
                        '<div class="cre_amount" style="font-size:100%">' + count + '</div>' +
         '<div class="' + (flag ? "y":"n") + '"></div></div>';
}

var post_army = Array();

function army_try_to_submit(num) {
    let body = post_army[num];
    let ReqSend = new XMLHttpRequest();
    ReqSend.open('POST', '/leader_army_apply.php', true);
    ReqSend.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ReqSend.addEventListener("load", function() {location.reload()});
    ReqSend.send(body);
}
function getLgd(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(res) {
            console.log(creatures);
            let cent = document.createElement('center');
            cent.innerHTML += '<style>.y {background-color: green;}.n {background-color: red;}.y, .n {position: absolute;left: 2px;top: 2px;width: 10px;height: 10px;border-radius: 5px;}.examples{width:450px;border-bottom: 1px solid #cad3dc;border-left: 1px solid #cad3dc;}.cont{border-right: 1px solid #cad3dc;border-top: 1px solid #cad3dc;}.info{padding:10px;flex:1}.battle{flex:7;text-align: left;}.examples>div{padding:5px}.cont{display:flex;align-items: center;}.info, .info *{font-size:12px}</style>';
            cent.innerHTML += '<b>Доступные прохождения:</b>';
            let battleExamples = document.createElement('div');
            battleExamples.className = "examples";
            let closedBattleExamples = document.createElement('div');
            closedBattleExamples.className = "examples";
            let data = JSON.parse(res.responseText);
            console.log(data);
            for(let i in data) {
                let cont = document.createElement('div');
                cont.className = "cont";
                let info = document.createElement('div');
                info.className = "info";
                info.innerHTML += data[i].proc + "%<BR><a href = '/war.php?lt=-1&warid=" + data[i].warid + "&show_for_all="+ data[i].key +"'>Бой</a>";
                cont.append(info);
                let battle = document.createElement('div');
                battle.className = "battle";
                post_army[i] = "idx=0";
                let battleColsed = false;
                for (let j in data[i].army) {
                    let flag = false;
                    if ((data[i].army[j].id in creatures)&&(creatures[data[i].army[j].id] > data[i].army[j].count)) {
                        post_army[i] += "&countv" + (Number(j) + 1) + "=" + data[i].army[j].count + "&mon_id" + (Number(j) + 1) + "=" + data[i].army[j].id;
                        flag = true;
                    } else {
                         battleColsed = true;
                    }
                    battle.innerHTML += getCre(data[i].army[j].id, data[i].army[j].img, data[i].army[j].rarity, data[i].army[j].count, flag);
                }
                battle.innerHTML += '<img title = "Набрать эту армию" id = "b'+ i +'" style = "cursor:pointer;float:right" width = "35px" src="' + imgHost + '/i/combat/btn_recruit.png">';
                cont.append(battle);
                if (battleColsed) {
                    closedBattleExamples.append(cont);
                } else {
                    battleExamples.append(cont);
                }
            }
            cent.append(battleExamples);
            cent.innerHTML += '<b>Недоступные прохождения:</b>';
            cent.append(closedBattleExamples);
            document.querySelector('.wbwhite').append(cent);
            for (let i in data) {
                document.getElementById("b"+ i).onclick = function() {army_try_to_submit(i)};
            }
        }
    });
}

})();
