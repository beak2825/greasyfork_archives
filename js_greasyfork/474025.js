// ==UserScript==
// @name        FC-Filter
// @match       https://forocoches.com/foro/forumdisplay.php
// @grant       GM_log
// @version     0.1
// @author      SeñorN
// @description filtra terminos de la lista de posts de Forocoches
// @license MIT
// @namespace https://gitlab.com/SenorN/fc-filter/
// @downloadURL https://update.greasyfork.org/scripts/474025/FC-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/474025/FC-Filter.meta.js
// ==/UserScript==


// Escribir aqui los terminos a filtrar, no distingue mayusculas y minusculas
const FILTRO = ['rubiales', 'jenni hermoso', 'daniel sancho']



const descartes = [] //postprocesado de los filtros
const hilos = document.querySelectorAll('[id^="thread_title_"]') //lista de los encabezados de los hilos


//postprocesado de los filtros
FILTRO.forEach(function(palabra){
  descarte = palabra.toLowerCase()
  descartes.push(descarte)
})


hilos.forEach(function(hilo) {
  titulo = hilo.innerText.toLowerCase()

  descartes.forEach(function(descarte){

    if (titulo.includes(descarte)){

      //asegurarse de que el termino filtrado no se encuentra dentro de una palabra mas grande
      if (titulo.startsWith(descarte) || titulo.endsWith(descarte) || titulo.includes(' ' + descarte + ' ')){
        entrada = hilo.parentElement.parentElement.parentElement //seleccionar la fila entera

        entrada.style.display = 'none'
        GM_log('Ocultada la entrada "' + titulo + '".')
      }
    }
  })

});