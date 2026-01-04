// ==UserScript==
// @name        New script hydrus.app
// @namespace   Violentmonkey Scripts
// @match       https://dev.hydrus.app/*
// @grant       none
// @version     1.0
// @author      -
// @description 26/03/2024, 18:51:19
// @downloadURL https://update.greasyfork.org/scripts/490945/New%20script%20hydrusapp.user.js
// @updateURL https://update.greasyfork.org/scripts/490945/New%20script%20hydrusapp.meta.js
// ==/UserScript==
(function() {
  const tags = [ "-futanari", "-meta:ai generated", "-ai", "-ai-generated", "-medium:ai generated", "system:import time ~= today", "system:modified time ~= today" ]
  const hydrusSettings = 'hydrus-web-1_appSettings';
  const settings = JSON.parse(localStorage.getItem(hydrusSettings));
  var modifiedTags = false;
  tags.forEach(function(tag) {
    if (settings.browseDefaultSearchTags.indexOf(tag) === -1) {
      settings.browseDefaultSearchTags.push(tag);
      modifiedTags = true;
    }
  })
  if (modifiedTags) {
    localStorage.setItem(hydrusSettings, JSON.stringify(settings));
    window.location.reload(true);
  }
})();