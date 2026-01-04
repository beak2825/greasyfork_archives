// ==UserScript==
// @name         ReverseSearch & EXIF
// @namespace    voxed.bot
// @version      3.0
// @description  Buscar por imagen y EXIF.
// @author       Hhaz
// @match        http*://*.voxed.net/*
// @downloadURL https://update.greasyfork.org/scripts/37069/ReverseSearch%20%20EXIF.user.js
// @updateURL https://update.greasyfork.org/scripts/37069/ReverseSearch%20%20EXIF.meta.js
// ==/UserScript==

var exifURL = "http://metapicz.com/#landing?imgsrc=";
var href = $('.vox-single .vox-view .content .image a').attr('href');

$('.vox-single .vox-view .meta').prepend('<span class="report"><a href="#" target="_blank" class="exif" title="Metadatos"><i class="icon-link"></i> <span class="hide-for-small-only">EXIF</span></a></span>');
$(".exif").attr("href", exifURL+"http://www.voxed.net/"+href);

var search = "https://www.google.com/searchbyimage?image_url=";
var value = $('.vox-single .vox-view .content .image a').attr('href');

$('.vox-single .vox-view .meta').prepend('<span class="report"><a href="#" target="_blank" class="search" title="Buscar en Google Imágenes"><i class="icon-link"></i> <span class="hide-for-small-only">Buscar</span></a></span>');
$(".search").attr("href", search+"http://www.voxed.net/"+value);