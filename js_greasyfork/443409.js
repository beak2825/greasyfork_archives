// ==UserScript==
// @name         URL minimizer
// @namespace    https://github.com/GottZ/url-minimizer
// @version      0.0.3
// @description  Shorten url's to their minimum representation for better sharing without tracking information.
// @author       GottZ
// @contributors BowuDev
// @include      /^https?:\/\/(www\.)?(amazon|ebay|youtube)\.[a-z]+/
// @include      https://*.gumroad.com/l/*
// @include      https://www.etsy.com/listing/*
// @icon         https://gottz.de/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/443409/URL%20minimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/443409/URL%20minimizer.meta.js
// ==/UserScript==

'use strict';

const sites = {
    // https://www.amazon.de/.../dp/(...)/?_encoding=.....
    "Amazon": {
        host: /\b(amazon\.[a-z]+)$/,
        path: /dp\/([^\/]+)(?:\/|$)/,
        template: ({host, path}) => `https://${host[1]}/dp/${path[1]}`,
    },
    // https://www.ebay.de/itm/(...)?_trkparms=.....
    "eBay": {
        host: /\b(ebay\.[a-z]+)$/,
        path: /itm\/(\d+)/,
        template: ({host, path}) => `https://${host[1]}/itm/${path[1]}`,
    },
    // https://www.youtube.com/watch?v=(...)
    "YouTube": {
        host: /\b(youtube\.[a-z]+)$/,
        search: /\bv=([\w\-\_]+)/,
        template: ({search}) => `https://youtu.be/${search[1]}`,
    },
    // https://www.etsy.com/listing/(...)/...?ga_order=.....
    "Etsy": {
        host: /\b(etsy)\.com$/,
        path: /^\/listing\/(\d+)\//,
        template: ({path}) => `https://etsy.com/listing/${path[1]}`,
    },
    // https://(ABC).gumroad.com/l/(ABC)?recommended_by=...
    "Gumroad": {
        host: /\b(\w+)(\.gumroad)\.com$/,
        path: /^\/l\/(\w+)$/,
        template: ({host, path}) => `https://${host[1]}.gumroad.com/l/${path[1]}`,
    },
};

const minimize = () => {
    let success = false;
    for (let name in sites) {
        const site = sites[name];
        if (!site.host.test(location.hostname)) continue;
        if ("path" in site && !site.path.test(location.pathname)) continue;
        if ("search" in site && !site.search.test(location.search)) continue;

        const host = site.host.exec(location.hostname);
        const path = "path" in site ? site.path.exec(location.pathname) : null;
        const search = "search" in site ? site.search.exec(location.search) : null;

        const link = site.template({host, path, search});

        prompt(`copy this ${name} link`, link);
        success = true;
        break;
    }

    if (!success) alert("could not shorten this url");
};

GM_registerMenuCommand("minimize", minimize);
