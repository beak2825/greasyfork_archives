// ==UserScript==
// @name         ID of character on MAL
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows Anime/Manga/Characters/People IDs on DBchanges.php page
// @author       grin3671
// @match        https://myanimelist.net/dbchanges.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405991/ID%20of%20character%20on%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/405991/ID%20of%20character%20on%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var targetNode,
      observerOptions = {
        childList: true,
        attributes: true,
        subtree: true //Omit or set to false to observe only changes to the parent node.
      };

  function changesListener(mutationList, observer) {
    mutationList.forEach((mutation) => {
      switch(mutation.type) {
        case 'childList':
          if (mutation.addedNodes[0].className == 'borderClass') break;
          if (mutation.addedNodes[0] instanceof window.Text) break;
          if (mutation.addedNodes.length !== 1) {
            addIDs();
          }
          break;
      }
    });
  }


  function addCharacterLink (characterID) {
    console.log(characterID);
    let container = document.createElement('span');
    container.style.marginLeft = '1em';

    let text_link = document.createElement('a');
    text_link.href = 'https://myanimelist.net/panel.php?go=characters&do=edit&character_id=' + characterID;
    text_link.textContent += '#' + characterID;
    text_link.dataset.jsSkipped = 'true';

    container.append(text_link);

    return container;
  }

  function addIDs () {
    let links = targetNode.querySelectorAll('.borderClass > a');
    links.forEach(function (link, index) {
      let id;
      id = link.getAttribute('onclick');
      // if link has onclick attribute its character-link, otherwise its anime-link
      if (id) {
        id = id.slice(id.indexOf('(') + 1, id.indexOf(')')).split(',')[1].trim();
        link.parentNode.appendChild(addCharacterLink(id));
      } else {
        id = link.getAttribute('href');
        if (id) {
          id = id.slice(id.indexOf('(') + 2, id.indexOf(',') - 1);
          link.textContent += ' (#' + id + ')';
        }
      }
    });
  }

  window.addEventListener('load', function () {
    targetNode = document.querySelector('#animeQueryBox + small');
    var observer = new MutationObserver(changesListener);
    observer.observe(targetNode, observerOptions);
  });
})();