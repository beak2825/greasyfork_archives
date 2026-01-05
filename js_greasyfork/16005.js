// ==UserScript==
// @name        CrowdSurfDictionary
// @namespace   http://ops.cielo24.com
// @include     https://ops.cielo24.com/*
// @description Manage your own dictionary words for Crowd Surf spellchecker.
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16005/CrowdSurfDictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/16005/CrowdSurfDictionary.meta.js
// ==/UserScript==

ignore_these = [
  "ShareFile",
  "Citrix",
  "HIPAA",
  "versioning",
  "onboarding",
  "webinars"
];

for (i = 0; i < ignore_these.length; i++) {
  AtD.setIgnoreStrings(ignore_these[i]);
}