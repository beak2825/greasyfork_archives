// ==UserScript==
// @name         Favela of Ultima
// @namespace    http://aricneto.github.com
// @version      0.3
// @description  Translates Crown of Gods to Favela of Ultima!
// @author       AriNeto
// @match        https://*.crownofthegods.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405038/Favela%20of%20Ultima.user.js
// @updateURL https://update.greasyfork.org/scripts/405038/Favela%20of%20Ultima.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var words = {

'Forester\'s Hut': 'Plantação de Maconha',
'Horseman': 'Pocotó',
'Cabin': 'Barraco',
      'Storehouse': 'Armazém',
      'Stone Mine': 'Cracolândia',
      'Guard': 'Favelado',
      'Scout': 'Xisnove',
      'Senator': 'Cafetão',
      'Galley': 'Galeo',
      'Reports': 'Xisnoves',
      'Empire': 'Favela',
      'Rewards': 'Bolsa Família',
      'Alliance': 'Gangue',
      'Ranger': 'Pistoleiro',
      'Grain Mill': 'Fábrica de Maconha',
'Triari': 'Kid Bengala',
'Arbalist': 'Arromba Pocotó',
'Sorcerer': 'Mago da Maconha',
'Druid': 'Pocotó Maconheiro',
'Priestess': 'Padre Marcelo Rossi',
'Praetor': 'Pocotó Sagrado',
'Battering Ram': 'Bate Bate na Porta do Céu',
'Ballista': 'Taca Flecha',
'Scorpion': 'Taca Pedra',
'Stinger': 'Piroga',
'Warship': 'Jangada',
///////////////////////////////////////////////////////
    '': ''
  };
  ///////////////////////////////////////////////////////////////////////////////
  var regexs = [
  ],
  replacements = [
  ],
  tagsWhitelist = [
    'PRE',
    'BLOCKQUOTE',
    'CODE',
    'INPUT',
    'BUTTON',
    'TEXTAREA'
  ],
  rIsRegexp = /^\/(.+)\/([gim]+)?$/,
  word,
  text,
  texts,
  i,
  userRegexp;
  // prepareRegex by JoeSimmons
  // used to take a string and ready it for use in new RegExp()
  function prepareRegex(string) {
    return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
  }
  // function to decide whether a parent tag will have its text replaced or not

  function isTagOk(tag) {
    return tagsWhitelist.indexOf(tag) === - 1;
  }
  delete words['']; // so the user can add each entry ending with a comma,
  // I put an extra empty key/value pair in the object.
  // so we need to remove it before continuing
  // convert the 'words' JSON object to an Array
  for (word in words) {
    if (typeof word === 'string' && words.hasOwnProperty(word)) {
      userRegexp = word.match(rIsRegexp);
      // add the search/needle/query
      if (userRegexp) {
        regexs.push(new RegExp(userRegexp[1], 'g')
        );
      } else {
        regexs.push(new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
          return fullMatch === '\\*' ? '*' : '[^ ]*';
        }), 'gi')
        );
      }
      // add the replacement

      replacements.push(words[word]);
    }
  }
  // do the replacement

  texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
  for (i = 0; text = texts.snapshotItem(i); i += 1) {
    if (isTagOk(text.parentNode.tagName)) {
      regexs.forEach(function (value, index) {
        text.data = text.data.replace(value, replacements[index]);
      });
    }
  }
}());