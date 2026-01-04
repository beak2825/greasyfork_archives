// ==UserScript==
// @name         ChordTela View Simple
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  digunakan untuk mengubah tampilan web chordtela.com
// @author       ogi darma tena
// @match        https://www.chordtela.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522067/ChordTela%20View%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/522067/ChordTela%20View%20Simple.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Tambahkan delay 3 detik
    setTimeout(() => {
        // Hapus semua kelas di elemen body, kecuali kelas yang diperlukan
        const bodyElement = document.body;
        const preservedClasses = ['telabox', 'transpose-toolbox']; // Daftar kelas yang tidak akan dihapus
        bodyElement.className = bodyElement.className
            .split(' ') // Mengubah daftar kelas menjadi array
            .filter(className => preservedClasses.includes(className)) // Menyaring kelas yang perlu dipertahankan
            .join(' '); // Menggabungkan kembali menjadi string

        // Ambil semua elemen dengan kelas "transpose-toolbox" dan "telabox"
        const transposeElements = document.querySelectorAll('.transpose-toolbox');
        const telaboxElements = document.querySelectorAll('.telabox');

        // Hapus semua elemen lain di body
        document.body.innerHTML = '';

        // Menambahkan elemen dengan kelas "transpose-toolbox" (satu kolom)
        transposeElements.forEach(element => {
            // Menambahkan gaya CSS untuk menampilkan "transpose-toolbox" dalam satu kolom
            element.style.columnCount = '1'; // Satu kolom
            element.style.columnGap = '0'; // Tidak ada jarak antar kolom
            element.style.whiteSpace = 'normal'; // Membungkus teks dengan normal (bukan pre-wrap)

            // Menambahkan elemen "transpose-toolbox" ke body
            document.body.appendChild(element);
        });

        // Menambahkan elemen dengan kelas "telabox" ke body (dua kolom dengan garis pemisah jika tidak ada <pre>)
        telaboxElements.forEach(element => {
            const preElements = element.querySelectorAll('pre');

            if (preElements.length > 0) {
                preElements.forEach(pre => {
                    // Mengubah teks di dalam <pre> menjadi dua kolom
                    pre.style.columnCount = '2'; // Membagi teks menjadi 2 kolom
                    pre.style.columnGap = '20px'; // Menambahkan jarak antar kolom
                    pre.style.whiteSpace = 'pre-wrap'; // Membungkus teks untuk mencegah pemotongan kata
                    pre.style.wordWrap = 'break-word'; // Memastikan kata panjang terputus dengan baik
                    pre.style.lineHeight = '0.85'; // Mengatur jarak antar baris menjadi lebih rapat (nilai lebih kecil)
                    pre.style.columnRule = '1px solid black'; // Menambahkan garis pemisah dengan ketebalan 1px dan warna hitam
                });
            } else {
                // Jika tidak ada elemen <pre>, terapkan dua kolom langsung pada elemen telabox
                element.style.columnCount = '2';
                element.style.columnGap = '20px';
                element.style.whiteSpace = 'pre-wrap';
                element.style.wordWrap = 'break-word';
                element.style.lineHeight = '0.85';
                element.style.columnRule = '1px solid black';
            }

            // Menambahkan elemen "telabox" ke body
            document.body.appendChild(element);
        });

        // Mengubah warna teks semua elemen dengan kelas "tbi-tooltip" menjadi #0000FF (biru)
        const tooltipElements = document.querySelectorAll('.tbi-tooltip');
        tooltipElements.forEach(element => {
            element.style.color = '#0000FF'; // Mengubah warna teks menjadi biru
        });

        // Mengaktifkan designmode
        document.designMode = 'on';

        // Mengubah warna latar belakang body menjadi putih
        document.body.style.backgroundColor = 'white';
        document.body.style.padding = '2px'
        // Menambahkan aturan CSS @media print untuk menyembunyikan elemen dengan kelas 'transpose-toolbox'
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
    @media print {
        .transpose-toolbox {
            display: none !important;
        }
    }
`;
// Sisipkan elemen <style> ke dalam <head> agar berlaku saat mencetak
document.head.appendChild(style);

    }, 4000); // Jeda 3000 ms = 3 detik
})();
