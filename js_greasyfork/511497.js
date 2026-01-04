// ==UserScript==
// @name         Soundcloud Downloader + Pro Banner Remover
// @version      0.1.4
// @description  Make sure you are signed in to download - Downloader by maple3142
// @author       Harrysof
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/9t2eslxxu35x5b1to89jrqcs8qtn
// @match        https://soundcloud.com/*
// @require      https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js
// @grant        none
// @namespace https://greasyfork.org/users/1376759
// @downloadURL https://update.greasyfork.org/scripts/511497/Soundcloud%20Downloader%20%2B%20Pro%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/511497/Soundcloud%20Downloader%20%2B%20Pro%20Banner%20Remover.meta.js
// ==/UserScript==

streamSaver.mitm = 'https://maple3142.github.io/StreamSaver.js/mitm.html';

function hook(obj, name, callback) {
    const fn = obj[name];
    obj[name] = function (...args) {
        callback.apply(this, args);
        fn.apply(this, args);
    };
    return () => {
        // restore
        obj[name] = fn;
    };
}

function triggerDownload(url, name) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = name;
    a.click();
    a.remove();
}

const btn = {
    init() {
        this.el = document.createElement('button');
        this.el.textContent = 'Download';
        this.el.classList.add('sc-button', 'sc-button-medium', 'sc-button-responsive', 'sc-button-download');
    },
    attach() {
        const par = document.querySelector('.listenEngagement__footer .sc-button-toolbar .sc-button-group');
        if (par) par.insertAdjacentElement('beforeend', this.el);
    }
};

btn.init();

// Array of selectors to remove
const selectorsToRemove = [
    '.spotlight',
    '.creatorSubscriptionsButton',
    '.quotaMeter__upsellText',
    '.artistConnectContainer',
    '.getHeard__container',
    '.header__upsellWrapper',
    '.searchOptions__navigation-high_tier',
    '.banner',
    '.banner__contentContainer',
    '.velvetCakeIframe',
    '.webiEmbeddedModuleIframe',
    '.webiEmbeddedModuleContainer',
    '.MuiBox-root.mui-h9r63z',
];

function removeBlur() {
    const blurredElements = document.querySelectorAll('[class*="blurred"]');
    blurredElements.forEach(element => {
        element.style.filter = 'none';
        element.classList.remove('blurred');
    });
}

function load() {
    // Remove specified elements
    selectorsToRemove.forEach(selector => removeElements(selector));

    if (/^(\/(you|stations|discover|stream|upload|search|settings))/.test(location.pathname)) return;

    const restore = hook(XMLHttpRequest.prototype, 'open', async (method, url) => {
        const u = new URL(url, document.baseURI);
        const clientId = u.searchParams.get('client_id');
        if (!clientId) return;
        restore();
        const result = await fetch(`https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(location.href)}&client_id=${clientId}`).then(r => r.json());
        btn.el.onclick = async () => {
            const progressive = result.media.transcodings.find(t => t.format.protocol === 'progressive');
            if (progressive) {
                const { url } = await fetch(progressive.url + `?client_id=${clientId}`).then(r => r.json());
                const resp = await fetch(url);
                const ws = streamSaver.createWriteStream(result.title + '.mp3', {
                    size: resp.headers.get('Content-Length')
                });
                const rs = resp.body;
                if (rs.pipeTo) {
                    console.log(rs, ws);
                    return rs.pipeTo(ws);
                }
                const reader = rs.getReader();
                const writer = ws.getWriter();
                const pump = () =>
                    reader.read().then(res =>
                        res.done ? writer.close() : writer.write(res.value).then(pump)
                    );

                return pump();
            }
            alert('Sorry, downloading this music is currently unsupported.');
        };
        btn.attach();
        console.log('changed');
    });
}

function removeElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => element.remove());
}

load();
for (const f of ['pushState', 'replaceState', 'forward', 'back', 'go']) {
    hook(history, f, () => load());
}

// Set up a MutationObserver to handle dynamic content
const observer = new MutationObserver(() => {
    selectorsToRemove.forEach(selector => removeElements(selector));
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });