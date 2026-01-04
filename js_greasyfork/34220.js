// ==UserScript==
// @name         Feuerwerk Forum
// @version      0.24
// @description  Einige, kleine Änderungen für das Feuerwerk Forum
// @author       rabe85
// @match        https://www.feuerwerk-forum.de/
// @match        https://www.feuerwerk-forum.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/34220/Feuerwerk%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/34220/Feuerwerk%20Forum.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function fwforum() {

        // Style des Users herausfinden
        var user_find_style = document.querySelector("a[href^='misc/style']");
        var user_style = 'FEUERWERK.net Standard';
        if(user_find_style) user_style = user_find_style.innerHTML;

        // Einstellungen laden
        var setting_erweiterte_einstellungen = GM_getValue('fwf_setting_erweiterte_einstellungen', 0); // (name, default if empty)
        var setting_zitate_vollstaendig = GM_getValue('fwf_setting_zitate_vollstaendig', 1);
        var setting_zitate_schmale_titelzeile = GM_getValue('fwf_setting_zitate_schmale_titelzeile', 1);
        var setting_neukennzeichnung_hervorheben = GM_getValue('fwf_setting_neukennzeichnung_hervorheben', 1);
        var setting_notiz_abschalten = GM_getValue('fwf_setting_notiz_abschalten', 0);
        var setting_useronline_pulse_hinzufuegen = GM_getValue('fwf_setting_useronline_pulse_hinzufuegen', 1);
        var setting_navigationspfeile_hinzufuegen = GM_getValue('fwf_setting_navigationspfeile_hinzufuegen', 1);
        var setting_seitenzahlen_immer_anzeigen = GM_getValue('fwf_setting_seitenzahlen_immer_anzeigen', 1);
        var setting_kalender_anzahl_termine = GM_getValue('fwf_setting_kalender_anzahl_termine', 1);
        var setting_kalender_termine_erweitert = GM_getValue('fwf_setting_kalender_termine_erweitert', 0);
        var setting_useronline_oben = GM_getValue('fwf_setting_useronline_oben', 1);
        var setting_linkfarbe_einfach = GM_getValue('fwf_setting_linkfarbe_einfach', '#a72920'); // Standard: rgb(167, 41, 32)
        var setting_linkfarbe_membercard = GM_getValue('fwf_setting_linkfarbe_membercard', '#a72920');
        var setting_linkfarbe_intern = GM_getValue('fwf_setting_linkfarbe_intern', '#a72920');
        var setting_linkfarbe_extern = GM_getValue('fwf_setting_linkfarbe_extern', '#a72920');
        var setting_linkfarbe_username = GM_getValue('fwf_setting_linkfarbe_username', '#a72920');
        var setting_linkfarbe_medien = GM_getValue('fwf_setting_linkfarbe_medien', '#a72920');
        var setting_linkfarbe_signatur = GM_getValue('fwf_setting_linkfarbe_signatur', '#a72920');
        var setting_linkfarbe_zitate = GM_getValue('fwf_setting_linkfarbe_zitate', '#a72920');
        var setting_linkfarbe_album = GM_getValue('fwf_setting_linkfarbe_album', '#a72920');
        var setting_buttonfarbe_einfach = GM_getValue('fwf_setting_buttonfarbe_einfach', '#f0820c'); // Standard: rgb(240,130,12)
        var setting_buttonfarbe_einfach_hover = GM_getValue('fwf_setting_buttonfarbe_einfach_hover', '#002288'); // Standard: rgb(0,34,136)
        var setting_buttonfarbe_allgemein = GM_getValue('fwf_setting_buttonfarbe_allgemein', '#f0820c');
        var setting_buttonfarbe_action = GM_getValue('fwf_setting_buttonfarbe_action', '#f0820c');
        var setting_buttonfarbe_action_hover = GM_getValue('fwf_setting_buttonfarbe_action_hover', '#002288');
        var setting_buttonfarbe_profil = GM_getValue('fwf_setting_buttonfarbe_profil', '#f0820c');
        var setting_buttonfarbe_profil_hover = GM_getValue('fwf_setting_buttonfarbe_profil_hover', '#002288');
        var setting_farbe_userbanner = GM_getValue('fwf_setting_farbe_userbanner', '#f0820c');
        var setting_farbe_jumpbar = GM_getValue('fwf_setting_farbe_jumpbar', '#f0820c');
        var setting_farbe_umfragen = GM_getValue('fwf_setting_farbe_umfragen', '#f0820c');
        var setting_farbe_suche = GM_getValue('fwf_setting_farbe_suche', '#f0820c');
        var setting_farbe_seitenzahl = GM_getValue('fwf_setting_farbe_seitenzahl', '#f0820c');
        var setting_farbe_seitenzahl_hover = GM_getValue('fwf_setting_farbe_seitenzahl_hover', '#002288');
        var setting_farbe_album_likes = GM_getValue('fwf_setting_farbe_album_likes', '#f0820c');

        var sticky_userbar_auswahl = GM_getValue('fwf_sticky_userbar_auswahl', 'normal');

        var userbar_link1_aktiv = GM_getValue('fwf_userbar_link1_aktiv', 1);
        var userbar_link1_icon = GM_getValue('fwf_userbar_link1_icon', 'fa-home');
        var userbar_link1_href = GM_getValue('fwf_userbar_link1_href', 'https://www.feuerwerk-forum.de/');
        var userbar_link1_text = GM_getValue('fwf_userbar_link1_text', 'Home');

        var userbar_link2_aktiv = GM_getValue('fwf_userbar_link2_aktiv', 1);
        var userbar_link2_icon = GM_getValue('fwf_userbar_link2_icon', 'fa-newspaper-o');
        var userbar_link2_href = GM_getValue('fwf_userbar_link2_href', 'https://www.feuerwerk-forum.de/find-new/posts');
        var userbar_link2_text = GM_getValue('fwf_userbar_link2_text', 'Neue Beitr&auml;ge');

        var userbar_link3_aktiv = GM_getValue('fwf_userbar_link3_aktiv', 1);
        var userbar_link3_icon = GM_getValue('fwf_userbar_link3_icon', 'fa-picture-o');
        var userbar_link3_href = GM_getValue('fwf_userbar_link3_href', 'https://www.feuerwerk-forum.de/album/');
        var userbar_link3_text = GM_getValue('fwf_userbar_link3_text', 'Album');

        var userbar_link4_aktiv = GM_getValue('fwf_userbar_link4_aktiv', 1);
        var userbar_link4_icon = GM_getValue('fwf_userbar_link4_icon', 'fa-calendar');
        var userbar_link4_href = GM_getValue('fwf_userbar_link4_href', 'https://www.feuerwerk-forum.de/kalender/');
        var userbar_link4_text = GM_getValue('fwf_userbar_link4_text', 'Kalender');

        var userbar_link5_aktiv = GM_getValue('fwf_userbar_link5_aktiv', 1);
        var userbar_link5_icon = GM_getValue('fwf_userbar_link5_icon', 'fa-wikipedia-w');
        var userbar_link5_href = GM_getValue('fwf_userbar_link5_href', 'http://www.feuerwerk.net/wiki');
        var userbar_link5_text = GM_getValue('fwf_userbar_link5_text', 'Wiki');

        var userbar_link6_aktiv = GM_getValue('fwf_userbar_link6_aktiv', 1);
        var userbar_link6_icon = GM_getValue('fwf_userbar_link6_icon', 'fa-database');
        var userbar_link6_href = GM_getValue('fwf_userbar_link6_href', 'https://www.feuerwerk-datenbank.de/');
        var userbar_link6_text = GM_getValue('fwf_userbar_link6_text', 'Datenbank');

        var userbar_link7_aktiv = GM_getValue('fwf_userbar_link7_aktiv', 0); // Aktuell nicht aktiv
        var userbar_link7_icon = GM_getValue('fwf_userbar_link7_icon', 'fa-id-card-o');
        var userbar_link7_href = GM_getValue('fwf_userbar_link7_href', 'http://www.feuerwerk.net/online');
        var userbar_link7_text = GM_getValue('fwf_userbar_link7_text', 'Online');

        var userbar_link8_aktiv = GM_getValue('fwf_userbar_link8_aktiv', 0); // Aktuell nicht aktiv
        var userbar_link8_icon = GM_getValue('fwf_userbar_link8_icon', 'fa-shopping-cart');
        var userbar_link8_href = GM_getValue('fwf_userbar_link8_href', 'http://www.feuerwerk.net/shop');
        var userbar_link8_text = GM_getValue('fwf_userbar_link8_text', 'Shop');


        // Funktion - Einstellungen speichern
        function save_settings() {
            if(setting_erweiterte_einstellungen != document.getElementById('fwf_settings_setting_erweiterte_einstellungen').checked) { GM_setValue('fwf_setting_erweiterte_einstellungen', document.getElementById('fwf_settings_setting_erweiterte_einstellungen').checked); }
            if(setting_zitate_vollstaendig != document.getElementById('fwf_settings_setting_zitate_vollstaendig').checked) { GM_setValue('fwf_setting_zitate_vollstaendig', document.getElementById('fwf_settings_setting_zitate_vollstaendig').checked); }
            if(setting_zitate_schmale_titelzeile != document.getElementById('fwf_settings_setting_zitate_schmale_titelzeile').checked) { GM_setValue('fwf_setting_zitate_schmale_titelzeile', document.getElementById('fwf_settings_setting_zitate_schmale_titelzeile').checked); }
            if(setting_neukennzeichnung_hervorheben != document.getElementById('fwf_settings_setting_neukennzeichnung_hervorheben').checked) { GM_setValue('fwf_setting_neukennzeichnung_hervorheben', document.getElementById('fwf_settings_setting_neukennzeichnung_hervorheben').checked); }
            if(setting_notiz_abschalten != document.getElementById('fwf_settings_setting_notiz_abschalten').checked) { GM_setValue('fwf_setting_notiz_abschalten', document.getElementById('fwf_settings_setting_notiz_abschalten').checked); }
            if(setting_useronline_pulse_hinzufuegen != document.getElementById('fwf_settings_setting_useronline_pulse_hinzufuegen').checked) { GM_setValue('fwf_setting_useronline_pulse_hinzufuegen', document.getElementById('fwf_settings_setting_useronline_pulse_hinzufuegen').checked); }
            if(setting_navigationspfeile_hinzufuegen != document.getElementById('fwf_settings_setting_navigationspfeile_hinzufuegen').checked) { GM_setValue('fwf_setting_navigationspfeile_hinzufuegen', document.getElementById('fwf_settings_setting_navigationspfeile_hinzufuegen').checked); }
            if(setting_seitenzahlen_immer_anzeigen != document.getElementById('fwf_settings_setting_seitenzahlen_immer_anzeigen').checked) { GM_setValue('fwf_setting_seitenzahlen_immer_anzeigen', document.getElementById('fwf_settings_setting_seitenzahlen_immer_anzeigen').checked); }
            if(setting_kalender_anzahl_termine != document.getElementById('fwf_settings_setting_kalender_anzahl_termine').checked) { GM_setValue('fwf_setting_kalender_anzahl_termine', document.getElementById('fwf_settings_setting_kalender_anzahl_termine').checked); }
            if(setting_kalender_termine_erweitert != document.getElementById('fwf_settings_setting_kalender_termine_erweitert').checked) { GM_setValue('fwf_setting_kalender_termine_erweitert', document.getElementById('fwf_settings_setting_kalender_termine_erweitert').checked); }
            if(setting_useronline_oben != document.getElementById('fwf_settings_setting_useronline_oben').checked) { GM_setValue('fwf_setting_useronline_oben', document.getElementById('fwf_settings_setting_useronline_oben').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(setting_linkfarbe_membercard != document.getElementById('fwf_settings_setting_linkfarbe_membercard').value) { GM_setValue('fwf_setting_linkfarbe_membercard', document.getElementById('fwf_settings_setting_linkfarbe_membercard').value); }
                if(setting_linkfarbe_intern != document.getElementById('fwf_settings_setting_linkfarbe_intern').value) { GM_setValue('fwf_setting_linkfarbe_intern', document.getElementById('fwf_settings_setting_linkfarbe_intern').value); }
                if(setting_linkfarbe_extern != document.getElementById('fwf_settings_setting_linkfarbe_extern').value) { GM_setValue('fwf_setting_linkfarbe_extern', document.getElementById('fwf_settings_setting_linkfarbe_extern').value); }
                if(setting_linkfarbe_username != document.getElementById('fwf_settings_setting_linkfarbe_username').value) { GM_setValue('fwf_setting_linkfarbe_username', document.getElementById('fwf_settings_setting_linkfarbe_username').value); }
                if(setting_linkfarbe_medien != document.getElementById('fwf_settings_setting_linkfarbe_medien').value) { GM_setValue('fwf_setting_linkfarbe_medien', document.getElementById('fwf_settings_setting_linkfarbe_medien').value); }
                if(setting_linkfarbe_signatur != document.getElementById('fwf_settings_setting_linkfarbe_signatur').value) { GM_setValue('fwf_setting_linkfarbe_signatur', document.getElementById('fwf_settings_setting_linkfarbe_signatur').value); }
                if(setting_linkfarbe_zitate != document.getElementById('fwf_settings_setting_linkfarbe_zitate').value) { GM_setValue('fwf_setting_linkfarbe_zitate', document.getElementById('fwf_settings_setting_linkfarbe_zitate').value); }
                if(setting_linkfarbe_album != document.getElementById('fwf_settings_setting_linkfarbe_album').value) { GM_setValue('fwf_setting_linkfarbe_album', document.getElementById('fwf_settings_setting_linkfarbe_album').value); }
                if(setting_buttonfarbe_allgemein != document.getElementById('fwf_settings_setting_buttonfarbe_allgemein').value) { GM_setValue('fwf_setting_buttonfarbe_allgemein', document.getElementById('fwf_settings_setting_buttonfarbe_allgemein').value); }
                if(setting_buttonfarbe_action != document.getElementById('fwf_settings_setting_buttonfarbe_action').value) { GM_setValue('fwf_setting_buttonfarbe_action', document.getElementById('fwf_settings_setting_buttonfarbe_action').value); }
                if(setting_buttonfarbe_action_hover != document.getElementById('fwf_settings_setting_buttonfarbe_action_hover').value) { GM_setValue('fwf_setting_buttonfarbe_action_hover', document.getElementById('fwf_settings_setting_buttonfarbe_action_hover').value); }
                if(setting_buttonfarbe_profil != document.getElementById('fwf_settings_setting_buttonfarbe_profil').value) { GM_setValue('fwf_setting_buttonfarbe_profil', document.getElementById('fwf_settings_setting_buttonfarbe_profil').value); }
                if(setting_buttonfarbe_profil_hover != document.getElementById('fwf_settings_setting_buttonfarbe_profil_hover').value) { GM_setValue('fwf_setting_buttonfarbe_profil_hover', document.getElementById('fwf_settings_setting_buttonfarbe_profil_hover').value); }
                if(setting_farbe_userbanner != document.getElementById('fwf_settings_setting_farbe_userbanner').value) { GM_setValue('fwf_setting_farbe_userbanner', document.getElementById('fwf_settings_setting_farbe_userbanner').value); }
                if(setting_farbe_jumpbar != document.getElementById('fwf_settings_setting_farbe_jumpbar').value) { GM_setValue('fwf_setting_farbe_jumpbar', document.getElementById('fwf_settings_setting_farbe_jumpbar').value); }
                if(setting_farbe_umfragen != document.getElementById('fwf_settings_setting_farbe_umfragen').value) { GM_setValue('fwf_setting_farbe_umfragen', document.getElementById('fwf_settings_setting_farbe_umfragen').value); }
                if(setting_farbe_suche != document.getElementById('fwf_settings_setting_farbe_suche').value) { GM_setValue('fwf_setting_farbe_suche', document.getElementById('fwf_settings_setting_farbe_suche').value); }
                if(setting_farbe_seitenzahl != document.getElementById('fwf_settings_setting_farbe_seitenzahl').value) { GM_setValue('fwf_setting_farbe_seitenzahl', document.getElementById('fwf_settings_setting_farbe_seitenzahl').value); }
                if(setting_farbe_seitenzahl_hover != document.getElementById('fwf_settings_setting_farbe_seitenzahl_hover').value) { GM_setValue('fwf_setting_farbe_seitenzahl_hover', document.getElementById('fwf_settings_setting_farbe_seitenzahl_hover').value); }
                if(setting_farbe_album_likes != document.getElementById('fwf_settings_setting_farbe_album_likes').value) { GM_setValue('fwf_setting_farbe_album_likes', document.getElementById('fwf_settings_setting_farbe_album_likes').value); }
            } else {
                if(setting_linkfarbe_einfach != document.getElementById('fwf_settings_setting_linkfarbe_einfach').value) { GM_setValue('fwf_setting_linkfarbe_einfach', document.getElementById('fwf_settings_setting_linkfarbe_einfach').value); }
                if(setting_buttonfarbe_einfach != document.getElementById('fwf_settings_setting_buttonfarbe_einfach').value) { GM_setValue('fwf_setting_buttonfarbe_einfach', document.getElementById('fwf_settings_setting_buttonfarbe_einfach').value); }
                if(setting_buttonfarbe_einfach_hover != document.getElementById('fwf_settings_setting_buttonfarbe_einfach_hover').value) { GM_setValue('fwf_setting_buttonfarbe_einfach_hover', document.getElementById('fwf_settings_setting_buttonfarbe_einfach_hover').value); }
            }

            if(sticky_userbar_auswahl != document.getElementById('fwf_settings_sticky_userbar_auswahl').value) { GM_setValue('fwf_sticky_userbar_auswahl', document.getElementById('fwf_settings_sticky_userbar_auswahl').value); }

            if(userbar_link1_aktiv != document.getElementById('fwf_settings_userbar_link1_aktiv').checked) { GM_setValue('fwf_userbar_link1_aktiv', document.getElementById('fwf_settings_userbar_link1_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link1_icon != document.getElementById('fwf_settings_userbar_link1_icon').value) { GM_setValue('fwf_userbar_link1_icon', document.getElementById('fwf_settings_userbar_link1_icon').value); }
                if(userbar_link1_href != document.getElementById('fwf_settings_userbar_link1_href').value) { GM_setValue('fwf_userbar_link1_href', document.getElementById('fwf_settings_userbar_link1_href').value); }
                if(userbar_link1_text != document.getElementById('fwf_settings_userbar_link1_text').value) { GM_setValue('fwf_userbar_link1_text', document.getElementById('fwf_settings_userbar_link1_text').value); }
            }

            if(userbar_link2_aktiv != document.getElementById('fwf_settings_userbar_link2_aktiv').checked) { GM_setValue('fwf_userbar_link2_aktiv', document.getElementById('fwf_settings_userbar_link2_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link2_icon != document.getElementById('fwf_settings_userbar_link2_icon').value) { GM_setValue('fwf_userbar_link2_icon', document.getElementById('fwf_settings_userbar_link2_icon').value); }
                if(userbar_link2_href != document.getElementById('fwf_settings_userbar_link2_href').value) { GM_setValue('fwf_userbar_link2_href', document.getElementById('fwf_settings_userbar_link2_href').value); }
                if(userbar_link2_text != document.getElementById('fwf_settings_userbar_link2_text').value) { GM_setValue('fwf_userbar_link2_text', document.getElementById('fwf_settings_userbar_link2_text').value); }
            }

            if(userbar_link3_aktiv != document.getElementById('fwf_settings_userbar_link3_aktiv').checked) { GM_setValue('fwf_userbar_link3_aktiv', document.getElementById('fwf_settings_userbar_link3_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link3_icon != document.getElementById('fwf_settings_userbar_link3_icon').value) { GM_setValue('fwf_userbar_link3_icon', document.getElementById('fwf_settings_userbar_link3_icon').value); }
                if(userbar_link3_href != document.getElementById('fwf_settings_userbar_link3_href').value) { GM_setValue('fwf_userbar_link3_href', document.getElementById('fwf_settings_userbar_link3_href').value); }
                if(userbar_link3_text != document.getElementById('fwf_settings_userbar_link3_text').value) { GM_setValue('fwf_userbar_link3_text', document.getElementById('fwf_settings_userbar_link3_text').value); }
            }

            if(userbar_link4_aktiv != document.getElementById('fwf_settings_userbar_link4_aktiv').checked) { GM_setValue('fwf_userbar_link4_aktiv', document.getElementById('fwf_settings_userbar_link4_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link4_icon != document.getElementById('fwf_settings_userbar_link4_icon').value) { GM_setValue('fwf_userbar_link4_icon', document.getElementById('fwf_settings_userbar_link4_icon').value); }
                if(userbar_link4_href != document.getElementById('fwf_settings_userbar_link4_href').value) { GM_setValue('fwf_userbar_link4_href', document.getElementById('fwf_settings_userbar_link4_href').value); }
                if(userbar_link4_text != document.getElementById('fwf_settings_userbar_link4_text').value) { GM_setValue('fwf_userbar_link4_text', document.getElementById('fwf_settings_userbar_link4_text').value); }
            }

            if(userbar_link5_aktiv != document.getElementById('fwf_settings_userbar_link5_aktiv').checked) { GM_setValue('fwf_userbar_link5_aktiv', document.getElementById('fwf_settings_userbar_link5_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link5_icon != document.getElementById('fwf_settings_userbar_link5_icon').value) { GM_setValue('fwf_userbar_link5_icon', document.getElementById('fwf_settings_userbar_link5_icon').value); }
                if(userbar_link5_href != document.getElementById('fwf_settings_userbar_link5_href').value) { GM_setValue('fwf_userbar_link5_href', document.getElementById('fwf_settings_userbar_link5_href').value); }
                if(userbar_link5_text != document.getElementById('fwf_settings_userbar_link5_text').value) { GM_setValue('fwf_userbar_link5_text', document.getElementById('fwf_settings_userbar_link5_text').value); }
            }

            if(userbar_link6_aktiv != document.getElementById('fwf_settings_userbar_link6_aktiv').checked) { GM_setValue('fwf_userbar_link6_aktiv', document.getElementById('fwf_settings_userbar_link6_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link6_icon != document.getElementById('fwf_settings_userbar_link6_icon').value) { GM_setValue('fwf_userbar_link6_icon', document.getElementById('fwf_settings_userbar_link6_icon').value); }
                if(userbar_link6_href != document.getElementById('fwf_settings_userbar_link6_href').value) { GM_setValue('fwf_userbar_link6_href', document.getElementById('fwf_settings_userbar_link6_href').value); }
                if(userbar_link6_text != document.getElementById('fwf_settings_userbar_link6_text').value) { GM_setValue('fwf_userbar_link6_text', document.getElementById('fwf_settings_userbar_link6_text').value); }
            }

            if(userbar_link7_aktiv != document.getElementById('fwf_settings_userbar_link7_aktiv').checked) { GM_setValue('fwf_userbar_link7_aktiv', document.getElementById('fwf_settings_userbar_link7_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link7_icon != document.getElementById('fwf_settings_userbar_link7_icon').value) { GM_setValue('fwf_userbar_link7_icon', document.getElementById('fwf_settings_userbar_link7_icon').value); }
                if(userbar_link7_href != document.getElementById('fwf_settings_userbar_link7_href').value) { GM_setValue('fwf_userbar_link7_href', document.getElementById('fwf_settings_userbar_link7_href').value); }
                if(userbar_link7_text != document.getElementById('fwf_settings_userbar_link7_text').value) { GM_setValue('fwf_userbar_link7_text', document.getElementById('fwf_settings_userbar_link7_text').value); }
            }

            if(userbar_link8_aktiv != document.getElementById('fwf_settings_userbar_link8_aktiv').checked) { GM_setValue('fwf_userbar_link8_aktiv', document.getElementById('fwf_settings_userbar_link8_aktiv').checked); }
            if(setting_erweiterte_einstellungen == 1) {
                if(userbar_link8_icon != document.getElementById('fwf_settings_userbar_link8_icon').value) { GM_setValue('fwf_userbar_link8_icon', document.getElementById('fwf_settings_userbar_link8_icon').value); }
                if(userbar_link8_href != document.getElementById('fwf_settings_userbar_link8_href').value) { GM_setValue('fwf_userbar_link8_href', document.getElementById('fwf_settings_userbar_link8_href').value); }
                if(userbar_link8_text != document.getElementById('fwf_settings_userbar_link8_text').value) { GM_setValue('fwf_userbar_link8_text', document.getElementById('fwf_settings_userbar_link8_text').value); }
            }
            window.scrollTo(0, 0);
            location.reload();
        }

        // Funktion - Einstellungen ändern
        function change_settings() {
            if(!document.getElementById('fwf_settings')) {
                var fwf_settings_setting_erweiterte_einstellungen_checked = '';
                if(setting_erweiterte_einstellungen == 1) fwf_settings_setting_erweiterte_einstellungen_checked = 'checked="checked"';
                var fwf_settings_setting_zitate_vollstaendig_checked = '';
                if(setting_zitate_vollstaendig == 1) fwf_settings_setting_zitate_vollstaendig_checked = 'checked="checked"';
                var fwf_settings_setting_zitate_schmale_titelzeile_checked = '';
                if(setting_zitate_schmale_titelzeile == 1) fwf_settings_setting_zitate_schmale_titelzeile_checked = 'checked="checked"';
                var fwf_settings_setting_neukennzeichnung_hervorheben_checked = '';
                if(setting_neukennzeichnung_hervorheben == 1) fwf_settings_setting_neukennzeichnung_hervorheben_checked = 'checked="checked"';
                var fwf_settings_setting_notiz_abschalten_checked = '';
                if(setting_notiz_abschalten == 1) fwf_settings_setting_notiz_abschalten_checked = 'checked="checked"';
                var fwf_settings_setting_useronline_pulse_hinzufuegen_checked = '';
                if(setting_useronline_pulse_hinzufuegen == 1) fwf_settings_setting_useronline_pulse_hinzufuegen_checked = 'checked="checked"';
                var fwf_settings_setting_navigationspfeile_hinzufuegen_checked = '';
                if(setting_navigationspfeile_hinzufuegen == 1) fwf_settings_setting_navigationspfeile_hinzufuegen_checked = 'checked="checked"';
                var fwf_settings_setting_seitenzahlen_immer_anzeigen_checked = '';
                if(setting_seitenzahlen_immer_anzeigen == 1) fwf_settings_setting_seitenzahlen_immer_anzeigen_checked = 'checked="checked"';
                var fwf_settings_setting_kalender_anzahl_termine_checked = '';
                if(setting_kalender_anzahl_termine == 1) fwf_settings_setting_kalender_anzahl_termine_checked = 'checked="checked"';
                var fwf_settings_setting_kalender_termine_erweitert_checked = '';
                if(setting_kalender_termine_erweitert == 1) fwf_settings_setting_kalender_termine_erweitert_checked = 'checked="checked"';
                var fwf_settings_setting_useronline_oben_checked = '';
                if(setting_useronline_oben == 1) fwf_settings_setting_useronline_oben_checked = 'checked="checked"';
                var fwf_settings_sticky_userbar_auswahl_selected_aus = '';
                var fwf_settings_sticky_userbar_auswahl_selected_normal = '';
                var fwf_settings_sticky_userbar_auswahl_selected_fixed = '';
                var fwf_settings_sticky_userbar_auswahl_selected_scroll = '';
                if(sticky_userbar_auswahl == 'aus') fwf_settings_sticky_userbar_auswahl_selected_aus = 'selected="selected"';
                if(sticky_userbar_auswahl == 'normal') fwf_settings_sticky_userbar_auswahl_selected_normal = 'selected="selected"';
                if(sticky_userbar_auswahl == 'fixed') fwf_settings_sticky_userbar_auswahl_selected_fixed = 'selected="selected"';
                if(sticky_userbar_auswahl == 'scroll') fwf_settings_sticky_userbar_auswahl_selected_scroll = 'selected="selected"';
                var fwf_settings_userbar_link1_aktiv_checked = '';
                if(userbar_link1_aktiv == 1) fwf_settings_userbar_link1_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link2_aktiv_checked = '';
                if(userbar_link2_aktiv == 1) fwf_settings_userbar_link2_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link3_aktiv_checked = '';
                if(userbar_link3_aktiv == 1) fwf_settings_userbar_link3_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link4_aktiv_checked = '';
                if(userbar_link4_aktiv == 1) fwf_settings_userbar_link4_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link5_aktiv_checked = '';
                if(userbar_link5_aktiv == 1) fwf_settings_userbar_link5_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link6_aktiv_checked = '';
                if(userbar_link6_aktiv == 1) fwf_settings_userbar_link6_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link7_aktiv_checked = '';
                if(userbar_link7_aktiv == 1) fwf_settings_userbar_link7_aktiv_checked = 'checked="checked"';
                var fwf_settings_userbar_link8_aktiv_checked = '';
                if(userbar_link8_aktiv == 1) fwf_settings_userbar_link8_aktiv_checked = 'checked="checked"';

                var settings_div = '<div id="fwf_settings" style="background-color:rgba(255,255,255,0.25); display:inline-block; width:50%; margin-left:25%; padding-top:5px; padding-bottom:5px;">';

                if(setting_erweiterte_einstellungen == 1) { settings_div += '<div style="text-align:center; margin-bottom:15px; margin-top:5px; font-weight:bold;">Script-Einstellungen (erweitert)</div>'; }
                else { settings_div += '<div style="text-align:center; margin-bottom:15px; margin-top:5px; font-weight:bold;">Script-Einstellungen</div>'; }
                settings_div += '<div style="float:right; margin-right:10px; margin-top:-37px; font-weight:bold; cursor:pointer;" onclick="close_settings();" title="Ohne &Auml;nderung schlie&szlig;en">&nbsp;&nbsp;&nbsp;X</div>';

                settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Allgemeines</div>';
                settings_div += '<div><label for="fwf_settings_setting_erweiterte_einstellungen" style="margin-left:30px; display:inline-block;">Erweiterte Einstellungen:<input type="checkbox" id="fwf_settings_setting_erweiterte_einstellungen" ' + fwf_settings_setting_erweiterte_einstellungen_checked + ' style="margin-left:85px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_zitate_vollstaendig" style="margin-left:30px; display:inline-block;">Zitate vollst&auml;ndig anzeigen:<input type="checkbox" id="fwf_settings_setting_zitate_vollstaendig" ' + fwf_settings_setting_zitate_vollstaendig_checked + ' style="margin-left:71px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_zitate_schmale_titelzeile" style="margin-left:30px; display:inline-block;">Zitate schmaler anzeigen:<input type="checkbox" id="fwf_settings_setting_zitate_schmale_titelzeile" ' + fwf_settings_setting_zitate_schmale_titelzeile_checked + ' style="margin-left:81px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_neukennzeichnung_hervorheben" style="margin-left:30px; display:inline-block;">Neu-Kennzeichnung hervorheben:<input type="checkbox" id="fwf_settings_setting_neukennzeichnung_hervorheben" ' + fwf_settings_setting_neukennzeichnung_hervorheben_checked + ' style="margin-left:23px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_notiz_abschalten" style="margin-left:30px; display:inline-block;">Notizen abschalten:<input type="checkbox" id="fwf_settings_setting_notiz_abschalten" ' + fwf_settings_setting_notiz_abschalten_checked + ' style="margin-left:118px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_useronline_pulse_hinzufuegen" style="margin-left:30px; display:inline-block;">Pulsierende Useronline-Anzeige:<input type="checkbox" id="fwf_settings_setting_useronline_pulse_hinzufuegen" ' + fwf_settings_setting_useronline_pulse_hinzufuegen_checked + ' style="margin-left:36px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_navigationspfeile_hinzufuegen" style="margin-left:30px; display:inline-block;">Navigation bei Beitragsnummer:<input type="checkbox" id="fwf_settings_setting_navigationspfeile_hinzufuegen" ' + fwf_settings_setting_navigationspfeile_hinzufuegen_checked + ' style="margin-left:37px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_seitenzahlen_immer_anzeigen" style="margin-left:30px; display:inline-block;">Seitenzahlen immer anzeigen:<input type="checkbox" id="fwf_settings_setting_seitenzahlen_immer_anzeigen" ' + fwf_settings_setting_seitenzahlen_immer_anzeigen_checked + ' style="margin-left:51px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_kalender_anzahl_termine" style="margin-left:30px; display:inline-block;">Anzahl der Termine/Tag anzeigen:<input type="checkbox" id="fwf_settings_setting_kalender_anzahl_termine" ' + fwf_settings_setting_kalender_anzahl_termine_checked + ' style="margin-left:26px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_kalender_termine_erweitert" style="margin-left:30px; display:inline-block;">Termine vollst&auml;ndig anzeigen:<input type="checkbox" id="fwf_settings_setting_kalender_termine_erweitert" ' + fwf_settings_setting_kalender_termine_erweitert_checked + ' style="margin-left:53px; border:0; vertical-align:middle;"></label></div>';
                settings_div += '<div><label for="fwf_settings_setting_useronline_oben" style="margin-left:30px; display:inline-block;">Aktive Besucher oben anzeigen:<input type="checkbox" id="fwf_settings_setting_useronline_oben" ' + fwf_settings_setting_useronline_oben_checked + ' style="margin-left:40px; border:0; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Linkfarben</div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_membercard" style="margin-left:30px; display:inline-block;">Linkfarbe Membercard &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_membercard" value="' + setting_linkfarbe_membercard + '" style="margin-left:43px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_intern" style="margin-left:30px; display:inline-block;">Linkfarbe Intern &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_intern" value="' + setting_linkfarbe_intern + '" style="margin-left:88px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_extern" style="margin-left:30px; display:inline-block;">Linkfarbe Extern &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_extern" value="' + setting_linkfarbe_extern + '" style="margin-left:85px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_username" style="margin-left:30px; display:inline-block;">Linkfarbe Username &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_username" value="' + setting_linkfarbe_username + '" style="margin-left:60px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_medien" style="margin-left:30px; display:inline-block;">Linkfarbe Medien &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_medien" value="' + setting_linkfarbe_medien + '" style="margin-left:79px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_signatur" style="margin-left:30px; display:inline-block;">Linkfarbe Signatur &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_signatur" value="' + setting_linkfarbe_signatur + '" style="margin-left:73px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_zitate" style="margin-left:30px; display:inline-block;">Linkfarbe Zitate &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_zitate" value="' + setting_linkfarbe_zitate + '" style="margin-left:91px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_album" style="margin-left:30px; display:inline-block;">Linkfarbe Album Text &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_album" value="' + setting_linkfarbe_album + '" style="margin-left:54px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Buttonfarben</div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_allgemein" style="margin-left:30px; display:inline-block;">Buttonfarbe Allgemein &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_allgemein" value="' + setting_buttonfarbe_allgemein + '" style="margin-left:46px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_action" style="margin-left:30px; display:inline-block;">Buttonfarbe Action &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_action" value="' + setting_buttonfarbe_action + '" style="margin-left:69px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_action_hover" style="margin-left:30px; display:inline-block;">Buttonfarbe Action Hover &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_action_hover" value="' + setting_buttonfarbe_action_hover + '" style="margin-left:26px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_profil" style="margin-left:30px; display:inline-block;">Buttonfarbe Profil &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_profil" value="' + setting_buttonfarbe_profil + '" style="margin-left:76px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_profil_hover" style="margin-left:30px; display:inline-block;">Buttonfarbe Profil Hover &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_profil_hover" value="' + setting_buttonfarbe_profil_hover + '" style="margin-left:33px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Weitere Farben</div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_userbanner" style="margin-left:30px; display:inline-block;">Farbe der Userbanner &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_userbanner" value="' + setting_farbe_userbanner + '" style="margin-left:49px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_jumpbar" style="margin-left:30px; display:inline-block;">Farbe der Jumpbar &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_jumpbar" value="' + setting_farbe_jumpbar + '" style="margin-left:70px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_umfragen" style="margin-left:30px; display:inline-block;">Farbe bei Umfragen &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_umfragen" value="' + setting_farbe_umfragen + '" style="margin-left:63px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_suche" style="margin-left:30px; display:inline-block;">Farbe des Suchfeldes &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_suche" value="' + setting_farbe_suche + '" style="margin-left:55px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_seitenzahl" style="margin-left:30px; display:inline-block;">Farbe der Seitenzahl &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_seitenzahl" value="' + setting_farbe_seitenzahl + '" style="margin-left:59px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_seitenzahl_hover" style="margin-left:30px; display:inline-block;">Farbe der Seitenzahl Hover &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_seitenzahl_hover" value="' + setting_farbe_seitenzahl_hover + '" style="margin-left:16px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_farbe_album_likes" style="margin-left:30px; display:inline-block;">Farbe der Likes im Album &auml;ndern:<input type="color" id="fwf_settings_setting_farbe_album_likes" value="' + setting_farbe_album_likes + '" style="margin-left:27px; margin-bottom: 3px;border:0;"></label></div>';
                } else {
                    settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Farben</div>';
                    settings_div += '<div><label for="fwf_settings_setting_linkfarbe_einfach" style="margin-left:30px; display:inline-block;">Linkfarbe &auml;ndern:<input type="color" id="fwf_settings_setting_linkfarbe_einfach" value="' + setting_linkfarbe_einfach + '" style="margin-left:131px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_einfach" style="margin-left:30px; display:inline-block;">Buttonfarbe &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_einfach" value="' + setting_buttonfarbe_einfach + '" style="margin-left:113px; margin-bottom: 3px;border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_setting_buttonfarbe_einfach_hover" style="margin-left:30px; display:inline-block;">Buttonfarbe Hover &auml;ndern:<input type="color" id="fwf_settings_setting_buttonfarbe_einfach_hover" value="' + setting_buttonfarbe_einfach_hover + '" style="margin-left:70px; margin-bottom: 3px;border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; padding-bottom:5px; margin-top:15px; padding-top:5px; padding-left:20px; font-weight:bold; display:block; background-color:rgba(255,255,255,0.25);">Userbar</div>';
                settings_div += '<div><label for="fwf_settings_sticky_userbar_auswahl" style="margin-left:30px; display:inline-block;">Modus:<select id="fwf_settings_sticky_userbar_auswahl" style="margin-left:7px; border:0;"><option value="aus" ' + fwf_settings_sticky_userbar_auswahl_selected_aus + '>Aus</option><option value="normal" ' + fwf_settings_sticky_userbar_auswahl_selected_normal + '>Normal</option><option value="fixed" ' + fwf_settings_sticky_userbar_auswahl_selected_fixed + '>Immer anzeigen</option><option value="scroll" ' + fwf_settings_sticky_userbar_auswahl_selected_scroll + '>Beim Hochscrollen anzeigen</option></select></label></div>';

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block">Userbar-Link 1 <span style="font-weight:normal;">(' + userbar_link1_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link1_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link1_aktiv" ' + fwf_settings_userbar_link1_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link1_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link1_icon" value="' + userbar_link1_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link1_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link1_href" value="' + userbar_link1_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link1_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link1_text" value="' + userbar_link1_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 2 <span style="font-weight:normal;">(' + userbar_link2_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link2_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link2_aktiv" ' + fwf_settings_userbar_link2_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link2_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link2_icon" value="' + userbar_link2_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link2_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link2_href" value="' + userbar_link2_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link2_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link2_text" value="' + userbar_link2_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 3 <span style="font-weight:normal;">(' + userbar_link3_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link3_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link3_aktiv" ' + fwf_settings_userbar_link3_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link3_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link3_icon" value="' + userbar_link3_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link3_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link3_href" value="' + userbar_link3_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link3_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link3_text" value="' + userbar_link3_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 4 <span style="font-weight:normal;">(' + userbar_link4_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link4_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link4_aktiv" ' + fwf_settings_userbar_link4_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link4_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link4_icon" value="' + userbar_link4_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link4_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link4_href" value="' + userbar_link4_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link4_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link4_text" value="' + userbar_link4_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 5 <span style="font-weight:normal;">(' + userbar_link5_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link5_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link5_aktiv" ' + fwf_settings_userbar_link5_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link5_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link5_icon" value="' + userbar_link5_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link5_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link5_href" value="' + userbar_link5_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link5_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link5_text" value="' + userbar_link5_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 6 <span style="font-weight:normal;">(' + userbar_link6_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link6_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link6_aktiv" ' + fwf_settings_userbar_link6_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link6_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link6_icon" value="' + userbar_link6_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link6_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link6_href" value="' + userbar_link6_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link6_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link6_text" value="' + userbar_link6_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 7 <span style="font-weight:normal;">(' + userbar_link7_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link7_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link7_aktiv" ' + fwf_settings_userbar_link7_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link7_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link7_icon" value="' + userbar_link7_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link7_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link7_href" value="' + userbar_link7_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link7_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link7_text" value="' + userbar_link7_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block;">Userbar-Link 8 <span style="font-weight:normal;">(' + userbar_link8_text + ')</span></div>';
                settings_div += '<div><label for="fwf_settings_userbar_link8_aktiv" style="margin-left:30px; display:inline-block;">Aktiv:<input type="checkbox" id="fwf_settings_userbar_link8_aktiv" ' + fwf_settings_userbar_link8_aktiv_checked + ' style="margin-left:20px; vertical-align:middle;"></label></div>';
                if(setting_erweiterte_einstellungen == 1) {
                    settings_div += '<div><label for="fwf_settings_userbar_link8_icon" style="margin-left:30px; display:inline-block;"><a href="http://fontawesome.io/icons/" target="_blank">Icon:</a><input type="text" id="fwf_settings_userbar_link8_icon" value="' + userbar_link8_icon + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link8_href" style="margin-left:30px; display:inline-block;">URL:<input type="url" id="fwf_settings_userbar_link8_href" value="' + userbar_link8_href + '" style="margin-left:25px; width:400px; border:0;"></label></div>';
                    settings_div += '<div><label for="fwf_settings_userbar_link8_text" style="margin-left:30px; display:inline-block;">Text:<input type="text" id="fwf_settings_userbar_link8_text" value="' + userbar_link8_text + '" style="margin-left:24px; width:400px; border:0;"></label></div>';
                }

                var reset_all_button = '';
                if(setting_erweiterte_einstellungen == 1) {
                    reset_all_button = '&nbsp;<button type="button" id="fwf_settings_reset_all_button">Alles auf Standard zur&uuml;cksetzen</button>';
                }
                settings_div += '<div style="margin-bottom:10px; margin-top:20px; margin-left:20px; font-weight:bold; display:block; text-align:center;"><button type="submit" id="fwf_settings_save_button">Speichern</button>&nbsp;<button type="reset" id="fwf_settings_reset_button">Eingaben zur&uuml;cksetzen</button>' + reset_all_button + '</div>';
                settings_div += '</div>';
                document.getElementById('content').insertAdjacentHTML('beforebegin', settings_div);
                window.scrollTo(0, 0);
            }

            // Funktion - Erweiterte Einstellungen direkt umschalten
            function settings_changeview() {
                GM_setValue('fwf_setting_erweiterte_einstellungen', document.getElementById('fwf_settings_setting_erweiterte_einstellungen').checked);
                document.getElementById("fwf_settings").remove();
                setting_erweiterte_einstellungen = GM_getValue('fwf_setting_erweiterte_einstellungen', 0);
                change_settings();
            }

            // Funktion - Reset (Eingaben zurücksetzen)
            function reset_settings() {
                document.getElementById("fwf_settings").remove();
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

            document.getElementById('fwf_settings_setting_erweiterte_einstellungen').addEventListener("change", settings_changeview, false);
            document.getElementById('fwf_settings_save_button').addEventListener("click", save_settings, false);
            document.getElementById('fwf_settings_reset_button').addEventListener("click", reset_settings, false);
            if(setting_erweiterte_einstellungen == 1) {
                document.getElementById('fwf_settings_reset_all_button').addEventListener("click", reset_all_settings, false);
            }
        }


        // Einstellungen schließen
        var settings_close_script_start = document.createElement('script');
        var settings_close_script_function = document.createTextNode('function close_settings() { document.getElementById("fwf_settings").remove(); }');
        settings_close_script_start.appendChild(settings_close_script_function);
        document.head.appendChild(settings_close_script_start);

        // Einfache Farben festlegen
        if(setting_erweiterte_einstellungen === 0) {

            // Linkfarben einfach
            setting_linkfarbe_membercard = setting_linkfarbe_einfach;
            setting_linkfarbe_intern = setting_linkfarbe_einfach;
            setting_linkfarbe_extern = setting_linkfarbe_einfach;
            setting_linkfarbe_username = setting_linkfarbe_einfach;
            setting_linkfarbe_medien = setting_linkfarbe_einfach;
            setting_linkfarbe_signatur = setting_linkfarbe_einfach;
            setting_linkfarbe_zitate = setting_linkfarbe_einfach;
            setting_linkfarbe_album = setting_linkfarbe_einfach;

            // Buttonfarben einfach
            setting_buttonfarbe_allgemein = setting_buttonfarbe_einfach;
            setting_buttonfarbe_action = setting_buttonfarbe_einfach;
            setting_buttonfarbe_action_hover = setting_buttonfarbe_einfach_hover;
            setting_buttonfarbe_profil = setting_buttonfarbe_einfach;
            setting_buttonfarbe_profil_hover = setting_buttonfarbe_einfach_hover;
        }

        // Funktion - Userbar nur beim Hochscrollen oben am Rand anzeigen
        var sticky_userbar_scroll_position_old = 0;
        function sticky_userbar_scroll() {
            var sticky_userbar_scroll_position = document.documentElement.scrollTop;
            if(sticky_userbar_scroll_position < sticky_userbar_scroll_position_old) {
                var sticky_userbar_backgroundimg = '';
                if(user_style != 'FEUERWERK.net Klassik') sticky_userbar_backgroundimg = 'background-image:url("https://www.feuerwerk-forum.de/styles/feuerwerk/uix/bg/fwknet-bg_30mp_264ea6.jpg"); background-repeat:no-repeat; background-size:cover;';
                document.getElementById('userBar').setAttribute('style','z-index:85000; top:0px; position:fixed; width:100%; background-color:rgb(62,75,143); display:inline;' + sticky_userbar_backgroundimg);
                document.getElementById('navigation').setAttribute('style','margin-top:70px;');
            } else {
                document.getElementById('userBar').setAttribute('style','display:block;');
                document.getElementById('navigation').setAttribute('style','margin-top:30px;');
            }
            sticky_userbar_scroll_position_old = sticky_userbar_scroll_position;
        }


        var url_path = window.location.pathname;
        var url_array = url_path.split("/");
        var url_array_lenght = url_array.length - 1;
        var url_switch = url_array[url_array_lenght];

        if(url_array[1] == 'kalender') {

            // Kalender - Fancybox CSS laden
            var load_fancybox_css = document.createElement('link');
            load_fancybox_css.rel = 'StyleSheet';
            load_fancybox_css.type = 'text/css';
            load_fancybox_css.href = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css';
            document.head.appendChild(load_fancybox_css);

            // Kalender - Fancybox Script laden
            var load_fancybox_script = document.createElement('script');
            load_fancybox_script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js';
            document.body.appendChild(load_fancybox_script);

            // Kalender - Hinweis bei "nur Events im Radius X anzeigen" deutlicher darstellen
            var events_radius0 = document.getElementsByClassName('filterNotice');
            for(var er = 0, events_radius; !!(events_radius=events_radius0[er]); er++) {
                events_radius.setAttribute('style','background-color:rgb(137, 151, 218); color:rgb(255, 255, 255); padding:10px; width:50%; margin-top:30px; margin-right:auto; margin-bottom:30px; margin-left:auto;');
                var event_radius_text1 = events_radius.innerHTML.replace('Nur','Es werden nur');
                var event_radius_text2 = event_radius_text1.replace('anzeigen','angezeigt');
                events_radius.innerHTML = event_radius_text2;
            }

            switch(url_switch) {

                case 'month':

                    // Kalender - Monatsübersicht - Anzahl der Termine im Monat (offMonth herausfiltern)
                    var month_events_alle = 0;
                    var month_events_alle_offmonth = 0;
                    var monthcell_offmonth0 = document.getElementsByClassName('monthCell offMonth');
                    for(var mco = 0, monthcell_offmonth; !!(monthcell_offmonth=monthcell_offmonth0[mco]); mco++) {
                        var month_day_events_offmonth = monthcell_offmonth.getElementsByClassName('monthMain primaryContent MaxHeight')[0].querySelectorAll("a[href^='kalender/']").length;
                        month_events_alle_offmonth = month_events_alle_offmonth + month_day_events_offmonth;
                    }

                    var monthcell0 = document.getElementsByClassName('monthCell');
                    for(var mc = 0, monthcell; !!(monthcell=monthcell0[mc]); mc++) {
                        // Kalender - Monatsübersicht - Termine vollständig anzeigen
                        if(setting_kalender_termine_erweitert == 1) {
                            var month_expandcut = monthcell.getElementsByClassName('expand cut')[0];
                            if(month_expandcut) {
                                monthcell.getElementsByClassName('monthMain primaryContent MaxHeight')[0].className += " expanded";
                            }
                        }
                        // Kalender - Monatsübersicht - Events zählen
                        var month_day_events = monthcell.getElementsByClassName('monthMain primaryContent MaxHeight')[0].querySelectorAll("a[href^='kalender/']").length;
                        month_events_alle = month_events_alle + month_day_events;
                        // Kalender - Monatsübersicht - Link zur Map hinzufügen
                        if(month_day_events !== 0) {
                            var month_header = monthcell.getElementsByClassName('monthDate secondaryContent')[0];
                            var month_daycode1 = month_header.querySelector("a[href^='kalender/']").getAttribute('href').replace('kalender/','');
                            var month_daycode2 = month_daycode1.replace('/day','');
                            // Kalender - Monatsübersicht - Anzahl der Termine pro Tag hinzufügen
                            var month_day_events_text = '';
                            if(setting_kalender_anzahl_termine == 1) {
                                if(month_day_events == 1) month_day_events_text = '<span style="font-size:8px; white-space:nowrap; color:rgb(234,234,244);">&nbsp;&nbsp;(1 Event)</span>';
                                else month_day_events_text = '<span style="font-size:8px; white-space:nowrap; color:rgb(234,234,244);">&nbsp;&nbsp;(' + month_day_events + ' Events)</span>';
                            }
                            var month_daycode_link = '<a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode=' + month_daycode2 + '" style="float:right;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" style="padding-right:5px;"; border="0"></a>' + month_day_events_text;
                            month_header.insertAdjacentHTML('beforeend', month_daycode_link);
                        }
                    }
                    // Kalender - Monatsübersicht - Anzahl der Termine im Monat anzeigen
                    var month_events = month_events_alle - month_events_alle_offmonth;
                    if(month_events <= 0) { month_events = 0; }
                    if(month_events == 1) {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - 1 Event');
                    } else {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - ' + month_events + ' Events');
                    }
                    document.title = document.getElementsByClassName('titleBar')[0].querySelector("h1").innerHTML + ' | FEUERWERK Forum';

                    // Kalender - Monatsübersicht - Termine vollständig anzeigen
                    var month_expand0 = document.getElementsByClassName('expand cut');
                    for(var me = 0, month_expand; !!(month_expand=month_expand0[me]); me++) {
                        // Kalender - Monatsübersicht - Termine vollständig anzeigen
                        if(setting_kalender_termine_erweitert == 1) {
                            month_expand.setAttribute('style','display:none;');
                        }
                    }

                    // Kalender - Monatsübersicht - Zellenhöhe angleichen
                    if(setting_kalender_termine_erweitert == 1) {
                        var month_cellheight0 = document.getElementsByClassName('monthTable');
                        for(var mch = 0, month_cellheight; !!(month_cellheight=month_cellheight0[mch]); mch++) {
                            if(month_cellheight.className != "monthTable monthHeaders") {
                                var month_cellheight_main_height = 0;
                                var month_cellheight_main0 = month_cellheight.getElementsByClassName('monthMain primaryContent MaxHeight');
                                for(var mchm = 0, month_cellheight_main; !!(month_cellheight_main=month_cellheight_main0[mchm]); mchm++) {
                                    if(month_cellheight_main_height < month_cellheight_main.offsetHeight) {
                                        month_cellheight_main_height = month_cellheight_main.offsetHeight
                                    }
                                }
                                var month_cellheight_main_height_padding = month_cellheight_main_height;
                                if(month_cellheight_main_height >= 10) month_cellheight_main_height_padding = month_cellheight_main_height -= 10;
                                var month_cellheight_set0 = month_cellheight.getElementsByClassName('monthMain primaryContent MaxHeight');
                                for(var mchs = 0, month_cellheight_set; !!(month_cellheight_set=month_cellheight_set0[mchs]); mchs++) {
                                    var month_cellheight_set_oldstyle = month_cellheight_set.getAttribute('style');
                                    month_cellheight_set.setAttribute('style','height:' + month_cellheight_main_height_padding + 'px; max-height:none;' + month_cellheight_set_oldstyle);
                                }
                            }
                        }
                    }

                    break;
                case 'week':

                    // Kalender - Wochenübersicht - Link zur Map hinzufügen
                    var week_events = 0;
                    var week_maplink0 = document.getElementsByClassName('weekCell');
                    for(var wm = 0, week_maplink; !!(week_maplink=week_maplink0[wm]); wm++) {
                        var week_day_events = week_maplink.getElementsByClassName('primaryContent')[0].getElementsByClassName('weekList').length;
                        week_events = week_events + week_day_events;
                        if(week_day_events !== 0) {
                            var week_firstlink = week_maplink.querySelector("a");
                            var week_daycode1 = week_firstlink.getAttribute('href').replace('kalender/','');
                            var week_daycode2 = week_daycode1.replace('/day','');
                            // Kalender - Wochenübersicht - Anzahl der Termine pro Tag hinzufügen
                            var week_day_events_text = '';
                            if(setting_kalender_anzahl_termine == 1) {
                                if(week_day_events == 1) week_day_events_text = '&nbsp;&nbsp;(1 Event)';
                                else week_day_events_text = '&nbsp;&nbsp;(' + week_day_events + ' Events)';
                            }
                            var week_daycode_link = '<a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode=' + week_daycode2 + '" style="float:right;margin-right:10px;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" border="0"></a>' + week_day_events_text;
                            week_maplink.getElementsByClassName('sectionFooter')[0].insertAdjacentHTML('beforeend', week_daycode_link);
                        }
                    }
                    // Kalender - Wochenübersicht - Anzahl der Termine der Woche anzeigen
                    if(week_events <= 0) { week_events = 0; }
                    if(week_events == 1) {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - 1 Event');
                    } else {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - ' + week_events + ' Events');
                    }
                    document.title = document.getElementsByClassName('titleBar')[0].querySelector("h1").innerHTML + ' | FEUERWERK Forum';

                    break;
                case 'day':

                    // Kalender - Tagesübersicht - Link zur Map hinzufügen (Uhrzeiten im Header / Footer werden ersetzt)
                    var day_daylist = document.getElementsByClassName('sectionMain')[0].getElementsByClassName('dayList')[0];
                    var day_day_events = 0;
                    if(day_daylist) {
                        day_day_events = day_daylist.querySelectorAll("a[href^='kalender/']").length;
                    } else {
                        var day_daylist2_sectionMain1 = document.getElementsByClassName('sectionMain')[1];
                        if(day_daylist2_sectionMain1) var day_daylist2 = day_daylist2_sectionMain1.getElementsByClassName('dayList')[0];
                        if(day_daylist2) day_day_events = day_daylist2.querySelectorAll("a[href^='kalender/']").length;
                    }
                    var day_day_events_text = '';
                    if(day_day_events !== 0) {
                        // Kalender - Tagesübersicht - Anzahl der Termine pro Tag hinzufügen
                        if(setting_kalender_anzahl_termine == 1) {
                            if(day_day_events == 1) day_day_events_text = '<span style="font-size:12px; white-space:nowrap;">&nbsp;&nbsp;1 Event</span>';
                            else day_day_events_text = '<span style="font-size:12px; white-space:nowrap;">&nbsp;&nbsp;' + day_day_events + ' Events</span>';
                        }
                        document.getElementsByClassName('dayTable dayHeaders')[0].innerHTML = '<li class="dayHead subHeading" style="display:table-cell; width:100%; border: none;"><a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode=' + url_array[2] + '" style="float:right;margin-right:10px;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" border="0"></a>' + day_day_events_text + '</li>';
                        document.getElementsByClassName('dayTable dayHeaders')[1].innerHTML = '<li class="dayHead subHeading" style="display:table-cell; width:100%; border: none;"><a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode=' + url_array[2] + '" style="float:right;margin-right:10px;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" border="0"></a>' + day_day_events_text + '</li>';
                    } else {
                        day_day_events_text = '<span style="font-size:12px; white-space:nowrap;">&nbsp;&nbsp;Kein Event</span>';
                        document.getElementsByClassName('dayTable dayHeaders')[0].innerHTML = '<li class="dayHead subHeading" style="display:table-cell; width:100%; border: none;">' + day_day_events_text + '</li>';
                        document.getElementsByClassName('dayTable dayHeaders')[1].innerHTML = '<li class="dayHead subHeading" style="display:table-cell; width:100%; border: none;">' + day_day_events_text + '</li>';
                    }

                    // Kalender - Tagesübersicht - Scrollbalken im Vordergrund anzeigen
                    document.getElementById('uix_jumpToFixed').setAttribute('style','z-index:100;');

                    break;
                case 'agenda':
                case 'archive':

                    // Kalender - Agenda / Archiv - Link zur Map hinzufügen
                    var agenda_events = 0;
                    var agenda_maplink0 = document.getElementsByClassName('section secondaryContent agendaCell');
                    for(var am = 0, agenda_maplink; !!(agenda_maplink=agenda_maplink0[am]); am++) {
                        agenda_maplink.setAttribute('style','margin-top:0px; margin-bottom:20px; overflow:auto;');
                        agenda_maplink.getElementsByClassName('Tooltip')[0].setAttribute('style','white-space: nowrap;');
                        var agenda_day_events = agenda_maplink.getElementsByClassName('agendaList').length;
                        agenda_events = agenda_events + agenda_day_events;
                        if(agenda_day_events !== 0) {
                            var agenda_firstlink = agenda_maplink.getElementsByTagName('span');
                            var agenda_year = agenda_firstlink[0].getAttribute('data-year');
                            var agenda_month = agenda_firstlink[0].getAttribute('data-month');
                            var agenda_day = agenda_firstlink[0].getAttribute('data-day');
                            var agenda_daycode = agenda_month + '%20' + agenda_day;
                            var agenda_daycode_link = '';
                            // Kalender - Agenda / Archiv - Anzahl der Termine pro Tag hinzufügen
                            var agenda_day_events_text = '';
                            if(setting_kalender_anzahl_termine == 1) {
                                if(agenda_day_events == 1) agenda_day_events_text = '<span style="font-size:12px; white-space:nowrap; margin-right:15px;">&nbsp;&nbsp;1 Event</span>';
                                else agenda_day_events_text = '<span style="font-size:12px; white-space:nowrap; margin-right:15px;">&nbsp;&nbsp;' + agenda_day_events + ' Events</span>';
                            }
                            if(url_array[2] == 'produktshow.4' || (url_array[2] != 'archive' && document.getElementsByName("query")[0].value == '⚑')) agenda_daycode_link = '<a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode_agenda=' + agenda_year + '.' + agenda_daycode + '&suche=%E2%9A%91" style="float:left; width:50px; padding-top:10px;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" border="0"></a>';
                            else agenda_daycode_link = agenda_day_events_text + '<a data-fancybox data-type="iframe" href="javascript:;" data-src="https://www.otb-server.de/feuerwerke/mapg_feuerwerk_karte.php?daycode_agenda=' + agenda_year + '.' + agenda_daycode + '" style="float:left; width:50px; padding-top:10px;" title="Zur Map (externe Seite)"><img src="https://www.otb-server.de/feuerwerke/images/google_maps_icon16.png" alt="Map" border="0"></a>';
                            agenda_maplink.getElementsByClassName('agendaDate')[0].insertAdjacentHTML('beforeend', agenda_daycode_link);
                        }
                    }
                    // Kalender - Agenda / Archiv - Anzahl der Termine der Agenda / des Archives anzeigen
                    if(agenda_events <= 0) { agenda_events = 0; }
                    if(agenda_events == 1) {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - 1 Event');
                    } else {
                        document.getElementsByClassName('titleBar')[0].querySelector("h1").insertAdjacentHTML('beforeend', ' - ' + agenda_events + ' Events');
                    }
                    document.title = document.getElementsByClassName('titleBar')[0].querySelector("h1").innerHTML + ' | FEUERWERK Forum';

                    // Kalender - Agenda / Archiv - Avataricon vor Termin zentrieren
                    var agenda_eventavatar0 = document.getElementsByClassName('avatar Av1s');
                    for(var ae = 0, agenda_eventavatar; !!(agenda_eventavatar=agenda_eventavatar0[ae]); ae++) {
                        agenda_eventavatar.setAttribute('style','padding-top:5px;');
                    }

                    // Kalender - Agenda / Archiv - Seitenanzeige ändern
                    var agenda_pagenav0 = document.getElementsByClassName('pageNavHeader');
                    for(var ap = 0, agenda_pagenav; !!(agenda_pagenav=agenda_pagenav0[ap]); ap++) {
                        agenda_pagenav.setAttribute('style','padding:0px; margin-right:10px; color:rgb(221, 226, 231);');
                    }

                    break;
                case 'create':

                    // Kalender - Neues Event erstellen - Enddatum bei Änderung des Startdatums automatisch aktualisieren     TODO: Ende-Kalender hat noch altes Datum markiert
                    /*
                    document.getElementById("Sdate").onchange = function() {
                        document.getElementById('Edate').value = document.getElementById('Sdate').value;
                        document.getElementById('EndNotice').setAttribute('style','display:none;');
                        document.querySelectorAll("input[value='Event erstellen']")[0].removeAttribute("disabled");
                        document.querySelectorAll("input[value='Event erstellen']")[1].removeAttribute("disabled");
                        var new_event_style = document.querySelectorAll("input[value='Event erstellen']")[0].getAttribute('style');
                        if(new_event_style === null) {
                            document.querySelectorAll("input[value='Event erstellen']")[0].setAttribute('style','opacity:1;');
                            document.querySelectorAll("input[value='Event erstellen']")[1].setAttribute('style','opacity:1;');
                        } else {
                            document.querySelectorAll("input[value='Event erstellen']")[0].setAttribute('style','opacity:1;' + new_event_style);
                            document.querySelectorAll("input[value='Event erstellen']")[1].setAttribute('style','opacity:1;' + new_event_style);
                        }
                    }
                    */
                    document.getElementById("Sdate").setAttribute("onchange","document.getElementById('Edate').value = document.getElementById('Sdate').value;document.getElementById('EndNotice').setAttribute('style','display:none;');document.querySelectorAll(\"input[value='Event erstellen']\")[0].removeAttribute(\"disabled\");document.querySelectorAll(\"input[value='Event erstellen']\")[1].removeAttribute(\"disabled\");var new_event_style = document.querySelectorAll(\"input[value='Event erstellen']\")[0].getAttribute('style'); if(new_event_style === null) { document.querySelectorAll(\"input[value='Event erstellen']\")[0].setAttribute('style','opacity:1;'); document.querySelectorAll(\"input[value='Event erstellen']\")[1].setAttribute('style','opacity:1;'); } else { document.querySelectorAll(\"input[value='Event erstellen']\")[0].setAttribute('style','opacity:1;' + new_event_style); document.querySelectorAll(\"input[value='Event erstellen']\")[1].setAttribute('style','opacity:1;' + new_event_style); }");

                    // Kalender - Neues Event erstellen - Endzeit 23:59 Uhr automatisch auswählen
                    document.getElementById("Ehour").options[23].selected = true;
                    document.getElementById("Emins").value = '59';

                    // Kalender - Neues Event erstellen - Höhenfeuerwerk automatisch auswählen
                    document.getElementById("ctrl_keyword_1").checked = true;

                    // Kalender - Neues Event erstellen - Abstände zwischen den Feldern verkleinern
                    var create_small0 = document.getElementsByClassName('ctrlUnit');
                    for(var cs = 0, create_small; !!(create_small=create_small0[cs]); cs++) {
                        create_small.setAttribute('style','margin-top:0px; margin-bottom:0px;');
                    }

                    // Kalender - Neues Event erstellen - Beschreibungsfeld auf 130px Höhe begrenzen
                    var redactor_box = document.getElementsByClassName('redactor_box')[0];
                    if(redactor_box) {
                        var iframe_oldstyle = redactor_box.querySelector("iframe").getAttribute('style');
                        redactor_box.querySelector("iframe").setAttribute('style', iframe_oldstyle + 'max-height:130px;');
                    }

                    // Kalender - Neues Event erstellen - Google Map auf 200px Höhe setzen
                    document.getElementById("GoogleMap").querySelector("iframe").height = '200';

                    break;
                case 'event':

                    var event_links0 = document.getElementsByClassName('heading h1');
                    for(var el = 0, event_links; !!(event_links=event_links0[el]); el++) {
                        event_links.setAttribute('style','color:red;');
                    }

                    // Kalender - Eventansicht - Button hinzufügen
                    var event_link_create = '<a href="kalender/create" class="callToAction"><span>Event erstellen</span></a>';
                    var event_link_edit_event = '';
                    var event_link_edit_occur = '';
                    var event_canedit_event = document.querySelector("a[href$='/event/edit']");
                    if(event_canedit_event) event_link_edit_event = '&nbsp;&nbsp;<a href="' + event_canedit_event.href + '" class="callToAction"><span>Event bearbeiten</span></a>';
                    var event_canedit_occur = document.querySelector("a[href$='/occur/edit']");
                    if(event_canedit_occur) event_link_edit_occur = '&nbsp;&nbsp;<a href="' + event_canedit_occur.href + '" class="callToAction"><span>Ereignis bearbeiten</span></a>';
                    document.getElementsByClassName('topCtrl')[0].innerHTML = event_link_create + event_link_edit_event + event_link_edit_occur;

                    // Kalender - Eventansicht - Userdetails einblenden
                    document.getElementsByClassName('messageUserInfo')[0].setAttribute('style','display:inline;');

                    break;
                default:

            }
        }

        if(url_array[1] == 'thema') {

            // Thema - Pulsierende Useronline-Anzeige hinzufügen
            if(setting_useronline_pulse_hinzufuegen == 1) {
                // CSS laden
                var thema_load_pulse_css = document.createElement('style');
                var thema_load_pulse_css_code = document.createTextNode('.onlineMarker{z-index:10;-moz-transition:ease-out 0.1s;-o-transition:ease-out 0.1s;-webkit-transition:ease-out 0.1s;transition:ease-out 0.1s}.messageUserBlock div.avatarHolder .onlineMarker_pulse{border:10px solid rgb(173, 244, 19);background:transparent;-webkit-border-radius:40px;-moz-border-radius:40px;border-radius:40px;height:40px;width:40px;-webkit-animation:pulse 3s ease-out infinite;-moz-animation:pulse 3s ease-out infinite;animation:pulse 3s ease-out infinite;position:absolute;top: -25px;left: -25px;z-index:1;opacity:0}@-moz-keyframes pulse{0%{-moz-transform:scale(0);opacity:0.0}25%{-moz-transform:scale(0);opacity:0.1}50%{-moz-transform:scale(0.1);opacity:0.3}75%{-moz-transform:scale(0.5);opacity:0.5}100%{-moz-transform:scale(1);opacity:0.0}}@-webkit-keyframes "pulse"{0%{-webkit-transform:scale(0);opacity:0.0}25%{-webkit-transform:scale(0);opacity:0.1}50%{-webkit-transform:scale(0.1);opacity:0.3}75%{-webkit-transform:scale(0.5);opacity:0.5}100%{-webkit-transform:scale(1);opacity:0.0}}.Responsive.hasFlexbox .messageList');
                thema_load_pulse_css.appendChild(thema_load_pulse_css_code);
                document.head.appendChild(thema_load_pulse_css);
                // Class einfügen
                var thema_useronline_pulse0 = document.getElementsByClassName('Tooltip onlineMarker');
                for(var tuop = 0, thema_useronline_pulse; !!(thema_useronline_pulse=thema_useronline_pulse0[tuop]); tuop++) {
                    thema_useronline_pulse.innerHTML = '<span class="onlineMarker_pulse"></span>';
                }
            }

            // Thema - Navigationspfeile bei Beitragsnummer hinzufügen
            if(setting_navigationspfeile_hinzufuegen == 1) {
                var nav_angle0 = document.getElementsByClassName('item muted postNumber hashPermalink OverlayTrigger');
                for(var na = 0, nav_angle; !!(nav_angle=nav_angle0[na]); na++) {
                    var nav_threadcount = document.getElementsByClassName('sectionMain message     ').length - 2;
                    var nav_golast_link = '<a href="javascript: void(0)" onclick="audentio.pagination.scrollToPost(' + nav_threadcount + ')" style="float:right;" title="Zum letzten Beitrag"><i class="fa fa-angle-double-down pointer fa-fw pagebottom"></i></a>';
                    var nav_goafter_link = '<a href="javascript: void(0)" onclick="audentio.pagination.nextPost()" style="float:right;" title="Zum n&auml;chsten Beitrag"><i class="fa fa-angle-down pointer fa-fw pagedown"></i></a>';
                    var nav_gobefore_link = '<a href="javascript: void(0)" onclick="audentio.pagination.prevPost()" style="float:right;" title="Zum vorherigen Beitrag"><i class="fa fa-angle-up pointer fa-fw pageup"></i></a>';
                    var nav_gofirst_link = '<a href="javascript: void(0)" onclick="audentio.pagination.scrollToPost(0)" style="float:right;" title="Zum ersten Beitrag"><i class="fa fa-angle-double-up pointer fa-fw pagetop"></i></a>';
                    nav_angle.outerHTML = nav_golast_link + nav_goafter_link + nav_angle.outerHTML + nav_gobefore_link + nav_gofirst_link;
                }
            }

            // Thema - Hintergrundfarbe beim Hinweis von geschlossenen Themen ändern
            var thread_closed0 = document.getElementsByClassName('threadAlerts secondaryContent');
            for(var tc = 0, thread_closed; !!(thread_closed=thread_closed0[tc]); tc++) {
                thread_closed.setAttribute('style','background-color:rgb(231,76,60) !important;');
            }

            // Thema - Abstand zwischen Rahmen und Avatar hinzufügen - Thema
            var thread_avatar0 = document.getElementsByClassName('avatarHolder');
            for(var ta = 0, thread_avatar; !!(thread_avatar=thread_avatar0[ta]); ta++) {
                thread_avatar.setAttribute('style','margin:5px; border:0px;');
            }

            // Thema - Abstand zwischen Rahmen und Avatar hinzufügen - Quick Reply
            var quickreply_avatar = document.getElementsByClassName('quickReply message sectionMain')[0];
            if(quickreply_avatar) {
                quickreply_avatar.getElementsByClassName('messageUserInfo')[0].setAttribute('style','margin:5px; border:0px;');
                quickreply_avatar.getElementsByClassName('avatarHolder')[0].setAttribute('style','');
            }

            // Thema - Neu-Kennzeichnung deutlicher darstellen
            if(setting_neukennzeichnung_hervorheben == 1) {
                var thread_unread_link0 = document.getElementsByClassName('unreadLink');
                for(var tul = 0, thread_unread_link; !!(thread_unread_link=thread_unread_link0[tul]); tul++) {
                    thread_unread_link.setAttribute('style','background-color:rgb(231,76,60); font-weight:bold; color:rgb(255,255,255); border-radius:2px; margin-top:3px; border-top-width:0px; border-bottom-width:0px;');
                }
            }

            // Thema - Farbe bei Umfragen ändern
            if(document.getElementsByClassName('questionMark')[0]) {
                document.getElementsByClassName('questionMark')[0].setAttribute('style','border-top-color:' + setting_farbe_umfragen + ';');
                var poll_bar0 = document.getElementsByClassName('barContainer');
                for(var pb = 0, poll_bar; !!(poll_bar=poll_bar0[pb]); pb++) {
                    poll_bar.setAttribute('style','border-color:' + setting_farbe_umfragen + ';');
                    var poll_bar_width = poll_bar.getElementsByClassName('bar')[0].getAttribute('style');
                    if(poll_bar_width === null) {
                        poll_bar.getElementsByClassName('bar')[0].setAttribute('style','background-color:' + setting_farbe_umfragen + ';');
                    } else {
                        poll_bar.getElementsByClassName('bar')[0].setAttribute('style','background-color:' + setting_farbe_umfragen + ';' + poll_bar_width);
                    }
                }
            }

            /*
            // Thema - Linkfarbe ändern - Membercard (User Links)
            var linkfarbe_membercard0 = document.getElementsByClassName('userLinks');
            for(var lmc = 0, linkfarbe_membercard; !!(linkfarbe_membercard=linkfarbe_membercard0[lmc]); lmc++) {
                var linkfarbe_membercard_oldstyle = linkfarbe_membercard.getAttribute('style');
                if(linkfarbe_membercard_oldstyle === null || linkfarbe_membercard_oldstyle == 'color:' + setting_linkfarbe_membercard + ';') {
                    linkfarbe_membercard.setAttribute('style','color:' + setting_linkfarbe_membercard + ';');
                } else {
                    linkfarbe_membercard.setAttribute('style','color:' + setting_linkfarbe_membercard + ';' + linkfarbe_membercard_oldstyle);
                }
            }
            */

            /*
            // Thema - Post-Navi im Header ausblenden
            document.getElementById('audentio_postPagination').setAttribute('style','display:none;'); --> funktioniert nicht mit 'none', warum?
            document.getElementById('audentio_postPagination').innerHTML = ' ';
            */

        }


        // Allgemein - Seitenzahlen bei der Suche immer anzeigen
        var page_number0 = document.getElementsByClassName('itemPageNav');
        for(var pn = 0, page_number; !!(page_number=page_number0[pn]); pn++) {
            if(setting_seitenzahlen_immer_anzeigen == 1) {
                page_number.setAttribute('style','visibility:visible;');
            }
            // Allgemein - Hintergrundfarbe der Seitenzahlen ändern
            var page_number_background0 = page_number.querySelectorAll('a');
            if(page_number_background0 !== null) {
                for(var pnb = 0, page_number_background; !!(page_number_background=page_number_background0[pnb]); pnb++) {
                    page_number_background.setAttribute('style','background-color:' + setting_farbe_seitenzahl + ';');
                    page_number_background.setAttribute('onmouseover','style="background-color:' + setting_farbe_seitenzahl_hover + ';"');
                    page_number_background.setAttribute('onmouseout','style="background-color:' + setting_farbe_seitenzahl + ';"');
                }
            }
        }

        // Allgemein - Hintergrundfarbe bei der aktuellen Seitenzahl ändern
        var page_color0 = document.getElementsByClassName('currentPage');
        for(var pc = 0, page_color; !!(page_color=page_color0[pc]); pc++) {
            page_color.setAttribute('style','background-color:' + setting_farbe_seitenzahl + ';');
            page_color.setAttribute('onmouseover','style="background-color:' + setting_farbe_seitenzahl_hover + ';"');
            page_color.setAttribute('onmouseout','style="background-color:' + setting_farbe_seitenzahl + ';"');
        }

        if(url_array[1] == 'find-new') {

            // Suche - Link vor der Neu-Kennzeichnung anpassen
            var search_unread_link_before0 = document.getElementsByClassName('PreviewTooltip');
            for(var sulb = 0, search_unread_link_before; !!(search_unread_link_before=search_unread_link_before0[sulb]); sulb++) {
                search_unread_link_before.setAttribute('style','margin-bottom:3px;');
            }

            // Suche - Neu-Kennzeichnung deutlicher darstellen
            if(setting_neukennzeichnung_hervorheben == 1) {
                // Neue Posts
                var search_unread_link0 = document.getElementsByClassName('unreadLink');
                for(var sul = 0, search_unread_link; !!(search_unread_link=search_unread_link0[sul]); sul++) {
                    search_unread_link.setAttribute('style','background-color:rgb(231,76,60); font-weight:bold; color:rgb(255,255,255); padding-right:5px; padding-left:5px; border-radius:2px; margin-bottom:3px; font-size:11px;');
                }

                // Neue Medien - Kommentarbutton
                var search_media0 = document.getElementsByClassName('mediaLabel labelStandard');
                for(var sm = 0, search_media; !!(search_media=search_media0[sm]); sm++) {
                    search_media.setAttribute('style','background-color:rgb(231,76,60) !important; color:rgb(221,226,231);');
                }
            }

        }

        if(url_array[1] == 'album') {

            // Album - Farbe der Likes ändern
            var album_likes0 = document.getElementsByClassName('LikeText');
            for(var al = 0, album_likes; !!(album_likes=album_likes0[al]); al++) {
                album_likes.setAttribute('style','color:' + setting_farbe_album_likes + ';');
            }

            // Album - Links in der Beschreibung verlinken und Zeilenumbrüche anzeigen
            var album_beschreibung = document.getElementById('pageDescription');
            if(album_beschreibung) {
                var album_beschreibung_innerhtml = album_beschreibung.innerHTML;
                var album_beschreibung_linktest = album_beschreibung_innerhtml.includes('http');
                if(album_beschreibung_linktest) {
                    var album_beschreibung_link = '';
                    for(var abl = 0, album_beschreibung_linksuche; !!(album_beschreibung_linksuche=album_beschreibung_innerhtml.split(' ')[abl]); abl++) {
                        if(album_beschreibung_linksuche.startsWith('http')) album_beschreibung_link += ' <a href="' + album_beschreibung_linksuche + '">' + album_beschreibung_linksuche + '</a>';
                        else album_beschreibung_link += ' ' + album_beschreibung_linksuche;
                    }
                    var album_beschreibung_link_br = album_beschreibung_link.replace(/\n|\r/g, '<br> ');
                    document.getElementById('pageDescription').innerHTML = album_beschreibung_link_br.trim();
                } else document.getElementById('pageDescription').innerHTML = album_beschreibung_innerhtml.replace(/\n|\r/g, '<br>');
            }

        }

        if(url_array[1] == 'chat') {

            // Chat - Farbe der Nachrichtenzeit ändern
            var chat_messagetime0 = document.getElementsByClassName('DateTime');
            for(var cm = 0, chat_messagetime; !!(chat_messagetime=chat_messagetime0[cm]); cm++) {
                var chat_messagetime_oldstyle = chat_messagetime.getAttribute('style');
                if(chat_messagetime_oldstyle === null) {
                    chat_messagetime.setAttribute('style','color: black;');
                } else {
                    chat_messagetime.setAttribute('style',chat_messagetime_oldstyle + 'color: black;');
                }
            }

        }

        if(url_array[1] == 'conversations') {

            // Unterhaltungen - Pulsierende Useronline-Anzeige hinzufügen
            if(setting_useronline_pulse_hinzufuegen == 1) {
                // CSS laden
                var conversations_load_pulse_css = document.createElement('style');
                var conversations_load_pulse_css_code = document.createTextNode('.onlineMarker{z-index:10;-moz-transition:ease-out 0.1s;-o-transition:ease-out 0.1s;-webkit-transition:ease-out 0.1s;transition:ease-out 0.1s}.messageUserBlock div.avatarHolder .onlineMarker_pulse{border:10px solid rgb(173, 244, 19);background:transparent;-webkit-border-radius:40px;-moz-border-radius:40px;border-radius:40px;height:40px;width:40px;-webkit-animation:pulse 3s ease-out infinite;-moz-animation:pulse 3s ease-out infinite;animation:pulse 3s ease-out infinite;position:absolute;top: -25px;left: -25px;z-index:1;opacity:0}@-moz-keyframes pulse{0%{-moz-transform:scale(0);opacity:0.0}25%{-moz-transform:scale(0);opacity:0.1}50%{-moz-transform:scale(0.1);opacity:0.3}75%{-moz-transform:scale(0.5);opacity:0.5}100%{-moz-transform:scale(1);opacity:0.0}}@-webkit-keyframes "pulse"{0%{-webkit-transform:scale(0);opacity:0.0}25%{-webkit-transform:scale(0);opacity:0.1}50%{-webkit-transform:scale(0.1);opacity:0.3}75%{-webkit-transform:scale(0.5);opacity:0.5}100%{-webkit-transform:scale(1);opacity:0.0}}.Responsive.hasFlexbox .messageList');
                conversations_load_pulse_css.appendChild(conversations_load_pulse_css_code);
                document.head.appendChild(conversations_load_pulse_css);
                // Class einfügen
                var conversations_useronline_pulse0 = document.getElementsByClassName('Tooltip onlineMarker');
                for(var cuop = 0, conversations_useronline_pulse; !!(conversations_useronline_pulse=conversations_useronline_pulse0[cuop]); cuop++) {
                    conversations_useronline_pulse.innerHTML = '<span class="onlineMarker_pulse"></span>';
                }
            }

            // Unterhaltungen - "Als gelesen markieren" deutlicher darstellen
            if(setting_neukennzeichnung_hervorheben == 1) {
                var conversations_readtoggle0 = document.getElementsByClassName('ReadToggle');
                for(var crt = 0, conversations_readtoggle; !!(conversations_readtoggle=conversations_readtoggle0[crt]); crt++) {
                    var conversations_readtoggle_title = conversations_readtoggle.getAttribute('title');
                    if(conversations_readtoggle_title == 'Als gelesen markieren') {
                        var conversations_readtoggle_oldstyle = conversations_readtoggle.getAttribute('style');
                        if(conversations_readtoggle_oldstyle === null) {
                            conversations_readtoggle.setAttribute('style','background-color:rgb(231,76,60); font-weight:bold; color:rgb(255,255,255); padding-top:1px; padding-right:5px; padding-bottom:1px; padding-left:5px; border-radius:2px; margin-left:3px; margin-bottom:2px; font-size:11px;');
                        } else {
                            conversations_readtoggle.setAttribute('style',conversations_readtoggle_oldstyle + 'background-color:rgb(231,76,60); font-weight:bold; color:rgb(255,255,255); padding-top:1px; padding-right:5px; padding-bottom:1px; padding-left:5px; border-radius:2px; margin-left:3px; margin-bottom:2px; font-size:11px;');
                        }
                    }
                }
            }

        }

        if(!url_array[1]) {

            // Allgemein - Neu-Kennzeichnung hinzufügen (Startseite: Aktuelle Themen)
            if(setting_neukennzeichnung_hervorheben == 1) {
                var unread_link0 = document.querySelectorAll("a[href$='/unread']");
                for(var ul = 0, unread_link; !!(unread_link=unread_link0[ul]); ul++) {
                    var unreal_link_text = '<a href="' + unread_link.getAttribute('href') + '" style="background-color:rgb(231,76,60); font-weight:bold; color:rgb(255,255,255); padding-top:1px; padding-right:5px; padding-bottom:1px; padding-left:5px; border-radius:2px; margin-left:3px; font-size:11px;" title="Zum ersten ungelesenen Beitrag gehen">Neu</a>';
                    unread_link.insertAdjacentHTML('afterend', unreal_link_text);
                }
            }

        }

        // Allgemein - Hintergrundfarbe beim Suchicon ändern
        var search_icon0 = document.getElementsByClassName('uix_icon uix_icon-search');
        for(var si = 0, search_icon; !!(search_icon=search_icon0[si]); si++) {
            search_icon.setAttribute('style','background-color:' + setting_farbe_suche + ';');
        }

        // Allgemein - Rahmenfarbe beim Suchfeld ändern
        if(url_array[1] == 'search') {
            var search_field0 = document.getElementsByClassName('textCtrl');
            for(var sf = 0, search_field; !!(search_field=search_field0[sf]); sf++) {
                search_field.setAttribute('style','border-color:' + setting_farbe_suche + ';');
            }
        } else {
            document.getElementById('QuickSearchQuery').setAttribute('style','border-color:' + setting_farbe_suche + ';');
            document.getElementById('searchBar_users').setAttribute('style','border-color:' + setting_farbe_suche + ';');
            document.getElementById('searchBar_date').setAttribute('style','border-color:' + setting_farbe_suche + ';');
        }

        // Allgemein - Farbe bei Buttons ändern 1 - Allgemein, Kalender
        var button1_color0 = document.getElementsByClassName('button primary');
        for(var b1c = 0, button1_color; !!(button1_color=button1_color0[b1c]); b1c++) {
            button1_color.setAttribute('style','color:' + setting_buttonfarbe_allgemein + '; border-color:' + setting_buttonfarbe_allgemein + ';');
        }

        // Allgemein - Farbe bei Buttons ändern 2 - Medien, Kalender
        var button2_color0 = document.querySelectorAll('.callToAction span');
        for(var b2c = 0, button2_color; !!(button2_color=button2_color0[b2c]); b2c++) {
            button2_color.setAttribute('style','background-color:' + setting_buttonfarbe_action + ';');
            button2_color.setAttribute('onmouseover','style="background-color:' + setting_buttonfarbe_action_hover + ';"');
            button2_color.setAttribute('onmouseout','style="background-color:' + setting_buttonfarbe_action + ';"');
        }

        // Allgemein - Farbe bei Buttons ändern 3 - Profil
        if(url_array[1] == 'mitglieder') {
            var conversation_button = document.getElementsByClassName('conversationButton')[0];
            if(conversation_button) {
                conversation_button.setAttribute('style','background-color:' + setting_buttonfarbe_profil + '; border-color:' + setting_buttonfarbe_profil + ';');
                conversation_button.setAttribute('onmouseover','style="background-color:' + setting_buttonfarbe_profil_hover + '; border-color:' + setting_buttonfarbe_profil_hover + ';"');
                conversation_button.setAttribute('onmouseout','style="background-color:' + setting_buttonfarbe_profil + '; border-color:' + setting_buttonfarbe_profil + ';"');
            }
        }

        // Allgemein - Farbe der Userbanner ändern
        var userbanner_color0 = document.getElementsByClassName('userBanner bannerStaff');
        for(var ub = 0, userbanner_color; !!(userbanner_color=userbanner_color0[ub]); ub++) {
            userbanner_color.setAttribute('style','background-color:' + setting_farbe_userbanner + ';');
        }

        // Allgemein - Farbe der Jumpbar ändern
        document.getElementById('uix_jumpToFixed').setAttribute('style','background-color:' + setting_farbe_jumpbar + ';');

        // Allgemein - Zitate immer vollständig anzeigen
        if(setting_zitate_vollstaendig == 1) {
            var quote_style = document.createElement("STYLE");
            var quote_text = document.createTextNode(".bbCodeQuote .quoteContainer .quoteExpand.quoteCut {display: none;} html .bbCodeQuote .quoteContainer .quote {max-height: none;}");
            quote_style.appendChild(quote_text);
            document.head.appendChild(quote_style);
        }

        // Allgemein - Zitate breiter darstellen
        var quote_width0 = document.getElementsByClassName('bbCodeBlock');
        for(var qw = 0, quote_width; !!(quote_width=quote_width0[qw]); qw++) {
            quote_width.setAttribute('style','margin-top:1em; margin-right:0px; margin-bottom:20px; margin-left:0px;');
        }

        // Allgemein - Abstand bei Zitaten schmaler darstellen - Titelzeile
        if(setting_zitate_schmale_titelzeile == 1) {
            var quote_header0 = document.getElementsByClassName('type');
            for(var qh = 0, quote_header; !!(quote_header=quote_header0[qh]); qh++) {
                quote_header.setAttribute('style','padding-top:1px; padding-right:5px; padding-bottom:1px; padding-left:5px;');
            }
        }

        // Allgemein - Linkfarbe ändern - Zitate
        var linkfarbe_zitate0 = document.getElementsByClassName('quote');
        for(var lz = 0, linkfarbe_zitate; !!(linkfarbe_zitate=linkfarbe_zitate0[lz]); lz++) {
            var linkfarbe_zitate10 = linkfarbe_zitate.querySelectorAll("a");
            if(linkfarbe_zitate10 !== null) {
                for(var lz1 = 0, linkfarbe_zitate1; !!(linkfarbe_zitate1=linkfarbe_zitate10[lz1]); lz1++) {
                    var linkfarbe_zitate1_oldstyle = linkfarbe_zitate1.getAttribute('style');
                    if(linkfarbe_zitate1_oldstyle === null || linkfarbe_zitate1_oldstyle == 'color:' + setting_linkfarbe_zitate + ';') {
                        linkfarbe_zitate1.setAttribute('style','color:' + setting_linkfarbe_zitate + ';');
                    } else {
                        linkfarbe_zitate1.setAttribute('style','color:' + setting_linkfarbe_zitate + ';' + linkfarbe_zitate1_oldstyle);
                    }
                }
            }
        }

        // Allgemein - Linkfarbe ändern - Interne Links
        var linkfarbe_intern0 = document.getElementsByClassName('internalLink');
        for(var li = 0, linkfarbe_intern; !!(linkfarbe_intern=linkfarbe_intern0[li]); li++) {
            var linkfarbe_intern_oldstyle = linkfarbe_intern.getAttribute('style');
            if(linkfarbe_intern_oldstyle === null || linkfarbe_intern_oldstyle == 'color:' + setting_linkfarbe_intern + ';') {
                linkfarbe_intern.setAttribute('style','color:' + setting_linkfarbe_intern + ';');
            } else {
                linkfarbe_intern.setAttribute('style','color:' + setting_linkfarbe_intern + ';' + linkfarbe_intern_oldstyle);
            }
        }

        // Allgemein - Linkfarbe ändern - Externe Links
        var linkfarbe_extern0 = document.getElementsByClassName('externalLink');
        for(var le = 0, linkfarbe_extern; !!(linkfarbe_extern=linkfarbe_extern0[le]); le++) {
            var linkfarbe_extern_oldstyle = linkfarbe_extern.getAttribute('style');
            if(linkfarbe_extern_oldstyle === null || linkfarbe_extern_oldstyle == 'color:' + setting_linkfarbe_extern + ';') {
                linkfarbe_extern.setAttribute('style','color:' + setting_linkfarbe_extern + ';');
            } else {
                linkfarbe_extern.setAttribute('style','color:' + setting_linkfarbe_extern + ';' + linkfarbe_extern_oldstyle);
            }
        }

        // Allgemein - Linkfarbe ändern - Username in Beiträgen
        var linkfarbe_username0 = document.getElementsByClassName('messageText SelectQuoteContainer ugc baseHtml');
        for(var lu = 0, linkfarbe_username; !!(linkfarbe_username=linkfarbe_username0[lu]); lu++) {
            var linkfarbe_username10 = linkfarbe_username.getElementsByClassName('username');
            if(linkfarbe_username10 !== null) {
                for(var lu1 = 0, linkfarbe_username1; !!(linkfarbe_username1=linkfarbe_username10[lu1]); lu1++) {
                    var linkfarbe_username1_oldstyle = linkfarbe_username1.getAttribute('style');
                    if(linkfarbe_username1_oldstyle === null || linkfarbe_username1_oldstyle == 'color:' + setting_linkfarbe_username + ';') {
                        linkfarbe_username1.setAttribute('style','color:' + setting_linkfarbe_username + ';');
                    } else {
                        linkfarbe_username1.setAttribute('style','color:' + setting_linkfarbe_username + ';' + linkfarbe_username1_oldstyle);
                    }
                }
            }
        }

        // Allgemein - Linkfarbe ändern - Eingebettete Medien in Beiträgen
        var linkfarbe_medien0 = document.getElementsByClassName('s9e-privacy-shield-actions');
        for(var lm = 0, linkfarbe_medien; !!(linkfarbe_medien=linkfarbe_medien0[lm]); lm++) {
            var linkfarbe_medien10 = linkfarbe_medien.querySelectorAll("a");
            if(linkfarbe_medien10 !== null) {
                for(var lm1 = 0, linkfarbe_medien1; !!(linkfarbe_medien1=linkfarbe_medien10[lm1]); lm1++) {
                    var linkfarbe_medien1_oldstyle = linkfarbe_medien1.getAttribute('style');
                    if(linkfarbe_medien1_oldstyle === null || linkfarbe_medien1_oldstyle == 'color:' + setting_linkfarbe_medien + ';') {
                        linkfarbe_medien1.setAttribute('style','color:' + setting_linkfarbe_medien + ';');
                    } else {
                        linkfarbe_medien1.setAttribute('style','color:' + setting_linkfarbe_medien + ';' + linkfarbe_medien1_oldstyle);
                    }
                }
            }
        }

        // Allgemein - Linkfarbe ändern - Signatur
        var linkfarbe_signatur0 = document.getElementsByClassName('uix_signature');
        for(var ls = 0, linkfarbe_signatur; !!(linkfarbe_signatur=linkfarbe_signatur0[ls]); ls++) {
            var linkfarbe_signatur10 = linkfarbe_signatur.querySelectorAll("a");
            if(linkfarbe_signatur10 !== null) {
                for(var ls1 = 0, linkfarbe_signatur1; !!(linkfarbe_signatur1=linkfarbe_signatur10[ls1]); ls1++) {
                    var linkfarbe_signatur1_oldstyle = linkfarbe_signatur1.getAttribute('style');
                    if(linkfarbe_signatur1_oldstyle === null || linkfarbe_signatur1_oldstyle == 'color:' + setting_linkfarbe_signatur + ';') {
                        linkfarbe_signatur1.setAttribute('style','color:' + setting_linkfarbe_signatur + ';');
                    } else {
                        linkfarbe_signatur1.setAttribute('style','color:' + setting_linkfarbe_signatur + ';' + linkfarbe_signatur1_oldstyle);
                    }
                }
            }
        }

        // Allgemein - Linkfarbe ändern - Album Text
        var linkfarbe_album0 = document.getElementsByClassName('galleryText');
        for(var la = 0, linkfarbe_album; !!(linkfarbe_album=linkfarbe_album0[la]); la++) {
            var linkfarbe_album_oldstyle = linkfarbe_album.getAttribute('style');
            if(linkfarbe_album_oldstyle === null || linkfarbe_album_oldstyle == 'color:' + setting_linkfarbe_album + ';') {
                linkfarbe_album.setAttribute('style','color:' + setting_linkfarbe_album + ';');
            } else {
                linkfarbe_album.setAttribute('style','color:' + setting_linkfarbe_album + ';' + linkfarbe_album_oldstyle);
            }
        }

        // Allgemein - Notizen abschalten (Heutige Geburtstage usw.)
        if(setting_notiz_abschalten == 1) {
            var notices0 = document.getElementsByClassName('FloatingContainer Notices');
            for(var n = 0, notices; !!(notices=notices0[n]); n++) {
                notices.setAttribute('style','display:none;');
            }
        }

        // Allgemein - Anzahl der neuen Beiträge wieder im Menü anzeigen
        var navlink_anzahl_neu = 0;
        var navlink_anzahl = document.getElementsByClassName('postItemCount')[0];
        if(navlink_anzahl) navlink_anzahl_neu = document.getElementsByClassName('postItemCount')[0].innerHTML;
        if(navlink_anzahl_neu > 0) {
            var navlink0 = document.getElementsByClassName('navLink');
            for(var nl = 0, navlink; !!(navlink=navlink0[nl]); nl++) {
                if(navlink.innerHTML == "Forum") navlink.innerHTML = 'Forum<span class="itemCount">' + navlink_anzahl_neu + '</span>';
            }
        }

        // Allgemein - Sticky Userbar     TODO: Aufgeklapptes Menü überlappt die Userbar
        switch(sticky_userbar_auswahl) {

            case 'fixed': // Userbar immer fest oben am Rand anzeigen

                document.getElementById('userBar').setAttribute('style','z-index:85000; top:0px; position:fixed; width:100%; background-color:rgb(62,75,143); display:inline;');
                document.getElementById('navigation').setAttribute('style','margin-top:70px;');

                break;
            case 'scroll': // Userbar nur beim Hochscrollen oben am Rand anzeigen

                document.addEventListener("scroll", sticky_userbar_scroll, false);

                break;
            default: // Userbar normal anzeigen (nicht mitlaufend)

        }

        // Allgemein - Userbar bei eingeloggten Usern erweitern
        if(document.getElementById('userBar')) {
            if(sticky_userbar_auswahl != 'aus') {
                var userbar_link1 = '';
                var userbar_link2 = '';
                var userbar_link3 = '';
                var userbar_link4 = '';
                var userbar_link5 = '';
                var userbar_link6 = '';
                var userbar_link7 = '';
                var userbar_link8 = '';
                // Home (Startseite)
                if(userbar_link1_aktiv == 1) { userbar_link1 = '<i class="fa ' + userbar_link1_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px; border-bottom-color:#00a9e6; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link1_href + '" class="navLink" style="border-bottom-color:#00a9e6; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link1_text + '</a>'; }
                // Neue Beiträge
                if(userbar_link2_aktiv == 1) { userbar_link2 = '<i class="fa ' + userbar_link2_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px;border-bottom-color:#0058a6; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link2_href + '" class="navLink" style="border-bottom-color:#0058a6; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link2_text + '</a>'; }
                // Album
                if(userbar_link3_aktiv == 1) { userbar_link3 = '<i class="fa ' + userbar_link3_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px;border-bottom-color:#7a3c8a; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link3_href + '" class="navLink" style="border-bottom-color:#7a3c8a; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link3_text + '</a>'; }
                // Kalender
                if(userbar_link4_aktiv == 1) { userbar_link4 = '<i class="fa ' + userbar_link4_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px;border-bottom-color:#c80074; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link4_href + '" class="navLink" style="border-bottom-color:#c80074; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link4_text + '</a>'; }
                // Wiki
                if(userbar_link5_aktiv == 1) { userbar_link5 = '<i class="fa ' + userbar_link5_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px;border-bottom-color:#e4001c; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link5_href + '" class="navLink" style="border-bottom-color:#e4001c; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link5_text + '</a>'; }
                // Datenbank
                if(userbar_link6_aktiv == 1) { userbar_link6 = '<i class="fa ' + userbar_link6_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px;border-bottom-color:#f0820c; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link6_href + '" class="navLink" style="border-bottom-color:#f0820c; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link6_text + '</a>'; }
                // Online (Sponsorenübersicht)
                if(userbar_link7_aktiv == 1) { userbar_link7 = '<i class="fa ' + userbar_link7_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px; border-bottom-color:#ffe600; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link7_href + '" class="navLink" style="border-bottom-color:#ffe600; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link7_text + '</a>'; }
                // Shop
                if(userbar_link8_aktiv == 1) { userbar_link8 = '<i class="fa ' + userbar_link8_icon + ' fa-lg navLink" aria-hidden="true" style="padding-right:0px; padding-left:25px; border-bottom-color:#7eda22; border-bottom-width:4px; border-bottom-style:solid;"></i> <a href="' + userbar_link8_href + '" class="navLink" style="border-bottom-color:#7eda22; border-bottom-width:4px; border-bottom-style:solid;">' + userbar_link8_text + '</a>'; }
                var userbar_links = '<ul style="float:left;">' + userbar_link1 + userbar_link2 + userbar_link3 + userbar_link4 + userbar_link5 + userbar_link6 + userbar_link7 + userbar_link8 + '</ul>';
                document.getElementById('userBar').getElementsByClassName('navRight visitorTabs')[0].insertAdjacentHTML('afterend', userbar_links);
            }

            // Script-Einstellungen Icon hinzufügen
            var settings_link = '<i class="fa fa-cogs fa-lg navLink" aria-hidden="true" style="padding-right:0px; cursor:pointer;" id="rabe85_script_settings" title="Script-Einstellungen &ouml;ffnen"></i>';
            document.getElementById('userBar').getElementsByClassName('navRight visitorTabs')[0].insertAdjacentHTML('beforeend', settings_link);
            document.getElementById('rabe85_script_settings').addEventListener("click", change_settings, false);
        }

        // Useronline oben mittig anzeigen
        if(setting_useronline_oben == 1) {
            var useronline = document.getElementsByClassName('section membersOnline userList')[0];
            if(useronline) {
                var useronline_head = useronline.getElementsByClassName('secondaryContent')[0].getElementsByTagName('H3')[0];
                useronline_head.setAttribute('class','subHeading');
                useronline_head.setAttribute('style','border-color: rgb(37, 37, 192);font-size: 13px;');
                useronline.prepend(useronline_head);
                document.getElementsByClassName('mainContent')[0].prepend(document.getElementsByClassName('sectionMain funbox')[0], useronline);
            }
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        fwforum();
    } else {
        document.addEventListener("DOMContentLoaded", fwforum, false);
    }

})();