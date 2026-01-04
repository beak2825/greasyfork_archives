// ==UserScript==
// @name Hide stack blot
// @description Removes stackexchange cancer
// @version 0.06
// @namespace Violentmonkey Scripts
// @match https://askubuntu.com/questions/*
// @match https://mathoverflow.net/questions/*
// @match https://serverfault.com/questions/*
// @match https://stackoverflow.com/questions/*
// @match https://superuser.com/questions/*
// @match https://*.stackexchange.com/questions/*
// @match https://*.stackoverflow.com/questions/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376559/Hide%20stack%20blot.user.js
// @updateURL https://update.greasyfork.org/scripts/376559/Hide%20stack%20blot.meta.js
// ==/UserScript==
GM_addStyle (".left-sidebar, .post-form, .site-footer--container, .site-footer, .js-footer, .s-hero, .s-hero__dark, .js-dismissable-hero, .old-hero, .hero-container, #js-gdpr-consent-banner, #footer {display:none;}")