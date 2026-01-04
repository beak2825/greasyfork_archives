// ==UserScript==
// @name         Replace Steering Wheel with Full Pizza
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace the steering wheel in Internet Roadtrip with a full pizza image (slightly bigger)
// @match        https://neal.fun/internet-roadtrip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538865/Replace%20Steering%20Wheel%20with%20Full%20Pizza.user.js
// @updateURL https://update.greasyfork.org/scripts/538865/Replace%20Steering%20Wheel%20with%20Full%20Pizza.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pizzaImage = "https://th.bing.com/th/id/R.5bde448687401003325e926c2be9eec4?rik=cSAkKyWHY%2fb1%2fA&riu=http%3a%2f%2fpngimg.com%2fuploads%2fpizza%2fsmall%2fpizza_PNG43988.png&ehk=MbFGxHZOOJByVmL2oOADQF3sXBwu7hzLG5Ezefko5g4%3d&risl=&pid=ImgRaw&r=0";

    const replaceSteeringWheel = () => {
        document.querySelectorAll('img').forEach(img => {
            const isLargeImage = img.width >= 200 && img.height >= 200;

            if (isLargeImage && !img.src.includes("pizza")) {
                img.src = pizzaImage;
                img.style.width = "370px"; // increased from 300px
                img.style.height = "370px"; // increased from 300px
                img.style.objectFit = "cover";
                img.style.borderRadius = "50%"; // Keep it circular
                img.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
                img.style.zIndex = "9999";
            }
        });
    };

    const observer = new MutationObserver(replaceSteeringWheel);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("load", () => setTimeout(replaceSteeringWheel, 1000));
})();