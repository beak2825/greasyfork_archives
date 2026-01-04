// ==UserScript==
// @name         Pastebin Unblocker - Pastebin Link Açıcı
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  pastebin.com sitesine girildiğinde pastebinp.com sitesine otomatik yönlendirir ve orijinal linki gösterir. // Redirects pastebin.com to pastebinp.com and shows the original link.
// @match        *://pastebin.com/*
// @match        *://pastebinp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502262/Pastebin%20Unblocker%20-%20Pastebin%20Link%20A%C3%A7%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/502262/Pastebin%20Unblocker%20-%20Pastebin%20Link%20A%C3%A7%C4%B1c%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Orijinal linki sakla // Store the original link
    var originalLink = window.location.href;

    // pastebin.com sitesine girildiğinde yönlendir // Redirect from pastebin.com
    if (window.location.host === 'pastebin.com') {
        var newUrl = originalLink.replace('pastebin.com', 'pastebinp.com');
        window.location.href = newUrl;
    }

    // pastebinp.com sitesinde orijinal linki göster // Show original link on pastebinp.com
    if (window.location.host === 'pastebinp.com') {
        var linkContainer = document.createElement('div');
        linkContainer.style.position = 'fixed';
        linkContainer.style.top = '10px';
        linkContainer.style.right = '10px';
        linkContainer.style.backgroundColor = 'white';
        linkContainer.style.color = 'green';
        linkContainer.style.padding = '5px';
        linkContainer.style.border = '1px solid green';
        linkContainer.style.zIndex = '1000';
        linkContainer.style.fontFamily = 'Arial, sans-serif';
        linkContainer.style.fontSize = '12px';

        // Orijinal linki göstermek için değiştir // Modify to show the original link
        var originalLinkText = originalLink.replace('pastebinp.com', 'pastebin.com');
        var linkText = document.createElement('span');
        linkText.textContent = 'Orijinal: ' + originalLinkText;

        linkContainer.appendChild(linkText);
        document.body.appendChild(linkContainer);
    }
})();
