// ==UserScript==
// @name         COINCLIX
// @namespace    coinclix.by.gmxch
// @version      3.0
// @description  COINCLIX HELPER
// @author       gmxch
// @match        *://coinclix.co/*
// @match        *://geekgrove.net/*
// @match        *://vitalityvista.net/*
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/530655/COINCLIX.user.js
// @updateURL https://update.greasyfork.org/scripts/530655/COINCLIX.meta.js
// ==/UserScript==

//=== THIS IS ADDITIONAL, U NEED TO DOWNLOAD SC "Bypass It"

(function () {
    'use strict';

    function runWhenHostMatches(hosts, callback) {
        if (hosts.some(host => window.location.hostname.includes(host))) {
            callback();
        }
    }

    function tungguElemen(selector, callback) {
        let interval = setInterval(() => {
            let elemen = document.querySelector(selector);
            if (elemen) {
                clearInterval(interval);
                callback(elemen);
            }
        }, 500);
    }

    function tungguDanKlik(selector) {
        let interval = setInterval(() => {
            let tombol = document.querySelector(selector);
            if (tombol) {
                clearInterval(interval);
                tombol.click();
            }
        }, 500);
    }

    // === Fungsi 1: Auto Copy & Klik (CoinClix) ===
    runWhenHostMatches(["coinclix.co"], function () {
        console.log("Fungsi Auto Copy aktif di CoinClix");

        tungguElemen("i.mdi-content-copy", tombolCopy => {
            let kode = tombolCopy.getAttribute("data-clipboard-text");
            if (kode) {
                GM_setClipboard(kode);
                console.log("Kode disalin ke clipboard:", kode);
                setTimeout(() => tombolCopy.click(), 500);
            }
        });
    });

    // === Fungsi 2: Auto Paste & Submit (GeekGrove/VitalityVista) ===
    runWhenHostMatches(["geekgrove.net", "vitalityvista.net"], function () {
        console.log("Fungsi Auto Paste aktif di", window.location.hostname);

        navigator.clipboard.readText().then(kode => {
            if (!kode.trim()) {
                console.warn("Clipboard kosong, tidak ada kode untuk dipaste.");
                return;
            }

            tungguElemen("#link_input.form-control", inputForm => {
                inputForm.focus();
                inputForm.click();
                setTimeout(() => {
                    inputForm.value = kode;
                    inputForm.dispatchEvent(new Event("input"));

                    tungguDanKlik(".btn-primary.btn-ripple"); // Klik Submit
                    setTimeout(() => {
                        tungguDanKlik(".btn-ripple.bg-gradient.btn-primary.btn"); // Klik Continue
                    }, 1000);
                }, 300);
            });
        });
    });

})();
