// ==UserScript==
// @name        Bulgarian battle orders
// @include      /^https:\/\/www\.erepublik\.com\/[a-z]{2}$/
// @include     *www.erepublik.com/*/military/battlefield/*
// @include     *www.erepublik.com/*/military/campaigns*
// @connect     erep.tsvetkov.be
// @connect     docs.google.com
// @version     1.79
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @description Bulgarian battle orders for bulgarian players
// @namespace   https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/19353/Bulgarian%20battle%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/19353/Bulgarian%20battle%20orders.meta.js
// ==/UserScript==

var serverUrl = "https://erep.tsvetkov.be/"; // don't forget to change @connect above

function toHHMMSS (num) {
    var sec_num = parseInt(num, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    //    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes; //+':'+seconds;
}

var $ = jQuery;
var lang = unsafeWindow.culture;

function style(t) {
    $("head").append("<style>" + t + "</style>");
}

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function(elem) {
        return $(elem).text().match("^" + arg + "$");
    };
});

function roundsInfo() {
    $.getJSON("/" + lang + "/military/campaigns-new", function(r) {
        $.each(r.battles, function(i, c) {
            $("span:textEquals('" + c.region.name + "')").text("(" + c.zone_id + ") " + c.region.name);
        });
    });
}

function main() {
    var citizen = unsafeWindow.erepublik.citizen;
    var url = serverUrl + "orders.php";
    var citizenId = citizen.citizenId;
    var level = citizen.userLevel;
    style("#bbo{padding: 10px 0;}");
    style("#bbo ul {list-style-type: none}");
    style("#bbo ul li {clear: both;}");
    style("#bbo ul li img{vertical-align: middle;}");
    style(".redH {font-weight: 700}");
    style(".imp0, .imp1, .imp2, .imp3 {display: block; float: right; font-weight: 700; color: white; font-size: 110%;}");
    style(".imp1 {background-color: green;}");
    style(".imp2 {background-color: red;}");
    style(".imp3 {background-color: black;}");
    $("#bbo").append("<ul></ul>");
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            $.getJSON("/" + lang + "/military/campaigns-new", function(r) {
                $.ajax({
                    url: "/" + lang + "/main/citizen-profile-json/" + citizenId,
                })
                    .done(function(p) {
                    var aRank = p.military.militaryData.aircraft.rankNumber;
                    var energyPerInterval = citizen.energyPerInterval;
                    var energyToRecover = citizen.energyToRecover * 2;
                    var hits = parseInt((citizen.energy + citizen.energyFromFoodRemaining) / 10);
                    var aDamage = parseInt(10 * (1 + 0 / 400) * (1 + aRank / 5) * (1 + 0 / 100) * (level > 100 ? 1.1 : 1));
                    var totalDamage = aDamage * hits;
                    var maxFFDamage = aDamage * energyToRecover / 10;
                    var fullIn = (energyToRecover - (citizen.energy + citizen.energyFromFoodRemaining)) / (energyPerInterval / 6) * 60;
                    var c70kIn = maxFFDamage >= 70000 && totalDamage < 70000 ? "70k: <b>" + toHHMMSS((70000 - totalDamage) / aDamage * 10 / (energyPerInterval / 6) * 60) + " ч</b>; " : '';
                    var c80kIn = maxFFDamage >= 80000 && totalDamage < 80000 ? "80k: <b>" + toHHMMSS((80000 - totalDamage) / aDamage * 10 / (energyPerInterval / 6) * 60) + " ч</b>; " : '';
                    $("#bbo ul").append("<li>Удари: <b>" + hits + "</b>; Щета: <b>" + totalDamage + "</b>; Макс. щета: <b>" + maxFFDamage + "</b>");
                    $("#bbo ul").append("<li>" + c70kIn + c80kIn + "Пълен: <b>" + toHHMMSS(fullIn) + " ч.</b>");
                    var orders = $.parseJSON(response.responseText);
                    $.each(orders, function(id, row) {
                        var href = row.link.match(/[0-9]+$/);
                        var side = row.countryid;
                        if (typeof r.battles[href] != 'undefined') {
                            var round = r.battles[href].zone_id;
                            var reqTime = r.time;
                            var startTime = r.battles[href].start;
                            var date = new Date(null);
                            var roundTime = Math.abs(reqTime - startTime);
                            var starting = "";
                            if (reqTime < startTime) {
                                starting = "-";
                            }
                            date.setSeconds(roundTime);
                            var bTime = starting + date.toISOString().substr(12, 4);
                        } else {
                            round = 'x';
                            bTime = '';
                        }
                        var country = row.country;
                        var importance = row.importance;
                        var priority = row.priority;
                        var iCountry = country.replace(/\s/g, '-').replace(/[()]/g, '');
                        var cFlag = country != null ? '<img src="https://www.erepublik.net/images/flags_png/S/' + iCountry + '.png" alt="' + country + '" title="' + country + '">' : '';
                        var caption = "(" + round + ") <span class='redH'>" + bTime + '</span> За ' + cFlag + " в " + row.caption.replace(/(<([^>]+)>)/ig, "");
                        href = href != null ? 'https://www.erepublik.com/' + lang + '/military/battlefield' + (priority < 3 ? '-choose-side' : '') + '/' + href + (priority < 3 ? "/" + side : '') : 'javascript:void(0);';
                        $("#bbo ul").append("<li><a href='" + href + "'>" + caption + "</a><span class='imp" + importance + "'>" + "☆".repeat(importance));
                    });
                });
            });

        }
    });
}

function damage() {
    var url = serverUrl + "orders.php",
        sd = unsafeWindow.SERVER_DATA,
        battleId = parseInt(sd.battleId),
        bIds = [];
    var citizen = unsafeWindow.erepublik.citizen;
    var nick = citizen.name;
    var citizenId = citizen.citizenId;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            var battle = location.href.match(/[0-9]+$/),
                side = $('.country_name').first().text().trim(),
                user = $('.profile a').attr('href').match(/[0-9]+$/),
                zId = sd.zoneId,
                lbId = sd.leftBattleId,
                muId = sd.militaryUnitId,
                kills = 0,
                hits = 0,
                division = sd.division,
                orders = $.parseJSON(response.responseText),
                bckgColor = "255,0,0",
                prio = "Не",
                importance = 0,
                dmg = 0;

            $.each(orders, function(id, row) {
                var bId = parseInt(row.link.match(/[0-9]+$/));
                if (!isNaN(bId) && bId == battleId && side == row.country) {
                    bckgColor = "0,128,0";
                    prio = "Да";
                    importance = row.importance;
                }
            });

            style('#send{cursor:pointer;color:#ffe49b;text-decoration:underline;padding:5px;z-index:55555;background-color:rgba(' + bckgColor + ',0.5);right:15px;top:-30px;position:absolute;border: 1px solid #000;border-radius:10px;}');
            style('.deployPanel #send{right:-40px}');
            $('#total_damage, .totalDamage').before('<span id="send" title="Изпрати отчет">отчет</span>');
            $('#send').on('click', function() {
                if (confirm("Искате ли да изпратите отчета?")) {
                    $.ajax({
                        url: "/" + lang + "/main/citizen-profile-json/" + citizenId,
                    })
                        .done(function(p) {
                        var div = p.military.militaryData.ground.divisionData.division;
                        var strength = p.military.militaryData.ground.strength;
                        var gRank = p.military.militaryData.ground.rankNumber;
                        var aRank = p.military.militaryData.aircraft.rankNumber;
                        var citizenLevel = p.citizen.level;
                        $.post('/' + lang + '/military/battle-console', {
                            battleId: sd.battleId,
                            zoneId: sd.zoneId,
                            action: 'battleStatistics',
                            round: sd.currentRoundNumber,
                            division: sd.division,
                            battleZoneId: sd.battleZoneId,
                            type: 'damage',
                            leftPage: 1,
                            rightPage: 1,
                            _token: sd.csrfToken,
                        })
                            .done(function(data) {
                            $.each(data[sd.mySideCountryId].fighterData, function(no, td) {
                                if (td.citizenId == sd.citizenId) {
                                    dmg = td.raw_value;
                                }
                            });
                            $.post('/' + lang + '/military/battle-console', {
                                battleId: sd.battleId,
                                zoneId: sd.zoneId,
                                action: 'battleStatistics',
                                round: sd.currentRoundNumber,
                                division: sd.division,
                                battleZoneId: sd.battleZoneId,
                                type: 'kills',
                                leftPage: 1,
                                rightPage: 1,
                                _token: sd.csrfToken,
                            })
                                .done(function(data) {
                                $.each(data[sd.mySideCountryId].fighterData, function(no, td) {
                                    if (td.citizenId == sd.citizenId) {
                                        kills = td.raw_value;
                                    }
                                });
                                var formData = new FormData();
                                var url = '';
                                if (sd.onAirforceBattlefield) {
                                    url = "https://docs.google.com/forms/d/e/1FAIpQLSeial7jNca9whxn4YfKQcibSFscWLt1UZUMc8MX19cFKhEStw/formResponse";
                                    formData.append('entry.1396976481', user);
                                    formData.append('entry.5810953', nick);
                                    formData.append('entry.1363447064', battle);
                                    formData.append('entry.862559158', dmg);
                                    formData.append('entry.308437973', kills);
                                    formData.append('entry.524002563', zId);
                                    formData.append('entry.157656273', side);
                                    formData.append('entry.458597783', prio);
                                    formData.append('entry.616644545', importance);
                                    formData.append('entry.1664209261', hits);
                                    formData.append('entry.1930467567', muId);
                                    formData.append('entry.860680125', aRank);
                                } else { // ground
                                    url = "https://docs.google.com/forms/d/e/1FAIpQLScaI8jyoi8WgjaQRvOmZIHMgiY20ARgtIo8mNTrJUTrqxmI4w/formResponse";
                                    formData.append('entry.1396976481', user);
                                    formData.append('entry.5810953', nick);
                                    formData.append('entry.1363447064', battle);
                                    formData.append('entry.862559158', dmg);
                                    formData.append('entry.308437973', kills);
                                    formData.append('entry.524002563', zId);
                                    formData.append('entry.157656273', side);
                                    formData.append('entry.458597783', prio);
                                    formData.append('entry.616644545', importance);
                                    formData.append('entry.1664209261', hits);
                                    formData.append('entry.234238652', muId);
                                    formData.append('entry.897629039', division);
                                    formData.append('entry.1548299087', strength);
                                    formData.append('entry.2049657681', gRank);
                                    formData.append('entry.363118786', citizenLevel);
                                }
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: url,
                                    data: formData,
                                    onload: function() {
                                        alert("Отчетът беше изпратен успешно");
                                    },
                                    onerror: function() {
                                        alert("Проблем!");
                                    }
                                });
                            });
                        });
                    })
                }
            });
        }
    });
}

$('#hpTopNews').before("<div id='bbo'></div>");
(/^https:\/\/www\.erepublik\.com\/[a-z]{2}$/) && main();
/military\/battlefield/.test(location.href) && damage();
/military\/campaigns/.test(location.href) && roundsInfo();