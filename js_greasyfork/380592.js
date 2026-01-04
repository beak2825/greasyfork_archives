// ==UserScript==
// @match http://rbr.onlineracing.cz/*
// @match https://rbr.onlineracing.cz/*

// @name     RBR CZ Tourney Revamped
// @namespace rbr_cz_tourney_revamped
// @description Make tournaments on RBR CZ with ease
// @version  4
// @downloadURL https://update.greasyfork.org/scripts/380592/RBR%20CZ%20Tourney%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/380592/RBR%20CZ%20Tourney%20Revamped.meta.js
// ==/UserScript==

// Unfortunately this project is too big to be maintaned properly as a single userscript
// The source code can be found below. The minified files are provided with source maps.
// If you consider this script untrustworthy - I suggest to build and host it by yourself.
// https://github.com/suXinjke/RBRCZTourneyCreatorRevamped

var url_search_params = new URLSearchParams( window.location.search )
var act = url_search_params.get( 'act' )
if ( act === 'tourmntscre4A' ) {
  var remoteScript = document.createElement('script');
  remoteScript.src = 'https://suxinjke.github.io/rbrcz_tourney_revamped/v2b/app.42675d52.js';
  remoteScript.type = 'text/javascript';
  document.body.appendChild(remoteScript);
}