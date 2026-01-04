// ==UserScript==
// @name         WAX Auto Accept Signing
// @namespace    wax.io
// @version      1.0.2
// @description  Auto Accept Signing for WAX.io
// @author       channox32
// @match        https://all-access.wax.io/cloud-wallet/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427136/WAX%20Auto%20Accept%20Signing.user.js
// @updateURL https://update.greasyfork.org/scripts/427136/WAX%20Auto%20Accept%20Signing.meta.js
// ==/UserScript==

(function () {
    var WaitForReady = setInterval(function () {
        var tags_i = document.getElementsByTagName("button");
        for (var i = 0; i < tags_i.length; i++) {
            if (tags_i[i].textContent == "Approve") {
                var tags_j = document.getElementsByTagName("input");
                for (var j = 0; j < tags_j.length; j++) {
                    if (tags_j[j].value == "remember") {
                        tags_j[j].click();
                        break;
                    }
                }
                tags_i[i].click();
                clearInterval(WaitForReady);
                break;
            }
        }
    }, 100);
})();