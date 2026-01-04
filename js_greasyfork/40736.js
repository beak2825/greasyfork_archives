// ==UserScript==
// @name         Folger Downloader
// @version      0.1
// @description  Download full resolution images from Folger's LUNA system without permission.
// @author       tacolizard
// @grant        none
// @include      https://luna.folger.edu/luna/servlet/detail/*
// @namespace https://greasyfork.org/users/180426
// @downloadURL https://update.greasyfork.org/scripts/40736/Folger%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/40736/Folger%20Downloader.meta.js
// ==/UserScript==

function exportFullRes() {
    var mw = imageInfo.maxWidth;
    var mh = imageInfo.maxHeight;
    var baseUrl = imageInfo.urlSource;
    var imgWindow = window.open(baseUrl+'&width='+mw+'&height='+mh);
}

var fullContent = document.createElement('a');
fullContent.textContent = 'Export full res';
var exportElm = document.getElementById('ExportButton');
exportElm.parentNode.insertBefore(fullContent, exportElm);
fullContent.addEventListener('click', exportFullRes, true);