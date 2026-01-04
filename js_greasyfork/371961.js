// ==UserScript==
// @name         Admin set battle orders
// @version      0.91
// @description  Setting battle orders
// @author       N.Tsvetkov
// @match        *.erepublik.com/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/371961/Admin%20set%20battle%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/371961/Admin%20set%20battle%20orders.meta.js
// ==/UserScript==

var serverUrl = "https://erep.tsvetkov.be/"; // with trailing slash
var myCountryId = 42; // Bulgaria

var $ = jQuery;
var countryIds = {
    Romania: 1,
    Brazil: 9,
    Italy: 10,
    France: 11,
    Germany: 12,
    Hungary: 13,
    China: 14,
    Spain: 15,
    Canada: 23,
    USA: 24,
    Mexico: 26,
    Argentina: 27,
    Venezuela: 28,
    "United Kingdom": 29,
    Switzerland: 30,
    Netherlands: 31,
    Belgium: 32,
    Austria: 33,
    "Czech Republic": 34,
    Poland: 35,
    Slovakia: 36,
    Norway: 37,
    Sweden: 38,
    Finland: 39,
    Ukraine: 40,
    Russia: 41,
    Bulgaria: 42,
    Turkey: 43,
    Greece: 44,
    Japan: 45,
    "South Korea": 47,
    India: 48,
    Indonesia: 49,
    Australia: 50,
    "South Africa": 51,
    "Republic of Moldova": 52,
    Portugal: 53,
    Ireland: 54,
    Denmark: 55,
    Iran: 56,
    Pakistan: 57,
    Israel: 58,
    Thailand: 59,
    Slovenia: 61,
    Croatia: 63,
    Chile: 64,
    Serbia: 65,
    Malaysia: 66,
    Philippines: 67,
    Singapore: 68,
    "Bosnia Herzegovina": 69,
    Estonia: 70,
    Latvia: 71,
    Lithuania: 72,
    "North Korea": 73,
    Uruguay: 74,
    Paraguay: 75,
    Bolivia: 76,
    Peru: 77,
    Colombia: 78,
    "Republic of Macedonia (FYROM)": 79,
    Montenegro: 80,
    "Republic of China Taiwan": 81,
    Cyprus: 82,
    Belarus: 83,
    "New Zealand": 84,
    "Saudi Arabia": 164,
    Egypt: 165,
    "United Arab Emirates": 166,
    Albania: 167,
    Georgia: 168,
    Armenia: 169,
    Nigeria: 170,
    Cuba: 171
};
var battleId = parseInt(location.href.match(/[0-9]+$/));
var region = $("#region_name_link").text();
var countryLeft = $(".country.left_side > div").text().trim();
var countryRight = $(".country.right_side > div").text().trim();
var countryLeftId = countryIds[countryLeft];
var countryRightId = countryIds[countryRight];
var flagLeft = "<img src='/images/flags_png/S/" + countryLeft.replace(/\s/g, '-').replace(/[()]/g, '') + "' alt='' title='" + countryLeft + "'>";
var flagRight = "<img src='/images/flags_png/S/" + countryRight.replace(/\s/g, '-').replace(/[()]/g, '') + "' alt='' title='" + countryRight + "'>";
var sel = new Array();
sel[0] = '';
sel[1] = '';
sel[2] = '';

if (SERVER_DATA.isResistance === true) {
    if (countryLeftId != myCountryId) {
        sel[0] = ' selected=""';
    } else {
        sel[1] = ' selected=""';
    }
} else {
    sel[2] = ' selected=""';
}

function style(t) {
	$("head").append("<style>" + t + "</style>");
}

function battle() {
    style("#adminint{z-index: 100000; position: absolute; top: 0; right: 0;margin: 7px;padding: 5px;border-radius: 3px;font-size: 11px;background-color:rgba(255,255,255,0.95);border:1px solid #999;box-shadow: 1px 1px 8px #aaaaaa;};");
    style("#adminint div, #adminint h3{text-align: center; margin: 5px 0;}");
    style("#adminint div select{width: 150px;}");
    style("#adminint div label{display:inline-block;width:60px;}");
    $("body").after("<div id='adminint'></div>");
    $("#adminint").append("<h3>" + region + "</h3>");
    $("#adminint").append("<div><label for='leftcountry'>" + flagLeft + "</label><input id='leftcountry' type='radio' name='country' value='" + countryLeftId + "' checked='checked'><label for='rightcountry'>" + flagRight + "</label><input id='rightcountry' type='radio' name='country' value='" + countryRightId + "'></div>");
    $("#adminint").append('<div><label>Приоритет</label><select name="priority"><option value="1"' + sel[0] + '>Въстание, червен флаг (освобождаваме)</option><option value="2"' + sel[1] + '>Въстание, зелен флаг (пазим)</option><option value="3"' + sel[2] + '>Директна сив флаг</option><option value="4">Директна син флаг</option><option value="5">Директна зелен флаг</option><option value="6">Директна червен флаг</option><option value="7">Директна черен флаг</option></select></div><div><label>Важност</label><select name="importance"><option value="0" selected="">Сив/син флаг</option><option value="1">Зелен флаг</option><option value="2">Червен флаг</option><option value="3">Черен флаг</option></select></div><div><button type="button" id="order">Задай</button></div>');
            $('#order').on('click', function() {
                if (confirm("Искате ли да добавите битката към заповедите?")) {
                    var country = $("input:radio[name='country']:checked").val();
                    var priority = $("select[name='priority'] option:selected").val();
                    var importance = $("select[name='importance'] option:selected").val();
                    var formData = new FormData();
                    formData.append('caption', region);
                    formData.append('link', location.href);
                    formData.append('priority', priority);
                    formData.append('importance', importance);
                    formData.append('country', country);
                    GM_xmlhttpRequest({
                            method: "POST",
                            url: serverUrl + "index.php",
                            data: formData,
                            onload: function(ret) {
                                if (ret.status == 200) {
                                    alert("Битката беше записана успешно.");
                                } else {
                                    alert("! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !\n\nНе си логнат в страницата, битката не беше записана!\n\n! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !");
                                }
                            },
                            onerror: function() {
                                alert("Проблем!");
                            }
                        });
                }
            })
}

function main() {
    $('#hpTopNews').before("<div id='adminlist'></div>");
    $.getJSON("/en/military/campaigns-new", function (b) {
        $.getJSON(serverUrl + "orders.php", function (o) {
            var orders = [];
            $.each(o, function(i, row) {
                var href = row.link.match(/[0-9]+$/);
                orders[href[0]] = href[0];
            });
            $.each(b.battles, function(i, battle) {
                if (battle.inv.id == myCountryId || battle.def.id == myCountryId) {
                    var href = battle.id
                    var round = b.battles[href].zone_id;
                    var reqTime = b.time;
                    var roundTime = reqTime - b.battles[href].start;
                    var date = new Date(null);
                    date.setSeconds(roundTime);
                    var bTime = date.toISOString().substr(12, 4);
                    var color = (orders[battle.id]) ? 'green' : 'red';
                    $("#adminlist").append("<div><a href='https://www.erepublik.com/en/military/battlefield/" + href + "' target='_blank' style='color: " + color + "'>(" + round + ") <b>" + bTime + "</b> " + battle.region.name + "</a></div>");
                }
            })
        })
    })

}

(/^https:\/\/www\.erepublik\.com\/[a-z]{2}$/) && main();
/military\/battlefield/.test(location.href) && battle();
