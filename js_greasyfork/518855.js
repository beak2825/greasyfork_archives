// ==UserScript==
// @name         Discord Token Login
// @namespace    https://discord.com/
// @version      1.5
// @description  Adds a "Login with Token" button to Discord's login page (! SOME TOKENS GET RESET WHEN LOGOUT IS PRESSED!)
// @author       5d79peter
// @match        *://discord.com/login*
// @grant        none
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/518855/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/518855/Discord%20Token%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const a = document.querySelector('input[name="email"]');
        if (a) {
            a.removeAttribute('required');
        }

        const b = document.querySelector('button[type="submit"]');
        const c = document.querySelector('form');
        if (!b || !c) return;

        const d = document.createElement('button');
        d.innerText = 'Login with Token';
        d.style.backgroundColor = '#5865F2';
        d.style.color = 'white';
        d.style.border = 'none';
        d.style.cursor = 'pointer';
        d.style.padding = '12px 18px';
        d.style.borderRadius = '4px';
        d.style.fontSize = '16px';
        d.style.fontWeight = '500';
        d.style.lineHeight = '24px';
        d.style.width = '100%';
        d.style.marginTop = '8px';
        d.style.transition = 'background-color 0.2s ease';

        d.addEventListener('mouseover', () => {
            d.style.backgroundColor = '#4752C4';
        });
        d.addEventListener('mouseout', () => {
            d.style.backgroundColor = '#5865F2';
        });

        b.parentNode.insertBefore(d, b.nextSibling);

        d.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e1();
        });

        c.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });

    function e1() {
        const f = document.createElement('div');
        f.style.position = 'fixed';
        f.style.top = '0';
        f.style.left = '0';
        f.style.width = '100vw';
        f.style.height = '100vh';
        f.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        f.style.zIndex = '9999';
        f.style.display = 'flex';
        f.style.justifyContent = 'center';
        f.style.alignItems = 'center';

        const g = document.createElement('div');
        g.style.backgroundColor = '#2F3136';
        g.style.color = '#FFFFFF';
        g.style.borderRadius = '8px';
        g.style.padding = '20px';
        g.style.width = '300px';
        g.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.25)';
        g.style.textAlign = 'center';

        const h = document.createElement('h3');
        h.innerText = 'Login with Token';
        h.style.margin = '0 0 10px';
        h.style.fontSize = '18px';
        h.style.fontWeight = '600';
        h.style.color = '#FFFFFF';

        const i = document.createElement('input');
        i.type = 'text';
        i.placeholder = 'Enter your token here...';
        i.style.width = '90%';
        i.style.padding = '10px';
        i.style.border = '1px solid #72767D';
        i.style.borderRadius = '4px';
        i.style.marginTop = '10px';
        i.style.fontSize = '14px';
        i.style.color = '#FFFFFF';
        i.style.backgroundColor = '#202225';
        i.autocomplete = 'off';

        const j = document.createElement('div');
        j.style.display = 'flex';
        j.style.justifyContent = 'space-between';
        j.style.marginTop = '20px';

        const k = document.createElement('button');
        k.innerText = 'Login';
        k.style.flex = '1';
        k.style.marginRight = '8px';
        k.style.backgroundColor = '#5865F2';
        k.style.color = 'white';
        k.style.border = 'none';
        k.style.padding = '10px';
        k.style.borderRadius = '4px';
        k.style.cursor = 'pointer';
        k.style.transition = 'background-color 0.2s ease';

        k.addEventListener('mouseover', () => {
            k.style.backgroundColor = '#4752C4';
        });
        k.addEventListener('mouseout', () => {
            k.style.backgroundColor = '#5865F2';
        });

        const l = document.createElement('button');
        l.innerText = 'Cancel';
        l.style.flex = '1';
        l.style.backgroundColor = '#4F545C';
        l.style.color = 'white';
        l.style.border = 'none';
        l.style.padding = '10px';
        l.style.borderRadius = '4px';
        l.style.cursor = 'pointer';

        j.appendChild(k);
        j.appendChild(l);
        g.appendChild(h);
        g.appendChild(i);
        g.appendChild(j);
        f.appendChild(g);
        document.body.appendChild(f);

        k.addEventListener('click', () => {
            const m = i.value.trim();
            if (m) {
                n(m);
            }
            f.remove();
        });

        l.addEventListener('click', () => {
            f.remove();
        });
    }

    function n(o) {
        setInterval(() => {
            document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${o}"`;
        }, 50);
        setTimeout(() => {
            location.reload();
        }, 2500);
    }
})();
