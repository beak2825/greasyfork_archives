// ==UserScript==
// @name         Sticky Table Header - runhive.com
// @namespace    Violentmonkey Scripts
// @match        https://runhive.com/tools/pace-chart/*
// @grant        none
// @version      0.1
// @description  Make the table header sticky on scroll - 16/12/2024, 00:50:45
// @author       SnuB
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520853/Sticky%20Table%20Header%20-%20runhivecom.user.js
// @updateURL https://update.greasyfork.org/scripts/520853/Sticky%20Table%20Header%20-%20runhivecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

   GM_addStyle(`td {font-family: Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace;`);

    function makeElementsSticky() {
        const thead = document.querySelector('thead');
        const table = document.querySelector('table');
        const navbar = document.querySelector('.navbar');

        if (thead && table && navbar) {
            window.addEventListener('scroll', () => {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    row.querySelectorAll('td, th').forEach(cell => {
                        cell.innerHTML = cell.innerHTML.replace('Half<br>Marathon', 'Half');
                    });
                });

                const tableTop = table.offsetTop;
                const navbarTop = navbar.offsetTop;

                thead.classList.toggle('sticky', window.pageYOffset >= tableTop);
                navbar.classList.toggle('sticky', window.pageYOffset >= navbarTop);
            });

            GM_addStyle(`
                thead.sticky {
                    position: sticky; top: 16px; color: #fff; z-index: 2; font-size: 12px; text-transform:uppercase;
                }
                .navbar { position: sticky; top: 0;
                }
            `);
        }
    }

    window.addEventListener('load', makeElementsSticky);
})();