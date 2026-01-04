// ==UserScript==
// @name        PosteID SPID Rapido
// @description Minimizza i click e il tempo perso nei login SPID tramite PosteID
// @namespace   https://www.octt.eu.org/
// @match       https://posteid.poste.it/jod-login-schema/*
// @grant       none
// @version     1.0.0
// @author      OctoSpacc
// @license     ISC
// @downloadURL https://update.greasyfork.org/scripts/491822/PosteID%20SPID%20Rapido.user.js
// @updateURL https://update.greasyfork.org/scripts/491822/PosteID%20SPID%20Rapido.meta.js
// ==/UserScript==

const loginFormElem = document.querySelector('form[action="/jod-login-schema/xlogindis"]');
const consentFormElem = document.querySelector('form[action="/jod-login-schema/consent"]');

if (loginFormElem) {
  loginFormElem.querySelector('ul > li > a[onclick]').onclick();
} else if (consentFormElem) {
  document.querySelector('button[onclick="addconsent(1);"]').onclick();
}