// ==UserScript==
// @name    Delete_Ticket
// @version  1.0
// @description delete ticket
// @license AGPLv3.0
// @grant    none
// @match     https://clients.netafraz.com/admin/supporttickets.php*
// @namespace https://greasyfork.org/users/1419751
// @downloadURL https://update.greasyfork.org/scripts/545140/Delete_Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/545140/Delete_Ticket.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar (@farshad271)

(function () {
    'use strict';

    function runScript() {
        const statusSelect = document.querySelector('#ticketstatus');
        if (statusSelect) {
            statusSelect.style.minWidth = '15%';
            const btn = document.createElement('button');
            btn.innerText = 'Delete 🗑';
            btn.style.cssText = `
                                margin-left: 10px;
                                padding: 5px 10px;
                                background-color: #c0392b;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                            `;
            btn.onclick = async () => {
                const confirmed = confirm('آیا از حذف تیکت اطمینان دارید؟');
                if (!confirmed) return;

                try {
                    const wait = (ms) => new Promise(res => setTimeout(res, ms));
                    const optionsTab = [...document.querySelectorAll('.admin-tabs li a')].find(a => a.innerText.includes('Options'));
                    if (optionsTab && !optionsTab.parentElement.classList.contains('active')) {
                        optionsTab.click();
                        await wait(800);
                    }

                    const wrapper = document.querySelector('#selectUserid + .selectize-control');
                    if (!wrapper) throw 'selectize-wrapper پیدا نشد!';
                    wrapper.click();
                    await wait(300);

                    const input = wrapper.querySelector('input');
                    if (!input) throw 'input selectize پیدا نشد!';
                    input.value = 'zzzzzzzzzzzzzzz';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'z', bubbles: true }));
                    await wait(1200);

                    const firstResult = wrapper.querySelector('.selectize-dropdown-content > div');
                    if (!firstResult) throw 'نتیجه‌ای یافت نشد!';
                    firstResult.click();
                    await wait(300);

                    const statusSelect = document.querySelector('#frmTicketOptions select[name="status"]');
                    if (!statusSelect) throw 'select وضعیت پیدا نشد!';
                    statusSelect.value = 'Closed';
                    statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    await wait(300);

                    const saveBtn = document.querySelector('#frmTicketOptions button[type="submit"]');
                    if (!saveBtn) throw 'دکمه ذخیره پیدا نشد!';
                    saveBtn.click();

                } catch (e) {
                    alert('❌ خطا در حذف تیکت:\n' + e);
                }
            };
            statusSelect.parentElement.appendChild(btn);
        }
    }

    if (document.readyState === "complete") {
        runScript();
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") {
                runScript();
            }
        });
    }
})();