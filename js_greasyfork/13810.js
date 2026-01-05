// ==UserScript==
// @name        CPasbien Direct Download Link
// @namespace   CPasbien Direct Download Link
// @include     http://www.cpasbien.tld/*
// @description Direct download in search results for Cpasbien
// @description:fr Ajoute un lien direct vers le torrent depuis les résultats de recherche ou les suggestions sur Cpasbien
// @version     0.2
// @grant       GM_addStyle
// @require     http://code.jquery.com/jquery-latest.js
// @license     GPL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/13810/CPasbien%20Direct%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13810/CPasbien%20Direct%20Download%20Link.meta.js
// ==/UserScript==

(function () {
  var dl_base_url = window.location.protocol + '//' + window.location.host + '/telechargement/';
  var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsLETgSdq+2vgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACUSURBVDjL3ZKxCcNQDETvEg2RYTKDFwjGdQZI4E/wC/duzSeQ/dwaw6UyGOfbX2DS5DpJ3EPoBBwU94Yh2Z1kt+xJesdmus316egGfwBg5nA1gJ7kuWSW1HLj+kWIpDY205M7EW5CZrPnD74gS3MRsIaszW6FZHVIFvEL5WKsAFxcZnK0TPMB4OoBSBosFxGAl3eDD6abPSsQC/S3AAAAAElFTkSuQmCC';
  GM_addStyle('.titre { width: 540px !important;');
  GM_addStyle('.lien-torrent { display: block ; float: left; width: 35px; text-indent: 20px;}');
  GM_addStyle('.lien-torrent { background: transparent url("' + image + '") no-repeat scroll 0px 1px;');
  var lignes = $('[class^=\'ligne\']');
  lignes.each(function () {
    var lien = $(this).find('a').attr('href');
    lien = lien.split('/').pop();
    lien = lien.replace(/html$/i, 'torrent');
    lien = dl_base_url + lien;
    console.log('adding download link : ' + lien);
    $(this).prepend('<a class="lien-torrent" title="Téléchargement du Torrent: ' + lien + '" href="' + lien + '">TT</a>');
  }
  );
}) ();
