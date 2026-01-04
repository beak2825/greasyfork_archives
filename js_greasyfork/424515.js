// ==UserScript==
// @name        Redirect free file description page to Wikimedia Commons
// @namespace   jobbautista.neocities.org
// @description Redirects every free files in sister Wikimedia wikis to their Wikimedia Commons description page.
// @include     http://*.wikipedia.org/*
// @include     https://*.wikipedia.org/*
// @include     http://*.wikinews.org/*
// @include     https://*.wikinews.org/*
// @include     http://*.wikiversity.org/*
// @include     https://*.wikiversity.org/*
// @include     http://*.wiktionary.org/*
// @include     https://*.wiktionary.org/*
// @include     http://*.wikimedia.org/*
// @include     https://*.wikimedia.org/*
// @include     http://*.wikivoyage.org/*
// @include     https://*.wikivoyage.org/*
// @include     http://*.wikibooks.org/*
// @include     https://*.wikibooks.org/*
// @include     http://*.wikisource.org/*
// @include     https://*.wikisource.org/*
// @include     http://www.mediawiki.org/*
// @include     https://www.mediawiki.org/*
// @include     http://www.wikidata.org/*
// @include     https://www.wikidata.org/*
// @exclude     http://commons.wikimedia.org/*
// @exclude     https://commons.wikimedia.org/*
// @version     1.0
// @license     CC0-1.0
// @author      Job Bautista
// @supportURL  mailto:jobbautista9@aol.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424515/Redirect%20free%20file%20description%20page%20to%20Wikimedia%20Commons.user.js
// @updateURL https://update.greasyfork.org/scripts/424515/Redirect%20free%20file%20description%20page%20to%20Wikimedia%20Commons.meta.js
// ==/UserScript==
if (document.getElementById("mw-sharedupload")){
  window.stop();
  location.host = "commons.wikimedia.org";
}