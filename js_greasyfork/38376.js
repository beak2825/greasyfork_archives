// ==UserScript==
// @name         Link to F-Status
// @namespace    https://greasyfork.org/en/users/170364-cumgolem
// @version      1.0
// @description  Turns the profile name on an F-List profile page into a link to the corresponding fstatus.stormweyr.dk page.
// @author       Cummy
// @match        https://www.f-list.net/c/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/38376/Link%20to%20F-Status.user.js
// @updateURL https://update.greasyfork.org/scripts/38376/Link%20to%20F-Status.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var charnameElement = document.getElementsByClassName('charname')[0];

    var linkElement = document.createElement("a");
    for (var i = 0, len = charnameElement.attributes.length; i < len; i++) {
        linkElement.setAttribute(charnameElement.attributes[i].name, charnameElement.attributes[i].value);
    }
    linkElement.href = "https://fstatus.stormweyr.dk" + '/c/' + charnameElement.innerText;
    linkElement.innerText = charnameElement.innerText;

    charnameElement.replaceWith(linkElement);
})();