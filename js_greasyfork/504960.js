// ==UserScript==
// @name            Redirect From Wikipedia To Wikiwand
// @namespace       https://vanyauhalin.me/
// @version         0.1.0
// @icon            https://www.google.com/s2/favicons/?sz=64&domain=wikiwand.com
// @description     Userscript that redirects from Wikipedia to Wikiwand
// @author          Ivan Uhalin <vanyauhalin@gmail.com> (https://vanyauhalin.me/)
// @license         MIT
// @homepageURL     https://github.com/vanyauhalin/userscript-redirect-from-wikipedia-to-wikiwand/
// @contributionURL https://github.com/vanyauhalin/userscript-redirect-from-wikipedia-to-wikiwand/
// @match           https://*.wikipedia.org/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/504960/Redirect%20From%20Wikipedia%20To%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/504960/Redirect%20From%20Wikipedia%20To%20Wikiwand.meta.js
// ==/UserScript==
(() => {
    "use strict";
    function main() {
        let [l, le] = lang();
        if (le) {
            throw le;
        }
        let [p, pe] = path();
        if (pe) {
            throw pe;
        }
        let u = new URL(`/${l}/${p}`, "https://wikiwand.com/");
        window.location.replace(u.toString());
    }
    function lang() {
        let m = window.location.hostname.match(/([\w-]+).wikipedia.org/);
        if (!m) {
            return ["", new Error("Could not detect the language of the Wikipedia article")];
        }
        let [_, l] = m;
        if (!l) {
            return ["", new Error("Could not detect the language of the Wikipedia article")];
        }
        return [l];
    }
    function path() {
        let m = window.location.pathname.match(/\/wiki\/([\S\s]*)/);
        if (!m) {
            return ["", new Error("Could not detect the path of the Wikipedia article")];
        }
        let [_, p] = m;
        if (!p) {
            return ["", new Error("Could not detect the path of the Wikipedia article")];
        }
        return [p];
    }
    main();
})();
