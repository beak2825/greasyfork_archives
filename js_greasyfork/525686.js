// ==UserScript==
// @license      Unlicense
// @name         Show KRW on Gateio
// @namespace    https://greasyfork.org/
// @version      202402030832
// @description  Display KRW approximation next to USD on Gateio
// @author       lee101570
// @match        https://www.gate.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gate.io
// @connect      m.stock.naver.com
// @connect      api.upbit.com
// @grant        GM.xmlHttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/525686/Show%20KRW%20on%20Gateio.user.js
// @updateURL https://update.greasyfork.org/scripts/525686/Show%20KRW%20on%20Gateio.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
/* global WeakRef */
/**
 * This source code was created by modifying the original code by the following developer.
 *
 * Developer: funyaba
 * Original Source Code: https://update.greasyfork.org/scripts/520945/Show%20KRW%20on%20Bitget.user.js
 */
(async function() {
    'use strict';

    // Your code here...
    async function resolveAllObject(obj) {
        const promises = Object.values(obj).map(fn => fn());
        const results = await Promise.all(promises);
        return Object
            .fromEntries(Object.keys(obj).map((key, i) => [key, results[i]]));
    }

    class ExchangeService {
        static async getInstanceAsync() {
            const cache = new Map();

            const apis = {
                ['USDKRW']: {
                  fetcher: async () => {
                      const { response } = await GM.xmlHttpRequest({
                          method: 'GET',
                          url: 'https://m.stock.naver.com' +
                              '/front-api/marketIndex/productDetail' +
                              '?category=exchange&reutersCode=FX_USDKRW',
                          responseType: 'json',
                      });

                      const { result } = response;
                      return parseFloat(result.calcPrice);
                    },
                    interval: 1000 * 60 * 60,
                },
                ['USDTKRW']: {
                    fetcher: async () => {
                        const { response: [{ trade_price: tradePrice }] } =
                          await GM.xmlHttpRequest({
                              method: 'GET',
                              url: 'https://api.upbit.com/v1/ticker?markets=KRW-USDT',
                              responseType: 'json',
                          });

                        return tradePrice;
                    },
                    interval: 1000,
                },
            };
            const fetchers = Object.fromEntries(Object.entries(apis).map(([k, v]) => [k, v.fetcher]));
            const resolved = await resolveAllObject(fetchers);

            for (const [key, value] of Object.entries(resolved)) {
                cache.set(key, value);
            }

            for (const [key, value] of Object.entries(apis)) {
                setInterval(async () => {
                    cache.set(key, await value.fetcher());
                }, value.interval);
            }

            return {
                get(key) {
                    return cache.get(key);
                },
            };
        }
    }
    const exchangeService = await ExchangeService.getInstanceAsync();

    const numberFormatter = new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
    });
    const numberRegex = /(-?(?:[0-9]{1,3},)*[0-9]{1,3}(?:\.?[0-9]*))/g;

    const replaceValue = (targetRef) => {
        let target = targetRef.deref();
        try {
            if (!target) return;

            let text = target.nodeValue.trim();
            if (text.includes('KRW') || text.includes('₩')) return;

            let matches = null;
            if (text === 'USD' || text === 'USDT') {
                if (!target.parentElement || !target.parentElement.parentElement) return;

                const parentText = target.parentElement.parentElement.innerText;
                if (!parentText) return;

                matches = parentText.match(numberRegex);
            } else {
                matches = text.match(numberRegex);
            }
            if (!matches) return;

            let price = NaN;
            switch (true) {
                case text.endsWith('USD'):
                    price = exchangeService.get('USDKRW');
                    break;
                case text.endsWith('USDT'):
                case text.includes('₮'):
                    price = exchangeService.get('USDTKRW');
                    break;
                default:
                    return;
            }
            if (isNaN(price)) return;

            const value = matches[0].replace(/,/g, '');
            const converted = numberFormatter.format(parseFloat(value) * price);
            const formatted = text.includes('₮') ?
                `${text} (₩${converted})` :
                `${text} (${converted} KRW)`;

            target.nodeValue = formatted;
        } finally {
            target = null;
        }
    };

    const observerConfig = {
        childList: true,
        characterData: true,
        subtree: true
    };

    let mutationTargetRefs = [];
    let isScheduled = false;
    const callback = (mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.target.nodeName.toUpperCase() === 'SVG') return;
            mutationTargetRefs.push(new WeakRef(mutation.target));
        });

        if (isScheduled) return;
        isScheduled = true;

        requestAnimationFrame(() => {
            observer.disconnect();

            const nodes = new WeakSet();
            for (let i = 0; i < mutationTargetRefs.length; ++i) {
                let mutationTarget = mutationTargetRefs[i].deref();
                try {
                    if (!mutationTarget) {
                        mutationTargetRefs[i] = null;
                        continue;
                    }
                    if (nodes.has(mutationTarget)) continue;
                    nodes.add(mutationTarget);

                    switch (mutationTarget.nodeType) {
                        case Node.TEXT_NODE:
                            replaceValue(new WeakRef(mutationTarget));
                            nodes.add(mutationTarget);
                            break;
                        case Node.ELEMENT_NODE: {
                            if (!mutationTarget.innerHTML.match(numberRegex)) break;

                            const treeWalker = document.createTreeWalker(
                                mutationTarget,
                                NodeFilter.SHOW_TEXT,
                            );

                            let node;
                            while (treeWalker.nextNode()) {
                                node = treeWalker.currentNode;
                                try {
                                    if (nodes.has(node)) continue;
                                    if (!node.isConnected) continue;

                                    if (
                                        !node.parentElement ||
                                        node.parentElement.closest('textarea, [contenteditable="true"]')
                                    ) continue;

                                    replaceValue(new WeakRef(node));
                                } finally {
                                    nodes.add(node);
                                    node = null;
                                }
                            }
                            break;
                        }
                        default:
                            break;
                    }
                } finally {
                    mutationTarget = null;
                }
            }
            mutationTargetRefs = [];
            isScheduled = false;

            observer.observe(document.body, observerConfig);
        });
    };
    const observer = new MutationObserver(callback);

    observer.observe(document.body, observerConfig);
})();