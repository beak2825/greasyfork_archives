// ==UserScript==
// @name         Spotify don't open in app
// @author       OrdinaryDog
// @description  This userscript prevents open.spotify.com links from opening the app
// @version      1.0
// @license      MIT License
// @copyright    Copyright (C) 2022, by ordinarydog@protonmail.com
// @match        http://open.spotify.com/*
// @match        https://open.spotify.com/*
// @namespace    https://greasyfork.org/users/172431
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/445028/Spotify%20don%27t%20open%20in%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/445028/Spotify%20don%27t%20open%20in%20app.meta.js
// ==/UserScript==

(function () {
  "use strict";
  try {
    var config = JSON.parse(document.getElementById("urlSchemeConfig").innerHTML);
    window.location.replace(config.redirectUrl);
  } catch (err) {} // no urlSchemeConfig, nothing to do
})();
