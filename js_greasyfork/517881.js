// ==UserScript==
// @name         Save Anime List as TXT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tambahkan tombol untuk menyimpan daftar anime ke file TXT
// @author       Haroro
// @match        https://myanimelist.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517881/Save%20Anime%20List%20as%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/517881/Save%20Anime%20List%20as%20TXT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fungsi untuk membuat tombol "Simpan List"
    function addSaveButton() {
        // Cari elemen menu navigasi
        const navMenu = document.querySelector('.horiznav_nav ul');
        if (!navMenu) return;

        // Buat elemen <li> untuk tombol
        const saveButtonLi = document.createElement('li');

        // Buat elemen <a> untuk tombol
        const saveButton = document.createElement('a');
        saveButton.href = "#";
        saveButton.textContent = "Simpan List";
        saveButton.className = "navtab"; // Tambahkan kelas yang sama untuk konsistensi
        saveButton.style.cursor = "pointer";

        // Tambahkan event listener untuk menyimpan data saat tombol diklik
        saveButton.addEventListener('click', () => {
            const animeData = gatherAnimeData();
            if (animeData.length === 0) {
                alert("Tidak ada data yang ditemukan!");
                return;
            }
            downloadAsTextFile("anime_list.txt", animeData.join('\n'));
        });

        // Tambahkan tombol ke dalam elemen <li> dan masukkan ke menu navigasi
        saveButtonLi.appendChild(saveButton);
        navMenu.appendChild(saveButtonLi);
    }

    // Fungsi untuk mengumpulkan data anime
    function gatherAnimeData() {
        const animeSections = document.querySelectorAll('.js-seasonal-anime-list');
        const animeData = [];

        animeSections.forEach(section => {
            const header = section.querySelector('.anime-header')?.textContent.trim();
            const animeElements = section.querySelectorAll('.js-anime-category-producer');

            animeElements.forEach(element => {
                const title = element.querySelector('.link-title')?.textContent.trim();
                const startDate = element.querySelector('.js-start_date')?.textContent.trim();

                if (title && startDate) {
                    const formattedDate = formatDate(startDate);
                    animeData.push(`[${formattedDate}] ${title} 【${header}】`);
                }
            });
        });

        return animeData;
    }

    // Fungsi untuk memformat tanggal ke [YYMMDD]
    function formatDate(dateString) {
        const year = dateString.substring(2, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${year}${month}${day}`;
    }

    // Fungsi untuk mengunduh data sebagai file TXT
    function downloadAsTextFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // Tambahkan tombol saat halaman selesai dimuat
    window.addEventListener('load', addSaveButton);
})();
