// ==UserScript==
// @name         learnwitholiver
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Flashcards
// @author       Feng Ya
// @match        https://www.learnwitholiver.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/367743/learnwitholiver.user.js
// @updateURL https://update.greasyfork.org/scripts/367743/learnwitholiver.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...

  GM_addStyle(`
  #dashboard {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    padding-top: 100px;
    background: white;
  }
  #dashboard > div {
    padding: 20px;
    margin: 0 auto;
    max-width: 600px;
    font-size: 36px;
    text-align: center;
  }
  #dashboard > div.index {
    font-size: 12px;
  }
  .cloze {
    background: rgba(255, 242, 51, 0.298);
  }
  .mask {
    color: black;
    background: black;
  }
  `);

  console.log(window.location);

  const storage = window.localStorage;
  const pathname = window.location.pathname;

  let current = parseInt(storage.getItem(pathname), 10) || 0;
  console.log(current);

  const dashboard = document.createElement('div');
  dashboard.id = 'dashboard';
  dashboard.style.display = 'none';
  document.body.appendChild(dashboard);

  if (pathname === '/german/show-sentences-print.php') {
    const trs = document.querySelectorAll('table table tr');

    trs.forEach((tr, index) =>
      tr.addEventListener('click', event => {
        current = index;
        show();
      })
    );

    let display = false;

    document.body.addEventListener('keydown', event => {
      // console.log(event.key);
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;

      event.preventDefault();

      switch (event.key) {
        case 'x':
          display = !display;
          if (display) show();
          else hide();
          break;
        case 'n':
        case 'j':
          next();
          break;
        case 'p':
        case 'k':
          prev();
          break;
        case ' ':
          toggle();
          break;
      }
    });

    function show() {
      current = normalize(current, trs.length);
      storage.setItem(pathname, current);
      const tr = trs[current];

      const [front, back] = Array.from(tr.children).map(node => node.innerText);

      dashboard.style.display = '';
      dashboard.innerHTML = `
      <div class='cloze mask'>${front}</div>
      <div>${back}</div>
      <div class='index'>${current + 1}/${trs.length}</div>
      `;
    }

    function hide() {
      dashboard.style.display = 'none';
      dashboard.innerHTML = '';
    }

    function prev() {
      current = current - 1;
      show();
    }

    function next() {
      current = current + 1;
      show();
    }

    function toggle() {
      document.querySelectorAll('.cloze').forEach(cloze => {
        cloze.classList.toggle('mask');
      });
    }
  }

  function normalize(index, len) {
    if (index >= len) return index % len;
    if (index < 0) return index % len + len;
    return index;
  }
})();
