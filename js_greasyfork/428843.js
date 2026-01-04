// ==UserScript==
// @name         BeatSaver preview
// @namespace    http://ext.ccloli.com
// @version      0.1
// @description  Preview BeatSaver with +1 Rabbit's BS Viewer (https://skystudioapps.com/bs-viewer/)
// @author       864907600cc
// @match        *://beatsaver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428843/BeatSaver%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/428843/BeatSaver%20preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastId;
    const handle = document.createElement('div');
    handle.style.cssText = 'width: 720px; height: 20px; line-height: 20px; background: #ddd; color: #666; cursor: pointer; user-select: none; padding: 0 6px; font-size: 12px; position: absolute; right: 0; bottom: 0; z-index: 999';
    const iframe = document.createElement('iframe');
    iframe.name = 'foo';
    iframe.style.cssText = 'width: 720px; height: 405px; border: 2px solid #ddd; display: block; position: absolute; right: 0; bottom: 20px; background: rgba(255, 255, 255, 0.5); z-index: 999';
    handle.onclick = () => {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
    };

    const load = () => {
        const id = location.pathname.split('/beatmap/').pop();
        if (!/^[0-9a-f]+$/i.test(id) || lastId === id) {
            return;
        }
        lastId = id;
        const src = `https://skystudioapps.com/bs-viewer/?id=${id}`;
        handle.innerHTML = `+1 Rabbit\'s BS Viewer | <a href="${src}" target="_blank">${src}</a>`;
        iframe.src = src;
        document.body.appendChild(iframe);
        document.body.appendChild(handle);
    };

    const history = window.history;
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    window.addEventListener('popstate', load);
    window.history.pushState = (...args) => {
        pushState.apply(history, args);
        load();
    }
    window.history.replaceState = (...args) => {
        replaceState.apply(history, args);
        load();
    }
    load();
})();