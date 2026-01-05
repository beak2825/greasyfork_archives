// ==UserScript==
// @name        Erepublik Epics
// @include     *www.erepublik.com/*
// @version     0.24
// @description Epic battles monitor
// @grant       GM_addStyle
// @grant       unsafeWindow
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/23261/Erepublik%20Epics.user.js
// @updateURL https://update.greasyfork.org/scripts/23261/Erepublik%20Epics.meta.js
// ==/UserScript==
var $ = jQuery;
var timeout = 60e3;
var me = $('.user_name').text().trim();
var i = 0;
var myPrice = 9999;
var lowestPrice = 9999;
var pricer = 0;
var provider = "";
var epc = ["", "FSB", "Epic"];
var nefl = true;

function style(t) {
	$("head").append("<style>" + t + "</style>");
}

function main() {
	$("#epl").html('');
	$.getJSON("/en/military/campaigns-new", function (r) {
		var a = 0;
        var fl = true;
        $('#mybattles').html('');
        $.getJSON("/en/military/campaignsJson/citizen", function (j) {
            $.each(j.contributions, function (i, e) {
                var country = getKeyByValue(img_country, e.side_country_id);
                var flag = "<img src='https://www.erepublik.net/images/flags_png/S/" + country + ".png' alt=''>";
                $('#mybattles').append("<div><a href='https://erepublik.com/en/military/battlefield/" + e.battle_id + "'>" + flag + " D"+ e.division + ", " + r.battles[e.battle_id].region.name + "</a></div>");
            });
        });
		$('#epl').append("<div id='eps'></div>");
		$.each(r.battles, function (i, b) {
			fl = true;
			$.each(b.div, function (i, d) {
				if (typeof d.epic !== "undefined" && d.epic >= 1) {
					if (fl) {
						$('#eps').append("<div id='epid" + b.id + "'><p> &gt;&gt; <a href='/en/military/battlefield/" + b.id + "'>" + b.region.name + "</a></p></div>");
						fl = false;
					}
					$('#epid' + b.id).append("<div><b>div " + d.div + " " + epc[d.epic] + "</b></div>");
					nefl = false;
				}
			});
		});
		if (nefl) {
			$('#eps').append("<div id='ne'><p> No epics :-(</p></div>");
			fl = false;
		}
		if (/military\/battlefield/.test(location.href)) {
            var cCountry = unsafeWindow.erepublik.citizen.citizenshipCountryId;
            var cMU = unsafeWindow.erepublik.citizen.muId;
			$('#eps').append("<div class='div pointer'> <span title='Side' style='width: 16px; display: inline-block; text-align: center;'> S </span> <span title='Division'> D </span> <span title='Availability (Global / Locked for country/MU)'> L </span> Details</div>");
			var battleId = location.href.replace(/[^0-9]/g, '');
			$.each(r.battles[battleId].div, function (i, d) {
				if (typeof d.co.inv !== "undefined" || typeof d.co.def !== "undefined") {
                    var def = getKeyByValue(img_country, r.battles[battleId].def.id);
                    var inv = getKeyByValue(img_country, r.battles[battleId].inv.id);
                    var defFlag = "https://www.erepublik.net/images/flags_png/S/" + def + ".png";
                    var invFlag = "https://www.erepublik.net/images/flags_png/S/" + inv + ".png";
					$('#epl').append("<div id='eps" + a + "'></div>");
					if (typeof d.co.inv !== "undefined") {
						$.each(d.co.inv, function (i, cc) {
                            var lock = (cc.sub_mu != 0 && cc.sub_mu != cMU)|| (cc.sub_country != 0 && cc.sub_country != cCountry) ? ' &#128274;' : ' &#128154;';
							$('#eps' + a).append("<div class='div'><img src='" + invFlag +"' alt=''> " + d.div + lock + " <span>" + cc.reward + "/mil.</span><span>  / " + cc.threshold + "%</span><span>  / " + cc.budget + " cc </span></div>");
						});
					}
					if (typeof d.co.def !== "undefined") {
						$.each(d.co.def, function (i, cc) {
                            var lock = (cc.sub_mu != 0 && cc.sub_mu != cMU)|| (cc.sub_country != 0 && cc.sub_country != cCountry) ? ' &#128274;' : ' &#128154;';
							$('#eps' + a).append("<div class='div'><img src='" + defFlag +"' alt=''> " + d.div + lock + " <span>" + cc.reward + "/mil.</span><span>  / " + cc.threshold + "%</span><span>  / " + cc.budget + " cc </span></div>");
						});
					}
					a++;
				}
			});
            $("#maxhit").html();
            $.getJSON("/en/military/nbp-stats/" + battleId, function (r) {
                var maxHit = r.maxHit;
                if (typeof maxHit != 'undefined' && maxHit > 0) {
                    $('#maxhit').html("<div>Max hit: <b>" + maxHit + "</b></div>");
                }
            });
        }
	});
}
style("#epinf{z-index: 99999; position: absolute; top: 0; left: 0;margin: 7px;padding: 5px;border-radius: 3px;font-size: 11px;background-color:rgba(255,255,255,0.8);border:1px solid #999;box-shadow: 1px 1px 8px #aaaaaa;};");
style(".bb{font-weight: 700;}");
style(".div, #ne, #mybattles {border-bottom: 1px solid #666; margin-bottom: 4px;}");
style(".pointer {cursor: pointer}");
style(".div img {vertical-align: bottom;}");
style(".div span:first-of-type {font-weight: 700}");
style("#mybattles img{vertical-align: text-bottom;}");

$("body").after("<div id='epinf'><div id='epl'></div></div>");
$("#epl").after("<div>My contributions</div><div id='mybattles'></div><div id='maxhit'></div>");

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

var img_country = {
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
    "United-Kingdom": 29,
    Switzerland: 30,
    Netherlands: 31,
    Belgium: 32,
    Austria: 33,
    "Czech-Republic": 34,
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
    "South-Korea": 47,
    India: 48,
    Indonesia: 49,
    Australia: 50,
    "South-Africa": 51,
    "Republic-of-Moldova": 52,
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
    "Bosnia-Herzegovina": 69,
    Estonia: 70,
    Latvia: 71,
    Lithuania: 72,
    "North-Korea": 73,
    Uruguay: 74,
    Paraguay: 75,
    Bolivia: 76,
    Peru: 77,
    Colombia: 78,
    "Republic-of-Macedonia-FYROM": 79,
    Montenegro: 80,
    "Republic-of-China-Taiwan": 81,
    Cyprus: 82,
    Belarus: 83,
    "New-Zealand": 84,
    "Saudi-Arabia": 164,
    Egypt: 165,
    "United-Arab-Emirates": 166,
    Albania: 167,
    Georgia: 168,
    Armenia: 169,
    Nigeria: 170,
    Cuba: 171
};

main();

setInterval(function () {
	main();
}, 30e3);
