// ==UserScript==
// @name         Spanish Naming Tenses Replacer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Renaming of a select few Spanish tense names in Wiktionary (Es) according to my personal reworking of them
// @author       Michael Santos
// @match        *://*es.wiktionary.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453152/Spanish%20Naming%20Tenses%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/453152/Spanish%20Naming%20Tenses%20Replacer.meta.js
// ==/UserScript==


(function() {
  'use strict';

  //16-17 is removing unnecessary parenthesis, 18-23 are exception handlings for the next section
  let parenthesis = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(13) > th > small:nth-child(4)");
  parenthesis.remove();
  let imperfecto = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(25) > th > a");
  imperfecto.innerHTML = "Pasado";
  let perfecto = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(29) > th > a");
  perfecto.innerHTML = "Presente perfecto";
  let futuro = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(32) > th > i:nth-child(1) > a");
  futuro.innerHTML = "Futuro perfecto";

  //The "renaming" part of this project, replaces certain tense names using a for loop and key-value pairs
  const names = {
    "pretérito imperfecto" : "Pasado",
    "pretérito perfecto" : "Presente perfecto",
    "pretérito indefinido" : "Pretérito"
  };

  for (const [key, value] of Object.entries(names)) {
    let before = document.querySelector(`[title="${key}"]`);
    before.innerHTML = value;
  }

  //Removes alternative names for all Spanish tenses with them available
  const alternatives = ['antecopretérito', 'copretérito', 'antefuturo', 'antepretérito', 'antepospretérito', 'antepresente', 'pospretérito'];
  for (const element of alternatives) {
    let alternative = document.querySelector(`[title="${element}"]`);
    alternative.remove();
  }

  //Exception handling for the previous section
  const doubles = [13, 25, 29, 30, 32];
  for (const element of doubles) {
    if (element == 32) {
      let double = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(32) > th > i:nth-child(3) > a");
      double.remove();
    } else {
      let double = document.querySelector(`#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(${element}) > th > a:nth-child(3)`);
      double.remove();
    }
  }

  //Removes "o" (or) next to the tense names
  const appearances = [12, 13, 15, 17, 18, 19, 20, 21, 25, 29, 30, 32];
  for (const element of appearances) {
    switch (element) {
      case 12: {
        let o = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(12) > th > small:nth-child(2) > i");
        o.remove();
        let andres = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(12) > th > small:nth-child(3) > i");
        andres.remove();
        break;
      }
      case 13: {
        let o = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(13) > th > small:nth-child(2) > i");
        o.remove();
        break;
      }
      case 19: {
        let o = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(19) > th > small:nth-child(2) > i");
        o.remove();
        break;
      }
      case 32: {
        let o = document.querySelector("#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(32) > th > small");
        o.remove();
        break;
      }
      default: {
        let o = document.querySelector(`#mw-content-text > div.mw-parser-output > table.inflection-table.collapsible.collapsed > tbody > tr:nth-child(${element}) > th > small > i`);
        o.remove();
      }
    }
  }
})();