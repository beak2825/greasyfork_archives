// ==UserScript==
// @name         kbin subscriptions button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds a header button to kbin to instantly go to your subscribed/moderated magazines lists
// @author       raltsm4k
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468748/kbin%20subscriptions%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/468748/kbin%20subscriptions%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a_login = document.querySelector("#header a.login");
    var a_login_href = a_login.getAttribute("href");

    if (a_login_href !== "/login") {
        let subs_button = Object.assign(document.createElement("li"), {
            className: "dropdown"
        });
        let a = Object.assign(document.createElement("a"), {
            className: "icon",
            href: a_login_href + "/subscriptions",
            title: "View magazine lists",
        }).appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-newspaper"
        })).parentNode;
        let ul = Object.assign(document.createElement("ul"), {
            className: "dropdown__menu"
        });
        const li_subbed = document.createElement("li").appendChild(Object.assign(document.createElement("a"), {
            href: a_login_href + "/subscriptions",
            textContent: " Subscribed List "
        })).parentNode;
        const li_modded = document.createElement("li").appendChild(Object.assign(document.createElement("a"), {
            href: a_login_href + "/moderated",
            textContent: " Moderated List "
        })).parentNode;

        a.setAttribute("aria-label", "View magazine lists");
        ul.appendChild(li_subbed);
        ul.appendChild(li_modded);

        subs_button.appendChild(a);
        subs_button.appendChild(ul);

        var menu = document.querySelectorAll("#header menu")[1];
        var search_button = menu.querySelector("li");
        menu.insertBefore(subs_button, search_button);
    }
})();