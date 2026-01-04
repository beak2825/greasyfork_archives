
// ==UserScript==
// @name        WThermostatBeca helper
// @namespace   marcuson
// @description Helpers for WThermostatBeca.
// @match       *://*/thermostat_schedules
// @version     1.1.4
// @author      marcuson
// @license     GPL-3.0-or-later
// @supportURL  https://github.com/marcuson/WThermostatBeca-helpers/issues
// @homepageURL https://github.com/marcuson/WThermostatBeca-helpers
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM.addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/454979/WThermostatBeca%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454979/WThermostatBeca%20helper.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "";

var styles = {"btnContainer":"style-module_btnContainer__P6fk3","btnGrouper":"style-module_btnGrouper__6lr6j","btnSpacer":"style-module_btnSpacer__s-37w","btn":"style-module_btn__Bc4TY","small":"style-module_small__KjQen","mr":"style-module_mr__yG-cJ","error":"style-module_error__ABgWN","warning":"style-module_warning__nASzn","success":"style-module_success__ZG5Xf"};
var stylesheet=".style-module_btnContainer__P6fk3{display:flex;justify-content:space-around}.style-module_btnGrouper__6lr6j{display:flex;flex-grow:1;justify-content:space-between}.style-module_btnSpacer__s-37w{margin:0 20px}.style-module_btn__Bc4TY{cursor:pointer;padding-left:20px;padding-right:20px;width:auto}.style-module_btn__Bc4TY.style-module_small__KjQen{font-size:.8rem;height:auto;line-height:normal;padding-left:5px;padding-right:5px}.style-module_btn__Bc4TY.style-module_small__KjQen.style-module_mr__yG-cJ{margin-right:5px}.style-module_error__ABgWN{color:red}.style-module_warning__nASzn{color:orange}.style-module_success__ZG5Xf{color:green}";

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function toast(type, msg, options) {
  const clz = styles[type];
  const st = [(options == null ? void 0 : options.style) || '', css_248z, stylesheet].join('\n');
  return VM.showToast(VM.h("div", {
    class: clz
  }, VM.h("p", null, msg)), _extends({}, options, {
    style: st
  }));
}

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function askFileToRead() {
  const input = document.createElement('input');
  input.type = 'file';
  const prom = new Promise((res, rej) => {
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        res(content);
      };
      reader.onerror = err => {
        rej(err);
      };
    };
  });
  input.setAttribute('style', 'display:none;');
  document.body.appendChild(input); // required for firefox
  input.click();
  const res = await prom;
  input.remove();
  return res;
}

function strReplaceAt(str, index, replacement) {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

const WORKDAY_PREFIX = 'w';
const DAYOFF1_PREFIX = 'a';
const DAYOFF2_PREFIX = 'u';
const TIME_SUFFIX = 'h';
const TEMP_SUFFIX = 't';

let copiedData = undefined;
function createCopyBtn(fn) {
  return createSmallBtn('Copy', true, fn);
}
function createPasteBtn(fn) {
  return createSmallBtn('Paste', false, fn);
}
function createSmallBtn(text, withMarginRight, fn) {
  const classes = [styles.btn, styles.small];
  if (withMarginRight) {
    classes.push(styles.mr);
  }
  return VM.m(VM.h("button", {
    class: classes.join(' '),
    onclick: fn
  }, text));
}
function addBtnsTableHeaders(copyBtn, pasteBtn, elem) {
  elem.textContent = elem.textContent + ' ';
  elem.appendChild(copyBtn);
  elem.appendChild(pasteBtn);
}
function addButtons() {
  const saveAndRestoreDefaultsBtn = VM.m(VM.h("div", {
    class: styles.btnContainer
  }, VM.h("span", {
    class: styles.btnGrouper
  }, VM.h("button", {
    class: styles.btn,
    onclick: saveDefaults
  }, "Save current as defaults"), VM.h("button", {
    class: styles.btn,
    onclick: restoreDefaults
  }, "Restore defaults")), VM.h("hr", {
    class: styles.btnSpacer
  }), VM.h("span", {
    class: styles.btnGrouper
  }, VM.h("button", {
    class: styles.btn,
    onclick: exportData
  }, "Export"), VM.h("button", {
    class: styles.btn,
    onclick: importData
  }, "Import"))));
  document.querySelector('table.settingstable').before(saveAndRestoreDefaultsBtn);
  const copyWorkDayBtn = createCopyBtn(copyDataFn(WORKDAY_PREFIX));
  const pasteWorkDayBtn = createPasteBtn(pasteDataFn(WORKDAY_PREFIX));
  addBtnsTableHeaders(copyWorkDayBtn, pasteWorkDayBtn, document.querySelector('table.settingstable thead th:nth-child(2)'));
  const copyDayOff1Btn = createCopyBtn(copyDataFn(DAYOFF1_PREFIX));
  const pasteDayOff1Btn = createPasteBtn(pasteDataFn(DAYOFF1_PREFIX));
  addBtnsTableHeaders(copyDayOff1Btn, pasteDayOff1Btn, document.querySelector('table.settingstable thead th:nth-child(3)'));
  const copyDayOff2Btn = createCopyBtn(copyDataFn(DAYOFF2_PREFIX));
  const pasteDayOff2Btn = createPasteBtn(pasteDataFn(DAYOFF2_PREFIX));
  addBtnsTableHeaders(copyDayOff2Btn, pasteDayOff2Btn, document.querySelector('table.settingstable thead th:nth-child(4)'));
}
async function saveDefaults(e) {
  e.preventDefault();
  console.info('Saving current data as default values...');
  const slots = readInputIntoSlots();
  console.debug('Slots read:', slots);
  await GM.setValue(getDefaultsValueKey(), slots);
  toast('success', 'Current values saved as defaults.');
}
async function restoreDefaults(e) {
  e.preventDefault();
  console.info('Restoring default values...');
  const slots = await GM.getValue(getDefaultsValueKey(), undefined);
  if (!slots) {
    toast('error', 'Default values not found, save them first!');
    return;
  }
  writeSlotIntoInputs(slots);
  toast('success', 'Restored default values.');
}
async function exportData(e) {
  e.preventDefault();
  console.info('Exporting current data...');
  const slots = readInputIntoSlots();
  console.debug('Slots read:', slots);
  downloadObjectAsJson(slots, 'wthermostatbeca-schedules');
  toast('success', 'Export completed.');
}
async function importData(e) {
  e.preventDefault();
  console.info('Importing data...');
  const slotsStr = await askFileToRead();
  const slots = JSON.parse(slotsStr);
  writeSlotIntoInputs(slots);
  toast('success', 'Import completed.');
}
function copyDataFn(dayPrefix) {
  return e => {
    e.preventDefault();
    copyData(dayPrefix);
  };
}
function copyData(dayPrefix) {
  console.info('Copying data with day prefix:', dayPrefix);
  copiedData = readInputIntoSlots(dayPrefix);
  console.debug('Data copied:', copiedData);
  toast('success', 'Data copied.');
}
function pasteDataFn(dayPrefix) {
  return e => {
    e.preventDefault();
    pasteData(dayPrefix);
  };
}
function pasteData(dayPrefix) {
  console.info('Pasting data on day prefix:', dayPrefix);
  if (!copiedData) {
    toast('error', 'Copy some data first!');
    return;
  }
  const currentDayPrefix = Object.keys(copiedData)[0];
  const slots = {
    [dayPrefix]: JSON.parse(JSON.stringify(copiedData[currentDayPrefix]))
  };
  Object.keys(slots[dayPrefix]).forEach(slotIdx => {
    const slot = slots[dayPrefix][slotIdx];
    slot.namePrefix = strReplaceAt(slot.namePrefix, 0, dayPrefix);
  });
  console.debug('Pasting slots:', slots);
  writeSlotIntoInputs(slots);
  toast('success', 'Data pasted.');
}
function writeSlotIntoInputs(slots) {
  Object.keys(slots).forEach(dayPrefix => {
    const daySlots = slots[dayPrefix];
    Object.keys(daySlots).forEach(slotIdx => {
      const slot = daySlots[slotIdx];
      const timeInput = document.querySelector(`input[name="${slot.namePrefix}${TIME_SUFFIX}"]`);
      const tempInput = document.querySelector(`input[name="${slot.namePrefix}${TEMP_SUFFIX}"]`);
      timeInput.value = slot.time;
      tempInput.value = slot.temp;
    });
  });
}
function readInputIntoSlots(dayPrefixFilter) {
  const inputs = document.querySelectorAll('input');
  const slots = [...inputs].reduce((obj, x) => {
    const dayPrefix = x.name.substring(0, 1);
    if (dayPrefixFilter && dayPrefix !== dayPrefixFilter) {
      return obj;
    }
    if (!obj[dayPrefix]) {
      obj[dayPrefix] = {};
    }
    const daySlots = obj[dayPrefix];
    const slotIdx = x.name.substring(1, 2);
    const slot = daySlots[slotIdx] || {
      namePrefix: x.name.substring(0, 2)
    };
    if (x.name.endsWith(TIME_SUFFIX)) {
      slot.time = x.value;
    }
    if (x.name.endsWith(TEMP_SUFFIX)) {
      slot.temp = x.value;
    }
    obj[dayPrefix][slotIdx] = slot;
    return obj;
  }, {});
  return slots;
}
function getDefaultsValueKey() {
  return document.location.origin + document.location.pathname + '/slots';
}

// import CSS
document.head.append(VM.m(VM.h("style", null, css_248z)));
document.head.append(VM.m(VM.h("style", null, stylesheet)));

// init app
addButtons();

})();
