// ==UserScript==
// @name         Google - dismiss cookies warning
// @name:fr      Google - supprime l'avertissement de cookies
// @namespace    https://github.com/Procyon-b
// @version      0.6
// @description  Agrees to the cookies dialog to make it disappear forever
// @description:fr  Confirme l'acceptation des cookies pour le faire disparaître définitivement
// @author       Achernar
// @include      https://consent.google.*/*
// @include      https://www.google.tld/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412348/Google%20-%20dismiss%20cookies%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/412348/Google%20-%20dismiss%20cookies%20warning.meta.js
// ==/UserScript==

(function(){
"use strict";
if (document.readyState != 'loading') consent();
else document.addEventListener('DOMContentLoaded', consent);

function consent() {
  var e=document.querySelector('#introAgreeButton');
  if (!e) e=document.querySelector('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, div.GzLjMd button#L2AGLb.tHlp8d, form[action="https://consent.google.com/s"] button');
  if (!e) {
    let A=document.querySelectorAll('div.lssxud button.nCP5yc:not(:disabled)');
    if (A.length > 1) e=A[1];
    }
  e && e.click();
  }

})();