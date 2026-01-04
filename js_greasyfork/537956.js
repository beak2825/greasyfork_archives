// ==UserScript==
// @name         Mobile banque (crédits)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Permet de modifier les crédits dans le champ de retrait / dépot banque
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537956/Mobile%20banque%20%28cr%C3%A9dits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537956/Mobile%20banque%20%28cr%C3%A9dits%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputIds = ['champ_retrait_credit_compte', 'champ_depot_credit_compte'];
    const fixedInputs = new Set();

    function fixInputFocus(targetInputId) {
        const inputField = document.getElementById(targetInputId);
        if (!inputField || fixedInputs.has(targetInputId)) {
            return fixedInputs.has(targetInputId);
        }

        ['touchend', 'click'].forEach(eventType => {
            inputField.addEventListener(eventType, function(event) {
                event.stopPropagation();
                this.focus();
            }, true);
        });

        fixedInputs.add(targetInputId);
        return true;
    }

    function tryApplyFixesToAllTargets() {
        let allCurrentlyFixedOrNonExistent = true;
        for (const id of inputIds) {
            if (!fixedInputs.has(id)) {
                if (document.getElementById(id)) {
                    if (!fixInputFocus(id)) {
                        allCurrentlyFixedOrNonExistent = false;
                    }
                } else {
                    allCurrentlyFixedOrNonExistent = false;
                }
            }
        }
        return allCurrentlyFixedOrNonExistent;
    }

    const observer = new MutationObserver(function(mutationsList, observerInstance) {
        if (tryApplyFixesToAllTargets()) {
            const allExpectedAreFixed = inputIds.every(id => fixedInputs.has(id));
            if (allExpectedAreFixed) {
                observerInstance.disconnect();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (tryApplyFixesToAllTargets()) {
        const allExpectedAreFixed = inputIds.every(id => fixedInputs.has(id));
        if (allExpectedAreFixed) {
            observer.disconnect();
        }
    }
})();