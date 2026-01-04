// ==UserScript==
// @name         Blacket Global Scripts Manager
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Apply custom userscripts, CSS, and JS globally across Blacket; manage via /settings page UI panel styled like General box with buttons and icon styling matching Blacket UI.
// @author       You
// @match        https://*.blacket.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541475/Blacket%20Global%20Scripts%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/541475/Blacket%20Global%20Scripts%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const applyAll = () => {
        const css = localStorage.getItem('bb_saved_css');
        if (css) {
            let el = document.getElementById('bb_injectedCSS');
            if (!el) {
                el = document.createElement('style');
                el.id = 'bb_injectedCSS';
                document.head.appendChild(el);
            }
            el.textContent = css;
        }

        const js = localStorage.getItem('bb_saved_js');
        if (js) {
            const script = document.createElement('script');
            script.textContent = js;
            document.body.appendChild(script);
            script.remove();
        }

        const userscript = localStorage.getItem('bb_saved_userscript');
        if (userscript) {
            const script = document.createElement('script');
            script.textContent = userscript;
            document.body.appendChild(script);
            script.remove();
        }
    };

    applyAll();

    if (!location.pathname.startsWith('/settings')) return;

    // ---------- UI PANEL BELOW ONLY RENDERS ON /settings ----------
    function createStyledButton(text, onClick) {
        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'styles__button___1_E-G-camelCase styles__upgradeButton___3UQMv-camelCase';
        btnWrapper.setAttribute('role', 'button');
        btnWrapper.setAttribute('tabindex', '0');

        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.style.textDecoration = 'none';
        anchor.addEventListener('click', e => {
            e.preventDefault();
            onClick();
        });

        const shadowDiv = document.createElement('div');
        shadowDiv.className = 'styles__shadow___3GMdH-camelCase';

        const edgeDiv = document.createElement('div');
        edgeDiv.className = 'styles__edge___3eWfq-camelCase';
        edgeDiv.style.backgroundColor = 'var(--secondary)';

        const frontDiv = document.createElement('div');
        frontDiv.className = 'styles__front___vcvuy-camelCase styles__upgradeButtonInside___396BT-camelCase';
        frontDiv.style.backgroundColor = 'var(--secondary)';
        frontDiv.style.display = 'flex';
        frontDiv.style.justifyContent = 'center';
        frontDiv.style.alignItems = 'center';
        frontDiv.textContent = text;

        anchor.appendChild(shadowDiv);
        anchor.appendChild(edgeDiv);
        anchor.appendChild(frontDiv);
        btnWrapper.appendChild(anchor);

        return btnWrapper;
    }

    function tryCloneGeneralBox() {
        const boxes = document.querySelectorAll('.styles__infoContainer___2uI-S-camelCase');
        for (const box of boxes) {
            const header = box.querySelector('.styles__infoHeader___1lsZY-camelCase');
            if (header?.textContent?.trim() === 'General') {
                const clone = box.cloneNode(true);
                clone.querySelector('.styles__infoHeader___1lsZY-camelCase').textContent = 'Scripts Manager';

                const oldIcon = clone.querySelector('i.fas.fa-cog.styles__headerIcon___1ykdN-camelCase');
                if (oldIcon) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-plus styles__headerIcon___1ykdN-camelCase';
                    icon.setAttribute('aria-hidden', 'true');
                    oldIcon.replaceWith(icon);
                }

                clone.querySelectorAll('a.styles__link___5UR6_-camelCase').forEach(link => link.remove());

                const btn = createStyledButton('Manage Scripts', () => {
                    const modal = document.getElementById('bb_scriptsManagerModal');
                    if (modal) modal.style.visibility = 'visible';
                });

                clone.appendChild(btn);
                box.parentNode.insertBefore(clone, box.nextSibling);
                break;
            }
        }
    }

    function addModal() {
        if (document.getElementById('bb_scriptsManagerModal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'bb_scriptsManagerModal';
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, visibility: 'hidden',
        });

        const modal = document.createElement('div');
        modal.style.background = '#1e1e1e';
        modal.style.borderRadius = '8px';
        modal.style.padding = '20px';
        modal.style.maxWidth = '600px';
        modal.style.width = '100%';
        modal.style.color = '#fff';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const icon = document.createElement('i');
        icon.className = 'fas fa-plus styles__headerIcon___1ykdN-camelCase';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.marginRight = '10px';

        const title = document.createElement('div');
        title.className = 'styles__infoHeader___1lsZY-camelCase';
        title.textContent = 'Manage Scripts';

        const close = document.createElement('div');
        close.textContent = '×';
        close.style.marginLeft = 'auto';
        close.style.cursor = 'pointer';
        close.onclick = () => overlay.style.visibility = 'hidden';

        header.appendChild(icon);
        header.appendChild(title);
        header.appendChild(close);
        modal.appendChild(header);

        const editors = [
            { id: 'userscript', label: 'Userscript JS', placeholder: '// Paste userscript here' },
            { id: 'css', label: 'CSS', placeholder: '/* Paste CSS here */' },
            { id: 'js', label: 'JavaScript', placeholder: '// Paste JavaScript here' }
        ];

        editors.forEach(({ id, label, placeholder }) => {
            const wrap = document.createElement('div');
            wrap.style.marginBottom = '16px';

            const l = document.createElement('label');
            l.textContent = label;

            const ta = document.createElement('textarea');
            ta.placeholder = placeholder;
            ta.id = 'bb_' + id + '_textarea';
            ta.value = localStorage.getItem('bb_saved_' + id) || '';
            Object.assign(ta.style, {
                width: '100%', height: '100px', background: '#111', color: '#fff',
                border: '1px solid #444', borderRadius: '4px', padding: '6px',
                marginTop: '6px', fontFamily: 'monospace'
            });

            const btnWrap = document.createElement('div');
            btnWrap.style.marginTop = '6px';
            btnWrap.style.display = 'flex';
            btnWrap.style.gap = '10px';

            const apply = createStyledButton('Apply', () => {
                const val = ta.value;
                localStorage.setItem('bb_saved_' + id, val);
                applyAll();
            });

            const remove = createStyledButton('Remove', () => {
                ta.value = '';
                localStorage.removeItem('bb_saved_' + id);
                if (id === 'css') {
                    const el = document.getElementById('bb_injectedCSS');
                    if (el) el.remove();
                }
            });

            btnWrap.appendChild(apply);
            btnWrap.appendChild(remove);

            wrap.appendChild(l);
            wrap.appendChild(ta);
            wrap.appendChild(btnWrap);

            modal.appendChild(wrap);
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // Run UI creation on settings page only
    tryCloneGeneralBox();
    addModal();
})();
