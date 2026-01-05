// ==UserScript==
// @name         Humble Bundle - Steam Links Adder
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/47e474eed38083df699b7dfd8d29d575e3398f1e.ico
// @namespace    Royalgamer06
// @version      1.2.2
// @description  Adds steam links to Humble Bundle games (https://greasyfork.org/en/scripts/26273-steam-store-game-owned-checker COMPATIBLE!) - Updated to work with lock icons, and to check shortened variants of names
// @author       Revadike
// @contributor  redion1992
// @include      *://www.humblebundle.com/*
// @exclude      *://www.humblebundle.com/home/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      api.steampowered.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/27373/Humble%20Bundle%20-%20Steam%20Links%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/27373/Humble%20Bundle%20-%20Steam%20Links%20Adder.meta.js
// ==/UserScript==

// ==Configuration==
const selectors = [".entity-title",
    ".deal-title",
    ".product-name",
    ".text-holder > h2",
    ".product-title > h2",
    "h1[data-entity-kind=product]",
    ".desktop:has(.hb-steam) .dd-image-box-caption",
    ".humble-original-title",
    ".game-name > h4",
    ".sr-key-heading > span"];
// ==/Configuration==

// ==Code==
GM_addStyle('.bundle-info-text a { visibility: visible; }');
this.$ = this.jQuery = jQuery.noConflict(true);
const selector = selectors.join(":not(.steamified):not(a):not(:has(a)), ") + ":not(.steamified):not(a):not(:has(a))";
GM_xmlhttpRequest({
    method: "GET",
    url: "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
    onload: response => {
        const applist = JSON.parse(response.responseText).applist.apps;
        $(document).ready(() => setInterval(() => $(selector).each((i, e) => steamify(e, applist)), 100));
    }
});

function steamify(titleElem, applist) {
    $(titleElem).addClass("steamified");
    setTimeout(() => {
        let title = $(titleElem).text().toLowerCase().replace(/locked content|\(early access\)|\(pre\-order\)|\:|\-|\–|\\|\/|\™|\®| |\’|\`|\'|\.|\?|\!/g, "").trim();
        let obj = applist.filter(v => v.name.toLowerCase().replace(/\:|\-|\–|\\|\/|\™|\®| |\’|\`|\'|\.|\?|\!/g, "").trim() === title)[0];
        if (obj) {
            $(titleElem).wrapInner("<a style='color: inherit; z-index: -1;' href='http://store.steampowered.com/app/" + obj.appid + "/'></a>");
        } else {
            title = $(titleElem).text().toLowerCase().replace(/locked content|\(early access\)|\(pre\-order\)|\-|\–|\\|\/|\™|\®| |\’|\`|\'|\.|\?/g, "").split(":")[0].split("!")[0].trim();
            obj = applist.filter(v => v.name.toLowerCase().replace(/\:|\-|\–|\\|\/|\™|\®| |\’|\`|\'|\.|\?|\!/g, "").trim() === title)[0];
            if (obj) {
                $(titleElem).wrapInner("<a style='color: inherit; z-index: -1;' href='http://store.steampowered.com/app/" + obj.appid + "/'></a>");
            }
        }
    }, 0);
}
// ==/Code==