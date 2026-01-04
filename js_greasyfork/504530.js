// ==UserScript==
// @name          XHamster - Links Utility - DESI + FAVS + BLOG  links Cleaner [IA] v.1 [NEW COM En Cours]
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Modifie les liens de vidéos pour pointer vers la page de l'utilisateur
// @icon            https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @author       Vous
// @match        https://xhamster.com/videos/*
// @match        https://xhamster.com/posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504530/XHamster%20-%20Links%20Utility%20-%20DESI%20%2B%20FAVS%20%2B%20BLOG%20%20links%20Cleaner%20%5BIA%5D%20v1%20%5BNEW%20COM%20En%20Cours%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/504530/XHamster%20-%20Links%20Utility%20-%20DESI%20%2B%20FAVS%20%2B%20BLOG%20%20links%20Cleaner%20%5BIA%5D%20v1%20%5BNEW%20COM%20En%20Cours%5D.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // XHamster - IA - Links Utility 01 - Desi et others v.4 (need 2 clicks)

  // Ajouter la font Font Awesome
  var fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
  document.head.appendChild(fontAwesome);

  // Fonction pour modifier les liens de vidéos
  function modifyVideoLinks() {
    // Sélectionner les liens de vidéos
    var videoLinks = document.querySelectorAll('.video-page .width-wrap .comments-section.comments-container #commentBox [class^="commentsList-"] [class^="commentItem-"] a.link-inner[href^="https://"][href*="/videos/"]:not([href*="/my/favorites/videos/"])');

    // Boucler sur les liens de vidéos
    videoLinks.forEach(function(videoLink) {
      // Vérifier si le bouton existe déjà
      if (!videoLink.parentNode.querySelector('button')) {
        // Créer un bouton pour modifier le lien
        var modifyButton = document.createElement('button');
        modifyButton.innerHTML = '<i class="fas fa-edit"></i>';
        modifyButton.style.background = 'green';
        modifyButton.style.borderRadius = '50%';
        modifyButton.style.padding = '5px';
        modifyButton.style.margin = '0 10px';
        modifyButton.style.border = 'none';
        modifyButton.style.cursor = 'pointer';
        modifyButton.style.opacity = '0.5';
        modifyButton.style.transition = 'opacity 0.2s ease-in-out';
        modifyButton.style.verticalAlign = 'middle';
        modifyButton.onmouseover = function() {
          modifyButton.style.opacity = '1';
        };
        modifyButton.onmouseout = function() {
          modifyButton.style.opacity = '0.5';
        };
        modifyButton.onclick = function() {
          // Modifier le lien en remplaçant la partie de l'URL par la page de l'utilisateur
          var newUrl = videoLink.href.replace(/https?:\/\/[^\/]+\.xhamster\.com\/videos\//, 'https://xhamster.com/videos/');
          newUrl = newUrl.replace(/xhamster\d\.com/, 'xhamster.com');
          videoLink.href = newUrl; // Mettre à jour le lien
          videoLink.textContent = newUrl; // Mettre à jour le texte du lien
          modifyButton.style.background = 'blue'; // Changer la couleur du bouton en bleu
        };

        // Ajouter le bouton après le lien
        videoLink.parentNode.insertBefore(modifyButton, videoLink.nextSibling);
      }
    });
  }

    // XHamster - IA - Links Utility 02 - Collections / Favoris v.4
  // Fonction pour ajouter les boutons aux liens de favoris
  function addButtonsToFavoriteLinks() {
    // Sélectionner les liens de favoris
    var favoriteLinks = document.querySelectorAll('.video-page .width-wrap .comments-section.comments-container #commentBox [class^="commentsList-"] [class^="commentItem-"] a.link-inner[href*="/my/favorites/videos/"], .paginated-container a.link-inner[href*="/my/favorites/videos/"]');

    // Boucler sur les liens de favoris
    favoriteLinks.forEach(function(favoriteLink) {
      // Supprimer les boutons existants
      var existingButtons = favoriteLink.parentNode.querySelectorAll('button');
      existingButtons.forEach(function(button) {
        button.remove();
      });

      // Créer un bouton pour modifier le lien
      var modifyButton = document.createElement('button');
      modifyButton.innerHTML = '<i class="fas fa-star"></i>';
      modifyButton.style.background = 'gold';
      modifyButton.style.borderRadius = '50%';
      modifyButton.style.padding = '5px';
      modifyButton.style.margin = '0 10px';
      modifyButton.style.border = 'none';
      modifyButton.style.cursor = 'pointer';
      modifyButton.style.opacity = '0.5';
      modifyButton.style.transition =
                modifyButton.onmouseover = function() {
        modifyButton.style.opacity = '1';
      };
      modifyButton.onmouseout = function() {
        modifyButton.style.opacity = '0.5';
      };
      modifyButton.onclick = function() {
        // Modifier le lien en remplaçant la partie de l'URL par la page de l'utilisateur
        var newUrl = favoriteLink.href.replace(/(https?:\/\/)?([a-z]{2,3}\.)?xhamster\.com\/my\/favorites\/videos\//, 'https://xhamster.com/users/' + favoriteLink.closest('.video-page [class^="commentItem-"]').querySelector('.video-page .width-wrap .comments-section.comments-container #commentBox [class^="commentsList-"] [class^="commentItem-"] [class^="user-"] a[href^="https://xhamster.com/users/"]').href.split("/").pop() + '/favorites/videos/');
        favoriteLink.href = newUrl; // Mettre à jour le lien
        favoriteLink.textContent = newUrl; // Mettre à jour le texte du lien
        modifyButton.style.background = 'red'; // Changer la couleur du bouton en rouge
      };
console.log(favoriteLink.parentNode);
      // Ajouter le bouton à côté du lien
      favoriteLink.parentNode.appendChild(modifyButton);
    });
  }
setTimeout(function() {
  addButtonsToFavoriteLinks();
}, 10000);

  // Exécuter la fonction pour ajouter les boutons aux liens de vidéos
  modifyVideoLinks();

  // Exécuter la fonction pour ajouter les boutons aux liens de favoris
  addButtonsToFavoriteLinks();

  // Ajouter un écouteur d'événement pour détecter les changements de contenu dans les conteneurs paginés
  var paginatedContainers = document.querySelectorAll('.video-page .width-wrap .comments-section.comments-container:has(.pager-section) #commentBox.width-wrap .comments-wrap .heading-container + .content-container .comments-list');
  paginatedContainers.forEach(function(container) {
    var observer = new MutationObserver(function(mutations) {
      // Appeler la fonction modifyVideoLinks lorsque le contenu est mis à jour
      modifyVideoLinks();
      // Appeler la fonction addButtonsToFavoriteLinks lorsque le contenu est mis à jour
      addButtonsToFavoriteLinks();
    });
    observer.observe(container, { childList: true, subtree: true });
  });
})();

// XHamster - IA - Links Utility 03 - Blogs - OLD Stories to NEW Posts links (IA) v.2
(function() {
  'use strict';
  var links = document.querySelectorAll('a');
  links.forEach(function(link) {
    var href = link.href;
    if (href.match(/\/stories\/story-\d+/)) {
      var newHref = href.replace(/\/stories\/story-(\d+)/, '/posts/$1');
      link.href = newHref;
      // Ajouter une icône de redirection à côté du lien
      var icon = document.createElement('span');
      icon.innerHTML = '&#x21E8;'; // Caractère Unicode "redirection"
      icon.style.fontSize = '12px';
      icon.style.marginLeft = '5px';
      var lang = document.documentElement.lang || 'en'; // par défaut en anglais si la langue n'est pas définie
      var translations = {
        'fr': 'Nouveau lien : ',
        'en': 'New link: ',
        'es': 'Nuevo enlace: ',
        'de': 'Neuer Link: ', // allemand
        'it': 'Nuovo link: ', // italien
        'pt': 'Novo link: ', // portugais
        'nl': 'Nieuwe link: ', // néerlandais
        'ru': 'Новый ссылка: ', // russe
        'zh': '新链接: ', // chinois (simplifié)
        'ja': '新しいリンク: ', // japonais
        'ko': '새로운 링크: ', // coréen
        'pl': 'Nowy link: ', // polonais
        'sv': 'Ny länk: ', // suédois
        'da': 'Nyt link: ', // danois
        'no': 'Ny lenke: ', // norvégien
        'fi': 'Uusi linkki: ', // finnois
        'el': 'Νέο link: ', // grec
        'tr': 'Yeni link: ', // turc
        'cs': 'Nový odkaz: ', // tchèque
        'sk': 'Nový odkaz: ', // slovaque
        'hu': 'Új link: ', // hongrois
        'ro': 'Noul link: ', // roumain
        'bg': 'Нов линк: ', // bulgare
        'uk': 'Новий посилання: ', // ukrainien
        'he': 'קישור חדש: ', // hébreu
        'ar': 'رابط جديد: ', // arabe
      };
      icon.title = translations[lang] + newHref;
      link.appendChild(icon);
    }
  });

  // Modifier l'URL dans la barre d'adresse
  var currentUrl = window.location.href;
  if (currentUrl.match(/\/stories\/story-\d+/)) {
    var newUrl = currentUrl.replace(/\/stories\/story-(\d+)/, '/posts/$1');
    window.history.replaceState({}, '', newUrl);
  }
})();
