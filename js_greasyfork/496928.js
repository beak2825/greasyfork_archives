// ==UserScript==
// @name        Качать с author.today названием без транслитерации
// @namespace   Azazar's Scripts
// @match       https://author.today/*
// @grant       none
// @version     1.2
// @description Скачивание с author.today с оригинальным названием без транслитерации
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496928/%D0%9A%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%20authortoday%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B1%D0%B5%D0%B7%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D0%B8%D1%82%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/496928/%D0%9A%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%20authortoday%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B1%D0%B5%D0%B7%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D0%B8%D1%82%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

function updateDownloadLinks() {
  let author = Array.from(document.querySelectorAll('.book-meta-panel .book-authors a')).map(a => a.innerText).join(', ');
  let title = document.querySelector('.book-meta-panel h1.book-title').innerText;
  let fileName = `${title}. ${author}`;

  document.querySelectorAll('a[href^="/work/download?"]').forEach(anchor => {
    let urlParams = new URLSearchParams(anchor.search);

    anchor.onclick = undefined;

    if (urlParams.has('fileName')) {
      urlParams.set('fileName', encodeURIComponent(fileName));
      anchor.search = '?' + urlParams.toString();
    }
  });
}

function observeDOMChanges() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length || mutation.type === 'childList') {
        updateDownloadLinks();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial call to update links when the script is loaded
  updateDownloadLinks();
}

observeDOMChanges();
