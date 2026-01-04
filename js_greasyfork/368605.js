// ==UserScript==
// @name         Quora signup wall remover
// @version      0.1
// @description  Simply removes the signup wall from Quora.com
// @author       BrinkerVII
// @match        https://www.quora.com/*
// @namespace https://greasyfork.org/users/188199
// @downloadURL https://update.greasyfork.org/scripts/368605/Quora%20signup%20wall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/368605/Quora%20signup%20wall%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.classList.remove("signup_wall_prevent_scroll");

    let divs = document.body.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let item = divs[i];
        if (item.id.endsWith("_signup_wall_wrapper")) {
            item.remove();
        }
    }

    document.body.style.overflow = "auto";
})();