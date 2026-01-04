// ==UserScript==
// @name            MIREA recruits
// @namespace       github.com/a2kolbasov
// @version         0.1.0
// @description     ...
// @copyright       2023 Aleksandr Kolbasov
// @match           https://www.mirea.ru/recruits/
// @grant           none
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/480906/MIREA%20recruits.user.js
// @updateURL https://update.greasyfork.org/scripts/480906/MIREA%20recruits.meta.js
// ==/UserScript==

{
    const form = document.getElementById('Form_recruits');
    const year = document.getElementById('year_input');

    year.type = 'number';

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', e => {
            e.target.value = e.target.value.trim();
        });
    });
}
