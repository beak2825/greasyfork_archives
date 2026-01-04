// ==UserScript==
// @name         Anti-Malware Tool for Violent Monkey
// @version      1.1
// @description  Block potentially malicious scripts or files from loading on webpages and display a watermark when malware is detected
// @match        *://*/*
// @license      Copyright (C) TheBaker0
// @author       TheBaker
// @namespace https://greasyfork.org/users/1073712
// @downloadURL https://update.greasyfork.org/scripts/465931/Anti-Malware%20Tool%20for%20Violent%20Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/465931/Anti-Malware%20Tool%20for%20Violent%20Monkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add any keywords or phrases associated with malware here
    var malwareKeywords = [
        "virus",
        "trojan",
        "malware",
        "spyware",
        "keylogger"
    ];

    // Create the watermark
    var watermark = document.createElement("div");
    watermark.style.position = "fixed";
    watermark.style.top = "0";
    watermark.style.left = "0";
    watermark.style.width = "100%";
    watermark.style.height = "100%";
    watermark.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    watermark.style.zIndex = "9999";
    watermark.style.display = "none";
    watermark.innerText = "MALWARE DETECTED! I saved your computer, you owe me a sub'script'ion!";

    // Add the watermark to the page
    document.body.appendChild(watermark);

    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        var href = links[i].href;
        for (var j = 0; j < malwareKeywords.length; j++) {
            if (href.indexOf(malwareKeywords[j]) >= 0) {
                links[i].parentNode.removeChild(links[i]);
                watermark.style.display = "block"; // Show the watermark
            }
        }
    }

    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        for (var j = 0; j < malwareKeywords.length; j++) {
            if (src.indexOf(malwareKeywords[j]) >= 0) {
                scripts[i].parentNode.removeChild(scripts[i]);
                watermark.style.display = "block"; // Show the watermark
            }
        }
    }
})();