// ==UserScript==
// @name        Beelody - Free Music
// @name:en     Beelody - Free Music.
// @name:fr     Beelody - Musique Gratuite
// @namespace   Add Redirect Button
// @match       https://*.beelody.com/*
// @license     MIT
// @grant       none
// @version     3.4.2
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=boiskarine59960@gmail.com&item_name=Greasy+Fork+donation
// @author      TrouveMe
// @description This script was created to access free music (without a paid subscription) by directly linking to the source.
// @description:en This script was created to access free music (without a paid subscription) by directly linking to the source
// @description:fr Ce script a été créé pour accéder à de la musique gratuite (sans abonnement payant) en la liant directement à la source.
// @downloadURL https://update.greasyfork.org/scripts/478892/Beelody%20-%20Musique%20Gratuite.user.js
// @updateURL https://update.greasyfork.org/scripts/478892/Beelody%20-%20Musique%20Gratuite.meta.js
// ==/UserScript==

(function () {
  function redirectToSource() {
    const playerElement = document.querySelector('#aramplayer .audioplayer-audios li');

    if (playerElement) {
      const src = playerElement.dataset.src;
      const lastIndex = src.lastIndexOf('/');
      const cleanResult = src.substring(0, lastIndex).replace(/"/g, '');
      return cleanResult;
    } else {
      console.error("Player element not found.");
      return null;
    }
  }

  const result = redirectToSource();

  if (result) {
    location.href = result;
    console.log(result);
  }

  function getDataSortValue(tdElement) {
    const link = tdElement.querySelector('a');
    return link ? link.getAttribute('href') : null;
  }

  function getTitleValueElement(element) {
    return element.getAttribute('data-sort');
  }

  function getAlbumNameFromUrl(url) {
  const urlSegments = url.split('/');

  // Vérifier si la longueur des segments est suffisante pour une page d'album
  if (urlSegments.length >= 8) {
    const albumNameSegment = urlSegments[urlSegments.length - 2]; // Récupérer l'avant-dernier segment de l'URL
    const decodedAlbumName = decodeURIComponent(albumNameSegment);
    return decodedAlbumName;
  } else {
    // Si la longueur des segments est inférieure, cela peut être une page d'index
    return null;
  }
}

  const tdElements = document.querySelectorAll('td[data-sort]');


tdElements.forEach((td, index) => {
  // Vérifier si l'élément est un dossier
  const isFolder = td.querySelector('img.icon[src="/_autoindex/assets/icons/folder-fill.svg"]');

  if (!isFolder) {
    const audioURL = getDataSortValue(td);
    const titleUrl = getTitleValueElement(td); // Correction : le nom de la variable commencera par une minuscule

    if (audioURL && titleUrl) {
      const albumName = getAlbumNameFromUrl(audioURL);

      if (albumName) {
        // Si c'est une page d'album
        const audioHTML = `<label for="audio">${titleUrl} - ${albumName}</label><audio controls><source src="${audioURL}" type="audio/mp3"></audio><style>label{font-family: "Roboto", sans-serif;font-weight: bold;}audio {padding: 4%;font-family: "Roboto", sans-serif;}</style>`;
        td.innerHTML = audioHTML;
      } else {
        // Si c'est une page d'index
        const audioHTML = `<label for="audio">${titleUrl}</label><audio controls><source src="${audioURL}" type="audio/mp3"></audio><style>label{font-family: "Roboto", sans-serif;font-weight: bold;}audio {padding: 4%;font-family: "Roboto", sans-serif;}</style>`;
        td.innerHTML = audioHTML;
      }
    }
  }
});
})();
