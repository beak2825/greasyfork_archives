// ==UserScript==
// @name         Wall Barb
// @version      3
// @description  Hotkeyy
// @include      https://*/game.php*screen=place*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/519847/Wall%20Barb.user.js
// @updateURL https://update.greasyfork.org/scripts/519847/Wall%20Barb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tambahkan event listener untuk mendeteksi tombol keyboard yang ditekan
    document.addEventListener('keydown', function(event) {
        // Periksa apakah tombol yang ditekan adalah "."
        if (event.key === ".") {
            // Pilih elemen <a> di dalam baris tabel dengan kelas "row_a"
            const element = document.querySelector('tr.row_a td a.troop_template_selector');

            if (element) {
                element.click(); // Memicu klik pada elemen tersebut
                console.log('Element clicked successfully!');
            } else {
                console.error('Element not found!');
            }
        }

        // Periksa apakah tombol yang ditekan adalah "Enter"
        if (event.key === "Enter") {
            // Pilih elemen pertama yang cocok dari dua elemen target
            const attackButton = document.querySelector('#target_attack');
            const confirmButton = document.querySelector('#troop_confirm_submit');

            if (attackButton) {
                attackButton.click(); // Klik tombol "Attack"
                console.log('Attack button clicked!');
            } else if (confirmButton) {
                confirmButton.click(); // Klik tombol "Send attack"
                console.log('Confirm button clicked!');
            } else {
                console.error('No target button found!');
            }
        }
    });
})();
