// ==UserScript==
// @name         Descargar Capítulos WebComic Gamma
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script para descargar capítulos de webcomicgamma.takeshobo.co.jp
// @author       TuNombre
// @license      MIT
// @match        *://webcomicgamma.takeshobo.co.jp/*
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524149/Descargar%20Cap%C3%ADtulos%20WebComic%20Gamma.user.js
// @updateURL https://update.greasyfork.org/scripts/524149/Descargar%20Cap%C3%ADtulos%20WebComic%20Gamma.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Aquí va el código para detectar y descargar las imágenes del capítulo
  var images = document.querySelectorAll('img[src]'); // Selecciona todas las imágenes en la página

  if (images.length > 0) {
    var zip = new JSZip(); // Necesitarás incluir la biblioteca JSZip para esta funcionalidad

    images.forEach(function(img, index) {
      fetch(img.src)
        .then(response => response.blob())
        .then(blob => {
          zip.file('imagen_' + index + '.jpg', blob);
        });
    });

    // Después de que todas las imágenes se hayan añadido al zip
    zip.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, "capitulo.zip"); // Aquí necesitarás la biblioteca FileSaver.js
      });
  }
})();