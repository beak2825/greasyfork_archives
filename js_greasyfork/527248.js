// ==UserScript==
// @name         Lehrgangsnummerierung
// @namespace    leeSalami.lss
// @version      1.0
// @description  Erlaubt die Lehrgänge in den Schulen zu nummerieren.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/buildings/*
// @exclude      /new$/
// @exclude      /personals$/
// @exclude      /edit$/
// @exclude      /move$/
// @exclude      /hire$/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527248/Lehrgangsnummerierung.user.js
// @updateURL https://update.greasyfork.org/scripts/527248/Lehrgangsnummerierung.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const radioLabels = document.querySelectorAll('form[action$="/education"] > h3 ~ div.radio > label');
  const buildingType = document.querySelector('h1[building_type]')?.getAttribute('building_type');

  if (radioLabels.length === 0 || !buildingType) {
    return;
  }

  for (let i = 0, n = radioLabels.length; i < n; i++) {
    const key = `${buildingType}_${radioLabels[i].getAttribute('for')}`;
    radioLabels[i].insertAdjacentElement('beforeend', await createInput(key));
  }

  async function createInput(key) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '99';
    input.value = await GM.getValue(key, '0');
    input.style.height = '20px';
    input.addEventListener('change', (e) => GM.setValue(key, e.target.value));

    return input;
  }
})();
