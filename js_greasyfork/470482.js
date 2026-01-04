// ==UserScript==
// @name            URL Redirect Redirecter
// @namespace       FaustVXUrlRedirect
// @version         0.4.6
// @description     Redirect the Redirected Url
// @author          FaustVX
// @match           http*://www.curseforge.com/*
// @match           http*://legacy.curseforge.com/*
// @match           http*://*.youtube.com/*
// @match           http*://twitter.com/*
// @match           http*://github.com/*
// @match           http*://calendar.google.com/*
// @match           http*://*.ygg.re/*
// @grant           none
// @supportURL      https://gist.github.com/FaustVX/0deb00258929a517a6e2796f9020e17c#comments
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=jonathan-035@hotmail.fr&item_name=TamperMonkey+Url+Redirect
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/470482/URL%20Redirect%20Redirecter.user.js
// @updateURL https://update.greasyfork.org/scripts/470482/URL%20Redirect%20Redirecter.meta.js
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

    function execute(i, url, selectorAll, foreach) {
        if (domainName[i] === url) {
            document.querySelectorAll(selectorAll).forEach(foreach);
            return true;
        }
        return false;
    }

    execute(1, "curseforge", 'a[href*="/linkout"]', changeHref("remoteUrl"))
    || execute(1, "youtube", 'a[href*="/redirect"]', changeHref("q"))
    || execute(0, "calendar", 'a[href*="/url"]', changeHref("q"))
    || execute(0, "github", '.Box-sc-g0xbh4-0.iiAnVG span[data-testid="compare-text"]:not(:has(a))', function(s) {
        const href = "compare/" + s.lastChild.textContent;
        const a = createElement('a');
        a.href = href;
        a.innerHTML = s.lastChild.textContent;
        s.lastChild.replaceWith(a)
    })
    || execute(1, "ygg", 'a[href*="/misc/safe_redirect?url="]', function(s) {
        const urlParams = new URLSearchParams(s.search);
        s.href = detectYgg(urlParams.get('url'));

        function detectYgg(url) {
            const split = atob(url).split('/');
            const href = split.slice(split.findIndex((e) => e.includes('ygg')) + 1).join('/');
            if (!href.startsWith('http')) {
                return '/' + href;
            }
            return href;
        }
    })
    || execute(0, "twitter", 'a[href*="t.co/"]', function(a) {
        if (a.innerHTML.startsWith('<span')) {
            a.href = a.innerHTML = a.innerText.replace(/…$/, '');
        }
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
