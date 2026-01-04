// ==UserScript==
// @name         TendaWifi Devices List Helper
// @description  Allow to import and export devices list from/to csv file
// @icon         http://tendawifi.com/favicon.ico
// @match        *tendawifi.com/*
// @license      MIT
// @version 0.0.1.20250804185215
// @namespace https://greasyfork.org/users/1500695
// @downloadURL https://update.greasyfork.org/scripts/544651/TendaWifi%20Devices%20List%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544651/TendaWifi%20Devices%20List%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ELEMENTS = {
    // common
    devicesListHelper: '#devicesListHelper',
    // lan filter page
    lanAddButtonWrapper: '.lan-set .v-page-table__add-icon',
    lanAddButton: '.lan-set .v-page-table__add-icon button',
    lanTableRows: '.lan-set .v-table__body .v-table__row',
    // mac filter page
    macAddButtonWrapper: '.mac-filter-set .v-page-table__add-icon',
    macAddButton: '.mac-filter-set .v-page-table__add-icon button:not(.add-all-device)',
    macTableRows: '.mac-filter-set .v-table__body .v-table__row',
    // add device dialog
    inputHostname: '.v-dialog-form input[data-name="hostname"]',
    inputMacAddr: '.v-dialog-form input[data-name="mac"]',
    inputIpAddr: '.v-dialog-form input[data-name="ip"]',
    applyButton: '.v-dialog .v-dialog__footer .v-button--primary',
  };

  const TRIM_QUOTES = /^"|"$/g;
  const trim = (str) => (str || '').replace(TRIM_QUOTES, "").trim();

  const $ = (selector, target = document) => target.querySelector(selector);
  const $$ = (selector, target = document) => target.querySelectorAll(selector);

  const collectTable = (isLan = false) =>
    Array.from($$(isLan ? ELEMENTS.lanTableRows : ELEMENTS.macTableRows))
      .map((row) => {
        const cells = Array.from($$('td', row)).map((td) =>
          td.textContent.trim().replaceAll(',', ':'),
        );
        return isLan
          ? [trim(cells[0]), trim(cells[2]).toLowerCase(), trim(cells[1]).toLowerCase()]
          : [trim(cells[0]), trim(cells[1]).toLowerCase(), ''];
      });

  const fromCsv = (csvString) =>
    csvString.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const cells = trimmed.split(',');
      return [trim(cells[0]), trim(cells[1]).toLowerCase(), trim(cells[2])]
    }).filter(Boolean);

  const toCsv = (rows) => rows.map((row) => row.join(',')).join('\n');

  const _waitElem = (target, selector, resolve, times = 1) => {
    if (times > 10) {
      resolve(null);
      return;
    }

    const element = $(selector, target);
    if (element != null) {
      resolve(element);
      return;
    }
    setTimeout(() => _waitElem(target, selector, resolve, times + 1), 500);
  };

  const waitForElement = (selector, target = window.document) =>
    new Promise((resolve) => _waitElem(target, selector, resolve));

  const setInputValue = (input, val) => new Promise((resolve) => {
    input.value = val;
    input.dispatchEvent(new Event('change'))
    setTimeout(resolve, 350)
  });

  const addDevice = async (device, macAddress, ipAddress = '') => new Promise((resolve) => {
    const addButtonSelector = ipAddress ? ELEMENTS.lanAddButton : ELEMENTS.macAddButton;
    const addButton = $(addButtonSelector);

    if (!addButton) return;
    addButton.click();

    waitForElement(ELEMENTS.inputHostname).then(async (inputHostname) => {
      await setInputValue(inputHostname, device);

      const inputMacAddr = $(ELEMENTS.inputMacAddr)
      await setInputValue(inputMacAddr, macAddress);

      if (ipAddress) {
        const inputIpAddr = $(ELEMENTS.inputIpAddr);
        await setInputValue(inputIpAddr, ipAddress);
      }

      const applyButton = $(ELEMENTS.applyButton);
      applyButton.click();

      setTimeout(resolve, 500);
    })
  });

  const addAllFromCsv = async (fileContent, isLan = false) => {
    const table = collectTable(isLan);
    const existing = new Set(table.map(x => x[1]));

    const newTable = fromCsv(fileContent);
    for (const [device, macAddress, ipAddress] of newTable) {
      if (existing.has(macAddress)) continue;
      if (!macAddress || !device || (isLan && !ipAddress)) continue;

      // use appropriate add button on mac filter page
      const ip = isLan ? ipAddress : '';

      await addDevice(device, macAddress, ip);
    }
  };

  const selectFile = () => new Promise((resolve) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/csv';

    input.onchange = () => {
      let files = Array.from(input.files);
      resolve(files[0]);
    };

    input.click();
  });

  const importFile = (isLan = false) => {
    selectFile()
      .then((file) => file.text())
      .then((fileContent) => {
        addAllFromCsv(fileContent, isLan)
      });
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.setAttribute('download', filename);
    element.click();

    setTimeout(() => URL.revokeObjectURL(url));
  };

  const exportPage = (isLan = false) => {
    const content = toCsv(collectTable(isLan));
    downloadFile(content, 'tenda-clients.csv', 'text/csv;charset=utf-8;');
  };

  const createDomElement = (html) => {
    const element = document.createElement('div');
    element.innerHTML = html.trim();
    return element.firstChild;
  };

  const addDevicesListHelper = () => {
    const lanTitle = $(ELEMENTS.lanAddButtonWrapper);
    const macTitle = $(ELEMENTS.macAddButtonWrapper);
    const title = lanTitle || macTitle;
    if (!title) return;

    const existing = $(ELEMENTS.devicesListHelper);
    if (existing) return;


    const isLan = Boolean(lanTitle);

    const helper = createDomElement(`
      <div id="devicesListHelper" style="display: flex; justify-content: end; margin-bottom: 15px;">
        <button id="devicesListHelperImport"
          class="v-button v-button--small v-button--secondary">Import</button>
        <button id="devicesListHelperExport"
          class="v-button v-button--small v-button--secondary">Export Page</button>
      </div>
    `);

    const exportButton = $('#devicesListHelperExport', helper);
    exportButton.addEventListener('click', () => exportPage(isLan));

    const importButton = $('#devicesListHelperImport', helper);
    importButton.addEventListener('click', () => importFile(isLan));

    title.parentNode.insertBefore(helper, title.nextSibling);
  };

  const loop = () => {
    addDevicesListHelper();
    setTimeout(loop, 500);
  };
  setTimeout(loop, 500);
})();
