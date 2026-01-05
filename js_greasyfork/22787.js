// ==UserScript==
// @name        change boring placeholder
// @namespace   http://ta-mere-en.slack.com
// @include     *
// @version     1
// @grant       none
// @description a silly script for our slack
// @downloadURL https://update.greasyfork.org/scripts/22787/change%20boring%20placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/22787/change%20boring%20placeholder.meta.js
// ==/UserScript==

var placeholder = {
    "/messages/aaaaaaaaaaahhhhhhhhhh/": "GRAHWAHHHHHHHHHHHHHHRGARGAHAAAAAAAAA",
    "/messages/@balthazar/": "ze big boss",
    "/messages/fiveyears/": "Ici on crée un super site de ouf",
    "/messages/@naamelie/": "parle a robert",
}

setInterval(function() {
    if (Object.keys(placeholder).indexOf(location.pathname) > - 1) {
        setPlaceholder(placeholder[location.pathname]);
    }
}, 100);

function setPlaceholder(str) {
    $('#message-input').attr("placeholder", str);
}