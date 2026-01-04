
// ==UserScript==
// @name         dordorkiw
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mencari dia
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481439/dordorkiw.user.js
// @updateURL https://update.greasyfork.org/scripts/481439/dordorkiw.meta.js
// ==/UserScript==

(function() {
    'use strict';

function cari() {
        const intervalId = setInterval(function() {
            const tombol = document.getElementById('VerifyBtn');
            if (tombol && tombol.offsetParent !== null) {
                tombol.click();
                clearInterval(intervalId);
            }
        }, 2000);
    }

    window.addEventListener('load', cari);
    
function cari2() {
        const intervalId = setInterval(function() {
            const tombol = document.getElementById('NextBtn');
            if (tombol && tombol.offsetParent !== null) {
                tombol.click();
                clearInterval(intervalId);
            }
        }, 2000);
    }

    window.addEventListener('load', cari2);
    
    
    var targetElement = document.querySelector('.btn.btn-primary.rounded.get-link.xclude-popad');

    // Jika elemen ditemukan, tunggu 1 detik, lalu lakukan redirect
    if (targetElement) {
        setTimeout(function() {
            window.location.href = 'https://doneicikiwir.blogspot.com/?m=1';
        }, 10000); // 1000 milidetik = 1 detik
    }
    
function redirectOnRefresh() {
    if (window.location.hostname === "doneicikiwir.blogspot.com") {
        var redirectURL = "https://gplinks.co/SAGEj";
        if (performance.navigation.type === 1) {
            window.location.href = redirectURL;
        }
    }
}
    redirectOnRefresh();

    
    
if (window.location.hostname === "doneicikiwir.blogspot.com") {
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
    var interval = setInterval(findImg, 1000);
}
       
})();
