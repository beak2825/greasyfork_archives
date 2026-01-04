// ==UserScript==
// @name         Кнопка "Показать в полном размере" для Google Картинки
// @namespace    https://github.com/Kenya-West/make-gis-great-again
// @version      1.2
// @description  Этот скрипт добавляет кнопку "Показать в полном размере"  для Google Картинки.
// @author       Bae Junehyeon
// @run-at       document-end
// @include      http*://*.google.tld/search*tbm=isch*
// @downloadURL https://update.greasyfork.org/scripts/38588/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B2%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%BC%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B5%22%20%D0%B4%D0%BB%D1%8F%20Google%20%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/38588/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B2%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%BC%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B5%22%20%D0%B4%D0%BB%D1%8F%20Google%20%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==


function addButton(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.classList.contains('irc_ris')) {
      let container = node.closest('.irc_c');
      let thumbnail = document.querySelector('img[name="' + container.dataset.itemId + '"]');
      let meta = thumbnail.closest('.rg_bx').querySelector('.rg_meta');

      let metadata = JSON.parse(meta.innerHTML);
      let src = metadata.ou;

      let buttons = container.querySelector('.irc_but_r tr');

      let button = buttons.querySelector('td.mgisga');
      if (button === null) {
        let openButton = buttons.querySelector('td');

        button = openButton.cloneNode(true);
        button.classList.add('mgisga');
        button.querySelector('._WKw').innerText = 'Показать в полном размере';

        let link = button.querySelector('a');
        link.href = src;
        link.className = '';
        link.removeAttribute('data-cthref');
        link.removeAttribute('jsaction');

        openButton.after(button);
      }

      let link = button.querySelector('a');
      link.href = src;
    }
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const addedNodes = mutation.addedNodes || [];

    addedNodes.forEach((newNode) => {
      addButton(newNode);
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

addButton(document.body);