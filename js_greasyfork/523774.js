// ==UserScript==
// @name			AniDB.net restricted icon
// @namespace		maralexbar
// @description		Show R18 emoji on Restricted Anime
// @match			http://anidb.net/*
// @match			https://anidb.net/*
// @grant			none
// @license MIT
// @version			1.0
// @downloadURL https://update.greasyfork.org/scripts/523774/AniDBnet%20restricted%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/523774/AniDBnet%20restricted%20icon.meta.js
// ==/UserScript==

/*
Primera version
*/
(function() {

const selector = "#layout-main" //Si se cargo la pagina completamente
const selector_list = "tr.restricted"; //Para las tablas en Lista, Busquedas o Creadores
const selector_chart = "div.restricted"; //Para Schedule y Season Chart

function main_list(){

const rows = document.querySelectorAll(selector_list); // Selecciona todas las filas tr con la clase restricted

rows.forEach(row => {
    if (row.hasAttribute('role')) {
        // Si el elemento tiene el atributo role="row" entonces es una pagina de creador (Seiyuu, Creditos etc)
        const link = row.querySelector('td.name.anime > a'); // Dentro de cada <tr> 'restricted', selecciona el <a> dentro de td.name.anime ya que "name" solo es Rol.
        if (link) {
    // Agrega el emoji 18 al final del texto del enlace
    link.textContent += ' 🔞';
  }
    } else { // Caso contrario es una pagina de Mylist o Busqueda
        const link = row.querySelector('td.name > a'); // Dentro de cada <tr> 'restricted', selecciona el <a> dentro de td.name
        if (link) {
    // Agrega el emoji 18 al final del texto del enlace
    link.textContent += ' 🔞';
  }
    }
});

}



function main_chart(){

const restrictedDivs = document.querySelectorAll(selector_chart);

restrictedDivs.forEach(div => {
  // Dentro de cada <div> 'restricted', selecciona el <a> dentro de la jerarquía especificada
  const link = div.querySelector('div.data div.wrap.name a.name-colored');

  if (link) {
    // Agrega el emoji 18 al final del texto del enlace
    link.textContent += ' 🔞';
  }
});



}

function waitForElement(query, callback) {
	console.log('Esperando...');
  const interval = setInterval(() => {
    const element = document.querySelector(query);
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 100); // Revisa cada 100 ms
}


waitForElement(selector, (element) => {
  // Espera a que se cargue el conetenedor principal
  console.log('Encontrado:', element.id);

  if (document.querySelector(selector_list)) { //Si es una pagina Creator, Mylist o Busqueda
  main_list();
  }
  if (document.querySelector(selector_chart)) { //Si es una pagina de Temporada o Calendario
  main_chart();
  }


});


})();