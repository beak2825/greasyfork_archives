// ==UserScript==
// @name         CE Move Sign In As To Top
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://editor.rosettastoneclassroom.com/editor/namespaces/update/*
// @match        https://editor.rosettastoneenterprise.com/editor/namespaces/update/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387652/CE%20Move%20Sign%20In%20As%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/387652/CE%20Move%20Sign%20In%20As%20To%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var aTags = document.getElementsByTagName("a");
    var searchText = "Sign in to portal as Namespace admin";
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            found = found.getAttribute("href");
            break;
        };
    };
    console.log(found)
    var button = document.createElement("button");
    button.innerHTML = "Sign In As Admin";
    var body = document.getElementsByTagName("h2")[0];
    body.appendChild(button);
    button.addEventListener ("click", function() {
        window.open(found);
    });
})();