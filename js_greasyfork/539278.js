// ==UserScript==
// @name         Bazaar Undercut Alert
// @namespace    https://torn.com/
// @version      1.0
// @author       swervelord [3637232]
// @description  When your bazaar is open, a banner warns when your bazaar items are undercut using data from weav3r.dev
//
// @match        https://www.torn.com/*
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      weav3r.dev
// @downloadURL https://update.greasyfork.org/scripts/539278/Bazaar%20Undercut%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/539278/Bazaar%20Undercut%20Alert.meta.js
// ==/UserScript==

(() => {
    const KEY_STORE               = 'torn_api_key';
    const CHECK_EVERY_MS          = 60_000;
    const MAX_TORN_CALLS_PER_MIN  = 50;
    const PLACEHOLDER_PRICE       = 1;

    let queue                = [];
    let undercutNow          = new Map();
    let tornCallsThisMinute  = 0;
    let bannerDismissed      = false;
    let bazaarOpen           = false;

    const banner = (() => {
        const wrap = document.createElement('div');
        wrap.id = 'undercutBanner';
        wrap.style.cssText = `
            position:fixed;top:0;left:0;right:0;
            display:none;
            align-items:center;
            justify-content:center;
            padding:3px 8px;
            height:20px;
            background:#2c2c2c;
            color:#ffffff;
            font:600 11px/14px "Segoe UI", sans-serif;
            z-index:2147483647;
            box-shadow:0 1px 4px rgba(0,0,0,0.2);
            cursor:pointer;
        `;

        const textSpan = document.createElement('span');
        textSpan.style.cssText = `
            text-align:center;
            width:100%;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        `;
        wrap.appendChild(textSpan);

        const close = document.createElement('span');
        close.textContent = '✕';
        close.style.cssText = `
            position:absolute;
            top:3px;
            right:8px;
            font-weight:bold;
            font-size:10px;
            background:#1a1a1a;
            color:white;
            border-radius:3px;
            padding:0 4px;
            cursor:pointer;
            line-height:14px;
        `;
        close.addEventListener('click', e => {
            e.stopPropagation();
            wrap.style.display = 'none';
            bannerDismissed = true;
        });

        wrap.addEventListener('click', () => {
            if (!bannerDismissed) {
                window.open('https://www.torn.com/bazaar.php#/manage', '_blank');
            }
        });

        wrap.appendChild(close);
        document.body.prepend(wrap);

        return { wrap, textSpan };
    })();

    const updateBanner = () => {
        if (bannerDismissed || !bazaarOpen || !undercutNow.size) {
            banner.wrap.style.display = 'none';
            return;
        }
        banner.wrap.style.display = 'flex';
        const items = [...undercutNow.values()]
            .map(o => `<span style="color:#00c8d6">${o.name}</span>`).join(', ');
        banner.textSpan.innerHTML = `Your items have been undercut: ${items}`;
    };

    const apiKey = () => {
        let k = GM_getValue(KEY_STORE, '');
        if (!k) {
            k = prompt('Enter your Torn API key (MINIMAL access, stored only locally):', '');
            if (k) GM_setValue(KEY_STORE, k.trim());
        }
        return k;
    };

    const httpJSON = url => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { accept: 'application/json' },
            onload: r => {
                try { resolve(JSON.parse(r.responseText)); } catch (e) { reject(e); }
            },
            onerror: reject,
            timeout: 15000
        });
    });

    const resetTornThrottle = () => { tornCallsThisMinute = 0; };

    const refreshBazaarData = async () => {
        if (queue.length || tornCallsThisMinute >= MAX_TORN_CALLS_PER_MIN) return;

        const key = apiKey();
        if (!key) return;

        tornCallsThisMinute++;
        try {
            const data = await httpJSON(`https://api.torn.com/user/?selections=bazaar&key=${key}`);
            bazaarOpen = !!data.bazaar_is_open;

            if (!bazaarOpen) { updateBanner(); return; }

            const fresh = Object.values(data.bazaar || {})
                .filter(i => i.price > PLACEHOLDER_PRICE)
                .map(i => ({ id: i.ID, name: i.name, price: i.price }));

            queue.push(...fresh);
        } catch (err) {
            console.error('Torn API error:', err);
        }
    };

    const processQueueBatch = async () => {
        while (queue.length) {
            const { id, name, price } = queue.shift();
            try {
                const res = await httpJSON(`https://weav3r.dev/api/marketplace/${id}`);
                const lowest = (res.listings || []).reduce((m, l) => Math.min(m, l.price), Infinity);

                if (Number.isFinite(lowest) && price > lowest) {
                    undercutNow.set(id, { name, our: price, lowest });
                } else {
                    undercutNow.delete(id);
                }
            } catch (e) {
                console.error('weav3r error:', e);
            }
        }
        updateBanner();
    };

    setInterval(resetTornThrottle, CHECK_EVERY_MS);
    setInterval(refreshBazaarData, CHECK_EVERY_MS);
    setInterval(processQueueBatch, 2000);

    refreshBazaarData().then(processQueueBatch);
})();