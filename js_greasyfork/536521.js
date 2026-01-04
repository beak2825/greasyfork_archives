// ==UserScript==
// @name         Forum Moderation Helper
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Быстрое управление заявками на форуме BlackRussia
// @author       Маратик
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createButton(label, actionFn) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.margin = '4px';
        btn.style.padding = '5px 10px';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.background = '#222';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        btn.onclick = actionFn;
        return btn;
    }

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.background = 'rgba(0, 0, 0, 0.8)';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '9999';

    const approveButton = document.querySelector('button[data-action="approve"]');
    const rejectButton = document.querySelector('button[data-action="reject"]');
    const pendingButton = document.querySelector('button[data-action="pending"]');

    panel.appendChild(createButton('Одобрить', () => approveButton?.click()));
    panel.appendChild(createButton('Отклонить', () => rejectButton?.click()));
    panel.appendChild(createButton('На рассмотрении', () => pendingButton?.click()));

    document.body.appendChild(panel);
})();