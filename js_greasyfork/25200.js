// ==UserScript==
// @name        GitHub: involved issues
// @namespace   https://akinori.org
// @description Make the Pulls and Issues links show your involved issues
// @license     2-clause BSDL
// @author      Akinori MUSHA
// @include     https://github.com/*
// @version     1.0.3
// @homepage    https://github.com/knu/userjs-github_involved_issues
// @homepage    https://greasyfork.org/scripts/25200-github-involved-issues
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/25200/GitHub%3A%20involved%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/25200/GitHub%3A%20involved%20issues.meta.js
// ==/UserScript==
"use strict";
(function () {
    const meta = document.querySelector("meta[name=user-login]")

    if (!meta)
        return

    const user = meta.content
    const encode = function (decoded) {
        return encodeURIComponent(decoded).replace(/%20/g, "+")
    }

    const links = document.querySelectorAll("header ul li a")
    for (let i = 0; i < links.length; i++) {
        const href = links[i].getAttribute("href")
        switch (href) {
        case "/pulls":
            links[i].setAttribute("href", href + "?q=" + encode("is:open is:pr involves:" + user + " sort:updated-desc"))
            break
        case "/issues":
            links[i].setAttribute("href", href + "?q=" + encode("is:open is:issue involves:" + user + " sort:updated-desc"))
            break
        }
    }
})();
