// ==UserScript==
// @name         eduvprim: Submit form
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eduvprim.ru/otsenka-kachestva/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377835/eduvprim%3A%20Submit%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/377835/eduvprim%3A%20Submit%20form.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const waitFor = conditionCb => new Promise((resolve, reject) => {
        const interval = setInterval(
            () => {
                if (conditionCb()) {
                    resolve();
                    clearInterval(interval);
                }
            },
            500,
        );
    });

    (async () => {
        await waitFor(() => document.querySelector('select#sel1'));

        const select1 = document.querySelector('select#sel1');
        select1.value = select1.options[2].value;
        select1.dispatchEvent(new Event('change'));

        await waitFor(() => document.querySelector('select#sel2').options.length);
        const select2 = document.querySelector('select#sel2');
        select2.value = select2.options[5].value;
        select2.dispatchEvent(new Event('change'));

        await waitFor(() => document.querySelector('select#sel3').options.length);
        const select3 = document.querySelector('select#sel3');
        select3.value = select3.options[5].value;
        select3.dispatchEvent(new Event('change'));

        const ids = Array.from(document.querySelector('#sel4_block div.form-group.col-md-12').children)
            .filter(child => child.className === 'form-check')
            .map(node => node.children[0].id);
        const topAnsForQ = {};
        ids.forEach(id => {
            const [form, dropdown, q, qid, aid] = id.split('_');
            topAnsForQ[qid] = Math.max(topAnsForQ[qid] || 0, aid);
        });
        Object.entries(topAnsForQ).forEach(([qid, maxA]) => {
            const id = `form_dropdown_q_${qid}_${Math.round(Math.random() * (maxA === 5 ? 2 : 1)) + 3}`;
            document.getElementById(id).click();
        })

        document.querySelector('button.btn.btn-success.g-recaptcha').click();
    })();
})();
