// ==UserScript==
// @name         LP Backend Enhancement
// @namespace    lp_enhancement
// @version      0.5.6
// @description  LP Backend 3000
// @author       k_avatar
// @match        https://admin.printshop-server.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388445/LP%20Backend%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/388445/LP%20Backend%20Enhancement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var shopID = document.querySelector('#shopInfo span:last-of-type strong').innerHTML;
    var shopAD = '655';
    var shopSP = '660';
    var shopPH = '658';


    // ***********************
    // better paste and search
    // ***********************

    var searchSidebarForm = document.getElementById('orderSearch');
    var searchSidebarInputGroup = document.querySelector('#orderSearch .input-group');
    var searchSidebarInput = document.getElementById('orderSearchField');
    var searchSidebarType = document.querySelector('select[name="searchFieldNav"]');

    var JN = "warenkorb.jobnummer";
    var AN = "bestellungen.auftragsnummer";
    var RN = "bestellungen.rechnungsnummer";

    var colorSearchHighlight = '#0cc4d7';
    var colorActive = '#34e858';

    // styling
    searchSidebarInputGroup.style.borderColor = colorSearchHighlight;
    searchSidebarInput.style.color = 'white';

    // disable autocomplete
    searchSidebarForm.setAttribute('autocomplete', 'off');

    // events
    searchSidebarInput.addEventListener('focus', handleFocus);
    searchSidebarInput.addEventListener('paste', handlePaste);
    searchSidebarInput.addEventListener('input', handleInput);

    // focus
    searchSidebarInput.focus();


    function handleFocus(event) {
        searchSidebarInput.select();
    }

    function handlePaste(event) {
        event.preventDefault();
        event.stopPropagation();

        var clipboardData, pasteData;

        clipboardData = event.clipboardData || window.clipboardData;
        pasteData = clipboardData.getData('Text').trim(); // remove whitespace
        searchSidebarInput.value = pasteData;

        // test number type
        var prefix = Number(pasteData.slice(0, 3));
        // console.log(pasteData[0]);
        if (Number.isInteger(prefix)) {
            // console.log('is a number');
            if (pasteData.length == 20 && pasteData[3] == '-') {
                searchSubmit(JN);
            } else if (shopID == shopAD) {
                // console.log('ad');
                if (pasteData.length == 7 && pasteData[0] == '3') {
                    searchSubmit(AN);
                } else if (pasteData.length == 7 && pasteData[0] == '4') {
                    searchSubmit(RN);
                }
            } else if (shopID == shopSP) {
                // console.log('sp');
                if (pasteData.length == 7 && pasteData[0] == '1' && Number(pasteData) < 1800000) {
                    searchSubmit(AN);
                } else if (pasteData.length == 7) {
                    searchSubmit(RN);
                }
            } else if (shopID == shopPH) {
                // console.log('ph');
                if (pasteData.length == 6) {
                    searchSubmit(AN);
                } else if (pasteData.length == 7) {
                    searchSubmit(RN);
                }
            }
        }
    }

    function handleInput(event) {
        var inputContent = searchSidebarInput.value;
        // console.log(inputContent);

        if (shopID == shopAD && inputContent.length == 1) {
            if (inputContent == '3') {
                searchSidebarType.value = AN;
            } else if (inputContent == '4') {
                searchSidebarType.value = RN;
            }
        } else if (shopID == shopSP && inputContent.length == 1) {
            if (inputContent == '1') {
                searchSidebarType.value = AN;
            } else if (Number(inputContent)) {
                searchSidebarType.value = RN;
            }
        } else if (shopID == shopSP && inputContent == '18') {
            searchSidebarType.value = RN;
        } else if (inputContent.length == 4 && inputContent.substring(0, 3) == shopID && inputContent[3] == '-') { // select JN any shop
            searchSidebarType.value = JN;
        } else if (inputContent.length == 7 && inputContent[3] != '-') { // submit AN/RN
            searchSubmit(null);
        } else if (inputContent.length == 20 && inputContent[3] == '-') { // submit JN
            searchSubmit(null);
        }
    }

    function searchSubmit(type) {
        if (type != null) {
            searchSidebarType.value = type;
        }
        searchSidebarInputGroup.style.borderColor = colorActive;
        searchSidebarForm.submit();
    }


    // hotkeys
    var KEYCODE_ESC = 27;

    document.addEventListener('keyup', handleKeyUp, false);

    function handleKeyUp(event) {
        if (event.keyCode === KEYCODE_ESC) {
            searchSidebarInput.focus();
        }
    }



    // ********************
    // beautify Terminliste
    // ********************

    if (typeof document.formular != 'undefined') {
        if (document.formular.action == "https://admin.printshop-server.com/auftrag_terminliste.php") {
            stylizeTerminListe();
            sortTerminListe();
        }
    }

    function stylizeTerminListe() {
        var cells = document.getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
            var cont = cells[i].textContent;
            if (cont == "ABGESCHLOSSEN") {
                cells[i].innerHTML = "9&nbsp;&nbsp;Abgeschlossen";
                cells[i].style.color = "gray";
                //cells[i].parentNode.style.display = "none";
            } else if (cont == "FREIGABE") {
                cells[i].innerHTML = "3&nbsp;&nbsp;Freigabe";
                cells[i].style.color = "rgb(198, 142, 41)";
            } else if (cont == "GEPRUEFT") {
                cells[i].innerHTML = "4&nbsp;&nbsp;Druckfertig";
                cells[i].style.color = "green";
            } else if (cont == "DRUCKPLATTEN") {
                cells[i].innerHTML = "5&nbsp;&nbsp;Druck";
                cells[i].style.color = "blue";
            } else if (cont == "WEITERVERA") {
                cells[i].innerHTML = "6&nbsp;&nbsp;Verarbeitung";
                cells[i].style.color = "rgb(191, 12, 173)";
            } else if (cont == "VERSENDET") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Rekla / Klärung";
                cells[i].style.color = "red";
            } else if (cont == "FREIGABE_ABGELEHNT") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Freigabe abgelehnt";
                cells[i].style.color = "red";
            } else if (cont == "FEHLERHAFT") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Daten fehlerhaft";
                cells[i].style.color = "red";
            } else if (cont == "WARTEN_BEZ") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Warten auf Bezahlung";
                cells[i].style.color = "red";
            } else if (cont == "NEU") {
                cells[i].innerHTML = "2&nbsp;&nbsp;Neu";
                //cells[i].style.color = "red";
            } else if (cont == "WARTEN_PROOF") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Warten auf Kundendaten";
                cells[i].style.color = "red";
            } else if (cont == "VERPACKT") {
                cells[i].innerHTML = "1&nbsp;&nbsp;Reklamation";
                cells[i].style.color = "red";
            }
        }
    }

    function sortTerminListe() {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("main-table");
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[4];
                y = rows[i + 1].getElementsByTagName("TD")[4];
                // Check if the two rows should switch place:
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

})();