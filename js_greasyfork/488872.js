// ==UserScript==
// @name        bom https
// @namespace   Violentmonkey Scripts
// @match       *://www.bom.gov.au/*
// @grant       none
// @license     MIT
// @version     1.6
// @author      forkbombsh
// @description redirects you from the non secure version of bom to the secure version.
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/488872/bom%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/488872/bom%20https.meta.js
// ==/UserScript==

if (/^http(s)?:\/\/www\.bom\.gov\.au/.test(window.location.href)) {
  window.location.replace(`https://reg.bom.gov.au${window.location.pathname}`);
}