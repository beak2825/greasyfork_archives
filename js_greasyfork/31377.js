// ==UserScript==
// @name         Hyuugadownloads
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.1
// @description  Burla a página de espera de 20 segundos para realizar o Download
// @author       Felippe
// @include      http://hyuugadownloads.com.br/protetor/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31377/Hyuugadownloads.user.js
// @updateURL https://update.greasyfork.org/scripts/31377/Hyuugadownloads.meta.js
// ==/UserScript==

window.location.replace(document.getElementsByClassName('l-timer')[0].href);