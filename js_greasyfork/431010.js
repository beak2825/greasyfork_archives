// ==UserScript==
// @name         Xentral Adresse
// @namespace    xentral
// @version      1.1.4
// @description  Modernes HTML5 web form und Validierung
// @author       Jakob Schöttl
// @match        https://*.xentral.biz/index.php?module=adresse&action=edit&*
// @icon         https://www.google.com/s2/favicons?domain=xentral.biz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431010/Xentral%20Adresse.user.js
// @updateURL https://update.greasyfork.org/scripts/431010/Xentral%20Adresse.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Some browsers do not style invalid inputs, so:
    $("<style type='text/css'> input:invalid { color: red; }; </style>").appendTo('head');

    // Xentral 21.1 has IBAN validation! But whitespace is still allowed.
    $('#iban').prop('maxlength', 34).prop('minlength', 14).prop('pattern', '[A-Z0-9]+'); //'(DE\\d{20}|AT\\d{18}|(?!(DE|AT))[A-Z]{2}[A-Za-z0-9]{10,30})');
    $('#swift').prop('maxlength', 11).prop('minlength', 8).prop('pattern', '[A-Z0-9]{8}|[A-Z0-9]{11}');
    // IBAN: https://de.wikipedia.org/wiki/Internationale_Bankkontonummer#Zusammensetzung
    // Deutsche IBANs haben genau 20 Ziffern hinter dem DE (https://de.iban.com/struktur)
    // BIC: https://de.wikipedia.org/wiki/ISO_9362#Aufbau

    $('#email').attr('type', 'email');
    $('#internetseite').attr('type', 'url');

    const phonePattern = '^[+0-9][-+()/ 0-9]+[0-9]$';
    $('#telefon').prop('pattern', phonePattern);
    $('#telefax').prop('pattern', phonePattern);
    $('#mobil').prop('pattern', phonePattern);
 
    const noSurroundingWhitespace = '^[^ \t].*[^ \t]$';
    $('#name').prop('pattern', noSurroundingWhitespace);
    $('#titel').prop('pattern', noSurroundingWhitespace);
    $('#ansprechpartner').prop('pattern', noSurroundingWhitespace);
    $('#abteilung').prop('pattern', noSurroundingWhitespace);
    $('#unterabteilung').prop('pattern', noSurroundingWhitespace);
    $('#adresszusatz').prop('pattern', noSurroundingWhitespace);
    $('#anschreiben').prop('pattern', noSurroundingWhitespace);
    $('#strasse').prop('pattern', noSurroundingWhitespace);
    $('#ort').prop('pattern', noSurroundingWhitespace);

    $('#plz').prop('pattern', '^(?![A-Z]{2} *-)[^ \t].*[^ \t]$');

    // https://de.wikipedia.org/wiki/Umsatzsteuer-Identifikationsnummer
    $('#ustid').prop('maxlength', 20).prop('minlength', 7).prop('pattern', '[A-Z]{2}[A-Z0-9]{5,}|CHE-\\d{3}\\.\\d{3}\\.\\d{3}').change(function() {
      var e = $(this);
      if (e.val().match(/^CHE-/)) {
        $('#ust_befreit').val(2);
      } else if (e.val().match(/^(DE|$)/)) {
        $('#ust_befreit').val(0);
      } else {
        $('#ust_befreit').val(1);
      }
    });
    $('#land').change(function() {
      var e = $(this);
      console.log(e);
      if (e.val() !== 'DE') {
        alert("Zahlungskonditionen / Besteuerung anpassen: USt-ID und Besteuerung");
        //$('#ustid').prop('required', true).val(e.val() + 'xxxxx'); // <-- diese Zeile verhindert, dass die Adresse überhaupt noch irgendwie gespeichert werden kann
      }
    });

})();