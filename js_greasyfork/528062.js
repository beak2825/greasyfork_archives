// ==UserScript==
// @name        C3 Monaco Custom Syntax Highlighting - construct.net
// @namespace   Violentmonkey Scripts
// @match       https://editor.construct.net/*
// @grant       none
// @version     1.0
// @author      Clovelt
// @description 25/2/2025, 17:02:33
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528062/C3%20Monaco%20Custom%20Syntax%20Highlighting%20-%20constructnet.user.js
// @updateURL https://update.greasyfork.org/scripts/528062/C3%20Monaco%20Custom%20Syntax%20Highlighting%20-%20constructnet.meta.js
// ==/UserScript==


const myCustomTokenizer = {
  defaultToken: 'invalid',

  keywords: [
    'text', 'choice', 'wait', 'goto', 'comment',
    'ShakeScreen', 'Overlay', 'psychicEffect', 'tweenInteractable', 'setLayoutEffect', 'setLayerEffect',
    'setAnim', 'fadeInteractable', 'setSpriteAnim', 'invertUI', 'interactablesSetShake', 'interactablesShake', 'interactablesGlow', 'interactablesGlowColor',
    'playSound', 'playMusic', 'setAudioEffect',
    'dialog.toggleShow', 'toggleLayerVisible', 'goToLayout',
    'setDialogLines', 'saveGame', 'questTrackerAdd', 'questTrackerRemove',
    'pan', 'panInt', 'panBack'
  ],

  operators: [
    '=', '<', '<=', '>', '>=', '==', '!=', '?', ':', '|', '&'
  ],

  symbols: /[=<>!?|&]+/,

  tokenizer: {
    root: [
      [/^#.*/, 'keyword'], // Secciones en negrita
      [/^:.*/, 'comment'], // Comentarios (líneas que comienzan con ":")
      [/^(\w+)(?=\s*:)/, 'variable.parameter'], // Nombres de hablantes en azul
      [/\b[a-zA-Z_]\w*(?=\s*\()/, 'keyword'], // Funciones en color diferente
      [/\b[a-zA-Z_]\w*\b/, 'identifier'], // Identificadores generales (evita conflicto con funciones)
      [/\(/, { token: 'delimiter.parenthesis', bracket: '@open' }],
      [/\)/, { token: 'delimiter.parenthesis', bracket: '@close' }],
      [/"([^"\\]|\\.)*"/, 'string.special'], // Cadenas en funciones en naranja
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
      [/[^:\n]+/, ''], // Diálogo normal sin formato especial
    ],

    comment: [
      [/[^*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/./, 'comment']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],
  },
};

const waitForMonaco = setInterval(() => {
  if (typeof MonacoEnvironment !== 'undefined' && MonacoEnvironment.monaco) {
    clearInterval(waitForMonaco); // Stop checking once Monaco is ready

    (async () => {
      const monaco = MonacoEnvironment.monaco;

      // Retrieve all languages
      const allLangs = await monaco.languages.getLanguages();
      const jsLangDef = allLangs.find(({ id }) => id === 'javascript');

      if (!jsLangDef) {
        console.error("JavaScript language not found!");
        return;
      }

      // Load the language configuration and tokenizer
      const { conf, language: jsLang } = await jsLangDef.loader();
      if (!jsLang) {
        console.error("Failed to load JavaScript language configuration.");
        return;
      }

      // Apply the stored tokenizer
      for (let key in myCustomTokenizer) {
        const value = myCustomTokenizer[key];

        if (key === 'tokenizer') {
          for (let category in value) {
            const tokenDefs = value[category];

            if (!jsLang.tokenizer.hasOwnProperty(category)) {
              jsLang.tokenizer[category] = [];
            }

            if (Array.isArray(tokenDefs)) {
              jsLang.tokenizer[category].unshift(...tokenDefs);
            }
          }
        } else if (Array.isArray(value)) {
          if (!jsLang.hasOwnProperty(key)) {
            jsLang[key] = [];
          }
          jsLang[key].unshift(...value);
        }
      }

      console.log("Custom tokenizer applied successfully!");
    })();
  }
}, 100); // Check every 100ms until Monaco is available
