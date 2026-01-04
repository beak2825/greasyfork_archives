// ==UserScript==
// @name         Proxy Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect blocked sites through a proxy server
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473401/Proxy%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/473401/Proxy%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedSite = 'krunker.io';
    const proxyListURL = 'https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc';

    async function getProxy() {
        const response = await fetch(proxyListURL);
        const proxyData = await response.json();
        if (proxyData.data) {
            return proxyData.data[0].url;
        }
        return null;
    }

    async function redirectThroughProxy() {
        const proxyServer = await getProxy();
        if (!proxyServer) {
            console.log('No available proxy servers');
            return;
        }

        const currentURL = window.location.href;
        const proxyURL = currentURL.replace(blockedSite, proxyServer);
        const headers = {};
        for (const [key, value] of Object.entries(requestHeaders)) {
            headers[key] = value;
        }
        
        const response = await fetch(proxyURL, { headers });
        const text = await response.text();
        document.open();
        document.write(text);
        document.close();
    }

    const requestHeaders = Object.fromEntries(new Headers({
        ...new URLSearchParams(window.location.search),
        ...Object.fromEntries(new Headers({
            ...document.currentScript,
            ...document.scripts[0],
            ...document.scripts[0].attributes,
            ...document.documentElement,
            ...document.documentElement.attributes,
            ...document.documentElement.dataset,
            ...document.documentElement.style,
            ...document,
            ...window,
            ...window.location,
            ...window.location.hash,
            ...window.location.origin,
            ...window.location.pathname,
            ...window.location.search,
            ...window.location.ancestorOrigins,
            ...window.location.port,
            ...window.location.protocol,
            ...window.location.host,
            ...window.location.hostname,
            ...window.location.username,
            ...window.location.password,
            ...window.location.href,
            ...window.location.assign,
            ...window.location.replace,
            ...window.location.reload,
            ...window.location.searchParams,
            ...window.location.toString,
            ...window.location.toLocaleString,
            ...window.location.valueOf,
            ...window.location.toJSON,
            ...window.location.substring,
            ...window.location.split,
            ...window.location.replaceState,
            ...window.location.pushState,
            ...window.location.replaceState,
            ...window.location.forward,
            ...window.location.back,
            ...window.location.go,
            ...window.location.history,
            ...window.location.scroll,
            ...window.location.scrollBy,
            ...window.location.scrollTo,
            ...window.location.scrollIntoView,
            ...window.location.scrollIntoViewIfNeeded,
            ...window.location.request,
            ...window.location.onhashchange,
            ...window.location.onpopstate,
            ...window.location.onpagehide,
            ...window.location.onpageshow,
            ...window.location.origin,
            ...window.location.assign,
            ...window.location.replace,
            ...window.location.reload,
            ...window.location.searchParams,
            ...window.location.toString,
            ...window.location.toLocaleString,
            ...window.location.valueOf,
            ...window.location.toJSON,
            ...window.location.substring,
            ...window.location.split,
            ...window.location.replaceState,
            ...window.location.pushState,
            ...window.location.replaceState,
            ...window.location.forward,
            ...window.location.back,
            ...window.location.go,
            ...window.location.history,
            ...window.location.scroll,
            ...window.location.scrollBy,
            ...window.location.scrollTo,
            ...window.location.scrollIntoView,
            ...window.location.scrollIntoViewIfNeeded,
            ...window.location.request,
            ...window.location.onhashchange,
            ...window.location.onpopstate,
            ...window.location.onpagehide,
            ...window.location.onpageshow,
            ...window.location.origin,
            ...window.location.assign,
            ...window.location.replace,
            ...window.location.reload,
            ...window.location.searchParams,
            ...window.location.toString,
            ...window.location.toLocaleString,
            ...window.location.valueOf,
            ...window.location.toJSON,
            ...window.location.substring,
            ...window.location.split,
            ...window.location.replaceState,
            ...window.location.pushState,
            ...window.location.replaceState,
            ...window.location.forward,
            ...window.location.back,
            ...window.location.go,
            ...window.location.history,
            ...window.location.scroll,
            ...window.location.scrollBy,
            ...window.location.scrollTo,
            ...window.location.scrollIntoView,
            ...window.location.scrollIntoViewIfNeeded,
            ...window.location.request,
            ...window.location.onhashchange,
            ...window.location.onpopstate,
            ...window.location.onpagehide,
            ...window.location.onpageshow,
        }).entries())
    }).entries());

    if (window.location.href.includes(blockedSite)) {
        redirectThroughProxy();
    }
})();
