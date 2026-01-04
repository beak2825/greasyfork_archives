// ==UserScript==
// @name         Bypass New York Times paywall
// @namespace    https://kudos.repl.co
// @version      1.0.1
// @description  No more NYT paywall anymore, and no more ads too!
// @author       Kudos Beluga
// @license      MIT
// @supportURL   https://github.com/Kudostoy0u
// @match        https://www.nytimes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428601/Bypass%20New%20York%20Times%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/428601/Bypass%20New%20York%20Times%20paywall.meta.js
// ==/UserScript==

(function() {
    document.body.innerHTML+="<style>#bottom-wrapper,#gateway-content,#top-wrapper,.ad,#dfp-ad-top,.css-1ichrj1,.css-11cg26{display:none!important}.css-gx5sib{background-image:rgba(0,0,0,0)!important;background-color:transparent}.css-mcm29f{position:inherit!important;overflow:auto!important}</style>"
})();