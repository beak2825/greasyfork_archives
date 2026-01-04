// ==UserScript==
// @name             Linkedin G Cache
// @namespace    ghostrider47
// @version          0.1
// @description    LinkedIn Redirect to Google Cache
// @author           ghostrider47
// @include          https://in.linkedin.com/*
// @include          https://www.linkedin.com/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/412017/Linkedin%20G%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/412017/Linkedin%20G%20Cache.meta.js
// ==/UserScript==
// @run-at         document-start
// @run-at         document-end
// @run-at         document-idle

document.location = document.URL.replace('','https://webcache.googleusercontent.com/search?q=cache:');