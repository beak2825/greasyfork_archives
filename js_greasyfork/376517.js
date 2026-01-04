// ==UserScript==
// @name     Portal Roms Instant Downloader
// @version  1
// @grant    none
// @description  No Wait Times For Portal Roms.
// @include      http://www.portalroms.com/*
// @namespace https://greasyfork.org/users/238445
// @downloadURL https://update.greasyfork.org/scripts/376517/Portal%20Roms%20Instant%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/376517/Portal%20Roms%20Instant%20Downloader.meta.js
// ==/UserScript==

var DownloadLink = "http://www.portalroms.com/torrents/"

var ConsoleNameClass = document.getElementsByClassName("field field-name-field-plataforma field-type-taxonomy-term-reference field-label-inline clearfix")[0].innerText;
var ConsoleName = ConsoleNameClass.replace("System:", "").trim().toLowerCase().replace(/ /g,'');
var GameNameClass = document.getElementsByClassName("field field-name-field-release field-type-text field-label-inline clearfix")[0].innerText;
var GameName = GameNameClass.replace("Release:", "").trim();
DownloadLink = DownloadLink+ConsoleName+"/"+GameName+".torrent";
document.getElementsByClassName("field field-name-field-link-para-download field-type-link-field field-label-inline clearfix")[0].innerHTML = "<div class=\"field-label\">Download link:&nbsp;</div><div class=\"field-items\"><div class=\"field-item even\"><a href="+encodeURI(DownloadLink)+" title=\"DOWNLOAD!\">DOWNLOAD! (USA)</a></div></div>";