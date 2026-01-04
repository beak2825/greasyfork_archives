// ==UserScript==
// @name         Recruit Mail Button
// @namespace    http://tampermonkey.net/
// @version      4.7.1
// @license      MIT
// @description  Adds autofill and editable recruiting buttons styled like Torn UI
// @match        https://www.torn.com/messages.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533088/Recruit%20Mail%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533088/Recruit%20Mail%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LS_SUBJECT_KEY = 'recruitMailSubject';
    const LS_BODY_KEY = 'recruitMailBody';

    const defaultSubject = "Great Pay, Great Perks! 7* PSF Hiring";
    const defaultBody = `Hiya! Hope you don't mind me messaging, but wondering if you might be interested in working for my 7* PSF? We pay 10x your best stat. Happy to offer bonuses for merits in EE as well.<br><br>
The specials are pretty nice for warring (armor set bonus and better flash grenades), plus you can get bounty protection if you ever make someone mad.<br><br>
If you're interested, chat back or just apply:<br>
<a href="https://www.torn.com/joblist.php#/p=corpinfo&ID=105502" target="_blank">
https://www.torn.com/joblist.php#/p=corpinfo&ID=105502
</a><br>`;

    function getStoredSubject() {
        return localStorage.getItem(LS_SUBJECT_KEY) || defaultSubject;
    }

    function getStoredBody() {
        return localStorage.getItem(LS_BODY_KEY) || defaultBody;
    }

    function fillFields() {
        if (!location.hash.startsWith('#/p=compose')) return;
        const subjectInput = document.querySelector('input.subject');
        const messageBody = document.querySelector('div.editor-content[contenteditable="true"]');
        if (subjectInput) subjectInput.value = getStoredSubject();
        if (messageBody) messageBody.innerHTML = getStoredBody();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    function showTemplatePopup() {
        if (document.querySelector('#templatePopup')) return;

        const popup = document.createElement('div');
        popup.id = 'templatePopup';
        popup.style.position = 'fixed';
        popup.style.top = '20%';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = '#444';
        popup.style.color = '#ccc';
        popup.style.padding = '20px';
        popup.style.zIndex = '2147483647';
        popup.style.border = '1px solid #666';
        popup.style.boxShadow = '0 0 10px black';
        popup.style.width = '300px';
        popup.style.borderRadius = '6px';

        popup.innerHTML = `
            <h3 style="margin-top:0;">Set Recruit Message Template</h3>
            <label>Subject:</label><br>
            <input type="text" id="templateSubject" style="width: 100%; margin-bottom: 10px;" value="${getStoredSubject()}"><br>
            <label>Message (HTML allowed):</label><br>
            <textarea id="templateBody" rows="6" style="width: 100%; margin-bottom: 10px;">${getStoredBody().replace(/<br>/g, '\n')}</textarea><br>
            <button id="saveTemplateBtn" class="torn-btn btn-small">Save</button>
            <button id="cancelTemplateBtn" class="torn-btn btn-small" style="margin-left:10px;">Cancel</button>
        `;

        document.body.appendChild(popup);

        document.getElementById('saveTemplateBtn').onclick = () => {
            const subject = document.getElementById('templateSubject').value;
            const body = document.getElementById('templateBody').value.replace(/\n/g, '<br>');
            localStorage.setItem(LS_SUBJECT_KEY, subject);
            localStorage.setItem(LS_BODY_KEY, body);
            popup.remove();
        };

        document.getElementById('cancelTemplateBtn').onclick = () => {
            popup.remove();
        };
    }

    function createButton(text, onClick) {
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.textContent = text;
        btn.className = 'torn-btn btn-small';
        btn.style.marginLeft = '5px';
        btn.style.background = 'linear-gradient(180deg, #0066cc 0%, #004c99 100%)';
        btn.style.color = '#fff';
        btn.style.textShadow = '0 1px 0 #000';
        btn.style.border = '1px solid #000';
        btn.style.padding = '0 10px';
        btn.style.lineHeight = '22px';
        btn.onclick = onClick;
        return btn;
    }

    function insertButtons() {
        const tabBar = document.querySelector('#mailbox-main > div.mailbox-wrapper.m-top10 > ul');
        if (!tabBar || document.querySelector('.recruit-btn-autofill')) return;

        const btnContainer = document.createElement('li');
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.marginLeft = '10px';
        btnContainer.className = 'recruit-btn-wrapper';

        const autofill = createButton('Autofill', fillFields);
        const set = createButton('Set', showTemplatePopup);

        autofill.classList.add('recruit-btn-autofill');
        set.classList.add('recruit-btn-set');

        btnContainer.appendChild(autofill);
        btnContainer.appendChild(set);
        tabBar.appendChild(btnContainer);
    }

    const observer = new MutationObserver(insertButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    insertButtons();
})();
