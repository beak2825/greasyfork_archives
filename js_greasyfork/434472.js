// ==UserScript==
// @name        Keybindings
// @description Adds keybindings to Melvor Idle. Visit the Settings menu (X) to view all keybinds.
// @version     1.1.1
// @license     MIT
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @grant       none
// @namespace   https://github.com/ChaseStrackbein/melvor-keybindings
// @downloadURL https://update.greasyfork.org/scripts/434472/Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/434472/Keybindings.meta.js
// ==/UserScript==

window.kb = (() => {
  const invalidKeys = ['SHIFT', 'CONTROL', 'ALT', 'META'];
  let cachePage = window.currentPage;
  let previousPage = -1;
  let settingsGrid = null;
  let bindingBeingRemapped = null;

  let keymap = {};

  const keybindings = [
    {
      name: 'Menu',
      category: 'General',
      defaultKeys: { key: 'M' },
      callback: () => document.getElementById('page-header-user-dropdown').click()
    },
    {
      name: 'Save',
      category: 'General',
      defaultKeys: { key: 'S', ctrlKey: true },
      callback: () => forceSync(false, false)
    },
    {
      name: 'Reload / Character Select',
      category: 'General',
      defaultKeys: { key: 'F5' },
      callback: () => window.location.reload()
    },
    {
      name: 'Open Wiki',
      category: 'General',
      defaultKeys: { key: 'F1' },
      callback: () => window.open('https://wiki.melvoridle.com/', '_blank')
    },
    {
      name: 'Settings',
      category: 'General',
      defaultKeys: { key: 'X' },
      callback: () => changePage(CONSTANTS.page.Settings, false, false)
    },
    {
      name: 'Shop',
      category: 'General',
      defaultKeys: { key: 'V' },
      callback: () => changePage(CONSTANTS.page.Shop, false, false)
    },
    {
      name: 'Bank',
      category: 'General',
      defaultKeys: { key: 'B' },
      callback: () => changePage(CONSTANTS.page.Bank, false, false)
    },
    {
      name: 'Combat',
      category: 'General',
      defaultKeys: { key: 'C' },
      callback: () => changePage(CONSTANTS.page.Combat, false, false)
    },
    {
      name: 'Eat Equipped Food',
      category: 'General',
      defaultKeys: { key: 'H' },
      callback: () => player.eatFood()
    },
    {
      name: 'Loot All (Combat)',
      category: 'General',
      defaultKeys: { key: 'SPACE' },
      callback: () => combatManager.loot.lootAll()
    },
    {
      name: 'Run (Combat)',
      category: 'General',
      defaultKeys: { key: 'SPACE', ctrlKey: true },
      callback: () => combatManager.stopCombat()
    },
    {
      name: 'Equipment Set 1',
      category: 'General',
      defaultKeys: { key: '1', ctrlKey: true },
      callback: () => player.changeEquipmentSet(0)
    },
    {
      name: 'Equipment Set 2',
      category: 'General',
      defaultKeys: { key: '2', ctrlKey: true },
      callback: () => player.changeEquipmentSet(1)
    },
    {
      name: 'Equipment Set 3',
      category: 'General',
      defaultKeys: { key: '3', ctrlKey: true },
      callback: () => player.changeEquipmentSet(2)
    },
    {
      name: 'Equipment Set 4',
      category: 'General',
      defaultKeys: { key: '4', ctrlKey: true },
      callback: () => player.changeEquipmentSet(3)
    },
    {
      name: 'Search Bank',
      category: 'General',
      defaultKeys: { key: 'F', ctrlKey: true },
      callback: () => {
        changePage(CONSTANTS.page.Bank, false, false);
        updateBankSearchArray();
        document.getElementById('searchTextbox').focus();
      }
    },
    {
      name: 'Summoning Synergies Menu',
      category: 'General',
      defaultKeys: { key: 'S' },
      callback: () => {
        const modal = $('#modal-summoning-synergy').data('bs.modal');
        if (!modal || !modal._isShown) openSynergiesBreakdown();
        else modal.hide();
      }
    },
    {
      name: 'Search Summoning Synergies',
      category: 'General',
      defaultKeys: { key: 'F', ctrlKey: true, altKey: true },
      callback: () => {
        openSynergiesBreakdown();
        document.getElementById('summoning-synergy-search').focus();
      }
    },
    {
      name: 'Woodcutting',
      category: 'General',
      defaultKeys: { key: '1' },
      callback: () => changePage(CONSTANTS.page.Woodcutting, false, false)
    },
    {
      name: 'Fishing',
      category: 'General',
      defaultKeys: { key: '2' },
      callback: () => changePage(CONSTANTS.page.Fishing, false, false)
    },
    {
      name: 'Firemaking',
      category: 'General',
      defaultKeys: { key: '3' },
      callback: () => changePage(CONSTANTS.page.Firemaking, false, false)
    },
    {
      name: 'Cooking',
      category: 'General',
      defaultKeys: { key: '4' },
      callback: () => changePage(CONSTANTS.page.Cooking, false, false)
    },
    {
      name: 'Mining',
      category: 'General',
      defaultKeys: { key: '5' },
      callback: () => changePage(CONSTANTS.page.Mining, false, false)
    },
    {
      name: 'Smithing',
      category: 'General',
      defaultKeys: { key: '6' },
      callback: () => changePage(CONSTANTS.page.Smithing, false, false)
    },
    {
      name: 'Thieving',
      category: 'General',
      defaultKeys: { key: '7' },
      callback: () => changePage(CONSTANTS.page.Thieving, false, false)
    },
    {
      name: 'Farming',
      category: 'General',
      defaultKeys: { key: '8' },
      callback: () => changePage(CONSTANTS.page.Farming, false, false)
    },
    {
      name: 'Fletching',
      category: 'General',
      defaultKeys: { key: '9' },
      callback: () => changePage(CONSTANTS.page.Fletching, false, false)
    },
    {
      name: 'Crafting',
      category: 'General',
      defaultKeys: { key: '0' },
      callback: () => changePage(CONSTANTS.page.Crafting, false, false)
    },
    {
      name: 'Runecrafting',
      category: 'General',
      defaultKeys: { key: '!' },
      callback: () => changePage(CONSTANTS.page.Runecrafting, false, false)
    },
    {
      name: 'Herblore',
      category: 'General',
      defaultKeys: { key: '@' },
      callback: () => changePage(CONSTANTS.page.Herblore, false, false)
    },
    {
      name: 'Agility',
      category: 'General',
      defaultKeys: { key: '#' },
      callback: () => changePage(CONSTANTS.page.Agility, false, false)
    },
    {
      name: 'Summoning',
      category: 'General',
      defaultKeys: { key: '$' },
      callback: () => changePage(CONSTANTS.page.Summoning, false, false)
    },
    {
      name: 'Astrology',
      category: 'General',
      defaultKeys: { key: '%' },
      callback: () => changePage(CONSTANTS.page.Astrology, false, false)
    },
    {
      name: 'Alt. Magic',
      category: 'General',
      defaultKeys: { key: 'M', altKey: true },
      callback: () => changePage(CONSTANTS.page.AltMagic, false, false)
    },
    {
      name: 'Completion Log',
      category: 'General',
      defaultKeys: { key: 'Y' },
      callback: () => changePage(30, false, false)
    },
    {
      name: 'Statistics',
      category: 'General',
      defaultKeys: { key: 'F2' },
      callback: () => changePage(CONSTANTS.page.Statistics, false, false)
    },
    {
      name: 'Golbin Raid',
      category: 'General',
      defaultKeys: { key: 'G' },
      callback: () => changePage(CONSTANTS.page.GolbinRaid, false, false)
    },
    {
      name: 'Previous Page',
      category: 'General',
      defaultKeys: { key: 'BACKSPACE' },
      callback: () => changePage(previousPage, false, false)
    }
  ];

  const createHeader = () => {
    const header = document.createElement('h2');
    header.classList.add('content-heading', 'border-bottom', 'mb-4', 'pb-2');
    header.innerHTML = 'Keybindings';
    return header;
  };

  const createHelpText = () => {
    const helpText = document.createElement('div');
    helpText.classList.add('font-size-sm', 'text-muted', 'ml-2', 'mb-2');
    helpText.innerHTML = 'Click a keybinding to remap to new keys.<br />ESC or click again to cancel remapping.<br />CTRL + ALT + SPACE to clear the mapping.';
    return helpText;
  };
  
  const createWrapper = (grid) => {
    const row = document.createElement('div');
    row.classList.add('row');
    const column = document.createElement('div');
    column.classList.add('col-md-6', 'offset-md-3');
    const wrapper = document.createElement('div');
    wrapper.classList.add('mb-4');
    
    wrapper.appendChild(createHelpText());
    wrapper.appendChild(grid);
    wrapper.appendChild(createResetButton());
    column.appendChild(wrapper);
    row.appendChild(column);
    
    return row;
  };
  
  const createGrid = () => {
    const grid = document.createElement('div');
    grid.classList.add('mkb-grid');
    return grid;
  };
  
  const createRow = (keybinding) => {
    const row = document.createElement('div');
    row.classList.add('mkb-row');

    row.addEventListener('click', () => beginListeningForRemap(keybinding));
    const nameCell = createCell(keybinding.name);
    const keyCell = createCell(keybinding.keys);
    row.appendChild(nameCell);
    row.appendChild(keyCell);

    keybinding.keyCell = keyCell;

    return row;
  };
  
  const createCell = (keysOrText) => {
    const cell = document.createElement('div');
    cell.classList.add('mkb-cell');
    if (typeof keysOrText === 'string') cell.innerHTML = keysOrText;
    else {
      if (keysOrText.ctrlKey) {
        cell.appendChild(createKbd('CTRL'));
        cell.appendChild(createPlus());
      }
      if (keysOrText.altKey) {
        cell.appendChild(createKbd('ALT'));
        cell.appendChild(createPlus());
      }
      if (keysOrText.key) cell.appendChild(createKbd(keysOrText.key));
    }
    return cell;
  };
  
  const createKbd = (text) => {
    const kbd = document.createElement('kbd');
    kbd.innerHTML = text;
    return kbd;
  };
  
  const createPlus = () => {
    const plus = document.createTextNode('+');
    return plus;
  };

  const createResetButton = () => {
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.classList.add('btn', 'btn-sm', 'btn-danger', 'm-1');
    resetButton.innerHTML = 'Reset Default Keybindings';
    resetButton.addEventListener('click', resetDefaults);
    return resetButton;
  };

  const createStylesheet = () => {
    const stylesheet = document.createElement('style');
    stylesheet.innerHTML = 
    `.mkb-grid {
      background-color: #161a22;
      height: 300px;
      overflow-y: auto;
      width: 100%;
    }
    
    .mkb-row {
      cursor: pointer;
      display: flex;
    }
    
    .mkb-row:nth-of-type(even) {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    .mkb-row:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .mkb-row.mkb-listening {
      background-color: #577baa !important;
    }
    
    .mkb-cell {
      align-items: center;
      display: flex;
      flex: 1 1 auto;
      padding: 5px;
      width: 100%;
    }
    
    .mkb-grid kbd {
      background-color: hsl(210, 8%, 90%);
      border: 1px solid hsl(210, 8%, 65%);
      border-radius: 3px;
      box-shadow: 0 1px 1px hsla(210, 8%, 5%, 0.15),
        inset 1px 1px 0 #ffffff;
      color: hsl(210, 8%, 15%);
      font-size: 66%;
      margin: 0 5px;
      min-width: 26px;
      padding: 3px;
      text-align: center;
      text-shadow: #ffffff;
    }
    
    .mkb-grid kbd:first-of-type {
      margin-left: 0px;
    }
    
    .mkb-grid kbd:last-of-type {
      margin-right: 0px;
    }`;
    return stylesheet;
  };
  
  const inject = () => {
    const isGameLoaded = window.isLoaded && !window.currentlyCatchingUp;
      
    if (!isGameLoaded) {
      setTimeout(inject, 50);
      return;
    }

    const grid = createGrid();
    keybindings.forEach(k => {
      k.row = createRow(k);
      grid.appendChild(k.row);
    });

    settingsGrid = grid;

    const notifications = Array.from(document.querySelectorAll('#settings-container h2')).find(e => e.textContent === 'Notification Settings');
    notifications.parentNode.insertBefore(createHeader(), notifications);
    notifications.parentNode.insertBefore(createWrapper(grid), notifications);
    document.head.appendChild(createStylesheet());
  };

  const beginListeningForRemap = (keybinding) => {
    if (keybinding === bindingBeingRemapped) {
      endListeningForRemap();
      return;
    }
    endListeningForRemap();
    keybinding.row.classList.add('mkb-listening');
    bindingBeingRemapped = keybinding;
  };

  const endListeningForRemap = () => {
    if (!bindingBeingRemapped) return;
    bindingBeingRemapped.row.classList.remove('mkb-listening');
    bindingBeingRemapped = null;
  };

  const resetDefaults = () => {
    const reset = [];
    keybindings.forEach(k => {
      const conflict = keybindings.some(kb => reset.includes(kb.name) && parseKeypress(kb.keys) === parseKeypress(k.defaultKeys));
      reset.push(k.name);
      remap(conflict ? {} : k.defaultKeys, k);
    });
  };

  const remap = (keys, keybinding) => {
    if (keys.key) {
      const conflict = keybindings.find(k => k.name !== keybinding.name && parseKeypress(k.keys) === parseKeypress(keys));
      if (conflict) remap({}, conflict);
    }
    keybinding.keys = keys;
    if (settingsGrid !== null) {
      const keyCell = createCell(keys);
      keybinding.row.replaceChild(keyCell, keybinding.keyCell);
      keybinding.keyCell = keyCell;
    }

    saveData();
    updateKeymap();
  };

  const updateKeymap = () => {
    keymap = {};
    keybindings.forEach(k => {
      const keypress = parseKeypress(k.keys);
      if (keypress) keymap[keypress] = k.callback
    });
  };

  const toKeys = (e) => {
    if (!e.key) return {};
    let key = e.key.toUpperCase();
    if (key === 'ESCAPE') key = 'ESC';
    else if (key === ' ') key = 'SPACE';
    else if (key === '\n') key = 'ENTER';
    return { key, ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey };
  };

  const parseKeypress = (e) => {
    if (!e.key) return '';
    if (invalidKeys.includes(e.key)) return '';

    let keys = [];
    if (e.ctrlKey) keys.push('CTRL');
    if (e.altKey) keys.push('ALT');
    keys.push(e.key.toUpperCase());

    return keys.join('+');
  };

  const doNotTriggerKeybind = (e) => {
    return e.target.tagName == 'INPUT'
      || e.target.tagName == 'SELECT'
      || e.target.tagName == 'TEXTAREA'
      || e.target.isContentEditable; 
  };

  const saveData = () => {
    const data = keybindings.map(k => ({ bindTo: k.name, keys: k.keys }));
    const existingData = getSavedData();
    existingData.forEach(d => {
      if (!data.some(dt => dt.bindTo === d.bindTo))
        data.push(d);
    });
  localStorage.setItem('MKB-data', JSON.stringify(data));
  };

  const loadData = () => {
    const data = getSavedData();
    data.forEach(k => {
      const match = keybindings.find(kb => kb.name === k.bindTo);
      if (match) match.keys = k.keys;
    });
    keybindings.filter(k => !k.keys).forEach(k => k.keys = k.defaultKeys);
  };

  const getSavedData = () => {
    const dataJson = localStorage.getItem('MKB-data');
    if (!dataJson) return [];
    return JSON.parse(dataJson);
  };

  const onKeyPress = (e) => {
    if (doNotTriggerKeybind(e)) return true;
    if (e.repeat) return true;
    const keysPressed = parseKeypress(toKeys(e));
    if (!keysPressed) return true;

    if (bindingBeingRemapped) {
      if (e.key !== 'Escape') {
        if (e.ctrlKey && e.altKey && e.key === ' ') remap({}, bindingBeingRemapped);
        else remap(toKeys(e), bindingBeingRemapped);
      }
      endListeningForRemap();
      e.preventDefault();
      return false;
    }

    if (!keymap[keysPressed]) return true;

    e.preventDefault();
    keymap[keysPressed]();
    return false;
  };

  const trackCurrentPage = () => {
    if (window.currentPage === undefined) return;
    if (currentPage === cachePage) return;
      
    endListeningForRemap();
    previousPage = cachePage;
    cachePage = currentPage;
  };

  const initialize = () => {
    if (window.kb) return;

    console.log('Initializing Keybindings...');
    loadData();
    updateKeymap();
    document.addEventListener('keydown', onKeyPress);
    inject();
    setInterval(trackCurrentPage, 10);
    console.log('Keybindings initialized.');
  };

  const register = (name, category, defaultKeys, callback) => {
    if (typeof callback !== 'function') throw `Expected type of callback is function, instead found ${typeof callback}.`;

    const conflictingName = keybindings.find(k => k.name === name);
    if (conflictingName) throw `A keybinding with the name "${name}" already exists. Please select another name and try again.`;

    let keys = defaultKeys;
    if (defaultKeys && defaultKeys.key) {
      const conflictingKeys = keybindings.find(k => parseKeypress(k.keys) === parseKeypress(defaultKeys));
      if (conflictingKeys) {
        keys = {};
        console.warn(`A keybinding matching ${parseKeypress(defaultKeys)} already exists. "${name}" will be unbound by default.`);
      }
    }

    const keybinding = { name, category, defaultKeys, keys, callback };
    keybindings.push(keybinding);
    if (settingsGrid !== null) {
      keybinding.row = createRow(keybinding);
      settingsGrid.appendChild(keybinding.row);
    }
    
    const savedData = getSavedData().find(d => d.bindTo === name);
    if (savedData) remap(savedData.keys, keybinding);
    updateKeymap();
  };

  initialize();

  return {
    register,
  };
})();
