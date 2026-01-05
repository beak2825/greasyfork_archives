// ==UserScript==
// @name        Dislikeador Auto @-Kira-010 TARINGA
// @namespace   taringa.anpep.ga
// @description Creado por ClonClonado para todos los linces, lincesas y travas!
// @include     *://*.taringa.net/*
// @include     *://*.poringa.net/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17822/Dislikeador%20Auto%20%40-Kira-010%20TARINGA.user.js
// @updateURL https://update.greasyfork.org/scripts/17822/Dislikeador%20Auto%20%40-Kira-010%20TARINGA.meta.js
// ==/UserScript==

$(document).ready(function(){$('.addUnlike').each(function(){if($(this).attr('onclick').indexOf('26903238')!=-1){$(this).trigger('click');}});});