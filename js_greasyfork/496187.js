// ==UserScript==
// @name         Custom 7TV version
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Enter a custom 7TV manifest url to use a non mainbranch 7TV version
// @author       Excellify
// @match        https://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=7tv.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496187/Custom%207TV%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/496187/Custom%207TV%20version.meta.js
// ==/UserScript==
 
const CUSTOMURL = "https://extension.7tv.gg/manifest.stage.json";
 
(async function() {
    'use strict';
 
    let manifest;
    let seventv = {};
 
 
    Object.defineProperty(window, "seventv", {
        get() {
            return seventv;
        },
        set(v) {
            seventv = v
 
            if (!manifest) {
                console.warn("7TV extension loaded before script");
                return
            }
 
            if (!v.host_manifest) v.host_manifest = {};
            for (const [key, val] of Object.entries(manifest)) {
                v.host_manifest[key] = val;
            }
            v.hosted = true;
 
        }
    })
 
    fetch(CUSTOMURL)
        .then((res) => res.json())
        .then((m) => {
            manifest = m;
            console.log("Using custom 7TV version: ", m.version);
        }).catch((e) => {
            console.warn("Error getting custom 7TV version: ", e);
    })
 
})();