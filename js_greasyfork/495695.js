// ==UserScript==
// @name         Pantheon Light Mode - Unofficial
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  Unofficial Light Mode for PantheonRP.de - No support given, may be broken. Have fun!
// @author       You
// @match        https://pantheonrp.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pantheonrp.de
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495695/Pantheon%20Light%20Mode%20-%20Unofficial.user.js
// @updateURL https://update.greasyfork.org/scripts/495695/Pantheon%20Light%20Mode%20-%20Unofficial.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCss(cssString) {
        var head = document.getElementsByTagName('head')[0];
        var newCss = document.createElement('style');

        newCss.innerHTML = cssString;

        head.appendChild(newCss);
    }

    addCss(`
        * {
            color: #2b2b2b !important;
            text-shadow: none !important;
        }

        body {
            background-color: #d9d9d9 !important;
            background-image: none !important;
        }

        .navbar.bg-dark {
            background-color: #bdbdbd !important;
            border-bottom: 1px solid #7c7c7c !important;
        }

        body > nav.navbar > a.navbar-brand {
            font-weight: 900 !important;
        }

        .header > img.header-logo {
            filter: invert(1) !important;
        }

        #chat-counter {
            background-color: #7c7c7c !important;
            color: #fff !important;
        }

        .card .card-header {
            background-color: #7c7c7c !important;
            color: #fff !important;
        }

        .card .card-body {
            background-color: #bdbdbd !important;
        }

        .dropdown-menu {
            color: #2b2b2b !important;
            background-color: #bdbdbd !important;
        }

        .dropdown-menu .nav-link {
            color: #2b2b2b !important;
        }

        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_filter input:focus, .dataTables_wrapper .dataTables_filter input:focus-visible {
            background-color: #bdbdbd !important;
            color: #2b2b2b !important;
        }

        table.dataTable thead {
            color: #2b2b2b !important;
            background-color: #bdbdbd !important;
        }

        table.dataTable tbody tr {
            color: #2b2b2b !important;
            background-color: #d9d9d9 !important;
        }

        .ql-toolbar.ql-snow {
            background-color: #bdbdbd !important;
        }

        .nav.nav-pills .nav-link.active, .nav-pills .show > .nav-link {
            background-color: #7c7c7c !important;
            color: #fff !important;
        }

        .nav.nav-pills .nav-link {
            background-color: #bdbdbd !important;
            color: #2b2b2b !important;
        }

        .accordion-button:not(.collapsed) {
            background-color: #7c7c7c !important;
            color: #fff !important;
        }

        .accordion-button {
            background-color: #bdbdbd !important;
            color: #2b2b2b !important;
        }

        .accordion-item {
            background-color: #bdbdbd !important;
        }

        .messenger .contacts .form-control {
            background-color: #bdbdbd !important;
            color: #2b2b2b !important;
        }
    `);
})();