// ==UserScript==
// @name         XHamster Retired User Search (IA) (DuckDuckGo: In site search)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ajoute un bouton de recherche pour les utilisateurs retirés sur XHamster
// @author       Janvier56
// @match        https://*.xhamster.com/videos/*
// @icon         https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506253/XHamster%20Retired%20User%20Search%20%28IA%29%20%28DuckDuckGo%3A%20In%20site%20search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506253/XHamster%20Retired%20User%20Search%20%28IA%29%20%28DuckDuckGo%3A%20In%20site%20search%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('Script exécuté');
  GM_addStyle(`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
    .search-button {
      background: green;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  `);
  var usernameElements = document.querySelectorAll('.video-page #video-tags-list-container > [class^="container-"] > [class^="list-"] [class^="item-"]:has([data-tooltip="User is retired"]) span');
  usernameElements.forEach(function(element) {
    var textContent = element.textContent.trim();
    var searchQuery = textContent;
    if (textContent.includes("##deleted_")) {
      searchQuery = textContent.replace("##deleted_", "");
    }
    console.log('ID/Name d\'utilisateur trouvé :', searchQuery);
    var searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.innerHTML = '<i class="fa fa-search" style="margin-right: 5px;"></i> <img src="https://duckduckgo.com/favicon.ico" width="16" height="16">';
    var url = 'https://duckduckgo.com/?q=' + encodeURIComponent(searchQuery + ' site:' + window.location.hostname.replace('www.', '')) + '&ia=web';
    searchButton.onmousedown = function(event) {
      if (event.button === 0) { // Clic gauche
        window.location.href = url;
      } else if (event.button === 1) { // Clic milieu
        window.open(url, '_blank');
      }
    };
    element.parentNode.appendChild(searchButton);
  });
})();

