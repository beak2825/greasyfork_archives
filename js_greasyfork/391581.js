// ==UserScript==
// @name         INFONIQA TIME Web - Saldenliste
// @namespace    https://greasyfork.org/users/305651
// @version      1.10
// @description  Diverse Optimierungen und Bereitschafts- bzw. Überstundenliste
// @author       Ralf Beckebans
// @match        https://timeweb.krz.de/TIME2010/Auswertungen/Saldenliste.aspx
// @match        https://timeweb.owl-it.de/TIME2010/Auswertungen/Saldenliste.aspx
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/391581/INFONIQA%20TIME%20Web%20-%20Saldenliste.user.js
// @updateURL https://update.greasyfork.org/scripts/391581/INFONIQA%20TIME%20Web%20-%20Saldenliste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function infoniqa_time_web_saldenliste() {

        var divcontainer = document.getElementById('divContainer');

        if(divcontainer) {

            // Einstellungen laden
            var setting_bereitschaft_erweitert = GM_getValue('setting_bereitschaft_erweitert', 0); // (name, default if empty)
            var setting_info_anzeigen = GM_getValue('setting_info_anzeigen', 1);
            var setting_zeiten_mit_abstand = GM_getValue('setting_zeiten_mit_abstand', 0);
            var setting_zeiten_ohne_sekunden = GM_getValue('setting_zeiten_ohne_sekunden', 0);
            var setting_design_hintergrund = GM_getValue('setting_design_hintergrund', '#808080');
            var setting_personalnummer = GM_getValue('setting_personalnummer', '12345');

            // Funktion - Einstellungen speichern
            function save_settings() {
                if(setting_bereitschaft_erweitert != document.getElementById('settings_setting_bereitschaft_erweitert').checked) { GM_setValue('setting_bereitschaft_erweitert', document.getElementById('settings_setting_bereitschaft_erweitert').checked); }
                if(setting_info_anzeigen != document.getElementById('settings_setting_info_anzeigen').checked) { GM_setValue('setting_info_anzeigen', document.getElementById('settings_setting_info_anzeigen').checked); }
                if(setting_zeiten_mit_abstand != document.getElementById('settings_setting_zeiten_mit_abstand').checked) { GM_setValue('setting_zeiten_mit_abstand', document.getElementById('settings_setting_zeiten_mit_abstand').checked); }
                if(setting_zeiten_ohne_sekunden != document.getElementById('settings_setting_zeiten_ohne_sekunden').checked) { GM_setValue('setting_zeiten_ohne_sekunden', document.getElementById('settings_setting_zeiten_ohne_sekunden').checked); }
                if(setting_design_hintergrund != document.getElementById('settings_setting_design_hintergrund').value) { GM_setValue('setting_design_hintergrund', document.getElementById('settings_setting_design_hintergrund').value); }
                if(setting_personalnummer != document.getElementById('settings_setting_personalnummer').value) { GM_setValue('setting_personalnummer', document.getElementById('settings_setting_personalnummer').value); }
            }

            // Funktion - Einstellungen ändern
            function change_settings() {
                if(!document.getElementById('settings')) {
                    var settings_setting_bereitschaft_erweitert_checked = '';
                    if(setting_bereitschaft_erweitert == 1) settings_setting_bereitschaft_erweitert_checked = 'checked="checked"';
                    var settings_setting_info_anzeigen_checked = '';
                    if(setting_info_anzeigen == 1) settings_setting_info_anzeigen_checked = 'checked="checked"';
                    var settings_setting_zeiten_mit_abstand_checked = '';
                    if(setting_zeiten_mit_abstand == 1) settings_setting_zeiten_mit_abstand_checked = 'checked="checked"';
                    var settings_setting_zeiten_ohne_sekunden_checked = '';
                    if(setting_zeiten_ohne_sekunden == 1) settings_setting_zeiten_ohne_sekunden_checked = 'checked="checked"';

                    var settings_div = '<div id="settings" style="background-color:lightgray; display:inline-block; width:50%; margin-left:25%; padding-top:5px; padding-bottom:5px; margin-top:10px; margin-bottom:10px;">';

                    settings_div += '<div style="text-align:center; margin-bottom:15px; margin-top:5px; font-weight:bold; font-size:16px;">Script-Einstellungen</div>';
                    settings_div += '<div style="float:right; margin-right:10px; margin-top:-37px; font-weight:bold; cursor:pointer;" onclick="close_settings();" title="Ohne &Auml;nderung schlie&szlig;en">&nbsp;&nbsp;&nbsp;X</div>';

                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Allgemeines</div>';
                    settings_div += '<div><label for="settings_setting_bereitschaft_erweitert" style="margin-left:30px; display:inline-block;">Erweiterte Ansicht der Bereitschaftsliste<input type="checkbox" id="settings_setting_bereitschaft_erweitert" ' + settings_setting_bereitschaft_erweitert_checked + ' style="margin-left:85px; border:0; vertical-align:middle;"></label></div>';
                    settings_div += '<div><label for="settings_setting_info_anzeigen" style="margin-left:30px; display:inline-block;">Info unter der Saldenliste anzeigen<input type="checkbox" id="settings_setting_info_anzeigen" ' + settings_setting_info_anzeigen_checked + ' style="margin-left:114px; border:0; vertical-align:middle;"></label></div>';
                    settings_div += '<div><label for="settings_setting_zeiten_mit_abstand" style="margin-left:30px; display:inline-block;">Zeiten mit Abstand anzeigen<input type="checkbox" id="settings_setting_zeiten_mit_abstand" ' + settings_setting_zeiten_mit_abstand_checked + ' style="margin-left:144px; border:0; vertical-align:middle;"></label></div>';
                    settings_div += '<div><label for="settings_setting_zeiten_ohne_sekunden" style="margin-left:30px; display:inline-block;">Zeiten ohne Sekunden anzeigen<input type="checkbox" id="settings_setting_zeiten_ohne_sekunden" ' + settings_setting_zeiten_ohne_sekunden_checked + ' style="margin-left:126px; border:0; vertical-align:middle;"></label></div>';

                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Design</div>';
                    settings_div += '<div><label for="settings_setting_design_hintergrund" style="margin-left:30px; display:inline-block;">Hintergrundfarbe<input type="color" id="settings_setting_design_hintergrund" value="' + setting_design_hintergrund + '" style="margin-left:199px; margin-bottom: 3px;border:0;"></label></div>';

                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Pers&ouml;nliche Daten</div>';
                    settings_div += '<div><label for="settings_setting_personalnummer" style="margin-left:30px; display:inline-block;">Personalnummer<input type="text" id="settings_setting_personalnummer" value="' + setting_personalnummer + '" style="margin-left:200px; margin-bottom: 3px;border:0; width:64px;"></label></div>';

                    settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block; text-align:center;"><button type="submit" id="settings_save_button">Speichern</button>&nbsp;<button type="reset" id="settings_reset_button">Eingaben zur&uuml;cksetzen</button>&nbsp;<button type="button" id="settings_reset_all_button">Alles auf Standard zur&uuml;cksetzen</button></div>';
                    settings_div += '</div>';
                    divcontainer.insertAdjacentHTML('beforebegin', settings_div);
                    window.scrollTo(0, 0);
                }

                // Funktion - Reset (Eingaben zurücksetzen)
                function reset_settings() {
                    document.getElementById('settings').remove();
                    change_settings();
                }

                // Funktion - Reset All (Alle Eingaben auf Standard zurücksetzen bzw. löschen)
                function reset_all_settings() {
                    let keys = GM_listValues();
                    for(let key of keys) {
                        GM_deleteValue(key);
                        // alert(key + ' gelöscht !');
                    }
                    window.scrollTo(0, 0);
                    location.reload();
                }

                document.getElementById('settings_save_button').addEventListener('click', save_settings, false);
                document.getElementById('settings_reset_button').addEventListener('click', reset_settings, false);
                document.getElementById('settings_reset_all_button').addEventListener('click', reset_all_settings, false);

            }

            // Einstellungen schließen
            var settings_close_script_start = document.createElement('script');
            var settings_close_script_function = document.createTextNode('function close_settings() { document.getElementById("settings").remove(); }');
            settings_close_script_start.appendChild(settings_close_script_function);
            document.head.appendChild(settings_close_script_start);

            // Script-Einstellungen Icon hinzufügen
            var settings_link = '<td align="center" style="color: white; background-color: black; cursor: pointer;" id="script_settings" title="Script-Einstellungen &ouml;ffnen"># # #</td>';
            var saldenliste_colspan = divcontainer.getElementsByClassName('Reportname')[0].getAttribute('colspan');
            divcontainer.getElementsByClassName('Reportname')[0].setAttribute('colspan', saldenliste_colspan - 1);
            divcontainer.getElementsByClassName('Reportname')[0].insertAdjacentHTML('afterend', settings_link);
            document.getElementById('script_settings').addEventListener('click', change_settings, false);


            if(setting_design_hintergrund !== null) {
                var divcontainer_oldstyle = divcontainer.getElementsByTagName('table')[0].getAttribute('style');
                divcontainer.getElementsByTagName('table')[0].setAttribute('style',divcontainer_oldstyle + 'background-color: ' + setting_design_hintergrund);
            }

            if(setting_zeiten_mit_abstand == 1) {
                var zeiten_mit_abstand0 = document.getElementsByClassName('Reportcell');
                for(var zma = 0, zeiten_mit_abstand; !!(zeiten_mit_abstand=zeiten_mit_abstand0[zma]); zma++) {
                    var zeiten_mit_abstand_oldstyle = zeiten_mit_abstand.getAttribute('style');
                    if(zeiten_mit_abstand_oldstyle !== null) {
                        zeiten_mit_abstand.setAttribute('style',zeiten_mit_abstand_oldstyle + 'padding: 2px;');
                    } else {
                        zeiten_mit_abstand.setAttribute('style','padding: 2px;');
                    }
                }
            }

            if(setting_zeiten_ohne_sekunden == 1) {
                var zeiten_ohne_sekunden0 = document.getElementsByClassName('Reportcell');
                for(var zos = 0, zeiten_ohne_sekunden; !!(zeiten_ohne_sekunden=zeiten_ohne_sekunden0[zos]); zos++) {
                    if(zeiten_ohne_sekunden.innerHTML != '&nbsp;' && zeiten_ohne_sekunden.innerHTML != '' && zeiten_ohne_sekunden.innerHTML != ' ') {
                        var zeiten_ohne_sekunden_array = zeiten_ohne_sekunden.innerHTML.split(':');
                        if(zeiten_ohne_sekunden_array[1] !== null && zeiten_ohne_sekunden_array[1] !== undefined) {
                            zeiten_ohne_sekunden.setAttribute('title', zeiten_ohne_sekunden.innerHTML);
                            zeiten_ohne_sekunden.innerHTML = zeiten_ohne_sekunden_array[0] + ':' + zeiten_ohne_sekunden_array[1];
                        }
                    }
                }
            }

            /*
            var hintergrundfarbe_reportname0 = document.getElementsByClassName('Reportname');
            for(var hfrn = 0, hintergrundfarbe_reportname; !!(hintergrundfarbe_reportname=hintergrundfarbe_reportname0[hfrn]); hfrn++) {
                hintergrundfarbe_reportname.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_criteria0 = document.getElementsByClassName('Criteria');
            for(var hfc = 0, hintergrundfarbe_criteria; !!(hintergrundfarbe_criteria=hintergrundfarbe_criteria0[hfc]); hfc++) {
                hintergrundfarbe_criteria.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_headercell0 = document.getElementsByClassName('Headercell');
            for(var hfhc = 0, hintergrundfarbe_headercell; !!(hintergrundfarbe_headercell=hintergrundfarbe_headercell0[hfhc]); hfhc++) {
                hintergrundfarbe_headercell.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_datecell0 = document.getElementsByClassName('Datecell');
            for(var hfdc = 0, hintergrundfarbe_datecell; !!(hintergrundfarbe_datecell=hintergrundfarbe_datecell0[hfdc]); hfdc++) {
                hintergrundfarbe_datecell.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_reportcell0 = document.getElementsByClassName('Reportcell');
            for(var hfrc = 0, hintergrundfarbe_reportcell; !!(hintergrundfarbe_reportcell=hintergrundfarbe_reportcell0[hfrc]); hfrc++) {
                hintergrundfarbe_reportcell.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_redcell0 = document.getElementsByClassName('RedCell');
            for(var hfredc = 0, hintergrundfarbe_redcell; !!(hintergrundfarbe_redcell=hintergrundfarbe_redcell0[hfredc]); hfredc++) {
                hintergrundfarbe_redcell.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_sumcell0 = document.getElementsByClassName('Sumcell');
            for(var hfsc = 0, hintergrundfarbe_sumcell; !!(hintergrundfarbe_sumcell=hintergrundfarbe_sumcell0[hfsc]); hfsc++) {
                hintergrundfarbe_sumcell.setAttribute('style','background-color: grey;');
            }

            var hintergrundfarbe_sumcellred0 = document.getElementsByClassName('SumcellRed');
            for(var hfscr = 0, hintergrundfarbe_sumcellred; !!(hintergrundfarbe_sumcellred=hintergrundfarbe_sumcellred0[hfscr]); hfscr++) {
                hintergrundfarbe_sumcellred.setAttribute('style','background-color: grey;');
            }
            */

            // Info anzeigen
            if(setting_info_anzeigen == 1) {
                document.getElementById('divContainer').insertAdjacentHTML('afterend', '<div id="info" style="font-size: 16px;font-family: Arial, Helvetica, sans-serif;text-align: center;"><br><br><span style="font-weight: bold;">Info Rufbereitschaft + &Uuml;berstunden</span><br><br>Gew&uuml;nschte Tage durch einen Klick auf den entsprechenden Tag oder die Kalenderwoche<br>ausw&auml;hlen und danach vorne das Wort "Datum" oder "KW" anklicken.<br><br>Achtung, die in der &Uuml;bersicht manuell eingegeben Daten werden nicht gespeichert.<br>Ausdruck als PDF nicht vergessen &#x1F609;</div>');
            }

            // Optionen und Daten einbinden
            if(setting_bereitschaft_erweitert == 1) {
                document.getElementById('divContainer').insertAdjacentHTML('afterend', '<input name="bereitschaft_erweitert" id="bereitschaft_erweitert" value="true" style="display: none;"><input name="personalnummer" id="personalnummer" value="' + setting_personalnummer + '" style="display: none;">');
            } else {
                document.getElementById('divContainer').insertAdjacentHTML('afterend', '<input name="bereitschaft_erweitert" id="bereitschaft_erweitert" value="false" style="display: none;"><input name="personalnummer" id="personalnummer" value="' + setting_personalnummer + '" style="display: none;">');
            }

            var script_sideload = " \n"
            + "            var bereitschaft_erweitert_head1 = \x27\x27;\n"
            + "            var bereitschaft_erweitert_head2 = \x27\x27;\n"
            + "            var bereitschaft_erweitert_head3 = \x27\x27;\n"
            + "            var bereitschaft_erweitert_body = \x27\x27;\n"
            + "            var bereitschaft_erweitert_footer = \x27\x27;\n"
            + "            var bereitschaft_erweitert_unterschrift = \x27\x27;\n"
            + "            var wochentagzeile_array = [];\n"
            + "            var datumzeile_array = [];\n"
            + "            var kalenderwochezeile_array = [];\n"
            + "            var gestempeltvonzeile_array = [];\n"
            + "            var gestempeltbiszeile_array = [];\n"
            + "            var gestempeltpause1vonzeile_array = [];\n"
            + "            var gestempeltpause1biszeile_array = [];\n"
            + "            var gestempeltpause2vonzeile_array = [];\n"
            + "            var gestempeltpause2biszeile_array = [];\n"
            + "            var gestempeltpause3vonzeile_array = [];\n"
            + "            var gestempeltpause3biszeile_array = [];\n"
            + "            var gestempeltpause4vonzeile_array = [];\n"
            + "            var gestempeltpause4biszeile_array = [];\n"
            + "            var gestempeltpause5vonzeile_array = [];\n"
            + "            var gestempeltpause5biszeile_array = [];\n"
            + "            var bereitschaftszeiten_ausgewaehlt_stunden = [];\n"
            + "            var bereitschaftszeiten_ausgewaehlt_liste_zeile = [];\n"
            + "            var bereitschaftszeiten_ausgewaehlt_array = [];\n"
            + "            var bereitschaft_data = \x27\x27;\n"
            + "            var bereitschaftsauswahl_checkbox = \x27\x27;\n"
            + "            var monatsname = \x27\x27;\n"
            + "            var monatszahl = \x2700\x27;\n"
            + "            var monat_string = \x27\x27;\n"
            + "            var heute = new Date();\n"
            + "            var heute_monatnr = \x2700\x27;\n"
            + "            var heute_tagnr = \x2700\x27;\n"
            + "            var heute_string = \x27\x27;\n"
            + "            var idtext = \x27\x27;\n"
            + "            var idtext_kat = \x27\x27;\n"
            + "            var idtext_vorher = \x27\x27;\n"
            + " \n"
            + "            var zeilen0 = document.querySelector(\x27tbody\x27).querySelectorAll(\x27tr\x27);\n"
            + "            for(var az = 0, zeilen; !!(zeilen=zeilen0[az]); az++) {\n"
            + "                var zeile0 = zeilen.querySelectorAll(\x27td\x27);\n"
            + " \n"
            + "                if(zeilen.querySelectorAll(\x27td\x27)[1] && zeilen.querySelectorAll(\x27td\x27)[1].querySelector(\x27table\x27)) {\n"
            + "                    idtext_kat = \x27_kat_\x27;\n"
            + "                } else {\n"
            + "                    idtext_kat = \x27\x27;\n"
            + "                }\n"
            + " \n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27&nbsp;\x27) {\n"
            + "                    idtext = \x27\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27 \x27) {\n"
            + "                    idtext = \x27\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27\x27) {\n"
            + "                    idtext = \x27\x27;\n"
            + "                }\n"
            + " \n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27SALDENLISTE (Stadt Paderborn)\x27) {\n"
            + "                    idtext = \x27header\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Mitarbeiter\x27) {\n"
            + "                    idtext = \x27mitarbeiter\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Monat\x27) {\n"
            + "                    idtext = \x27monat\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27&nbsp;\x27 && idtext_vorher == \x27monat\x27) {\n"
            + "                    idtext = \x27wochentag\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Datum\x27) {\n"
            + "                    idtext = \x27datum\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27KW\x27) {\n"
            + "                    idtext = \x27kalenderwoche\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Gestempelt von\x27) {\n"
            + "                    idtext = \x27gestempeltvon\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltvon\x27) {\n"
            + "                    idtext = \x27gestempeltbis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Berechnet von\x27) {\n"
            + "                    idtext = \x27berechnetvon\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27berechnetvon\x27) {\n"
            + "                    idtext = \x27berechnetbis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Nettozeit\x27) {\n"
            + "                    idtext = \x27nettozeit\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Sollzeit\x27) {\n"
            + "                    idtext = \x27sollzeit\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Saldo\x27) {\n"
            + "                    idtext = \x27saldo\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pause 1 von\x27) {\n"
            + "                    idtext = \x27gestempeltepause1von\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltepause1von\x27) {\n"
            + "                    idtext = \x27gestempeltepause1bis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pause 2 von\x27) {\n"
            + "                    idtext = \x27gestempeltepause2von\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltepause2von\x27) {\n"
            + "                    idtext = \x27gestempeltepause2bis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pause 3 von\x27) {\n"
            + "                    idtext = \x27gestempeltepause3von\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltepause3von\x27) {\n"
            + "                    idtext = \x27gestempeltepause3bis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pause 4 von\x27) {\n"
            + "                    idtext = \x27gestempeltepause4von\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltepause4von\x27) {\n"
            + "                    idtext = \x27gestempeltepause4bis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pause 5 von\x27) {\n"
            + "                    idtext = \x27gestempeltepause5von\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27bis\x27 && idtext_vorher == \x27gestempeltepause5von\x27) {\n"
            + "                    idtext = \x27gestempeltepause5bis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27gest. Pausen-Std\x27) {\n"
            + "                    idtext = \x27gestempeltepausenstd\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27ber. Pausen-Std\x27) {\n"
            + "                    idtext = \x27berechnetepausenstd\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Dienstgang\x27) {\n"
            + "                    idtext = \x27dienstgang\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Dienstreise ganztags\x27) {\n"
            + "                    idtext = \x27dienstreiseganztags\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Urlaub ganztags\x27) {\n"
            + "                    idtext = \x27urlaubganztags\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Fehlt ganztags\x27) {\n"
            + "                    idtext = \x27fehltganztags\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Zeitausgleich GLZ\x27) {\n"
            + "                    idtext = \x27zeitausgleich\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Krank mit Nachweis\x27) {\n"
            + "                    idtext = \x27krankmitnachweis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27krank o. Nachweis\x27) {\n"
            + "                    idtext = \x27krankohnenachweis\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Auszahlung\x27) {\n"
            + "                    idtext = \x27auszahlung\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Auszahlung +/-\x27) {\n"
            + "                    idtext = \x27auszahlungberechnet\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Auszahlung\x27 && idtext_vorher == \x27auszahlungberechnet\x27) {\n"
            + "                    idtext = \x27auszahlungsumme\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Vortrag Gleitzeit\x27) {\n"
            + "                    idtext = \x27vortraggleitzeit\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Gleitzeit\x27) {\n"
            + "                    idtext = \x27gleitzeit\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Gleitzeit +/-\x27) {\n"
            + "                    idtext = \x27gleitzeitberechnet\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Gleitzeit\x27 && idtext_vorher == \x27gleitzeitberechnet\x27) {\n"
            + "                    idtext = \x27gleitzeitsumme\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27Vortrag aGLZ\x27) {\n"
            + "                    idtext = \x27vortragaglz\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27aGLZ\x27) {\n"
            + "                    idtext = \x27aglz\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27aGLZ +/-\x27) {\n"
            + "                    idtext = \x27aglzberechnet\x27;\n"
            + "                }\n"
            + "                if(zeilen.querySelector(\x27td\x27).innerHTML == \x27aGLZ\x27 && idtext_vorher == \x27aglzberechnet\x27) {\n"
            + "                    idtext = \x27aglzsumme\x27;\n"
            + "                }\n"
            + " \n"
            + "                if(idtext) {\n"
            + "                    for(var z = 0, zeile; !!(zeile=zeile0[z]); z++) {\n"
            + "                        var idtext_nummer = \x27\x27;\n"
            + "                        if(z < 10) {\n"
            + "                            idtext_nummer = \x270\x27 + z;\n"
            + "                        } else {\n"
            + "                            idtext_nummer = z;\n"
            + "                        }\n"
            + "                        zeile.setAttribute(\x27id\x27,idtext + idtext_kat + idtext_nummer);\n"
            + "                        if(idtext == \x27wochentag\x27) {\n"
            + "                            wochentagzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27datum\x27) {\n"
            + "                            datumzeile_array.push(zeile.innerHTML);\n"
            + "                            zeile.setAttribute(\x27data-innerHTML\x27,zeile.innerHTML);\n"
            + "                            if(zeile.innerHTML != \x27Datum\x27 && zeile.innerHTML != \x27&nbsp;\x27) {\n"
            + "                                zeile.setAttribute(\x27onclick\x27,\x27bereitschaftsauswahlFunction(\x27 + idtext_nummer + \x27);\x27);\n"
            + "                                zeile.setAttribute(\x27title\x27,\x27Tag zur Bereitschaftsliste hinzufügen\x27);\n"
            + "                                zeile.setAttribute(\x27style\x27,\x27cursor: pointer;\x27);\n"
            + "                            }\n"
            + "                        }\n"
            + "                        if(idtext == \x27kalenderwoche\x27) {\n"
            + "                            kalenderwochezeile_array.push(zeile.innerHTML);\n"
            + "                            if(zeile.innerHTML != \x27KW\x27 && zeile.innerHTML != \x27&nbsp;\x27) {\n"
            + "                                zeile.setAttribute(\x27onclick\x27,\x27kalenderwocheFunction(\x27 + idtext_nummer + \x27);\x27);\n"
            + "                                zeile.setAttribute(\x27title\x27,\x27Woche zur Bereitschaftsliste hinzufügen\x27);\n"
            + "                                zeile.setAttribute(\x27style\x27,\x27cursor: pointer;\x27);\n"
            + "                            }\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltvon\x27) {\n"
            + "                            gestempeltvonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltbis\x27) {\n"
            + "                            gestempeltbiszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause1von\x27) {\n"
            + "                            gestempeltpause1vonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause1bis\x27) {\n"
            + "                            gestempeltpause1biszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause2von\x27) {\n"
            + "                            gestempeltpause2vonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause2bis\x27) {\n"
            + "                            gestempeltpause2biszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause3von\x27) {\n"
            + "                            gestempeltpause3vonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause3bis\x27) {\n"
            + "                            gestempeltpause3biszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause4von\x27) {\n"
            + "                            gestempeltpause4vonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause4bis\x27) {\n"
            + "                            gestempeltpause4biszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause5von\x27) {\n"
            + "                            gestempeltpause5vonzeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                        if(idtext == \x27gestempeltepause5bis\x27) {\n"
            + "                            gestempeltpause5biszeile_array.push(zeile.innerHTML);\n"
            + "                        }\n"
            + "                    }\n"
            + "                }\n"
            + "                idtext_vorher = idtext;\n"
            + "            }\n"
            + " \n"
            + "            function kalenderwocheFunction(kw) {\n"
            + "                bereitschaftsauswahlFunction(kw);\n"
            + "                var i = parseInt(kw) + 1;\n"
            + "                var ende = 0;\n"
            + "                while(kalenderwochezeile_array[i]) {\n"
            + "                    if(ende == 0 && kalenderwochezeile_array[i] == \x27&nbsp;\x27 && datumzeile_array[i] != \x27&nbsp;\x27) {\n"
            + "                        bereitschaftsauswahlFunction(i);\n"
            + "                    } else {\n"
            + "                        ende = 1;\n"
            + "                    }\n"
            + "                    i++;\n"
            + "                }\n"
            + "            }\n"
            + " \n"
            + "            function werte_uebernehmen(start,ziel) {\n"
            + "                document.getElementById(ziel).value = document.getElementById(start).value;\n"
            + "            }\n"
            + " \n"
            + "            function stunden_rechnen(id,alter_wert,neuer_wert) {\n"
            + "                var rechnen_stunden_gesamt;\n"
            + "                var rechnen_stunden_alter_wert;\n"
            + "                var rechnen_stunden_neuer_wert;\n"
            + "                if(isNaN(parseFloat(document.getElementById(\x27stunden_gesamt\x27).value))) { rechnen_stunden_gesamt = 0; } else { rechnen_stunden_gesamt = parseFloat(document.getElementById(\x27stunden_gesamt\x27).value); }\n"
            + "                if(isNaN(parseFloat(alter_wert))) { rechnen_stunden_alter_wert = 0; } else { rechnen_stunden_alter_wert = parseFloat(alter_wert); }\n"
            + "                if(isNaN(parseFloat(neuer_wert))) { rechnen_stunden_neuer_wert = 0; } else { rechnen_stunden_neuer_wert = parseFloat(neuer_wert); }\n"
            + "                document.getElementById(\x27stunden_gesamt\x27).value = (rechnen_stunden_gesamt - rechnen_stunden_alter_wert + rechnen_stunden_neuer_wert).toFixed(2);\n"
            + "                document.getElementById(\x27stunden\x27 + id).setAttribute(\x27onchange\x27, \x27stunden_rechnen(\\x27\x27 + id + \x27\\x27,\\x27\x27 + neuer_wert + \x27\\x27,this.value)\x27);\n"
            + "            }\n"
            + " \n"
            + "            function bereitschaftsauswahlFunction(auswahl) {\n"
            + "                if(auswahl < 10) { auswahl = \x270\x27 + auswahl; }\n"
            + "                if(auswahl != \x27Datum\x27 && auswahl != \x27&nbsp;\x27) {\n"
            + "                    if(bereitschaftszeiten_ausgewaehlt_array.includes(auswahl)) {\n"
            + "                        document.getElementById(\x27datum\x27 + auswahl).setAttribute(\x27style\x27,\x27cursor: pointer;\x27);\n"
            + "                        var bereitschaftszeiten_ausgewaehlt_array_index = bereitschaftszeiten_ausgewaehlt_array.indexOf(auswahl);\n"
            + "                        if (bereitschaftszeiten_ausgewaehlt_array_index > -1) {\n"
            + "                            bereitschaftszeiten_ausgewaehlt_stunden.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);\n"
            + "                            bereitschaftszeiten_ausgewaehlt_liste_zeile.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);\n"
            + "                            bereitschaftszeiten_ausgewaehlt_array.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);\n"
            + "                        }\n"
            + "                        bereitschaftszeiten_ausgewaehlt_anzeigen();\n"
            + "                    } else {\n"
            + "                        document.getElementById(\x27datum\x27 + auswahl).setAttribute(\x27style\x27,\x27background-color: orangered; cursor: pointer;\x27);\n"
            + "                        var monat = document.querySelector(\x27tbody\x27).querySelectorAll(\x27tr\x27)[4].querySelector(\x27td\x27).innerHTML.split(\x27 \x27)[0];\n"
            + "                        var monatnr = \x2700\x27;\n"
            + "                        if(monat == \x27Januar\x27) { monatnr = \x2701\x27; }\n"
            + "                        if(monat == \x27Februar\x27) { monatnr = \x2702\x27; }\n"
            + "                        if(monat == \x27März\x27) { monatnr = \x2703\x27; }\n"
            + "                        if(monat == \x27April\x27) { monatnr = \x2704\x27; }\n"
            + "                        if(monat == \x27Mai\x27) { monatnr = \x2705\x27; }\n"
            + "                        if(monat == \x27Juni\x27) { monatnr = \x2706\x27; }\n"
            + "                        if(monat == \x27Juli\x27) { monatnr = \x2707\x27; }\n"
            + "                        if(monat == \x27August\x27) { monatnr = \x2708\x27; }\n"
            + "                        if(monat == \x27September\x27) { monatnr = \x2709\x27; }\n"
            + "                        if(monat == \x27Oktober\x27) { monatnr = \x2710\x27; }\n"
            + "                        if(monat == \x27November\x27) { monatnr = \x2711\x27; }\n"
            + "                        if(monat == \x27Dezember\x27) { monatnr = \x2712\x27; }\n"
            + "                        var jahr = document.querySelector(\x27tbody\x27).querySelectorAll(\x27tr\x27)[4].querySelector(\x27td\x27).innerHTML.split(\x27 \x27)[1];\n"
            + "                        var monat_jahr = monatnr + \x27.\x27 + jahr;\n"
            + " \n"
            + "                        var bereitschaft_uhrzeit1_von = \x2700:00\x27;\n"
            + "                        var bereitschaft_uhrzeit1_bis = \x2700:00\x27;\n"
            + "                        var bereitschaft_uhrzeit2_von = \x2700:00\x27;\n"
            + "                        var bereitschaft_uhrzeit2_bis = \x2700:00\x27;\n"
            + "                        var wegezeit_hin_von = \x27\x27;\n"
            + "                        var wegezeit_hin_bis = \x27\x27;\n"
            + "                        var arbeitszeit_von = \x27\x27;\n"
            + "                        var arbeitszeit_bis = \x27\x27;\n"
            + "                        var wegezeit_zurueck_von = \x27\x27;\n"
            + "                        var wegezeit_zurueck_bis = \x27\x27;\n"
            + "                        var minuten_hin = 0;\n"
            + "                        var minuten_zurueck = 0;\n"
            + "                        var stunden = 0;\n"
            + "                        var stunden_string = \x27\x27;\n"
            + "                        if(gestempeltvonzeile_array[parseInt(auswahl)] !== null && gestempeltvonzeile_array[parseInt(auswahl)] != \x27&nbsp;\x27) {\n"
            + "                            if(wochentagzeile_array[parseInt(auswahl)] == \x27Sa\x27 || wochentagzeile_array[parseInt(auswahl)] == \x27So\x27) {\n"
            + "                                wegezeit_hin_von = gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                            } else {\n"
            + "                                bereitschaft_uhrzeit1_bis = gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                            }\n"
            + "                        }\n"
            + " \n"
            + "                        if(typeof gestempeltpause1vonzeile_array[parseInt(auswahl)] !== \x27undefined\x27 && gestempeltpause1vonzeile_array[parseInt(auswahl)] !== null && gestempeltpause1vonzeile_array[parseInt(auswahl)] != \x27&nbsp;\x27) {\n"
            + "                            if(parseInt(gestempeltpause1vonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) < parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0])) {\n"
            + "                                bereitschaft_uhrzeit2_von = gestempeltpause1vonzeile_array[parseInt(auswahl)].split(\x22:\x22)[0] + \x27:\x27 + gestempeltpause1vonzeile_array[parseInt(auswahl)].split(\x22:\x22)[1];\n"
            + "                                wegezeit_hin_von = gestempeltpause1biszeile_array[parseInt(auswahl)].split(\x22:\x22)[0] + \x27:\x27 + gestempeltpause1biszeile_array[parseInt(auswahl)].split(\x22:\x22)[1];\n"
            + "                                wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(\x22:\x22)[0] + \x27:\x27 + gestempeltbiszeile_array[parseInt(auswahl)].split(\x22:\x22)[1];\n"
            + "                                minuten_hin = (parseInt(gestempeltpause1biszeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltpause1biszeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);\n"
            + "                                wegezeit_hin_bis = \x2700:00\x27;\n"
            + "                                arbeitszeit_von = \x2700:00\x27;\n"
            + "                                arbeitszeit_bis = \x2700:00\x27;\n"
            + "                                wegezeit_zurueck_von = \x2700:00\x27;\n"
            + "                            } else {\n"
            + "                                if(gestempeltbiszeile_array[parseInt(auswahl)] !== null && gestempeltbiszeile_array[parseInt(auswahl)] != \x27&nbsp;\x27) {\n"
            + "                                    if(wochentagzeile_array[parseInt(auswahl)] == \x27Sa\x27 || wochentagzeile_array[parseInt(auswahl)] == \x27So\x27) {\n"
            + "                                        wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                                        minuten_hin = (parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                        minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                        stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);\n"
            + "                                        wegezeit_hin_bis = \x2700:00\x27;\n"
            + "                                        arbeitszeit_von = \x2700:00\x27;\n"
            + "                                        arbeitszeit_bis = \x2700:00\x27;\n"
            + "                                        wegezeit_zurueck_von = \x2700:00\x27;\n"
            + "                                    } else {\n"
            + "                                        bereitschaft_uhrzeit2_von = gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                                    }\n"
            + "                                }\n"
            + "                            }\n"
            + "                        } else {\n"
            + "                            if(gestempeltbiszeile_array[parseInt(auswahl)] !== null && gestempeltbiszeile_array[parseInt(auswahl)] != \x27&nbsp;\x27) {\n"
            + "                                if(wochentagzeile_array[parseInt(auswahl)] == \x27Sa\x27 || wochentagzeile_array[parseInt(auswahl)] == \x27So\x27) {\n"
            + "                                    wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                                    minuten_hin = (parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                    minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1]);\n"
            + "                                    stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);\n"
            + "                                    wegezeit_hin_bis = \x2700:00\x27;\n"
            + "                                    arbeitszeit_von = \x2700:00\x27;\n"
            + "                                    arbeitszeit_bis = \x2700:00\x27;\n"
            + "                                    wegezeit_zurueck_von = \x2700:00\x27;\n"
            + "                                } else {\n"
            + "                                    bereitschaft_uhrzeit2_von = gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[0] + \x27:\x27 + gestempeltbiszeile_array[parseInt(auswahl)].split(\x27:\x27)[1];\n"
            + "                                }\n"
            + "                            }\n"
            + "                        }\n"
            + "                        if(parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(\x27:\x27)[0]) < \x277\x27) {\n"
            + "                            // Einsatz vor 7 Uhr --> Zeiten tauschen\n"
            + "                            var bereitschaft_uhrzeit1_bis_temp = bereitschaft_uhrzeit1_bis;\n"
            + "                            var bereitschaft_uhrzeit2_von_temp = bereitschaft_uhrzeit2_von;\n"
            + "                            var wegezeit_hin_von_temp = wegezeit_hin_von;\n"
            + "                            var wegezeit_zurueck_bis_temp = wegezeit_zurueck_bis;\n"
            + "                            bereitschaft_uhrzeit1_bis = wegezeit_hin_von_temp;\n"
            + "                            bereitschaft_uhrzeit2_von = wegezeit_zurueck_bis_temp;\n"
            + "                            wegezeit_hin_von = bereitschaft_uhrzeit1_bis_temp;\n"
            + "                            wegezeit_zurueck_bis = bereitschaft_uhrzeit2_von_temp;\n"
            + "                            minuten_hin_temp = (parseInt(wegezeit_hin_von.split(':')[0]) * 60) + parseInt(wegezeit_hin_von.split(':')[1]);\n"
            + "                            minuten_zurueck_temp = (parseInt(wegezeit_zurueck_bis.split(':')[0]) * 60) + parseInt(wegezeit_zurueck_bis.split(':')[1]);\n"
            + "                            stunden = ((minuten_zurueck_temp - minuten_hin_temp)/60).toFixed(2);\n"
            + "                        }\n"
            + "                        if(bereitschaft_uhrzeit1_von == \x2700:00\x27 && bereitschaft_uhrzeit1_bis == \x2700:00\x27) {\n"
            + "                            bereitschaft_uhrzeit2_von = \x27\x27;\n"
            + "                            bereitschaft_uhrzeit2_bis = \x27\x27;\n"
            + "                        }\n"
            + "                        if(stunden > 0) {\n"
            + "                            stunden_string = stunden;\n"
            + "                            bereitschaftszeiten_ausgewaehlt_stunden.push(parseFloat(stunden).toFixed(2));\n"
            + "                        } else {\n"
            + "                            bereitschaftszeiten_ausgewaehlt_stunden.push(0);\n"
            + "                        }\n"
            + "                        if(document.getElementById(\x27bereitschaft_erweitert\x27).value == \x27true\x27) {\n"
            + "                            bereitschaft_erweitert_body = \x27<td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22einsatzgrund\x27 + auswahl + \x27\x22 value=\x22\x22 style=\x22border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22buero_stunden_gerundet\x27 + auswahl + \x27\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22buero_zuschlaege\x27 + auswahl + \x27\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td>\x27;\n"
            + "                        }\n"
            + "                        bereitschaftszeiten_ausgewaehlt_liste_zeile.push(\x27<tr id=\x22bereitschaft_zeiten_\x27 + auswahl + \x27\x22 style=\x22border-bottom: 1px solid gainsboro;\x22><td onmouseover=\x22this.innerHTML=\\x27+\\x27\x22 onmouseout=\x22this.innerHTML=\\x27&nbsp;\\x27\x22 onclick=\x22bereitschaftsauswahl_zeile_hinzufuegen(\\x27bereitschaft_zeiten_\x27 + auswahl + \x27\\x27);\x22 title=\x22Zeile darunter hinzufügen\x22 style=\x22width: 10px;border-bottom: 1px solid white;\x22>&nbsp;</td><td onmouseover=\x22this.innerHTML=\\x27-\\x27\x22 onmouseout=\x22this.innerHTML=\\x27&nbsp;\\x27\x22 onclick=\x22bereitschaftsauswahl_zeile_loeschen(\\x27bereitschaft_zeiten_\x27 + auswahl + \x27\\x27);\x22 title=\x22Diese Zeile löschen\x22 style=\x22width: 10px;border-bottom: 1px solid white;\x22>&nbsp;</td><td style=\x22border-left: 2px solid black;padding-top: 10px;padding-bottom: 10px;\x22>\x27 + wochentagzeile_array[parseInt(auswahl)] + \x27</td><td style=\x22border-left: 2px solid black;\x22>\x27 + datumzeile_array[parseInt(auswahl)] + \x27.\x27 + monat_jahr + \x27</td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit1_von\x27 + auswahl + \x27\x22 value=\x22\x27 + bereitschaft_uhrzeit1_von + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit1_bis\x27 + auswahl + \x27\x22 value=\x22\x27 + bereitschaft_uhrzeit1_bis + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit2_von\x27 + auswahl + \x27\x22 value=\x22\x27 + bereitschaft_uhrzeit2_von + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit2_bis\x27 + auswahl + \x27\x22 value=\x22\x27 + bereitschaft_uhrzeit2_bis + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_hin_von\x27 + auswahl + \x27\x22 value=\x22\x27 + wegezeit_hin_von + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_hin_bis\x27 + auswahl + \x27\x22 value=\x22\x27 + wegezeit_hin_bis + \x27\x22 onchange=\x22werte_uebernehmen(\\x27wegezeit_hin_bis\x27 + auswahl + \x27\\x27,\\x27arbeitszeit_von\x27 + auswahl + \x27\\x27)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22arbeitszeit_von\x27 + auswahl + \x27\x22 value=\x22\x27 + arbeitszeit_von + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22arbeitszeit_bis\x27 + auswahl + \x27\x22 value=\x22\x27 + arbeitszeit_bis + \x27\x22 onchange=\x22werte_uebernehmen(\\x27arbeitszeit_bis\x27 + auswahl + \x27\\x27,\\x27wegezeit_zurueck_von\x27 + auswahl + \x27\\x27)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_zurueck_von\x27 + auswahl + \x27\x22 value=\x22\x27 + wegezeit_zurueck_von + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_zurueck_bis\x27 + auswahl + \x27\x22 value=\x22\x27 + wegezeit_zurueck_bis + \x27\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22stunden\x27 + auswahl + \x27\x22 value=\x22\x27 + stunden_string + \x27\x22 onchange=\x22stunden_rechnen(\\x27\x27 + auswahl + \x27\\x27,\\x27\x27 + stunden + \x27\\x27,this.value)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td>\x27 + bereitschaft_erweitert_body + \x27</tr>\x27);\n"
            + "                        bereitschaftszeiten_ausgewaehlt_array.push(auswahl);\n"
            + "                        bereitschaftszeiten_ausgewaehlt_anzeigen();\n"
            + "                    }\n"
            + "                }\n"
            + "            }\n"
            + " \n"
            + "            function bereitschaftsauswahl_zeile_hinzufuegen(zeilenid) {\n"
            + "                if(document.getElementById(\x27bereitschaft_erweitert\x27).value == \x27true\x27) {\n"
            + "                    zeile_hinzufuegen_erweitert = \x27<td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22einsatzgrund\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22buero_stunden_gerundet\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22buero_zuschlaege\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td>\x27;\n"
            + "                }\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[0].innerHTML = \x27&nbsp;\x27;\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[0].removeAttribute(\x27onmouseover\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[0].removeAttribute(\x27onmouseout\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[0].removeAttribute(\x27onclick\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[0].removeAttribute(\x27title\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[1].innerHTML = \x27&nbsp;\x27;\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[1].removeAttribute(\x27onmouseover\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[1].removeAttribute(\x27onmouseout\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[1].removeAttribute(\x27onclick\x27);\n"
            + "                document.getElementById(zeilenid).querySelectorAll(\x27td\x27)[1].removeAttribute(\x27title\x27);\n"
            + "                document.getElementById(zeilenid).insertAdjacentHTML(\x27afterend\x27, \x27<tr id=\x22\x27 + zeilenid + \x27_zusatz\x22 style=\x22border-bottom: 1px solid gainsboro;\x22><td onmouseover=\x22this.innerHTML=\\x27+\\x27\x22 onmouseout=\x22this.innerHTML=\\x27&nbsp;\\x27\x22 onclick=\x22bereitschaftsauswahl_zeile_hinzufuegen(\\x27\x27 + zeilenid + \x27_zusatz\\x27);\x22 title=\x22Zeile darunter hinzufügen\x22 style=\x22width: 10px;border-bottom: 1px solid white;\x22>&nbsp;</td><td onmouseover=\x22this.innerHTML=\\x27-\\x27\x22 onmouseout=\x22this.innerHTML=\\x27&nbsp;\\x27\x22 onclick=\x22bereitschaftsauswahl_zeile_loeschen(\\x27\x27 + zeilenid + \x27_zusatz\\x27);\x22 title=\x22Diese Zeile löschen\x22 style=\x22width: 10px;border-bottom: 1px solid white;\x22>&nbsp;</td><td style=\x22border-left: 2px solid black;padding-top: 10px;padding-bottom: 10px;\x22><input type=\x22text\x22 id=\x22bereitschaft_wochentag_\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;max-height: 13px;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_datum_\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 6em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit1_von_\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit1_bis\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit2_von\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22bereitschaft_uhrzeit2_bis\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_hin_von\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_hin_bis\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 onchange=\x22werte_uebernehmen(\\x27wegezeit_hin_bis\x27 + zeilenid + \x27_zusatz\\x27,\\x27arbeitszeit_von\x27 + zeilenid + \x27_zusatz\\x27)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22arbeitszeit_von\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22arbeitszeit_bis\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 onchange=\x22werte_uebernehmen(\\x27arbeitszeit_bis\x27 + zeilenid + \x27_zusatz\\x27,\\x27wegezeit_zurueck_von\x27 + zeilenid + \x27_zusatz\\x27)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_zurueck_von\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 1px solid black;\x22><input type=\x22text\x22 id=\x22wegezeit_zurueck_bis\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td><td style=\x22border-left: 2px solid black;border-right: 2px solid black;\x22><input type=\x22text\x22 id=\x22stunden\x27 + zeilenid + \x27_zusatz\x22 value=\x22\x22 onchange=\x22stunden_rechnen(\\x27\x27 + zeilenid + \x27_zusatz\\x27,\\x270\\x27,this.value)\x22 style=\x22border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;\x22></td>\x27 + zeile_hinzufuegen_erweitert + \x27</tr>\x27);\n"
            + "            }\n"
            + " \n"
            + "            function bereitschaftsauswahl_zeile_loeschen(zeilenid) {\n"
            + "                var zeilenid_davor = \x27\x27;\n"
            + "                if(zeilenid.substr(-7, 7) == \x27_zusatz\x27) {\n"
            + "                     zeilenid_davor = document.getElementById(zeilenid).previousSibling.getAttribute(\x27id\x27);\n"
            + "                } else {\n"
            + "                     zeilenid_davor = zeilenid;\n"
            + "                }\n"
            + "                if(!isNaN(parseFloat(document.getElementById(zeilenid).querySelector(\x27[id^=\\x27stunden\\x27]\x27).value))) {\n"
            + "                     document.getElementById(\x27stunden_gesamt\x27).value = (parseFloat(document.getElementById(\x27stunden_gesamt\x27).value) - parseFloat(document.getElementById(zeilenid).querySelector(\x27[id^=\\x27stunden\\x27]\x27).value)).toFixed(2);\n"
            + "                }\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[0].setAttribute(\x27onmouseover\x27,\x27this.innerHTML=\\x27+\\x27\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[0].setAttribute(\x27onmouseout\x27,\x27this.innerHTML=\\x27&nbsp;\\x27\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[0].setAttribute(\x27onclick\x27,\x27bereitschaftsauswahl_zeile_hinzufuegen(\\x27\x27 + zeilenid_davor + \x27\\x27)\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[0].setAttribute(\x27title\x27,\x27Zeile darunter hinzufügen\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[1].setAttribute(\x27onmouseover\x27,\x27this.innerHTML=\\x27-\\x27\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[1].setAttribute(\x27onmouseout\x27,\x27this.innerHTML=\\x27&nbsp;\\x27\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[1].setAttribute(\x27onclick\x27,\x27bereitschaftsauswahl_zeile_loeschen(\\x27\x27 + zeilenid_davor + \x27\\x27)\x27);\n"
            + "                document.getElementById(zeilenid_davor).querySelectorAll(\x27td\x27)[1].setAttribute(\x27title\x27,\x27Diese Zeile löschen\x27);\n"
            + "                document.getElementById(zeilenid).remove();\n"
            + "            }\n"
            + " \n"
            + "            function bereitschaftsauswahl_anzeigen() {\n"
            + "                bereitschaftszeiten_ausgewaehlt_liste_zeile.sort();\n"
            + "                document.getElementById(\x27bereitschaft_zeiten\x27).innerHTML += bereitschaftszeiten_ausgewaehlt_liste_zeile.join(\x27 \x27);\n"
            + "                var stunden_gesamt = 0;\n"
            + "                for(var i=0, n=bereitschaftszeiten_ausgewaehlt_stunden.length; i < n; i++) {\n"
            + "                    stunden_gesamt += parseFloat(bereitschaftszeiten_ausgewaehlt_stunden[i]);\n"
            + "                }\n"
            + "                document.getElementById(\x27stunden_gesamt\x27).value = stunden_gesamt.toFixed(2);\n"
            + "                if(document.getElementById(\x27bereitschaft\x27)) { document.getElementById(\x27bereitschaft\x27).setAttribute(\x27style\x27,\x27font-size: 12px;font-family: Arial, Helvetica, sans-serif;\x27); }\n"
            + "                if(document.getElementById(\x27settings\x27)) { document.getElementById(\x27settings\x27).remove(); }\n"
            + "                if(document.getElementById(\x27divContainer\x27)) { document.getElementById(\x27divContainer\x27).setAttribute(\x27style\x27,\x27display: none;\x27); }\n"
            + "                if(document.getElementById(\x27info\x27)) { document.getElementById(\x27info\x27).setAttribute(\x27style\x27,\x27display: none;\x27); }\n"
            + "            }\n"
            + " \n"
            + "            function bereitschaftszeiten_ausgewaehlt_anzeigen() {\n"
            + "                if(bereitschaftszeiten_ausgewaehlt_array[0]) {\n"
            + "                    document.getElementById(\x27datum00\x27).setAttribute(\x27onclick\x27,\x27bereitschaftsauswahl_anzeigen();\x27);\n"
            + "                    document.getElementById(\x27datum00\x27).setAttribute(\x27style\x27,\x27cursor: pointer;\x27);\n"
            + "                    document.getElementById(\x27kalenderwoche00\x27).setAttribute(\x27onclick\x27,\x27bereitschaftsauswahl_anzeigen();\x27);\n"
            + "                    document.getElementById(\x27kalenderwoche00\x27).setAttribute(\x27style\x27,\x27cursor: pointer;\x27);\n"
            + "                } else {\n"
            + "                    document.getElementById(\x27datum00\x27).removeAttribute(\x27onclick\x27);\n"
            + "                    document.getElementById(\x27datum00\x27).removeAttribute(\x27style\x27);\n"
            + "                    document.getElementById(\x27kalenderwoche00\x27).removeAttribute(\x27onclick\x27);\n"
            + "                    document.getElementById(\x27kalenderwoche00\x27).removeAttribute(\x27style\x27);\n"
            + "                }\n"
            + "            }\n"
            + " \n"
            + "            monatsname = document.getElementsByClassName(\x27Criteria\x27)[8].innerHTML.split(\x27 \x27);\n"
            + "            if(monatsname[0] == \x27Januar\x27) { monatszahl = \x2701\x27; }\n"
            + "            else if(monatsname[0] == \x27Februar\x27) { monatszahl = \x2702\x27; }\n"
            + "            else if(monatsname[0] == \x27März\x27) { monatszahl = \x2703\x27; }\n"
            + "            else if(monatsname[0] == \x27April\x27) { monatszahl = \x2704\x27; }\n"
            + "            else if(monatsname[0] == \x27Mai\x27) { monatszahl = \x2705\x27; }\n"
            + "            else if(monatsname[0] == \x27Juni\x27) { monatszahl = \x2706\x27; }\n"
            + "            else if(monatsname[0] == \x27Juli\x27) { monatszahl = \x2707\x27; }\n"
            + "            else if(monatsname[0] == \x27August\x27) { monatszahl = \x2708\x27; }\n"
            + "            else if(monatsname[0] == \x27September\x27) { monatszahl = \x2709\x27; }\n"
            + "            else if(monatsname[0] == \x27Oktober\x27) { monatszahl = \x2710\x27; }\n"
            + "            else if(monatsname[0] == \x27November\x27) { monatszahl = \x2711\x27; }\n"
            + "            else if(monatsname[0] == \x27Dezember\x27) { monatszahl = \x2712\x27; }\n"
            + "            monat_string = monatszahl + \x27/\x27 + monatsname[1];\n"
            + " \n"
            + "            if(heute.getMonth() == 0) { heute_monatnr = \x2701\x27; }\n"
            + "            else if(heute.getMonth() == 1) { heute_monatnr = \x2702\x27; }\n"
            + "            else if(heute.getMonth() == 2) { heute_monatnr = \x2703\x27; }\n"
            + "            else if(heute.getMonth() == 3) { heute_monatnr = \x2704\x27; }\n"
            + "            else if(heute.getMonth() == 4) { heute_monatnr = \x2705\x27; }\n"
            + "            else if(heute.getMonth() == 5) { heute_monatnr = \x2706\x27; }\n"
            + "            else if(heute.getMonth() == 6) { heute_monatnr = \x2707\x27; }\n"
            + "            else if(heute.getMonth() == 7) { heute_monatnr = \x2708\x27; }\n"
            + "            else if(heute.getMonth() == 8) { heute_monatnr = \x2709\x27; }\n"
            + "            else if(heute.getMonth() == 9) { heute_monatnr = \x2710\x27; }\n"
            + "            else { heute_monatnr = heute.getMonth() + 1; }\n"
            + " \n"
            + "            if(heute.getDate() < 10) { heute_tagnr = \x270\x27 + heute.getDate(); }\n"
            + "            else { heute_tagnr = heute.getDate(); }\n"
            + " \n"
            + "            heute_string = heute_tagnr + \x27.\x27 + heute_monatnr + \x27.\x27 + heute.getFullYear();\n"
            + " \n"
            + "            if(document.getElementById(\x27bereitschaft_erweitert\x27).value == \x27true\x27) {\n"
            + "                bereitschaft_erweitert_head1 = \x27<tr><td colspan=\x2216\x22 style=\x22background-color: white;\x22>&nbsp;</td><td colspan=\x222\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>B&uuml;ro</td></tr>\x27;\n"
            + "                bereitschaft_erweitert_head2 = \x27<td style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Einsatzgrund<br>LSA / Veranstaltung</td><td style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Stunden<br>gerundet</td><td style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Zuschläge</td>\x27;\n"
            + "                bereitschaft_erweitert_head3 = \x27<td style=\x22border: 2px solid black;border-top-width: 1px;\x22>&nbsp;</td><td style=\x22border: 2px solid black;border-top-width: 1px;\x22>&nbsp;</td><td style=\x22border: 2px solid black;border-top-width: 1px;\x22>&nbsp;</td>\x27;\n"
            + "                bereitschaft_erweitert_footer = \x27<td colspan=\x223\x22 style=\x22border-top: 2px solid black;border-bottom: 0px;border-left: 0px;\x22>&nbsp;</td>\x27;\n"
            + "                bereitschaft_erweitert_unterschrift = \x27<tr><td style=\x22width: 20%;\x22>Paderborn, den \x27 + heute_string + \x27</td><td style=\x22width: 20%;\x22>&nbsp;</td><td style=\x22width: 10%;\x22>&nbsp;</td><td style=\x22width: 20%;\x22>&nbsp;</td><td style=\x22width: 10%;\x22>&nbsp;</td><td style=\x22width: 20%;\x22>&nbsp;</td></tr><tr><td style=\x22width: 20%;\x22>&nbsp;</td><td style=\x22width: 20%;border-top: 1px solid black;\x22>\x27 + document.getElementsByClassName(\x27Criteria\x27)[2].innerHTML.split(\x27,\x27)[0] + \x27</td><td style=\x22width:10%\x22>&nbsp;</td><td style=\x22width: 20%;border-top: 1px solid black;\x22>Amtsleitung</td><td style=\x22width: 10%;\x22>&nbsp;</td><td style=\x22width: 20%;border-top: 1px solid black;\x22>Erfassung Loga</td></tr>\x27;\n"
            + "            } else {\n"
            + "                bereitschaft_erweitert_unterschrift = \x27<tr><td style=\x22width: 30%;\x22>Paderborn, den \x27 + heute_string + \x27</td><td style=\x22width: 30%;\x22>&nbsp;</td><td style=\x22width: 10%;\x22>&nbsp;</td><td style=\x22width: 30%;\x22>&nbsp;</td></tr><tr><td style=\x22width: 30%;\x22>&nbsp;</td><td style=\x22width: 30%;border-top: 1px solid black;\x22>\x27 + document.getElementsByClassName(\x27Criteria\x27)[2].innerHTML.split(\x27,\x27)[0] + \x27</td><td style=\x22width:10%\x22>&nbsp;</td><td style=\x22width: 30%;border-top: 1px solid black;\x22>Amtsleitung</td></tr>\x27;\n"
            + "            }\n"
            + " \n"
            + "            document.getElementById(\x27divContainer\x27).insertAdjacentHTML(\x27afterend\x27, \x27<div id=\x22bereitschaft\x22 style=\x22font-size: 12px;font-family: Arial, Helvetica, sans-serif;display: none;\x22><div id=\x22bereitschaft_head\x22 style=\x22margin: 20px;text-align: center;padding-bottom: 20px;\x22><div id=\x22ueberschrift\x22 style=\x22font-size: 16px;font-weight: bold;margin-bottom: 10px;\x22>Rufbereitschaft + &Uuml;berstunden ' + monat_string + '</div><div id=\x22personaldaten\x22 style=\x22font-size: 14px;\x22><span>\x27 + document.getElementsByClassName(\x27Criteria\x27)[2].innerHTML + \x27</span><span style=\x22margin-left: 20px;margin-right: 100px;\x22>StA 66-15</span><span>Pers. Nr.: \x27 + document.getElementById(\x27personalnummer\x27).value + \x27</span></div></div><div id=\x22bereitschaft_data\x22 style=\x22margin-top: 20px;margin-right: 20px;margin-bottom: 20px;text-align: center;\x22><table style=\x22margin-left: auto;margin-right: auto;border-collapse: collapse;width: 100%;\x22><thead style=\x22background-color: lightgray;\x22>\x27 + bereitschaft_erweitert_head1 + \x27<tr><td colspan=\x222\x22 style=\x22background-color: white;\x22>&nbsp;</td><td colspan=\x222\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Datum</td><td colspan=\x224\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Rufbereitschaft<br>Uhrzeit</td><td colspan=\x222\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Wegezeit</td><td colspan=\x222\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Arbeitszeit</td><td colspan=\x222\x22 style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Wegezeit</td><td style=\x22vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;\x22>Stunden</td>\x27 + bereitschaft_erweitert_head2 + \x27</tr><tr><td colspan=\x222\x22 style=\x22background-color: white;\x22>&nbsp;</td><td colspan=\x222\x22 style=\x22border: 2px solid black;border-top-width: 1px;\x22>&nbsp;</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-right-width: 1px;\x22>von</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-left-width: 1px;\x22>bis</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-right-width: 1px;\x22>von</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-left-width: 1px;\x22>bis</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-right-width: 1px;\x22>von</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-left-width: 1px;\x22>bis</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-right-width: 1px;\x22>von</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-left-width: 1px;\x22>bis</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-right-width: 1px;\x22>von</td><td style=\x22border: 2px solid black;border-top-width: 1px;border-left-width: 1px;\x22>bis</td><td style=\x22border: 2px solid black;border-top-width: 1px;\x22>&nbsp;</td>\x27 + bereitschaft_erweitert_head3 + \x27</tr></thead><tbody id=\x22bereitschaft_zeiten\x22></tbody><tfoot><tr><td colspan=\x222\x22 style=\x22background-color: white;\x22>&nbsp;</td><td colspan=\x2212\x22 style=\x22border-top: 2px solid black;border-bottom: 0px;border-left: 0px;\x22>&nbsp;</td><td style=\x22border: 2px solid black;max-width: 10em;\x22><input type=\x22text\x22 id=\x22stunden_gesamt\x22 value=\x220.00\x22 style=\x22border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;\x22></td>\x27 + bereitschaft_erweitert_footer + \x27</tr></tfoot></table></div><div id=\x22bereitschaft_footer\x22 style=\x22margin: 20px;padding-top: 40px;text-align: center;\x22><table style=\x22margin-left: auto;margin-right: auto;width: 100%;\x22>\x27 + bereitschaft_erweitert_unterschrift + \x27</table></div></div>\x27);\n"
            + " \n";


            /*
            Gleiches Script besser zu lesen:
            --------------------------------

            var bereitschaft_erweitert_head1 = '';
            var bereitschaft_erweitert_head2 = '';
            var bereitschaft_erweitert_head3 = '';
            var bereitschaft_erweitert_body = '';
            var bereitschaft_erweitert_footer = '';
            var bereitschaft_erweitert_unterschrift = '';
            var wochentagzeile_array = [];
            var datumzeile_array = [];
            var kalenderwochezeile_array = [];
            var gestempeltvonzeile_array = [];
            var gestempeltbiszeile_array = [];
            var gestempeltpause1vonzeile_array = [];
            var gestempeltpause1biszeile_array = [];
            var gestempeltpause2vonzeile_array = [];
            var gestempeltpause2biszeile_array = [];
            var gestempeltpause3vonzeile_array = [];
            var gestempeltpause3biszeile_array = [];
            var gestempeltpause4vonzeile_array = [];
            var gestempeltpause4biszeile_array = [];
            var gestempeltpause5vonzeile_array = [];
            var gestempeltpause5biszeile_array = [];
            var bereitschaftszeiten_ausgewaehlt_stunden = [];
            var bereitschaftszeiten_ausgewaehlt_liste_zeile = [];
            var bereitschaftszeiten_ausgewaehlt_array = [];
            var bereitschaft_data = '';
            var bereitschaftsauswahl_checkbox = '';
            var monatsname = '';
            var monatszahl = '00';
            var monat_string = '';
            var heute = new Date();
            var heute_monatnr = '00';
            var heute_tagnr = '00';
            var heute_string = '';
            var idtext = '';
            var idtext_kat = '';
            var idtext_vorher = '';

            var zeilen0 = document.querySelector('tbody').querySelectorAll('tr');
            for(var az = 0, zeilen; !!(zeilen=zeilen0[az]); az++) {
                var zeile0 = zeilen.querySelectorAll('td');

                if(zeilen.querySelectorAll('td')[1] && zeilen.querySelectorAll('td')[1].querySelector('table')) {
                    idtext_kat = '_kat_';
                } else {
                    idtext_kat = '';
                }

                if(zeilen.querySelector('td').innerHTML == '&nbsp;') {
                    idtext = '';
                }
                if(zeilen.querySelector('td').innerHTML == ' ') {
                    idtext = '';
                }
                if(zeilen.querySelector('td').innerHTML == '') {
                    idtext = '';
                }

                if(zeilen.querySelector('td').innerHTML == 'SALDENLISTE (Stadt Paderborn)') {
                    idtext = 'header';
                }
                if(zeilen.querySelector('td').innerHTML == 'Mitarbeiter') {
                    idtext = 'mitarbeiter';
                }
                if(zeilen.querySelector('td').innerHTML == 'Monat') {
                    idtext = 'monat';
                }
                if(zeilen.querySelector('td').innerHTML == '&nbsp;' && idtext_vorher == 'monat') {
                    idtext = 'wochentag';
                }
                if(zeilen.querySelector('td').innerHTML == 'Datum') {
                    idtext = 'datum';
                }
                if(zeilen.querySelector('td').innerHTML == 'KW') {
                    idtext = 'kalenderwoche';
                }
                if(zeilen.querySelector('td').innerHTML == 'Gestempelt von') {
                    idtext = 'gestempeltvon';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltvon') {
                    idtext = 'gestempeltbis';
                }
                if(zeilen.querySelector('td').innerHTML == 'Berechnet von') {
                    idtext = 'berechnetvon';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'berechnetvon') {
                    idtext = 'berechnetbis';
                }
                if(zeilen.querySelector('td').innerHTML == 'Nettozeit') {
                    idtext = 'nettozeit';
                }
                if(zeilen.querySelector('td').innerHTML == 'Sollzeit') {
                    idtext = 'sollzeit';
                }
                if(zeilen.querySelector('td').innerHTML == 'Saldo') {
                    idtext = 'saldo';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pause 1 von') {
                    idtext = 'gestempeltepause1von';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltepause1von') {
                    idtext = 'gestempeltepause1bis';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pause 2 von') {
                    idtext = 'gestempeltepause2von';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltepause2von') {
                    idtext = 'gestempeltepause2bis';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pause 3 von') {
                    idtext = 'gestempeltepause3von';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltepause3von') {
                    idtext = 'gestempeltepause3bis';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pause 4 von') {
                    idtext = 'gestempeltepause4von';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltepause4von') {
                    idtext = 'gestempeltepause4bis';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pause 5 von') {
                    idtext = 'gestempeltepause5von';
                }
                if(zeilen.querySelector('td').innerHTML == 'bis' && idtext_vorher == 'gestempeltepause5von') {
                    idtext = 'gestempeltepause5bis';
                }
                if(zeilen.querySelector('td').innerHTML == 'gest. Pausen-Std') {
                    idtext = 'gestempeltepause';
                }
                if(zeilen.querySelector('td').innerHTML == 'ber. Pausen-Std') {
                    idtext = 'berechnetepause';
                }
                if(zeilen.querySelector('td').innerHTML == 'Dienstgang') {
                    idtext = 'dienstgang';
                }
                if(zeilen.querySelector('td').innerHTML == 'Dienstreise ganztags') {
                    idtext = 'dienstreiseganztags';
                }
                if(zeilen.querySelector('td').innerHTML == 'Urlaub ganztags') {
                    idtext = 'urlaubganztags';
                }
                if(zeilen.querySelector('td').innerHTML == 'Fehlt ganztags') {
                    idtext = 'fehltganztags';
                }
                if(zeilen.querySelector('td').innerHTML == 'Zeitausgleich GLZ') {
                    idtext = 'zeitausgleich';
                }
                if(zeilen.querySelector('td').innerHTML == 'Krank mit Nachweis') {
                    idtext = 'krankmitnachweis';
                }
                if(zeilen.querySelector('td').innerHTML == 'krank o. Nachweis') {
                    idtext = 'krankohnenachweis';
                }
                if(zeilen.querySelector('td').innerHTML == 'Auszahlung') {
                    idtext = 'auszahlung';
                }
                if(zeilen.querySelector('td').innerHTML == 'Auszahlung +/-') {
                    idtext = 'auszahlungberechnet';
                }
                if(zeilen.querySelector('td').innerHTML == 'Auszahlung' && idtext_vorher == 'auszahlungberechnet') {
                    idtext = 'auszahlungsumme';
                }
                if(zeilen.querySelector('td').innerHTML == 'Vortrag Gleitzeit') {
                    idtext = 'vortraggleitzeit';
                }
                if(zeilen.querySelector('td').innerHTML == 'Gleitzeit') {
                    idtext = 'gleitzeit';
                }
                if(zeilen.querySelector('td').innerHTML == 'Gleitzeit +/-') {
                    idtext = 'gleitzeitberechnet';
                }
                if(zeilen.querySelector('td').innerHTML == 'Gleitzeit' && idtext_vorher == 'gleitzeitberechnet') {
                    idtext = 'gleitzeitsumme';
                }
                if(zeilen.querySelector('td').innerHTML == 'Vortrag aGLZ') {
                    idtext = 'vortragaglz';
                }
                if(zeilen.querySelector('td').innerHTML == 'aGLZ') {
                    idtext = 'aglz';
                }
                if(zeilen.querySelector('td').innerHTML == 'aGLZ +/-') {
                    idtext = 'aglzberechnet';
                }
                if(zeilen.querySelector('td').innerHTML == 'aGLZ' && idtext_vorher == 'aglzberechnet') {
                    idtext = 'aglzsumme';
                }

                if(idtext) {
                    for(var z = 0, zeile; !!(zeile=zeile0[z]); z++) {
                        var idtext_nummer = '';
                        if(z < 10) {
                            idtext_nummer = '0' + z;
                        } else {
                            idtext_nummer = z;
                        }
                        zeile.setAttribute('id',idtext + idtext_kat + idtext_nummer);
                        if(idtext == 'wochentag') {
                            wochentagzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'datum') {
                            datumzeile_array.push(zeile.innerHTML);
                            zeile.setAttribute('data-innerHTML',zeile.innerHTML);
                            if(zeile.innerHTML != 'Datum' && zeile.innerHTML != '&nbsp;') {
                                zeile.setAttribute('onclick','bereitschaftsauswahlFunction(' + idtext_nummer + ');');
                                zeile.setAttribute('title','Tag zur Bereitschaftsliste hinzufügen');
                                zeile.setAttribute('style','cursor: pointer;');
                            }
                        }
                        if(idtext == 'kalenderwoche') {
                            kalenderwochezeile_array.push(zeile.innerHTML);
                            if(zeile.innerHTML != 'KW' && zeile.innerHTML != '&nbsp;') {
                                zeile.setAttribute('onclick','kalenderwocheFunction(' + idtext_nummer + ');');
                                zeile.setAttribute('title','Woche zur Bereitschaftsliste hinzufügen');
                                zeile.setAttribute('style','cursor: pointer;');
                            }
                        }
                        if(idtext == 'gestempeltvon') {
                            gestempeltvonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltbis') {
                            gestempeltbiszeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause1von') {
                            gestempeltpause1vonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause1bis') {
                            gestempeltpause1biszeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause2von') {
                            gestempeltpause2vonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause2bis') {
                            gestempeltpause2biszeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause3von') {
                            gestempeltpause3vonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause3bis') {
                            gestempeltpause3biszeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause4von') {
                            gestempeltpause4vonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause4bis') {
                            gestempeltpause4biszeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause5von') {
                            gestempeltpause5vonzeile_array.push(zeile.innerHTML);
                        }
                        if(idtext == 'gestempeltepause5bis') {
                            gestempeltpause5biszeile_array.push(zeile.innerHTML);
                        }
                    }
                }
                idtext_vorher = idtext;
            }

            function kalenderwocheFunction(kw) {
                bereitschaftsauswahlFunction(kw);
                var i = parseInt(kw) + 1;
                var ende = 0;
                while(kalenderwochezeile_array[i]) {
                    if(ende == 0 && kalenderwochezeile_array[i] == '&nbsp;' && datumzeile_array[i] != '&nbsp;') {
                        bereitschaftsauswahlFunction(i);
                    } else {
                        ende = 1;
                    }
                    i++;
                }
            }

            function werte_uebernehmen(start,ziel) {
                document.getElementById(ziel).value = document.getElementById(start).value;
            }

            function stunden_rechnen(id,alter_wert,neuer_wert) {
                var rechnen_stunden_gesamt;
                var rechnen_stunden_alter_wert;
                var rechnen_stunden_neuer_wert;
                if(isNaN(parseFloat(document.getElementById('stunden_gesamt').value))) { rechnen_stunden_gesamt = 0; } else { rechnen_stunden_gesamt = parseFloat(document.getElementById('stunden_gesamt').value); }
                if(isNaN(parseFloat(alter_wert))) { rechnen_stunden_alter_wert = 0; } else { rechnen_stunden_alter_wert = parseFloat(alter_wert); }
                if(isNaN(parseFloat(neuer_wert))) { rechnen_stunden_neuer_wert = 0; } else { rechnen_stunden_neuer_wert = parseFloat(neuer_wert); }
                document.getElementById('stunden_gesamt').value = (rechnen_stunden_gesamt - rechnen_stunden_alter_wert + rechnen_stunden_neuer_wert).toFixed(2);
                document.getElementById('stunden' + id).setAttribute('onchange', 'stunden_rechnen(\'' + id + '\',\'' + neuer_wert + '\',this.value)');
            }

            function bereitschaftsauswahlFunction(auswahl) {
                if(auswahl < 10) { auswahl = '0' + auswahl; }
                if(auswahl != 'Datum' && auswahl != '&nbsp;') {
                    var bereitschaft_zeiten_existiert = document.getElementById('bereitschaft_zeiten_' + auswahl);
                    if(bereitschaft_zeiten_existiert) {
                        document.getElementById('datum' + auswahl).setAttribute('style','cursor: pointer;');
                        var bereitschaftszeiten_ausgewaehlt_array_index = bereitschaftszeiten_ausgewaehlt_array.indexOf(auswahl);
                        if (bereitschaftszeiten_ausgewaehlt_array_index > -1) {
                            bereitschaftszeiten_ausgewaehlt_stunden.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);
                            bereitschaftszeiten_ausgewaehlt_liste_zeile.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);
                            bereitschaftszeiten_ausgewaehlt_array.splice(bereitschaftszeiten_ausgewaehlt_array_index, 1);
                        }
                        bereitschaftszeiten_ausgewaehlt_anzeigen();
                    } else {
                        document.getElementById('datum' + auswahl).setAttribute('style','background-color: orangered; cursor: pointer;');
                        var monat = document.querySelector('tbody').querySelectorAll('tr')[4].querySelector('td').innerHTML.split(' ')[0];
                        var monatnr = '00';
                        if(monat == 'Januar') { monatnr = '01'; }
                        if(monat == 'Februar') { monatnr = '02'; }
                        if(monat == 'März') { monatnr = '03'; }
                        if(monat == 'April') { monatnr = '04'; }
                        if(monat == 'Mai') { monatnr = '05'; }
                        if(monat == 'Juni') { monatnr = '06'; }
                        if(monat == 'Juli') { monatnr = '07'; }
                        if(monat == 'August') { monatnr = '08'; }
                        if(monat == 'September') { monatnr = '09'; }
                        if(monat == 'Oktober') { monatnr = '10'; }
                        if(monat == 'November') { monatnr = '11'; }
                        if(monat == 'Dezember') { monatnr = '12'; }
                        var jahr = document.querySelector('tbody').querySelectorAll('tr')[4].querySelector('td').innerHTML.split(' ')[1];
                        var monat_jahr = monatnr + '.' + jahr;

                        var bereitschaft_uhrzeit1_von = '00:00';
                        var bereitschaft_uhrzeit1_bis = '00:00';
                        var bereitschaft_uhrzeit2_von = '00:00';
                        var bereitschaft_uhrzeit2_bis = '00:00';
                        var wegezeit_hin_von = '';
                        var wegezeit_hin_bis = '';
                        var arbeitszeit_von = '';
                        var arbeitszeit_bis = '';
                        var wegezeit_zurueck_von = '';
                        var wegezeit_zurueck_bis = '';
                        var minuten_hin = 0;
                        var minuten_zurueck = 0;
                        var stunden = 0;
                        var stunden_string = '';
                        if(gestempeltvonzeile_array[parseInt(auswahl)] !== null && gestempeltvonzeile_array[parseInt(auswahl)] != '&nbsp;') {
                            if(wochentagzeile_array[parseInt(auswahl)] == 'Sa' || wochentagzeile_array[parseInt(auswahl)] == 'So') {
                                wegezeit_hin_von = gestempeltvonzeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltvonzeile_array[parseInt(auswahl)].split(':')[1];
                            } else {
                                bereitschaft_uhrzeit1_bis = gestempeltvonzeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltvonzeile_array[parseInt(auswahl)].split(':')[1];
                            }
                        }

                        if(typeof gestempeltpause1vonzeile_array[parseInt(auswahl)] !== 'undefined' && gestempeltpause1vonzeile_array[parseInt(auswahl)] !== null && gestempeltpause1vonzeile_array[parseInt(auswahl)] != '&nbsp;') {
                            if(parseInt(gestempeltpause1vonzeile_array[parseInt(auswahl)].split(':')[0]) < parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0])) {
                                bereitschaft_uhrzeit2_von = gestempeltpause1vonzeile_array[parseInt(auswahl)].split(":")[0] + ':' + gestempeltpause1vonzeile_array[parseInt(auswahl)].split(":")[1];
                                wegezeit_hin_von = gestempeltpause1biszeile_array[parseInt(auswahl)].split(":")[0] + ':' + gestempeltpause1biszeile_array[parseInt(auswahl)].split(":")[1];
                                wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(":")[0] + ':' + gestempeltbiszeile_array[parseInt(auswahl)].split(":")[1];
                                minuten_hin = (parseInt(gestempeltpause1biszeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltpause1biszeile_array[parseInt(auswahl)].split(':')[1]);
                                minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1]);
                                stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);
                                wegezeit_hin_bis = '00:00';
                                arbeitszeit_von = '00:00';
                                arbeitszeit_bis = '00:00';
                                wegezeit_zurueck_von = '00:00';
                            } else {
                                if(gestempeltbiszeile_array[parseInt(auswahl)] !== null && gestempeltbiszeile_array[parseInt(auswahl)] != '&nbsp;') {
                                    if(wochentagzeile_array[parseInt(auswahl)] == 'Sa' || wochentagzeile_array[parseInt(auswahl)] == 'So') {
                                        wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1];
                                        minuten_hin = (parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(':')[1]);
                                        minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1]);
                                        stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);
                                        wegezeit_hin_bis = '00:00';
                                        arbeitszeit_von = '00:00';
                                        arbeitszeit_bis = '00:00';
                                        wegezeit_zurueck_von = '00:00';
                                    } else {
                                        bereitschaft_uhrzeit2_von = gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1];
                                    }
                                }
                            }
                        } else {
                            if(gestempeltbiszeile_array[parseInt(auswahl)] !== null && gestempeltbiszeile_array[parseInt(auswahl)] != '&nbsp;') {
                                if(wochentagzeile_array[parseInt(auswahl)] == 'Sa' || wochentagzeile_array[parseInt(auswahl)] == 'So') {
                                    wegezeit_zurueck_bis = gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1];
                                    minuten_hin = (parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(':')[1]);
                                    minuten_zurueck = (parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0]) * 60) + parseInt(gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1]);
                                    stunden = ((minuten_zurueck - minuten_hin)/60).toFixed(2);
                                    wegezeit_hin_bis = '00:00';
                                    arbeitszeit_von = '00:00';
                                    arbeitszeit_bis = '00:00';
                                    wegezeit_zurueck_von = '00:00';
                                } else {
                                    bereitschaft_uhrzeit2_von = gestempeltbiszeile_array[parseInt(auswahl)].split(':')[0] + ':' + gestempeltbiszeile_array[parseInt(auswahl)].split(':')[1];
                                }
                            }
                        }
                        if(parseInt(gestempeltvonzeile_array[parseInt(auswahl)].split(':')[0]) < '7') {
                         // Einsatz vor 7 Uhr --> Zeiten tauschen
                         var bereitschaft_uhrzeit1_bis_temp = bereitschaft_uhrzeit1_bis;
                         var bereitschaft_uhrzeit2_von_temp = bereitschaft_uhrzeit2_von;
                         var wegezeit_hin_von_temp = wegezeit_hin_von;
                         var wegezeit_zurueck_bis_temp = wegezeit_zurueck_bis;
                         bereitschaft_uhrzeit1_bis = wegezeit_hin_von_temp;
                         bereitschaft_uhrzeit2_von = wegezeit_zurueck_bis_temp;
                         wegezeit_hin_von = bereitschaft_uhrzeit1_bis_temp;
                         wegezeit_zurueck_bis = bereitschaft_uhrzeit2_von_temp;
                         minuten_hin_temp = (parseInt(wegezeit_hin_von.split(':')[0]) * 60) + parseInt(wegezeit_hin_von.split(':')[1]);
                         minuten_zurueck_temp = (parseInt(wegezeit_zurueck_bis.split(':')[0]) * 60) + parseInt(wegezeit_zurueck_bis.split(':')[1]);
                         stunden = ((minuten_zurueck_temp - minuten_hin_temp)/60).toFixed(2);
                        }
                        if(bereitschaft_uhrzeit1_von == '00:00' && bereitschaft_uhrzeit1_bis == '00:00') {
                            bereitschaft_uhrzeit2_von = '';
                            bereitschaft_uhrzeit2_bis = '';
                        }
                        if(stunden > 0) {
                            stunden_string = stunden;
                            bereitschaftszeiten_ausgewaehlt_stunden.push(parseFloat(stunden).toFixed(2));
                        } else {
                            bereitschaftszeiten_ausgewaehlt_stunden.push(0);
                        }
                        if(document.getElementById('bereitschaft_erweitert').value == 'true') {
                            bereitschaft_erweitert_body = '<td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="einsatzgrund' + auswahl + '" value="" style="border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="buero_stunden_gerundet' + auswahl + '" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="buero_zuschlaege' + auswahl + '" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td>';
                        }
                        bereitschaftszeiten_ausgewaehlt_liste_zeile.push('<tr id="bereitschaft_zeiten_' + auswahl + '" style="border-bottom: 1px solid gainsboro;"><td onmouseover="this.innerHTML=\'+\'" onmouseout="this.innerHTML=\'&nbsp;\'" onclick="bereitschaftsauswahl_zeile_hinzufuegen(\'bereitschaft_zeiten_' + auswahl + '\');" title="Zeile darunter hinzufügen" style="width: 10px;border-bottom: 1px solid white;">&nbsp;</td><td onmouseover="this.innerHTML=\'-\'" onmouseout="this.innerHTML=\'&nbsp;\'" onclick="bereitschaftsauswahl_zeile_loeschen(\'bereitschaft_zeiten_' + auswahl + '\');" title="Diese Zeile löschen" style="width: 10px;border-bottom: 1px solid white;">&nbsp;</td><td style="border-left: 2px solid black;padding-top: 10px;padding-bottom: 10px;">' + wochentagzeile_array[parseInt(auswahl)] + '</td><td style="border-left: 2px solid black;">' + datumzeile_array[parseInt(auswahl)] + '.' + monat_jahr + '</td><td style="border-left: 2px solid black;"><input type="text" id="bereitschaft_uhrzeit1_von' + auswahl + '" value="' + bereitschaft_uhrzeit1_von + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="bereitschaft_uhrzeit1_bis' + auswahl + '" value="' + bereitschaft_uhrzeit1_bis + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="bereitschaft_uhrzeit2_von' + auswahl + '" value="' + bereitschaft_uhrzeit2_von + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="bereitschaft_uhrzeit2_bis' + auswahl + '" value="' + bereitschaft_uhrzeit2_bis + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="wegezeit_hin_von' + auswahl + '" value="' + wegezeit_hin_von + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="wegezeit_hin_bis' + auswahl + '" value="' + wegezeit_hin_bis + '" onchange="werte_uebernehmen(\'wegezeit_hin_bis' + auswahl + '\',\'arbeitszeit_von' + auswahl + '\')" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="arbeitszeit_von' + auswahl + '" value="' + arbeitszeit_von + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="arbeitszeit_bis' + auswahl + '" value="' + arbeitszeit_bis + '" onchange="werte_uebernehmen(\'arbeitszeit_bis' + auswahl + '\',\'wegezeit_zurueck_von' + auswahl + '\')" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="wegezeit_zurueck_von' + auswahl + '" value="' + wegezeit_zurueck_von + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="wegezeit_zurueck_bis' + auswahl + '" value="' + wegezeit_zurueck_bis + '" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="stunden' + auswahl + '" value="' + stunden_string + '" onchange="stunden_rechnen(\'' + auswahl + '\',\'' + stunden + '\',this.value)" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td>' + bereitschaft_erweitert_body + '</tr>');
                        bereitschaftszeiten_ausgewaehlt_array.push(auswahl);
                        bereitschaftszeiten_ausgewaehlt_anzeigen();
                    }
                }
            }

            function bereitschaftsauswahl_zeile_hinzufuegen(zeilenid) {
                if(document.getElementById('bereitschaft_erweitert').value == 'true') {
                    zeile_hinzufuegen_erweitert = '<td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="einsatzgrund' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="buero_stunden_gerundet' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="buero_zuschlaege' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td>';
                }
                document.getElementById(zeilenid).querySelectorAll('td')[0].innerHTML = '&nbsp;';
                document.getElementById(zeilenid).querySelectorAll('td')[0].removeAttribute('onmouseover');
                document.getElementById(zeilenid).querySelectorAll('td')[0].removeAttribute('onmouseout');
                document.getElementById(zeilenid).querySelectorAll('td')[0].removeAttribute('onclick');
                document.getElementById(zeilenid).querySelectorAll('td')[0].removeAttribute('title');
                document.getElementById(zeilenid).querySelectorAll('td')[1].innerHTML = '&nbsp;';
                document.getElementById(zeilenid).querySelectorAll('td')[1].removeAttribute('onmouseover');
                document.getElementById(zeilenid).querySelectorAll('td')[1].removeAttribute('onmouseout');
                document.getElementById(zeilenid).querySelectorAll('td')[1].removeAttribute('onclick');
                document.getElementById(zeilenid).querySelectorAll('td')[1].removeAttribute('title');
                document.getElementById(zeilenid).insertAdjacentHTML('afterend', '<tr id="' + zeilenid + '_zusatz" style="border-bottom: 1px solid gainsboro;"><td onmouseover="this.innerHTML=\'+\'" onmouseout="this.innerHTML=\'&nbsp;\'" onclick="bereitschaftsauswahl_zeile_hinzufuegen(\'' + zeilenid + '_zusatz\');" title="Zeile darunter hinzufügen" style="width: 10px;border-bottom: 1px solid white;">&nbsp;</td><td onmouseover="this.innerHTML=\'-\'" onmouseout="this.innerHTML=\'&nbsp;\'" onclick="bereitschaftsauswahl_zeile_loeschen(\'bereitschaft_zeiten_' + zeilenid + '_zusatz\');" title="Diese Zeile löschen" style="width: 10px;border-bottom: 1px solid white;">&nbsp;</td><td style="border-left: 2px solid black;padding-top: 10px;padding-bottom: 10px;"><input type="text" id="bereitschaft_wochentag_' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;max-height: 13px;"></td><td style="border-left: 2px solid black;"><input type="text" id="bereitschaft_datum_' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;max-height: 13px;"></td><td style="border-left: 2px solid black;"><input type="text" id="bereitschaft_uhrzeit1_von_' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="bereitschaft_uhrzeit1_bis' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="bereitschaft_uhrzeit2_von' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="bereitschaft_uhrzeit2_bis' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="wegezeit_hin_von' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="wegezeit_hin_bis' + zeilenid + '_zusatz" value="" onchange="werte_uebernehmen(\'wegezeit_hin_bis' + zeilenid + '_zusatz\',\'arbeitszeit_von' + zeilenid + '_zusatz\')" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="arbeitszeit_von' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="arbeitszeit_bis' + zeilenid + '_zusatz" value="" onchange="werte_uebernehmen(\'arbeitszeit_bis' + zeilenid + '_zusatz\',\'wegezeit_zurueck_von' + zeilenid + '_zusatz\')" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;"><input type="text" id="wegezeit_zurueck_von' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 1px solid black;"><input type="text" id="wegezeit_zurueck_bis' + zeilenid + '_zusatz" value="" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td><td style="border-left: 2px solid black;border-right: 2px solid black;"><input type="text" id="stunden' + zeilenid + '_zusatz" value="" onchange="stunden_rechnen(\'' + zeilenid + '_zusatz\',\'0\',this.value)" style="border: none;text-align: center;max-width: 3em;font-size: 12px;font-family: Arial;"></td>' + zeile_hinzufuegen_erweitert + '</tr>');
            }

            function bereitschaftsauswahl_zeile_loeschen(zeilenid) {
                var zeilenid_davor = '';
                if(zeilenid.substr(-7, 7) == '_zusatz') {
                    zeilenid_davor = document.getElementById(zeilenid).previousSibling.getAttribute('id');
                } else {
                    zeilenid_davor = zeilenid;
                }
                if(!isNaN(parseFloat(document.getElementById(zeilenid).querySelector('[id^=\'stunden\']').value))) {
                     document.getElementById('stunden_gesamt').value = (parseFloat(document.getElementById('stunden_gesamt').value) - parseFloat(document.getElementById(zeilenid).querySelector('[id^=\'stunden\']').value)).toFixed(2);
                }
                document.getElementById(zeilenid_davor).querySelectorAll('td')[0].setAttribute('onmouseover','this.innerHTML=\'+\'');\n"
                document.getElementById(zeilenid_davor).querySelectorAll('td')[0].setAttribute('onmouseout','this.innerHTML=\'&nbsp;\'');\n"
                document.getElementById(zeilenid_davor).querySelectorAll('td')[0].setAttribute('onclick','bereitschaftsauswahl_zeile_hinzufuegen(\'' + zeilenid_davor + '\')');
                document.getElementById(zeilenid_davor).querySelectorAll('td')[0].setAttribute('title','Zeile darunter hinzufügen');
                document.getElementById(zeilenid_davor).querySelectorAll('td')[1].setAttribute('onmouseover','this.innerHTML=\'-\'');\n"
                document.getElementById(zeilenid_davor).querySelectorAll('td')[1].setAttribute('onmouseout','this.innerHTML=\'&nbsp;\'');\n"
                document.getElementById(zeilenid_davor).querySelectorAll('td')[1].setAttribute('onclick','bereitschaftsauswahl_zeile_loeschen(\'' + zeilenid_davor + '\')');
                document.getElementById(zeilenid_davor).querySelectorAll('td')[1].setAttribute('title','Diese Zeile löschen');
                document.getElementById(zeilenid).remove();
            }

            function bereitschaftsauswahl_anzeigen() {
                bereitschaftszeiten_ausgewaehlt_liste_zeile.sort();
                document.getElementById('bereitschaft_zeiten').innerHTML += bereitschaftszeiten_ausgewaehlt_liste_zeile.join(' ');
                var stunden_gesamt = 0;
                for(var i=0, n=bereitschaftszeiten_ausgewaehlt_stunden.length; i < n; i++) {
                    stunden_gesamt += parseFloat(bereitschaftszeiten_ausgewaehlt_stunden[i]);
                }
                document.getElementById('stunden_gesamt').value = stunden_gesamt.toFixed(2);
                if(document.getElementById('bereitschaft')) { document.getElementById('bereitschaft').setAttribute('style','font-size: 12px;font-family: Arial, Helvetica, sans-serif;'); }
                if(document.getElementById('settings')) { document.getElementById('settings').remove(); }
                if(document.getElementById('divContainer')) { document.getElementById('divContainer').setAttribute('style','display: none;'); }
                if(document.getElementById('info')) { document.getElementById('info').setAttribute('style','display: none;'); }
            }

            function bereitschaftszeiten_ausgewaehlt_anzeigen() {
                if(bereitschaftszeiten_ausgewaehlt_array[0]) {
                    document.getElementById('datum00').setAttribute('onclick','bereitschaftsauswahl_anzeigen();');
                    document.getElementById('datum00').setAttribute('style','cursor: pointer;');
                    document.getElementById('kalenderwoche00').setAttribute('onclick','bereitschaftsauswahl_anzeigen();');
                    document.getElementById('kalenderwoche00').setAttribute('style','cursor: pointer;');
                } else {
                    document.getElementById('datum00'').removeAttribute('onclick');
                    document.getElementById('datum00').removeAttribute('style');
                    document.getElementById('kalenderwoche00').removeAttribute('onclick');
                    document.getElementById('kalenderwoche00').removeAttribute('style');
                }
            }

            monatsname = document.getElementsByClassName('Criteria')[8].innerHTML.split(' ');
            if(monatsname[0] == 'Januar') { monatszahl = '01'; }
            else if(monatsname[0] == 'Februar') { monatszahl = '02'; }
            else if(monatsname[0] == 'März') { monatszahl = '03'; }
            else if(monatsname[0] == 'April') { monatszahl = '04'; }
            else if(monatsname[0] == 'Mai') { monatszahl = '05'; }
            else if(monatsname[0] == 'Juni') { monatszahl = '06'; }
            else if(monatsname[0] == 'Juli') { monatszahl = '07'; }
            else if(monatsname[0] == 'August') { monatszahl = '08'; }
            else if(monatsname[0] == 'September') { monatszahl = '09'; }
            else if(monatsname[0] == 'Oktober') { monatszahl = '10'; }
            else if(monatsname[0] == 'November') { monatszahl = '11'; }
            else if(monatsname[0] == 'Dezember') { monatszahl = '12'; }
            monat_string = monatszahl + '/' + monatsname[1];

            if(heute.getMonth() == 0) { heute_monatnr = '01'; }
            else if(heute.getMonth() == 1) { heute_monatnr = '02'; }
            else if(heute.getMonth() == 2) { heute_monatnr = '03'; }
            else if(heute.getMonth() == 3) { heute_monatnr = '04'; }
            else if(heute.getMonth() == 4) { heute_monatnr = '05'; }
            else if(heute.getMonth() == 5) { heute_monatnr = '06'; }
            else if(heute.getMonth() == 6) { heute_monatnr = '07'; }
            else if(heute.getMonth() == 7) { heute_monatnr = '08'; }
            else if(heute.getMonth() == 8) { heute_monatnr = '09'; }
            else if(heute.getMonth() == 9) { heute_monatnr = '10'; }
            else { heute_monatnr = heute.getMonth() + 1; }

            if(heute.getDate() < 10) { heute_tagnr = '0' + heute.getDate(); }
            else { heute_tagnr = heute.getDate(); }

            heute_string = heute_tagnr + '.' + heute_monatnr + '.' + heute.getFullYear();

            if(document.getElementById('bereitschaft_erweitert').value == 'true') {
                bereitschaft_erweitert_head1 = '<tr><td colspan="16" style="background-color: white;">&nbsp;</td><td colspan="2" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Büro</td></tr>';\n"
                bereitschaft_erweitert_head2 = '<td style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Einsatzgrund<br>LSA / Veranstaltung</td><td style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Stunden<br>gerundet</td><td style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Zuschläge</td>';\n"
                bereitschaft_erweitert_head3 = '<td style="border: 2px solid black;border-top-width: 1px;">&nbsp;</td><td style="border: 2px solid black;border-top-width: 1px;">&nbsp;</td><td style="border: 2px solid black;border-top-width: 1px;">&nbsp;</td>';\n"
                bereitschaft_erweitert_footer = '<td colspan="3" style="border-top: 2px solid black;border-bottom: 0px;border-left: 0px;">&nbsp;</td>';\n"
                bereitschaft_erweitert_unterschrift = '<tr><td style="width: 20%;">Paderborn, den ' + heute_string + '</td><td style="width: 20%;">&nbsp;</td><td style="width: 10%;">&nbsp;</td><td style="width: 20%;">&nbsp;</td><td style="width: 10%;">&nbsp;</td><td style="width: 20%;">&nbsp;</td></tr><tr><td style="width: 20%;">&nbsp;</td><td style="width: 20%;border-top: 1px solid black;">' + document.getElementsByClassName('Criteria')[2].innerHTML.split(',')[0] + '</td><td style="width:10%">&nbsp;</td><td style="width: 20%;border-top: 1px solid black;">Amtsleitung</td><td style="width:10%">&nbsp;</td><td style="width: 20%;border-top: 1px solid black;">Erfassung Loga</td></tr>';\n"
            } else {
                bereitschaft_erweitert_unterschrift = '<tr><td style="width: 30%;">Paderborn, den ' + heute_string + '</td><td style="width: 30%;">&nbsp;</td><td style="width: 10%;">&nbsp;</td><td style="width: 30%;">&nbsp;</td></tr><tr><td style="width: 30%;">&nbsp;</td><td style="width: 30%;border-top: 1px solid black;">' + document.getElementsByClassName('Criteria')[2].innerHTML.split(',')[0] + '</td><td style="width:10%">&nbsp;</td><td style="width: 30%;border-top: 1px solid black;">Amtsleitung</td></tr>';\n"
            }

            document.getElementById('divContainer').insertAdjacentHTML('afterend', '<div id="bereitschaft" style="font-size: 12px;font-family: Arial, Helvetica, sans-serif;display: none;"><div id="bereitschaft_head" style="margin: 20px;text-align: center;"><div id="ueberschrift" style="font-size: 16px;font-weight: bold;margin-bottom: 10px;">Rufbereitschaft + &Uuml;berstunden ' + monat_string + '</div><div id="personaldaten" style="font-size: 14px;"><span>' + document.getElementsByClassName('Criteria')[2].innerHTML + '</span><span style="margin-left: 20px;margin-right: 100px;">StA 66-15</span><span>Pers. Nr.: ' + document.getElementById('personalnummer').value + '</span></div></div><div id="bereitschaft_data" style="margin-top: 20px;margin-right: 20px;margin-bottom: 20px;text-align: center;"><table style="margin-left: auto;margin-right: auto;border-collapse: collapse;width: 100%;"><thead style="background-color: lightgray;">' + bereitschaft_erweitert_head1 + '<tr><td colspan="2" style="background-color: white;">&nbsp;</td><td colspan="2" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Datum</td><td colspan="4" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Rufbereitschaft<br>Uhrzeit</td><td colspan="2" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Wegezeit</td><td colspan="2" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Arbeitszeit</td><td colspan="2" style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Wegezeit</td><td style="vertical-align: bottom;font-weight: bold;border: 2px solid black;border-bottom: 0px;">Stunden</td>' + bereitschaft_erweitert_head2 + '</tr><tr><td colspan="2" style="background-color: white;">&nbsp;</td><td colspan="2" style="border: 2px solid black;border-top-width: 1px;">&nbsp;</td><td style="border: 2px solid black;border-top-width: 1px;border-right-width: 1px;">von</td><td style="border: 2px solid black;border-top-width: 1px;border-left-width: 1px;">bis</td><td style="border: 2px solid black;border-top-width: 1px;border-right-width: 1px;">von</td><td style="border: 2px solid black;border-top-width: 1px;border-left-width: 1px;">bis</td><td style="border: 2px solid black;border-top-width: 1px;border-right-width: 1px;">von</td><td style="border: 2px solid black;border-top-width: 1px;border-left-width: 1px;">bis</td><td style="border: 2px solid black;border-top-width: 1px;border-right-width: 1px;">von</td><td style="border: 2px solid black;border-top-width: 1px;border-left-width: 1px;">bis</td><td style="border: 2px solid black;border-top-width: 1px;border-right-width: 1px;">von</td><td style="border: 2px solid black;border-top-width: 1px;border-left-width: 1px;">bis</td><td style="border: 2px solid black;border-top-width: 1px;">&nbsp;</td>' + bereitschaft_erweitert_head3 + '</tr></thead><tbody id="bereitschaft_zeiten"></tbody><tfoot><tr><td colspan="2" style="background-color: white;">&nbsp;</td><td colspan="12" style="border-top: 2px solid black;border-bottom: 0px;border-left: 0px;">&nbsp;</td><td style="border: 2px solid black;max-width: 10em;"><input type="text" id="stunden_gesamt" value="0.00" style="border: none;text-align: center;width: 85%;font-size: 12px;font-family: Arial;"></td>' + bereitschaft_erweitert_footer + '</tr></tfoot></table></div><div id="bereitschaft_footer" style="margin: 20px;padding-top: 40px;text-align: center;"><table style="margin-left: auto;margin-right: auto;width: 100%;">' + bereitschaft_erweitert_unterschrift + '</table></div></div>');
            */

            var load_script = document.createElement('script');
            load_script.type = 'text/javascript';
            load_script.innerHTML = script_sideload;
            document.head.appendChild(load_script);

        }
    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        infoniqa_time_web_saldenliste();
    } else {
        document.addEventListener("DOMContentLoaded", infoniqa_time_web_saldenliste, false);
    }

})();