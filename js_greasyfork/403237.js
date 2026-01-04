// ==UserScript==
// @name         ePV-Filter
// @namespace    https://www.ibr.cs.tu-bs.de/users/cwerner
// @version      0.5
// @description  This script filters ePV table lines showing "Es liegen keine Anmeldungen vor" from the His-In-One-System
// @author       Christian Werner, Ostfalia Hochschule für angewandte Wissenschaften
// @match        https://cmo-verw.ostfalia.de/qisserver/pages/cm/exa/examEventOverviewOwn/showOverview.xhtml?*
// @match        https://cmo-verw.ostfalia.de/qisserver/pages/sul/examAssessment/examGradesEditForm.xhtml?*
// @grant        none
// @run-at       document-idle
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/403237/ePV-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403237/ePV-Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    doFilter();

    const mutationObserver = new MutationObserver(doFilter);
    const mutationObserverOptions = {
        childList: true,
        subtree: true
    }

    // Run MutationObserver
    mutationObserver.observe(document.body, mutationObserverOptions);

    function doFilter() {
        var input, filter1, filter2, table, tr, tda, td, i, txtValue;
        filter1 = 'Es liegen keine Anmeldungen vor';
        filter2 = '\n0\n';
        tr = document.getElementsByClassName("treeTableCellLevel2");
        // traverse all table rows:
        for (i = 0; i < tr.length; i++) {
            tda = tr[i].getElementsByTagName("td");
            // check, if this is the "Leistungen/Noten eingeben" table:
            if (tda.length==8) {
                console.log(tda)
                td = tda[6];
                txtValue = td.textContent || td.innerText;
                if (txtValue.indexOf(filter1) != -1) {
                    tr[i].style.display = "none";
                }
            } else if (tda.length==11) {
                // this is the "Lehrorganisation/Prüfungen/Meine Prüfungen" table:
                td = tda[8].querySelector('span[title="Zulassungen"]');
                txtValue = td.textContent || td.innerText;
                if (txtValue == filter2) {
                    tr[i].style.display = "none";
                    tr[i].previousSibling.style.display = "none";
                }
            }
        }
    }
})();