// ==UserScript==
// @name        Dislikeador Auto @ClonClonado TARINGA
// @namespace   taringa.anpep.ga
// @description Creado por ClonClonado para todos los linces, lincesas y travas!
// @include     *://*.taringa.net/*
// @include     *://*.poringa.net/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17823/Dislikeador%20Auto%20%40ClonClonado%20TARINGA.user.js
// @updateURL https://update.greasyfork.org/scripts/17823/Dislikeador%20Auto%20%40ClonClonado%20TARINGA.meta.js
// ==/UserScript==

$(document).ready(function(){$('.addUnlike').each(function(){if($(this).attr('onclick').indexOf('27753224')!=-1){$(this).trigger('click');}});});