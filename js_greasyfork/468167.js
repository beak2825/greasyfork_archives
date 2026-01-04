// ==UserScript==
// @name         iGracias Survey Autofiller
// @namespace    http://github.com/raffiihza
// @version      1.1
// @description  Menyelesaikan survey iGracias dengan cepat
// @author       Raffi Ihza Zuhairnawan
// @match        https://igracias.telkomuniversity.ac.id/survey/*
// @icon         https://igracias.telkomuniversity.ac.id/
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468167/iGracias%20Survey%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/468167/iGracias%20Survey%20Autofiller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Buat tombol autofill survey di pojok kiri bawah
    var button = document.createElement('button');
    button.innerText = 'Autofill Survey';
    button.style.position = 'fixed';
    button.style.left = '10px';
    button.style.bottom = '10px';
    button.style.zIndex = '9999';

    // Buat event listener untuk tombol
    button.addEventListener('click', function() {
        // Ada gambar "start" gk ya?
        var startImage = document.querySelector('img[title="start"]');
        if (startImage) {
            // Pencet gambarnya
            startImage.click();
        } else {
            // Kalo gk ada, pencet radio paling akhir dari setiap bagian
            var ulList = document.querySelectorAll('ul');
            ulList.forEach(function(ul) {
                var radioButtons = ul.querySelectorAll('input[type="radio"]');
                if (radioButtons.length > 0) {
                    radioButtons[radioButtons.length - 1].checked = true;
                }
            });

            // Masukin "Tidak ada" ke kotak
            var textAreas = document.querySelectorAll('textarea');
            textAreas.forEach(function(textArea) {
                textArea.value = 'Tidak ada';
            });

            // Ada tombol class "floatL4" gk? Klo iya, pencet
            var floatL4Button = document.querySelector('.floatL4');
            if (floatL4Button) {
                floatL4Button.click();
            } else {
                // Klo gk ada, ada tombol class "floatL3" gk? Klo iya, pencet
                var floatL3Button = document.querySelector('.floatL3');
                if (floatL3Button) {
                    floatL3Button.click();
                }
            }
        }

        // Klo dh habis, kasih tau notif
        if (!floatL4Button && !startImage && !floatL3Button) {
            var notificationMessage = 'Survey di halaman ini selesai. Silahkan cek beranda untuk melihat apakah ada survey yang tersisa. Jika masih ada, kamu ngekliknya kecepetan atau gk, coba ke beranda dlu trus klik tombolnya lagi. Namun, jika telah selesai semua, itu tandanya semua survey telah terisi dan kamu bisa masuk halaman iGracias. Horeee!!!';
            alert(notificationMessage);
        }
    });

    // Masukin tombolnya ke page nya
    document.body.appendChild(button);
})();