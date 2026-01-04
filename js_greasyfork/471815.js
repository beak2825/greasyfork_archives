// ==UserScript==
// @name         bring back ctrl+r in editor
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  brings f5 into backend website preview
// @author       ard, bso
// @license      MIT
// @match        http://localhost:8069/web
// @include      /^https\:\/\/.*\.runbot\d*\.odoo\.com\/web.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odoo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471815/bring%20back%20ctrl%2Br%20in%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/471815/bring%20back%20ctrl%2Br%20in%20editor.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('-- {TamperMonkey}[INFO] refresh script is hooked --');
    const handler = (ev) => {
        const ctrlR = (ev.metaKey || ev.ctrlKey) && ev.key === 'r';
        const f5 = ev.key == 'F5'
        if ((ctrlR || (f5 && !ev.ctrlKey)) && document.querySelector('.o_iframe') && !window.location.pathname.startsWith('/@/')) {
            ev.preventDefault();
            window.location = `/@${window.location.pathname}`;
        }
    }
    window.addEventListener('keydown', handler);
    const mut = new MutationObserver(() => {
        const iframe = document.querySelector('.o_iframe');
        if (iframe && !iframe.contentWindow.__refreshScript) {
            iframe.contentWindow.addEventListener('keydown', handler);
            iframe.contentWindow.__refreshScript = true;
        }
    });
    mut.observe(document.documentElement, { childList: true, attributes: true, subtree: true });
})();