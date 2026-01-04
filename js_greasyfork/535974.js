// ==UserScript==
// @name         SpringerHelper Outstanding Reviewer
// @namespace    com.springernature.script
// @version      3.1
// @description  Display outstanding reviewers in a popup with cancel buttons
// @match        *://*.springernature.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.springernature.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535974/SpringerHelper%20Outstanding%20Reviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535974/SpringerHelper%20Outstanding%20Reviewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let popup = null; // 用于跟踪当前弹窗状态

    function createPopup(htmlContent, cancelForms) {
        // 如果弹窗已存在，点击按钮则关闭
        if (popup && document.body.contains(popup)) {
            popup.remove();
            popup = null;
            return;
        }

        popup = document.createElement('div');
        popup.id = 'reviewer-popup';
        popup.style = `
            position: fixed;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            overflow: auto;
            background: white;
            border: 2px solid #333;
            z-index: 9999;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;

        popup.innerHTML = `
            <div style="position: sticky; top: 0; background: white; z-index: 10000; padding-bottom: 10px;">
                <button id="close-reviewer-popup" style="margin-right: 10px;">Close</button>
                <button id="cancel-selected" style="background-color: red; color: white; padding: 5px 10px; margin-right: 10px;">Cancel Selected Invitations</button>
                <button id="select-all" style="padding: 5px 10px;">Select All</button>
            </div>
            <h2 style="margin-top: 20px;">Outstanding Reviewers</h2>
            ${htmlContent}
        `;

        document.body.appendChild(popup);

        document.getElementById('close-reviewer-popup').onclick = () => {
            popup.remove();
            popup = null;
        };

        document.getElementById('select-all').onclick = () => {
            document.querySelectorAll('.cancel-checkbox').forEach(cb => {
                cb.checked = true;
            });
        };

        document.getElementById('cancel-selected').onclick = async () => {
            const selected = [...document.querySelectorAll('.cancel-checkbox:checked')];
            let count = 0;

            async function submitOneByOne(index) {
                if (index >= selected.length) {
                    alert(`Canceled ${count} invitation(s). You may need to refresh the page.`);
                    popup.remove();
                    popup = null;
                    return;
                }

                const cb = selected[index];
                const formIndex = cb.dataset.index;
                const form = cancelForms[formIndex];

                if (!form) {
                    submitOneByOne(index + 1);
                    return;
                }

                const clonedForm = form.cloneNode(true);
                clonedForm.style.display = "none";
                const iframe = document.createElement("iframe");
                iframe.name = "hidden_iframe_" + formIndex;
                iframe.style.display = "none";

                document.body.appendChild(iframe);
                document.body.appendChild(clonedForm);
                clonedForm.target = iframe.name;

                iframe.onload = () => {
                    count++;
                    iframe.remove();
                    clonedForm.remove();
                    setTimeout(() => submitOneByOne(index + 1), 300); // small delay between submits
                };

                try {
                    clonedForm.submit();
                } catch (e) {
                    console.error("Submit error", e);
                    submitOneByOne(index + 1); // continue even if error
                }
            }

            submitOneByOne(0);
        };
    }

    window.addEventListener('load', () => {
        const rows = document.querySelectorAll('.c-reviewer-table__row.outstanding');
        if (!rows.length) return;

        let content = '<ul style="list-style-type:none;padding:0;">';
        const cancelForms = [];

        rows.forEach((row, i) => {
            const id = row.id || `no-id-${i}`;
            const nameEl = row.querySelector('[data-test="reviewing-community-member-name"]');
            const invitedEl = row.querySelector('[data-test="reviewing-community-member-invitation-status"] .u-lh25');
            const cancelForm = row.querySelector('form[action*="cancel-invitation"]');

            const name = nameEl ? nameEl.textContent.trim() : 'Unknown';
            const invitedText = invitedEl ? invitedEl.textContent.trim() : 'No info';

            let cancelInfo = '';
            if (cancelForm) {
                cancelForms.push(cancelForm);
                cancelInfo = `<input type="checkbox" class="cancel-checkbox" data-index="${cancelForms.length - 1}" style="margin-right:10px;">`;
            }

            content += `
                <li style="margin-bottom:20px; border-bottom:1px solid #ccc; padding-bottom:10px;">
                    ${cancelInfo}
                    <strong>ID:</strong> ${id}<br>
                    <strong>Name:</strong> ${name}<br>
                    <strong>Invited:</strong> ${invitedText}<br>
                </li>
            `;
        });

        content += '</ul>';

        const showBtn = document.createElement('button');
        showBtn.textContent = 'Show Outstanding Reviewers';
        showBtn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        showBtn.onclick = () => createPopup(content, cancelForms);

        document.body.appendChild(showBtn);
    });
})();