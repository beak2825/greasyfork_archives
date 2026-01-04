// ==UserScript==
// @name         FigmaRUS
// @description  Перевод Figma на русский язык.
// @namespace    figma.com
// @version      0.1
// @match        *://*.figma.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419923/FigmaRUS.user.js
// @updateURL https://update.greasyfork.org/scripts/419923/FigmaRUS.meta.js
// ==/UserScript==

const labelMap = {
  'Assets': 'Ассеты',
  'Line Arrow': 'Линия стрелки',
  'Line height': 'Длина линии',
  'Line tool': 'Линия',
  'Line': 'Линия',
}
const textMap = {
  'Assets': 'Ассеты',
  'Line Arrow': 'Линия стрелки',
  'Line height': 'Длина линии',
  'Line tool': 'Линия',
  'Line': 'Линия',
}

/**
 interface Config {
    [selector: string]: {
      text: string | undefined | ((oldVal: string, parentElement: HTMLElement, textNode?: Text) => string | undefined);
      '<attribute-name>': string | undefined | null | ((oldVal: string, parentElement: HTMLElement) => string | undefined | null);
    }
 }

 selector - css селектор
   text - текст в элементе
     значения:
       function - вызывает функцию и использует возвращаемое значение
       string - устанавливает текст в элементе
       undefined - ничего не делает

   attribute - любой атрибут
     значения:
       function - вызывает функцию и использует возвращаемое значение
       string - устанавливает значение атрибута
       null - удаляет атрибут
       undefined - ничего не делает
 **/
const selectorMap = {
  '[data-label="Layers"]': {
    'data-label': 'Слои'
  },
  '[data-label]': {
    'data-label': (oldVal, element) => labelMap[oldVal] || oldVal
  },
  '[class^="multilevel_dropdown--name--"]': {
    "text": (oldVal, parentElement, textNode) => textMap[oldVal] || oldVal
  },
  '[for="frame-mask-disabled-checkbox"]': {
    "style": "width: 150px;line-height: 15px;",
  },
  '[class^="toolbar_view--shareButton--"]': {
    "style": "width: 90px;",
  },
  '[class^="upgrade_section--upgradeMainSection--"]': {
    "style": "height: 1px;",
  },
  '[class^="basic_form--btn--"]': {
    "style": "width: 100px;background-color: #18a0fb;color: #fff;",
  },
  '[class^="select--dropdownContentWrapper--"]': {
    'style': (oldVal, element) => {
        element.style.width = "220px"
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },
  '[class^="select--dropdownContainer--"]': {
    'style': (oldVal, element) => {
        element.style.width = "220px"
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },
  '[class^="select--typeSelectDropdown--"]': {
    'style': (oldVal, element) => {
        element.style.width = "220px"
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },
  '[class*="type_select--typeSelectDropdown--"]': {
    'style': (oldVal, element) => {
        element.setAttribute('style', 'width: 220px !important')
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },

  '[class*="select--option--"]': {
    'style': (oldVal, element) => {
        element.style.width = "220px"
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },
  '[class*="select--dropdownScrollClip--"]': {
    'style': (oldVal, element) => {
        element.style.height = "auto"
        // т.к. функция ничего не возвращает(undefined), то дальше ничего не происходит
    }
  },
  '[class^="raw_components--panelTitle--"]': {
    "style": "text-transform: none;",
  }
}

function matchAndProcess (el, textNode) {
  Object.entries(selectorMap).forEach(
    ([selector, config]) => el.matches(selector) && processElement(config, el, textNode)
  );
}

function queryAndProcess (el) {
  Object.entries(selectorMap).forEach(([selector, config]) => {
    if (el.nodeType === 3) {
      const { parentNode } = el;
      if (parentNode?.matches(selector))
        processElement(config, parentNode, el);
    } else {
      el.querySelectorAll(selector).forEach(el => processTextNodes(config, el));
      if (el.matches(selector))
        processTextNodes(config, el);
    }
  });
}

function processTextNodes (config, el) {
  if ('text' in config) {
    const textNodes = Array.prototype.filter.call(
      el.childNodes,
      node => node.nodeType === 3 && node.data.trim()
    );
    if (textNodes.length)
      return textNodes.forEach(textNode => processElement(config, el, textNode));
  }
  processElement(config, el);
}

function processElement (config, el, textNode = null) {
  let { text, ...attributes } = config;
  if (typeof text === 'function') {
    text = text(textNode ? textNode.data : '', el, textNode);
  }
  if (typeof text !== 'undefined') {
    if (textNode) textNode.nodeValue = text;
    else console.warn('[can not set text for', el, ': no text childNodes.]');
  }

  Object.entries(attributes).forEach(([attribute, value]) => {
    let oldValue = el.getAttribute(attribute);
    if (typeof value === 'function') {
      value = value(oldValue, el);
    }
    if (typeof value !== 'undefined') {
      if (value !== null) el.setAttribute(attribute, value);
      else el.removeAttribute(attribute);
    }
  })
}

let MutationObserverConfig = {
  childList: true,
  attributes: true,
  subtree: true,
  attributeFilter: ['data-label'],
  characterData: true
};

let observer = new MutationObserver(mutations => {
  observer.disconnect();
  mutations.forEach(record => {
    switch (record.type) {
      case 'childList':
        record.addedNodes.forEach(queryAndProcess);
        break;
      case 'characterData':
        matchAndProcess(record.target.parentNode, record.target);
        break;
      case 'attributes':
        matchAndProcess(record.target);
        break;
      default:
        console.error(`[unknown type "${record.type}"]`)
        break;
    }
  });
  observer.observe(document.body, MutationObserverConfig);
});
queryAndProcess(document.body);
observer.observe(document.body, MutationObserverConfig);
