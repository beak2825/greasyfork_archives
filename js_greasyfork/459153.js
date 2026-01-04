// ==UserScript==
// @name         Force Wikipedia Old (Vector) Skin
// @namespace    http://sr.ht/~weebney
// @version      0.1
// @description  Returns Wikipedia's "Vector" skin. Doesn't break history or URLs, works faster!
// @author       weebney
// @icon         https://en.wikipedia.org/favicon.ico
// @match        *://*.wikipedia.org/wiki/*
// @grant        none
// @run-at       document-start
// @license      BSD-2-Clause
// @downloadURL https://update.greasyfork.org/scripts/459153/Force%20Wikipedia%20Old%20%28Vector%29%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/459153/Force%20Wikipedia%20Old%20%28Vector%29%20Skin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location
    const strippedURL = url.toString().split('?')[0]
    let params = new URLSearchParams(url.search);
    if (!params.get("useskin")) {
        params.append("useskin", "vector")
        url.replace(strippedURL + '?' + params.toString())
    } else {
        params.delete("useskin")
        let newParamString; params.toString() ? newParamString = '?' + params.toString() : newParamString = ''
        window.history.replaceState(null, document.title, strippedURL + newParamString)
    }
})();