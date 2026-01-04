// ==UserScript==
// @name         PyPI package name and version fetcher
// @version      1
// @namespace    https://coopdevs.coop
// @license AGPL-3
// @description  Fetches all the package names displayed in a PyPI search along with their last version and copies it to clipboard. Crafted for copy all OCA metapackages when searching for "odoo14-addons-oca"
// @description:es-ES Busca todos los nombres de paquetes que se muestran en una búsqueda de PyPI junto con su última versión y los copia al portapapeles. Hecho para copiar todos los metapaquetes OCA al buscar "odoo14-addons-oca"
// @description:en-US Fetches all the package names displayed in a PyPI search along with their last version and copies it to clipboard. Crafted for copy all OCA metapackages when searching for "odoo14-addons-oca"
// @description:pt-BR Busca todos os nomes de pacotes exibidos em uma pesquisa do PyPI, juntamente com sua última versão e os copia para a área de transferência. Feito para copiar todos os metapacotes OCA ao pesquisar por "odoo14-addons-oca"
// @description:fr-FR Recherche tous les noms de paquets affichés dans une recherche PyPI ainsi que leur dernière version et les copie dans le presse-papiers. Fabriqué pour copier tous les méta-paquets OCA lors de la recherche de "odoo14-addons-oca"
// @description:ru-RU Ищет все имена пакетов, отображаемые в поиске PyPI, а также их последнюю версию, и копирует их в буфер обмена. Сделано для копирования всех метапакетов OCA при поиске «odoo14-addons-oca»
// @author       laicoop
// @match        https://pypi.org/search/*
// @downloadURL https://update.greasyfork.org/scripts/460975/PyPI%20package%20name%20and%20version%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/460975/PyPI%20package%20name%20and%20version%20fetcher.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(function() {
    
  'use strict';

  let currentPage = 1;
  let maxPages = 1;

function addButton() {
    console.log("Button added");
    const button = document.createElement('div');
    button.className = 'projects';
    button.style = 'text-align: center; border-radius: 5px;';
    button.style.width = '30px';
    button.style.height = '30px';
    button.title = 'Click to copy version and name from all packages to clipboard';
    button.innerHTML = '📥';
    button.addEventListener('click', fetchAllPackages);

    const container = document.querySelector('.search-form');
    container.appendChild(button);
  }

  async function fetchAllPackages() {
    console.log(`Fetching all packages, currently on page ${currentPage}`);
    await fetchPackages();
  }

  async function fetchPackages() {
    const foundPackagesElement = document.querySelector(".split-layout--table > div:nth-child(1) > p:nth-child(1) > strong:nth-child(1)");
    const foundPackages = parseInt(foundPackagesElement.innerText.replace(",", ""));
    const versioned_pkgs = [];
    console.log("fetchPackages...");
    console.log(`Found pagination with ${maxPages} pages`);
    // Loop through each page and get the package names and versions
    for (let cpage = 1; cpage <= maxPages; cpage++) {
      console.log(`Fetching page ${cpage}...`);
      const url = `${window.location.href}&page=${cpage}`;
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pkgs = doc.querySelectorAll('.package-snippet__title');
      pkgs.forEach((currentValue, currentIndex, listObj) => {
        versioned_pkgs.push(pkgs[`${currentIndex}`].querySelector('.package-snippet__name').innerHTML + "==" + pkgs[`${currentIndex}`].querySelector('.package-snippet__version').innerHTML);
      });
    }

    // Copy the package names and versions to the clipboard
    const packageList = versioned_pkgs.join('\n');

    console.log(`Copied ${versioned_pkgs.length} of ${foundPackages}`);
    if (versioned_pkgs.length < foundPackages) {
      alert(`Not all packages copied (${versioned_pkgs.length}/${foundPackages}). Try again.`)
    }

    navigator.clipboard.writeText(packageList)
        .then(() => console.log('Package names and versions copied to clipboard'))
        .catch(error => console.error(`Error copying package names and versions to clipboard: ${error}`));
    alert(` ${versioned_pkgs.length} packages copied. Paste it in your requirements.txt file`)
  }
  function init() {
      console.log('Initializing script');
      const pagination = document.querySelector('.button-group--pagination');
      if (pagination) {
        const buttons = pagination.querySelectorAll('.button-group__button');
        buttons.forEach(button => {
          const text = button.textContent.trim();
          const page = parseInt(text, 10);
          if (!isNaN(page) && page > maxPages) {
            maxPages = page;
          }
        });
        console.log(`Found pagination with ${maxPages} pages`);
      } else {
        console.log('No pagination found, defaulting to first page');
      }
      addButton();

      const savedCurrentPage = GM_getValue('currentPage', 1);
      if (savedCurrentPage > 1) {
        console.log(`Restoring saved current page: ${savedCurrentPage}`);
        currentPage = savedCurrentPage;
      }
    }

  init();
})();