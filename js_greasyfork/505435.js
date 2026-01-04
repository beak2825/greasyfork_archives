// ==UserScript==
// @name         EGAFD / BGAFD Show Actress Gallery in the infos page (IA)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Ajoute un bouton pour afficher la galerie d'images en iframe
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.egafd.com.ico
// @match        https://www.egafd.com/actresses/details.php/*
// @match        https://www.egafd.com/actresses/details.php/id/*
// @match        https://www.bgafd.co.uk/actresses/details.php/*
// @match        https://www.bgafd.co.uk/actresses/details.php/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505435/EGAFD%20%20BGAFD%20Show%20Actress%20Gallery%20in%20the%20infos%20page%20%28IA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505435/EGAFD%20%20BGAFD%20Show%20Actress%20Gallery%20in%20the%20infos%20page%20%28IA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Ajouter la déclaration de type de document
  document.documentElement.innerHTML = '<!DOCTYPE html>' + document.documentElement.innerHTML;

  // Sélecteur CSS du lien
  const linkSelector = 'a[href^="/actresses/gallery.php/"]';

  // Fonction pour créer l'iframe
  function createIframe(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.frameBorder = 0;
    iframe.style.height = '90vh';
    iframe.style.width = '85%';
    iframe.style.position = 'fixed';
    iframe.style.top = '2vh';
    iframe.style.right = '0%';
    iframe.style.background = '#111';
    iframe.style.border = '1px solid red';
    iframe.style.display = 'none';
    iframe.style.opacity = '0';
    return iframe;
  }

  // Fonction pour afficher l'iframe
  function showIframe(url, button) {
    let iframe = document.querySelector('iframe');
    if (!iframe) {
      iframe = createIframe(url);
      document.body.appendChild(iframe);
    }
    iframe.src = url;
    iframe.style.display = 'block';
    iframe.style.opacity = '1';
    button.style.display = 'none';

    // Ajouter le bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fermer galerie';
    closeButton.classList.add('close-button');
    closeButton.style.marginTop = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.background = '#FF0000';
    closeButton.style.color = 'white';
    closeButton.addEventListener('click', () => {
      iframe.style.display = 'none';
      iframe.style.opacity = '0';
      button.style.display = 'block';
      closeButton.remove();
    });
    button.parentNode.insertBefore(closeButton, button.nextSibling);
  }

  // Ajouter le bouton après le lien
  const links = document.querySelectorAll(linkSelector);
  links.forEach(link => {
    const button = document.createElement('button');
    button.textContent = 'Afficher la galerie';
    button.classList.add('gallery-button');
    button.style.marginTop = '10px';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
      showIframe(link.href, button);
    });
    link.parentNode.insertBefore(button, link.nextSibling);
  });

  // Style du bouton
  const style = document.createElement('style');
  style.textContent = `
    .gallery-button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
    .close-button {
      background-color: #FF0000;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
})();
