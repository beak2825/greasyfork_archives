// ==UserScript==
// @name         PIN clans
// @namespace    --
// @version      2
// @license      MIT
// @description  Add a pin icon next to each clan allowing you to easily find your friends clans without having to scroll just by pinning it so when they make a clan again with the same name, its already at the top for you!
// @author       lore
// @match       *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498056/PIN%20clans.user.js
// @updateURL https://update.greasyfork.org/scripts/498056/PIN%20clans.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function apic() {
    let title = document.getElementById('clan-title');
    if (!title || title.textContent.trim() !== 'Clans') return;

    let items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
      // Skip items inside the specified element
      if (item.closest('#hat-menu')) return;

      if (item.querySelector('.pin')) return;

      let nameElement = item.querySelector('.header');
      if (nameElement) {
        let pin = document.createElement('i');
        pin.className = 'fas fa-map-pin pin';
        pin.style.fontSize = '24px';
        pin.style.color = 'gray';

        if (isPinned(nameElement.textContent.trim())) {
          pin.className = 'fas fa-thumbtack pin';
          item.classList.add('pinned');
          item.parentNode.prepend(item);
        }

        pin.addEventListener('click', function() {
          togglePin(item, pin);
        });

        nameElement.parentNode.insertBefore(pin, nameElement);
      }
    });
  }

  function togglePin(item, pin) {
    let isPinned = item.classList.contains('pinned');

    if (!isPinned) {
      item.classList.add('pinned');
      pin.className = 'fas fa-thumbtack pin';
      item.parentNode.prepend(item);
    } else {
      item.classList.remove('pinned');
      pin.className = 'fas fa-map-pin pin';
    }

    savePins();
  }

  function isPinned(name) {
    let pinned = JSON.parse(localStorage.getItem('pins')) || [];
    return pinned.includes(name);
  }

  function savePins() {
    let pinned = [];

    let items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
      if (item.classList.contains('pinned')) {
        pinned.push(item.querySelector('.header').textContent.trim());
      }
    });

    localStorage.setItem('pins', JSON.stringify(pinned));
    console.log('Pinned:', pinned);
  }

  function observeChanges() {
    let observer = new MutationObserver(function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          apic();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  apic();
  observeChanges();

  function loadPins() {
    let pinned = JSON.parse(localStorage.getItem('pins')) || [];

    let items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
      let name = item.querySelector('.header').textContent.trim();
      if (pinned.includes(name)) {
        item.classList.add('pinned');
        let pin = item.querySelector('.pin');
        if (pin) {
          pin.className = 'fas fa-thumbtack pin';
        }
        item.parentNode.prepend(item);
      }
    });
  }

  loadPins();

})();