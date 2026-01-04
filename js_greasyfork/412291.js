// ==UserScript==
// @name              Pornhub Bypass (IN)
// @namespace     ghostrider47
// @version            0.3
// @description     Simple Hack to Bypass Pornhub Restriction in India . Read Additional info.
// @author            ghostrider47
// @match            *://*.pornhub.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/412291/Pornhub%20Bypass%20%28IN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412291/Pornhub%20Bypass%20%28IN%29.meta.js
// ==/UserScript==
// @run-at            document-start
// @run-at            document-end
// @run-at            document-idle

document.location = document.URL.replace('pornhub.com','pornhub.org');