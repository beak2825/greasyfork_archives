// ==UserScript==
// @name         Davet Scripti
// @version      0.1.3
// @author       Anthony Lutz
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        htt*://*.popmundo.com/World/Popmundo.aspx/Artist/InviteArtist/*
// @grant        none
// @namespace https://greasyfork.org/users/6949
// @description Davet scriptidir bu.
// @downloadURL https://update.greasyfork.org/scripts/29716/Davet%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/29716/Davet%20Scripti.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$('#ctl00_cphLeftColumn_ctl01_ddlVenues').attr('onchange', '');

var pinput = $('#ctl00_cphLeftColumn_ctl01_txtTicketPrice');
var locale = $('ctl00_cphLeftColumn_ctl01_ddlVenues');
var addhtml = '<img src="http://www.popmundo.com/Static/Icons/star.png" id="pget" style="margin-right: 3px; cursor: pointer; vertical-align: middle; position: relative; top: -3px;">';

var llink = window.location.href;

var pos = llink.lastIndexOf("/");

var artistid = llink.substr(pos+1);
var server = '8' + llink.charAt(8);

var famelink = '/World/Popmundo.aspx/Artist/Popularity/' + artistid;

$(addhtml).insertBefore(pinput);

$("#pget").click(function() {
    var locale = document.getElementById("ctl00_cphLeftColumn_ctl01_ddlVenues");
    var options = locale.getElementsByTagName("option");
    var optionHTML = options[locale.selectedIndex].text;
    var lastpos = optionHTML.lastIndexOf("(") + 1;
    var lastpos2 = optionHTML.lastIndexOf(")");
    var city = optionHTML.substring(lastpos, lastpos2);

    $.ajax({
        method: 'POST',
        url: famelink
    }).done(function (response) {
        txt = response;
            if (txt.indexOf(city) > 0) {
                var tpos = txt.indexOf(city + "</a>");
                txt = txt.substr(tpos);
                tpos = txt.indexOf("title=");

                txt = txt.substr(tpos);
                tpos = txt.indexOf('">') + 2;
                txt = txt.substr(tpos);
                tpos = txt.indexOf("</");
                var fame = txt.substr(0, tpos);
                var price = "0";
                if (fame == "gerçekten berbat" || fame == "truly abysmal") { price = "5"; }
                if (fame == "berbat" || fame == "abysmal") { price = "6"; }
                if (fame == "yavan" || fame == "bottom dwelling") { price = "7"; }
                if (fame == "korkunç" || fame == "horrendous") { price = "8"; }
                if (fame == "iğrenç" || fame == "dreadful") { price = "9"; }
                if (fame == "çok kötü" || fame == "terrible") { price = "10"; }
                if (fame == "zayıf" || fame == "poor") { price = "12"; }
                if (fame == "ortalama altı" || fame == "below average") { price = "15"; }
                if (fame == "vasat" || fame == "mediocre") { price = "17"; }
                if (fame == "ortalama üstü" || fame == "above average") { price = "20"; }
                if (fame == "düzgün" || fame == "decent") { price = "30"; }
                if (fame == "hoş" || fame == "nice") { price = "35"; }
                if (fame == "çok hoş" || fame == "pleasant") { price = "40"; }
                if (fame == "iyi" || fame == "good") { price = "45"; }
                if (fame == "çok iyi" || fame == "sweet") { price = "50"; }
                if (fame == "şahane" || fame == "splendid") { price = "55"; }
                if (fame == "fevkalade" || fame == "awesome") { price = "60"; }
                if (fame == "harika" || fame == "great") { price = "65"; }
                if (fame == "müthiş" || fame == "terrific") { price = "70"; }
                if (fame == "harikulade" || fame == "wonderful") { price = "75"; }
                if (fame == "inanılmaz" || fame == "incredible") { price = "80"; }
                if (fame == "mükemmel" || fame == "perfect") { price = "85"; }
                if (fame == "çığır açan" || fame == "revolutionary") { price = "88"; }
                if (fame == "akla zarar" || fame == "mind melting") { price = "90"; }
                if (fame == "yeri göğü inleten" || fame == "earth shaking") { price = "95"; }

                $('#ctl00_cphLeftColumn_ctl01_txtTicketPrice').val(price);
            }
    });
});