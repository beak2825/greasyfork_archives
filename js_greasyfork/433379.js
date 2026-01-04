// ==UserScript==
// @name         Filmin Filmaffinity links
// @namespace    https://github.com/antoniocambados
// @version      0.3.1
// @description  Adds Filmaffinity links to movie titles
// @author       Antonio Cambados
// @match        *://*.filmin.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=filmin.es
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/433379/Filmin%20Filmaffinity%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/433379/Filmin%20Filmaffinity%20links.meta.js
// ==/UserScript==

// Instrucciones de instalación:
// 1. Instalar Tampermonkey: https://www.tampermonkey.net/
// 2. Instalar este script
//   a. Usando GitHub
//     1. Acceder a la URL de este gist (https://gist.github.com/antoniocambados/dda0aa4ba7d952347bb9bb85a1863594) y darle al botón "raw"
//     2. Debería aparecer tampermonkey con la pantalla para aceptar la instalación del script
//   b. Usando Greasey Fork
//     1. Acceder a la URL del script (https://greasyfork.org/es/scripts/433379-filmin-filmaffinity-links?locale_override=1) y seguir las instrucciones
// ---
//
// Installation instructions:
// 1. Install Tampermonkey: https://www.tampermonkey.net/
// 2. Install this script
//   a. Using GitHub
//     1. Go to this gist's URL (https://gist.github.com/antoniocambados/dda0aa4ba7d952347bb9bb85a1863594) and click the "raw" button
//     2. A Tampermonkey page with installation confirmation should appear
//   b. Using Greasey Fork
//     1. Go to this script's URL (https://greasyfork.org/es/scripts/433379-filmin-filmaffinity-links?locale_override=1) and follow instructions

/*jshint esversion: 6*/
(function () {
  'use strict';

  // Objeto WeakSet para almacenar los elementos ya procesados.
  const processedElements = new WeakSet();

  /**
   * Inserta en el head los estilos CSS necesarios para el botón.
   */
  const insertStyles = () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    const styles = `
      .fa-button {
          position: relative;
          z-index: 1000;
          display: flex !important;
          justify-content: center;
          align-items: center;
          background-color: #006ECA;
          color: #FDCC1A;
          padding: 0px 1.5ch;
          margin-right: 0.25rem;
          margin-left: 0.25rem;
          margin-bottom: 0.25rem;
          pointer-events: all;
          font-size: 0.75rem;
          line-height: 1;
          width: 4ch;
          height: 2rem !important;
          border-radius: .25rem;
          box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);
          transition: all 0.3s;
          text-decoration: none;
      }
      .fa-button:hover,
      .fa-button:active,
      .fa-button:focus {
          background-color: #0f93f2;
          color: #ffffff;
          text-decoration: none;
      }
      .fa-button.inline {
          display: inline-flex !important;
          margin: 0 0.25rem 0 0;
          padding: 0.65rem 1rem;
          font-size: 0.75em;
          width: 3ch;
          height: 1.5em !important;
      }
      @media (min-width: 992px) {
          .card-image[data-unveil] .fa-button {
              display: none !important;
          }
      }
    `;
    style.appendChild(document.createTextNode(styles));
    document.head.appendChild(style);
  };

  /**
   * Construye la URL de búsqueda en Filmaffinity.
   * @param {string} search - Texto de búsqueda.
   * @param {string} [type='all'] - Tipo de búsqueda.
   * @returns {string} URL construida.
   */
  const makeUrl = (search, type = 'all') => `https://www.filmaffinity.com/es/search.php?stext=${encodeURIComponent(search)}&stype=${type}`;

  /**
   * Crea el elemento icono (span) con el texto "FA".
   * @returns {HTMLElement} El icono.
   */
  const createIcon = () => {
    const icon = document.createElement('span');
    icon.textContent = 'FA';
    return icon;
  };

  /**
   * Crea un enlace (<a>) con la URL y clases especificadas.
   * @param {string} url - URL del enlace.
   * @param {string} [extraClasses=''] - Clases adicionales.
   * @returns {HTMLElement} El elemento enlace.
   */
  const createLink = (url, extraClasses = '') => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.className = `fa-button ${extraClasses}`.trim();
    // Evita la propagación del evento click si el enlace está dentro de otro enlace.
    link.addEventListener('click', (event) => event.stopPropagation());
    return link;
  };

  /**
   * Determina si el elemento está dentro de un contenedor cuyo atributo class contiene "hero".
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  const isInHero = (element) => !!element.closest("[class*='hero']");

  /**
   * Determina si el elemento está dentro de un contenedor con la clase .MediaHoverCard.
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  const isInMediaHoverCard = (element) => !!element.closest('.MediaHoverCard');

  /**
   * Procesa y añade botones a los elementos aún no procesados.
   */
  const processElements = () => {
    // Selecciona los elementos sin excluir ninguno.
    const titles = document.querySelectorAll(`h1[itemprop=name], h1.display-1, h2.display-1, .card .info-title, .MediaHoverCard__summary__title`);
    const cards = document.querySelectorAll(`.card`);
    const posters = document.querySelectorAll(`[data-track-property-content-id="media_poster"], [data-track-property-content-id="media_card"]`);
    const directors = document.querySelectorAll(`[href^="/director"]`);
    const actors = document.querySelectorAll(`[href^="/actor"], [href^="/actriz"]`);
    const players = document.querySelectorAll(`.jwc-title-primary`);

    titles.forEach((titleEl) => {
      if (processedElements.has(titleEl)) return;
      const text = titleEl.textContent.trim();
      const url = makeUrl(text, 'title');
      const extraClass =
        isInHero(titleEl) || isInMediaHoverCard(titleEl) ? 'inline' : '';
      const link = createLink(url, extraClass);
      link.appendChild(createIcon());
      titleEl.prepend(link);
      processedElements.add(titleEl);
    });

    cards.forEach((card) => {
      if (processedElements.has(card)) return;
      const toolbar = card.querySelector('.card-options-controls');
      const titleEl = card.querySelector('.info-title');
      if (!titleEl || !toolbar) return;
      const url = makeUrl(titleEl.textContent.trim(), 'title');
      const link = createLink(url);
      link.appendChild(createIcon());
      toolbar.append(link);
      processedElements.add(card);
    });

    posters.forEach((poster) => {
      if (processedElements.has(poster)) return;
      const title = poster.getAttribute('data-track-property-media-title').trim();
      const url = makeUrl(title, 'title');
      const link = createLink(url);
      link.appendChild(createIcon());
      poster.append(link);
      processedElements.add(poster);
    });

    players.forEach((player) => {
      if (processedElements.has(player)) return;
      const text = player.textContent.trim();
      const url = makeUrl(text, 'title');
      const link = createLink(url, 'inline');
      link.appendChild(createIcon());
      player.prepend(link);
      processedElements.add(player);
    });

    directors.forEach((item) => {
      if (processedElements.has(item)) return;
      const name = item.textContent.trim();
      const url = makeUrl(name, 'director');
      const link = createLink(url, 'inline');
      link.appendChild(createIcon());
      item.insertAdjacentElement('beforebegin', link);
      processedElements.add(item);
    });

    actors.forEach((item) => {
      if (processedElements.has(item)) return;
      const name = item.textContent.trim();
      const url = makeUrl(name, 'cast');
      const link = createLink(url, 'inline');
      link.appendChild(createIcon());
      item.insertAdjacentElement('beforebegin', link);
      processedElements.add(item);
    });
  };

  // Inserta los estilos y procesa los elementos existentes.
  insertStyles();
  processElements();

  // Se configura un MutationObserver para detectar cambios en el DOM y procesar nuevos elementos.
  const observer = new MutationObserver(() => {
    processElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();