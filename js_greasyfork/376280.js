// ==UserScript==
// @name         No More Hits Auto Close
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       M C KRISH
// @match        https://worker.mturk.com/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376280/No%20More%20Hits%20Auto%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/376280/No%20More%20Hits%20Auto%20Close.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (
  (
    document.documentElement.textContent || document.documentElement.innerText
  ).indexOf('message":"') > -1
) {
  setTimeout(
function ( )
{
  self.close();
}, 750 );
}
    if (
  (
    document.documentElement.textContent || document.documentElement.innerText
  ).indexOf('"error":"') > -1
) {
location.reload();
}
    if (
  (
    document.documentElement.textContent || document.documentElement.innerText
  ).indexOf('message":"This Requester has specified Qualifications"') > -1
) {
  setTimeout(
function ( )
{
  self.close();
}, 750 );
}

    // Your code here...
})();