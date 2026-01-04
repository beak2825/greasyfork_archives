// ==UserScript==
// @name        Cheap BHs finder for erepublik
// @include     /^https:\/\/www\.erepublik\.com\/[a-z]{2}$/
// @version     0.31
// @description Find cheap BHs in ground divisions
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/380321/Cheap%20BHs%20finder%20for%20erepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/380321/Cheap%20BHs%20finder%20for%20erepublik.meta.js
// ==/UserScript==

var $ = jQuery;
var timeout = 60e3;
var minPoints = 1500;
var minDamage = [0, 1e6, 5e6, 8e6, 30e6];

function style(t) {
	$("head").append("<style>" + t + "</style>");
}

function nFormatter(num, digits = 0) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function getFlagById(id) {
    var country = getKeyByValue(img_country, id);
    return "<img src='https://www.erepublik.net/images/flags_png/S/" + country + ".png' alt=''>";
}

function main() {
	$("#epl").html('');
	$.getJSON("/en/military/campaigns-new", function (r) {
		var a = 0;
        var fl = true;
        $('#mybattles').html('');
        $('#epl').html('');
        $.getJSON("/en/military/campaignsJson/citizen", function (j) {
            $.each(j.contributions, function (i, e) {
                var country = getKeyByValue(img_country, e.side_country_id);
                var flag = "<img src='https://www.erepublik.net/images/flags_png/S/" + country + ".png' alt=''>";
                $('#mybattles').append("<div><a href='https://erepublik.com/en/military/battlefield/" + e.battle_id + "'>" + flag + " D"+ e.division + ", " + r.battles[e.battle_id].region.name + "</a></div>");
            });
        });
		$('#epl').append("<div id='eps'></div>");
		$.each(r.battles, function (i, b) {
            if (Object.keys(b.div).length == 1) return; // въздух
            var domPts = [0];
            $.each(b.div, function (n, d) {
                domPts[d.div] = d.dom_pts.inv > d.dom_pts.def ? d.dom_pts.inv : d.dom_pts.def;
            });
            var sides = [b.inv.id, b.def.id];
            var zoneId = b.zone_id;
            var zones = [];
            $.each(b.div, function(i, z) {
                zones[z.div] = z.id;
            });
            var divs = [1, 2, 3, 4];
            if ((domPts[1] > minPoints && domPts[1] < 1800) || (domPts[2] > minPoints && domPts[2] < 1800) || (domPts[3] > minPoints && domPts[3] < 1800) || (domPts[4] > minPoints && domPts[4] < 1800)) {
                $.getJSON("/en/military/nbp-stats/" + b.id, function(rb) {
                    $.each(divs, function(i, div) {
                        $.each(sides, function(i, side) {
                            var damage = 0;
                            if (typeof(rb.stats.current[zoneId][div]) != 'undefined' && typeof(rb.stats.current[zoneId][div][side]) != 'undefined') {
                                damage = rb.stats.current[zoneId][div][side][zones[div]].top_damage[0].damage;
                            }
                            if (minDamage[div] > damage && domPts[div] < 1800) {
                                $('#eps').append("<div id='epid" + b.id + "'><p>" + getFlagById(side) + "<a href='/en/military/battlefield/" + b.id + "'>" + b.region.name + " - (" + div + ") " + domPts[div] + " <b>" + nFormatter(damage) + "</b></a></p></div>");
                            }
                        })
                    })
                })
            }
		});
	});
}
style("#epinf{z-index: 99999; position: absolute; top: 0; left: 0;margin: 7px;padding: 5px;border-radius: 3px;font-size: 11px;background-color:rgba(255,255,255,1);border:1px solid #999;box-shadow: 1px 1px 8px #aaaaaa;};");
style(".bb{font-weight: 700;}");
style(".div, #ne, #mybattles {border-bottom: 1px solid #666; margin-bottom: 4px;}");
style(".pointer {cursor: pointer}");
style("#eps div img, .div img {vertical-align: bottom;}");
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
}, timeout);
