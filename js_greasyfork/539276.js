// ==UserScript==
// @name         Auto Bazaar Pricing
// @namespace    https://www.torn.com/
// @version      1.1
// @description  Individually update your bazaar prices to undercut the lowest by $1 using data from weav3r.dev
// @author       swervelord [3637232]
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @connect      weav3r.dev
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/539276/Auto%20Bazaar%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/539276/Auto%20Bazaar%20Pricing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitFor = (sel, cb) => {
        const el = document.querySelector(sel);
        if (el) return cb(el);
        const mo = new MutationObserver(() => {
            const f = document.querySelector(sel);
            if (f) { mo.disconnect(); cb(f); }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    };

    const getJSON = (url) => new Promise((res, rej) => {
        GM_xmlhttpRequest({
            method: 'GET', url,
            onload: r => (r.status === 200 ? res(JSON.parse(r.responseText))
                                          : rej(new Error(`HTTP ${r.status}`))),
            onerror: () => rej(new Error('Network error'))
        });
    });

    const addStyles = () => {
        if (document.querySelector('#undercut-style')) return;
        const s = document.createElement('style');
        s.id = 'undercut-style';
        s.textContent = `
            .undercut-label {
                display:inline-flex;
                align-items:center;
                cursor:pointer;
                margin-left:8px;
                position:relative;
                z-index:10;
            }
            .undercut-checkbox {
                appearance:none;
                background:#1f1f1f;
                border:1px solid #444;
                width:16px;
                height:16px;
                border-radius:3px;
                position:relative;
            }
            .undercut-checkbox:checked::before {
                content:'';
                position:absolute;
                top:2px;
                left:5px;
                width:4px;
                height:8px;
                border:solid #666;
                border-width:0 2px 2px 0;
                transform:rotate(45deg);
            }
        `;
        document.head.appendChild(s);
    };

    const idCache = new Map();
    const ensureItemCache = async (key) => {
        if (idCache.size) return;
        const data = await getJSON(`https://api.torn.com/torn/?selections=items&key=${key}`);
        Object.entries(data.items).forEach(([id, obj]) =>
            idCache.set(obj.name.toLowerCase(), Number(id)));
    };

    const fetchWeav3r = (id) => getJSON(`https://weav3r.dev/api/marketplace/${id}`);

    const undercutItem = async (itemEl, key) => {
        const name = itemEl.getAttribute('aria-label');
        try {
            await ensureItemCache(key);
            const id = idCache.get(name.toLowerCase());
            if (!id) throw 'ID not found';
            const { listings = [] } = await fetchWeav3r(id);
            if (!listings.length) throw 'no listings';
            const newP = listings[0].price - 1;
            const box = itemEl.querySelector('.price___DoKP7 input.input-money');
            if (!box) throw 'price box missing';
            box.value = newP;
            box.dispatchEvent(new Event('input', { bubbles: true }));
            box.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {
            console.error(`[Bazaar] ${name}: ${e}`);
        }
    };

    const buildSettingsBtn = () => {
        const bar = document.querySelector('.linksContainer___LiOTN');
        if (!bar || document.querySelector('#undercut-settings-btn')) return;
        const a = document.createElement('a');
        a.id = 'undercut-settings-btn';
        a.href = '#';
        a.className = 'linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9';
        a.innerHTML = `<span class="iconWrapper___x3ZLe svgIcon___IwbJV">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" width="16" height="16" viewBox="0 1 16 17">
              <path d="M0,15.26c3.67.31,2.36-3.59,5.75-3.62l1.47,1.22c.37,4.43-5,5.42-7.22,2.4M11.25,9.57c1.14-1.79,4.68-7.8,4.68-7.8a.52.52,0,0,0-.78-.65s-5.26,4.58-6.81,6C7.12,8.29,7.11,8.81,6.71,10.7l1.35,1.12c1.78-.73,2.29-.83,3.19-2.25"></path></svg>
            </span><span class="linkTitle____NPyM">Settings</span>`;
        a.onclick = e => {
            e.preventDefault();
            const k = prompt('Enter your Torn API key (requires "items" access):', localStorage.getItem('torn_api_key') || '');
            if (k) {
                localStorage.setItem('torn_api_key', k.trim());
                alert('API key saved');
            }
        };
        bar.prepend(a);
    };

    const addCheckboxes = () => {
        document.querySelectorAll('.item___jLJcf').forEach(item => {
            if (item.querySelector('.undercut-checkbox')) return;

            const label = document.createElement('label');
            label.className = 'undercut-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'undercut-checkbox';

            ['pointerdown','pointerup','click','mousedown','mouseup']
                .forEach(ev => checkbox.addEventListener(ev, e => {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }, true));

            checkbox.onchange = async () => {
                if (!checkbox.checked) return;
                const key = localStorage.getItem('torn_api_key');
                if (!key) {
                    alert('Set your Torn API key first using the settings tab.');
                    return;
                }
                await undercutItem(item, key);
            };

            label.appendChild(checkbox);
            item.querySelector('.desc___VJSNQ span')?.appendChild(label);
        });
    };

    const promptForApiKeyIfMissing = () => {
        const existing = localStorage.getItem('torn_api_key');
        if (!existing) {
            const key = prompt('This script requires your Torn API key with "items" access.\nPlease enter it now:');
            if (key) localStorage.setItem('torn_api_key', key.trim());
        }
    };

    const init = () => {
        addStyles();
        promptForApiKeyIfMissing();
        waitFor('.linksContainer___LiOTN', buildSettingsBtn);
        waitFor('.item___jLJcf', () => {
            addCheckboxes();
            new MutationObserver(() => addCheckboxes())
                .observe(document.body, { childList: true, subtree: true });
        });
    };

    init();
})();
