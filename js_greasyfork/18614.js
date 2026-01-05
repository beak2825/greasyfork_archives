// ==UserScript==
// @name         Planetemu.net - Show ROM ID at links to ROM pages
// @author       Denilson Sá 
// @namespace    http://denilson.sa.nom.br/
// @version      1.1
// @description  Parses all links and shows ROM ID before the link text, for all links to ROM description pages.
// @grant        none
// @license      Public domain
// @include http://www.planetemu.net/*
// @include http://planetemu.net/*
// @include https://www.planetemu.net/*
// @include https://planetemu.net/*
// @downloadURL https://update.greasyfork.org/scripts/18614/Planetemunet%20-%20Show%20ROM%20ID%20at%20links%20to%20ROM%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/18614/Planetemunet%20-%20Show%20ROM%20ID%20at%20links%20to%20ROM%20pages.meta.js
// ==/UserScript==

Array.prototype.forEach.call(
    document.getElementsByTagName('a'),
    function (link) {
        if (link.textContent.trim() != '') {
            var url = link.getAttribute('href');
            var match = url.match(/action=showrom&id=([0-9]+)/);
            if (match) {
                var text = document.createTextNode('[' + match[1] + '] ');
                link.parentNode.insertBefore(text, link);
            }
        }
    }
);