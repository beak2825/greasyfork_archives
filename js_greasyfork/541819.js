// ==UserScript==
// @name         mydealz Nachrichten löschen
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Mehrere Konversationen mit wenigen Klicks löschen
// @author       phloo
// @match        https://www.mydealz.de/profile/messages*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541819/mydealz%20Nachrichten%20l%C3%B6schen.user.js
// @updateURL https://update.greasyfork.org/scripts/541819/mydealz%20Nachrichten%20l%C3%B6schen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getConversations() {
        return Array.from(document.querySelectorAll('.conversationList-msg')).map(li => ({
            id: li.id.replace('conversation-', ''),
            name: li.querySelector('.conversationList-senderLine')?.innerText || "",
            preview: li.querySelector('.conversationList-msgPreview')?.innerText || "",
            date: li.querySelector('.mute--text')?.innerText || ""
        }));
    }

    function createPopup(conversations) {
        document.getElementById('budd-popup')?.remove();

        if (!document.getElementById('budd-popup-style')) {
            const style = document.createElement('style');
            style.id = 'budd-popup-style';
            style.textContent = `
        #budd-popup label:has(input[type="checkbox"]:checked) {
            background: #24a30036 !important;
        }
        #budd-popup input[type="checkbox"] {
            accent-color: #24a300;
        }
    `;
            document.head.appendChild(style);
        }

        const popup = document.createElement('div');
        popup.id = 'budd-popup';
        popup.style = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: center; justify-content: center;
            font-size: 12px;
        `;

        const inner = document.createElement('div');
        inner.style = `
            background: #fff; padding: 24px; border-radius: 8px; min-width: 500px; max-width: 90vw;
            max-height: 80vh; overflow-y: auto; box-shadow: 0 2px 20px rgba(0,0,0,0.2);
            color: #222; font-family: system-ui, Arial, sans-serif; position:relative;
        `;
        inner.innerHTML = `<h2 style="font-size: 14px; margin:0 0 10px 0;color:#222;font-weight:bold">Konversationen auswählen</h2>`;

        const list = document.createElement('div');
        conversations.forEach(conv => {
            const row = document.createElement('label');
            row.style = "display:flex;align-items:center;margin-bottom:4px;cursor:pointer;background:#f8f8f8;padding:6px 4px;border-radius:4px;";
            row.innerHTML = `
                <input type="checkbox" value="${conv.id}" style="margin-right:10px">
                <span style="font-weight:bold;margin-right:10px;color:#222;min-width:auto;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${conv.name}</span>
                <span style="color:#888;margin-right:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${conv.date}</span>
                <span style="color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px;">${conv.preview}</span>
            `;
            list.appendChild(row);
        });
        inner.appendChild(list);

        const iconCheckAll = `<svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#24a300" stroke="#24a300"/><polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
        const iconUncheckAll = `<svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#eee" stroke="#bbb"/><line x1="7" y1="7" x2="17" y2="17" stroke="#bbb" stroke-width="2"/><line x1="17" y1="7" x2="7" y2="17" stroke="#bbb" stroke-width="2"/></svg>`;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'budd-toggle-check';
        toggleBtn.innerHTML = iconCheckAll;
        toggleBtn.title = "Alle auswählen/abwählen";
        toggleBtn.style = `
            background:none;border:none;cursor:pointer;position:absolute;top:18px;right:18px;padding:2px;
            width:28px;height:28px;display:flex;align-items:center;justify-content:center;
        `;

        let allChecked = false;
        toggleBtn.onclick = () => {
            allChecked = !allChecked;
            const checkboxes = list.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = allChecked);
            toggleBtn.innerHTML = allChecked ? iconUncheckAll : iconCheckAll;
        };
        inner.appendChild(toggleBtn);

        const btns = document.createElement('div');
        btns.style = "margin-top:20px;display:flex;gap:10px;justify-content:flex-end";
        btns.innerHTML = `
            <button id="budd-cancel" style="padding:6px 16px;background:#eee;color:#222;border:none;border-radius:4px;cursor:pointer">Abbrechen</button>
            <button id="budd-delete" style="padding:6px 16px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer">Ausgewählte löschen</button>
        `;

        inner.appendChild(btns);
        popup.appendChild(inner);
        document.body.appendChild(popup);

        document.getElementById('budd-cancel').onclick = () => popup.remove();
        document.getElementById('budd-delete').onclick = async () => {
            const checked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

            if (!checked.length) {
                alert("Bitte wähle mindestens eine Konversation aus.");
                return;
            }
            if (!confirm("Willst du wirklich " + checked.length + " Konversation(en) löschen? Das kann NICHT rückgängig gemacht werden!")) return;

            let deleted = 0;

            for (const id of checked) {
                try {
                    const res = await fetch('https://www.mydealz.de/conversation/delete/' + id, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'x-requested-with': 'XMLHttpRequest'
                        }
                    });
                    if (res.ok) {
                        deleted++;
                        document.getElementById('conversation-' + id)?.remove();
                    }
                } catch (e) {
                    console.error("Fehler beim Löschen der Konversation " + id + ":", e);
                }
            }

            alert(deleted + " von " + checked.length + " Konversation(en) gelöscht.");
            location.reload();
        };

        function escListener(e) {
            if (e.key === "Escape") {
                popup.remove();
                document.removeEventListener('keydown', escListener);
            }
        }
        document.addEventListener('keydown', escListener);

    }

    function addOpenButton() {
        if (document.getElementById('budd-open-popup')) return;
        const btn = document.createElement('button');
        btn.id = 'budd-open-popup';
        btn.innerText = "Konversationen löschen";
        btn.style = `
            position:fixed;bottom:30px;right:30px;z-index:99999;
            background:#3498db;color:#fff;padding:12px 24px;border:none;border-radius:6px;font-size:16px;cursor:pointer;
            box-shadow:0 2px 8px rgba(0,0,0,0.15);
        `;
        btn.onclick = () => createPopup(getConversations());
        document.body.appendChild(btn);
    }

    function waitForList() {
        if (document.querySelector('.conversationList-msg')) {
            addOpenButton();
        } else {
            setTimeout(waitForList, 1000);
        }
    }

    waitForList();
})();
