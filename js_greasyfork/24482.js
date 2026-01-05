// ==UserScript==
// @name        Concurso
// @namespace   HLN
// @include     http://www.harrylatino.org/*
// @version     1
// @grant       none
// @description:en adasd
// @description adasd
// @downloadURL https://update.greasyfork.org/scripts/24482/Concurso.user.js
// @updateURL https://update.greasyfork.org/scripts/24482/Concurso.meta.js
// ==/UserScript==

var Imagen = 'i711.photobucket.com/albums/ww117/Periodicomortis/RolBosque';
var iDom = document.getElementById("content");
var iDom = iDom.innerHTML;
if(iDom.indexOf(Imagen) > -1)
{
  alert('¡Aquí está la imagen!');
}