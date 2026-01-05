// ==UserScript==
// @name           HTML5 player for Público TV
// @name:es        Reproductor HTML5 para Público TV
// @description    No ads, easily download videos and shows.
// @description:es Sin anuncios, descarga fácilmente los vídeos.
// @namespace      https://greasyfork.org/users/4813-swyter
// @include        http://especiales.publico.es/publico-tv/*
// @version        2016.05.12
// @icon           https://i.imgur.com/PQgnzT4.jpg
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/19574/HTML5%20player%20for%20P%C3%BAblico%20TV.user.js
// @updateURL https://update.greasyfork.org/scripts/19574/HTML5%20player%20for%20P%C3%BAblico%20TV.meta.js
// ==/UserScript==

window.OVERON_Player = window.OVERON_Player || {};

/* override the flash video function and call it a day */
Object.defineProperty(window.OVERON_Player, 'init',
{
  configurable: false,
  writable: false,
  value: function(options)
  {
    console.info("check overriden! video arguments =>", arguments);

    v = document.createElement("video");

    v.width = options.width;
    v.height = options.height;
    v.src = ((t=document.createElement("textarea")).innerHTML = options.stream) && t.textContent;
    v.style = "display: block !important;";

    v.poster = options.preview_load;
    v.controls = 'true';

    /* replace the old SWF Flash object with it, voilà */
    elem = document.getElementById(options.container)
    elem.parentNode.replaceChild(v, elem);

    console.log("video replaced =>", v, elem);
  }
});

/* wait until the page is ready for the code snipped to run */
document.addEventListener('DOMContentLoaded', function()
{
  /* remove random crap */
  filters =
  [
    ".robapaginas",
    ".share",
    ".ads",
  ];

  for (var cur in (junk=document.querySelectorAll(filters.join(', '))))
  {
    if(typeof junk[cur] !== 'object')
      continue;

    console.log("Removed junk element: " + junk[cur]);
    junk[cur].parentElement.removeChild(junk[cur]);
  }
});