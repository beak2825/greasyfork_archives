// ==UserScript==
// @name         Komica Blur
// @description  Blur images on Komica
// @namespace    https://github.com/usausausausak
// @match        https://gita.komica1.org/00b/*
// @version      0.2a
// @require      https://cdn.jsdelivr.net/gh/usausausausak/pixelmatch@6abc46852cdfe64e8b7005d6e01b91d0451620b9/index.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/526393/Komica%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/526393/Komica%20Blur.meta.js
// ==/UserScript==
const Komica = {};

(function komicaDialog(exports) {
  'use strict'

  const TAG = '[Komica_Dialog]';

  function insertDialog(name, id, namespace) {
    // WORKAROUND: GM4 double insert
    if (document.querySelector(`#${id}`)) {
      return;
    }

    const tabBox = createTabBox(namespace);

    function toggleDialog() {
      dialog.classList.toggle(`${namespace}-dialog-show`);
      if (dialog.classList.contains(`${namespace}-dialog-show`)) {
        tabBox.currentSelected = 0;
      }
    }

    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.className = `${namespace}-dialog`;
    tabBox.appendTo(dialog);

    const footer = document.createElement('div');
    footer.className = `${namespace}-dialog-footer`;
    dialog.appendChild(footer);

    const closeBut = document.createElement('button');
    closeBut.className = `${namespace}-dialog-close-button`;
    closeBut.innerHTML = '關閉';
    closeBut.addEventListener('click', toggleDialog, false);
    dialog.appendChild(closeBut);

    document.body.insertBefore(dialog, document.body.firstChild);

    // Insert toggle button to top links area.
    const toggleButton = document.createElement('a');
    toggleButton.className = 'text-button';
    toggleButton.innerHTML = name;
    toggleButton.addEventListener('click', toggleDialog, false);

    const anchor = document.querySelector('#toplink a:last-of-type');
    const parent = anchor.parentElement;
    const insertPoint = anchor.nextSibling;
    parent.insertBefore(document.createTextNode('] ['), insertPoint);
    parent.insertBefore(toggleButton, insertPoint);

    return { tabBox, footer };
  }

  function createTabBox(namespace) {
    const eventListener = { onswitch: [] };

    function addEventListener(name, cb) {
      if (!eventListener[name]) {
        // ignore unknown event
        return;
      }
      if (typeof cb === 'function') {
        eventListener[name].push(cb);
      } else {
        console.warn(TAG, 'event listener not a function');
      }
    }

    function emitEvent(name, ...args) {
      try {
        eventListener[name].forEach(cb => cb(...args));
      } catch (e) {
        console.error(TAG, e);
      }
    }

    const tabBox = document.createElement('div');
    tabBox.className = `${namespace}-tabbox-header`;
    const pageBox = document.createElement('div');
    pageBox.className = `${namespace}-tabbox-container`;

    const groups = new Map();
    const pageInfos = [];
    let currentSelected = -1;

    function addPage(title = null, groupTitle = null) {
      const index = pageInfos.length;

      const page = document.createElement('div');
      page.className = `${namespace}-tabbox-page`;
      pageBox.appendChild(page);

      function getOrAddGroup(groupTitle) {
        let group = groups.get(groupTitle);
        if (!group) {
          const header = document.createElement('div');
          header.className = `${namespace}-tabbox-group-title`;
          header.innerHTML = groupTitle;
          tabBox.appendChild(header);

          group = document.createElement('div');
          group.className = `${namespace}-tabbox-group`;
          tabBox.appendChild(group);

          groups.set(groupTitle, group);
        }

        return group;
      }

      function addTab(title, parent) {
        const tab = document.createElement('div');
        tab.className = `${namespace}-tabbox-tab`;
        tab.innerHTML = title;
        tab.addEventListener('click', () => switchTab(index), false);
        parent.appendChild(tab);
        return tab;
      }

      const group = (groupTitle == null) ? null : getOrAddGroup(groupTitle);
      const tab = (title == null) ? null : addTab(title, group ?? tabBox);

      const newInfo = { index, page, tab, group };
      pageInfos.push(newInfo);
      return newInfo;
    }

    function getPage(index) {
      if ((index < 0) || (index >= pageInfos.length)) {
        console.error(TAG, `invalid tab index: ${index}`);
        return null;
      }

      return pageInfos[index].page;
    }

    function switchTab(index) {
      if ((index < 0) || (index >= pageInfos.length)) {
        console.error(TAG, `invalid tab index: ${index}`);
        return;
      } else if (currentSelected == index) {
        return;
      }

      const prevIndex = currentSelected;
      const { page, tab } = pageInfos[index];

      // emit before show to make time to render
      currentSelected = index;
      emitEvent('onswitch', index, page);

      // hide current tab
      if (prevIndex >= 0) {
        // hide current tab
        const { page, tab } = pageInfos[prevIndex];
        if (tab) {
          tab.classList.remove(`${namespace}-tabbox-selected`);
        }
        page.classList.remove(`${namespace}-tabbox-selected`);
      }

      if (tab) {
        tab.classList.add(`${namespace}-tabbox-selected`);
      }
      page.classList.add(`${namespace}-tabbox-selected`);
    }

    function getCurrentPage() {
      if ((currentSelected < 0) || (currentSelected >= pageInfos.length)) {
        return null;
      } else {
        return pageInfos[currentSelected].page;
      }
    }

    return {
      get currentSelected() { return currentSelected; },
      set currentSelected(index) { switchTab(index); },
      getCurrentPage,
      addPage, getPage,
      appendTo(parent) {
        parent.appendChild(tabBox);
        parent.appendChild(pageBox);
      },
      on(eventName, cb) { addEventListener(`on${eventName}`, cb); },
    };
  }

  exports.insertDialog = insertDialog;
})(Komica);

// from https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

if (typeof GM == 'undefined') {
  this.GM = {};
}

if (typeof GM_addStyle == 'undefined') {
  this.GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

if (typeof GM['addStyle'] == 'undefined') {
  GM['addStyle'] = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(GM_addStyle.apply(this, args));
      } catch (e) {
        reject(e);
      }
    });
  };
}

(async function () {
  'use strict';

  class Uint8StorageMap {
    #storageId;
    #storage;
    #cache;
    #bytes;
    maxLength = 50;

    onadd = () => {};
    onremove = () => {};

    constructor(storageId, list, bytes, storage = localStorage) {
      this.#storageId = storageId;
      this.#storage = storage;
      this.#cache = list;
      this.#bytes = bytes;
    }

    static async fromLocalStorage(storageId) {
      const value = localStorage.getItem(storageId);
      if (!value) {
        return new Uint8StorageMap(storageId, [], 0);
      }

      const bytes = value.length;
      const entries = value.split(/;/);
      return new Uint8StorageMap(storageId, entries.map(e => {
        const [key, value] = e.split(/=/);
        const uint8 = Uint8ClampedArray.from(value.split(/,/), i => parseInt(i, 10));
        return [key, uint8];
      }), bytes);
    }

    async add(key, data) {
      const has = this.#cache.some(([k, v]) => k == key);
      if (!has) {
        if (this.#cache.length >= this.maxLength) {
          const remove = this.#cache.length - this.maxLength + 1;
          this.#cache.splice(0, remove);
        }

        this.#cache.push([key, data]);
        await this.#serialize();
        this.onadd(key, data);
      }
    }

    async #serialize() {
      let value = '';
      let semicolon = '';
      for (const [key, data] of this.#cache) {
        value += `${semicolon}${key}=${data}`;
        semicolon = ';';
      }
      this.#storage.setItem(this.#storageId, value);
      this.#bytes = value.length;
    }

    async remove(key) {
      const i = this.#cache.findIndex(([k, v]) => k == key);
      if (i != -1) {
        const [data] = this.#cache.splice(i, 1);
        await this.#serialize();
        this.onremove(key, data);
      }
    }

    async clear() {
      this.#cache = [];
      await this.#serialize();
      this.onremove();
    }

    entries() {
      return this.#cache.values();
    }

    get length() {
      return this.#cache.length;
    }

    get bytes() {
      return this.#bytes;
    }
  }

  class StorageSet {
    #storageId;
    #storage;
    #cache;
    maxLength = 100;

    constructor(storageId, list, storage = localStorage) {
      this.#storageId = storageId;
      this.#storage = storage;
      this.#cache = list;
    }

    static async fromLocalStorage(storageId) {
      const value = localStorage.getItem(storageId);
      if (value) {
        return new StorageSet(storageId, value.split(/,/));
      } else {
        return new StorageSet(storageId, []);
      }
    }

    async add(key) {
      console.log(TAG, this.#storageId, 'add', key);

      console.log(TAG, this.#storageId, 'add', this.#cache);
      if (!this.has(key)) {
        if (this.#cache.length >= this.maxLength) {
          const remove = this.#cache.length - this.maxLength + 1;
          this.#cache.splice(0, remove);
        }

        this.#cache.push(key);
        await this.#serialize();
      }
    }

    async #serialize() {
      this.#storage.setItem(this.#storageId, this.#cache);
    }

    async remove(key) {
      console.log(TAG, this.#storageId, 'remove', key);
      const i = this.#cache.indexOf(key);
      if (i != -1) {
        this.#cache.splice(i, 1);
        await this.#serialize();
      }
    }

    has(key) {
      return this.#cache.includes(key);
    }

    get length() {
      return this.#cache.length;
    }
  }

  const TAG = '[Komica_Blur]';

  const DEFAULT_STLYE_VARS = `
:root {
  --blur-primary-background-color: #FFFFEE;
  --blur-secondary-background-color: #F0E0D6;
  --blur-highlight-background-color: #EEAA88;
  --blur-highlight-color: #800000;
  --blur-text-button-color: #00E;
  --blur-text-button-hover-color: #D00;
  --blur-separator-color: #000;
  --blur-primary-shadow-color: #5f5059;
  --blur-warning-color: #D00;
}
`;

  const DIALOG_STYLE = `
.blur-options-page {
  display: grid;
  grid-template-columns: [i-start] auto auto [i-end];
  grid-auto-rows: min-content;
}

.blur-blacklist-page {
  display: grid;
  grid-template-columns: [i-start] auto max-content max-content [i-end];
  grid-auto-rows: min-content;
}

.blur-blacklist-page button {
  place-self: center;
}

.blur-blacklist-page span {
  margin: 0 6px;
  place-self: center start;
}

.blur-blacklist-page canvas {
  margin: 3px 0;
}

.blur-separtor {
  grid-column: i;
}

.blur-listitem-description {
  color: var(--blur-highlight-color);
  grid-column: i;
}

.blur-listitem-description::before {
  content: "・";
  grid-column: i;
}

.blur-dialog {
  visibility: hidden;
  position: fixed;
  top: -10px;
  z-index: 1;
  opacity: 0;
  display: grid;
  grid-template: "h h" min-content "c c" auto "f b" min-content / max-content 1fr;
  width: 40%;
  height: 50%;
  margin: 0 30%;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 0 15px 5px var(--blur-primary-shadow-color);
  background-color: var(--blur-primary-background-color);
  transition: top 100ms, visibility 100ms, opacity 100ms;
}

.blur-dialog-show {
  visibility: visible;
  opacity: 1;
  top: 30px;
}

.blur-dialog-footer {
  grid-area: f;
  align-self: center;
  margin: 10px 20px;
}

.blur-dialog-close-button {
  place-self: center end;
  margin: 10px 20px;
}

.blur-tabbox-header {
  grid-area: h;
  display: flex;
  justify-content: start;
  background-color: var(--blur-secondary-background-color);
}

.blur-tabbox-tab {
  cursor: pointer;
  flex: 1;
  padding: 3px 12px;
  font-weight: bold;
  text-align: center;
}

.blur-tabbox-tab:hover {
  background-color: var(--blur-highlight-background-color);
  color: var(--blur-highlight-color);
}

.blur-tabbox-tab.blur-tabbox-selected {
  background-color: var(--blur-highlight-background-color);
  color: var(--blur-highlight-color);
}

.blur-tabbox-container {
  grid-area: c;
  display: flex;
  overflow-y: auto;
}

.blur-tabbox-page {
  width: 0;
  opacity: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: opacity 200ms;
}

.blur-tabbox-page.blur-tabbox-selected {
  width: 100%;
  opacity: 1;
  padding: 10px;
}

@media screen and (max-device-width: 600px) {
  .blur-dialog {
    width: calc(100vw - 20px);
    margin: 0 10px;
  }

  .blur-tabbox-container {
    width: calc(100vw - 20px);
  }
}
`;
  const BLUR_STYLE = `
.file-thumb .img.blur-safe-img {
  filter: unset;
}

.blur-button::before {
  content: " ";
}

@media only screen and (max-device-width: 480px) {
  div.file-text {
    display: block;
    font-size: 0;
  }

  .file-text .qlink {
    font-size: 0.8rem;
  }
}
`;

  const HOST_SETTINGS = {
    'komica': {
      darkStyleVars: `
:root {
  --blur-primary-background-color: #1D1F21;
  --blur-secondary-background-color: rgb(40, 42, 46);
  --blur-highlight-background-color: rgb(0, 0, 0);
  --blur-highlight-color: rgb(178, 148, 187);
  --blur-text-button-color: #81A2BE;
  --blur-text-button-hover-color: #FFC685;
  --blur-separator-color: gray;
  --blur-primary-shadow-color: rgb(40, 42, 46);
  --blur-warning-color: #D00;
}
`,
      getStyleVars: function () {
        const [themeCookie] = document.cookie.split(/;\s*/)
          .map(c => c.split(/=/,2))
          .filter(([k, v]) => k == 'theme');

        if ((themeCookie) && (themeCookie[1] == 'dark.css')) {
          return this.darkStyleVars;
        } else {
          return DEFAULT_STLYE_VARS;
        }
      },
    },
  };

  const hostId = 'komica';
  const hostSettings = HOST_SETTINGS[hostId];

  async function readSettings() {
    const saved = await settingsFromGM();
    blacklist.maxLength = saved.blacklistMax;
    whitelist.maxLength = saved.whitelistMax;
    imageSampler.matchThreshold = saved.matchThreshold;
    imageSampler.sampleSize = saved.sampleSize;
    console.log(TAG, saved);

    saved.onchange = async function onSettingsChanged(optionId, value) {
      console.log(TAG, optionId, value);
      switch (optionId) {
        case 'blacklistMax':
          blacklist.maxLength = value;
          break;
        case 'whitelistMax':
          whitelist.maxLength = value;
          break;
        case 'matchThreshold':
          imageSampler.matchThreshold = value;
          break;
        case 'sampleSize':
          imageSampler.sampleSize = value;
          await blacklist.clear();
          break;
      }
      await GM.setValue(optionId, value);
    };

    return saved;
  }

  async function addStyle() {
    const styleVars = ((hostSettings) && (hostSettings.getStyleVars))
      ? hostSettings.getStyleVars() : DEFAULT_STLYE_VARS;
    await GM.addStyle(styleVars);

    const blurSettingsStyle = `.file-thumb .img { filter: blur(${settings.blurRadius}); }`;
    await GM.addStyle(`${blurSettingsStyle}\n${BLUR_STYLE}`);
    await GM.addStyle(DIALOG_STYLE);
  }

  function onLoad(settings) {
    insertSettingDialog(settings, { blacklist, imageSampler });

    const imgs = document.querySelectorAll('.file-thumb .img');
    for (const img of imgs) {
      if (img.complete) {
        markImage(img);
      } else {
        img.addEventListener('load', onLoadImg);
      }
    }
  }

  const OPTIONS = {
    'blurRadius': {
      choose: ['12px', '15px', '21px'],
      default: '12px',
      title: '霧化半徑',
      afterSepartor: true,
    },
    'matchThreshold': {
      range: { min: 0.1, max: 0.5, step: 0.1 },
      default: 0.3,
      isFloat: true,
      title: '相似閾值',
      description: '相異像素低於閾值視為相似圖片',
    },
    'sampleSize': {
      choose: [32, 64, 96],
      default: 64,
      title: 'sampleSize',
      description: '會增加容量和處理時間，更改時清空黑名單',
      afterSepartor: true,
    },
    'blacklistMax': {
      range: { min: 10, max: 50, step: 10 },
      default: 10,
      title: '黑名單數量',
      description: '超過會從舊的刪除',
    },
    'whitelistMax': {
      choose: [50, 100],
      default: 50,
      title: '白名單數量',
      description: '超過會從舊的刪除',
    },
  };

  function typeofOption(descriptor) {
    return (descriptor.isFloat) ? 'float' : typeof descriptor.default;
  }

  function parseValue(type, value) {
    switch (type) {
      case 'number': return parseInt(value, 10);
      case 'float': return parseFloat(value);
      default: return value;
    }
  }

  async function settingsFromGM() {
    const settings = { };
    for (const [optionId, descriptor] of Object.entries(OPTIONS)) {
      const value = await GM.getValue(optionId, descriptor.default);
      settings[optionId] = parseValue(typeofOption(descriptor), value);
    }
    return settings;
  }

  function insertSettingDialog(settings, { blacklist, imageSampler }) {
    const { tabBox, footer } = Komica.insertDialog('BLUR', 'blur-settings-dialog', 'blur');

    footer.textContent = "※更改需要F5後才套用";

    const optionsPageInfo = tabBox.addPage('設定');
    const blacklistPageInfo = tabBox.addPage('黑名單');

    optionsPageInfo.page.classList.add('blur-options-page');
    blacklistPageInfo.page.classList.add('blur-blacklist-page');

    function switchTab(pageIdx, root) {
      switch (pageIdx) {
        case blacklistPageInfo.index:
          renderBlacklist(root);
          break;
        default:
          renderOptions(root);
          break;
      }
    }

    tabBox.on('switch', switchTab);

    function onBlacklistChanged() {
      const currentSelected = tabBox.currentSelected;
      if (currentSelected == blacklistPageInfo.index) {
        const root = tabBox.getCurrentPage();
        renderBlacklist(root);
      }
    }

    blacklist.onadd = onBlacklistChanged;
    blacklist.onremove = onBlacklistChanged;

    function renderBlacklist(root) {
      root.innerHTML = '';

      for (const [key, data] of blacklist.entries()) {
        root.prepend(...createSampleView(key, data, blacklist));
      }

      const bytesTitle = createTextView('黑名單使用容量');
      const clearButton = document.createElement('button');
      clearButton.textContent = "清空";

      clearButton.addEventListener('click', async () => {
        await blacklist.clear();
      });

      root.prepend(
        bytesTitle,
        createTextView(`${blacklist.bytes / 1000}KiB`),
        clearButton,
        createGridSepartor(),
      );
    }

    function createSampleView(key, data, blacklist) {
      const [canvas, ctx] = imageSampler.newCanvas();
      const imgData = new ImageData(data, canvas.width);
      ctx.putImageData(imgData, 0, 0);

      const delButton = document.createElement('button');
      delButton.textContent = "移除";

      delButton.addEventListener('click', async () => {
        await blacklist.remove(key);
      });

      return [canvas, createTextView(key), delButton];
    }

    function renderOptions(root) {
      root.innerHTML = '';

      for (const [optionId, descriptor] of Object.entries(OPTIONS)) {
        const details = { ...descriptor, value: settings[optionId], onchange: settings.onchange };
        let views;
        if (details.range) {
            views = createRange('blur', optionId, details);
        } else if (details.choose) {
            views = createChoose('blur', optionId, details);
        }
        root.append(...views);
        if (details.description) {
          root.append(createTextView(details.description, 'blur-listitem-description'));
        }
        if (details.afterSepartor) {
          root.append(createGridSepartor());
        }
      }
    }

    function createRange(namespace, optionId, details) {
      const value = details.value ?? details.default;
      const type = typeofOption(details.default);
      const onchange = details.onchange;

      const view = document.createElement('span');

      const input = document.createElement('input');
      input.type = 'range';
      for (const attr of ['min', 'max', 'step']) {
        input[attr] = details.range[attr];
      }
      input.id = `${namespace}-${optionId}`;
      input.value = value;

      const display = document.createElement('span');
      display.textContent = value;

      input.addEventListener('change', async () => {
        const value = parseValue(type, input.value);
        display.textContent = value;
        onchange(optionId, value);
      });

      view.appendChild(input);
      view.appendChild(display);

      return [createTextView(details.title, `${namespace}-listitem-title`), view];
    }

    function createChoose(namespace, optionId, details) {
      const value = details.value ?? details.default;
      const type = typeofOption(details.default);
      const onchange = details.onchange;

      const select = document.createElement('select');
      for (const value of details.choose) {
        select.add(new Option(value));
      }
      select.id = `${namespace}-${optionId}`;
      select.value = value;

      select.addEventListener('change', async () => {
        const value = parseValue(type, select.value);
        onchange(optionId, value);
      });

      return [createTextView(details.title, `${namespace}-listitem-title`), select];
    }

    function createTextView(textContent, className) {
      const view = document.createElement('span');
      view.textContent = textContent;
      if (className) {
        view.className = className;
      }

      return view;
    }

    function createGridSepartor() {
      const view = document.createElement('div');
      view.className = 'blur-separtor';
      view.append(document.createElement('hr'));
      return view;
    }
  }

  class ImageSampler {
    #matchThreshold = 0.3;
    #maxDiff = 64 * 64 * 0.3;
    #sampleSize = { width: 64, height: 64, length: 64 * 64 };

    #canvas = document.createElement('canvas');
    #ctx = null;

    constructor() {
      this.#canvas.width = this.#sampleSize.width;
      this.#canvas.height = this.#sampleSize.height;
      this.#ctx = this.#canvas.getContext("2d");
    }

    set sampleSize(value) {
      this.#sampleSize = { width: value, height: value, length: value * value };
      const [canvas, ctx] = this.newCanvas();
      this.#canvas = canvas;
      this.#ctx = ctx;

      this.#maxDiff = value * value * this.#matchThreshold;
    }

    set matchThreshold(value) {
      this.#matchThreshold = value;
      this.#maxDiff = this.#sampleSize.width * this.#sampleSize.height * value;
    }

    toGrayData(img) {
      this.#ctx.drawImage(img, 0, 0, this.#sampleSize.width, this.#sampleSize.height);
      const imgData = this.#ctx.getImageData(0, 0, this.#sampleSize.width, this.#sampleSize.height);
      return ImageSampler.canvasToGray(this.#ctx, imgData);
    }

    static canvasToGray(ctx, imgData) {
      const pixels = imgData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const lightness = 0.2126 * pixels[i] + 0.715 * pixels[i+1] + 0.0722 * pixels[i+2];

        pixels[i] = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
      }
      ctx.putImageData(imgData, 0, 0);
      return pixels;
    }

    matchData(key1, img1, key2, img2) {
      const diff = pixelmatch(img1, img2, null, this.#sampleSize.width, this.#sampleSize.height,
        {maxDiff: this.#maxDiff, threshold: 0.1});
      const n = diff / this.#sampleSize.length;
      const payload = { n, key: key2 };
      //console.log(TAG, key1, key2, n);

      return (n < this.#matchThreshold) ? payload : null;
    }

    newCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = this.#sampleSize.width;
      canvas.height = this.#sampleSize.height;
      const ctx = canvas.getContext("2d");
      return [canvas, ctx];
    }
  }

  class Blacklist {
    #storage;

    constructor(storage) {
      this.#storage = storage;
    }

    static async fromLocalStorage() {
      return new Blacklist(await Uint8StorageMap.fromLocalStorage('blur-blacklist'));
    }

    set maxLength(value) {
      this.#storage.maxLength = value;
    }

    set onadd(value) {
      this.#storage.onadd = value;
    }

    set onremove(value) {
      this.#storage.onremove = value;
    }

    get length() {
      return this.#storage.length;
    }

    get bytes() {
      return this.#storage.bytes;
    }

    async add(key, data) {
      console.log(TAG, 'add blacklist', key);
      this.#storage.add(key, data);
    }

    async remove(key, data) {
      console.log(TAG, 'remove blacklist', key);
      this.#storage.remove(key);
    }

    async clear() {
      console.log(TAG, 'clear blacklist');
      this.#storage.clear();
    }

    entries() {
      return this.#storage.entries();
    }

    match(callback) {
      for (const [key, data] of this.#storage.entries()) {
        const matches = callback(key, data);
        if (matches) {
          return matches;
        }
      }
      return null;
    }
  }

  const imageSampler = new ImageSampler();
  const blacklist = await Blacklist.fromLocalStorage();
  const whitelist = await StorageSet.fromLocalStorage('blur-whitelist');

  class WorkList {
    #list = [];
    #completed = 0;
    #timer = null;

    push(work) {
      const shouldStart = this.finished;
      this.#list.push(work);

      return shouldStart;
    }

    next() {
      const current = this.#completed;
      if (current == this.#list.length) {
        return null;
      } else {
        this.#completed++;
        return this.#list[current];
      }
    }

    get finished() {
      return (this.#completed == this.#list.length);
    }
  }

  const workList = new WorkList();

  function onLoadImg(ev) {
    const img = ev.target;
    markImage(img);
  }

  function markImage(img, key2, img2) {
    if (workList.push({ img, key2, img2 })) {
      setTimeout(doImageWork, 0);
      console.time(TAG, 'work');
    }
  }

  async function doImageWork() {
    const work = workList.next();
    if (!work) {
      console.timeEnd(TAG, 'work');
      return;
    }

    const { img, key2, img2 } = work;

    const key1 = imageKey(img);
    //console.log(TAG, 'doImageWork', key1);

    if (whitelist.has(key1)) {
      img.classList.add('blur-safe-img');
      img.dataset.imageInList = 'whitelist';
    } else {
      const img1 = imageSampler.toGrayData(img);
      let matches = null;
      if ((key2) && (img2)) {
        matches = imageSampler.matchData(key1, img1, key2, img2);
      } else {
        matches = blacklist.match((key2, img2) => imageSampler.matchData(key1, img1, key2, img2));
      }

      if (!matches) {
        img.classList.add('blur-safe-img');
      } else if (matches.key == key1) {
        img.classList.remove('blur-safe-img');
        img.dataset.imageInList = 'blacklist';
      } else {
        console.log(TAG, key1, 'matches', matches);
        img.classList.remove('blur-safe-img');
        img.dataset.imageMatchBlacklist = matches.key;
      }
    }

    renderContextMenu(img);

    setTimeout(doImageWork, 0);
  }

  function imageKey(img) {
    return img.src.replace(/^.*\//, '');
  }

  function renderContextMenu(img) {
    const parent = img.parentElement.parentElement.querySelector('.file-text');
    let blurButton = parent.querySelector('.blur-button');
    if (!blurButton) {
      blurButton = document.createElement('span');
      blurButton.classList.add('qlink', 'blur-button');
      blurButton.addEventListener('click', () => toggleBlur(img));
      parent.appendChild(blurButton);
    }

    if (img.dataset.imageInList == 'whitelist') {
      blurButton.textContent = "[remove whitelist]";
    } else if (img.dataset.imageMatchBlacklist) {
      blurButton.textContent = "[whitelist]";
    } else if (img.dataset.imageInList == 'blacklist') {
      blurButton.textContent = "[remove blacklist]";
    } else {
      blurButton.textContent = "[blacklist]";
    }
  }

  async function toggleBlur(img) {
    const key = imageKey(img);
    if (img.dataset.imageInList == 'whitelist') {
      await whitelist.remove(key)
      onRemovedWhitelist(img);
    } else if (img.dataset.imageMatchBlacklist) {
      await whitelist.add(key)
      onAddedWhitelist(img);
    } else if (img.dataset.imageInList == 'blacklist') {
      await blacklist.remove(key);
      onRemovedBlacklist(key);
    } else {
      const imgData = imageSampler.toGrayData(img);
      await blacklist.add(key, imgData);
      onAddedBlacklist(key, imgData);
    }
  }

  function onRemovedWhitelist(img) {
    img.classList.remove('blur-safe-img');
    delete img.dataset.imageInList;
    delete img.dataset.imageMatchBlacklist;
    markImage(img);
    renderContextMenu(img);
  }

  function onAddedWhitelist(img) {
    img.classList.add('blur-safe-img');
    img.dataset.imageInList = 'whitelist';
    renderContextMenu(img);
  }

  function onRemovedBlacklist(key) {
    const imgs = document.querySelectorAll('.file-thumb .img');
    for (const img of imgs) {
      const key1 = imageKey(img);
      if (img.dataset.imageMatchBlacklist == key) {
        img.classList.add('blur-safe-img');
        delete img.dataset.imageMatchBlacklist;
        renderContextMenu(img);
      } else if (key1 == key) {
        img.classList.add('blur-safe-img');
        delete img.dataset.imageInList;
        renderContextMenu(img);
      }
    }
  }

  function onAddedBlacklist(key2, img2) {
    const imgs = document.querySelectorAll('.file-thumb .img');
    for (const img of imgs) {
      if (!img.dataset.imageMatchBlacklist) {
        const key1 = imageKey(img);
        if (key1 == key2) {
          img.classList.remove('blur-safe-img');
          img.dataset.imageInList = 'blacklist';
          renderContextMenu(img);
        } else if (!img.dataset.imageInList) {
          markImage(img, key2, img2);
        }
      }
    }
  }

  const settings = await readSettings();
  await addStyle(settings);
  onLoad(settings);
})();
