// ==UserScript==
// @name        Pin Emoticons, Text, and Images
// @namespace    Pin Emoticons, Text, and Images by WeedTV 
// @match       *://*/*
// @grant       none
// @version     1.0
// @description Przypinaj lub usuwaj emotikony, tekst, oraz obrazy na stronie, aby były widoczne po odświeżeniu, oraz usuń wszystkie elementy jednym kliknięciem.
// @downloadURL https://update.greasyfork.org/scripts/514091/Pin%20Emoticons%2C%20Text%2C%20and%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/514091/Pin%20Emoticons%2C%20Text%2C%20and%20Images.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const storedData = JSON.parse(localStorage.getItem('pinnedElements') || '{}');
  const currentURL = window.location.href;
  let mode = 'pin'; // Domyślny tryb przypinania
  let menuVisible = false; // Menu visibility state

  // Dostępne emotikony do wyboru
  const emoticons = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '👩', '👨'];

  // Funkcja tworzenia nowego elementu
  function createPinnedElement(content, posX, posY, style = {}, type = 'text') {
    const element = document.createElement(type === 'image' ? 'img' : 'div');
    element.style.position = 'fixed';
    element.style.left = `${posX}px`;
    element.style.top = `${posY}px`;
    element.style.zIndex = '10000';
    element.style.cursor = 'move';
    element.className = 'pinned-element';

    if (type === 'text') {
      element.innerHTML = content;
      element.style.fontFamily = style.fontFamily || 'Arial';
      element.style.color = style.color || '#000';
      element.style.fontSize = style.fontSize || '24px';
    } else if (type === 'image') {
      element.src = content;
      element.style.width = style.width || '100px';
      element.style.height = style.height || '100px';
    }

    element.onmousedown = function(event) {
      if (mode === 'pin') {
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;

          const urlData = storedData[currentURL] || [];
          const elementData = urlData.find(el => el.content === content);
          if (elementData) {
            elementData.posX = parseInt(element.style.left);
            elementData.posY = parseInt(element.style.top);
            localStorage.setItem('pinnedElements', JSON.stringify(storedData));
          }
        };
      }
    };

    element.onclick = function() {
      if (mode === 'remove') {
        element.remove();
        const urlData = storedData[currentURL];
        if (urlData) {
          const index = urlData.findIndex(el => el.content === content);
          if (index !== -1) {
            urlData.splice(index, 1);
            localStorage.setItem('pinnedElements', JSON.stringify(storedData));
          }
        }
      }
    };

    element.ondragstart = function() {
      return false;
    };

    document.body.appendChild(element);
  }

  if (storedData[currentURL]) {
    storedData[currentURL].forEach(({ content, posX, posY, style, type }) => createPinnedElement(content, posX, posY, style, type));
  }

  // Funkcja otwierająca lub ukrywająca menu
  function toggleMenu() {
    if (menuVisible) {
      const menu = document.getElementById('pinned-menu');
      if (menu) menu.remove();
      menuVisible = false;
    } else {
      openMenu();
      menuVisible = true;
    }
  }

  function openMenu() {
    const menu = document.createElement('div');
    menu.id = 'pinned-menu';
    menu.style.position = 'fixed';
    menu.style.top = '10%';
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)';
    menu.style.zIndex = '10001';
    menu.style.backgroundColor = 'black';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    menu.style.color = 'white';

    menu.innerHTML = '<p>Wybierz tryb:</p>';

    const pinButton = document.createElement('button');
    pinButton.textContent = 'Tryb przypinania';
    pinButton.onclick = () => {
      mode = 'pin';
      toggleMenu();
      alert('Tryb przypinania - wybierz emotkę, tekst lub obraz, aby przypiąć.');
      openContentMenu();
    };
    menu.appendChild(pinButton);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Tryb usuwania';
    removeButton.onclick = () => {
      mode = 'remove';
      toggleMenu();
      alert('Tryb usuwania - kliknij element, aby usunąć.');
    };
    menu.appendChild(removeButton);

    const clearAllButton = document.createElement('button');
    clearAllButton.textContent = 'Usuń wszystkie elementy';
    clearAllButton.onclick = () => {
      toggleMenu();
      removeAllPinnedElements();
      alert('Wszystkie elementy zostały usunięte.');
    };
    menu.appendChild(clearAllButton);

    document.body.appendChild(menu);
    menuVisible = true;
  }

  function openContentMenu() {
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '20%';
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)';
    menu.style.zIndex = '10001';
    menu.style.backgroundColor = 'black';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    menu.style.color = 'white';

    menu.innerHTML = '<p>Wybierz emotkę, tekst lub obraz:</p>';

    emoticons.forEach(emoticon => {
      const button = document.createElement('button');
      button.style.fontSize = '20px';
      button.style.margin = '5px';
      button.style.backgroundColor = 'transparent';
      button.style.color = 'white';
      button.textContent = emoticon;
      button.onclick = () => {
        selectedContent = emoticon;
        selectedStyle = {};
        selectedType = 'text';
        document.body.removeChild(menu);
        alert('Kliknij na stronie, aby przypiąć emotkę.');
      };
      menu.appendChild(button);
    });

    const textButton = document.createElement('button');
    textButton.style.margin = '5px';
    textButton.style.backgroundColor = 'transparent';
    textButton.style.color = 'white';
    textButton.textContent = 'Dodaj tekst';
    textButton.onclick = () => {
      const content = prompt('Wpisz tekst do przypięcia:');
      if (content) {
        const fontFamily = prompt('Wybierz czcionkę (np. Arial, Times New Roman):', 'Arial');
        const color = prompt('Wybierz kolor (np. #ff0000 dla czerwonego):', '#000');
        const fontSize = prompt('Wybierz rozmiar czcionki (np. 24px):', '24px');

        selectedContent = content;
        selectedStyle = { fontFamily, color, fontSize };
        selectedType = 'text';
        document.body.removeChild(menu);
        alert('Kliknij na stronie, aby przypiąć tekst.');
      }
    };
    menu.appendChild(textButton);

    const imageButton = document.createElement('button');
    imageButton.style.margin = '5px';
    imageButton.style.backgroundColor = 'transparent';
    imageButton.style.color = 'white';
    imageButton.textContent = 'Dodaj obrazek';
    imageButton.onclick = () => {
      const url = prompt('Wprowadź URL obrazka:');
      const width = prompt('Wprowadź szerokość (np. 100px):', '100px');
      const height = prompt('Wprowadź wysokość (np. 100px):', '100px');

      selectedContent = url;
      selectedStyle = { width, height };
      selectedType = 'image';
      document.body.removeChild(menu);
      alert('Kliknij na stronie, aby przypiąć obrazek.');
    };
    menu.appendChild(imageButton);

    document.body.appendChild(menu);
  }

  function removeAllPinnedElements() {
    const elements = document.querySelectorAll('.pinned-element');
    elements.forEach(el => el.remove());
    delete storedData[currentURL];
    localStorage.setItem('pinnedElements', JSON.stringify(storedData));
  }

  let selectedContent = null;
  let selectedStyle = {};
  let selectedType = 'text';

  document.body.onclick = function(event) {
    if (selectedContent) {
      createPinnedElement(selectedContent, event.pageX, event.pageY, selectedStyle, selectedType);
      storedData[currentURL] = storedData[currentURL] || [];
      storedData[currentURL].push({
        content: selectedContent,
        posX: event.pageX,
        posY: event.pageY,
        style: selectedStyle,
        type: selectedType
      });
      localStorage.setItem('pinnedElements', JSON.stringify(storedData));
      selectedContent = null;
    }
  };

  document.addEventListener('keydown', event => {
    if (event.code === 'Numpad1') {
      openMenu();
    } else if (event.code === 'Numpad2') {
      toggleMenu();
    }
  });
})();
