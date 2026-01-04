// ==UserScript==
// @name        OnePieceMangaYAnime Visualizador Mejorado
// @name:en     OnePieceMangaYAnime Enhanced Visualizer
// @namespace   Violentmonkey Scripts
// @match       https://www.onepiecemangayanime.com/mangaonline/Visualizador/capitulos.php
// @match       https://www.onepiecemangayanime.com/mangaonline/Visualizador/capitulosmovil.php
// @version     1.5.1
// @author      donkikote
// @description Algunas mejoras al estilo del visualizador para mejorar la lectura.
// @description:en Apply some style fixes for better experience reading in the manga reader.

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442808/OnePieceMangaYAnime%20Visualizador%20Mejorado.user.js
// @updateURL https://update.greasyfork.org/scripts/442808/OnePieceMangaYAnime%20Visualizador%20Mejorado.meta.js
// ==/UserScript==

var HORIZONTAL = 1
var VERTICAL = 2


var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var visorMode = urlParams.get('Modo')

var container = document.body.getElementsByTagName("div")[0];

if (visorMode == HORIZONTAL) {
  // Move the info in the top of the page to the bottom to avoid needing to scroll down each time
  var header = container.children[0];
  var controls = container.children[1];
  var containerDivs = container.getElementsByTagName("div");
  containerDivs[containerDivs.length-1].before(controls);
  containerDivs[containerDivs.length-1].before(header);
} else {
  // Add a little gap between images for better page readability
  var newstyle='img {margin-bottom: .3vh !important}';
  var style=document.createElement('style');
  style.type='text/css';
  if(style.styleSheet){
      style.styleSheet.cssText=newstyle
  }else{
      style.appendChild(document.createTextNode(newstyle));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
  
  // Add click to move to next image
  images = document.getElementsByTagName('img');
  images = [...images];
  images = images.filter(img => img.id.startsWith('Pagina_'));
  for (var i=0;i<images.length;i++) {
    image = images[i]
    // console.log(images[i]);
    var imgA = document.createElement("a");
    imgA.href="#Pagina_"+(i+1);
    image.parentNode.replaceChild(imgA, image);
    imgA.appendChild(image);
  }
  redirecciones = document.body.getElementsByClassName("redireccion");
  nextChap = redirecciones[1].getAttribute("data-redireccion")
  nextChapUrl = window.location.href.replace(/Capi=([^&]+)/i, "Capi="+nextChap).replace(/#.+/i,"")
  imgA.href = nextChapUrl;
}


