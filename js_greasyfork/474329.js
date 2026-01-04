// ==UserScript==
// @name        Kesuksesan
// @namespace   http://tampermonkey.net/
// @version     0.8
// @description mencari dia seorang
// @match       https://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/474329/Kesuksesan.user.js
// @updateURL https://update.greasyfork.org/scripts/474329/Kesuksesan.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var targetURL = "https://id.arahlink.com/ijXD3";
    var targetURL1 = "https://id.arahlink.com/jHJ0";
 
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
 
        // Append the countdown element to the body
        document.body.appendChild(countdown);
 
        // Get the timer element
        var timer = document.getElementById("timer");
 
        // Set the initial timer value
        timer.innerHTML = delay / 1000;
 
        // Start the countdown function
        var countdownFunc = setInterval(function() {
            // Decrease the timer value by 1
            timer.innerHTML = parseInt(timer.innerHTML) - 1;
 
            // If the timer reaches 0, clear the interval and redirect to the target URL
            if (timer.innerHTML == 0) {
                clearInterval(countdownFunc);
                window.location.href = targetURL;
            }
        }, 1000); // Execute the function every 1 second
    }
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
                    window.location.href = "https://nguli-online.me?safelink_redirect=eyJzZWNvbmRfc2FmZWxpbmtfdXJsIjoiaHR0cHM6XC9cL2RpcmVrcnV0LmNvbSIsInNhZmVsaW5rIjoiaHR0cHM6XC9cL2lkLmFyYWhsaW5rLmNvbVwvakhKMCJ9";
                }, 1000);
            }
        }, 1000);
    }
    
   if (window.location.href.startsWith("https://www.direkrut.com/")) {
        // Create a countdown element
        var countdown = document.createElement("div");
        countdown.style.position = "fixed";
        countdown.style.top = "10px";
        countdown.style.right = "10px";
        countdown.style.padding = "10px";
        countdown.style.border = "1px solid black";
        countdown.style.backgroundColor = "white";
        countdown.style.zIndex = "9999";
        countdown.innerHTML = "Redirecting to " + targetURL1 + " in <span id='timer'></span> seconds";
 
        // Append the countdown element to the body
        document.body.appendChild(countdown);
 
        // Get the timer element
        var timer = document.getElementById("timer");
 
        // Set the initial timer value
        timer.innerHTML = delay / 1000;
 
        // Start the countdown function
        var countdownFunc = setInterval(function() {
            // Decrease the timer value by 1
            timer.innerHTML = parseInt(timer.innerHTML) - 1;
 
            // If the timer reaches 0, clear the interval and redirect to the target URL
            if (timer.innerHTML == 0) {
                clearInterval(countdownFunc);
                window.location.href = targetURL1;
            }
        }, 1000); // Execute the function every 1 second
    }
    
    
    
if (window.location.href.startsWith("https://id.arahlink.com/jHJ0")) {
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
 
})();





