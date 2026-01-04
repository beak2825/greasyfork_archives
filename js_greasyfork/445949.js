// ==UserScript==
// @name        [ARCHIWUM]ObrazekZeSchowka 2022
// @description	Wklej obrazek ze schowka, w pole tekstowe wpisu lub komentarza - skrypt sam go doda, jako załączony obrazek.
// @version     2.1.0
// @author      look997
// @include     https://wykop.pl/*
// @homepageURL https://wykop.pl/ludzie/addons/look997/
// @namespace   https://www.wykop.pl/ludzie/addons/look997/
// @grant       none
// @require
// @run-at      document-end
// @resource    metadata https://greasyfork.org/scripts/445949-obrazekzeschowka-2022/code/ObrazekZeSchowka%202022.user.js
// @icon        https://raw.githubusercontent.com/look997/host/main/ObrazekZeSchowka.svg
// @icon64      https://raw.githubusercontent.com/look997/host/main/ObrazekZeSchowka.svg
// @downloadURL https://update.greasyfork.org/scripts/445949/%5BARCHIWUM%5DObrazekZeSchowka%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/445949/%5BARCHIWUM%5DObrazekZeSchowka%202022.meta.js
// ==/UserScript==

(function() {
'use strict';


// Nasłuchuj zdarzenia wklejenia
window.addEventListener("paste", async function (event) {
  const text = await getClipboardText();
  if (text) {
    console.log("W schowku jest tekst jo");
    return;
  }

  const image = await getClipboardImage();
  if (image) {
    console.log("Jest obrazek w schowku");
    KliknijAparat();
  }
});

function KliknijAparat() {
  const textarea = document.querySelector('textarea:focus');
  const aparatElements = document.querySelectorAll('[title="Zdjęcie lub film"]');
  
  let nearestElement = null;
  let closestDistance = Number.MAX_VALUE;

  aparatElements.forEach((aparatElement) => {
    aparatElement.addEventListener('click', () => {
      nearestElement = aparatElement;
      console.log('Kliknięto w element:', nearestElement);
    });

    const distance = calculateDistance(textarea, aparatElement);
    if (distance < closestDistance) {
      nearestElement = aparatElement;
      closestDistance = distance;
    }
  });

  if (nearestElement) {
    console.log('Znaleziono aparat jo, Znaleziono najbliższy element:', nearestElement);
    nearestElement.click();
    SprawdzCzyOknoWyskoczylo();
  } else {
    console.log("Nie znaleziono aparatu jo");
  }
}

function calculateDistance(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  const dx = rect1.left - rect2.left;
  const dy = rect1.top - rect2.top;
  return Math.sqrt(dx * dx + dy * dy);
}

function SprawdzCzyOknoWyskoczylo() {
  const modalElement = document.querySelector("section.modal[data-v-9de074aa]");
  if (modalElement) {
    console.log("Okno Wyszkoczyło JO i istnieje");
    var targetSelector = 'button[data-v-50f00d5d].target';
    triggerDropEvent(targetSelector);
    zamknijOkno();
  }

  const startTime = Date.now();
  const interval = setInterval(function () {
    const currentModalElement = document.querySelector("section.modal[data-v-9de074aa]");
    if (currentModalElement) {
      console.log("Okno Wyskoczyło JO dzieki nasłuchiwaniu");
      var targetSelector = 'button[data-v-50f00d5d].target';
      triggerDropEvent(targetSelector);
      zamknijOkno();
      clearInterval(interval);
    } else if (Date.now() - startTime >= 3000) {
      console.log("Okno Nie Wyskoczyło JO Info od nasłuchiwania");
      clearInterval(interval);
      return;
    }
  }, 100);
}

function getClipboardText() {
  return navigator.clipboard.readText();
}

function getClipboardImage() {
  return new Promise(function (resolve) {
    navigator.clipboard
      .read()
      .then(function (clipboardItems) {
        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            if (type.startsWith("image/")) {
              resolve(true); // Zwraca true, jeśli w schowku jest obrazek
              return;
            }
          }
        }
        resolve(false); // Zwraca false, jeśli w schowku nie ma obrazka
      })
      .catch(function (error) {
        console.error("Błąd podczas odczytu schowka:", error);
        resolve(false); // Zwraca false w przypadku błędu odczytu schowka
      });
  });
}


function triggerDropEvent(targetSelector) {
  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    console.log("Nie znaleziono elementu docelowego");
    return;
  }

  navigator.clipboard.read().then((items) => {
    for (const item of items) {
      for (const type of item.types) {
        if (type === 'image/png') {
          item.getType(type).then((blob) => {
            const file = new File([blob], 'image.png', { type: 'image/png' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const dropEvent = new DragEvent('drop', {
              dataTransfer: dataTransfer,
              bubbles: true,
              cancelable: true,
            });
            targetElement.dispatchEvent(dropEvent);
          }).catch((error) => {
            console.log("Błąd pobierania obrazka ze schowka", error);
          });
          return;
        }
      }
    }
    console.log("Nie znaleziono obrazka w schowku");
  }).catch((error) => {
    console.log("Błąd odczytu schowka", error);
  });
}

function zamknijOkno() {
  const closeButton = document.querySelector('div.v--modal-box.v--modal section.modal.entryPhoto header button');
  if (closeButton) {
    closeButton.click();
    console.log("Okno zostało zamknięte.");
  } else {
    console.log("Nie znaleziono przycisku zamknięcia.");
  }
}

})();
