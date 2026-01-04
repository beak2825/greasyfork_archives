// ==UserScript==
// @name         DeepL Translator Shortcut
// @namespace    https://greasyfork.org/users/21515
// @version      0.2.0
// @description  Translates the selected text with DeepL on CTRL+C+C
// @author       CennoxX
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[DeepL Translator Shortcut]%20
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.deepl.com
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485185/DeepL%20Translator%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/485185/DeepL%20Translator%20Shortcut.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(function() {
    "use strict";
    const languageCombination = "en/de";
    var timesCtrlClicked = 0;
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key=="c") {
            timesCtrlClicked++;
            if (timesCtrlClicked >= 2) {
                GM_openInTab(`https://www.deepl.com/translator#${languageCombination}/${window.getSelection().toString()}`, {active: true});
            }
            setTimeout(() => (timesCtrlClicked = 0), 500);
        }
    }, true);

})();