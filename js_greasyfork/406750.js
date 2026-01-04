// ==UserScript==
// @name         ÖPNV Auswertung
// @namespace    https://greasyfork.org/users/305651
// @version      1.14
// @description  Auswertung für ÖPNV-Daten aus Siemens-, Yunex- und Stührenberg-Geräten
// @author       Ralf Beckebans
// @match        file:///*.txt
// @match        file:///*.TXT
// @match        file:///*.csv
// @match        file:///*.CSV
// @match        file:///*.pub2
// @match        file:///*.PUB2
// @match        file:///*.log
// @match        file:///*.LOG
// @match        file:///*.pu2
// @match        file:///*.PU2
// @downloadURL https://update.greasyfork.org/scripts/406750/%C3%96PNV%20Auswertung.user.js
// @updateURL https://update.greasyfork.org/scripts/406750/%C3%96PNV%20Auswertung.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function oepnv_auswertung() {

        var inhalt = document.body.getElementsByTagName('pre')[0];

        var load_style = document.createElement('style');
        load_style.type = 'text/css';
        load_style.innerHTML = '.seite-auswertung { display: flex;flex-direction: column;margin: 0 auto;width: 75%;font-family: Arial;font-size: 20px;line-height: 1.4;cursor: default; } .ueberschrift { margin: 40px 0px;text-align: center;font-weight: bold;font-size: 25px; } .zeitraum { margin: -20px 0px 40px 0px;text-align: center; } .tabelle-kopf { display: flex;flex-direction: row;padding: 10px;padding-left: 50px;margin-bottom: 20px;background-color: lightgray;border-radius: 10px; } .meldepunkte-reihe { display: flex;flex-direction: row;padding: 5px;padding-left: 50px;border-radius: 10px;background-color: white;white-space: nowrap; } .meldepunkte-reihe:hover { background-color: lightgray; } .width10 { width: 10%; } .width15 { width: 15%; } .width20 { width: 20%; } .width25 { width: 25%; } .width30 { width: 30%; } .datei { padding-top: 100px;text-align: center;font-weight: bold; } #erweitert-anzeigen { cursor: pointer; } #datei-link { padding: 30px;cursor: pointer; } ';
        document.head.appendChild(load_style);

        if(inhalt) {

            var meldepunkte_array = []; //Array von Arrays mit Meldepunkt, Linie, Kurs, Route
            var meldepunkt = '';
            var meldepunkt0 = '';
            var linie = '';
            var kurs = '';
            var datum1 = '';
            var uhrzeit1 = '';
            var datum2 = '';
            var uhrzeit2 = '';

            function zeichen_einfuegen(position, zeichen, string) {
                return string.substring(0,position) + zeichen + string.substring(position,string.length);
            }

            if(inhalt.innerHTML.slice(0, 16) == 'Dieses File enth') { // M/MS-Geräte: TAE Statistik

                inhalt.innerHTML.toString().split('\n').forEach(tae_auswerten);
                function tae_auswerten(item, index) {

                    function bakennummer_umwandeln(bakennr) {
                        bakennr = bakennr.replace(/&colon;/gi, 'A');
                        bakennr = bakennr.replace(/&semi;/gi, 'B');
                        bakennr = bakennr.replace(/&lt;/gi, 'C');
                        bakennr = bakennr.replace(/&equals;/gi, 'D');
                        bakennr = bakennr.replace(/&gt;/gi, 'E');
                        bakennr = bakennr.replace(/&quest;/gi, 'F');
                        bakennr = bakennr.replace(/&percnt;/gi, 'X');

                        bakennr = bakennr.replace(/:/gi, 'A');
                        bakennr = bakennr.replace(/</gi, 'C');
                        bakennr = bakennr.replace(/=/gi, 'D');
                        bakennr = bakennr.replace(/>/gi, 'E');
                        bakennr = bakennr.replace(/\?/gi, 'F');
                        bakennr = bakennr.replace(/%/gi, 'X');
                        bakennr = bakennr.replace(/;/gi, 'B'); // am Ende, da ; sonst schon den HTML Code ersetzt
                        return bakennr;
                    }

                    if(item.slice(8, 12) == ' um ' && item.slice(20, 24) == ' MP:' && item.length == 60) { // Textdatei
                        if(!datum1 || !uhrzeit1) {
                            datum1 = item.slice(0, 8);
                            uhrzeit1 = item.slice(12, 20);
                        } else {
                            if(datum1 != item.slice(0, 8) || uhrzeit1 != item.slice(12, 20)) {
                                datum2 = item.slice(0, 8);
                                uhrzeit2 = item.slice(12, 20);
                            }
                        }
                        meldepunkt = (item.slice(24, 29) / 4).toString();
                        meldepunkte_array.push([meldepunkt,item.slice(32, 35),item.slice(38, 40),item.slice(43, 46)]);
                    } else {
                        item = bakennummer_umwandeln(item);
                        if(item.slice(0, 2) == '  ' && item.slice(6, 9) == '   ' && item.length == 36) { // Rohdaten
                            if(!datum1 || !uhrzeit1) {
                                datum1 = item.slice(9, 15);
                                datum1 = zeichen_einfuegen(2,'.',datum1);
                                datum1 = zeichen_einfuegen(5,'.',datum1);
                                uhrzeit1 = item.slice(15, 21);
                                uhrzeit1 = zeichen_einfuegen(2,':',uhrzeit1);
                                uhrzeit1 = zeichen_einfuegen(5,':',uhrzeit1);
                            } else {
                                if(datum1 != item.slice(9, 15) || uhrzeit1 != item.slice(15, 21)) {
                                    datum2 = item.slice(9, 15);
                                    datum2 = zeichen_einfuegen(2,'.',datum2);
                                    datum2 = zeichen_einfuegen(5,'.',datum2);
                                    uhrzeit2 = item.slice(15, 21);
                                    uhrzeit2 = zeichen_einfuegen(2,':',uhrzeit2);
                                    uhrzeit2 = zeichen_einfuegen(5,':',uhrzeit2);
                                }
                            }
                            var bakennummer_hex = item.slice(28, 32);
                            var bakennummer_dez = parseInt(bakennummer_hex, 16);
                            meldepunkt = (bakennummer_dez / 4).toString();
                            meldepunkte_array.push([meldepunkt,item.slice(22, 25),item.slice(32, 34),item.slice(25, 28)]);

                            // zum Test: alert(bakennummer_hex + ' - ' + bakennummer_dez + ' - ' + (bakennummer_dez / 4) + ' - ' + meldepunkt);
                        }


                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 13) == 'ÖPNV-Speicher') { // C-Geräte: ÖPNV-Speicher

                inhalt.innerHTML.toString().split('\n').forEach(oepnv_speicher_auswerten);
                function oepnv_speicher_auswerten(item, index) {

                    if(item.slice(5, 6) == ' ' && item.slice(14, 15) == ' ' && item.slice(20, 21) == ' ' && item.slice(26, 27) == ' ' && item.slice(30, 31) == ' ' && item.slice(34, 35) == ' ' && (item.slice(35, 36) == '-' || item.slice(35, 36) == '+') && item.length == 65) {
                        if(!datum1 || !uhrzeit1) {
                            datum1 = item.slice(0, 5);
                            uhrzeit1 = item.slice(6, 14);
                        } else {
                            if(datum1 != item.slice(0, 5) || uhrzeit1 != item.slice(6, 14)) {
                                datum2 = item.slice(0, 5);
                                uhrzeit2 = item.slice(6, 14);
                            }
                        }
                        if(item.slice(15, 16) == '0') { meldepunkt0 = '0'; } else { meldepunkt0 = ''; }
                        meldepunkt = meldepunkt0 + (item.slice(15, 20) / 4).toString();
                        meldepunkte_array.push([meldepunkt,item.slice(21, 24),item.slice(24, 26),item.slice(27, 30)]);
                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 18) == 'ÖPNV-Rohtelegramme') { // C-Geräte: ÖPNV-Rohtelegramme

                inhalt.innerHTML.toString().split('\n').forEach(oepnv_rohtelegramme_auswerten);
                function oepnv_rohtelegramme_auswerten(item, index) {

                    if(item.slice(8, 11) == ' - ' && item.length == 99) {
                        if(!datum1 || !uhrzeit1) {
                            datum1 = item.slice(0, 8);
                            uhrzeit1 = item.slice(11, 19);
                        } else {
                            if(datum1 != item.slice(0, 8) || uhrzeit1 != item.slice(11, 19)) {
                                datum2 = item.slice(0, 8);
                                uhrzeit2 = item.slice(11, 19);
                            }
                        }
                        if(item.slice(38, 39) == '0') { meldepunkt0 = '0'; } else { meldepunkt0 = ''; }
                        meldepunkt = meldepunkt0 + (item.slice(38, 43) / 4).toString();
                        meldepunkte_array.push([meldepunkt,item.slice(45, 48),item.slice(50, 53),item.slice(55, 58)]);
                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 62) == 'time;ms;type;number;name;rpnumber;line;route;trip;source;error') { // sX-Geräte: CSV Datei

                inhalt.innerHTML.toString().split('\n').forEach(csv_auswerten);
                function csv_auswerten(item, index) {

                    var csv_split = item.split(';');
                    if(csv_split[10] == 'OK') {
                        if(!datum1 || !uhrzeit1) {
                            datum1 = csv_split[0].slice(0, 10);
                            uhrzeit1 = csv_split[0].slice(11, 19);
                        } else {
                            if(datum1 != csv_split[0].slice(0, 10) || uhrzeit1 != csv_split[0].slice(11, 19)) {
                                datum2 = csv_split[0].slice(0, 10);
                                uhrzeit2 = csv_split[0].slice(11, 19);
                            }
                        }
                        if(csv_split[5].slice(0, 1) == '0') { meldepunkt0 = '0'; } else { meldepunkt0 = ''; }
                        meldepunkt = meldepunkt0 + (csv_split[5] / 4).toString();
                        meldepunkte_array.push([meldepunkt,csv_split[6],csv_split[8],csv_split[7]]);
                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 14) == ':PUB VERSION=2') { // sX-Geräte: PUB2 Datei + VSR Export: PU2 Datei

                inhalt.innerHTML.toString().split('         ').forEach(pub2_auswerten);
                function pub2_auswerten(item, index) {

                    if((item.slice(46, 47) == '+' || item.slice(46, 47) == '-') && item.length == 76) {
                        if(!datum1 || !uhrzeit1) {
                            datum1 = item.slice(11, 16);
                            uhrzeit1 = item.slice(17, 25);
                        } else {
                            if(datum1 != item.slice(11, 16) || uhrzeit1 != item.slice(17, 25)) {
                                datum2 = item.slice(11, 16);
                                uhrzeit2 = item.slice(17, 25);
                            }
                        }
                        if(item.slice(26, 27) == '0') { meldepunkt0 = '0'; } else { meldepunkt0 = ''; }
                        meldepunkt = meldepunkt0 + (item.slice(26, 31) / 4).toString();
                        meldepunkte_array.push([meldepunkt,item.slice(32, 35),item.slice(35, 37),item.slice(38, 41)]);
                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 19) == 'Datum / Zeit,Typ,MP') { // Stührenberg-Geräte: log Datei - Empfang

                inhalt.innerHTML.toString().split('\n').forEach(st_empfang_auswerten);
                function st_empfang_auswerten(item, index) {

                    var st_empfang_split = item.split(',');
                    if(st_empfang_split[1] == 'R09.16') {
                        if(!datum2 || !uhrzeit2) {
                            datum2 = st_empfang_split[0].slice(0, 8);
                            uhrzeit2 = st_empfang_split[0].slice(9, 17);
                        } else {
                            if(datum2 != st_empfang_split[0].slice(0, 8) || uhrzeit2 != st_empfang_split[0].slice(9, 17)) {
                                datum1 = st_empfang_split[0].slice(0, 8);
                                uhrzeit1 = st_empfang_split[0].slice(9, 17);
                            }
                        }
                        var meldepunkt_hex_dezimal = st_empfang_split[2].split('/');
                        meldepunkt = (meldepunkt_hex_dezimal[1] / 4).toString();
                        meldepunkte_array.push([meldepunkt,st_empfang_split[6],st_empfang_split[7],st_empfang_split[8]]);
                    }

                }

            }


            if(inhalt.innerHTML.slice(0, 20) == 'Datum / Zeit,Aktion,') { // Stührenberg-Geräte: log Datei - Aktion

                inhalt.innerHTML.toString().split('\n').forEach(st_aktion_auswerten);
                function st_aktion_auswerten(item, index) {

                    var st_aktion_split = item.split(',');
                    if(st_aktion_split[3] == 'R09.16') {
                        if(!datum2 || !uhrzeit2) {
                            datum2 = st_aktion_split[0].slice(0, 8);
                            uhrzeit2 = st_aktion_split[0].slice(9, 17);
                        } else {
                            if(datum2 != st_aktion_split[0].slice(0, 8) || uhrzeit2 != st_aktion_split[0].slice(9, 17)) {
                                datum1 = st_aktion_split[0].slice(0, 8);
                                uhrzeit1 = st_aktion_split[0].slice(9, 17);
                            }
                        }
                        var meldepunkt_hex_dezimal = st_aktion_split[4].split('/');
                        meldepunkt = (meldepunkt_hex_dezimal[1] / 4).toString();
                        meldepunkte_array.push([meldepunkt,st_aktion_split[8],st_aktion_split[8],st_aktion_split[10]]);
                    }

                }

            }


            function multiDimensionalUnique(arr) {
                var uniques = [];
                var itemsFound = {};
                for(var i = 0, l = arr.length; i < l; i++) {
                    var stringified = JSON.stringify(arr[i]);
                    if(itemsFound[stringified]) { continue; }
                    uniques.push(arr[i]);
                    itemsFound[stringified] = true;
                }
                return uniques;
            }


            var meldepunkte_array_einfach = JSON.parse(JSON.stringify(meldepunkte_array));
            var meldepunkte_array_unique_einfach = [];
            meldepunkte_array_einfach.forEach((linie_kurs_route) => {
                linie_kurs_route.pop(1);
                linie_kurs_route.pop(2);
                linie_kurs_route.pop(3);
            });
            // [0] asc
            meldepunkte_array_unique_einfach = multiDimensionalUnique(meldepunkte_array_einfach).sort(function (a, b) { return a[0] - b[0] });


            var meldepunkte_array_erweitert = JSON.parse(JSON.stringify(meldepunkte_array));
            var meldepunkte_array_unique_erweitert = [];
            // [0] asc, [1] asc, [2] asc, [3] asc
            meldepunkte_array_unique_erweitert = multiDimensionalUnique(meldepunkte_array_erweitert).sort(function (a, b) {
                return (a[0] < b[0]) ? -1 : (a[0] == b[0]) ?
                    (a[1] - b[1]) || (a[2] - b[2]) || (a[3] - b[3]) : 1;
            });


            var meldepunkte_einfach_text = '';
            var meldepunkte_erweitert_text = '';
            function meldepunkte_anzeigen(item, index) {

                var item_meldepunkt = item[0];
                var item_linie = item[1];
                var item_kurs = item[2];
                var item_route = item[3];

                if(item_meldepunkt != 0) {

                    var meldepunkt_text = 'unbekannt';
                    meldepunkt_text = parseFloat(item_meldepunkt).toFixed(2);

                    var bake_text = 'unbekannt';
                    bake_text = (parseFloat(item_meldepunkt).toFixed(2))*4;

                    var kreuzung_text = 'unbekannt';
                    kreuzung_text = parseInt(item_meldepunkt - parseInt(parseInt(parseInt(item_meldepunkt) / 1000)*1000));

                    var richtung_text = 'unbekannt';
                    var richtung = parseInt(parseInt(item_meldepunkt) / 1000);
                    if(richtung == 1) { richtung_text = '1 - Geradeaus'; }
                    if(richtung == 2) { richtung_text = '2 - Geradeaus'; }
                    if(richtung == 3) { richtung_text = '3 - Geradeaus'; }
                    if(richtung == 4) { richtung_text = '4 - Geradeaus'; }
                    if(richtung == 5) { richtung_text = '1 - Linksabbieger'; }
                    if(richtung == 6) { richtung_text = '2 - Linksabbieger'; }
                    if(richtung == 7) { richtung_text = '3 - Linksabbieger'; }
                    if(richtung == 8) { richtung_text = '4 - Linksabbieger'; }
                    if(richtung == 9) { richtung_text = '1 - Rechtsabbieger'; }
                    if(richtung == 10) { richtung_text = '2 - Rechtsabbieger'; }
                    if(richtung == 11) { richtung_text = '3 - Rechtsabbieger'; }
                    if(richtung == 12) { richtung_text = '4 - Rechtsabbieger'; }
                    if(richtung == 0) { richtung_text = '1 - Sonderfahrspur'; }
                    if(richtung == 13) { richtung_text = '2 - Sonderfahrspur'; }
                    if(richtung == 14) { richtung_text = '3 - Sonderfahrspur'; }
                    if(richtung == 15) { richtung_text = '4 - Sonderfahrspur'; }

                    var melder_text = 'unbekannt';
                    var melder = item_meldepunkt - parseInt(item_meldepunkt);
                    if(melder == 0) { melder_text = 'Erstanmelder'; }
                    if(melder == 0.25) { melder_text = 'Wiederholer'; }
                    if(melder == 0.5) { melder_text = 'Abmelder'; }
                    if(melder == 0.75) { melder_text = 'T&uuml;rschlie&szlig;er'; }

                    if(item_linie) {
                        var linie_text = 'unbekannt';
                        if(item_linie) { linie_text = item_linie; }

                        var kurs_text = 'unbekannt';
                        if(item_kurs) { kurs_text = item_kurs; }

                        var route_text = 'unbekannt';
                        if(item_route) { route_text = item_route; }

                        var anzahl_text_erweitert = 'unbekannt';
                        anzahl_text_erweitert = meldepunkte_array_erweitert.filter(i => i[0] === item_meldepunkt && i[1] === item_linie && i[2] === item_kurs && i[3] === item_route).length;

                        meldepunkte_erweitert_text += '<div class="meldepunkte-reihe erweitert" title="Meldepunkt: ' + meldepunkt_text + '" data-bake="' + bake_text + '" data-kreuzung="' + kreuzung_text + '" data-richtung="' + richtung + '" data-melder="' + melder_text + '" data-linie="' + linie_text + '" data-kurs="' + kurs_text + '" data-route="' + route_text + '"><div class="width15">' + bake_text + '</div><div class="width10">' + kreuzung_text + '</div><div class="width20">' + richtung_text + '</div><div class="width15">' + melder_text + '</div><div class="width10">' + linie_text + '</div><div class="width10">' + kurs_text + '</div><div class="width10">' + route_text + '</div><div class="width10">' + anzahl_text_erweitert + '</div></div>';
                    } else {
                        var anzahl_text_einfach = 'unbekannt';
                        var anzahl_text_timeout = 0;
                        var anzahl_text_timeout_string = '';
                        anzahl_text_einfach = meldepunkte_array_einfach.filter(i => i[0] === item_meldepunkt).length;
                        anzahl_text_timeout = meldepunkte_array_erweitert.filter(i => i[0] === item_meldepunkt && i[1] === '999' && i[2] === '99').length;
                        if(anzahl_text_timeout != 0) { anzahl_text_timeout_string = ' (+ ' + meldepunkte_array_erweitert.filter(i => i[0] === item_meldepunkt && i[1] === '999' && i[2] === '99').length + ' TO)'; }

                        meldepunkte_einfach_text += '<div class="meldepunkte-reihe einfach" title="Meldepunkt: ' + meldepunkt_text + '" data-bake="' + bake_text + '" data-kreuzung="' + kreuzung_text + '" data-richtung="' + richtung + '" data-melder="' + melder_text + '"><div class="width20" data-bake="' + bake_text + '">' + bake_text + '</div><div class="width15" data-kreuzung="' + kreuzung_text + '">' + kreuzung_text + '</div><div class="width25" data-richtung="' + richtung + '">' + richtung_text + '</div><div class="width25" data-melder="' + melder_text + '">' + melder_text + '</div><div class="width15">' + (anzahl_text_einfach - anzahl_text_timeout) + anzahl_text_timeout_string + '</div></div>';
                    }
                }

            }
            meldepunkte_array_unique_einfach.forEach(meldepunkte_anzeigen);
            meldepunkte_array_unique_erweitert.forEach(meldepunkte_anzeigen);


            if(meldepunkte_einfach_text && meldepunkte_erweitert_text) {
                inhalt.setAttribute('style', 'display: none;');

                var zeitraum_text = '';
                if(datum1 && uhrzeit1 && datum2 && uhrzeit2) {
                    zeitraum_text = '<div class="zeitraum">vom ' + datum1 + ' - ' + uhrzeit1 + ' Uhr bis ' + datum2 + ' - ' + uhrzeit2 + ' Uhr</div>';
                } else {
                    if(datum1 && uhrzeit1) {
                        zeitraum_text = '<div class="zeitraum">vom ' + datum1 + ' - ' + uhrzeit1 + ' Uhr</div>';
                    } else {
                        if(datum2 && uhrzeit2) {
                            zeitraum_text = '<div class="zeitraum">vom ' + datum2 + ' - ' + uhrzeit2 + ' Uhr</div>';
                        }
                    }
                }
                var anzahl_meldepunkte_einfach = meldepunkte_array_unique_einfach.length;
                var anzahl_meldepunkte_einfach_text = anzahl_meldepunkte_einfach + ' Meldepunkte gefunden';
                if(anzahl_meldepunkte_einfach == 1) { anzahl_meldepunkte_einfach_text = '1 Meldepunkt gefunden'; }
                var anzahl_meldepunkte_erweitert = meldepunkte_array_unique_erweitert.length;
                var anzahl_meldepunkte_erweitert_text = anzahl_meldepunkte_erweitert + ' Eintr&auml;ge gefunden';
                if(anzahl_meldepunkte_erweitert == 1) { anzahl_meldepunkte_erweitert_text = '1 Eintrag gefunden'; }
                var header_einfach = '';
                var header_erweitert = '';
                header_einfach = '<div class="seite-auswertung" id="auswertung-einfach"><div class="ueberschrift">' + anzahl_meldepunkte_einfach_text + '</div>' + zeitraum_text + '<div class="tabelle-kopf"><div class="width20">Bake</div><div class="width15">Kreuzung</div><div class="width25">Richtung</div><div class="width25">Melder</div><div class="width15">Anzahl</div></div>' + meldepunkte_einfach_text + '</div>';
                header_erweitert = '<div class="seite-auswertung" id="auswertung-erweitert" style="display: none;"><div class="ueberschrift">' + anzahl_meldepunkte_erweitert_text + '</div>' + zeitraum_text + '<div class="tabelle-kopf"><div class="width15">Bake</div><div class="width10">Kreuzung</div><div class="width20">Richtung</div><div class="width15">Melder</div><div class="width10">Linie</div><div class="width10">Kurs</div><div class="width10">Route</div><div class="width10">Anzahl</div></div>' + meldepunkte_erweitert_text + '</div>';
                inhalt.insertAdjacentHTML('beforebegin', header_einfach + header_erweitert + '<div class="seite-auswertung datei"><a id="erweitert-anzeigen">Erweiterte Daten anzeigen</a><a id="datei-link">Datei anzeigen</a></div>');


                // Gleiche Daten bei einfacher Ansicht markieren
                var meldepunkte_reihe_einfach = document.getElementsByClassName('meldepunkte-reihe einfach');
                var highlight_einfach_kreuzung = function() {
                    var kreuzung = this.getAttribute('data-kreuzung');
                    if(this.parentNode.getAttribute('style')) {
                        for(var lkr_remove = 0, lkr_remove_vergleich; !!(lkr_remove_vergleich=meldepunkte_reihe_einfach[lkr_remove]); lkr_remove++) {
                            var lkr_remove_kreuzung = lkr_remove_vergleich.getAttribute('data-kreuzung');
                            if(lkr_remove_kreuzung == kreuzung) { lkr_remove_vergleich.removeAttribute('style'); }
                        }
                    } else {
                        for(var lkr = 0, lkr_vergleich; !!(lkr_vergleich=meldepunkte_reihe_einfach[lkr]); lkr++) {
                            var lkr_kreuzung = lkr_vergleich.getAttribute('data-kreuzung');
                            if(lkr_kreuzung == kreuzung) { lkr_vergleich.style.background = 'aquamarine'; }
                        }
                    }
                };
                var highlight_einfach_richtung = function() {
                    var richtung = this.getAttribute('data-richtung');
                    if(this.parentNode.getAttribute('style')) {
                        for(var lkr_remove = 0, lkr_remove_vergleich; !!(lkr_remove_vergleich=meldepunkte_reihe_einfach[lkr_remove]); lkr_remove++) {
                            var lkr_remove_richtung = lkr_remove_vergleich.getAttribute('data-richtung');
                            if(lkr_remove_richtung == richtung) { lkr_remove_vergleich.removeAttribute('style'); }
                        }
                    } else {
                        for(var lkr = 0, lkr_vergleich; !!(lkr_vergleich=meldepunkte_reihe_einfach[lkr]); lkr++) {
                            var lkr_richtung = lkr_vergleich.getAttribute('data-richtung');
                            if(lkr_richtung == richtung) { lkr_vergleich.style.background = 'aquamarine'; }
                        }
                    }
                };
                var highlight_einfach_melder = function() {
                    var melder = this.getAttribute('data-melder');
                    if(this.parentNode.getAttribute('style')) {
                        for(var lkr_remove = 0, lkr_remove_vergleich; !!(lkr_remove_vergleich=meldepunkte_reihe_einfach[lkr_remove]); lkr_remove++) {
                            var lkr_remove_melder = lkr_remove_vergleich.getAttribute('data-melder');
                            if(lkr_remove_melder == melder) { lkr_remove_vergleich.removeAttribute('style'); }
                        }
                    } else {
                        for(var lkr = 0, lkr_vergleich; !!(lkr_vergleich=meldepunkte_reihe_einfach[lkr]); lkr++) {
                            var lkr_melder = lkr_vergleich.getAttribute('data-melder');
                            if(lkr_melder == melder) { lkr_vergleich.style.background = 'aquamarine'; }
                        }
                    }
                };
                for(var i_einfach = 0; i_einfach < meldepunkte_reihe_einfach.length; i_einfach++) {
                    meldepunkte_reihe_einfach[i_einfach].getElementsByTagName('div')[1].addEventListener('click', highlight_einfach_kreuzung, false);
                    meldepunkte_reihe_einfach[i_einfach].getElementsByTagName('div')[2].addEventListener('click', highlight_einfach_richtung, false);
                    meldepunkte_reihe_einfach[i_einfach].getElementsByTagName('div')[3].addEventListener('click', highlight_einfach_melder, false);
                }


                // Gleiche Daten bei erweiterter Ansicht markieren
                var meldepunkte_reihe_erweitert = document.getElementsByClassName('meldepunkte-reihe erweitert');
                var highlight = function() {
                    var linie = this.getAttribute('data-linie');
                    var kurs = this.getAttribute('data-kurs');
                    var route = this.getAttribute('data-route');
                    if(this.getAttribute('style')) {
                        for(var lkr_remove = 0, lkr_remove_vergleich; !!(lkr_remove_vergleich=meldepunkte_reihe_erweitert[lkr_remove]); lkr_remove++) {
                            var lkr_remove_linie = lkr_remove_vergleich.getAttribute('data-linie');
                            var lkr_remove_kurs = lkr_remove_vergleich.getAttribute('data-kurs');
                            var lkr_remove_route = lkr_remove_vergleich.getAttribute('data-route');
                            if(lkr_remove_linie == linie && lkr_remove_kurs == kurs & lkr_remove_route == route) { lkr_remove_vergleich.removeAttribute('style'); }
                        }
                    } else {
                        for(var lkr = 0, lkr_vergleich; !!(lkr_vergleich=meldepunkte_reihe_erweitert[lkr]); lkr++) {
                            var lkr_linie = lkr_vergleich.getAttribute('data-linie');
                            var lkr_kurs = lkr_vergleich.getAttribute('data-kurs');
                            var lkr_route = lkr_vergleich.getAttribute('data-route');
                            if(lkr_linie == linie && lkr_kurs == kurs & lkr_route == route) { lkr_vergleich.style.background = 'aquamarine'; }
                        }
                    }
                };
                for(var i_erweitert = 0; i_erweitert < meldepunkte_reihe_erweitert.length; i_erweitert++) {
                    meldepunkte_reihe_erweitert[i_erweitert].addEventListener('click', highlight, false);
                }

                // Link erweiterte Daten anzeigen
                document.getElementById('erweitert-anzeigen').addEventListener('click', function() { if(document.getElementById('erweitert-anzeigen').innerHTML == "Erweiterte Daten anzeigen") { document.getElementById('auswertung-einfach').setAttribute('style', 'display: none;'); document.getElementById('auswertung-erweitert').removeAttribute('style'); document.getElementById('erweitert-anzeigen').innerHTML = "Einfache Daten anzeigen"; } else { document.getElementById('auswertung-erweitert').setAttribute('style', 'display: none;'); document.getElementById('auswertung-einfach').removeAttribute('style'); document.getElementById('erweitert-anzeigen').innerHTML = "Erweiterte Daten anzeigen"; } }, false);

                // Link Datei anzeigen
                document.getElementById('datei-link').addEventListener('click', function() { if(document.getElementById('datei-link').innerHTML == "Datei anzeigen") { document.body.getElementsByTagName('pre')[0].removeAttribute('style'); document.getElementById('datei-link').innerHTML = "Datei ausblenden"; } else { document.body.getElementsByTagName('pre')[0].setAttribute('style', 'display: none;'); document.getElementById('datei-link').innerHTML = "Datei anzeigen"; } }, false);
            }

        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        oepnv_auswertung();
    } else {
        document.addEventListener('DOMContentLoaded', oepnv_auswertung, false);
    }

})();