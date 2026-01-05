// ==UserScript==
// @name         PokemonDB Default Version
// @namespace    https://greasyfork.org/users/649
// @version      2.1.5
// @description  Auto selects the chosen version in the Moves section on PokemonDB
// @author       Adrien Pyke
// @match        *://pokemondb.net/pokedex/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @downloadURL https://update.greasyfork.org/scripts/25060/PokemonDB%20Default%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/25060/PokemonDB%20Default%20Version.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Config = GM_config([
    {
      key: 1,
      label: 'Gen 1',
      type: 'dropdown',
      showBlank: true,
      values: ['Red/Blue', 'Yellow']
    },
    {
      key: 2,
      label: 'Gen 2',
      type: 'dropdown',
      showBlank: true,
      values: ['Gold/Silver', 'Crystal']
    },
    {
      key: 3,
      label: 'Gen 3',
      type: 'dropdown',
      showBlank: true,
      values: ['Ruby/Sapphire', 'FireRed/LeafGreen', 'Emerald']
    },
    {
      key: 4,
      label: 'Gen 4',
      type: 'dropdown',
      showBlank: true,
      values: ['Diamond/Pearl', 'Platinum', 'HeartGold/SoulSilver']
    },
    {
      key: 5,
      label: 'Gen 5',
      type: 'dropdown',
      showBlank: true,
      values: ['Black/White', 'Black 2/White 2']
    },
    {
      key: 6,
      label: 'Gen 6',
      type: 'dropdown',
      showBlank: true,
      values: ['X/Y', 'Omega Ruby/Alpha Sapphire']
    },
    {
      key: 7,
      label: 'Gen 7',
      type: 'dropdown',
      showBlank: true,
      values: [
        'Sun/Moon',
        'Ultra Sun/Ultra Moon',
        "Let's Go Pikachu/Let's Go Eevee"
      ]
    }
  ]);
  GM_registerMenuCommand('Select default PokemonDB versions', Config.setup);

  const match = location.href.match(
    /^https?:\/\/pokemondb\.net\/pokedex\/.*?\/moves\/(\d+)/iu
  );
  const currentGen = match ? match[1] : 7;
  const defaultVersion = Config.load()[currentGen];
  const tabs = Array.from(
    document.querySelectorAll('.tabs-tab-list > a.tabs-tab')
  );

  if (defaultVersion) {
    const [tab] = tabs.filter(tab => tab.textContent === defaultVersion);
    if (tab) {
      tab.click();
    }
  }

  let changing = false;
  tabs.forEach(tab =>
    tab.addEventListener('click', () => {
      if (changing) return;
      changing = true;
      tabs
        .filter(tabB => tabB.textContent === tab.textContent)
        .forEach(tabB => tabB.click());
      changing = false;
    })
  );
})();
