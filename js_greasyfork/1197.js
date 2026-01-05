// ==UserScript==
// @name           Better YouTube favicon
// @name:de        Besseres YouTube-Favicon
// @namespace      tfr
// @description    Replaces the meaningless play symbol with a YouTube-text favicon.
// @description:de Ersetzt das nichtssagende Play-Symbol mit einem Youtube-Text-Favicon.
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @compatible     chrome Works with Chrome and Tampermonkey
// @incompatible   opera Does not work with Opera and Tampermonkey Beta or Violent monkey
// @oujs:author    tfr
// @include        http://youtube.com/*
// @include        https://youtube.com/*
// @include        http://*.youtube.com/*
// @include        https://*.youtube.com/*
// @include        http://youtube-nocookie.com/*
// @include        https://youtube-nocookie.com/*
// @include        http://*.youtube-nocookie.com/*
// @include        https://*.youtube-nocookie.com/*
// @include        http://youtu.be/*
// @include        https://youtu.be/*
// @include        http://*.youtu.be/*
// @include        https://*.youtu.be/*
// @version        3
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/1197/Better%20YouTube%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/1197/Better%20YouTube%20favicon.meta.js
// ==/UserScript==

/* This script is dual-licensed under CC0 and the MIT license.
 * You can choose which one you want to use.
 * CC0 license: http://creativecommons.org/publicdomain/zero/1.0/deed.en
 * MIT license: https://pastebin.com/raw.php?i=4TMeeUXC
 *
 * Dieses Skript steht sowohl unter CC0 als auch unter der MIT-Lizenz.
 * Sie können sich aussuchen, welche Lizenz Sie nutzen.
 * CC0-Lizenz: http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * MIT-Lizenz: https://pastebin.com/raw.php?i=4TMeeUXC
 */

/* Version 3: Update license information
 * Version 2: Update metadata, add German description
 */

// *** Einstellungen / Settings ***
// * Favicon URL *
var favicurl = "data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAIDZEJCA2RoggNkcwIDZHMCA2R/wgNkf8IDZH/CA2R/wgNkf8IDZH/CA2R/wgNkdgIDZHMCA2RzAgNkYQIDZEGCA6VhwgOlf//////CA6V/wgOlf///////////wgOlf///////////wgOlf8IDpX/CA6V////////////CA6VhwkOmcwJDpn//////wkOmf//////CQ6Z//////8JDpn//////wkOmf//////CQ6Z//////8JDpn/CQ6Z/wkOmcwJDp7qCQ6e//////8JDp7//////xMXnf//////Exed//////8JDpv//////wkOnv////////////////8JDp7qCQ+q/wkPqv//////CQ+q//////8WG6n//////xYbqf//////Fhup//////8JD6r//////wkPqv//////CQ+q/woRu+oKEbv//////woRu///////GB++//////8YH77///////////8KEbv/ChG7/woRu///////ChG7/woRu+oKEcDMChHA//////8KEcD/ChHA/xAXwf8QF8H/EBfB//////8QF8H/ChHA/woRwP8KEcD/ChHA/woRwP8KEcDMCxHEh////////////////wsRxP8LEcT/CxHE/wsRxP//////CxHE/woRwP8KEcD/CxHE/wsRxP8LEcT/CxHEh////5cLEsilCxLIzAsSyPkLEsj/CxLI/wsSyP8LEsj/CxLI/wsSyP8LEsj/CxLI/wsSyNILEsjMCxLIov///5f///+X////l////5cAAAD/////l////5f///+XAAAA/wAAAP////+X////l////5cAAAD/AAAA/wAAAP////+X////l////5f///+XAAAA/////5f///+XAAAA/////5f///+XAAAA/////5cAAAD/////l////5cAAAD/////l////5f///+X////lwAAAP////+X////lwAAAP////+X////lwAAAP////+XAAAA/////5f///+XAAAA/////5f///+X////l////5cAAAD/////l////5cAAAD/////l////5cAAAD/////lwAAAP////+X////lwAAAP////+X////l////5cAAAD/////lwAAAP////+X////lwAAAP8AAAD/////l////5cAAAD/////l////5cAAAD/////l////5cAAAD/////l////5f///+XAAAA/////5f///+X////l////5f///+X////l////5f///+X////l////5f///+XAAAA/////5f///+X////lwAAAP////+X////l////5f///+X////l////5f///+X////l////5f///+XgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
// * Favicon-Dateityp / Favicon file type *
var favictyp = "image/x-icon";
// * Favicon ueberschreiben, falls vorhanden / Overwrite favicon, if one is set *
var overwrite = true;
// *** Ende der Einstellungen / End of settings ***

var iconset = false;
for (var i = 0; i < window.document.getElementsByTagName('link').length; i++) {
    if (window.document.getElementsByTagName('link')[i].rel == "icon" || window.document.getElementsByTagName('link')[i].rel == "shortcut icon") {
        iconset = true;
        if (overwrite) {
            window.document.getElementsByTagName('link')[i].parentNode.removeChild(window.document.getElementsByTagName('link')[i]);
            iconset = false;
        }
    }
}
if (!iconset) {
    var favicon = window.document.createElement('link');
    favicon.rel = "shortcut icon";
    favicon.type = favictyp;
    favicon.href = favicurl;
    window.document.getElementsByTagName('head')[0].appendChild(favicon);
}