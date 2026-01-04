// ==UserScript==
// @name         "stylishInstall" --> "stylishInstallChrome"
// @namespace    justin_sucks@userstyles.org
// @version      1.0
// @description  Huh? Say it again in words I understand...
// @author       me
// @match        https://userstyles.org/styles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31283/%22stylishInstall%22%20--%3E%20%22stylishInstallChrome%22.user.js
// @updateURL https://update.greasyfork.org/scripts/31283/%22stylishInstall%22%20--%3E%20%22stylishInstallChrome%22.meta.js
// ==/UserScript==

function onInstall(ev) {
	var e = new CustomEvent("stylishInstallChrome");
	document.dispatchEvent(e);
}
document.addEventListener("stylishInstall", onInstall);