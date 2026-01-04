// ==UserScript==
// @name         Komica Keyman
// @description  Easy manage hide.keywords on Komica
// @namespace    https://greasyfork.org/en/users/112088
// @match        https://gita.komica1.org/00b/*
// @version      0.1a
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/533734/Komica%20Keyman.user.js
// @updateURL https://update.greasyfork.org/scripts/533734/Komica%20Keyman.meta.js
// ==/UserScript==
const Komica = {};

(function komicaDialog(exports) {
  'use strict'

  const TAG = '[Komica_Dialog]';

  function insertDialog(name, id, namespace, options = {}) {
    // WORKAROUND: GM4 double insert
    if (document.querySelector(`#${id}`)) {
      return;
    }

    const tabBox = createTabBox(namespace);

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

    function toggleDialog() {
      dialog.classList.toggle(`${namespace}-dialog-show`);
      if (dialog.classList.contains(`${namespace}-dialog-show`)) {
        if (options.onopen) {
          options.onopen();
        }

        tabBox.currentSelected = 0;
      } else if (options.onclose) {
        options.onclose();
      }
    }

    return { tabBox, footer, toggleDialog };
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

(function komicaPostQueryer(exports) {
  'use strict'

  const POST_NO_FROM_POST_EL_ID_REGEXP = /^r(\d+)$/;

  const ID_FROM_NOWID_TEXT_REGEXP = /ID:([^\s]+)(?:\].*)?/;
  function idFromNowIdText(nowIdText) {
    const matches = ID_FROM_NOWID_TEXT_REGEXP.exec(nowIdText);
    return (matches) ? matches[1] : null;
  }

  function idWithTailFromNowIdText(nowIdText) {
    const matches = ID_FROM_NOWID_TEXT_REGEXP.exec(nowIdText);
    if (!matches) {
      return null;
    } else {
      // Maybe has a id tail code, but we just ignore that.
      return matches[1].substr(0, 8);
    }
  }

  const QUERYERS_KOMICA = {
    queryThreads: function queryThreadsKomica() {
      return document.getElementsByClassName('thread');
    },
    queryPosts: function queryPostsKomica() {
      return document.getElementsByClassName('post');
    },
    queryNo: function queryNoKomica(post) {
      if (post.dataset) {
        return post.dataset.no;
      } else {
        return null;
      }
    },
    queryId: function queryIdKomica(post) {
      const idEl = post.querySelector('.post-head .id');
      if (idEl) {
        return idEl.dataset.id;
      } else {
        const nowEl = post.querySelector('.post-head .now');
        if (nowEl) {
          return idFromNowIdText(nowEl.innerHTML);
        } else {
          return null;
        }
      }
    },
    queryThreadTitle: function queryThreadTitleKomica(post) {
      const titleEl = post.querySelector('span.title');
      if (titleEl) {
        return titleEl.innerText;
      } else {
        return null;
      }
    },
    queryName: function queryNameKomica(post) {
      const nameEl = post.querySelector('span.name');
      if (nameEl) {
        return nameEl.innerText;
      } else {
        return null;
      }
    },
    queryBody: function queryBodyKomica(post) {
      const bodyEl = post.querySelector('.quote');
      if (bodyEl) {
        return bodyEl.innerText;
      } else {
        return null;
      }
    },
    isThreadPost: function isThreadPostKomica(post) {
      return ((post.classList) && (post.classList.contains('threadpost')));
    },
    isReplyPost: function isReplyPostKomica(post) {
      return ((post.classList) && (post.classList.contains('reply')));
    },
    postNoEl: function postNoElKomica(post) {
      return post.querySelector('.post-head [data-no]');
    },
  };

  const NULL_QUERYER = {
    queryThreads: function queryThreadsNull() {
      return [];
    },
    queryPosts: function queryPostsNull() {
      return [];
    },
    queryNo: function queryNoNull(post) {
      return null;
    },
    queryId: function queryIdNull(post) {
      return null;
    },
    queryThreadTitle: function queryThreadTitleNull(post) {
      return null;
    },
    queryName: function queryNameNull(post) {
      return null;
    },
    queryBody: function queryBodyNull(post) {
      return null;
    },
    isThreadPost: function isThreadPostNull(post) {
      return false;
    },
    isReplyPost: function isReplyPostNull(post) {
      return false;
    },
    postNoEl: function postNoElNull(post) {
      return null;
    },
  };

  const MAPPER = {
    'komica': QUERYERS_KOMICA,
  };

  function postQueryer(host) {
    const ret = (MAPPER[host]) ? MAPPER[host] : NULL_QUERYER;
    return Object.assign({}, ret);
  }

  exports.postQueryer = postQueryer;
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
  const TAG = '[Komica_Keywords_Manager]';

  const DEFAULT_STLYE_VARS = `
:root {
  --keyman-primary-background-color: #FFFFEE;
  --keyman-secondary-background-color: #F0E0D6;
  --keyman-highlight-background-color: #EEAA88;
  --keyman-primary-color: #800000;
  --keyman-highlight-color: #800000;
  --keyman-text-button-color: #00E;
  --keyman-text-button-hover-color: #D00;
  --keyman-separator-color: #000;
  --keyman-primary-shadow-color: #5f5059;
}
`;

  const DIALOG_STYLE = `
.keyman-textarea-page {
  display: flex;
}

.keyman-textarea-page textarea {
  width: 100%;
}

.keyman-keywords-page {
  display: grid;
  grid-template-columns: [i-start] auto max-content [i-end];
  grid-auto-rows: min-content;
}

.keyman-keywords-page button {
  place-self: center;
}

.keyman-keywords-page span {
  margin: 0 6px;
  place-self: center start;
}

.keyman-keywords-page canvas {
  margin: 3px 0;
}

.keyman-separtor {
  grid-column: i;
}

.keyman-dialog {
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
  box-shadow: 0 0 15px 5px var(--keyman-primary-shadow-color);
  background-color: var(--keyman-primary-background-color);
  transition: top 100ms, visibility 100ms, opacity 100ms;
}

.keyman-dialog-show {
  visibility: visible;
  opacity: 1;
  top: 30px;
}

.keyman-dialog-footer {
  grid-area: f;
  align-self: center;
  margin: 10px 20px;
}

.keyman-dialog-close-button {
  place-self: center end;
  margin: 10px 20px;
}

.keyman-tabbox-header {
  grid-area: h;
  display: flex;
  justify-content: start;
  background-color: var(--keyman-secondary-background-color);
}

.keyman-tabbox-tab {
  cursor: pointer;
  flex: 1;
  padding: 3px 12px;
  font-weight: bold;
  text-align: center;
}

.keyman-tabbox-tab:hover {
  background-color: var(--keyman-highlight-background-color);
  color: var(--keyman-highlight-color);
}

.keyman-tabbox-tab.keyman-tabbox-selected {
  background-color: var(--keyman-highlight-background-color);
  color: var(--keyman-highlight-color);
}

.keyman-tabbox-container {
  grid-area: c;
  display: flex;
  overflow-y: auto;
}

.keyman-tabbox-page {
  width: 0;
  opacity: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: opacity 200ms;
}

.keyman-tabbox-page.keyman-tabbox-selected {
  width: 100%;
  opacity: 1;
  padding: 10px;
}

@media screen and (max-device-width: 600px) {
  .keyman-dialog {
    width: calc(100vw - 20px);
    margin: 0 10px;
  }

  .keyman-tabbox-container {
    width: calc(100vw - 20px);
  }
}
`;
  const CONTEXT_STYLE = `
.keyman-text-button {
  cursor: pointer;
  color: var(--keyman-text-button-color);
}

.keyman-text-button:hover {
  color: var(--keyman-text-button-hover-color);
}

.keyman-context-menu {
  display: inline-flex;
  flex-direction: column;
  visibility: hidden;
  position: absolute;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: calc(-1.7em - 10px);
  transition: margin 100ms;
  width: max-content;
  color: var(--keyman-primary-color);
  background-color: var(--keyman-highlight-background-color);
}

.keyman-context:hover .keyman-context-menu {
  visibility: visible;
  margin-top: -1.7em;;
}

.popup_area .keyman-context {
  display: none;
}

.keyman-context {
  cursor: pointer;
  display: inline-block;
}

.keyman-context summary {
  list-style: none;
}

.keyman-context summary::-webkit-details-marker {
  display: none;
}

.keyman-context-menu-close-button {
  text-align: center;
  display: none;
}

@media screen and (max-device-width: 600px) {
  .keyman-context-menu  {
    visibility: visible;
    margin: -1.7em 6px 0 6px;
    width: calc(100% - 32px);
    left: 0;
  }

  .keyman-context-menu-close-button {
    display: unset;
    align-self: center;
  }
}
`;

  const HOST_SETTINGS = {
    'komica': {
      darkStyleVars: `
:root {
  --keyman-primary-background-color: #1D1F21;
  --keyman-secondary-background-color: rgb(40, 42, 46);
  --keyman-highlight-background-color: rgb(0, 0, 0);
  --keyman-primary-color: #C5C8C6;
  --keyman-highlight-color: rgb(178, 148, 187);
  --keyman-text-button-color: #81A2BE;
  --keyman-text-button-hover-color: #FFC685;
  --keyman-separator-color: gray;
  --keyman-primary-shadow-color: rgb(40, 42, 46);
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
  const queryer = Komica.postQueryer(hostId);
  const hostSettings = HOST_SETTINGS[hostId];

  function readSettings() {
    function* commaSplited(input) {
      for (const word of input.split(/,/)) {
        if (word != '' ) {
          yield word;
        }
      }
    }

    return {
      keywords: '',
      keywordList: [],
      _changed: function () {
        this.keywords = this.keywordList.join(',');

        if (this.onchange) {
          this.onchange();
        }
      },

      addKeyword: function (input) {
        let changed = 0;
        for (const word of commaSplited(input)) {
          if (!this.keywordList.includes(word)) {
            this.keywordList.push(word);
            changed++;
          }
        }

        if (changed > 0) {
          this._changed();
        }
      },

      removeKeyword: function (input) {
        const set = new Set(commaSplited(input));
        const newList = [];
        let changed = 0;
        for (const word of this.keywordList) {
          if (set.has(word)) {
            changed++;
          } else {
            newList.push(word);
          }
        }

        if (changed > 0) {
          this.keywordList = newList;
          this._changed();
        }
      },

      clearKeyword: function () {
        this.keywordList.length = 0;
        this.keywords = '';

        if (this.onchange) {
          this.onchange();
        }
      },

      swapKeywords: function (input) {
        const list = [];
        const set = new Set();
        for (const word of commaSplited(input)) {
          if (!set.has(word)) {
            list.push(word);
            set.add(word);
          }
        }
        this.keywordList = list;

        this._changed();
      },

      read: function () {
        const input = document.querySelector('#keywordInput');

        this.keywordList = [...commaSplited(input.value)];
        this.keywords = this.keywordList.join(',');
      },

      update: function () {
        const input = document.querySelector('#keywordInput');
        input.value = this.keywords;

        const button = document.querySelector('#keywordUpdateBtn');
        button.click();
      },
    };
  }

  function insertManagerButton({ toggleDialog }) {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '編輯列表';
    toggleButton.addEventListener('click', toggleDialog, false);

    const anchor = document.querySelector('#keywordInput');
    anchor.after(toggleButton);
  }

  async function addStyle() {
    const styleVars = ((hostSettings) && (hostSettings.getStyleVars))
      ? hostSettings.getStyleVars() : DEFAULT_STLYE_VARS;
    await GM.addStyle(styleVars);

    await GM.addStyle(DIALOG_STYLE);
    await GM.addStyle(CONTEXT_STYLE);
  }

  function onLoad(settings) {
    const dialog = insertSettingDialog(settings);
    insertManagerButton(dialog);

    for (const post of queryer.queryPosts()) {
      initPostMeta(post);
    }

    const threadObserver = new MutationObserver(function (records) {
      const postReplys = records.reduce((total, record) => {
        for (const node of record.addedNodes) {
          if (queryer.isReplyPost(node)) {
            total.push(node);
          }
        }
        return total;
      } , []);

      postReplys.forEach(initPostMeta);
    });

    for (const thread of queryer.queryThreads()) {
      threadObserver.observe(thread, { childList: true });
    }
  }

  function insertSettingDialog(settings) {
    const options = {
      onopen: () => {
        settings.read();
      },
      onclose: () => {
        settings.update();
      },
    };
    const { tabBox, footer, toggleDialog } = Komica.insertDialog('編輯列表', 'keyman-settings-dialog', 'keyman', options);

    footer.textContent = '※更改需要關閉列表才套用';

    const keywordsPageInfo = tabBox.addPage('關鍵字列表');
    const textareaPageInfo = tabBox.addPage('編輯');

    keywordsPageInfo.page.classList.add('keyman-keywords-page');
    textareaPageInfo.page.classList.add('keyman-textarea-page');

    function switchTab(pageIdx, root) {
      switch (pageIdx) {
        case keywordsPageInfo.index:
          renderBlacklist(root);
          break;
        default:
          renderTextarea(root);
          break;
      }
    }

    tabBox.on('switch', switchTab);

    settings.onchange = () => {
      const pageIdx = tabBox.currentSelected;
      const root = tabBox.getCurrentPage();
      if (root) {
        switchTab(pageIdx, root);
      }
    };

    function renderBlacklist(root) {
      root.innerHTML = '';

      root.append(...createInputField('隱藏包含關鍵字貼文'));
      root.append(createGridSepartor());
      for (const value of settings.keywordList) {
        root.append(...createListitem(value), createGridSepartor());
      }

      const clearButton = document.createElement('button');
      clearButton.textContent = '清空';

      clearButton.addEventListener('click', async () => {
        await settings.clearKeyword();
      });
    }

    function createInputField(placeholder) {
      const inputView = document.createElement('input');
      inputView.placeholder = placeholder;

      const addButton = document.createElement('button');
      addButton.innerHTML = '加入';
      addButton.addEventListener('click', async ev => {
        await settings.addKeyword(inputView.value);
        inputView.value = '';
        inputView.focus();
      });

      return [inputView, addButton];
    }

    function createListitem(value) {
      const valueView = document.createElement('span');
      valueView.textContent = value;

      const delButton = document.createElement('span');
      delButton.className = 'keyman-text-button';
      delButton.textContent = '移除';
      delButton.dataset.value = value;
      delButton.addEventListener('click', async ev => {
        const button = ev.target;
        await settings.removeKeyword(button.dataset.value);
      })

      return [valueView, delButton];
    }

    function renderTextarea(root) {
      root.innerHTML = '';

      const textarea = document.createElement('textarea');
      textarea.value = settings.keywords;
      textarea.addEventListener('change', async ev => {
        const textarea = ev.target;
        await settings.swapKeywords(textarea.value);
      })
      root.append(textarea);

      const button = document.createElement('button');
      button.textContent = '空行換成逗號';
      button.addEventListener('click', async ev => {
        textarea.value = textarea.value.replaceAll(/\n/g, ',');
        await settings.swapKeywords(textarea.value);
      })
      root.append(button);
    }

    function createGridSepartor() {
      const view = document.createElement('div');
      view.className = 'keyman-separtor';
      view.append(document.createElement('hr'));
      return view;
    }

    return { toggleDialog };
  }

  const postMetas = {};

  function initPostMeta(post) {
    const postNo = queryer.queryNo(post);
    if (!postNo) {
      return;
    }

    const postMeta = {
      no: postNo,
      id: queryer.queryId(post),
      name: queryer.queryName(post),
      isThreadPost: queryer.isThreadPost(post),
      contextMenuRoot: null,
    };

    postMetas[postNo] = postMeta;

    const insertPoint = queryer.postNoEl(post);
    if (insertPoint) {
      const parent = insertPoint.parentElement;

      // WORKAROUND: GM4 double insert
      if (parent.querySelector('.keyman-context')) {
        return;
      }

      const contextMenuRoot = document.createElement('details');
      contextMenuRoot.className = 'text-button keyman-context';
      contextMenuRoot.addEventListener('mouseenter', autoToggleContextMenu);
      insertPoint.after(contextMenuRoot);

      postMeta.contextMenuRoot = contextMenuRoot;

      renderContextMenu(post, postMeta, '');
    }
  }

  function autoToggleContextMenu() {
    this.open = true;
  }

  function renderContextMenu(post, postMeta) {
    const postId = postMeta.id;
    const postNo = postMeta.no;
    const postName = postMeta.name;
    const isThreadPost = postMeta.isThreadPost;
    const root = postMeta.contextMenuRoot;

    const menu = document.createElement('div');
    menu.className = 'keyman-context-menu';

    const summary = document.createElement('summary');
    summary.innerHTML = '&nbsp;HIDE';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('keyman-context-menu-close-button');
    closeButton.textContent = '關閉';
    closeButton.addEventListener('click', contextMenuCloseButtonCb);
    menu.appendChild(closeButton);

    const message = document.createElement('div');
    message.textContent = '加入隱藏關鍵字列表';
    menu.appendChild(message);

    for (const word of [postNo, postId, postName]) {
      const button = document.createElement('div');
      button.className = 'keyman-text-button';
      button.textContent = word;
      button.addEventListener('click', contextMenuCb);

      menu.appendChild(button);
    }

    root.replaceChildren(menu, summary);
  }

  function contextMenuCloseButtonCb() {
    this.parentElement.parentElement.open = false;
  }

  async function contextMenuCb() {
    const word = this.textContent;
    settings.read();
    await settings.addKeyword(word);
    settings.update();
  }

  const settings = readSettings();
  await addStyle();
  onLoad(settings);
})();
