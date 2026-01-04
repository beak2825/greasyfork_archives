// ==UserScript==
// @name         Tron_retrievecountryin
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       Yan Zhang
// @include      https://tron.f5net.com/sr/dashboard/*
// @include      https://tron.f5net.com/sr/owner/*
// @include      https://tron.f5net.com/sr/search/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388482/Tron_retrievecountryin.user.js
// @updateURL https://update.greasyfork.org/scripts/388482/Tron_retrievecountryin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var restrict = ["UNITED STATES", "UNITED KINGDOM", "AUSTRALIA", "NEW ZEALAND", "AUSTRIA", "BELGIUM", "BULGARIA", "CROATIA", "CYPRUS", "CZECH REPUBLIC", "DENMARK", "ESTONIA", "FINLAND", "FRANCE", "GERMANY", "GREECE", "HUNGARY", "IRELAND", "ITALY", "LATVIA", "LITHUANIA", "LUXEMBOURG", "MALTA", "NETHERLANDS", "POLAND", "ROMANIA", "SLOVAKIA", "SLOVENIA", "SPAIN", "SWEDEN", "CANADA"];
    var apcj = ["KOREA, REPUBLIC OF","CHINA", "INDIA", "INDONESIA", "PAKISTAN", "BANGLADESH", "JAPAN", "PHILIPPINES", "VIETNAM", "THAILAND", "MYANMAR", "SOUTH KOREA", "MALAYSIA", "NEPAL", "NORTH KOREA", "AUSTRALIA", "TAIWAN", "SRI LANKA", "CAMBODIA", "PAPUA NEW GUINEA", "LAOS", "SINGAPORE", "NEW ZEALAND", "MONGOLIA", "TIMOR LESTE", "FIJI", "BHUTAN", "SOLOMON ISLANDS", "MALDIVES", "BRUNEI", "VANUATU", "NEW CALEDONIA", "FRENCH POLYNESIA", "SAMOA", "GUAM", "KIRIBATI", "MICRONESIA", "TONGA", "MARSHALL ISLANDS", "NORTHERN MARIANA ISLANDS", "PALAU", "COOK ISLANDS", "TUVALU", "WALLIS AND FUTUNA", "NAURU", "NIUE", "TOKELAU", "HONG KONG", "MACAU"];
    var na = ["UNITED STATES","MEXICO","CANADA","GUATEMALA","CUBA","HAITI","DOMINICAN REPUBLIC","HONDURAS","EL SALVADOR","NICARAGUA","COSTA RICA","PANAMA","PUERTO RIC","JAMAICA","TRINIDAD AND TOBAGO","GUADELOUPE","MARTINIQUE","BAHAMAS","BELIZE","BARBADOS","SAINT LUCIA","SAINT VINCENT AND THE GRENADINES","UNITED STATES VIRGIN ISLANDS","GRENADA","ANTIGUA AND BARBUDA","DOMINICA","BERMUDA","CAYMAN ISLANDS","GREENLAND","SAINT KITTS AND NEVIS","SINT MAARTEN","TURKS AND CAICOS ISLANDS","SAINT MARTIN","BRITISH VIRGIN ISLANDS","CARIBBEAN NETHERLANDS","ANGUILLA","SAINT BARTHÉLEMY","SAINT PIERRE AND MIQUELON","MONTSERRAT","BRAZIL","COLOMBIA","ARGENTINA","PERU","VENEZUELA","CHILE","ECUADOR","BOLIVIA","PARAGUAY","URUGUAY","GUYANA","SURINAME","FRENCH GUIANA","FALKLAND ISLANDS"];
    var emea = ["ALBANIA","ALGERIA","ANDORRA","ANGOLA","AUSTRIA","BAHRAIN","BELARUS","BELGIUM","BENIN","BOSNIA AND HERZEGOVINA","BOTSWANA","BULGARIA","BURKINA FASO","BURUNDI","CAMEROON","CAPE VERDE","CENTRAL AFRICAN REPUBLIC","CHAD","COMOROS","CROATIA","CYPRUS","CZECH REPUBLIC","DEMOCRATIC REPUBLIC OF THE CONGO","DENMARK","DJIBOUTI","EGYPT","EQUATORIAL GUINEA","ERITREA","ESTONIA","ETHIOPIA","FAROE ISLANDS","FINLAND","FRANCE","GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GIBRALTAR","GREECE","GUERNSEY","GUINEA","GUINEA-BISSAU","HUNGARY","ICELAND","IRAN","IRAQ","IRELAND","ISLE OF MAN","ISRAEL","ITALY","IVORY COAST","JERSEY","JORDAN","KENYA","KUWAIT","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MACEDONIA","MADAGASCAR","MALAWI","MALI","MALTA","MAURITANIA","MAURITIUS","MOLDOVA","MONACO","MONTENEGRO","MOROCCO","MOZAMBIQUE","NAMIBIA","NETHERLANDS","NIGER","NIGERIA","NORWAY","OMAN","PALESTINE","POLAND","PORTUGAL","QATAR","ROMANIA","RWANDA","SAN MARINO","SAO TOME & PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA","SLOVAKIA","SLOVENIA","SOMALIA","SOUTH AFRICA","SPAIN","SUDAN","SWAZILAND","SWEDEN","SWITZERLAND","SYRIA","TANZANIA","TOGO","TUNISIA","TURKEY","UGANDA","UKRAINE","UNITED ARAB EMIRATES","UNITED KINGDOM","VATICAN CITY","WESTERN SAHARA","YEMEN","ZAMBIA","ZIMBABWE"];

    function retrievecontry(url, t = 0) {
        function proce(j) {
            var f = j["originator"] ? j["originator"]["data"].concat(j["owner"]["data"]) : j["data"];
            f = j["queue"] ? f.concat(j["queue"]["data"]) : f;
            var t5 = {};  // dict of sr ---> country
            var t6 = [];  // for ENE use
            if (t == 0) {    // this is not a ajax response
                f.forEach((i) => {
                    var sr = i["SR_Number"]? i["SR_Number"] : i["sr_number"];
                    var countryy = i["Country"]? i["Country"]: i["location_country"];
                    t5[sr] = countryy;
                    if (!i["Parent_SR_Number"]) {
                        t6.push(i["SR_Number"]);
                    }
                })
                $('.sr-list.queue > thead >tr').each((i, v) => {   // add 'Country table header'
                    var t2 = v.cells[2].cloneNode();
                    t2.innerText = "Country";
                    v.appendChild(t2);
                })
            } else {  //  this is a ajax response or search result
                f.forEach((i) => {
                    var sr = i["SR_Number"]? i["SR_Number"] : i["sr_number"];
                    var countryy = i["Country"]? i["Country"]: i["location_country"];
                    t5[sr] = countryy;
                    if (!i["parent_name"]) {
                        t6.push(i["sr_number"]);
                    }
                })
            }
            $('.sr-list.queue:not(#nseq) > tbody >tr').each((i, v) => {
                var t1 = v.insertCell(-1);
                var sr = $('.col-sr_number', v).text().trim();
                var country = t5[sr];
                t1.innerHTML = country;
                //				if (t6.indexOf(sr) >= 0) {
                //					v.style.backgroundColor = "#ebe8ab";
                //				}
                if (restrict.indexOf(country) >=0 ) {
                    v.style.backgroundColor = "#ebe8ab";
                }
            })
            //$('.sr-list').DataTable().destroy();
            //$('.sr-list').DataTable({
            //    "paging":   false,
            //    "info":     false
                //"order":    [[ 4, "asc" ]]
            //})
        }
        if (t) {   // this is a ajax response, process JSON response directly
            proce(t);
        } else {  // this page opens first time, restrive JSON and then process
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(j) {
                proce(j);
            });
        }

    }
    if (/\/dashboard\//.test(location.href) || /\/sr\/owner\/(ENE|NSE)/i.test(location.href)) {
        //retrievecontry('https://tron.f5net.com/sr/dashboard/?json=1');
        retrievecontry(location.href + "?json=1", 0);
    } else if (/\/sr\/search\//.test(location.href)) {
        retrievecontry(location.href + "&json=1",0)
    }
    $(document).ajaxComplete(function(e, x, s) {
        if (/urlize=1/.test(s.url)) {
            x.then(() => {
                retrievecontry(location.href + "&json=1", x.responseJSON);
            })
        }
    });
})();