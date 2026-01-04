// ==UserScript==
// @name         EGAFD / BGAFD Actress Info pages- Films Search Filter (IA)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a filter for the paring pages
// @icon         https://external-content.duckduckgo.com/ip3/www.egafd.com.ico
// @author       Janvier57
// @match        https://www.egafd.com/actresses/details.php/*
// @match        https://www.egafd.com/actresses/details.php/id*
// @match        https://www.bgafd.co.uk/actresses/details.php/*
// @match        https://www.bgafd.co.uk/actresses/details.php/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506878/EGAFD%20%20BGAFD%20Actress%20Info%20pages-%20Films%20Search%20Filter%20%28IA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506878/EGAFD%20%20BGAFD%20Actress%20Info%20pages-%20Films%20Search%20Filter%20%28IA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var rows = document.querySelectorAll('td[valign="top"] > h1 + table tr:has(a[href^="/films/details.php/"]) td:not([valign="top"]):has(ul.list a[href^="/films/details.php/"])');
  if (rows.length > 0) {
    var list = rows[0].querySelector('td[valign="top"] > h1 + table tr:has(a[href^="/films/details.php/"]) td:not([valign="top"]):has(ul.list a[href^="/films/details.php/"]) ul.list');
    if (list) {
      // Supprimer la forme au top
      var topForm = document.querySelector('td > input[type="search"]:first-of-type');
      if (topForm) {
        topForm.remove();
      }

      var container = document.createElement('div');
      container.className = 'filter';
      container.style.border = '2px solid red';
      container.style.padding = '5px';
      container.style.display = 'flex';
      container.style.alignItems = 'center';

      var label = document.createElement('label');
      label.textContent = 'Films Filter';
      label.htmlFor = 'search-input';

      var clearButton = document.createElement('button');
      clearButton.textContent = 'Clear';
      clearButton.addEventListener('click', function() {
        var searchInput = this.nextElementSibling;
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      });

      var searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'Rechercher...';
      searchInput.id = 'search-input';
      searchInput.className = 'filmsfilter';
      searchInput.style.width = '90%';

      container.appendChild(label);
      container.appendChild(clearButton);
      container.appendChild(searchInput);

      list.parentNode.insertBefore(container, list);

      searchInput.addEventListener('input', function() {
        var filter = searchInput.value.toLowerCase();
        var items = list.querySelectorAll('a[href^="/films/details.php/"]');
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.textContent.toLowerCase().includes(filter)) {
            item.parentNode.style.display = '';
          } else {
            item.parentNode.style.display = 'none';
          }
        }
      });
    }
  }
})();
