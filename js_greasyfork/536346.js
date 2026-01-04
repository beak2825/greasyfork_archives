// ==UserScript==
// @name         Sahibinden Fotoğraf Büyütme
// @namespace    https://github.com/huseyinavniuzun/sahibinden-photo-zoom
// @version      1.0
// @description  Küçük fotoğrafın üzerine fare gelince büyük fotoğrafı gösterir
// @author       Hüseyin Avni UZUN
// @license      MIT
// @icon         https://www.huseyinavniuzun.com/shbnd/logo.jpg
// @match        https://www.sahibinden.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536346/Sahibinden%20Foto%C4%9Fraf%20B%C3%BCy%C3%BCtme.user.js
// @updateURL https://update.greasyfork.org/scripts/536346/Sahibinden%20Foto%C4%9Fraf%20B%C3%BCy%C3%BCtme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10000
    });

    const bigImg = document.createElement('img');
    Object.assign(bigImg.style, {
        maxWidth: '80vw',
        maxHeight: '80vh',
        border: '4px solid #fff',
        borderRadius: '4px',
        boxShadow: '0 0 12px #000',
        pointerEvents: 'none'
    });

    backdrop.appendChild(bigImg);
    document.body.appendChild(backdrop);

    function pickThumb(img) {
        const set = img.getAttribute('srcset') || img.dataset.srcset;
        if (set) {
            const parts = set.split(',').map(p => p.trim().split(/\s+/)[0]);
            const l = parts.find(u => u.includes('lthmb_'));
            if (l) return l;
            const t = parts.find(u => u.includes('thmb_'));
            if (t) return t;
        }
        const direct = img.src || img.dataset.src;
        if (direct && /(l?thmb_)/.test(direct)) return direct;
        return null;
    }

    function buildList(url) {
        const pre = /(l?thmb_)/;
        if (!pre.test(url)) return [url];
        const list = [
            url.replace(pre, 'x16_'),
            url.replace(pre, 'x5_'),
            url.replace(pre, 'big_'),
            url.includes('thmb_') ? url.replace('thmb_', 'lthmb_') : url,
            url.replace(pre, ''),
            url
        ];
        return [...new Set(list)];
    }

    function load(list, i = 0) {
        if (!list[i]) return;
        bigImg.onerror = () => load(list, i + 1);
        bigImg.src = list[i];
    }

    function bind(img) {
        if (img.dataset.bound) return;
        const thumb = pickThumb(img);
        if (!thumb) return;
        img.dataset.bound = '1';
        img.addEventListener('mouseenter', () => {
            load(buildList(thumb));
            backdrop.style.display = 'flex';
        });
        img.addEventListener('mouseleave', () => {
            backdrop.style.display = 'none';
            bigImg.removeAttribute('src');
            bigImg.onerror = null;
        });
    }

    function scan(root = document) {
        root.querySelectorAll('img').forEach(bind);
    }

    scan();
    new MutationObserver(m =>
        m.forEach(r =>
            r.addedNodes.forEach(n => n.nodeType === 1 && scan(n))
        )
    ).observe(document.body, { childList: true, subtree: true });
})();