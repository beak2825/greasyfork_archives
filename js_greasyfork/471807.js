// ==UserScript==
// @name         Quizlet Test Lag Remover
// @version      1.0
// @author       refracta
// @description  Remove lag-causing test logic in Quizlet test
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @license      MIT
// @run-at document-end
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/471807/Quizlet%20Test%20Lag%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/471807/Quizlet%20Test%20Lag%20Remover.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    function waitFor(checkFunction, checkDelay = 100) {
        return new Promise(resolve => {
            let i = setInterval(_ => {
                try {
                    let check = checkFunction();
                    check ? clearInterval(i) || resolve(check) : void 0
                } catch (e) {}
            }, checkDelay);
        });
    }
    if (location.pathname.endsWith('/test')) {
        await waitFor(_ => document.querySelector('div[role="dialog"]'));
        await waitFor(_ => document.querySelector('div[role="dialog"]') === null);
        let listInputs = Array.from(await waitFor(_ => document.querySelectorAll('.AssemblyInput input')));
        let clones = [];
        for (let i = 0; i < listInputs.length; i++) {
            let e = listInputs[i];
            const index = i;
            let clone = e.cloneNode(true);
            clone.addEventListener('keydown', function (e) {
                if (e.code === 'Enter') {
                    setTimeout(_ => {
                        clones[index + 1].focus();
                    }, 325);
                }
            });
            clones.push(clone);
            e.parentNode.replaceChild(clone, e);
        }

        let submit = document.querySelector('#testCTA');
        let submitClone = submit.cloneNode(true);
        submit.parentNode.replaceChild(submitClone, submit);
        submitClone.addEventListener('click', function (e) {
            function setValue(element, value) {
                let setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
                setter.call(element, value);
                let event = new Event('input', {
                    bubbles: true
                });
                element.dispatchEvent(event);
            }

            for (let i = 0; i < clones.length; i++) {
                clones[i].parentNode.replaceChild(listInputs[i], clones[i]);
                setValue(listInputs[i], clones[i].value);
            }
            submitClone.parentNode.replaceChild(submit, submitClone);
            submit.click();
        });
    }
})();