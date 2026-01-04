// ==UserScript==
// @author         たかだか。/TKDK.
// @name           docomo Personal Data Consent Auto-decline
// @namespace      https://twitter.com/djtkdk_086969
// @description    「パーソナルデータの取扱いに関する同意事項」を自動的に拒否します。
// @include        https://datadashboard-agreement.front.smt.docomo.ne.jp/*
// @version        0.0.2.001
// @grant          none
// @license        MIT License; https://opensource.org/licenses/mit-license.php
// @homepage       https://twitter.com/djtkdk_086969
// @compatible     firefox
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/463755/docomo%20Personal%20Data%20Consent%20Auto-decline.user.js
// @updateURL https://update.greasyfork.org/scripts/463755/docomo%20Personal%20Data%20Consent%20Auto-decline.meta.js
// ==/UserScript==

(function() {
    console.log("dPDCAD: Checking elements...");
    if (document.title.match(/パーソナルデータの取扱いに関する同意事項/)) {
        window.addEventListener ('DOMContentLoaded', checkElem());

        var mo =
            new MutationObserver(function(mutationEventList) {
                checkElem();
            });
        var mo_conf = {
            childList: true,
            attributes: true,
            characterData: false,
            subtree: true
        };
        mo.observe(document.querySelector('body'), mo_conf);
        checkElem();
    }
    function checkElem() {
        let declineButton = document.getElementById("backButton");
        if (declineButton !== null) {
            declineButton.click();
        }
    }
})();