// ==UserScript==
// @name        Dislikeador Auto @PamelaM15 TARINGA
// @namespace   taringa.anpep.ga
// @description Creado por ClonClonado para todos los linces, lincesas y travas!
// @include     *://*.taringa.net/*
// @include     *://*.poringa.net/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17820/Dislikeador%20Auto%20%40PamelaM15%20TARINGA.user.js
// @updateURL https://update.greasyfork.org/scripts/17820/Dislikeador%20Auto%20%40PamelaM15%20TARINGA.meta.js
// ==/UserScript==

$(document).ready(function(){$('.addUnlike').each(function(){if($(this).attr('onclick').indexOf(27413753)!=-1){$(this).trigger('click');}});});