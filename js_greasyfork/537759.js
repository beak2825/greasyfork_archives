// ==UserScript==
// @name         Mladeleta.sk Excel
// @namespace    dev.chib.copybox2
// @version      1.7
// @description  Floating copy tool with persistent input, resizable window, and formatted order detail auto-fill on admin.mladeleta.sk (Email, Phone, Fullname). Excel-ready tab-separated format. Includes correct selectors and SPA support.
// @author       chib
// @license      MIT
// @match        https://admin.mladeleta.sk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537759/Mladeletask%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/537759/Mladeletask%20Excel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const savedTop = localStorage.getItem('copybox-top') || '100px';
    const savedLeft = localStorage.getItem('copybox-left') || '100px';
    const savedText = localStorage.getItem('copybox-text') || '';

    const box = document.createElement('div');
    box.innerHTML = `
<div id="copybox-header" style="cursor:move;font-weight:bold;margin-bottom:5px;padding:4px;background:#f1f1f1;border-bottom:1px solid #ccc; display:flex; justify-content:space-between; align-items:center;">
    <span>📋 Drag Me</span>
    <div style="display:flex;gap:4px;">
        <button id="copy-notes" style="font-size:12px;padding:2px 6px;">📋</button>
        <button id="toggle-notes" style="font-size:12px;padding:2px 6px;">✏️</button>
    </div>
</div>
<div id="notes-block">
    <textarea id="copybox-text" placeholder="Type here..." style="width:100%;height:60px;resize:vertical;"></textarea>
    <button id="copybox-button" style="margin-top:5px;width:100%;">Copy Text</button>
</div>
<div id="copybox-autofill" style="margin-top:10px;"></div>`;

    Object.assign(box.style, {
        position: 'fixed',
        top: savedTop,
        left: savedLeft,
        width: localStorage.getItem('copybox-width') ?? '220px',
        height: localStorage.getItem('copybox-height') ?? 'auto',
        padding: '10px',
        background: 'white',
        border: '1px solid #999',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
        zIndex: 9999,
        fontFamily: 'sans-serif',
        fontSize: '14px',
        resize: 'both',
        overflow: 'auto',
        boxSizing: 'border-box'
    });

    const resizeObserver = new ResizeObserver(() => {
        const computed = window.getComputedStyle(box);
        localStorage.setItem('copybox-width', computed.width);
        localStorage.setItem('copybox-height', computed.height);
    });

    resizeObserver.observe(box);
    document.body.appendChild(box);

    const textarea = document.getElementById('copybox-text');
    const button = document.getElementById('copybox-button');
    textarea.value = savedText;
    textarea.addEventListener('input', (e) => {
        localStorage.setItem('copybox-text', e.target.value);
    });
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(textarea.value);
    });

    const notesBlock = document.getElementById('notes-block');
    const toggleBtn = document.getElementById('toggle-notes');
    const copyNotesBtn = document.getElementById('copy-notes');
    const notesVisible = localStorage.getItem('copybox-notes-visible') !== 'false';
    notesBlock.style.display = notesVisible ? 'block' : 'none';
    toggleBtn.textContent = notesVisible ? '✏️' : '➕';
    toggleBtn.addEventListener('click', () => {
        const isVisible = notesBlock.style.display !== 'none';
        notesBlock.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? '➕' : '✏️';
        localStorage.setItem('copybox-notes-visible', !isVisible);
    });
    copyNotesBtn.addEventListener('click', () => {
        const content = textarea.value.trim();
        if (content) navigator.clipboard.writeText(content);
    });

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'r') {
            box.style.top = '100px';
            box.style.left = '100px';
            localStorage.setItem('copybox-top', '100px');
            localStorage.setItem('copybox-left', '100px');
        }
    });

    let offsetX = 0, offsetY = 0, isDragging = false;
    box.addEventListener('mousedown', (e) => {
        const target = e.target;
        if (target.closest('#copybox-text') || target.closest('#copybox-button') || target.closest('#copybox-autofill')) return;
        const rect = box.getBoundingClientRect();
        const edgeThreshold = 10;
        const nearEdge = (
            e.clientX - rect.left < edgeThreshold || rect.right - e.clientX < edgeThreshold ||
            e.clientY - rect.top < edgeThreshold || rect.bottom - e.clientY < edgeThreshold
        );
        if (nearEdge) return;
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newLeft = `${e.clientX - offsetX}px`;
            const newTop = `${e.clientY - offsetY}px`;
            box.style.left = newLeft;
            box.style.top = newTop;
            localStorage.setItem('copybox-left', newLeft);
            localStorage.setItem('copybox-top', newTop);
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    const autofillDiv = document.getElementById('copybox-autofill');
    const observer = new MutationObserver(() => {
        const customerBlock = document.querySelector('p.ndUserInfo_name')?.closest('div');
        const nameEl = customerBlock?.querySelector('p.ndUserInfo_name');
        const emailAnchor = customerBlock?.querySelector('a[href^="mailto:"]');
        const phoneAnchor = customerBlock?.querySelector('a[href^="tel:"]');
        const fullName = nameEl?.textContent.trim() || '';
        const email = emailAnchor?.textContent.trim() || '';
        const phone = phoneAnchor?.textContent.replace(/\D+/g, '') || '';
        const addressText = document.querySelector('p.ndAddressModel_address')?.textContent || '';
        const [street, city] = addressText.split(',').map(s => s.trim());
        const icoText = document.querySelector('p.ndAddressModel_ico')?.textContent.match(/\d+/)?.[0] || '';

        if (fullName && phone && email) {
            const formattedTab = `${email}\t${phone}\t${fullName}`;
            autofillDiv.innerHTML = `
<hr style="margin:8px 0;">
<div style="margin-top:5px; font-size:13px;">
    <code style="display:block; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${formattedTab}">
        ${formattedTab}
    </code>
    <button id="copy-auto" style="width:100%; padding:6px 0; font-weight:bold; font-size:14px; margin-bottom:5px;">
        📋 Email + Phone + Meno (Excel)
    </button>
    <div style="display:flex;gap:5px;margin-top:5px;flex-wrap:wrap;">
        <button id="copy-street" style="flex:1 1 30%;padding:6px 0;font-size:13px;">🏠 Ulica</button>
        <button id="copy-city" style="flex:1 1 30%;padding:6px 0;font-size:13px;">🌆 Mesto</button>
        <button id="copy-ico" style="flex:1 1 30%;padding:6px 0;font-size:13px;">🆔 IČO</button>
    </div>
</div>`;

            document.getElementById('copy-auto').addEventListener('click', () => {
                navigator.clipboard.writeText(formattedTab);
            });
            document.getElementById('copy-street').addEventListener('click', () => {
                if (street) navigator.clipboard.writeText(street);
            });
            document.getElementById('copy-city').addEventListener('click', () => {
                if (city) navigator.clipboard.writeText(city);
            });
            document.getElementById('copy-ico').addEventListener('click', () => {
                if (icoText) navigator.clipboard.writeText(icoText);
            });
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();