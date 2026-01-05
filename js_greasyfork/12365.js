// ==UserScript==
// @name         Saikoanimes Downloads
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.6
// @description  Remove o tempo de espera do Download "Link Direto" do site Saikoanimes.net
// @author       Felippe Renan Albano
// @include      http://*saikoanimes.net/protetor/*
// @include      https://*saikoanimes.net/protetor/*
// @include      http://*radiosaiko.com/protetor/*
// @include      https://*radiosaiko.com/protetor/*
// @include      https://saikoanimes.com/protetor.php?*
// @include      https://saikocloud.ml/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/12365/Saikoanimes%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/12365/Saikoanimes%20Downloads.meta.js
// ==/UserScript==

unsafeWindow.i = 0;
window.location.replace(document.getElementsByClassName('bnt-down')[0].href);