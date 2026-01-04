// ==UserScript==
// @name         Input KKP
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Input KKP berdasarkan Peraturan menteri
// @license      Masmus
// @author       anonymus
// @match        https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/485992/Input%20KKP.user.js
// @updateURL https://update.greasyfork.org/scripts/485992/Input%20KKP.meta.js
// ==/UserScript==

function setElementValueIfEmpty(elementId, value) {
    try {
        const element = document.getElementById(elementId);
        if (element && element.value === null) {
            // Do nothing if the value is null
        }
        if (element && element.value === "") {
            element.value = value;
        }
    } catch (error) {
        // Do nothing if an error occurs
    }
}

function handleShortcut(event) {
    const keyPressed = event.key.toLowerCase();
    switch (keyPressed) {
        case "q":
            event.preventDefault();

            setElementValueIfEmpty("pendaftaranpertama_nomorpermohonan", "0");
            setElementValueIfEmpty("pendaftaranpertama_tahunpermohonan", "1900");
            setElementValueIfEmpty("tanggalpermohonan", "01/01/1900");

            setElementValueIfEmpty("daftarisianbukutanah_di307", "0");
            setElementValueIfEmpty("daftarisianbukutanah_tahun307", "1900");
            setElementValueIfEmpty("tanggal307", "01/01/1900");

            setElementValueIfEmpty("daftarisianbukutanah_di208", "0");
            setElementValueIfEmpty("daftarisianbukutanah_tahun208", "1900");
            setElementValueIfEmpty("tanggal208", "01/01/1900");

            setElementValueIfEmpty("daftarisianbukutanah_di202", "0");
            setElementValueIfEmpty("daftarisianbukutanah_tahun202", "1900");
            setElementValueIfEmpty("tanggal202", "01/01/1900");

            setElementValueIfEmpty("TempatLahir", "-");
            setElementValueIfEmpty("Alamat", "-");
            setElementValueIfEmpty("Kota", "-");
            setElementValueIfEmpty("NomorIdentitas", "0");

            setElementValueIfEmpty("DaftarDI_DI301_Nomor", "0");
            setElementValueIfEmpty("DaftarDI_DI301_Tahun", "1900");
            setElementValueIfEmpty("DaftarDI_DI301_Tanggal", "01/01/1900");

            setElementValueIfEmpty("DaftarDI_DI208_Nomor", "0");
            setElementValueIfEmpty("DaftarDI_DI208_Tahun", "1900");
            setElementValueIfEmpty("DaftarDI_DI208_Tanggal", "01/01/1900");

            setElementValueIfEmpty("DaftarDI_DI303_Nomor", "0");
            setElementValueIfEmpty("DaftarDI_DI303_Tahun", "1900");
            setElementValueIfEmpty("DaftarDI_DI303_Tanggal", "01/01/1900");

            setElementValueIfEmpty("DaftarDI_DI307_Nomor", "0");
            setElementValueIfEmpty("DaftarDI_DI307_Tahun", "1900");
            setElementValueIfEmpty("DaftarDI_DI307_Tanggal", "01/01/1900");

            setElementValueIfEmpty("HtHat_NilaiHT", "0");
            break;


    }
}

document.addEventListener("keydown", handleShortcut, false);