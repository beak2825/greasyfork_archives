// ==UserScript==
// @name            Joyn.de Adblocker
// @name:de         Joyn.de Adblocker
// @version         2.0.0
// @description     Adblocker for Joyn.de, because the common adblockers are blocked
// @description:de  Adblocker für Joyn.de, da die gängigen Adblocker blockiert werden
// @icon            https://www.joyn.de/favicon.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/joyn.de-adblocker
// @license         MIT
// @match           https://www.joyn.de/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/438891/Joynde%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/438891/Joynde%20Adblocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const old_window_top_fetch = window.top.fetch;

    function checkURL(args, url) {
        if (
            (
                typeof (args[0]) == "object" &&
                args[0].url &&
                new URL(args[0].url).host.includes(url)
            ) || (
                typeof (args[0]) == "string" &&
                args[0] &&
                new URL(args[0]).host.includes(url)
            )
        ) {
            return true;
        }
    }

    window.top.fetch = function (...args) {
        if ([
            "sqrt-5041.de",
            "ad71.adfarm1.adition.com",
            "bat.bing.com",
            "9478953.fls.doubleclick.net",
            "googleads.g.doubleclick.net",
            "connect.facebook.net",
            "static.hotjar.com",
            "cdn-gl.nmrodam.com",
            "amplify.outbrain.com",
            "tr.outbrain.com",
            "alb.reddit.com",
            "cdn.segment.com",
            "o292998.ingest.sentry.io",
            "dmp.theadex.com",
            "analytics.tiktok.com"
        ].find(item => checkURL(args, item))) { // Block Ad & Tracking Web Requests from Privacy Badger Extension
            return;
        }

        if (!checkURL(args, "swankyrule.zomap.de")) { // Don't Intercept other Web Requests except https://swankyrule.zomap.de/v2/
            return old_window_top_fetch.apply(null, args);
        }

        return new Promise(async (resolve, reject) => {
            const data = await old_window_top_fetch.apply(null, args);
            const text = await (await data.clone()).text();
            if (text.indexOf("<MediaFiles>") == -1) {
                return resolve(data);
            }
            data.text = function () {
                return new Promise((resolve, reject) => {
                    const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
                    xmlDoc.querySelectorAll("MediaFile").forEach((item) => item.remove()); // Delete all MediaFile Elements in XML
                    resolve(new XMLSerializer().serializeToString(xmlDoc));
                });
            };
            resolve(data);
        });
    };
})();