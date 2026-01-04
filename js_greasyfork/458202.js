// ==UserScript==
// @name        Redirect Wikimedia Projects from Mobile Version to Desktop Version
// @version     1.0.0
// @description Redirect wiki projects from mobile version to desktop version with ManifestV3. Including wikipedia, wikibooks, wiktionary, wikiquote, wikimedia, wikisource, wikiversity, wikispecies, wikidata, wikivoyage and wikinews.
// @namespace   AmaniNakupendaWeWe
// @match       *://*.m.wikipedia.org/*
// @match       *://*.m.wikibooks.org/*
// @match       *://*.m.wiktionary.org/*
// @match       *://*.m.wikiquote.org/*
// @match       *://*.m.wikimedia.org/*
// @match       *://*.m.wikisource.org/*
// @match       *://*.m.wikiversity.org/*
// @match       *://*.m.wikispecies.org/*
// @match       *://*.m.wikidata.org/*
// @match       *://*.m.wikivoyage.org/*
// @match       *://*.m.wikinews.org/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458202/Redirect%20Wikimedia%20Projects%20from%20Mobile%20Version%20to%20Desktop%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/458202/Redirect%20Wikimedia%20Projects%20from%20Mobile%20Version%20to%20Desktop%20Version.meta.js
// ==/UserScript==

const re = /m.wik(.+)\.org/;

location.replace(
  location.href
    .replace(re, location.href.match(re)[0].slice(2))
);
