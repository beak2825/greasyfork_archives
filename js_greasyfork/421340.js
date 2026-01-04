// ==UserScript==
// @name         CursedForge
// @namespace    Fourmisain
// @version      0.1.1
// @description  Keep CurseForge's "Game Version" filter when searching
// @author       Fourmisain
// @match        https://www.curseforge.com/*
// @license      CC0-1.0; https://creativecommons.org/publicdomain/zero/1.0/legalcode
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421340/CursedForge.user.js
// @updateURL https://update.greasyfork.org/scripts/421340/CursedForge.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // "Game Version", which for Minecraft can also be Fabric or Forge
  const filter = new URL(document.location).searchParams.get('filter-game-version');
  if (!filter) return;

  function addFormFilter(form) {
    // add hidden input which adds the current "Game Version" filter
    const input = document.createElement('INPUT');
    input.name = 'filter-game-version';
    input.value = filter;
    input.type = 'hidden';
    // may not be needed:
    input.class = 'valid';
    input.ariaInvalid = 'false';

    form.appendChild(input);
  }

  // find search form on search page
  const searchForms = document.getElementsByClassName('search-form');
  if (searchForms.length === 1) {
    addFormFilter(searchForms[0]);
    return;
  }

  // find search form on main mods page
  for (const form of document.getElementsByTagName('form')) {
    if (form.classList.contains('h-full')) {
      addFormFilter(form);
      return;
    }
  }

})();
