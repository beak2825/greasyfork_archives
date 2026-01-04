// ==UserScript==
// @name         Bypass Wired.com paywall
// @namespace    https://kudos.repl.co
// @version      1.0.1
// @description  No more paywall anymore, and no more ads too!
// @author       Daniel Ingersoll
// @license      MIT
// @match        https://www.wired.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428829/Bypass%20Wiredcom%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/428829/Bypass%20Wiredcom%20paywall.meta.js
// ==/UserScript==

(function() {
    document.body.innerHTML+="<style>#bottom-wrapper,#gateway-content,#top-wrapper,.ad,#dfp-ad-top,.css-1ichrj1,.css-11cg26{display:none!important}.css-gx5sib{background-image:rgba(0,0,0,0)!important;background-color:transparent}.css-mcm29f{position:inherit!important;overflow:auto!important}</style>"
})();