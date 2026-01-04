// ==UserScript==
// @name         Validate Chain Fields
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Validate Chain
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536459/Validate%20Chain%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/536459/Validate%20Chain%20Fields.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const validEntries = {
    Yellow: {
      id: 'Cable-yellow-gold-02_20-default-chains',
      name: 'Cable yellow gold 02_20 default chains',
      groups: ['material:yellow', 'type:necklaces'],
    },
    Rose: {
      id: 'Cable-rose-gold-02_20-default-chains',
      name: 'Cable rose gold 02_20 default chains',
      groups: ['material:rose', 'type:necklaces'],
    },
    Silver: {
      id: 'Cable-silver-02_20-default-chains',
      name: 'Cable silver 02_20 default chains',
      groups: ['material:silver', 'material:white', 'type:necklaces'],
    },
  };

  function setGroupNames(groupList) {
    const select = document.getElementById('SelectedGroupNames');
    if (!select) return;
    [...select.options].forEach(opt => (opt.selected = false));
    groupList.forEach(val => {
      const option = [...select.options].find(opt => opt.value === val);
      if (option) option.selected = true;
    });
    if (window.jQuery) {
      jQuery(select).trigger('chosen:updated');
    }
  }

  function getSelectedGroupNames() {
    const select = document.getElementById('SelectedGroupNames');
    if (!select) return [];
    return [...select.selectedOptions].map(opt => opt.value);
  }

  function validateInputs() {
    const externalInput = document.getElementById('ExternalId');
    const nameInput = document.getElementById('CurrentName');
    const groupSelect = document.getElementById('SelectedGroupNames');

    const validIds = Object.values(validEntries).map(e => e.id);
    const validNames = Object.values(validEntries).map(e => e.name);
    const selectedGroups = getSelectedGroupNames();

    if (externalInput && !validIds.includes(externalInput.value.trim())) {
      externalInput.style.border = '2px solid red';
    } else if (externalInput) {
      externalInput.style.border = '';
    }

    if (nameInput && !validNames.includes(nameInput.value.trim().replace(/&quot;/g, '"'))) {
      nameInput.style.border = '2px solid red';
    } else if (nameInput) {
      nameInput.style.border = '';
    }

    let match = false;
    for (const entry of Object.values(validEntries)) {
      const expected = [...entry.groups].sort().join(',');
      const current = [...selectedGroups].sort().join(',');
      if (expected === current) {
        match = true;
        break;
      }
    }

    if (groupSelect && groupSelect.parentElement) {
      groupSelect.parentElement.style.border = match ? '' : '2px solid red';
    }
  }

  function insertButtons() {
    const container = document.getElementById('productExamplesBtn');
    if (!container || container.querySelector('.tamper-buttons')) return;

    const span = container.querySelector('span');
    if (!span) return;

    const wrapper = document.createElement('span');
    wrapper.className = 'tamper-buttons';

    ['Yellow', 'Rose', 'Silver'].forEach(color => {
      const btn = document.createElement('button');
      btn.textContent = color;
      btn.style.marginLeft = '6px';
      btn.style.fontSize = '12px';
      btn.style.padding = '2px 6px';
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', () => {
        const entry = validEntries[color];
        const externalInput = document.getElementById('ExternalId');
        const nameInput = document.getElementById('CurrentName');
        if (externalInput) externalInput.value = entry.id;
        if (nameInput) nameInput.value = entry.name;
        setGroupNames(entry.groups);
        validateInputs();
      });

      wrapper.appendChild(btn);
    });

    span.after(wrapper);
  }

  // 🔁 Периодическая проверка до полной инициализации
  const initInterval = setInterval(() => {
    const ext = document.getElementById('ExternalId');
    const name = document.getElementById('CurrentName');
    const group = document.getElementById('SelectedGroupNames');
    const chosen = document.getElementById('SelectedGroupNames_chosen');

    if (ext && name && group && chosen && window.jQuery) {
      clearInterval(initInterval);
      insertButtons();
      validateInputs();

      // Автовалидация при изменении вручную
      ext.addEventListener('input', validateInputs);
      name.addEventListener('input', validateInputs);
      jQuery(group).on('change', validateInputs);
    }
  }, 500);
})();
