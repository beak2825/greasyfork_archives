// ==UserScript==
// @name          SourceForge - Download Enhancer: NO More Adv.CountDown
// @description   For download any file from project sub-tab "Files" filelist - just click right mouse button on it and choose "Save this link as..."
// @namespace     Ravlissimo
// @match         http*://sourceforge.net/*/files/*
// @match         https://sourceforge.net/*/files/*
// @icon          https://sourceforge.net/favicon.ico
// @version       1.5
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/490603/SourceForge%20-%20Download%20Enhancer%3A%20NO%20More%20AdvCountDown.user.js
// @updateURL https://update.greasyfork.org/scripts/490603/SourceForge%20-%20Download%20Enhancer%3A%20NO%20More%20AdvCountDown.meta.js
// ==/UserScript==

var href, links = document.querySelectorAll('a[href$="/download"]');

for (var i = 0, l = links.length; i < l; i++) {
    href = links[i].getAttribute("href").replace("sourceforge.net/projects/", "master.dl.sourceforge.net/project/").replace("/files/", "/").replace(/\/download$/, "?viasf=1");
    links[i].setAttribute("href", href);
}