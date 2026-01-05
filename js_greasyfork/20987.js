// ==UserScript==
// @name        KAT - Friend Likes Remover
// @namespace   pxgamer
// @description Torrent Friend Likes Remover
// @include     *kat.cr/*
// @version     1.2
// @grant       none
// @author      pxgamer (original idea by Keka_Umans)
// @downloadURL https://update.greasyfork.org/scripts/20987/KAT%20-%20Friend%20Likes%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/20987/KAT%20-%20Friend%20Likes%20Remover.meta.js
// ==/UserScript==

$(function(){
  $(".ajaxAlert").each(function(){
    if ($(this).find('img[src="/content/images/apple-touch-icon.png"]').length == 1) { $(this).remove(); }
  });
});
