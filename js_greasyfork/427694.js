// ==UserScript==
// @name         UMLib Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a tool that helps you automatically log in UM Library website.
// @author       Koukotsukan Neo
// @match        https://ezproxy.um.edu.my/login?url=*
// @match        https://login.ezproxy.um.edu.my/*
// @icon         https://www.google.com/s2/favicons?domain=edu.my
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427694/UMLib%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/427694/UMLib%20Autologin.meta.js
// ==/UserScript==

(function() {
    const curURL = window.location.href;
    const match = (...patterns) => patterns.some(p => curURL.includes(p));
    if (match("https://ezproxy.um.edu.my/login?url=") || match("https://login.ezproxy.um.edu.my/login?qurl=")){
        document.querySelector("input[type=submit]").click();
    }
})();