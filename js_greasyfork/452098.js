// ==UserScript==
// @name         Auto add BnL Proxy into URL
// @description  Reserved for the user of Bibliothèque nationale du Luxembourg (BnL). Add ".proxy.bnl.lu" at the end of publication website URL
// @author       Bowen
// @version      0.21
// @namespace    https://greasyfork.org/users/964008
// @license MIT
// @tampermonkey-safari-promotion-code-request

// @match        *://interscience.wiley.com/*
// @match        *://onlinelibrary.wiley.com/*
// @match        *://www3.interscience.wiley.com/*
// @match        *://emeraldinsight.com/*
// @match        *://ieeexplore.ieee.org/*
// @match        *://springerlink.com/*
// @match        *://springerlink.metapress.com/*
// @match        *://springerprotocols.com/*
// @match        *://link.springer.com/*
// @match        *://journals.sagepub.com/*
// @match        *://www.scopus.com/*
// @match        *://scopus.com/*
// @match        *://sciencedirect.com/*
// @match        *://www.sciencedirect.com/*
// @match        *://dl.acm.org/*
// @match        *://www.tandfonline.com/*

// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/452098/Auto%20add%20BnL%20Proxy%20into%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/452098/Auto%20add%20BnL%20Proxy%20into%20URL.meta.js
// ==/UserScript==

var newURL = window.location.protocol + "//"
           + window.location.host.replaceAll(".", "-")
           + ".proxy.bnl.lu"
           + window.location.pathname;

window.location.replace (newURL);