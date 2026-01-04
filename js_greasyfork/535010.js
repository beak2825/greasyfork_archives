// ==UserScript==
// @name         YTS.mx - Copy Magnet Button
// @name:id      YTS.mx - Tombol Salin Magnet
// @namespace    https://github.com/Horyzontalhoror/yts_copymagnet
// @version      2.1
// @description  Adds a "Copy Magnet" button to every movie quality on YTS.mx for easy access.
// @description:id Menambahkan tombol "Salin Magnet" di setiap kualitas film YTS.mx untuk menyalin tautan magnet dengan mudah.
// @author       Horyzontalhoror
// @license      MIT
// @match        https://yts.mx/movies/*
// @match        https://yts.lt/movies/*
// @match        https://yts.am/movies/*
// @match        https://yts.ag/movies/*
// @grant        GM_setClipboard
// @icon         https://raw.githubusercontent.com/Horyzontalhoror/yts_copymagnet/main/icon.png
// @tags         YTS.mx, magnet, torrent
// @downloadURL https://update.greasyfork.org/scripts/535010/YTSmx%20-%20Copy%20Magnet%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535010/YTSmx%20-%20Copy%20Magnet%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fungsi membuat magnet link dari hash dan judul
    function magnetify(hashkey, titlekey) {
        return `magnet:?xt=urn:btih:${hashkey}&dn=${titlekey}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce`;
    }

    // Fungsi menampilkan notifikasi "toast"
    function showToast(message, icon = "🎉") {
        const toast = document.createElement('div');
        toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 15px',
            background: '#00e054',
            color: 'white',
            borderRadius: '5px',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 10000,
            opacity: '1',
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.5s ease'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Eksekusi saat halaman selesai dimuat
    window.addEventListener('load', () => {
        setTimeout(() => {
            const tLinks = Array.from(document.querySelectorAll("a[href*='torrent/download/']"));

            tLinks.forEach(link => {
                const tHash = link.href.split("/").pop();
                const tTitle = encodeURIComponent(
                    link.getAttribute("title")
                        .replace(/^Download\s/, "")
                        .replace(/\sTorrent$/, "")
                );
                const magnet = magnetify(tHash, tTitle);

                // Ubah href menjadi magnet link
                link.href = magnet;
                link.title += " (magnet)";

                // Hindari duplikasi tombol
                if (link.nextSibling && link.nextSibling.classList?.contains('copy-magnet-btn')) return;

                // Buat tombol "Copy Magnet"
                const copyBtn = document.createElement("button");
                copyBtn.textContent = "Copy Magnet";
                copyBtn.className = "copy-magnet-btn";
                Object.assign(copyBtn.style, {
                    marginLeft: "10px",
                    padding: "5px 10px",
                    border: "none",
                    background: "#00e054",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontFamily: "inherit"
                });

                // Aksi salin magnet saat diklik
                copyBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (typeof GM_setClipboard === "function") {
                        GM_setClipboard(magnet);
                        showToast("Magnet link copied!", "📎");
                    } else {
                        showToast("Clipboard copy failed!", "❌");
                    }
                });

                // Sisipkan tombol di samping link
                link.parentNode.insertBefore(copyBtn, link.nextSibling);
            });
        }, 1000); // Tunggu elemen muncul
    });
})();
