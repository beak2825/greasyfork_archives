// ==UserScript==
// @name         Mein VIS
// @namespace    https://greasyfork.org/users/305651
// @version      1.18
// @description  Diverse Änderungen an der "Mein VIS"-Seite
// @author       Ralf Beckebans
// @match        https://mein-vis.de
// @match        https://mein-vis.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404667/Mein%20VIS.user.js
// @updateURL https://update.greasyfork.org/scripts/404667/Mein%20VIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function meinvis() {


        // Linkfarben, aktiven Menüpunkt deutlicher kennzeichnen, Misc
        var load_style = document.createElement('style');
        load_style.type = 'text/css';
        load_style.innerHTML = 'html .al-theme-wrapper .main-header a { color: ghostwhite;text-decoration: none; } html .al-theme-wrapper .main-container a { color: #0d5387;text-decoration: none; } html .al-theme-wrapper .main-container a:hover { color: #0056b3;text-decoration: none; } html .al-theme-wrapper .main-footer a { color: white;text-decoration: none; } html .al-theme-wrapper .main-menu li.hasSubmenu::before { border-color: #0d5387; } ul.child-menu { padding-left: 10px !important; } li.selected.hasSubmenu { background-color: grey !important; } .form-control:focus { -webkit-box-shadow: none;box-shadow: none; } .al-theme-wrapper .searchbar input { color: #303030; } .dropdown > .dropdown-menu { top: -15px !important;left: -100px !important;background-color: #525660 !important;border: 1px solid #525660; } .al-theme-wrapper .user-dropdown .dropdown-item { color: ghostwhite;background-color: #525660 !important; } .al-theme-wrapper .user-dropdown .dropdown-item:hover { color: ghostwhite !important;background-color: #525660 !important; } #HighlightImage { cursor: pointer;transition: 0.3s; } #HighlightImage:hover { opacity: 0.7; } #img01 { width: unset; } .modal { display: none;position: fixed;z-index: 9876543210;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.9); } .modal-content { margin: auto;display: block;width: 80%;max-width: 700px;height: auto !important; } #caption { margin: auto;display: block;width: 80%;max-width: 700px;text-align: center;color: #ccc;padding: 10px 0;height: 150px; } .modal-content, #caption { animation-name: zoom;animation-duration: 0.6s; } @keyframes zoom { from {transform:scale(0)} to {transform:scale(1)} } .close { position: absolute;top: 15px;right: 35px;color: #f1f1f1;font-size: 40px;font-weight: bold;transition: 0.3s; } .close:hover, .close:focus { color: #bbb;text-decoration: none;cursor: pointer; } .dropdown-menu-top { bottom: unset !important; }';
        document.head.appendChild(load_style);


        // Autologin
        if(document.getElementsByClassName('-signin')[0]) {
            window.location.href = document.getElementsByClassName('-signin')[0].getElementsByTagName('a')[0].href;
        }


        // Header schmaler darstellen
        var header_container = document.getElementsByClassName('header-container')[0];
        if(header_container) {
            header_container.setAttribute('style','min-height: auto;max-height: 50px;');
        }
        var logo_vis = header_container.getElementsByClassName('logo')[0].querySelector('img');
        if(logo_vis) {
            logo_vis.setAttribute('style','max-height: 50px;');
        }
        var searchbar_telefon = header_container.getElementsByClassName('searchbar col-12 col-lg-5 col-xl-3 d-none d-lg-block')[0];
        if(searchbar_telefon) {
            searchbar_telefon.setAttribute('title','Telefonbuch durchsuchen');
        }
        var searchbar_inhalte = header_container.getElementsByClassName('searchbar col-12 col-lg-5 col-xl-2 d-none d-lg-block')[0];
        if(searchbar_inhalte) {
            searchbar_inhalte.setAttribute('title','Inhalte durchsuchen');
        }
        var login_area = header_container.getElementsByClassName('login-area')[0];
        if(login_area) {
            login_area.setAttribute('style','margin-top: 24px;white-space: nowrap;');
        }
        var userprofil = header_container.getElementsByClassName('main-header-nav_button')[0];
        if(userprofil) {
            userprofil.setAttribute('title','Mein Profil');
        }
        var usericon = header_container.getElementsByClassName('dropdown show')[0].querySelector('img');
        if(usericon) {
            usericon.setAttribute('style','max-height: 42px;');
        }
        var logo_pb = header_container.getElementsByClassName('logo')[1].querySelector('img');
        if(logo_pb) {
            logo_pb.setAttribute('style','max-height: 50px;');
            logo_pb.setAttribute('title','Gehe zu paderborn.de');
        }


        // Funktion - Header nur beim Hochscrollen oben am Rand anzeigen
        var sticky_header_scroll_position_old = 0;
        function sticky_header_scroll() {
            var sticky_header_scroll_position = document.documentElement.scrollTop;
            if(sticky_header_scroll_position < sticky_header_scroll_position_old) {
                document.getElementsByClassName('main-header')[0].setAttribute('style','position: fixed;top: 0px;width: 100%;z-index: 23585;');
                document.getElementsByClassName('main-container')[0].setAttribute('style','margin-top: 50px;');
            } else {
                document.getElementsByClassName('main-header')[0].setAttribute('style','position: unset;');
                document.getElementsByClassName('main-container')[0].setAttribute('style','');
            }
            sticky_header_scroll_position_old = sticky_header_scroll_position;
        }


        // Headerfunktion auswählen
        var header_auswahl = GM_getValue('header_auswahl', 'normal');
        var header_auswahl_text = 'Kopfzeile: Normal';
        var header_auswahl_status = 'fixed';

        switch(header_auswahl) {
            case 'fixed': // Header immer fest oben am Rand anzeigen
                document.getElementsByClassName('main-header')[0].setAttribute('style','position: fixed;top: 0px;width: 100%;z-index: 23585;');
                document.getElementsByClassName('main-container')[0].setAttribute('style','margin-top: 50px;');
                header_auswahl_text = 'Kopfzeile: Fixiert';
                header_auswahl_status = 'scroll';
                break;
            case 'scroll': // Header nur beim Hochscrollen oben am Rand anzeigen
                document.addEventListener('scroll', sticky_header_scroll, false);
                header_auswahl_text = 'Kopfzeile: Hochscrollen';
                header_auswahl_status = 'normal';
                break;
            default: // Header normal anzeigen (nicht mitlaufend)
                document.getElementsByClassName('main-header')[0].setAttribute('style','position: unset;');
        }


        // Benutzermenü berichtigen und erweitern
        var userdropdown0 = header_container.getElementsByClassName('user-dropdown dropdown-menu')[0].getElementsByClassName('dropdown-item');
        for(var ud = 0, userdropdown; !!(userdropdown=userdropdown0[ud]); ud++) {
            if(userdropdown.href == 'https://mein-vis.de/meine-daten') { userdropdown.href = 'https://mein-vis.de/meine-daten1/profilbild/-/egov-profil/allgemein'; }
            if(userdropdown.href == 'https://mein-vis.de/meine-daten1/profilbild') { userdropdown.href = 'https://mein-vis.de/meine-daten1/profilbild/-/egov-profil/profilbild'; }
            if(userdropdown.href == 'https://mein-vis.de/abmelden' && userdropdown.dataset.neu != 'ja') {
                userdropdown.setAttribute('data-neu','ja');
                userdropdown.insertAdjacentHTML('beforebegin', '<a class="dropdown-item" href="/meine-daten">Telefonbuchdaten</a><a class="dropdown-item" id="header_auswahl_menu" data-status="' + header_auswahl_status + '" title="Klicken zum Wechseln zwischen Normal, Fixiert und Hochscrollen" style="cursor: pointer;">' + header_auswahl_text + '</a>');
            }
        }
        function header_auswahl_speichern() {
            if(header_auswahl != document.getElementById('header_auswahl_menu').dataset.status) { GM_setValue('header_auswahl', document.getElementById('header_auswahl_menu').dataset.status); }
            //window.scrollTo(0, 0);
            location.reload();
        }
        if(document.getElementById('header_auswahl_menu')) { document.getElementById('header_auswahl_menu').addEventListener('click', header_auswahl_speichern, false); }


        // Wiki Links im Header hinzufügen
        var logo_pb2 = header_container.getElementsByClassName('logo')[1];
        if(logo_pb2) {
            logo_pb2.insertAdjacentHTML('beforebegin', '<a href="https://wiki.paderborn.de/bin/view/D3-Wiki/" class="logo" style="margin-right: 50px;font-size: larger;" title="Gehe zum d.3 Wiki" target="_blank">d.3 Wiki</a>');
        }


        // Highlights kleiner darstellen
        if(document.getElementsByClassName('highlight-quickactions')[0]) {
            if(document.getElementsByClassName('highlight-quickactions')[0].querySelector('div')) {
                document.getElementsByClassName('highlight-quickactions')[0].querySelector('div').setAttribute('style','flex-wrap: nowrap;');
            }
        }
        if(document.getElementsByClassName('highlight-story')[0]) {
            document.getElementsByClassName('highlight-story')[0].setAttribute('style','max-height: 200px;max-width: 650px;cursor: pointer;');
            if(document.getElementsByClassName('highlight-story')[0].getElementsByClassName('highlight-story-image')[0]) {
                var highlight_image = document.getElementsByClassName('highlight-story')[0].getElementsByClassName('highlight-story-image')[0].getElementsByTagName('img')[0];
                highlight_image.setAttribute('id','HighlightImage');
                highlight_image.setAttribute('title','Bild vergrößern');
                highlight_image.insertAdjacentHTML('afterend', '<div id="myModal" class="modal"><span class="close">&times;</span><img class="modal-content" id="img01"><div id="caption"></div></div>');
                var modal = document.getElementById('myModal');
                var modalImg = document.getElementById('img01');
                var captionText = document.getElementById('caption');
                highlight_image.onclick = function() {
                    modal.style.display = 'block';
                    modalImg.src = this.src;
                    captionText.innerHTML = this.alt;
                }
                var modal_close = document.getElementsByClassName('close')[0];
                modal_close.onclick = function() {
                    modal.style.display = 'none';
                }
                document.addEventListener('keydown', function(e) { let keyCode = e.keyCode; if(keyCode === 27) { modal.style.display = 'none'; } }, false);
            }
        }
        var highlight_story_text = document.getElementsByClassName('highlight-story-text')[0];
        if(highlight_story_text) {
            highlight_story_text.setAttribute('style','max-height: 200px;text-align: right;padding-top: 0px;cursor: default;');
            if(highlight_story_text.querySelector('h1')) {
                highlight_story_text.querySelector('h1').setAttribute('style', 'font-size: 23px; margin: 0px;text-shadow: 5px 5px 10px black;');
            }
            if(highlight_story_text.querySelector('h2')) {
                if(highlight_story_text.querySelector('a')) {
                    highlight_story_text.querySelector('a').setAttribute('title', highlight_story_text.querySelector('h2').innerHTML);
                    highlight_story_text.querySelector('h2').remove();
                }
            }
        }
        if(document.getElementById('layout-column_column-1')) { document.getElementById('layout-column_column-1').setAttribute('style', 'width: 71%;'); }


        // Komplette Highlight-Kacheln anklickbar machen und kleiner darstellen
        var quickaction0 = document.getElementsByClassName('highlight-quickaction');
        for(var qa = 0, quickaction; !!(quickaction=quickaction0[qa]); qa++) {
            var qa_link = quickaction.getElementsByTagName('a')[0];
            if(qa_link) {
                quickaction.setAttribute('style','background-color: #e0e0e0;min-height: 200px;min-width: 200px;max-height: 200px;max-width: 200px;cursor: pointer;');
                if(qa_link.getElementsByClassName('highlight-quickaction-text')[0]) {
                    quickaction.setAttribute('title',qa_link.getElementsByClassName('highlight-quickaction-text')[0].innerHTML);
                    if(qa_link.getElementsByClassName('highlight-quickaction-text')[0].innerHTML == ' Ansprechpartner*innen / Angebote für Mitarbeitende / Kantinenplan ') { qa_link.getElementsByClassName('highlight-quickaction-text')[0].innerHTML = 'Benefits'; }
                }
                var qa_link_target = qa_link.getAttribute('target');
                if(qa_link_target) {
                    quickaction.setAttribute('onclick','window.open(\'' + qa_link.href + '\', \'' + qa_link_target + '\'); return false;');
                } else {
                    quickaction.setAttribute('onclick','window.location.href = \'' + qa_link.href + '\'; return false;');
                }
            }
        }


        // Beitragsbilder (und Highlightbild) zum Vergrößern anklickbar machen (außer sie sind ein Link)
        var picture0 = document.getElementsByTagName('picture');
        for(var p = 0, picture; !!(picture=picture0[p]); p++) {
            let picture_link = picture.parentElement.tagName;
            if(picture_link != "A") {
                let picture_image = picture.getElementsByTagName('img')[0];
                let fileentryid = picture_image.getAttribute('data-fileentryid');
                picture_image.setAttribute('id','HighlightImage-' + fileentryid);
                picture_image.setAttribute('title','Bild vergrößern');
                let picture_image_oldstyle = picture_image.getAttribute('style');
                if(!picture_image_oldstyle) picture_image_oldstyle = "";
                picture_image.setAttribute('style', picture_image_oldstyle + 'cursor: pointer;');
                picture_image.insertAdjacentHTML('afterend', '<div id="myModal-' + fileentryid + '" class="modal"><span class="close" onclick="this.parentElement.style.display=\'none\';">&times;</span><img class="modal-content" style="height: auto;width: auto;max-height: 85vh;max-width: 85vw;" id="img-' + fileentryid + '" src="https://mein-vis.de' + picture_image.getAttribute('src') + '"></div>');
                picture_image.setAttribute('onclick', 'this.nextSibling.style.display=\'block\';');
                document.addEventListener('keydown', function(e) { let keyCode = e.keyCode; if(keyCode === 27) { document.getElementById('myModal-' + fileentryid).style.display = 'none'; } }, false); // Schließen mit Esc-Taste
            }
        }


        // Newsbilder zum Vergrößern anklickbar machen (außer sie sind ein Link)
        var newspicture0 = document.getElementsByTagName('article');
        for(var np = 0, newspicture; !!(newspicture=newspicture0[np]); np++) {
            let newspicture_link = newspicture.getElementsByClassName('news-image')[0].getElementsByTagName('a')[0];
            if(newspicture_link.getAttribute('href') == "#") {
                let newspicture_image = newspicture_link.getElementsByTagName('img')[0];
                let newspicture_id = newspicture_image.getAttribute('src').split('/').pop();
                newspicture_image.setAttribute('id','HighlightImage-' + newspicture_id);
                newspicture_image.setAttribute('title','Bild vergrößern');
                let picture_image_oldstyle = newspicture_image.getAttribute('style');
                if(!picture_image_oldstyle) picture_image_oldstyle = "";
                newspicture_image.setAttribute('style', picture_image_oldstyle + 'cursor: pointer;');
                newspicture_image.insertAdjacentHTML('afterend', '<div id="myModal-' + newspicture_id + '" class="modal"><span class="close" onclick="this.parentElement.style.display=\'none\';">&times;</span><img class="modal-content" style="height: auto;width: auto;max-height: 85vh;max-width: 85vw;" id="img-' + newspicture_id + '" src="https://mein-vis.de' + newspicture_image.getAttribute('src') + '"></div>');
                newspicture_image.setAttribute('onclick', 'this.nextSibling.style.display=\'block\';');
                document.addEventListener('keydown', function(e) { let keyCode = e.keyCode; if(keyCode === 27) { document.getElementById('myModal-' + newspicture_id).style.display = 'none'; } }, false); // Schließen mit Esc-Taste
            }
        }


    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        meinvis();
    } else {
        document.addEventListener('DOMContentLoaded', meinvis, false);
    }

})();