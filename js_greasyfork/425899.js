// ==UserScript==
// @name        YouTube Super Chat convert
// @description
// @namespace   lei.z
// @include     https://www.youtube.com/live_chat*
// @include     https://www.youtube.com/live_chat_replay*
// @version     0.3.1
// @grant       none
// @description convert superchat display to cny
// @downloadURL https://update.greasyfork.org/scripts/425899/YouTube%20Super%20Chat%20convert.user.js
// @updateURL https://update.greasyfork.org/scripts/425899/YouTube%20Super%20Chat%20convert.meta.js
// ==/UserScript==

(function () {
    const SCRIPTID = 'YouTubeSuperChatConvert';
    const DEBUG = true;

    const currency = {
        "CA$": "CAD",
        "$": "USD",
        "US$": "USD",
        "A$": "AUD",
        "AU$": "AUD",
        "NT$": "TWD",
        "HK$": "HKD",
        "R$": "BRL",
        "JP¥": "JPY",
        "¥": "JPY",
        "SGD": "SGD",
        "€": "EUR",
        "NZ$": "NZD",
        "SEK": "SEK",
        "£": "GBP",
        "PEN": "PEN",
        "PHP": "PHP",
        "₱": "PHP",
        "₩": "KRW",
        "CHF": "CHF",
        "DKK": "DKK",
        "CZK": "CZK",
        "₹": "INR",
        "RUB": "RUB",
        "BYN": "BYN",
        "CZK": "CZK",
        "PLN": "PLN",
        "ARS": "ARS",
        "BGN": "BGN"
    };
    const rates = {
        "CAD": 5.27,
        "USD": 6.47,
        "AUD": 5.02,
        "TWD": 0.23,
        "HKD": 0.83,
        "BRL": 1.19,
        "JPY": 0.059,
        "SGD": 4.87,
        "EUR": 7.8,
        "NZD": 4.66,
        "SEK": 0.77,
        "GBP": 9.00,
        "PEN": 1.71,
        "PHP": 0.021,
        "KRW": 0.0058,
        "CHF": 7.09,
        "DKK": 1.05,
        "CZK": 0.30,
        "INR": 0.088,
        "RUB": 0.086,
        "BYN": 2.52,
        "CZK": 0.3,
        "PLN": 1.71,
        "ARS": 0.069,
        "BGN": 3.98,
    };
    if (console.time) console.time(SCRIPTID);
    const site = {
        targets: {
            itemsNode: () => $('yt-live-chat-item-list-renderer #items'),
            pinnedMessageNode: () => $('yt-live-chat-renderer #pinned-message'),
        },
        pinned: {
            pinnedNode: () => $('yt-live-chat-pinned-message-renderer #message'),
        },
        get: {
            superChatItems: (items) => items.querySelectorAll('.yt-live-chat-paid-message-renderer #purchase-amount, #purchase-amount-chip'),/* existing items */
            superChatItem: (node) => node.querySelector('.yt-live-chat-paid-message-renderer #purchase-amount, #purchase-amount-chip'),/* for observer */
        },
    };
    let elements = {};
    const chat_callback = function (records) {
        records.forEach(r => r.addedNodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            let container = site.get.superChatItem(node);
            if (container) core.changeText(container);
        }));
    };
    const pinned_callback = function(records) {
        chat_callback(records);
        core.getTargets(site.pinned).then(() => {
            observe(elements.pinnedNode, chat_callback);
        });
    };
    const core = {
        initialize: function () {
            elements.html = document.documentElement;
            core.ready();
        },
        ready: function () {
            core.getTargets(site.targets).then(() => {
                log("I'm ready.");
                core.observeChatItems();
            });
        },
        observeChatItems: function () {
            let containers = site.get.superChatItems(elements.itemsNode);
            Array.from(containers).forEach(container => {
                core.changeText(container);
            });
            observe(elements.itemsNode, chat_callback);
            observe(elements.pinnedMessageNode, pinned_callback);
        },
        changeText: function (div) {
            const number = div.innerHTML.match(/\d+.*/)[0].trim().replace(',', '');
            const curr_variant = div.innerHTML.match(/^[^0-9]*/)[0].replace(/&nbsp;/g, '').trim();
            const ratio = rates[currency[curr_variant]] || 0;
            if (ratio === 0) log(curr_variant);
            div.innerHTML += ` ~ CN¥${(number * ratio).toFixed(2)}`;
        },
        getTarget: async function (selector, retry = 10) {
            const key = selector.name;
            const get = function (resolve, reject, retry) {
                let selected = selector();
                if (selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
                else if (selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
                else if (--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, 1000, resolve, reject, retry);
                else return reject(selector);
                elements[key] = selected;
                resolve(selected);
            };
            try {
                return new Promise(function (resolve_2, reject_1) {
                    get(resolve_2, reject_1, retry);
                });
            } catch (selector_1) {
                log(`Not found: ${key}, I give up.`);
            }
        },
        getTargets: async function (selectors, retry = 10) {
            return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry)));
        },
    };
    const $ = function (s, f) {
        let target = document.querySelector(s);
        if (target === null) return null;
        return f ? f(target) : target;
    };
    const $$ = function (s, f) {
        let targets = document.querySelectorAll(s);
        return f ? Array.from(targets).map(t => f(t)) : targets;
    };
    const observe = function (element, callback, options = { childList: true, attributes: false, characterData: false, subtree: false }) {
        let observer = new MutationObserver(callback);
        observer.observe(element, options);
        return observer;
    };
    const log = function () {
        if (!DEBUG) return;
        let l = log.last = log.now || new Date(), n = log.now = new Date();
        let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
        //console.log(error.stack);
        console.log(
            SCRIPTID + ':',
            /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
            /* +0.000s       */ '+' + ((n - l) / 1000).toFixed(3) + 's',
            /* :00           */ ':' + line,
            /* caller.caller */(callers[2] ? callers[2] + '() => ' : '') +
            /* caller        */ (callers[1] || '') + '()',
            ...arguments
        );
    };

    log.formats = [{
        name: 'Firefox Scratchpad',
        detector: /MARKER@Scratchpad/,
        getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
        getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
        name: 'Firefox Console',
        detector: /MARKER@debugger/,
        getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
        getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
        name: 'Firefox Greasemonkey 3',
        detector: /\/gm_scripts\//,
        getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
        getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
        name: 'Firefox Greasemonkey 4+',
        detector: /MARKER@user-script:/,
        getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
        getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
        name: 'Firefox Tampermonkey',
        detector: /MARKER@moz-extension:/,
        getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
        getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
        name: 'Chrome Console',
        detector: /at MARKER \(<anonymous>/,
        getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
        getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
        name: 'Chrome Tampermonkey',
        detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?id=/,
        getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 5,
        getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
        name: 'Chrome Extension',
        detector: /at MARKER \(chrome-extension:/,
        getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
        getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
        name: 'Edge Console',
        detector: /at MARKER \(eval/,
        getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
        getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
        name: 'Edge Tampermonkey',
        detector: /at MARKER \(Function/,
        getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
        getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
        name: 'Safari',
        detector: /^MARKER$/m,
        getLine: (e) => 0,
        getCallers: (e) => e.stack.split('\n'),
    }, {
        name: 'Default',
        detector: /./,
        getLine: (e) => 0,
        getCallers: (e) => [],
    }];
    log.format = log.formats.find(function MARKER(f) {
        if (!f.detector.test(new Error().stack)) return false;
        //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
        return true;
    });

    core.initialize();
    if (console.timeEnd) console.timeEnd(SCRIPTID);
})();