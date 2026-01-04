// ==UserScript==
// @name         Wrap jQuery ajax
// @namespace
// @version      0.0.3
// @description  Wraps the .ajax function of jQuery exposing its arguments to scripts
// @author       Xortrox
// @match        https://www.dsrpg.co/*
// @grant        none
// @namespace https://greasyfork.org/users/204463
// @downloadURL https://update.greasyfork.org/scripts/393804/Wrap%20jQuery%20ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/393804/Wrap%20jQuery%20ajax.meta.js
// ==/UserScript==

async function waitForVariable(target, fieldName) {
    if (target[fieldName]) {
        return;
    }

    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (target[fieldName]) {
                resolve();
                clearInterval(interval);
            }
        }, 100);
    });
}
(async function() {
    await waitForVariable(window, '$');
    console.log('Found jQuery:', $);

    const oldAjax = $.ajax;

    $.ajax = function() {
        const originalArguments = arguments;
        console.log('jQuery ajax wrap:', originalArguments);

        if (!arguments || !arguments[0]) {
            return;
        }

        let oldSuccess = arguments[0].success;

        arguments[0].success = function() {
            console.log('Success: originalArguments:', originalArguments, '\nsuccess arguments:', arguments);

            if (oldSuccess) {
                oldSuccess.apply(this, arguments);
            }
        }

        return oldAjax.apply(this, arguments);
    }
})();