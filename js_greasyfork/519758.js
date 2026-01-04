// ==UserScript==
// @name         VIS
// @namespace    nikee.dev
// @version      2.2
// @description  make visma look good!
// @author       nikeedev
// @match        https://*.inschool.visma.no/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visma.no
// @grant        none
// @license      MIT
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/519758/VIS.user.js
// @updateURL https://update.greasyfork.org/scripts/519758/VIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let css = document.createElement("style");
        css.innerHTML = `
        .top-menu-navbar {
    background: #0659CE !important;
}

ul:first-of-type > :first-child {
    display: none !important;
}

.navbar-brand {
    border-right: 0 !important;
}

.navbar-menu-collapse {
    flex: 0 !important;
    padding-right: 35vh !important;
}

.navigation-search.search-input {
    /*padding-left: 121px !important;*/
}

.search-input-content.vs-Input.form-control {
    padding-left: 14vw !important;
    min-width: 35vw !important;
}

.user-info > .text-size1 {
    color: #a5c3ed !important;
}

#top-menu-navbar-brand {
   /** font-family: monospace; **/
   font-style: 650;
}
        `;

        document.head.appendChild(css);

        let search;

        function run() {
            search.placeholder = "[/] Søk på siden";
        }

        const waitForElement = setInterval(() => {
            search = document.body.querySelector(".search-input-content.vs-Input.form-control");
            if (search) {
                clearInterval(waitForElement); // Stop checking
                run();
            }
        }, 100);


    });


})();
