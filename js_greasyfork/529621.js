// ==UserScript==
// @name         NHK Only Names Furigana (fixed)
// @version      1.2
// @description  Turn off furigana on NHK easy, except for names
// @author       Adrien Rault, Nathan Finch
// @include      https://www3.nhk.or.jp/news/easy/*
// @license      MIT
// @namespace    https://greasyfork.org/users/754287
// @downloadURL https://update.greasyfork.org/scripts/529621/NHK%20Only%20Names%20Furigana%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529621/NHK%20Only%20Names%20Furigana%20%28fixed%29.meta.js
// ==/UserScript==

function toggleFuriganas(furiganas) {
  for (const furigana of furiganas) {
    furigana.hidden = !furigana.hidden
  }
}

function create(tag, params = {}) {
  const { attributes, content, events, style } = params

  const element = document.createElement(tag)
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value)
    }
  }

  if (style) {
    for (const [key, value] of Object.entries(style)) {
      element.style[key] = value
    }
  }

  if (events) {
    for (const [key, value] of Object.entries(events)) {
      element.addEventListener(key, value, false)
    }
  }

  if (content) {
    element.innerText = content
  }

  return element
}

const allFuriganas = Array.from(document.querySelectorAll('rt'))
const nameFuriganas = Array.from(document.querySelectorAll('.colorL rt, .colorN rt, .colorC rt'))
const otherFuriganas = allFuriganas.filter((furigana) => !nameFuriganas.includes(furigana))

const container = create('div', {
  style: {
    display: 'flex',
    'padding-top': '16px'
  }
})

const buttonStyle = {
  background: '#129E38',
  'font-size': '11px',
  padding: '8px 6px',
  'border-radius': '4px',
  outline: 'none',
  color: 'white',
  'font-weight': '700',
  border: 'none',
  'margin-right': '8px'
}

const toggleAllButton = create('button', {
  content: 'Toggle all furiganas',
  style: buttonStyle,
  events: {
    click() {
      toggleFuriganas(allFuriganas)
    }
  }
})

const toggleNameButton = create('button', {
  content: 'Toggle names furiganas',
  style: buttonStyle,
  events: {
    click() {
      toggleFuriganas(nameFuriganas)
    }
  }
})

const toggleOtherButton = create('button', {
  content: 'Toggle other furiganas',
  style: buttonStyle,
  events: {
    click() {
      toggleFuriganas(otherFuriganas)
    }
  }
})

container.appendChild(toggleAllButton);
container.appendChild(toggleNameButton)
container.appendChild(toggleOtherButton)
document.querySelector('div.article-info').append(container)

toggleFuriganas(otherFuriganas)
