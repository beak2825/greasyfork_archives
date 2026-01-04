// ==UserScript==
// @name         Date Extractor and Overlay
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Extract data from Emploi Public Backoffice and show it in overlay
// @author       Yassine.N
// @match        https://backoffice.emploi-public.ma/gestionnaire/concours/candidature-concours-fiche/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478019/Date%20Extractor%20and%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/478019/Date%20Extractor%20and%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Arabic month map
    function parseArabicDate(dateStr) {
        const arabicMonths = {
            "يناير": 0, "فبراير": 1, "مارس": 2, "أبريل": 3,
            "ماي": 4, "يونيو": 5, "يوليوز": 6, "غشت": 7,
            "شتنبر": 8, "أكتوبر": 9, "نونبر": 10, "دجنبر": 11
        };

        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0]);
        const month = arabicMonths[parts[1]];
        const year = parseInt(parts[2]);

        if (!day || month === undefined || !year) return null;

        return new Date(year, month, day);
    }

    function calculateAge(dateOfBirth, referenceDate) {
        const dob = new Date(dateOfBirth);
        const ref = new Date(referenceDate);
        let age = ref.getFullYear() - dob.getFullYear();

        if (ref.getMonth() < dob.getMonth() || (ref.getMonth() === dob.getMonth() && ref.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    }

    function getCIN() {
        const cin = document.getElementById('cin');
        return cin ? cin.value : "NO CIN";
    }

    function checkRadio() {
        const radioInput = document.getElementById('fonctionnaire1');
        return (radioInput && radioInput.checked) ? "FONCTIONNAIRE" : "";
    }

    function checkRadio2() {
        const radioInput = document.getElementById('specifite3');
        return (radioInput && radioInput.checked) ? "MAKFOUL" : "";
    }

    function checkRadio3() {
        const radioInput = document.getElementById('specifite2');
        return (radioInput && radioInput.checked) ? "HANDICAP" : "";
    }

    function getSelectedOption() {
        const selectElement = document.getElementById('specialite');
        if (selectElement) {
            const selectedOption = selectElement.options[selectElement.selectedIndex].text;
            return selectedOption;
        }
        return "No Speciality";
    }

    function displayOverlay(age, message, message2, message3, cinnumber, speciality) {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '150px';
        overlay.style.left = '550px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.color = 'white';
        overlay.style.fontSize = '16px';
        overlay.style.padding = '15px';
        overlay.style.borderRadius = '8px';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        overlay.style.whiteSpace = 'pre-line';

        let html = `Age: ${age} years<br>`;
        if (cinnumber) html += `CIN: ${cinnumber}<br>`;

        if (message) html += `${message}<br>`;
        if (message2) html += `${message2}<br>`;
        if (message3) html += `${message3}<br>`;

        if (speciality) html += `Speciality: ${speciality}<br>`;

        if (age >= 40 || message || message2 || message3) {
            overlay.style.backgroundColor = 'red';
        }

        overlay.innerHTML = html;

        const container = document.querySelector('.content');
        if (container) {
            container.style.position = 'relative';
            container.appendChild(overlay);
        } else {
            console.warn("Fallback to body: .content container not found.");
            overlay.style.position = 'fixed';
            document.body.appendChild(overlay);
        }
    }

    // Main logic
    const rawDate = document.getElementById('dateNaissance')?.value;
    const extractedDate = parseArabicDate(rawDate);
    const radioMessage = checkRadio();
    const radioMessage2 = checkRadio2();
    const radioMessage3 = checkRadio3();
    const cinMessage = getCIN();
    const selectedSpeciality = getSelectedOption();

    if (extractedDate) {
        const referenceDate = new Date();
        const age = calculateAge(extractedDate, referenceDate);
        displayOverlay(age, radioMessage, radioMessage2, radioMessage3, cinMessage, selectedSpeciality);
    } else {
        console.warn("Date not parsed correctly:", rawDate);
    }
})();
