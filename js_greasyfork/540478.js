// ==UserScript==
// @name         💀 Hide By User v1.0.0
// @namespace    https://empornium.is/
// @version      1.0.0
// @description  EMPRESS Hide Torrents By Uploader Module (Now Standalone)
// @author       serpentGPT
// @match        https://*.empornium.is/*
// @match        https://*.empornium.sx/*
// @match        https://*.empornium.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540478/%F0%9F%92%80%20Hide%20By%20User%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/540478/%F0%9F%92%80%20Hide%20By%20User%20v100.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BLOCK_KEY = 'emp_hidden_uploaders';
    let lastBlocked = null;

    const get = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    };
    const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

    function blockUploader(uploaderName) {
        const list = get(BLOCK_KEY);
        if (!list.includes(uploaderName)) {
            list.push(uploaderName);
            set(BLOCK_KEY, list);
            lastBlocked = uploaderName;
            hideTorrentsByUploader();
        }
    }

    function createBlockButton(uploaderName) {
        const btn = document.createElement('button');
        btn.classList.add('empress-btn');
        btn.textContent = '🧑‍🚫';
        btn.title = `Block torrents by ${uploaderName}`;
        btn.onclick = () => blockUploader(uploaderName);
        return btn;
    }

    function injectBlockButtons() {
        document.querySelectorAll('td.user').forEach(td => {
            if (td.dataset.blockInjected) return;
            const a = td.querySelector('a');
            if (!a) return;
            const name = a.textContent.trim();
            td.appendChild(createBlockButton(name));
            td.dataset.blockInjected = 'true';
        });
    }

    function hideTorrentsByUploader() {
        const blocked = get(BLOCK_KEY);
        document.querySelectorAll('tr').forEach(row => {
            const userTd = row.querySelector('td.user');
            if (!userTd) return;
            const a = userTd.querySelector('a');
            if (!a) return;
            const name = a.textContent.trim();
            if (blocked.includes(name)) {
                row.style.display = 'none';
            }
        });
    }

    function showBlockedUsersModal() {
        if (document.getElementById('blocked-users-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'blocked-users-modal';
        modal.style = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #222; color: white;
            padding: 20px; border-radius: 10px;
            box-shadow: 0 0 10px hotpink;
            z-index: 10001;
            min-width: 300px;
        `;

        const close = document.createElement('div');
        close.textContent = '✖';
        close.style = 'float: right; cursor: pointer; color: hotpink; font-weight: bold;';
        close.onclick = () => modal.remove();

        const title = document.createElement('h3');
        title.textContent = 'Blocked Users';
        title.style = 'color: hotpink; margin-top: 0;';

        const textarea = document.createElement('textarea');
        textarea.value = get(BLOCK_KEY).join('\n');
        textarea.style = 'width:100%; height:120px; background:#111; color:white; border:1px solid hotpink; margin:10px 0;';

        const save = document.createElement('button');
        save.textContent = 'Save';
        save.style = 'background:hotpink; color:white; border:none; padding:6px 12px; cursor:pointer;';
        save.onclick = () => {
            const cleaned = textarea.value.split('\n').map(x => x.trim()).filter(x => x);
            set(BLOCK_KEY, cleaned);
            modal.remove();
            hideTorrentsByUploader();
        };

        modal.appendChild(close);
        modal.appendChild(title);
        modal.appendChild(textarea);
        modal.appendChild(save);
        document.body.appendChild(modal);
    }

    function addUserBarButton() {
        const wait = setInterval(() => {
            const stats = document.querySelector('#major_stats');
            if (!stats || document.getElementById('hide-user-btn')) return;

            clearInterval(wait);

            const ul = document.createElement('ul');
            ul.style.display = 'inline-block';
            const li = document.createElement('li');
            li.id = 'hide-user-btn';

            const a = document.createElement('a');
            a.href = '#';
            a.textContent = '🧑‍🚫 Blocked Users';
            a.onclick = (e) => {
                e.preventDefault();
                showBlockedUsersModal();
            };

            li.appendChild(a);
            ul.appendChild(li);
            stats.prepend(ul);
        }, 1000);
    }

    window.addEventListener('load', () => {
        injectBlockButtons();
        hideTorrentsByUploader();
        setInterval(() => {
            injectBlockButtons();
            hideTorrentsByUploader();
        }, 3000);
        addUserBarButton();
    });
})();
