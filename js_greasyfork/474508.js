// ==UserScript==
// @name        Kesuksesan2
// @namespace   http://tampermonkey.net/
// @version     0.7
// @description mencari dia seorang
// @match       https://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/474508/Kesuksesan2.user.js
// @updateURL https://update.greasyfork.org/scripts/474508/Kesuksesan2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetURL = "https://id.arahlink.com/ijXD3";
    var targetURL1 = "https://id.arahlink.com/2OlPOA";

    // Check if the current URL matches https://id.arahlink.com/
    if (window.location.href.startsWith("https://id.arahlink.com/ijXD3")) {
        function elementExists(query) {
            return document.querySelector(query) !== null;
        }

        function click(query) {
            document.querySelector(query).click();
        }

        function clickIfElementExists(query, timeInSec = 1) {
            if (elementExists(query)) {
                setTimeout(function() {
                    click(query);
                }, timeInSec * 1000);
            }
        }

        // Call the function to click a button with class btn btn-primary if it exists
        clickIfElementExists('.btn.btn-primary');

        // Fungsi untuk mencari elemen a dengan teks "Dapatkan tautan"
        function findLinkElement() {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var text = link.textContent.trim();
                if (text === "Dapatkan tautan") {
                    link.textContent = "SUKSES";
                    return link;
                }
            }
            return null;
        }

        setInterval(function() {
            var link = findLinkElement();
            if (link) {
                setTimeout(function() {
                    window.location.href = targetURL1;
                }, 1000);
            }
        }, 1000);
    }

if (window.location.href.startsWith("https://id.arahlink.com/2OlPOA")) {
        function elementExists(query) {
            return document.querySelector(query) !== null;
        }

        function click(query) {
            document.querySelector(query).click();
        }

        function clickIfElementExists(query, timeInSec = 1) {
            if (elementExists(query)) {
                setTimeout(function() {
                    click(query);
                }, timeInSec * 1000);
            }
        }

        // Call the function to click a button with class btn btn-primary if it exists
        clickIfElementExists('.btn.btn-primary');

        // Fungsi untuk mencari elemen a dengan teks "Dapatkan tautan"
        function findLinkElement1() {
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var text = link.textContent.trim();
                if (text === "Dapatkan tautan") {
                    link.textContent = "SUKSES";
                    return link;
                }
            }
            return null;
        }

        setInterval(function() {
            var link = findLinkElement1();
            if (link) {
                setTimeout(function() {
                    window.location.href = "https://id.arahlink.com/";
                }, 1000);
            }
        }, 1000);
    }

    // For the other website, redirect on refresh
function redirectOnRefresh() {
    if (window.location.hostname === "id.arahlink.com") {
        var redirectURL = targetURL;
        if (performance.navigation.type === 1) {
            window.location.href = redirectURL;
        }
    }
}

    redirectOnRefresh();

    // Check if the current URL matches "id.arahlink.com" without a trailing slash
if (window.location.hostname === "id.arahlink.com" && window.location.pathname === "/") {
    function findImg() {
        // Mencari elemen img dengan class inserted-btn mtz
        var img = document.querySelector("img.inserted-btn.mtz");
        // Jika elemen img ditemukan
        if (img) {
            // Hentikan pencarian
            clearInterval(interval);
            // Setelah 2 detik
            setTimeout(function() {
                // Klik elemen img
                img.click();
            }, 1000);
        }
    }

    // Membuat interval untuk mencari elemen img setiap 1 detik
    var interval = setInterval(findImg, 1000);
}

})();





