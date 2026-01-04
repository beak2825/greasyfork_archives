// ==UserScript==
// @name         NHK Only Names Furigana
// @version      1.0
// @description  Turn off furigana on NHK easy, except for names
// @author       Adrien Rault
// @include      https://www3.nhk.or.jp/news/easy/*
// @license      MIT
// @namespace    https://greasyfork.org/users/754287
// @downloadURL https://update.greasyfork.org/scripts/424402/NHK%20Only%20Names%20Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/424402/NHK%20Only%20Names%20Furigana.meta.js
// ==/UserScript==

function toggleFuriganas(furiganas) {
  for (const furigana of furiganas) {
    furigana.hidden = !furigana.hidden;
  }
}

function create(tag, params = {}) {
  const { attributes, content, events, style } = params;
  
  const element = document.createElement(tag);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }
  
  if (style) {
    for (const [key, value] of Object.entries(style)) {
      element.style[key] = value;
    }
  }
  
  if (events) {
    for (const [key, value] of Object.entries(events)) {
      element.addEventListener(key, value, false);
    }
  } 
  
  if (content) {
    element.innerText = content;
  }

  return element;
}

window.addEventListener('DOMContentLoaded', () => {
  const classes = ['.article-main__title', '.article-main__body'];
  const allFuriganas = Array.from(document.querySelectorAll(classes.map((c) => `${c} rt`).join(', ')));
  const nameFuriganas = Array.from(document.querySelectorAll('.article-main .colorL rt, .article-main .colorN rt, .article-main .colorC rt'));
  const otherFuriganas = allFuriganas.filter((furigana) => !nameFuriganas.includes(furigana));
  
  const container = create('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      right: '20px',
      top: '25%',
      width: '100px',
      zIndex: 1,
    },
  });
  
  const toggleAllButton = create('button', {
    content: 'Toggle all furiganas',
    events: {
      click() {
        toggleFuriganas(allFuriganas);
      },
    },
  });
  const toggleNameButton = create('button', {
    content: 'Toggle names furiganas',
    events: {
      click() {
        toggleFuriganas(nameFuriganas);
      },
    },
  });
  const toggleOtherButton = create('button', {
    content: 'Toggle other furiganas',
    events: {
      click() {
        toggleFuriganas(otherFuriganas);
      },
    },
  });
  
  // container.appendChild(toggleAllButton);
  container.appendChild(toggleNameButton);
  container.appendChild(toggleOtherButton);
  
  document.body.appendChild(container);
  
  toggleFuriganas(otherFuriganas);
});