// ==UserScript==
// @name         Miracle Scripts Settings Reset
// @namespace    Miracle Scripts
// @version      1.0.1
// @description  Reset the settings of Miracle Scripts
// @author       Samira
// @license      MIT
// @icon         https://abload.de/img/mh3k8o.png
// @match        *://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405700/Miracle%20Scripts%20Settings%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/405700/Miracle%20Scripts%20Settings%20Reset.meta.js
// ==/UserScript==

(function() {
    'use strict';

    swal({
        title: "Confirm",
        text: 'If you click "Yes", you will reset the Miracle Scripts settings to the defaults.',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        confirmButtonText: "Yes, reset settings",
        cancelButtonText: "No, cancel"
    }, function() {

        localStorage.setItem('miracleScripts', '');

        swal({
            title: "Success",
            text: 'Settings have been reset. Disable or remove the resetter script now. Afterwards reload the Agma.io website!',
            type: "success"
        });
    });

    console.log('🌸 Miracle Scripts Settings Resetter successfully loaded!');

})();