// ==UserScript==
// @name         CBT Nilai Tracker - By Manoegg
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tampilkan dan geser badge nilai CBT pakai tombol titik kecil.
// @author       Manoegg Gang
// @match        https://cbt.smkn3palu.sch.id/siswa/penilaian*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537752/CBT%20Nilai%20Tracker%20-%20By%20Manoegg.user.js
// @updateURL https://update.greasyfork.org/scripts/537752/CBT%20Nilai%20Tracker%20-%20By%20Manoegg.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let nilaiAwal = null;
    let badgeAktif = false;

    function buatTombolToggle() {
        if (document.getElementById("tracker-toggle")) return;

        const tombol = document.createElement("button");
        tombol.id = "tracker-toggle";
        tombol.innerText = ".";
        tombol.style.position = "fixed";
        tombol.style.bottom = "20px";
        tombol.style.right = "20px";
        tombol.style.background = "transparent";
        tombol.style.color = "#444";
        tombol.style.border = "none";
        tombol.style.fontSize = "20px";
        tombol.style.opacity = "0.5";
        tombol.style.cursor = "pointer";
        tombol.style.zIndex = 9999;
        tombol.title = "Klik untuk tampilkan/sembunyikan badge nilai";

        tombol.addEventListener("click", () => {
            badgeAktif = !badgeAktif;
            const badge = document.getElementById("badge-nilai-tracker");

            if (badgeAktif) {
                if (!badge) {
                    buatBadge();
                    enableDrag(document.getElementById("badge-nilai-tracker"));
                }
                mulaiTracking();
            } else {
                if (badge) badge.remove();
            }
        });

        document.body.appendChild(tombol);
    }

    function buatBadge() {
        if (document.getElementById("badge-nilai-tracker")) return;

        const badge = document.createElement("div");
        badge.id = "badge-nilai-tracker";
        badge.style.position = "fixed";
        badge.style.bottom = "20px";
        badge.style.right = "50px";
        badge.style.background = "#007bff";
        badge.style.color = "#fff";
        badge.style.padding = "10px 15px";
        badge.style.borderRadius = "10px";
        badge.style.fontSize = "14px";
        badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        badge.style.zIndex = 9999;
        badge.style.fontFamily = "sans-serif";
        badge.style.cursor = "move";
        badge.innerText = "⏳ Menunggu...";
        document.body.appendChild(badge);
    }

    function updateBadge(benar, skor) {
        const badge = document.getElementById("badge-nilai-tracker");
        if (badge && badgeAktif) {
            badge.innerText = `✅ Benar: ${benar}\n💯 Nilai: ${skor}`;
        }
    }

    async function ambilNilaiDariJSON(idJadwal) {
        const res = await fetch('https://cbt.smkn3palu.sch.id/siswa/hasil', {
            credentials: 'include'
        });
        const html = await res.text();

        const parseString = html.match(/JSON\.parse\('({.+})'\)/);
        if (!parseString) return { benar: null, skor: null };

        try {
            const nilaiObj = JSON.parse(parseString[1]);
            const nilaiMapel = nilaiObj[idJadwal];
            if (!nilaiMapel) return { benar: null, skor: null };

            return {
                benar: parseInt(nilaiMapel.benar_pg),
                skor: parseInt(nilaiMapel.skor_pg)
            };
        } catch (e) {
            return { benar: null, skor: null };
        }
    }

    function pasangTracking(id, idJadwal) {
        const tombol = document.getElementById(id);
        if (!tombol) return;

        tombol.addEventListener("click", () => {
            setTimeout(async () => {
                const nilai = await ambilNilaiDariJSON(idJadwal);
                if (nilai.benar === null || nilai.skor === null) return;
                updateBadge(nilai.benar, nilai.skor);
                nilaiAwal = nilai.benar;
            }, 1500);
        });
    }

    async function mulaiTracking() {
        const idJadwal = typeof infoJadwal !== "undefined" ? infoJadwal.id_jadwal : null;
        if (!idJadwal || !badgeAktif) return;

        const awal = await ambilNilaiDariJSON(idJadwal);
        nilaiAwal = awal.benar;
        updateBadge(awal.benar, awal.skor);

        pasangTracking("next", idJadwal);
        pasangTracking("prev", idJadwal);
    }

    function enableDrag(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        el.onmousedown = dragMouseDown;
        el.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            pos3 = e.clientX || e.touches?.[0].clientX;
            pos4 = e.clientY || e.touches?.[0].clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            const clientX = e.clientX || e.touches?.[0].clientX;
            const clientY = e.clientY || e.touches?.[0].clientY;

            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            el.style.bottom = "auto";
            el.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }

    // Mulai saat halaman selesai dimuat
    window.addEventListener('load', () => {
        buatTombolToggle();
    });
})();