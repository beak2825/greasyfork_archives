// ==UserScript==
// @name         Amazon Gog Redeemer
// @namespace    FaustVXAmazonGog
// @version      1.1
// @description  Provide a link to Gog.com from Amazon Prime Games
// @author       FaustVX
// @match        https://gaming.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaming.amazon.com
// @grant        none
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=oria.jonathan@gmail.com&item_name=TamperMonkey+Amazon+Gog+Redeemer
// @license         MIT
// @supportURL      https://gist.github.com/FaustVX/480c9fb00d71d50bb2faff16524e2d31#comments
// @downloadURL https://update.greasyfork.org/scripts/500224/Amazon%20Gog%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/500224/Amazon%20Gog%20Redeemer.meta.js
// ==/UserScript==

function run() {
    'use strict';

    const urlSplit = window.location.href.split('/');
    const domainName = urlSplit[2].split('.');

    function changeHref(query) {
        return function (a) {
            const urlParams = new URLSearchParams(a.search);
            const url = urlParams.get(query);
            a.href = decodeURIComponent(url);
        }
    }

    function changeTag(node, tag) {
        const clone = createElement(tag)
        for (const attr of node.attributes) {
            clone.setAttributeNS(null, attr.name, attr.value)
        }
        while (node.firstChild) {
            clone.appendChild(node.firstChild)
        }
        node.replaceWith(clone)
        return clone
    }

    function createElement(tag) {
        return document.createElementNS(tag === 'svg' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml', tag)
    }

    function execute(isActivated, selectorAll, foreach) {
        if (isActivated) {
            document.querySelectorAll(selectorAll).forEach(foreach);
            return true;
        }
        return false;
    }

    execute(domainName[1] === "amazon" && !urlSplit[3].endsWith("microsoft"), 'button[data-a-target="copy-code"] span[data-a-target="tw-button-text"]:not(:has(a))', function(s) {
        const href = "https://www.gog.com/redeem/" + s.parentNode.parentNode.parentNode.parentNode.previousSibling.lastChild.lastChild.attributes.value.textContent;
        const a = createElement('a');
        a.href = href;
        a.innerHTML = "Redeem on Gog";
        a.style="color:white";
        a.target="_blank";
        s.replaceWith(a)
    })
};

function runWhenReady(callback) {
    const tryNow = function() {
        try {
            callback();
        } catch { }
        setTimeout(tryNow, 250);
    };
    tryNow();
}

runWhenReady(run);
