// ==UserScript==
// @name         Old ProtonMail
// @version      1.0
// @author       openpaige
// @description  Automatically use ProtonMail's old interface.
// @namespace    https://gitlab.com/openpaige-user-scripts
// @icon         https://gitlab.com/openpaige-user-scripts/old-protonmail/-/raw/main/icon.png
// @match        *://mail.protonmail.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/427527/Old%20ProtonMail.user.js
// @updateURL https://update.greasyfork.org/scripts/427527/Old%20ProtonMail.meta.js
// ==/UserScript==

function matchURL(url) {
    return !!url.match(/^(http(s?):\/\/)(mail.protonmail.com)/gim);
}

function rewriteURL(url) {
    return 'https://old.protonmail.com/login' + url.split('protonmail.com').pop();
}

url = window.location.href;
if ( matchURL(url) ) {
    window.location.assign(rewriteURL(url));
}
