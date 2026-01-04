// ==UserScript==
// @name         AWBW Damage Calculator Plugin
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  calculate damage in games!
// @author       zhangjk95
// @match        http://awbw.amarriner.com/game.php?games_id=*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/40909/AWBW%20Damage%20Calculator%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/40909/AWBW%20Damage%20Calculator%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const terrainMap = {"1":1,"2":2,"3":3,"4":4,"5":4,"6":4,"7":4,"8":4,"9":4,"10":4,"11":4,"12":4,"13":4,"14":4,"15":15,"16":15,"17":15,"18":15,"19":15,"20":15,"21":15,"22":15,"23":15,"24":15,"25":15,"26":26,"27":26,"28":28,"29":29,"30":29,"31":29,"32":29,"33":33,"34":48,"35":49,"36":50,"37":51,"38":48,"39":49,"40":50,"41":51,"42":52,"43":48,"44":49,"45":50,"46":51,"47":52,"48":48,"49":49,"50":50,"51":51,"52":52,"53":48,"54":49,"55":50,"56":51,"57":52,"81":48,"82":49,"83":50,"84":51,"85":52,"86":48,"87":49,"88":50,"89":51,"90":52,"91":48,"92":49,"93":50,"94":51,"95":52,"96":48,"97":49,"98":50,"99":51,"100":52,"101":102,"102":102,"103":102,"104":102,"105":102,"106":102,"107":102,"108":102,"109":102,"110":102,"111":111,"112":112,"113":113,"114":114,"115":115,"116":115,"117":50,"118":49,"119":48,"120":52,"121":51,"122":50,"123":49,"124":48,"125":52,"126":51,"127":131,"128":131,"129":131,"130":131,"131":131,"132":131,"133":131,"134":131,"135":131,"136":131,"137":131,"138":142,"139":142,"140":142,"141":142,"142":142,"143":142,"144":142,"145":142,"146":142,"147":142,"148":142,"149":50,"150":49,"151":48,"152":131,"153":52,"154":142,"155":51,"156":50,"157":49,"158":48,"159":131,"160":52,"161":142,"162":51,"163":50,"164":49,"165":48,"166":131,"167":52,"168":142,"169":51,"170":50,"171":49,"172":48,"173":131,"174":52,"175":142,"176":51};
    const unitMap = {"anti-air":"9","apc":"6","artillery":"7","b-copter":"13","battleship":"15","blackboat":"28","blackbomb":"968731","bomber":"12","carrier":"29","cruiser":"16","fighter":"11","infantry":"1","lander":"17","md.tank":"3","mech":"2","megatank":"1141438","missile":"10","neotank":"46","piperunner":"960900","recon":"5","rocket":"8","stealth":"30","sub":"18","t-copter":"14","tank":"4"};
    const coMap = {"adder":"11","andy":"1","colin":"15","drake":"5","eagle":"10","flak":"25","grimm":"20","grit":"2","hachi":"17","hawke":"12","jake":"22","javier":"27","jess":"14","jugger":"26","kanbei":"3","kindle":"23","koal":"21","lash":"16","max":"7","nell":"24","olaf":"9","rachel":"28","sami":"8","sasha":"19","sensei":"13","sonja":"18","sturm":"29","vonbolt":"30"};
    const countryMap = {"os":"orangestar","bm":"bluemoon","ge":"greenearth","yc":"yellowcomet","bh":"blackhole","rf":"redfire","gs":"greysky","bd":"browndesert","ab":"amberblaze","js":"jadesun","ci":"cobaltice","pc":"pinkcosmos","tg":"tealgalaxy","pl":"purplelightning"};

    let map = null;
    let players = {};
    let units = [];

    $(() => {
        // read map data
        let mapId = $('a').map((i, el) => el.href.match(/\/prevmaps\.php\?maps_id=(\d+)/))[1];
        $.get('/text_map.php?maps_id=' + mapId).then(res => {
            map = Array.from($(res).find('.borderwhite td').map((i, el) => $(el).text()))
                .map(l => l.split(',').map(c => terrainMap[c]));
        });

        // read players info
        $('#hidestats tr tr tr').filter((i, el) => $(el).find('td.small').length > 0).each((i, el) => {
            let $el = $(el);
            let coUrl = $el.find('>td:first-child img')[0].src;
            let coName = Object.keys(coMap).filter(n => coUrl.indexOf(n) !== -1)[0];
            let co = coMap[coName];
            let country = $el.find('img').map((i, el) => el.src.match(/[/_]([a-z]+)logo\./))[1];
            let funds = $el.find('>td:nth-child(4)').text();
            funds = Math.min(Math.floor(funds / 1000) * 1000, 99000);
            let cities = $('#map img').filter((i, el) => el.src.indexOf(`${countryMap[country]}city`) !== -1).length;
            let towers = $('#map img').filter((i, el) => el.src.indexOf(`${countryMap[country]}comtower`) !== -1).length;
            let coColor = ($el.find('>td:first-child').attr('style').match(/background-color:\s*(.*?);/) || [])[1];
            let power = coColor === '#FF0000' ? 'Y' : coColor === '#0066CC' ? 'S' : 'N';
            players[country] = {co, country, funds, cities, towers, power};
        });

        // read units info
        $('span').filter((i, el) => el.id.indexOf('unit_') === 0).each((i, el) => {
            let $el = $(el);
            let name = $el.find('img').attr('src').match(/[/_]([^/_]*)\.\w+$/)[1];
            let hp = '10';
            let $spanHp = $el.next();
            if ($spanHp.length > 0 && $spanHp[0].id.indexOf('unit_') !== 0) {
                let match = $spanHp.find('img').attr('src').match(/[/_](\d+)\.\w+$/);
                if (match) {
                    hp = match[1];
                }
            }
            let positionMatch = $el.find('a').attr('onclick').match(/\((\d+),\s*(\d+)\)/);
            units.push({
                el: el,
                country: name.substring(0,2),
                type: name.substring(2),
                hp: hp,
                x: positionMatch[2],
                y: positionMatch[1]
            });
        });

        // add button
        $($('#map .small_text')[1]).append(`<br><a href="javascript:;" onclick="chooseAttacker()">[Calculate Damage]</a>`);
        // add message
        $('#map').prepend(`<p id="cd-message"></p>`);
    });

    function getPlayerInfo(dcUrl, prefix) {
        const fields = new Set(['co', 'power', 'funds', 'cities', 'towers']);
        let res = {};
        let strs = dcUrl.split('&')
            .filter(item => item.indexOf(prefix) === 0)
            .map(item => item.replace(prefix, '').split('='))
            .filter(([k, v]) => fields.has(k))
            .forEach(([k, v]) => res[k] = v);
        return res;
    }

    function chooseAttacker() {
        $('#cd-message').text('Please choose an attacker:');
        $('.defender-overlay').remove();
        units.forEach((unit, i) => {
            let position = $(unit.el).position();
            $(`<span class="attacker-overlay" style="width: 16px; height: 15px; position: absolute; top: ${position.top}px; left: ${position.left}px; z-index: 400; background-color: #fff; border: 1px solid #333; opacity: 0.7; cursor: pointer;" onclick="chooseDefender(${i}, event)"></span>`).insertAfter(unit.el);
        });
    }

    function chooseDefender(attackerId, e) {
        $('#cd-message').text('Please choose a defender:');
        $('.attacker-overlay').remove();
        let attacker = units[attackerId];
        units.forEach((unit, i) => {
            if (unit.country !== attacker.country) {
                let position = $(unit.el).position();
                $(`<span class="defender-overlay" style="width: 16px; height: 15px; position: absolute; top: ${position.top}px; left: ${position.left}px; z-index: 400; background-color: #f33; border: 1px solid #333; opacity: 0.7; cursor: pointer;" onclick="showResult(${attackerId}, ${i}, event)"></span>`).insertAfter(unit.el);
            }
        });

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function showResult(attackerId, defenderId, e) {
        $('#cd-message').text('');
        $('.defender-overlay').remove();
        let attacker = units[attackerId];
        let defender = units[defenderId];
        let aPlayer = players[attacker.country];
        let dPlayer = players[defender.country];
        let url = `/calculator.php?action=calculate&a_co=${aPlayer.co}&a_power=${aPlayer.power}&a_unit=${unitMap[attacker.type]}&a_unit_hit_points=${attacker.hp}&a_terrain=${map[attacker.x][attacker.y]}&a_funds=${aPlayer.funds}&a_cities=${aPlayer.cities}&a_towers=${aPlayer.towers}&d_co=${dPlayer.co}&d_power=${dPlayer.power}&d_unit=${unitMap[defender.type]}&d_unit_hit_points=${defender.hp}&d_terrain=${map[defender.x][defender.y]}&d_funds=${dPlayer.funds}&d_cities=${dPlayer.cities}&d_towers=${dPlayer.towers}`;
        window.open(url, '_blank');

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    window.chooseAttacker = chooseAttacker;
    window.chooseDefender = chooseDefender;
    window.showResult = showResult;
})();