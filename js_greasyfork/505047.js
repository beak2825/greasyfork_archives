// ==UserScript==
// @name         телега
// @namespace    http://tampermonkey.net/
// @version      2024-08-10
// @description  глеб пидорас
// @author       You
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505047/%D1%82%D0%B5%D0%BB%D0%B5%D0%B3%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/505047/%D1%82%D0%B5%D0%BB%D0%B5%D0%B3%D0%B0.meta.js
// ==/UserScript==

(function() {
    var profile_short, i, j, href, chref;
    try {
        profile_short = document.getElementById("profile_short").children[0].children;
        for (i = 0; i < profile_short.length; i++) {
            if (profile_short[i].children[0].innerText == "Telegram:") {
                href = profile_short[i].children[1].children[0].children[0].href.replace("tg://resolve?domain=", "https://t.me/");
                profile_short[i].children[1].children[0].children[0].href = href;
                profile_short[i].children[1].children[0].children[0].target = "_blank";
                profile_short[i].children[1].children[1].children[0].href = href;
                profile_short[i].children[1].children[1].children[0].target = "_blank";
            }
        }
    } catch {};

    function update() {

        console.log("Trying to update href")
        var contacts = document.getElementsByClassName("contact");
        for (var j = 0; j < contacts.length; j++) {
            try {
                if (contacts[j].href.includes("tg://resolve?domain=")) {
                    chref = contacts[j].href.replace("tg://resolve?domain=", "https://t.me/");
                    contacts[j].href = chref;
                    contacts[j].target = "_blank";
                }
            } catch {
                console.log()
            }

        }

    }

    var loop = setInterval(update, 250);


})();