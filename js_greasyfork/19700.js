// ==UserScript==
// @name         Redirection of amazon mobile links (incl. mobile offer (Marketplace)) to amazon desktop
// @namespace    ExtraFlauschig.amazon
// @version      1.1
// @description  Redirects Amazon mobile links to the desktop version (for all countrys)
// @author       ExtraFlauschig
// @include      http://www.amazon.*/gp/aw/*
// @include      http://amazon.*/gp/aw/*
// @include      https://www.amazon.*/gp/aw/*
// @include      https://amazon.*/gp/aw/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19700/Redirection%20of%20amazon%20mobile%20links%20%28incl%20mobile%20offer%20%28Marketplace%29%29%20to%20amazon%20desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/19700/Redirection%20of%20amazon%20mobile%20links%20%28incl%20mobile%20offer%20%28Marketplace%29%29%20to%20amazon%20desktop.meta.js
// ==/UserScript==
window.location.toString().includes("/gp/aw/d/")? window.location.assign(window.location.toString().replace("/gp/aw/d/", "/dp/")) : window.location.assign(window.location.toString().replace("/gp/aw/ol/", "/gp/offer-listing/"));