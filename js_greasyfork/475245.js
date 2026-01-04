
// ==UserScript==
// @name        Kesuksesan7
// @namespace   http://tampermonkey.net/
// @version     0.2
// @description mencari dia seorang
// @match       https://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/475245/Kesuksesan7.user.js
// @updateURL https://update.greasyfork.org/scripts/475245/Kesuksesan7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetURL = "https://id.arahlink.com/GdwpD";

    // Set the delay in milliseconds before redirecting
    var delay = 5000;

    // Check if the current URL matches the target site
    if (window.location.href.startsWith("https://nguli-online.me/")) {
        // Create a countdown element
        var countdown = document.createElement("div");
        countdown.style.position = "fixed";
        countdown.style.top = "10px";
        countdown.style.right = "10px";
        countdown.style.padding = "10px";
        countdown.style.border = "1px solid black";
        countdown.style.backgroundColor = "white";
        countdown.style.zIndex = "9999";
        countdown.innerHTML = "Redirecting to " + targetURL + " in <span id='timer'></span> seconds";

        document.body.appendChild(countdown);
        var timer = document.getElementById("timer");
        timer.innerHTML = delay / 1000;
        var countdownFunc = setInterval(function() {
            timer.innerHTML = parseInt(timer.innerHTML) - 1;
            if (timer.innerHTML == 0) {
                clearInterval(countdownFunc);
                window.location.href = targetURL;
            }
        }, 1000);
    }

    // Check if the current URL matches https://id.arahlink.com/
    if (window.location.href.startsWith("https://id.arahlink.com/")) {
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

        // Add code to click the button with id "got-cookie" after a 1-second delay
 

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
                    window.location.href = "https://go.fantasigaming.com/Fq1A";
                }, 1000);
            }
        }, 1000);
    }

    // For the other website, redirect on refresh
function redirectOnRefresh() {
    if (window.location.hostname === "id.arahlink.com") {
        var redirectURL = "https://nguli-online.me/?wpsafelink=JJIQiwMc56wApbsCadfEeFlgiHnikT3E0Rzc5R1BYZSs0VC9yNkw0L3RmOGF5LytlLzdJWDRNUDU0ajNndFlEQT0=&redir=aHR0cHM6Ly9uZ3VsaS1vbmxpbmUubWUv";
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

    var targettURL = "https://id.arahlink.com";

    // Set the delay in milliseconds before redirecting
    var delayy = 7000;

    // Check if the current URL matches the target site
    if (window.location.href.startsWith("https://www.fantasigaming.com/")) {
        // Create a countdown element
        var counttdown = document.createElement("div");
        counttdown.style.position = "fixed";
        counttdown.style.top = "10px";
        counttdown.style.right = "10px";
        counttdown.style.padding = "10px";
        counttdown.style.border = "1px solid black";
        counttdown.style.backgroundColor = "white";
        counttdown.style.zIndex = "9999";
        counttdown.innerHTML = "Redirecting to " + targettURL + " in <span id='timmer'></span> seconds";

        document.body.appendChild(counttdown);
        var timmer = document.getElementById("timmer");
        timmer.innerHTML = delayy / 1000;
        var counttdownFunc = setInterval(function() {
            timmer.innerHTML = parseInt(timmer.innerHTML) - 1;
            if (timmer.innerHTML == 0) {
                clearInterval(counttdownFunc);
                window.location.href = targettURL;
            }
        }, 1000);
    }
    function clickElement(target) {
        var event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true
        });

        target.dispatchEvent(event);
    }

    function searchAndClick() {
        var elements = document.getElementsByClassName("acc");

        for (var i = 0; i < elements.length; i++) {
            setTimeout(clickElement, 1000, elements[i]);
        }
    }

    window.addEventListener("load", searchAndClick);

})();
