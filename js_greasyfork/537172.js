// ==UserScript==
// @name         Elethor Spire Build Copy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy your spire build
// @author       Eugene
// @match        https://elethor.com/fight/spire
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/537172/Elethor%20Spire%20Build%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/537172/Elethor%20Spire%20Build%20Copy.meta.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    let modifiers = null;
    let choices = null;
    let btn = null;

    function init() {
        if (!window.location.href.includes('elethor.com/fight/spire')) {
            if (btn) btn.remove();
            return;
        }

        if (document.getElementById('build-copy-btn')) return;

        btn = document.createElement('button');
        btn.id = 'build-copy-btn';
        btn.innerHTML = 'Copy Build';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '12px 16px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
        });

        btn.addEventListener('click', handleCopy);
        document.body.appendChild(btn);

        loadData();
    }

    function loadData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://elethor.com/game/neo-spire/modifiers',
            onload: r => {
                modifiers = JSON.parse(r.responseText);
                tryFormat();
            }
        });

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://elethor.com/game/views/neo-spire',
            onload: r => {
                choices = JSON.parse(r.responseText);
                tryFormat();
            }
        });
    }

    function tryFormat() {
        if (modifiers && choices && btn) {
            btn.disabled = false;
        }
    }

    function getBuildString() {
        const prog = choices.progress.modifiers;
        const off = [];
        const def = [];

        for (let i = 1; i <= 20; i++) {
            const lvl = `A${i}`;

            if (prog.Offense?.[lvl]) {
                const pick = prog.Offense[lvl];
                const opts = modifiers.modifiers.Offense[lvl];
                const idx = opts.findIndex(m => m.id === pick.id) + 1;
                off.push(idx);
            }

            if (prog.Defense?.[lvl]) {
                const pick = prog.Defense[lvl];
                const opts = modifiers.modifiers.Defense[lvl];
                const idx = opts.findIndex(m => m.id === pick.id) + 1;
                def.push(idx);
            }
        }

        return `Offensive: ${off.join('-')}\nDefensive: ${def.join('-')}`;
    }

    function handleCopy() {
        const build = getBuildString();
        GM_setClipboard(build);

        const orig = btn.innerHTML;
        btn.innerHTML = 'Copied!';
        btn.style.background = '#059669';

        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '#2563eb';
        }, 1500);
    }

    init();

    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            init();
        }
    }).observe(document, {subtree: true, childList: true});

})();