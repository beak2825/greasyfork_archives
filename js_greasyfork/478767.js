// ==UserScript==
// @name        整理URL
// @name:en     Clean URL
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     0.2
// @author      -
// @license     0BSD
// @description 整理URL, 使URL更干净 (in development)
// @description:en Make URL more cleaner
// @downloadURL https://update.greasyfork.org/scripts/478767/%E6%95%B4%E7%90%86URL.user.js
// @updateURL https://update.greasyfork.org/scripts/478767/%E6%95%B4%E7%90%86URL.meta.js
// ==/UserScript==
'use strict';

const cfgs = {
    "greasyfork.org": [
        {
            patt: /(\d+)[^\/]+/g,
            repl: "$1",
            where: "pathname"
        },
    ],
    "sleazyfork.org": ["greasyfork.org"],
};

function replace(host = location.host) {
    const rule = cfgs[host];
    if (rule == null) return;
    if (typeof rule[0] === "string") {
        for (const uri of rule) replace(uri);
        return;
    }
    for (const it of rule) {
        const uri = new URL(location);
        uri[it.where] = uri[it.where].replaceAll(it.patt, it.repl);
        history.replaceState(null, "", uri.href);
    }
}


replace();