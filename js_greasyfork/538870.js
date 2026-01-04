// ==UserScript==
// @name         Internet Roadtrip - Can of Beans
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces the coffee cup in Internet Roadtrip with a can of beans
// @match        https://neal.fun/internet-roadtrip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538870/Internet%20Roadtrip%20-%20Can%20of%20Beans.user.js
// @updateURL https://update.greasyfork.org/scripts/538870/Internet%20Roadtrip%20-%20Can%20of%20Beans.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const coffeeURL = "https://neal.fun/internet-roadtrip/coffee.png";
    const beansImage = "https://th.bing.com/th/id/R.67475ccd6e33fa9a7a539a66d149e0ec?rik=ye23CRQV2NOD%2fw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2ftin-of-beans-png-image-canned-baked-beans-png-dayz-standalone-wiki-fandom-powered-by-wikia-425.png&ehk=1ZVR%2fL4lprKq8HEaVZ4MEkdwMlgbAXGTlQAhgPfa2Dw%3d&risl=&pid=ImgRaw&r=0";

    const replaceCoffeeCup = () => {
        document.querySelectorAll('img').forEach(img => {
            if (img.src === coffeeURL || img.src.startsWith(coffeeURL + "?")) {
                img.src = beansImage;
                img.style.objectFit = "cover";
                img.style.borderRadius = "5px";
                img.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
                img.style.zIndex = "9999";
            }
        });
    };

    const observer = new MutationObserver(replaceCoffeeCup);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("load", () => setTimeout(replaceCoffeeCup, 1000));
})();