// ==UserScript==
// @name         Wykop.pl - Ukryj znaleziska od Zielonek
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Ukryj sekcję z aktywną zieloną lub zbanowaną nazwą użytkownika profilu
// @author       You
// @match        https://wykop.pl/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/482756/Wykoppl%20-%20Ukryj%20znaleziska%20od%20Zielonek.user.js
// @updateURL https://update.greasyfork.org/scripts/482756/Wykoppl%20-%20Ukryj%20znaleziska%20od%20Zielonek.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Funkcja do odświeżania strony
  function odswiezStrone() {
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  // Pobieramy wszystkie linki na stronie
  var wszystkieLinki = document.getElementsByTagName('a');

  // Przechodzimy przez wszystkie linki i sprawdzamy, czy zawierają "https://wykop.pl/wykopalisko"
  for (var i = 0; i < wszystkieLinki.length; i++) {
    var aktualnyLink = wszystkieLinki[i];

    // Jeżeli link zawiera "https://wykop.pl/wykopalisko", dodajemy naszą funkcję do obsługi zdarzenia kliknięcia
    if (aktualnyLink.href && aktualnyLink.href.includes('https://wykop.pl/wykopalisko')) {
      aktualnyLink.addEventListener('click', odswiezStrone);
    }
  }

  // Funkcja sprawdzająca, czy element spełnia warunki
  function checkElement(element) {
    return (
      (element.classList.contains('active') || element.classList.contains('banned')) &&
      element.classList.contains('green-profile') &&
      element.classList.contains('username')
    );
  }

  // Funkcja wyświetlająca okno z liczbą znalezionych elementów
  function showNotification(count) {
    const notification = document.createElement('div');
    notification.innerHTML = `Ukryto ${count} element/y`;
    Object.assign(notification.style, {
      position: 'fixed',
      top: '0px',
      left: '550px',
      padding: '10px',
      background: '#fff',
      border: '1px solid #ccc',
      zIndex: '9999',
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }


    // Funkcja ukrywająca element 7 poziomów wyżej, jeżeli ma w nazwie "section"
function hideParentElement(element) {
  let parent = element;
  for (let i = 0; i < 8 && parent.parentElement; i++) {
    parent = parent.parentElement;
  }

  if (parent.style && parent.tagName.toLowerCase().includes("section")) {
    parent.style.display = 'none';
  }
}


  // Obsługa kliknięcia na link
  function handleLinkClick(event) {
    if (event.target.tagName === 'A' && event.target.href) {
      const match = event.target.href.match(/https:\/\/wykop\.pl\/wykopalisko\/strona\/(\d+)/);
      if (match) {
        const pageNumber = match[1];
        window.location.href = `https://wykop.pl/wykopalisko/strona/${pageNumber}`;
        event.preventDefault();
      }
    }
  }

  // Funkcja główna skryptu
  function main() {
    const elements = document.querySelectorAll('.active.green-profile.username, .banned.green-profile.username');
    const count = elements.length;

    if (count > 0) {
      showNotification(count-2);

      // Ukrywanie elementu 7 poziomów wyżej dla każdego znalezionego elementu
      elements.forEach(hideParentElement);

      // Dodanie obsługi zdarzenia kliknięcia do dokumentu
      document.addEventListener('click', handleLinkClick);
    }
  }

  // Wywołanie głównej funkcji po załadowaniu strony
  window.addEventListener('load', main);
})();
