// ==UserScript==
// @name         Custom gbob
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  game popping
// @author       Commensalism
// @match        http*://gpop.io/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpop.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503945/Custom%20gbob.user.js
// @updateURL https://update.greasyfork.org/scripts/503945/Custom%20gbob.meta.js
// ==/UserScript==

//example gbobs made by giro57
const gbobsrc = "https://raw.githubusercontent.com/Commensalism1997/gbob/main/teto";

(function() {
    window._$7N._$R = function(a, f) {
        var c = window._$7N._$7p;
        if (!(a in c)) {
        c[a] = {};
    }
    for (var e = 0; e < f.length; e++) {
        var d = f[e];
        if (d in c[a]) {
            continue;
        }
        var g = gbobsrc.replace(/\/$/, "") + "/" + d + ".png";
        var b = new Image();
        b._$1x = false;
        b["onload"] = function(a) {
            this._$1x = true;
        }
        ;
        b["src"] = g;
        c[a][d] = b;
    }
}
})();