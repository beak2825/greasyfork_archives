// ==UserScript==
// @name         Socket shop upgrade X
// @namespace
// @version      0.0.2
// @description  Uses Wrap jQuery ajax for listening to socket shop view changes
// @author       Xortrox
// @match        https://www.dsrpg.co/*
// @grant        none
// @namespace https://greasyfork.org/users/204463
// @downloadURL https://update.greasyfork.org/scripts/393838/Socket%20shop%20upgrade%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/393838/Socket%20shop%20upgrade%20X.meta.js
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
            onXHRSuccess(originalArguments, arguments);

            if (oldSuccess) {
                oldSuccess.apply(this, arguments);
            }
        }

        return oldAjax.apply(this, arguments);
    }
})();

const socketShopScriptName = 'newsocketshop.php';

function onXHRSuccess(originalXHR, result) {
    if (originalXHR[0].url.includes(socketShopScriptName)) {
        console.log('o boi socket shop:', $('a:contains("Upgrade")'));
    }
}
    // <a href="newsocketshop.php?action=enhance&amp;id=9905&amp;eid=14803">Upgrade</a>
