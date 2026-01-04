// ==UserScript==
// @name         Flight Rising - Market Place-Keeper
// @namespace    https://greasyfork.org/users/547396
// @version      0.4
// @description  Prevents you from losing your place when you buy a market item by updating the browser URL.
// @author       Jicky
// @match        https://*.flightrising.com/market
// @match        https://*.flightrising.com/market/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426662/Flight%20Rising%20-%20Market%20Place-Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/426662/Flight%20Rising%20-%20Market%20Place-Keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keepSearchPaneOpen = true;

    function updateUrl() {
        let status = parseCurrent();
        if (keepSearchPaneOpen) {
            if (status.url.name || status.page.name) { showSearchPane(); }
        }
        if (statusIsEqual(status.url, status.page)) {
            return false;
        } else {
            let newUrl = buildUrl(status.page);
            let newTitle = buildTitle(status.page);
            setBrowserState(newUrl, newTitle);
            return { url: newUrl, title: newTitle };
        }
    }
    function statusIsEqual(url, page) {
        return url.currency==page.currency && url.tab==page.tab && url.num==page.num && url.name==page.name;
    }
    function showSearchPane() {
        document.getElementById('market-filters').style.display = 'block';
    }


    // PARSING
    // ------

    function parseCurrent() {
        let urlInfo = parseUrl(window.location.href);
        let pageInfo = parseLocation();
        return { url: urlInfo, page: pageInfo };
    }
    function parseUrl(url) {
        if (!url) { url=window.location.href; }
        let num = 1;
        let tab = 'apparel';
        let currency = 'treasure';

        let uri = new URL(url);
        let name = uri.searchParams.get('name');

        let regex = /\/market\/(treasure|gem)(\/(\w+))?(\/(\d+))?/;
        let matches = regex.exec(url);
        if (matches) {
            if (matches[1]) { currency = matches[1]; }
            if (matches[3]) { tab = matches[3]; }
            if (matches[5]) { num = parseInt(matches[5]); }
        }
        return { currency: currency, tab: tab, num: num, name: name };
    }
    function parseLocation() {
        let num = 1;
        let tab = 'apparel';
        let currency = 'treasure';
        let baseUrl = 'https://www1.flightrising.com/market/treasure/apparel';

        let name = document.querySelector('input[name="name"]').value.trim();
        if (name=='') { name = null; }

        let node = document.querySelector('[data-current]');
        if (node) { num = parseInt(node.getAttribute('data-current')); }
        node = document.querySelector('div.common-tab-selected a');
        if (node) {
            baseUrl = node.getAttribute('href');
            let urlInfo = parseUrl(baseUrl);
            currency = urlInfo.currency;
            tab = urlInfo.tab;
        }
        return { currency: currency, tab: tab, num: num, name: name };
    }


    // URL/TITLE BUILDING AND EDITING
    // ------

    function buildUrl(args) {
        let url = `https://www1.flightrising.com/market/${args.currency}/${args.tab}`;
        if (args.name) {
            return `${url}?name=${args.name}`;
        } else {
            return `${url}/${args.num}`;
        }
    }
    function buildTitle(args) {
        let title = `${capitalize(args.currency)} Marketplace - Flight Rising`;
        if (args.name) {
            return `${args.name} - ${capitalize(args.tab)} | ${title}`;
        } else {
            return `${capitalize(args.tab)} - ${args.num} | ${title}`;
        }
    }
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function setBrowserState(url, title, html) {
        console.log(`Updating: { url: '${url}', title: '${title}' }`);
        if (!title) { title=document.title; }
        if (!html) { html=getDocumentHtml(); }
        window.history.pushState({"html":html,"pageTitle":title},"",url);
    }
    function getDocumentHtml() {
        return (new XMLSerializer().serializeToString(document));
    }


    // WATCH FOR CUE TO UPDATE
    // ------

    const observer = new MutationObserver(function(mutationsList, observer) {
        updateUrl();
    });
    const marketResults = document.querySelector('div#market-results');
    observer.observe(marketResults, {childList: true});

})();