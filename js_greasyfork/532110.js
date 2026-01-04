// ==UserScript==
// @name         Desafío Rápido en pantalla principal
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Módulo de desafío rápido simplificado para ManagerZone.
// @match        https://www.managerzone.com/?p=clubhouse
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @author       olavarriense4ever
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532110/Desaf%C3%ADo%20R%C3%A1pido%20en%20pantalla%20principal.user.js
// @updateURL https://update.greasyfork.org/scripts/532110/Desaf%C3%ADo%20R%C3%A1pido%20en%20pantalla%20principal.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Asegurarte que quickChallenge esté cargado:
  $.getScript("https://www.managerzone.com/js/challenges.js");

  function insertarModulo(htmlDesafio) {
    const nuevoModulo = document.createElement('div');
    nuevoModulo.className = 'flex-grow-1 box_dark';
    nuevoModulo.id = 'clubhouse-widget-quickchallenge';

    nuevoModulo.innerHTML = `
      <div class="widget-content clearfix">
        <i class="fa fa-arrows handle" aria-hidden="true"></i>
        <i class="fa fa-minus-square minimize-button make-room" aria-hidden="true"></i>
        <h3><i class="fa fa-futbol" aria-hidden="true"></i> Desafío Rápido</h3>
        <div class="widget-content-wrapper">
          ${htmlDesafio}
        </div>
      </div>
    `;

    const contenedorGeneral = document.querySelector('#clubhouse-widget-cups')?.parentElement?.parentElement;

    if (contenedorGeneral) {
      contenedorGeneral.insertBefore(nuevoModulo, contenedorGeneral.firstChild);
    } else {
      console.error('No se encontró el contenedor general para insertar el módulo.');
    }
  }

  function obtenerDesafioRapido() {
    fetch('https://www.managerzone.com/ajax.php?p=challenge&sub=quick-challenge-template&country=&division=&include-structure=0&sport=soccer')
      .then(response => response.json())
      .then(([htmlContent]) => {
        const tablaTemporal = document.createElement('table');
        tablaTemporal.innerHTML = htmlContent;

        const filas = Array.from(tablaTemporal.querySelectorAll('tr'));

        if (!filas.length) {
          insertarModulo('<p>⚠️ No hay equipos disponibles por el momento.</p>');
          return;
        }

        const filasSimplificadas = filas.map(fila => {
          const celdas = fila.querySelectorAll('td');
          return `
            <tr>
              <td>${celdas[0].querySelector('a').outerHTML}</td>
              <td>${celdas[1].querySelector('a').outerHTML}</td>
              <td>${celdas[2].innerText}</td>
              <td>${celdas[3].innerText}</td>
              <td>${celdas[4].innerHTML}</td>
            </tr>
          `;
        }).join('');

        const tablaFinal = `
          <table class="hitlist alternating shaded">
            <thead>
              <tr class="hitlist-th">
                <th>Manager</th>
                <th>Equipo</th>
                <th>País</th>
                <th>División</th>
                <th>Desafiar</th>
              </tr>
            </thead>
            <tbody>${filasSimplificadas}</tbody>
          </table>
        `;

        insertarModulo(tablaFinal);
      })
      .catch(err => insertarModulo(`<p>Error al cargar: ${err.message}</p>`));
  }

  window.addEventListener('load', obtenerDesafioRapido);

  document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (target && target.getAttribute('onclick')?.includes('quickChallenge.book')) {
      e.preventDefault();
      quickChallenge.book(target.href);
    }
  });
})();
