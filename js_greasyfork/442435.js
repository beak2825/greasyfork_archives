// ==UserScript==
// @name         Filter only approved students
// @namespace    https://careerfoundry.com/en/admin/user_referrals
// @version      0.1
// @description  Deletes all rows that aren't approved students
// @author       You
// @match        https://careerfoundry.com/en/admin/user_referrals
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442435/Filter%20only%20approved%20students.user.js
// @updateURL https://update.greasyfork.org/scripts/442435/Filter%20only%20approved%20students.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let listLength = 0;

        const button = document.createElement('button');
        button.innerHTML = 'Filter only Approved Students';

        button.onclick = async () => {
            const select = document.querySelector('.cf-form__input.referral-status--js');
            select.value = 'approved';
            select.dispatchEvent(new Event('change'));
            await new Promise(r => setTimeout(r, 1500));

            while (listLength < document.querySelectorAll('.table__row.user_referral__row').length) {
              listLength = document.querySelectorAll('.table__row.user_referral__row').length;
              window.scrollTo(0, document.body.scrollHeight);
              await new Promise(r => setTimeout(r, 1000));
            }

            const list = document.querySelectorAll('.table__row.user_referral__row');
            list.forEach(row => {
                if (!Array.from(row.classList).includes('approved')) row.remove();

                const itemsWithStudent = Array.from(row.children).filter(({ innerHTML }) => innerHTML === 'Student');

                if (!itemsWithStudent.length) {
                    row.remove();
                } else {
                    row.style.backgroundColor = 'lightgreen';
                }
            });

            window.scrollTo(0, 0);
        }

        const header = document.querySelector('.admin__referrals__search');
        header.appendChild(button);
    });
})();