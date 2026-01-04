// ==UserScript==
// @name         idme Helper for Borang Vaccine Anak
// @namespace    https://greasyfork.org/en/users/1111962-topnexion
// @version      0.1
// @description  Unhide semua elemen yang disembunyikan oleh web dev idme.moe.gov.my yang otak terlalu bergeliga dalam menyusahkan proses pengisian maklumat oleh ibu bapa. Juga auto copy paste bagi tarikh dos DTaP, HIB, IPV, MMR sebab banyak ulangan saja tarikh depa.
// @author       You
// @match        https://moeisind.moe.gov.my/profil/anak/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.my
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469434/idme%20Helper%20for%20Borang%20Vaccine%20Anak.user.js
// @updateURL https://update.greasyfork.org/scripts/469434/idme%20Helper%20for%20Borang%20Vaccine%20Anak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all hidden input elements within tblvaksin
    var hiddenInputs = document.querySelectorAll('#tblvaksin input[type="hidden"]');

    // Make all hidden inputs visible
    for (var m = 0; m < hiddenInputs.length; m++) {
        hiddenInputs[m].style.display = '';
    }

    // Get all elements with style.display = 'none' within tblvaksin
    var elementsWithDisplayNone = document.querySelectorAll('#tblvaksin [style*="display:none"]');

    // Change style.display to an empty string ('') for all elements
    for (var l = 0; l < elementsWithDisplayNone.length; l++) {
        elementsWithDisplayNone[l].style.display = '';
    }

    // Get the elements
    var txttahunmslesdos1 = document.getElementById('txttahunmslesdos1');
    var txttahunmslesdos2 = document.getElementById('txttahunmslesdos2');
    var txttahunmumpsdos1 = document.getElementById('txttahunmumpsdos1');
    var txttahunrblldos1 = document.getElementById('txttahunrblldos1');
    var txttahunmumpsdos2 = document.getElementById('txttahunmumpsdos2');
    var txttahunrblldos2 = document.getElementById('txttahunrblldos2');

    // Add event listeners for changes in txttahunmslesdos1
    txttahunmslesdos1.addEventListener('input', function() {
        txttahunmumpsdos1.value = txttahunmslesdos1.value;
        txttahunrblldos1.value = txttahunmslesdos1.value;
    });

    // Add event listeners for changes in txttahunmslesdos2
    txttahunmslesdos2.addEventListener('input', function() {
        txttahunmumpsdos2.value = txttahunmslesdos2.value;
        txttahunrblldos2.value = txttahunmslesdos2.value;
    });

    var tblvaksin = document.getElementById('tblvaksin');

    // Get all child elements within tblvaksin
    var elements = tblvaksin.getElementsByTagName('*');

    // Loop through the elements and update properties
    for (var k = 0; k < elements.length; k++) {
        elements[k].disabled = false;
    }

    // Define the number of iterations
    var numIterations = 3;

    for (var i = 1; i <= numIterations; i++) {
        // Get the txttahundiftdos input field
        var txttahundiftdos = document.getElementById('txttahundiftdos' + i);

        // Add change event listener
        txttahundiftdos.addEventListener('change', function() {
            var value = this.value;
            var index = this.id.slice(-1); // Get the last character of the ID to determine the index

            // Set the values to corresponding fields
            document.getElementById('txttahunhibdos' + index).value = value;
            document.getElementById('txttahunipvdos' + index).value = value;
            document.getElementById('txttahunptsisdos' + index).value = value;
            document.getElementById('txttahunttnusdos' + index).value = value;
        });
    }

    // Add event listener to txttahundiftdostam
    document.getElementById('txttahundiftdostam').addEventListener('input', function() {
        var txttahundiftdostamValue = this.value;

        // Update the values of related elements
        document.getElementById('txttahunptsisdostam').value = txttahundiftdostamValue;
        document.getElementById('txttahunttnusdostam').value = txttahundiftdostamValue;
        document.getElementById('txttahunhibdostam').value = txttahundiftdostamValue;
        document.getElementById('txttahunipvdostam').value = txttahundiftdostamValue;
    });
    var table = document.getElementById('tblvaksin');
    var checkboxes = table.getElementsByTagName('input');

    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].type === 'checkbox') {
            checkboxes[j].checked = true;
        }
    }

})();