// ==UserScript==
// @name         ublock scriptlet test
// @namespace    test
// @version      1.2
// @license MIT
// @description  test
// @author       gfish
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530627/ublock%20scriptlet%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/530627/ublock%20scriptlet%20test.meta.js
// ==/UserScript==

/***
USAGE: check this tutorial https://www.xaloez.com/blog/UblockOriginScriptlets/index.html
TLDR
    - copy below code to a text pasting site (no empty lines allowed)
    - set userResourcesLocation to [paste link URL]
    - add *##+js(test) to My Filters
***/

/// scriptlet-test.js
/// alias test.js
/// world main
/// dependency run-at.fn
(function test() {
    console.log(JSON.stringify(Object.entries(window).map(([k,v]) => {return [k,v ? Object.keys(v) : undefined]})))
})();