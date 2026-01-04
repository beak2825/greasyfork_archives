// ==UserScript==
// @name         IGG GAMES Direct Download + Remove Anti AdBlocker
// @namespace    fuckads
// @version      1.0.3
// @description  Remove the download jump from igg-games.com and go directly to the download site to avoid waiting time and advertising harassment.
// @author       Paperfeed
// @match        *://igg-games.com/*
// @match        *://dl.pcgamestorrents.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/390935/IGG%20GAMES%20Direct%20Download%20%2B%20Remove%20Anti%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/390935/IGG%20GAMES%20Direct%20Download%20%2B%20Remove%20Anti%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    // Run before other scripts
    //

    // This didn't work out for torrent links. Still having a look
    const _setInterval = window.setInterval.bind(window);
    window.setInterval = (f, delay, ...args) => _setInterval(f, 5, ...args);
    window.setInterval = _setInterval;

    window.qc = true;

    const isAntiAdBlocker = (content) => /advanced_ads_ready|_CheckAD|ads.js/.test(content);

    const _createElement = document.createElement;
    document.createElement = function(...args) {
        if(args[0].toLowerCase() !== 'script') return _createElement.bind(document)(...args)

        const script = _createElement.bind(document)(...args);
        const _setAttribute = script.setAttribute.bind(script);

        Object.defineProperties(script, {
            'src': {
                get() {
                    return script.getAttribute('src');
                },
                set(value) {
                    if(isAntiAdBlocker(script.src)) {
                        _setAttribute('type', 'javascript/yeeted');
                    }
                    _setAttribute('src', value);
                    return true;
                }
            },
            'type': {
                set(value) {
                    const type = isAntiAdBlocker(script.innerHTML) ? 'javascript/yeeted' : value;
                    _setAttribute('type', type)
                    return true
                }
            },
            'innerHTML': {
                get() {
                    return script.getAttribute('innerHTML');
                },
                set(value) {
                    const innerHTML = isAntiAdBlocker(script.innerHTML) ? 'no fuckin ads here :)' : value;
                    _setAttribute('type', innerHTML)
                    return true
                }
            }
        })

        return script
    }


    const config = { attributes: true, childList: true, subtree: true };

    const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach((node) => {
            /*if (node.target.name === 'kqp') {
                _setInterval(() => node.target.parentNode.submit(), 100);
            }*/

            node.addedNodes.forEach(node => {
                if (node.tagName === 'A') {
                    if (node.href.includes("xurl")) {
                        node.href= "http" + node.href.split("xurl=")[1];
                    }
                } else if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    if (isAntiAdBlocker(node.innerHTML) || isAntiAdBlocker(node.src)) {
                        node.type = 'javascript/yeeted';
                        node.parentNode.removeChild(node);
                    }
                } else if (node.tagName === 'DIV' && node.childNodes.length && node.childNodes[0].id === 'idModal') {
                    node.parentNode.removeChild(node);
                }
            })
        })
    });

    mutationObserver.observe(document, config);

    //
    // Run after DOM is ready
    //
    function ready() {
        // Strip ad links - Already being handled by mutation observator now
        /*const links = document.querySelectorAll("a[href*=\"bluemediafiles.com\"]");

        links.forEach(link => {
            if (link.href.indexOf("xurl=")) {
                link.href= "http" + link.href.split("xurl=")[1];
            }
        });*/
    }

    document.addEventListener('DOMContentLoaded', ready);
})();