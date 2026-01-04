// ==UserScript==
// @name eksi direkt fotograf yonlendirici
// @description fotografa tiklayinca direkt olarak fotografin linkine yonlendirir
// @license MIT
// @author İsmail Karslı <cszn@pm.me> (https://ismail.karsli.net)
// @namespace https://github.com/ismailkarsli
// @homepageURL https://github.com/ismailkarsli/userscripts
// @supportURL https://github.com/ismailkarsli/userscripts/issues
// @version 1.0.0
// @match https://eksisozluk*.com/img/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/468002/eksi%20direkt%20fotograf%20yonlendirici.user.js
// @updateURL https://update.greasyfork.org/scripts/468002/eksi%20direkt%20fotograf%20yonlendirici.meta.js
// ==/UserScript==

const img = document.querySelector("img#image");
if (img) {
	window.location.replace(img.src);
}
