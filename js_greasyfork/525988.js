// ==UserScript==
// @name            Reddit Untranslate
// @name:de         Reddit Untranslate
// @namespace    	https://greasyfork.org/users/928242
// @version      	1.0.0
// @description  	Removes the language param in url and redirects to the original post language.
// @description:de 	Entfernt den Sprachen Parameter in der URL und leitet auf die Originalsprache des Posts um.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL     	https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://*.reddit.com/*
// @match           https://www.reddit.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      	MIT
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/525988/Reddit%20Untranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/525988/Reddit%20Untranslate.meta.js
// ==/UserScript==

(() => {
    let url = new URL(window.location.href)
    if ( url.searchParams.has("tl") ) {
        console.log("Redirecting to untranslated post..")
        url.searchParams.delete("tl")
        window.location.href = url.toString()
    }
})();
