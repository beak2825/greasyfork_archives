// ==UserScript==
// @name    Office_General
// @version  1.0.0
// @description Customize System for Office Department.
// @license AGPLv3.0
// @grant    none
// @match     https://clients.netafraz.com/admin/*
// @namespace https://clients.netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/530162/Office_General.user.js
// @updateURL https://update.greasyfork.org/scripts/530162/Office_General.meta.js
// ==/UserScript==
// Programmed and developed by Farshad_Mehryar

document.addEventListener("DOMContentLoaded", function () {

    if (fSelectTicketStatus = document.getElementById("ticketstatus")) {

        //========================== Delete Unused Deps In Ticket Page ==========================

        setInterval(() => {
            if (document.querySelector('span.select2-container .select2-results')) {
                var fSelect2Results = document.querySelectorAll('li.select2-results__option');
                fSelect2Results.forEach(element01 => {
                    switch (element01.innerText) {
                        case "انتقال دامنه":
                            element01.remove();
                            break;
                    }
                });
            }
            if (fPanelChangeDep = document.querySelector('.sweet-alert')) {
                if (fPanelChangeDep.classList.contains('visible')) {
                    var fSelectPanelChangeDepResults = document.querySelectorAll('div.option');
                    fSelectPanelChangeDepResults.forEach(element02 => {
                        switch (element02.innerText) {
                            case "انتقال دامنه":
                                element02.remove();
                                break;
                        }
                    });
                }
            }
        }, 200);

        //========================== Delete Unused Deps In Ticket Page ==========================

    }
});