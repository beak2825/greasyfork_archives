// ==UserScript==
// @name         Çırak Sigorta Giriş Bilgilerini Doldur
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Write the next day's day, current month, and current year to the specified textboxes, and select various options on the SGK page
// @author       You
// @match        https://uyg.sgk.gov.tr/SigortaliTescil/amp/sigortaliTescilAction
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541511/%C3%87%C4%B1rak%20Sigorta%20Giri%C5%9F%20Bilgilerini%20Doldur.user.js
// @updateURL https://update.greasyfork.org/scripts/541511/%C3%87%C4%B1rak%20Sigorta%20Giri%C5%9F%20Bilgilerini%20Doldur.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to format the date as DD (day only)
    function formatDay(date) {
        let day = date.getDate();
        // Ensure two digits for the day
        return day < 10 ? '0' + day : day;
    }

    // Function to format the month and year
    function formatMonthYear() {
        let today = new Date();
        let month = today.getMonth() + 1; // Months are zero-indexed
        let year = today.getFullYear();

        // Return an object with both values
        return { month: month, year: year };
    }

    // Function to select an option from a select element by option text
    function selectOptionByText(selectElement, optionText) {
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === optionText) {
                selectElement.selectedIndex = i;  // Select the option by index
                break;
            }
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Get the textbox elements by ID
        const dayTextbox = document.getElementById('tx_TekIsGirTarGG');
        const monthTextbox = document.getElementById('tx_TekIsGirTarAA');
        const yearTextbox = document.getElementById('tx_TekIsGirTarYY');
        const dayTextboxAlt = document.getElementById('tx_IsGirTarGG');
        const monthTextboxAlt = document.getElementById('tx_IsGirTarAA');
        const yearTextboxAlt = document.getElementById('tx_IsGirTarYY');

        // Get the select elements by name
        const sigturSelect = document.querySelector('select[name="sigtur"]');
        const ozurkodSelect = document.querySelector('select[name="cmb_Ozurkod"]');
        const eskiHukumluSelect = document.querySelector('select[name="cmb_eskiHukumlu"]');
        const ogrenimDurumSelect = document.querySelector('select[name="cmb_ogrenimDurum"]');
        const gundenazSelect = document.querySelector('select[name="30gundenaz"]');
        const csgbiskolukodSelect = document.querySelector('select[name="csgbiskolukod"]');
        const cbgorevSelect = document.querySelector('select[name="cbgorev"]');

        // Get the input elements for "cbMeslekAciklama" and "cbMeslek"
        const meslekAciklamaTextbox = document.getElementById('cbMeslekAciklama');
        const meslekTextbox = document.getElementById('cbMeslek');

        if (dayTextbox && monthTextbox && yearTextbox) {
            // Get current date, month, and year
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1); // Add one day to current date

            let { month, year } = formatMonthYear(); // Get current month and year

            // Set the values of the textboxes (first group)
            dayTextbox.value = formatDay(tomorrow); // Set next day's day (DD format)
            monthTextbox.value = (month < 10 ? '0' : '') + month; // Set current month (MM format)
            yearTextbox.value = year; // Set current year (YYYY format)
        }

        if (dayTextboxAlt && monthTextboxAlt && yearTextboxAlt) {
            // Get current date, month, and year (second group)
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1); // Add one day to current date

            let { month, year } = formatMonthYear(); // Get current month and year

            // Set the values of the textboxes (second group)
            dayTextboxAlt.value = formatDay(tomorrow); // Set next day's day (DD format)
            monthTextboxAlt.value = (month < 10 ? '0' : '') + month; // Set current month (MM format)
            yearTextboxAlt.value = year; // Set current year (YYYY format)
        }

        // Select the options in the select elements
        if (sigturSelect) {
            selectOptionByText(sigturSelect, '7 - Çırak');  // Select "7 - Çırak" option
        }
        if (ozurkodSelect) {
            selectOptionByText(ozurkodSelect, 'Hayır');
        }
        if (eskiHukumluSelect) {
            selectOptionByText(eskiHukumluSelect, 'Hayır');
        }
        if (ogrenimDurumSelect) {
            selectOptionByText(ogrenimDurumSelect, 'Ortaokul yada İ.Ö.O');  // Seçilen "Ortaokul yada İ.Ö.O"
        }
        if (gundenazSelect) {
            selectOptionByText(gundenazSelect, 'Hayır');
        }
        if (csgbiskolukodSelect) {
            selectOptionByText(csgbiskolukodSelect, '10-TİCARET, BÜRO, EĞİTİM VE GÜZEL SANATLAR');
        }

        // Set the values for cbMeslekAciklama and cbMeslek
        if (meslekAciklamaTextbox) {
            meslekAciklamaTextbox.value = 'İşletmede Beceri Eğitimi Öğrencisi';
        }
        if (meslekTextbox) {
            meslekTextbox.value = '9901.03';
        }

        // Select the "05 - Çırak, Stajyer Öğrenciler vb." option in cbgorev
        if (cbgorevSelect) {
            selectOptionByText(cbgorevSelect, '05 - Çırak, Stajyer Öğrenciler vb.');
        }
    });
})();
