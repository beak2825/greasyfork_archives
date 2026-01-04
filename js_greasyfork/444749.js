// ==UserScript==
// @name         Google Searching Tags Box
// @version      2.2.0
// @description  Make your searches easier by adding tags to your search queries with one click
// @author       OpenDec
// @match        https://www.google.com/*
// @match        https://www.google.co.jp/*
// @match        https://www.google.co.uk/*
// @match        https://www.google.es/*
// @match        https://www.google.ca/*
// @match        https://www.google.de/*
// @match        https://www.google.it/*
// @match        https://www.google.fr/*
// @match        https://www.google.com.au/*
// @match        https://www.google.com.tw/*
// @match        https://www.google.nl/*
// @match        https://www.google.com.br/*
// @match        https://www.google.com.tr/*
// @match        https://www.google.be/*
// @match        https://www.google.com.gr/*
// @match        https://www.google.co.in/*
// @match        https://www.google.com.mx/*
// @match        https://www.google.dk/*
// @match        https://www.google.com.ar/*
// @match        https://www.google.ch/*
// @match        https://www.google.cl/*
// @match        https://www.google.at/*
// @match        https://www.google.co.kr/*
// @match        https://www.google.ie/*
// @match        https://www.google.com.co/*
// @match        https://www.google.pl/*
// @match        https://www.google.pt/*
// @match        https://www.google.com.pk/*
// @include      https://www.google.tld/*
// @icon         data:image/png;base64,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
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/873547
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444749/Google%20Searching%20Tags%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/444749/Google%20Searching%20Tags%20Box.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

window.addEventListener('DOMContentLoaded', function stageReady(){
'use strict';

// --------------------------------------------------
// ---                    INIT                    ---
// --------------------------------------------------

addGlobalStyle(css(getColorMode(isDarkRGB(RGBCSS2Obj(window.getComputedStyle(document.body).backgroundColor)) ? 'dark' : 'light')));

const _input = document.querySelector('input.gLFyf, textarea.gLFyf, #REsRA'),
_container = document.querySelector('div[jsname=RNNXgb]'),
_tagsBoxWrapper = document.createElement('div'),
_tagsBox = document.createElement('div'),
_deletingZone = document.createElement('div'),
_contextMenu = document.createElement('div'),
_inputFile = document.createElement('input'),
_arrTags = [],
_actions = {},
_settings = {},
_defaultSettings = {tagsWidth: 'S', labelsCase: 'a'},
_paramsKeys = {S: 'tagsWidth', L: 'tagsWidth', A: 'tagsWidth', a: 'labelsCase', c: 'labelsCase', C: 'labelsCase'};
/* _paramsKeys values:
  S: Small tags width
  L: Large tags width
  A: Auto tags width
  a: Labels with letter-case as typed by the user
  c: Lowercase labels
  C: Uppercase labels
*/
let _tagIdCounter = 0,
_draggedItem = null,
_draggedData = null,
_dragenterBoxCounter = 0,
_history,
_inputFocusInit;

_input.addEventListener('focus', function(){
  _inputFocusInit = true;
});

// --------------------------------------------------
// ---                PAGE DRAWING                ---
// --------------------------------------------------

_tagsBoxWrapper.id = 'od-tagsbox-wrapper';
_tagsBox.id = 'od-tagsbox';
_tagsBoxWrapper.appendChild(_tagsBox);
_container.parentNode.insertBefore(_tagsBoxWrapper, _container.nextSibling);

function updatePage(str, options = {}){
  const res = updateData(str, options);
  applyParam('tagsWidth');
  applyParam('labelsCase');
  redrawBox(options);
  saveData();
  if (res.error){
    fxGlowErr(_tagsBox);
    modal(res.error);
  } else if (options.glow) fxGlow(_tagsBox);
  return res;
}
function redrawBox(options = {}){
  let delay = 0;
  let index = 0;
  const arrRemoved = [];
  const items = [..._arrTags];

  const plus = document.getElementById('od-addtag');
  if (plus) index = getItemIndex(plus);
  else {
    items.splice(options.plusIndex || 0, 0, {action: 'add', id: 'od-addtag', color: options.plusColor});
  }

  items.forEach(tag=>{
    if (tag.action === 'remove'){
      arrRemoved.push(tag);
    } else if (tag.action === 'update'){
      fxGlow(setItem(tag));
    } else if (tag.action === 'add'){
      if (options.noFxIn) addItem(tag, ++index);
      else {
        (options.noSlideIn ? fxFadein : fxSlideFadein)(addItem(tag, ++index), 400, delay);
        delay += 30;
      }
    }
    delete tag.action;
  });
  arrRemoved.forEach(tag=>{
    removeItem(tag);
  });
}
function applyParam(param, key){
  if (key) setParam(param, key);
  else key = _settings[param] || _defaultSettings[param];
  // Remove the class with the specific prefix from the BOX and reapply it with the new key
  _tagsBox.className = _tagsBox.className.replace(new RegExp('(^| )' + param + '-[^ ]($| )'), ' ');
  _tagsBox.classList.add(param + '-' + key);
  // Select context menu item
  const old = _contextMenu.querySelector('li[data-group="' + param + '"].od-checked');
  if (old) old.classList.remove('od-checked');
  _contextMenu.querySelector('li[data-group="' + param + '"][data-key="' + key + '"]').classList.add('od-checked');
}

// --------------------------------------------------
// ---           DRAG-AND-DROP SETTINGS           ---
// --------------------------------------------------

// BOX HANDLERS

_tagsBox.addEventListener('dragenter', function (e){
  e.preventDefault();
  e.dataTransfer.dropEffect = _draggedItem ? 'move' : _draggedData ? 'copy' : 'none' ;
});
_tagsBox.addEventListener('dragover', function (e){
  e.preventDefault();
  e.dataTransfer.dropEffect = _draggedItem ? 'move' : _draggedData ? 'copy' : 'none' ;
});

// ITEMS HANDLERS

function itemDragstart (e){
  if (!e.target.matches('.od-item:not(.od-edit-tag)')){
    e.preventDefault();
    return false;
  }
  e.dataTransfer.effectAllowed = "move";
  _deletingZone.classList.add('od-dragging');
  _tagsBox.classList.add('od-dragging-item');
  _draggedItem = e.target;
  _draggedItem.classList.add('od-draggeditem');
  _draggedItem.dataset.startingIndex = getItemIndex(_draggedItem);
}
function itemDragend (e){
  const startingIndex = +_draggedItem.dataset.startingIndex;
  const currentIndex = getItemIndex(_draggedItem);
  const belowitem = _tagsBox.querySelector('.od-belowitem');
  if (currentIndex !== startingIndex){
    if (e.dataTransfer.dropEffect === 'none'){
      // If ESC was pressed or the drop target is invalid, cancel the move
      _tagsBox.insertBefore(_draggedItem, _tagsBox.children[+(currentIndex < startingIndex) + startingIndex]);
    } else if (_draggedItem.id === 'od-addtag'){
      _history.add();
    } else if (belowitem !== null){
      // Reorder and save the data
      _arrTags.length = 0;
      [..._tagsBox.children].forEach(function(tag){
        if (!tag.dataset.text) return;
        _arrTags.push({
          label: tag.dataset.label,
          text: tag.dataset.text,
          color: tag.dataset.color,
          id: tag.id
        });
      });
      saveData();
    }
  }
  if (belowitem) belowitem.classList.remove('od-belowitem');
  delete _draggedItem.dataset.startingIndex;
  _draggedItem.classList.remove('od-draggeditem');
  _draggedItem = null;
  _deletingZone.classList.remove('od-dragging', 'od-dragging-hover');
  _tagsBox.classList.remove('od-dragging-item');
}
function itemDragenter (e){
  e.preventDefault();
  if (_draggedItem === null && _draggedData === null) e.dataTransfer.effectAllowed = "none";
  if (_draggedItem === null) return false;
  let swapItem = e.target;
  swapItem.classList.add('od-belowitem');
  swapItem = swapItem === _draggedItem.nextSibling ? swapItem.nextSibling : swapItem;
  _tagsBox.insertBefore(_draggedItem, swapItem);
}
function itemDragleave (e){
  e.target.classList.remove('od-belowitem');
}
function itemDragover (e){
  e.preventDefault();
  e.dataTransfer.dropEffect = _draggedItem === null && _draggedData === null ? 'none' : 'move';
}
function setDraggable(item, b=true){
  item.draggable = b;
}

// TAG DELETING ZONE

_deletingZone.id = 'od-deletingZone';
_tagsBoxWrapper.appendChild(_deletingZone);

_deletingZone.addEventListener('dragenter', function (e){
  e.preventDefault();
  if (_draggedItem.id !== 'od-addtag') _deletingZone.classList.add('od-dragging-hover');
});
_deletingZone.addEventListener('dragleave', function (e){
  e.preventDefault();
  _deletingZone.classList.remove('od-dragging-hover');
});
_deletingZone.addEventListener('dragover', function (e){
  e.preventDefault();
  e.dataTransfer.dropEffect = _draggedItem.id === 'od-addtag' ? 'none' : 'move';
});
_deletingZone.addEventListener('drop', function (e){
  e.preventDefault();
  if (_draggedItem.id !== 'od-addtag'){
    removeItem(getTagById(_draggedItem.id));
    saveData();
  }
});

// --------------------------------------------------
// ---                INPUT FILE                ---
// --------------------------------------------------

_inputFile.id = 'od-inputFile';
_inputFile.type = 'file';
_inputFile.style = 'display:none';
_inputFile.accept = '.txt';
_inputFile.addEventListener('change', function (){ importData(this.files); });
_tagsBoxWrapper.appendChild(_inputFile);

// --------------------------------------------------
// ---                CONTEXT MENU                ---
// --------------------------------------------------

_contextMenu.id = 'od-contextMenu';
_contextMenu.innerHTML = `<ul>
<li><span><i>🔠</i> Tag properties</span>
  <ul>
  <li data-action="setText" class="od-over-tag"><span><i>✏️</i> Tag text<kbd>Shift + Click</kbd></span>
  <li data-action="setLabel" class="od-over-tag"><span><i>🏷️</i> Custom label <kbd>Alt + Click</kbd></span>
  <li data-action="setColor" class="od-over-tag od-over-plus"><span><i id="od-setcolor"></i> Color <kbd>Ctrl + Click</kbd></span>
  </ul>
<li></li>
<li><span><i>🧰</i> Edit</span>
  <ul>
  <li data-action="undo" id="od-contextMenu-undo"><span><i>↶</i> Undo <kbd>Ctrl + Z</kbd></span>
  <li data-action="redo" id="od-contextMenu-redo"><span><i>↷</i> Redo <kbd>Ctrl + Y</kbd></span>
  <li></li>
  <li data-action="copyTags"><span><i>📋</i> Copy Tags <kbd>Ctrl + C</kbd></span>
  <li data-action="pasteTags"><span><i>📌</i> Paste Tags <kbd>Ctrl + V</kbd></span>
  <li></li>
  <li data-action="clearBox"><span><i>🗑️</i> Clear the Tags Box</span>
  </ul>
<li></li>
<li data-action="importTags"><span><i>📂</i> Import Tags from txt</span>
<li data-action="exportTags"><span><i>💾</i> Export Tags as txt</span>
<li></li>
<li><span><i>📐</i> Tags width</span>
  <ul>
  <li class="od-checkable" data-group="tagsWidth" data-key="S"><i>◻</i> Small Tags width
  <li class="od-checkable" data-group="tagsWidth" data-key="L"><i>▭</i> Large Tags width
  <li class="od-checkable" data-group="tagsWidth" data-key="A"><i>⇿</i> Auto Tags width
  </ul>
<li><span><i>Aa</i> Label case</span>
  <ul>
  <li class="od-checkable" data-group="labelsCase" data-key="a"><i>Aa</i> As it is
  <li class="od-checkable" data-group="labelsCase" data-key="c"><i>aa</i> Lowercase
  <li class="od-checkable" data-group="labelsCase" data-key="C"><i>AA</i> Uppercase
  </ul>
</ul>`;

_tagsBox.addEventListener('contextmenu', contextMenuOpen);
onoffListeners(_contextMenu, 'mousedown contextmenu wheel', function(e){
  e.preventDefault();
  e.stopPropagation();
}, true);

_contextMenu.querySelector('ul').addEventListener('mouseup', contextMenuClick);
_tagsBoxWrapper.appendChild(_contextMenu);

function contextMenuOpen(e){
  const item = e.target;
  if (item.tagName.toLowerCase() === 'input') return;
  e.preventDefault();
  const isOverItem = item.classList.contains('od-item');
  const isOverPlus = item.id === 'od-addtag';
  // Toggle functions for the active BOX item
  _contextMenu.querySelectorAll('li.od-over-tag').forEach(function(li){
    li.classList.toggle('od-disabled', !isOverItem || isOverPlus && !li.classList.contains('od-over-plus'));
  });
  if (isOverItem){
    activateItem(item);
    document.getElementById('od-setcolor').style.color = '#' + item.dataset.color;
  }
  // Toggle undo/redo functions
  document.getElementById('od-contextMenu-undo').classList.toggle('od-disabled', _history.done.length <= 1);
  document.getElementById('od-contextMenu-redo').classList.toggle('od-disabled', _history.reverted.length === 0);

  keepBoxOpen();

  // Init position
  const x = e.clientX - 1;
  const y = e.clientY - 1;
  _contextMenu.style = 'top: ' + y + 'px; left: ' + x + 'px';
  _contextMenu.classList.add('open');

  // Fix position to prevent overflow
  const rect = _contextMenu.getBoundingClientRect();
  const fixX = Math.max(0, Math.round(x - Math.max(0, rect.right - window.innerWidth)));
  const fixY = rect.bottom > window.innerHeight ? Math.max(0, Math.round(rect.top - _contextMenu.offsetHeight)) : y;
  _contextMenu.style = 'top: ' + fixY + 'px; left: ' + fixX + 'px';

  _contextMenu.querySelectorAll(':scope > ul > li > ul').forEach(function(sub){
    const item = sub.parentElement;
    item.classList.remove('od-sub-left');
    const rect = sub.getBoundingClientRect();
    if (rect.right > window.innerWidth) item.classList.add('od-sub-left');
  });

  // Enable closing listeners
  setTimeout(function(){
    onoffListeners(window, 'wheel resize blur mousedown contextmenu', contextMenuClose, true);
  }, 1);
  _contextMenu.addEventListener('keydown', contextMenuEsc);
}
function contextMenuEsc(e){
  if (e.keyCode === 27) contextMenuClose();
}
function contextMenuClose(){
  unlockBoxOpen();
  deactivateItem();

  setTimeout(function(){
    _contextMenu.classList.remove('open');
    _contextMenu.removeAttribute('style');
    onoffListeners(window, 'wheel resize blur mousedown contextmenu', contextMenuClose, false);
  }, 1);
  _contextMenu.removeEventListener('keydown', contextMenuEsc);
}
function contextMenuClick(e){
  e.preventDefault();
  e.stopPropagation();
  if (_contextMenu.querySelector('ul').contains(e.target)){
    const menuItem = e.target.closest('li[data-action], li.od-checkable');
    if (!menuItem) return;
    if (menuItem.classList.contains('od-checkable')) _actions.checkItem(menuItem);
    if (menuItem.dataset.action) _actions[menuItem.dataset.action]();
    contextMenuClose();
  }
}

// --------------------------------------------------
// ---            CONTEXT MENU ACTIONS            ---
// --------------------------------------------------

_actions.setText = function(){
  editTagText(getActiveItem());
};
_actions.setLabel = function(){
  editTagLabel(getActiveItem());
};
_actions.setColor = function(){
  openColorPicker(getActiveItem());
};
_actions.undo = function(){
  _history.undo();
};
_actions.redo = function(){
  _history.redo();
};
_actions.copyTags = function(){
  // Exit if no data to copy
  if (_arrTags.length === 0) return;

  const str = encodeData();
  clipboardCopy(str)
    .then(function(){
      fxGlow(_tagsBox);
    })
    .catch(function(){
      // Cannot write on clipboard
      modal(50);
      // Allow to copy the data from the search field
      _input.value = str;
    })
  ;
};
_actions.pasteTags = function(){
  clipboardPaste()
    .then(function(str){
      updatePage(str, {glow: true, from: 'paste'});
    })
    .catch(function(){
      // Cannot read clipboard data
      modal(60);
    })
  ;
};
_actions.importTags = function(){
  _inputFile.value = null;
  _inputFile.click();
};
_actions.exportTags = function(){
  exportData(encodeData());
};
_actions.clearBox = function(){
  const addtag = document.getElementById('od-addtag');
  _arrTags.length = 0;
  _tagsBox.innerHTML = '';
  _tagsBox.append(addtag);
  saveData();
  fxGlow(_tagsBox);
};
_actions.checkItem = function(menuItem){
  if (menuItem.dataset.group){
    // If group, select this item
    applyParam(menuItem.dataset.group, menuItem.dataset.key);
    saveData();
  } else {
    // If single item, toggle check
    menuItem.classList.toggle('od-checked');
  }
};

// --------------------------------------------------
// ---             GENERIC FUNCTIONS              ---
// --------------------------------------------------

function isNothingFocused(denyIfTextFieldsFocused){
  // Returns TRUE if nothing is selected on the page
  const actEl = document.activeElement;
  return (
    (
      !(// check if there are no focused fields
        denyIfTextFieldsFocused &&
        actEl &&
        (
          actEl.tagName.toLowerCase() === 'input' &&
          actEl.type == 'text' ||
          actEl.tagName.toLowerCase() === 'textarea'
        )
      ) &&
      (actEl.selectionStart === actEl.selectionEnd)
    ) &&
    ['none', 'caret'].includes(window.getSelection().type.toLowerCase())
  );
}
function onoffListeners(element, events, listener, flag){
  const ev = events.trim().split(/ +/);
  for (let i = 0; i < ev.length; i++){
      element[(flag ? 'add' : 'remove') + 'EventListener'](ev[i], listener);
  }
}

// --------------------------------------------------
// ---              DATA MANAGEMENT               ---
// --------------------------------------------------

function encodeData(settings = _settings, tags = _arrTags){
  let strParams = '';
  Object.keys(settings).forEach(function(k){
    if (settings[k] != _defaultSettings[k]) strParams += settings[k];
  });
  return ':tags' +
  (strParams ? '['+ strParams +']' : '')+
  ':' +
  tags.map(function(e){
    return (e.label ? e.label + '::' : '') + e.text + '#' + e.color;
  }).join('');
}
function decodeData(str){
  const res = {params: null, tags: [], error: null, buttonColor: ''};
  let arrTags = [];
  if (str == null) return res;
  str = str.trim().replace(/  +/g, ' ');
  if (str === ''){
    // Empty data
    res.error = 11;
    return res;
  } else if (isTagsPacket(str)){
    // If the :tags: prefix is found (in the first line), retrieve parameters and TAGs
    const matches = str.match(/^\s*:tags(\[(.*)])?:(.*)(?:\r?\n|$)/);
    if (matches[1] != null){
      // If params block found
      res.params = {};
      const keys = matches[2];
      let i = keys.length;
      let k;
      while (i--){
        k = getParamByKey(keys[i]);
        if (k) res.params[k] = keys[i];
      }
    }
    arrTags = matches[3] ? matches[3].split('') : [];
  } else {
    // If plain text, each line of the string is taken as a TAG
    arrTags = str.split(/\r?\n/);
  }
  res.tags = arrTags.reduce(function(a, b){
    const matches = b.match(/^(?:\s*(.*?)\s*::)?\s*((?:^\s*[0-9a-f]{6})|.*?)\s*(?:#?([0-9a-f]{6}))?$/);
    if (matches){

      // Return color for ADD button
      if (!matches[1] && !matches[2] && arrTags.length === 1) res.buttonColor = matches[3];
      // Include valid TAGs
      else a.push({label: matches[1], text: matches[2], color: matches[3]});
    }
    return a;
  }, []);
  // If no valid data was found, report "unknoun data format" error
  if (res.tags.length === 0 && res.params == null && res.buttonColor === '') res.error = 10;
  return res;
}
// Update all TAGs through the specified command string
function updateData(str, options = {}){
  const data = decodeData(str);
  const plus = document.getElementById('od-addtag');
  const res = {
    newTags: [],
    error: data.error,
    buttonColor: data.buttonColor,
    keepButtonColor: options.from === 'add-button' ? (data.tags.length === 1 && !!data.tags[0].color) : _arrTags.length > 0
  };
  // Update settings if BOX is empty or no TAG to add
  if (data.params !== null && _arrTags.length === 0 || data.tags.length === 0){
    Object.keys(_defaultSettings).forEach(function(param){
      setParam(param, data.params ? data.params[param] : _settings[param]);
    });
  }
  // Merge the new data with the existing ones
  if (data.tags.length){
    const newTags = [];
    let badTagCounter = 0;
    data.tags.forEach(tag=>{
      let exist = getTags(tag.label, tag.text);
      if (exist){
        // Mark duplicate TAGs as to be removed
        if (exist.withLabel && exist.withText) exist.withText.action = 'remove';
        // Mark existing TAGs as to be updated
        exist = exist.withLabel || exist.withText;
        exist.action = 'update';
        if (tag.label !== undefined && (exist.label || false) !== (tag.label || false)){
          exist.label = tag.label || undefined;
          res.keepButtonColor = true;
        }
        if (tag.text && tag.text !== exist.text){
          exist.text = tag.text;
          res.keepButtonColor = true;
        }
        exist.color = options.from === 'add-button' ? tag.color || (data.tags.length === 1 && options.color) || exist.color : exist.color;
      } else if (tag.text !== ''){
        // Mark new TAGs as to be added
        tag.action = 'add';
        tag.color = tag.color || options.color || randomColor();
        tag.id = 'od-tagref-' + _tagIdCounter++;
        newTags.push(tag);
      } else {
        ++badTagCounter;
      }
    });
    if (badTagCounter === data.tags.length) {
        // If no valid TAGs are found, return the "unknown data format" error.
        res.error = 10;
    } else if (newTags.length){
      res.newTags = newTags;
      // Consider the position of the ADD button as the index to insert new TAGs
      const index = plus ? getItemIndex(plus) : 0;
      // Insert new TAGs
      _arrTags.splice(index, 0, ...newTags);
    }
  }
  return res;
}
// Updates the specific TAG. Other involved TAGs can be edited or removed
function updateTag(tag, label, text){
  // Purge values to avoid format conflicts
  label = label.trim().replace(/  +/g, ' ');
  if (label) label = decodeData(label + '::foo').tags[0].label;
  text = (decodeData(text).tags[0] || {text: ''}).text;

  // Remove TAG if text is empty
  if (text === ''){
    tag.action = 'remove';
    return;
  }

  let exist = getTags(label, text);
  if (exist){
    if (exist.withLabel){
      exist.withLabel.label = '';
      exist.withLabel.action = 'update';
    }
    if (exist.withText) exist.withText.action = 'remove';
  }

  tag.label = label;
  tag.text = text;
  tag.action = 'update';
}
function getTagById(id){
  return _arrTags.find(tag=>tag.id === id);
}
// Returns an object of existing TAGs by label and text
function getTags(label, text){
  let withLabel, withText;
  if (label) withLabel = _arrTags.find(tag=>tag.label && tag.label === label);
  if (text) withText = _arrTags.find(tag=>tag.text && tag.text.toLowerCase() === text.toLowerCase());
  return (withLabel || withText) ? {withLabel: withLabel, withText: withLabel && withLabel === withText ? null : withText} : null;
}
// Stores data via GM APIs and keeps it backed up with Web Storage Objects
async function saveData(){
  const str = encodeData();
  if (str === ':tags:'){
    localStorage.removeItem('odtagsbox');
    if (!!GM) await GM.deleteValue('odtagsbox');
  } else {
    _history.add(str);
    localStorage.setItem('odtagsbox', str);
    if (!!GM) await GM.setValue('odtagsbox', str);
  }
}
function importData(files){
  if (window.FileReader){
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function (){
      updatePage(reader.result, {glow: true, from: 'import'});
    });
    reader.addEventListener('error', function (e){
      // Cannot read this file
      if (e.target.error.name == 'NotReadableError') modal(21);
    });
    reader.readAsText(file, 'utf-8');
  } else {
    // Cannot open the file reader
    modal(20);
  }
}
function exportData(str){
  const name = 'tags_packet.txt';
  const blob = new Blob(['\ufeff' + str], { type: 'text/plain;charset=utf-8' });
  const objUrl = window.URL.createObjectURL(blob, { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = objUrl;
  a.download = name;
  _tagsBoxWrapper.appendChild(a);
  a.click();
  setTimeout(function (){
    window.URL.revokeObjectURL(objUrl);
    _tagsBoxWrapper.removeChild(a);
  }, 100);
}
function isTagsPacket(str){
  return /^\s*:tags(?:\[.*])?:/.test(str);
}
function getParamByKey(k){
  return _paramsKeys[k];
}
function setParam(param, key){
  _settings[param] = key || _defaultSettings[param];
}
function clipboardCopy(txt){
  // Returns a promise
  if (navigator.clipboard){
    return navigator.clipboard.writeText(txt);
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')){
    const textarea = document.createElement('textarea');
    textarea.value = txt;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    return new Promise(function(ok, ko){
      if (document.execCommand('copy')) ok();
      else ko();
      document.body.removeChild(textarea);
    });
  }
}
function clipboardPaste(){
  // Returns a promise
  if (navigator.clipboard){
    return navigator.clipboard.readText();
  } else if (document.queryCommandSupported && document.queryCommandSupported('paste')){
    return new Promise(function(ok, ko){
      if (document.execCommand('paste')) ok();
      else ko();
    });
  }
}
// Undo/redo functions
_history = {
  done: [],
  reverted: [],
  limit: 30,
  get: function(){
    return JSON.stringify([_history.done, _history.reverted]);
  },
  set: function(json){
    const data = JSON.parse(json);
    _history.done = data[0];
    _history.reverted = data[1];
    _history.restore(_history.done.slice(-1)[0], {noSlideIn: true, noFxIn: false, glow: false});
  },
  add: function(str = encodeData()){
    if (_history.skipAdd){
      delete _history.skipAdd;
      return;
    }
    const plus = document.getElementById('od-addtag');
    const item = plus.dataset.color + getItemIndex(plus) + str;
    if (item === _history.done.slice(-1)[0]) return;
    if (_history.done.length >= _history.limit) _history.done.shift();
    _history.done.push(item);
    _history.reverted.length = 0;
  },
  undo: function() {
    if (_history.done.length <= 1){
      return;
    }
    const item = _history.done.pop();
    if (item){
      _history.reverted.push(item);
      _history.restore(_history.done.slice(-1)[0]);
    }
  },
  redo: function() {
    const item = _history.reverted.pop();
    if (item){
      _history.done.push(item);
      _history.restore(item);
    }
  },
  restore: function(item, options = {noFxIn: true, glow: true}){
    const data = item.match(/^([^:]+)(.+)$/);
    const plusColor = data[1].slice(0, 6);
    const plusIndex = data[1].slice(6);
    const str = data[2];
    _arrTags.length = 0;
    _tagsBox.innerHTML = '';
    _history.skipAdd = true;
    updatePage(str, {plusColor: plusColor, plusIndex: plusIndex, noSlideIn: true, noFxIn: options.noFxIn, glow: options.glow, from: 'restore'});
  },
  keyboardShortcuts: function(e){
    if (!e.ctrlKey || !isNothingFocused(true)) return;
    if ((e.keyCode === 89 && _history.reverted.length > 0) || (e.keyCode === 90 && _history.done.length > 1)){
      e.preventDefault();
      _history[{89:'redo', 90:'undo'}[e.keyCode]]();
    }
  }
};
window.addEventListener('keydown', _history.keyboardShortcuts);
window.addEventListener('beforeunload', e=>{
  sessionStorage.setItem('odtagsbox_history', _history.get());
});

// --------------------------------------------------
// ---               DATA TRANSFER                ---
// --------------------------------------------------

// COPY-PASTE KEYBOARD SHORTCUTS

window.addEventListener('copy', function(e){
  if (_arrTags.length && isNothingFocused()){
    // Put the tags data on the clipboard
    e.clipboardData.setData('text/plain', encodeData());
    e.preventDefault();
    fxGlow(_tagsBox);
  }
});
window.addEventListener('paste', function(e){
  const str = (e.clipboardData || window.clipboardData).getData('text');
  if (isNothingFocused(true)){
    updatePage(str, {glow: true, from: 'paste'});
    e.preventDefault();
  }
});

// DRAG-AND-DROP STRING OR EXTERNAL TXT FILE

function isValidDraggedDataType(data){
  // Accept only TEXT in external data type
  for (let i = 0; i < data.length; i++){
    if (data[i].type.match('^text/plain')){
      return true;
    }
  }
  return false;
}
_tagsBox.addEventListener('dragenter', function (e){
  _dragenterBoxCounter++;
  const data = e.dataTransfer.items;
  if (_draggedData === null && isValidDraggedDataType(data)){
      _draggedData = data[0];
      _tagsBox.classList.add('od-dragging-external-data');
  }
});
_tagsBox.addEventListener('dragleave', function (){
  _dragenterBoxCounter--;
  // Counter needed to prevent bubbling effect
  if (_dragenterBoxCounter === 0){
    if (_draggedData === null) return;
    _draggedData = null;
    _tagsBox.classList.remove('od-dragging-external-data');
  }
});
_tagsBox.addEventListener('drop', function (e){
  e.preventDefault();
  _draggedData = null;
  _dragenterBoxCounter = 0;
  _tagsBox.classList.remove('od-dragging-external-data');
  const data = e.dataTransfer.items;
  // Exit if not TEXT data type
  if (!isValidDraggedDataType(data)) return false;

  if (data[0].kind === 'string'){
    // If string
    updatePage(e.dataTransfer.getData('Text'), {glow: true, from: 'drop'});
  } else if (data[0].kind === 'file'){
    // If file
    importData(e.dataTransfer.files);
  }
});

// --------------------------------------------------
// ---              ITEMS FUNCTIONS               ---
// --------------------------------------------------

// Add and set a item in the BOX
function addItem(o, index){
  const item = document.createElement('div');
  const label = document.createElement('i');

  item.appendChild(label);
  item.classList.add('od-item');
  item.id = o.id;

  if (index < _tagsBox.childElementCount) _tagsBox.insertBefore(item, _tagsBox.children[index]);
  else _tagsBox.appendChild(item);

  setItem(o);

  // Drag-and-drop
  item.addEventListener('dragstart', itemDragstart);
  item.addEventListener('dragend', itemDragend);
  item.addEventListener('dragenter', itemDragenter);
  item.addEventListener('dragleave', itemDragleave);
  item.addEventListener('dragover', itemDragover);

  return item;
}
function setItem(o){
  const item = document.getElementById(o.id);
  const label = item.querySelector('i');
  const itemText = o.text || '';
  const itemLabel = (o.label && o.label !== o.text) ? o.label : '';
  const itemColor = o.color ? o.color : randomColor();

  setItemColor(item, itemColor);
  label.dataset.value = itemLabel || itemText;
  item.title = itemText || 'Add TAG';
  item.dataset.text = itemText;
  if (itemLabel) item.dataset.label = itemLabel;
  else delete item.dataset.label;
  setDraggable(item);

  return item;
}
// Remove a TAG item
function removeItem(tag){
  let item = document.getElementById(tag.id);
  if (item){
    item.classList.add('od-removed');
    setTimeout(()=>{_tagsBox.removeChild(item);}, 310);
  }
  let index = _arrTags.indexOf(tag);
  if (index !== -1) _arrTags.splice(index, 1);
}
function setItemColor(item, color){
  const label = item.querySelector('i');
  label.style.backgroundColor = '#' + color;
  item.dataset.color = color;
  // Dark text if the fill is light
  item.classList.toggle('od-darktext', !isDarkRGB(hex2RGB(color), 170));
}
function openColorPicker(item){
  keepActiveItem(item);
  const colorPicker = new ColorPicker({
    color: item.dataset.color,
    target: item,
    parent: _tagsBoxWrapper,
    onChange: function(){
      setItemColor(item, colorPicker.hex);
    },
    onClose: function(){
      boxReset();
      if (colorPicker.hex === colorPicker.initHex) return;
      if (item.id === 'od-addtag'){
        _history.add();
        return;
      }
      _arrTags.find(tag=>tag.id === item.id).color = colorPicker.hex;
      saveData();
    }
  });
}
function editTagText(item){
  inputOnTag({
    item: item,
    property: 'text',
    placeholder: '- text -'
  });
}
function editTagLabel(item){
  inputOnTag({
    item: item,
    property: 'label',
    placeholder: '- label -'
  });
}
function inputOnTag(o){
  const item = o.item;
  const property = o.property;
  const placeholder = o.placeholder;
  keepActiveItem(item);
  const initVal = {
    label: item.dataset.label || '',
    text: item.dataset.text
  };
  const label = item.querySelector(':scope > i');
  const input = document.createElement('input');

  // Get width values
  let wa = item.offsetWidth;
  item.classList.add('od-edit-tag');
  input.value = label.dataset.value = initVal[property];
  let wb = Math.max(60, Math.min(180, item.offsetWidth));

  widthTransition(wa, wb);
  input.placeholder = placeholder;
  input.spellcheck = false;
  item.appendChild(input);
  input.style.opacity = '0';
  setTimeout(()=>{input.style.removeProperty('opacity');}, 1);

  setDraggable(item, false); // FIX: FF unable to interact with mouse on input field when parent is draggable
  input.focus();
  input.addEventListener('input', function(){
    label.dataset.value = this.value;
  });
  input.addEventListener('keydown', function(e){
    if (e.keyCode === 27) {
      e.preventDefault();
      esc();
    } else if (e.keyCode === 13) {
      e.preventDefault();
      done();
    }
  });
  input.addEventListener('blur', done);

  function widthTransition(a, b, callback){
    if (widthTransition.running) clearTimeout(widthTransition.timeout);
    item.style.width = item.style.minWidth = item.style.maxWidth = a + 'px';
    if (b != null) setTimeout(widthTransition, 1, b, null, callback);
    else {
      item.classList.add('od-edit-tag-transition');
      widthTransition.running = true;
      widthTransition.timeout = setTimeout(()=>{
        delete widthTransition.running;
        widthTransition.end(callback);
      }, 350);
    }
  }
  widthTransition.end = function(callback){
    item.style.removeProperty('width');
    item.style.removeProperty('min-width');
    item.style.removeProperty('max-width');
    item.classList.remove('od-edit-tag-transition');
    if (callback) callback();
  };
  function esc(){
    wa = item.offsetWidth;
    widthTransition.end();
    label.dataset.value = initVal.label || initVal.text;
    close();
  }
  function done(){
    wa = item.offsetWidth;
    widthTransition.end();
    if (input.value !== initVal[property]){
      const tag = getTagById(item.id);
      updateTag(
        tag,
        property === 'label' ? input.value : initVal.label,
        property === 'text' ? input.value : initVal.text
      );
      redrawBox();
      saveData();
      label.dataset.value = tag.label || tag.text;
    } else label.dataset.value = initVal.label || initVal.text;
    close();
  }
  function close(){
    setDraggable(item, true);
    input.removeEventListener('blur', done);

    // Get final width
    item.style.transition = '0s';
    item.classList.remove('od-edit-tag');
    wb = item.offsetWidth;
    item.style.removeProperty('transition');
    item.classList.add('od-edit-tag');

    input.style.opacity = '0';
    widthTransition(wa, wb, ()=>{
      item.removeChild(input);
      item.classList.remove('od-edit-tag');
    });
    boxReset();
  }
}
// Get the index of the item in the BOX
function getItemIndex(item){
  return [..._tagsBox.querySelectorAll(':scope > :not(.od-removed)')].indexOf(item);
}
function activateItem(item){
  deactivateItem();
  item.classList.add('od-active', 'od-highlight');
}
function deactivateItem(){
  const activeItem = getActiveItem();
  if (activeItem) activeItem.classList.remove('od-active', 'od-highlight');
  return activeItem;
}
function getActiveItem(){
  return _tagsBox.querySelector(':scope .od-item.od-active');
}
function keepActiveItem(item = getActiveItem()){
  setTimeout( function(){
    keepBoxOpen();
    activateItem(item);
  }, 1);
}
function keepBoxOpen(){
  _tagsBox.classList.add('od-keep-open');
}
function unlockBoxOpen(){
  _tagsBox.classList.remove('od-keep-open');
}
function boxReset(){
  unlockBoxOpen();
  setTimeout(deactivateItem, 1);
}

// --------------------------------------------------
// ---                CLICK ITEMS                 ---
// --------------------------------------------------

_tagsBox.addEventListener('click', function (e){
  const item = e.target;
  if (!item.classList.contains('od-item')) return;
  const query = _input.value;
  const label = item.querySelector(':scope > i');
  if (item.id === 'od-addtag'){

    // PLUS BUTTON (+) - Adds in the BOX new TAGs based on the search field query or highlighted text

    const singleTag = !isTagsPacket(query);
    const labelFormat = singleTag && /^.*::/.test(query);
    const str = ((labelFormat || _input.selectionStart === _input.selectionEnd) ? query : query.substring(_input.selectionStart, _input.selectionEnd)).trim();
    let res = {};
    if (e.ctrlKey){
      // If CTRL was pressed, edit color
      openColorPicker(item);
      return;
    } else if (!str) _input.focus();
    else {
      res = updatePage((singleTag ? ':tags:' : '') + str, {from: 'add-button', color: item.dataset.color});
      if (labelFormat && res.newTags.length === 1){
        _input.value = res.newTags[0].text + ' ';
        _input.focus();
      }
    }
    // Set the button color
    if (!res.keepButtonColor){
      const newColor = res.buttonColor || randomColor();
      setItemColor(item, newColor);
      if (res.buttonColor) fxGlow(item);
      _history.add();
    }
  } else if (!item.classList.contains('od-edit-tag')){

    // TAG ELEMENT - Enters the text of the TAG in the search field or edits its properties

    const itemText = item.dataset.text;
    if (e.shiftKey){
      // If SHIFT was pressed, edit text
      editTagText(item);
    } else if (e.altKey){
      // If ALT was pressed, edit label
      editTagLabel(item);
    } else if (e.ctrlKey){
      // If CTRL was pressed, edit color
      openColorPicker(item);
    } else {
      // If the input is focused, the TAG text will be appended or inserted relative to the selection in input field
      let startPos = _inputFocusInit ? _input.selectionStart : query.trim().length || 0;
      let endPos = _inputFocusInit ? _input.selectionEnd : startPos || 0;
      const text = (startPos > 0 ? ' ' : '') + itemText + ' ';
      if (startPos > 0 && query[startPos-1] === ' ') startPos--;
      if (endPos < query.length && query[endPos] === ' ') endPos++;
      // Set value on input field
      _input.value = query.slice(0, startPos) + text + query.slice(endPos);
      // Trigger events to connect the value to the search field controls
      _input.focus();
      _input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
      _input.dispatchEvent(new KeyboardEvent('keyup'));
      _input.click();
      // Reset selection range
      const pos = startPos + text.length;
      _input.setSelectionRange(pos, pos);
    }
  }
});

// --------------------------------------------------
// ---              COLOR PROCESSING              ---
// --------------------------------------------------

function hex2HSV(hex){
  const [r, g, b] = hex.match(/../g).map(c=>parseInt(c, 16) / 255);
  const v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return {h: (h < 0 ? h + 6 : h) / 6, s: v && c / v, v: v};
}
function HSV2Hex(hsv){
  let f = (n, k = (n + hsv.h * 6) % 6)=>('0' + Math.round((hsv.v - hsv.v * hsv.s * Math.max(Math.min(k, 4 - k, 1), 0)) * 255).toString(16)).slice(-2);
  return f(5) + f(3) + f(1);
}
function hex2RGB(hex){
  return hex.match(/../g).reduce((a, v, i)=>({ ...a, ['rgb'[i]]: parseInt(v, 16)}), {});
}
function RGBCSS2Obj(str){
  return str.slice(4, -1).split(',').reduce((a, v, i)=>({ ...a, ['rgb'[i]]: v}), {});
}
function randomHSV(){
  return {h: Math.random(), s: 0.3 + 0.4 * Math.random(), v: 0.5 + 0.2 * Math.random()};
}
function randomColor(){
  return HSV2Hex(randomHSV());
}
function isDarkRGB(rgb, threshold = 155){ // threshold range [0, 255]
    return rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722 < threshold;
}

// --------------------------------------------------
// ---                COLOR PICKER                ---
// --------------------------------------------------

class ColorPicker {
  constructor(o){
    const me = this;
    me.hex = me.initHex = o.color || '000000';
    me.hsv = hex2HSV(me.hex);
    me.parent = o.parent || document.body;
    me.picker = document.createElement('div');
    me.block = document.createElement('div');
    me.strip = document.createElement('div');
    me.blockThumb = document.createElement('i');
    me.stripThumb = document.createElement('i');
    me.block.tabIndex = 0;
    me.strip.tabIndex = 0;
    me.operatedSlider = null;
    me.events = ['change', 'close', 'startSlide', 'endSlide'].reduce((a, b)=>({ ...a, [b]: o['on' + b[0].toUpperCase() + b.slice(1)]}), {});
    me.init();
    me.display();
    me.position(o.target);
  }
  init(){
    const me = this;
    me.picker.classList.add('od-colorpicker');
    me.block.classList.add('od-colorpicker-block');
    me.strip.classList.add('od-colorpicker-strip');
    me.block.appendChild(me.blockThumb);
    me.strip.appendChild(me.stripThumb);
    me.picker.dataset.color = me.hex;
    me.picker.appendChild(me.block);
    me.picker.appendChild(me.strip);

    function sliding(e){
      if (me.operatedSlider === me.block){
        const rect = me.block.getBoundingClientRect();
        me.hsv.s = Math.max(0, Math.min(1, 1 / me.block.offsetWidth * (e.clientX - rect.left)));
        me.hsv.v = Math.max(0, Math.min(1, 1 - (1 / me.block.offsetHeight * (e.clientY - rect.top))));
        me.setBlock();
      } else if (me.operatedSlider === me.strip){
        const rect = me.strip.getBoundingClientRect();
        me.hsv.h = Math.max(0, Math.min(1, 1 / me.strip.offsetWidth * (e.clientX - rect.left)));
        me.setStrip();
      }
      const newHex = HSV2Hex(me.hsv);
      if (me.hex !== newHex){
        me.hex = newHex;
        me.change();
      }
    }
    function endSlide(){
      window.removeEventListener('mouseup', endSlide);
      window.removeEventListener('mousemove', sliding);
      document.documentElement.classList.remove('od-colorpicker-sliding');
      me.operatedSlider = null;
      me.handler('endSlide');
    }
    me.picker.addEventListener('mousedown', function(e){
      e.stopPropagation();
      if (me.block.contains(e.target)) me.operatedSlider = me.block;
      else if (me.strip.contains(e.target)) me.operatedSlider = me.strip;
      else return;
      document.documentElement.classList.add('od-colorpicker-sliding');
      me.handler('startSlide');
      sliding(e);
      window.addEventListener('mousemove', sliding);
      window.addEventListener('mouseup', endSlide);
    });
    onoffListeners(me.picker, 'contextmenu wheel', function(e){
      e.preventDefault();
      e.stopPropagation();
    }, true);
    function beforeClosing(){
      onoffListeners(window, 'wheel resize blur mousedown contextmenu', beforeClosing, false);
      me.close();
    }
    onoffListeners(window, 'wheel resize blur mousedown contextmenu', beforeClosing, true);
    function esc(e){
      if (e.keyCode === 27){
        if (me.hex === me.initHex) beforeClosing();
        else {
          me.hsv = hex2HSV(me.hex = me.initHex);
          me.setBlock();
          me.setStrip();
          me.change();
        }
      }
    }
    me.picker.addEventListener('keydown', esc);
  }
  display(){
    this.parent.appendChild(this.picker);
    this.setBlock();
    this.setStrip();
  }
  position(target){
    let x = 0;
    let y = 0;
    if (target){
      const rect = target.getBoundingClientRect();
      x = (rect.left + this.picker.offsetWidth > window.innerWidth) ? Math.max(0, Math.round(rect.right - this.picker.offsetWidth)) : rect.left;
      y = (rect.bottom + this.picker.offsetHeight > window.innerHeight) ? Math.max(0, Math.round(rect.top - this.picker.offsetHeight)) : rect.bottom;
    }
    this.picker.style = 'top: ' + y + 'px; left: ' + x + 'px';
  }
  setBlock(){
    const x = Math.round(this.block.offsetWidth * this.hsv.s);
    const y = Math.round(this.block.offsetHeight * (1 - this.hsv.v));
    this.blockThumb.style = 'top: ' + y + 'px; left: ' + x + 'px;';
  }
  setStrip(){
    const hue = 'hsl(' + Math.round(this.hsv.h * 360) + ',100%,50%)';
    const x = Math.round(this.strip.offsetWidth * this.hsv.h);
    this.stripThumb.style = 'left: ' + x + 'px; color: ' + hue;
    this.block.style.color = hue;
  }
  change(){
    this.handler('change');
  }
  close(){
    this.parent.removeChild(this.picker);
    this.handler('close');
  }
  handler(event){
    if (typeof this.events[event] === 'function') this.events[event]();
  }
}

// --------------------------------------------------
// ---                  EFFECTS                   ---
// --------------------------------------------------

function fxGlow(el){
  el.classList.add('od-highlight');
  setTimeout(function(){el.classList.remove('od-highlight');}, 500);
}
function fxGlowErr(el){
  el.classList.add('od-error');
  setTimeout(function(){el.classList.remove('od-error');}, 800);
}
function fxFadein(el, duration, delay){
  duration = duration == null ? 300 : +duration;
  delay = delay == null ? 0 : +delay;
  el.style.opacity = '0';
  el.style.transition = duration + 'ms ' + delay + 'ms ease-in-out';
  setTimeout(function(){
    el.style.removeProperty('opacity');
    setTimeout(function(){
      el.style.removeProperty('transition');
    }, duration + delay);
  }, 1);
}
function fxSlideFadein(el, duration, delay){
  duration = duration == null ? 300 : +duration;
  delay = delay == null ? 0 : +delay;
  el.style.opacity = '0';
  el.style.minWidth = '0';
  el.style.maxWidth = '0';
  el.style.transition = duration + 'ms ' + delay + 'ms ease-in-out';
  setTimeout(function(){
    el.style.removeProperty('opacity');
    el.style.removeProperty('min-width');
    el.style.removeProperty('max-width');
    setTimeout(function(){
      el.style.removeProperty('transition');
    }, duration + delay);
  }, 1);
}

// --------------------------------------------------
// ---                   MODAL                    ---
// --------------------------------------------------

function modal(msg, delay = 10){
  if (typeof msg === 'number'){
    msg = modal.msgList[msg];
  }
  // Prevents freezing of hovered elements when the alert is shown
  _tagsBoxWrapper.classList.add('od-nohover');
  setTimeout(function(){
    alert(msg);
    _tagsBoxWrapper.classList.remove('od-nohover');
  }, delay);
}
modal.msgList = {
  10: '⚠️ Sorry!\nI don\'t understand the format of this data.\n\nNo TAGs have been added.',
  11: '⚠️ Hey!\nIt looks like you are trying to put something weird in the BOX. I don\'t see valid data here.\n\nNo TAGS have been added.',
  20: '⚠️ Oops!\nI can\'t open the file reader.💡 But...\nyou can open it elsewhere, then try the copy-paste functions.',
  21: '⚠️ Oops!\nI can\'t read this file.💡 Try picking it up and opening it again.',
  50: '⚠️ Oops!\nUnable to copy data to clipboard.\n\n💡 But...\nyou can copy the string from the search field.',
  60: '⚠️ Oops!\nI can\'t read data from the clipboard.\n\n💡 But... try with CTRL+V.\n– Close this modal first –',
};

// --------------------------------------------------
// ---                   START                    ---
// --------------------------------------------------

async function start(){
  // If exist, use the history data stored in the local session
  const data = sessionStorage.getItem('odtagsbox_history');
  if (data){
   _history.set(data);
   return;
  }
  // Retrieve data via GM APIs or fall back to localStorage
  let str = !!GM && await GM.getValue('odtagsbox');
  if (!str) str = localStorage.getItem('odtagsbox');

  _tagsBox.innerHTML = '';
  updatePage(str, {noSlideIn: true, from: 'start'});
  setTimeout(function(){ _tagsBox.classList.remove('od-hidein');}, 2);
}

// --------------------------------------------------
// ---                   STYLE                    ---
// --------------------------------------------------

function addGlobalStyle(strCSS){
  const h = document.querySelector('head');
  if (!h) return;
  const s = document.createElement('style');
  s.type = 'text/css';
  s.innerHTML = strCSS;
  h.appendChild(s);
}
function getColorMode(mode){
  return {dark: mode === 'dark', light: mode !== 'dark'};
}
function css (colorMode){ return (
`
/* RESET */

/* Google SERP - make space for the BOX */
#tsf, #sf { margin-top: 10px !important; transition: margin-top .8s ease-in-out }
#searchform.minidiv #tsf, #kO001e.DU1Mzb #sf{ padding-top: 16px !important }
#searchform > .sfbg { margin-top: 0 !important }
#searchform.minidiv > .sfbg { padding-top: 2px }
/* Google Images SERP - fix position */
#sf #od-tagsbox { margin: -5px 0 0 3px }
#kO001e.DU1Mzb { padding: 10px 0 6px }
.M3w8Nb #od-tagsbox-wrapper, .KZFCbe #od-tagsbox-wrapper { padding-left: 27px }

/* Demote dropdowns/popups below the search field to avoid overlapping on the BOX */
.ea0Lbe, #tsf .UUbT9  { z-index: 984 !important }

/* CONTAINERS */

#od-tagsbox-wrapper *,
#od-tagsbox-wrapper *::before,
#od-tagsbox-wrapper *::after {
  box-sizing: border-box;
}
#od-tagsbox-wrapper {
  height: 0;
}
#od-tagsbox {
  position: absolute;
  top: -29px;
  max-width: 100%;
  max-height: 32px;
  border: 1px solid;
  border-color: rgba(${ colorMode.dark ? '95,99,104' : '208,211,215' },0);
  border-radius: 16px;
  outline: 2px solid transparent;
  background: rgba(${ colorMode.dark ? '75,75,75' : '240,240,240' },0);
  box-shadow: 0 2px 5px 1px rgba(64,60,67,0);
  overflow: hidden;
  transition: all .4s .1s ease-in-out, z-index 0s, outline-style 0s .4s, top .3s ease-out;
  z-index: 985;
}

/* SERP - make space for the BOX */
#tsf, #sf { margin-top: 10px !important; transition: margin-top .8s ease-in-out }
#searchform.minidiv #tsf, #kO001e.DU1Mzb #sf { padding-top: 16px !important }
#searchform > .sfbg { margin-top: 0 !important }
#searchform.minidiv > .sfbg { padding-top: 2px }

/* SERP - fix BOX position */
#searchform #od-tagsbox { top: -34px }
/* On minimal width or search field is sticky */
@media (max-width: 499.98px){#searchform #od-tagsbox { top: -23px }}
.VHFyob #searchform #od-tagsbox { top: -23px }
/* When icon prepended to left of search field */
@media (min-width: 941px){
  #searchform .A8SBwf:is(.emcav,.sbfc) #od-tagsbox {
    left: 27px;
  }
}

/* Fix the properties of the dropdown/popup menus under the search field to avoid conflicts with the BOX */
.ea0Lbe, #tsf .UUbT9  { z-index: 984 !important }

#od-tagsbox-wrapper.od-nohover {
  pointer-events: none;
}
#od-tagsbox-wrapper.od-nohover > #od-tagsbox {
  transition: 0s;
}
#od-tagsbox-wrapper:not(.od-nohover) > #od-tagsbox:hover,
#od-tagsbox.od-keep-open {
  max-height: 300px;
  border-color: rgba(${ colorMode.dark ? '95,99,104' : '208,211,215' },1);
  background: rgba(${ colorMode.dark ? '75,75,75' : '240,240,240' },.8);
  box-shadow: 0 2px 5px 1px rgba(64,60,67,.3);
  transition: all .2s, max-height .4s .1s ease-in-out, z-index 0s;
}

/* ITEM */

.od-item {
  position: relative;
  float: left;
  height: 30px;
  outline-color: transparent;
  font: normal 12px/20px Arial, sans-serif;
  text-align: center;
  cursor: pointer;
  transition: all .3s ease-out, opacity .3s .1s ease-out;
}

/* ITEM WIDTH PRESETS */

#od-tagsbox.tagsWidth-S > .od-item { min-width: 30px; max-width: 30px; }
#od-tagsbox.tagsWidth-L > .od-item { min-width: 60px; max-width: 60px; }
#od-tagsbox.tagsWidth-A > .od-item { min-width: 30px; max-width: 180px; }
#od-tagsbox.tagsWidth-A > .od-item > i::before { text-overflow: ellipsis; }

/* TAG LABEL */

.od-item > i {
  display: block;
  height: calc(100% - 6px);
  margin: 3px;
  padding: 0 3px;
  color: #fff;
  border: 2px solid rgba(0,0,0,.2);
  border-radius: 15px;
  outline: 1px solid transparent;
  font: inherit;
  white-space: nowrap;
  pointer-events: none;
  transition: all .3s ease-out, color .3s ease-out, background-color .3s ease-out, font-size 0s, font-weight 0s;
}
.od-item > i::before {
  content: attr(data-value);
  display: block;
  width: 100%;
  height: calc(100% - 2px);
  overflow: hidden;
}
.od-item.od-darktext > i {
  color: rgba(0, 0, 0, .7);
}
#od-addtag > i{
  font-size: 18px;
  font-weight: bold;
}
#od-addtag > i::before {
  content: "+";
}

/* LABEL CASE PRESETS */

#od-tagsbox.labelsCase-c > .od-item > i { text-transform: lowercase; }
#od-tagsbox.labelsCase-C > .od-item > i { text-transform: uppercase; }

/* USER-DEFINED LABELS */

.od-item[data-label] > i::before {
  border-bottom: 1px dashed currentcolor;
  transition: border-color .3s ease-out;
}

/* ITEM HOVER */

#od-tagsbox > .od-item:not(.od-draggeditem):hover > i {
  border-color: rgba(255,255,255,.4);
  outline-color: rgba(0,0,0,.4);
  transition-duration: 0s, .3s, .3s, 0s, 0s;
}
#od-tagsbox > .od-item.od-darktext:not(.od-draggeditem):hover > i {
  color: #000;
}

/* ACTIVE ITEM */

#od-tagsbox > .od-item.od-active > i {
  transition-duration: .3s, .1s, 0s, 0s, 0s;
}

/* ITEM REMOVED */

#od-tagsbox > .od-item.od-removed {
  max-width: 0;
  min-width: 0;
}
#od-tagsbox > .od-item.od-removed > i {
  opacity: 0;
}

/* EDIT TAG */

#od-tagsbox#od-tagsbox > .od-edit-tag {
  min-width: 60px;
  max-width: 180px;
}
#od-tagsbox#od-tagsbox > .od-edit-tag-transition {
  transition: .3s;
}
.od-edit-tag > i::before {
  /* Keep extra spaces while editing */
  white-space: pre;
}
#od-tagsbox#od-tagsbox > .od-item.od-edit-tag:not(.od-edit-tag-transition) > i::before {
  visibility: hidden;
}
#od-tagsbox.tagsWidth-A > .od-item.od-edit-tag-transition > i::before { text-overflow: clip; }

.od-edit-tag > input {
  position: absolute;
  top: 7px;
  left: 5px;
  height: calc(100% - 14px);
  width: calc(100% - 10px);
  margin: 0;
  padding: 0;
  color: #0a0905;
  font: inherit;
  text-align: inherit;
  border: solid rgba(0,0,0,.3);
  border-width: 1px 0;
  border-radius: 6px;
  background: rgba(255,255,255,.8);
  transition: opacity .3s;
}
.od-item:not(.od-edit-tag) > input {
  display: none;
}
.od-edit-tag > input:focus-visible {
  outline: none;
}

/* DRAG-AND-DROP */

.od-draggeditem > i {
  opacity: 0;
}
#od-tagsbox.od-dragging-item {
  z-index: 988;
}
#od-tagsbox.od-dragging-item > .od-item {
  opacity: .6;
  transition-delay: 0s;
}
.od-belowitem {
}
#od-deletingZone {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255,0,0,.2);
  opacity: 0;
  display: none;
  z-index: 987;
  transition: .3s, z-index 0s;
}
#od-deletingZone.od-dragging {
  display: block;
}
#od-deletingZone.od-dragging-hover {
  opacity: 1;
}
#od-tagsbox::before {
  content:"";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(138,180,248,.34);
  border-radius: inherit;
  border: 1px dashed rgb(138,180,248);
  opacity: 0;
  transition: .3s;
}
#od-tagsbox.od-dragging-external-data {
  z-index: 998;
}
#od-tagsbox.od-dragging-external-data::before {
  opacity: 1;
}
#od-tagsbox.od-dragging-external-data > .od-item {
  transition: .3s;
  opacity: .5;
  pointer-events: none;
}

/* CONTEXT MENU */

/* Containers */
#od-contextMenu {
  position: fixed;
  z-index: 999;
  font: 400 12px/23px "Segoe UI", Calibri, Arial, sans-serif;
  color: #000;
  user-select: none;
  cursor: default;
}
#od-contextMenu:not(.open) {
  display: none;
}
#od-contextMenu ul {
  list-style-type: none;
  margin: 0;
  padding: 3px 0;
  border: 1px #dadce0 solid;
  background: #fff;
  box-shadow: 5px 5px 4px -4px rgba(0,0,0,.9);
}
/* Item */
#od-contextMenu ul > li {
  position: relative;
  margin: 0;
  padding: 0 22px 0 38px;
  line-height: 23px;
  white-space: nowrap;
}
/* Separator */
#od-contextMenu ul > li:empty {
  margin: 4px 1px;
  padding: 0;
  border-top: 1px #dadce0 solid;
}
/* Item content */
#od-contextMenu ul > li > span {
    display: flex;
}
/* Icon */
#od-contextMenu ul > li i:first-child {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 35px;
  text-align: center;
  font-size: 1.3em;
  line-height: 23px;
  font-style: normal;
}
/* Shortcut */
#od-contextMenu ul > li kbd {
  margin-left: auto;
  padding-left: 10px;
  font: inherit;
}
#od-contextMenu ul > li:not(:hover) kbd {
  color: #5f6368;
}
/* Item hover */
#od-contextMenu ul > li:hover {
  color: #000;
  background: #e8e8e9;
}
/* Checkable item */
#od-contextMenu ul > li.od-checkable {
  padding-left: 48px;
}
#od-contextMenu ul > li.od-checkable.od-checked::before {
  content: "✓";
  position: absolute;
  left: 32px;
}
/* Submenu */
#od-contextMenu ul > li > ul {
  display: block;
  position: absolute;
  top: 0;
  width: auto;
  min-width: 80px;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s .3s, opacity .3s;
}
#od-contextMenu ul > li:not(.od-sub-left) ul {
  left: 100%;
}
#od-contextMenu ul > li.od-sub-left ul {
  right: 100%;
}
#od-contextMenu ul > li:hover > ul {
  visibility: visible;
  opacity: 1;
  z-index: 1;
  transition: visibility 0s, opacity .3s;
}
/* Arrow to open submenu */
#od-contextMenu ul > li > :first-child:not(:last-child)::after {
  content: "\\23F5";
  position: absolute;
  right: 3px;
  font-size: .9em;
  line-height: inherit;
  opacity: .7;
}
/* Disabled item */
#od-contextMenu ul li.od-disabled {
  pointer-events: none;
  opacity: .55;
  filter: saturate(0);
}
/* Color setting */
#od-setcolor::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #000;
  outline: 1px solid #777;
  background: currentColor;
}

/* COLOR PICKER */

.od-colorpicker {
  position: fixed;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 225px;
  padding: 4px;
  border: 1px solid #858585;
  color: #fff;
  background: ${colorMode.dark ? '#707578' : '#919395'};
  box-shadow: 5px 5px 4px -4px rgba(0,0,0,.9);
}
.od-colorpicker > div {
  position: relative;
  cursor: pointer;
}
.od-colorpicker > div:focus-visible {
  outline: none;
}
.od-colorpicker > div > i {
  pointer-events: none;
  content: '';
  position: absolute;
  transform: translate(-50%, -50%);
  display: block;
  box-shadow: none;
  border: 2px solid #fff;
  outline: 2px solid #0007;
  height: 16px;
  width: 16px;
  border-radius: 100%;
  color: transparent;
  background: currentColor;
  transition: outline-color .3s;
}
.od-colorpicker > div:active > i {
  outline-color: #75bfff;
  transition-duration: 0s;
}
.od-colorpicker-block {
  width: 100%;
  padding-bottom: 100%;
  color: inherit;
  background: linear-gradient(to right, #fff, currentColor);
  overflow: hidden;
}
.od-colorpicker-block::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, transparent, #000);
}
.od-colorpicker-strip {
  width: calc(100% - 10px);
  height: 16px;
  margin: 5px 0 1px;
}
.od-colorpicker-strip::before{
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: -5px;
  bottom: 0;
  left: -5px;
  border: solid transparent;
  border-width: 3px 0;
  background: padding-box linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
}
html.od-colorpicker-sliding {
  cursor: pointer;
}
html.od-colorpicker-sliding > body {
  user-select: none;
  pointer-events: none;
}
.od-colorpicker-block > i {
  will-change: left, top;
}
.od-colorpicker-strip > i {
  will-change: left;
  top: 50%;
}

/* EFFECTS */

/* Glow */
#od-tagsbox.od-highlight,
.od-item.od-highlight::before {
  outline-color: #45bfff;
  transition: 0s;
}
#od-tagsbox.od-highlight {
  background: rgba(100,180,255,.6);
}
.od-item::before {
  content: "";
  display: block;
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  border-radius: 15px;
  outline: 2px solid transparent;
  transition: .4s ease-in-out;
}
/*  Glow error */
#od-tagsbox.od-error {
  background-color: rgba(255,0,0,.6) !important;
  outline-color: #f00;
  transition: 0s;
}

/* COLOR SCHEME */

@media (prefers-color-scheme: dark) {

/* Dark-mode applies to the context menu according to the system color scheme */
  #od-contextMenu {
    color: #fff;
    font-weight: 100;
  }
  #od-contextMenu ul {
    background: #292a2d;
    border-color: #3c4043;
  }
  #od-contextMenu ul > li:empty {
    border-color: #3c4043;
  }
  #od-contextMenu ul > li:hover {
    color: #fff;
    background: #3f4042;
  }
  #od-contextMenu ul > li:not(:hover) kbd {
    color: #9aa0a6;
  }
}`
  );
}

// --------------------------------------------------
// ---               WE CAN START!                ---
// --------------------------------------------------

start();

});