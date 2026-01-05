// ==UserScript==
// @name         Komica NGID
// @description  NG id and post on komica
// @namespace    https://github.com/usausausausak
// @match        https://*.komica1.org/*/*
// @match        https://2cha.org/*/*
// @match        http://gzone-anime.info/UnitedSites/*
// @version      2.4.2
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/28383/Komica%20NGID.user.js
// @updateURL https://update.greasyfork.org/scripts/28383/Komica%20NGID.meta.js
// ==/UserScript==
const Komica = {};

(function komicaHostMatcher(exports) {
  'use strict'

  const MATCHER = [
    { name: 'komica',      matcher: /^([^\.]*\.)?komica[12]?\.(org|net|cc)$/ },
    { name: 'komica',      matcher: /^2cha\.org$/ },
    { name: '2cat',        matcher: /^2cat\.tk$/  },
    { name: 'gzone-anime', matcher: /^gzone-anime\.info$/ },
  ];

  function hostMatcher(location) {
    const host = location.host.replace(/:\d+$/, '');
    for (const { name, matcher } of MATCHER) {
      if (matcher.test(host)) {
        return name;
      }
    }
    return null;
  }

  function hostMatcherOr(location, err) {
    const host = hostMatcher(location);
    return (host) ? host : err;
  }

  Object.entries({
    hostMatcher, hostMatcherOr,
  }).forEach(([key, fn]) => {
    exports[key] = fn;
  });
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

  const QUERYERS_2CAT = {
    queryThreads: function queryThreads2Cat() {
      return document.getElementsByClassName('threadpost');
    },
    queryPosts: function queryPosts2Cat() {
      return document.querySelectorAll('.threadpost, .reply');
    },
    queryNo: function queryNo2Cat(post) {
      const matches = POST_NO_FROM_POST_EL_ID_REGEXP.exec(post.id);
      if (matches) {
        return matches[1];
      } else {
        return null;
      }
    },
    queryId: function queryId2Cat(post) {
      const postHeadEl = post.querySelector('div:first-child label');
      if (postHeadEl) {
        return idWithTailFromNowIdText(postHeadEl.innerText);
      } else {
        return null;
      }
    },
    queryThreadTitle: function queryThreadTitle2Cat(post) {
      const titleEl = post.querySelector('span.title');
      if (titleEl) {
        return titleEl.innerText;
      } else {
        return null;
      }
    },
    queryName: function queryName2Cat(post) {
      const nameEl = post.querySelector('span.name');
      if (nameEl) {
        return nameEl.innerText;
      } else {
        return null;
      }
    },
    queryBody: function queryBody2Cat(post) {
      const bodyEl = post.querySelector('div:first-child .quote');
      if (bodyEl) {
        return bodyEl.innerText;
      } else {
        return null;
      }
    },
    isThreadPost: function isThreadPost2Cat(post) {
      return ((post.classList) && (post.classList.contains('threadpost')));
    },
    isReplyPost: function isReplyPost2Cat(post) {
      return ((post.classList) && (post.classList.contains('reply')));
    },
    postNoEl: function postNoEl2Cat(post) {
      return post.querySelector('div:first-child .qlink');
    },
  };

  const QUERYERS_GZONE_ANIME = {
    ...QUERYERS_2CAT,
    queryId: function queryIdGzoneAnime(post) {
      const postHeadEl = post.querySelector('span.name').nextSibling;
      if ((postHeadEl) && (postHeadEl.nodeType === 3)) {
        return idFromNowIdText(postHeadEl.nodeValue);
      } else {
        return null;
      }
    },
    queryBody: function queryBodyGzoneAnime(post) {
      const bodyEl = post.querySelector('div:first-child .quote');
      if (bodyEl) {
        const body = bodyEl.innerText;
        const pushPostEl = bodyEl.querySelector('.pushpost');
        if (pushPostEl) {
          return body.substr(0, body.length - pushPostEl.innerText.length);
        } else {
          return body;
        }
      } else {
        return null;
      }
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
    '2cat':   QUERYERS_2CAT,
    'gzone-anime': QUERYERS_GZONE_ANIME,
  };

  function postQueryer(host) {
    const ret = (MAPPER[host]) ? MAPPER[host] : NULL_QUERYER;
    return Object.assign({}, ret);
  }

  exports.postQueryer = postQueryer;
})(Komica);

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
    closeBut.innerHTML = '閉じる';
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
  "use strict";

  const TAG = '[Komica_NGID]';

  const DEFAULT_STLYE_VARS = `
:root {
  --ngid-primary-background-color: #FFFFEE;
  --ngid-secondary-background-color: #F0E0D6;
  --ngid-highlight-background-color: #EEAA88;
  --ngid-highlight-color: #800000;
  --ngid-text-button-color: #00E;
  --ngid-text-button-hover-color: #D00;
  --ngid-separator-color: #000;
  --ngid-primary-shadow-color: #5f5059;
  --ngid-warning-color: #D00;
}
`;

  const GLOBAL_STYLE = `
.ngid-destroy {
  display: none;
}

.ngid-transparent-ng {
  display: none;
}

.ngid-ngpost {
  opacity: 0.3;
}

.ngid-text-button {
  cursor: pointer;
  color: var(--ngid-text-button-color);
}

.ngid-text-button:hover {
  color: var(--ngid-text-button-hover-color);
}

.ngid-context-menu {
  display: inline-flex;
  flex-direction: column;
  visibility: hidden;
  position: absolute;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: calc(-1.7em - 10px);
  transition: margin 100ms;
  width: max-content;
  background-color: var(--ngid-highlight-background-color);
}

.ngid-context:hover .ngid-context-menu {
  visibility: visible;
  margin-top: -1.7em;;
}

.ngid-ngpost .ngid-context-menu {
  color: var(--ngid-warning-color);
}

.popup_area .ngid-context {
  display: none;
}

.ngid-context {
  cursor: pointer;
  display: inline-block;
}

.ngid-context summary {
  list-style: none;
}

.ngid-context summary::-webkit-details-marker {
  display: none;
}

.ngid-context-menu-close-button {
  text-align: center;
  display: none;
}

@media screen and (max-device-width: 600px) {
  .ngid-context-menu  {
    visibility: visible;
    margin: -1.7em 6px 0 6px;
    width: calc(100% - 32px);
    left: 0;
  }

  .ngid-context-menu-close-button {
    display: unset;
    align-self: center;
  }
}
`;
  const DIALOG_STYLE = `
.ngid-dialog {
  visibility: hidden;
  position: fixed;
  top: -10px;
  z-index: 1;
  opacity: 0;
  display: grid;
  grid-template: "h c c" auto "f f b" min-content / min-content auto;
  width: 40%;
  height: 50%;
  margin: 0 30%;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 0 15px 5px var(--ngid-primary-shadow-color);
  background-color: var(--ngid-primary-background-color);
  transition: top 100ms, visibility 100ms, opacity 100ms;
}

.ngid-dialog-show {
  visibility: visible;
  opacity: 1;
  top: 30px;
}

.ngid-dialog-footer {
  grid-area: f;
  place-self: center end;
  margin: 10px 20px;
}

.ngid-dialog-close-button {
  place-self: center end;
  margin: 10px 20px;
}

.ngid-tabbox-header {
  grid-area: h;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 3px 6px;
  background-color: var(--ngid-secondary-background-color);
}

.ngid-tabbox-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.ngid-tabbox-group-title {
  cursor: pointer;
  font-weight: bold;
}

.ngid-tabbox-tab {
  cursor: pointer;
  flex: 1;
  padding: 3px 12px;
}

.ngid-tabbox-tab:hover {
  background-color: var(--ngid-highlight-background-color);
  color: var(--ngid-highlight-color);
}

.ngid-tabbox-tab.ngid-tabbox-selected {
  background-color: var(--ngid-highlight-background-color);
  color: var(--ngid-highlight-color);
}

.ngid-tabbox-container {
  grid-area: c;
  display: flex;
  overflow-y: auto;
}

.ngid-tabbox-page {
  width: 0;
  opacity: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: opacity 200ms;
}

.ngid-tabbox-page.ngid-tabbox-selected {
  width: 100%;
  opacity: 1;
  padding: 0 10px;
}

.ngid-listitem {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  margin: 2px 0;
}

.ngid-listitem:hover {
  background-color: var(--ngid-highlight-background-color);
  color: var(--ngid-highlight-color);
}

.ngid-inputfield {
  display: flex;
  justify-content: center;
  padding: 7px 5px;
  border-bottom: 1px solid var(--ngid-separator-color);
}

.ngid-inputfield input {
  flex: 1;
}

.ngid-lineedit-button {
  margin-left: 10px;
}

.ngid-lineedit-saveview {
  display: flex;
  justify-content: space-between;
  padding: 7px 5px;
}

.ngid-lineedit-textview {
  flex: 1;
}

.ngid-listitem span {
  max-width: 90%;
  overflow-wrap: break-word;
}

@media screen and (max-device-width: 600px) {
  .ngid-dialog {
    width: calc(100vw - 20px);
    margin: 0 10px;
    grid-template: "h h" min-content "c c" auto "f b" min-content / auto max-content;
  }

  .ngid-tabbox-container {
    width: calc(100vw - 20px);
  }

  .ngid-tabbox-group {
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(90vw);
  }
}
`;

  // We need diffence style at diffence host.
  const POLYFILL_STYLE = `
#toplink .text-button {
    cursor: pointer;
    color: var(--ngid-text-button-color);
    text-decoration: underline;
}

#toplink .text-button:hover {
    color: var(--ngid-text-button-hover-color);
}

.ngid-context {
    cursor: pointer;
    color: var(--ngid-text-button-color);
    margin-left: 0.2em; /* Nice try! */
}

.ngid-context .text-button:hover {
    color: var(--ngid-text-button-hover-color);
}
`;

  const HOST_SETTINGS = {
    'komica': {
      hostStyle: `
/*
 * All reply posts of the NGed thread post also be NGed.
 */
.ngid-ngthread > .reply {
    display: none !important; /* override hidePoliticalPosts */
}

.ngid-ngpost > *:not(.post-head),
.ngid-ngpost > .post-head > .title,
.ngid-ngpost > .post-head > .name {
    display: none;
}

.ngid-ngimage > .file-text,
.ngid-ngimage > .file-thumb {
    display: none;
}
`,
      darkStyleVars: `
:root {
  --ngid-primary-background-color: #1D1F21;
  --ngid-secondary-background-color: rgb(40, 42, 46);
  --ngid-highlight-background-color: rgb(0, 0, 0);
  --ngid-highlight-color: rgb(178, 148, 187);
  --ngid-text-button-color: #81A2BE;
  --ngid-text-button-hover-color: #FFC685;
  --ngid-separator-color: gray;
  --ngid-primary-shadow-color: rgb(40, 42, 46);
  --ngid-warning-color: #D00;
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
      stylePolyfill: false,
      nonStructuredLayout: false,
    },
    '2cat': {
      hostStyle: `
.ngid-context-menu {
    background-color: #AAEEAA;
}

/*
 * Since we can't hide the text node, just leave them out.
 */
.ngid-ngpost .quote,
.ngid-ngpost .title,
.ngid-ngpost .name,
.ngid-ngpost .warn_txt2,
.threadpost.ngid-ngpost > div > a:not(:last-of-type),
.reply.ngid-ngpost > div > a:not(:first-of-type) {
    display: none;
}

.threadpost.ngid-ngimage > div > a:not(:last-of-type),
.reply.ngid-ngimage > div > a:not(:first-of-type) {
    display: none;
}

.ngid-ngpost > div > a.qlink,
.ngid-ngimage > div > a.qlink {
    display: unset;
}
`,
      stylePolyfill: true,
      nonStructuredLayout: true,
    },
    'gzone-anime': {
      hostStyle: `
.ngid-ngpost .quote,
.ngid-ngpost .title,
.ngid-ngpost .name,
.ngid-ngpost .warn_txt2,
.threadpost.ngid-ngpost > a:not(:last-of-type),
.reply.ngid-ngpost > div > a:not(:first-of-type) {
    display: none;
}

.threadpost.ngid-ngimage > a:not(:last-of-type),
.reply.ngid-ngimage > div > a:not(:first-of-type) {
    display: none;
}

.ngid-ngpost a.qlink,
.ngid-ngimage a.qlink {
    display: unset;
}
`,
      stylePolyfill: true,
      nonStructuredLayout: true,
    },
  };

  const hostId = Komica.hostMatcherOr(document.location, 'unknown');
  console.debug(TAG, `We are at the board of host '${hostId}'.`);

  const queryer = Komica.postQueryer(hostId);

  const hostSettings = HOST_SETTINGS[hostId];

  const settings = createSettings(await ngidSettingsInner());

  async function ngidSettingsInner() {
    const tablePrefix = settingsTablePrefix(document.location);
    function getTableName(key) {
      return (key.startsWith('global')) ? key : `${tablePrefix}/${key}`;
    }

    const settingsInner = {
      ngIds: [], ngNos: [], ngWords: [], ngImages: [],
      options: {},
      globalNgWords: [],
    };

    for (const key of Object.keys(settingsInner)) {
      const tableName = getTableName(key);
      try {
        const value = JSON.parse(await GM.getValue(tableName, ''), settingsJsonReplacer);
        settingsInner[key] = value;
      } catch (e) {
        console.warn(TAG, `fail at read ${key}`);
      }

      if (Array.isArray(settingsInner[key])) {
        console.info(TAG, `${key} have ${settingsInner[key].length} items.`);
      }
    }

    settingsInner.saveNg = async function settingsSaveNg(key) {
      const tableName = getTableName(key);
      try {
        const jsonStr = JSON.stringify(settingsInner[key]);
        await GM.setValue(tableName, jsonStr);
      } catch (e) {
        console.error(TAG, e);
      }
    };

    settingsInner.saveOptions = async function settingsSaveOptions() {
      const tableName = getTableName('options');
      try {
        const jsonStr = JSON.stringify(settingsInner.options);
        await GM.setValue(tableName, jsonStr);
      } catch (e) {
        console.error(TAG, e);
      }
    };

    return settingsInner;
  }

  function settingsTablePrefix(loc) {
    const boardName = loc.pathname.split(/\//).slice(0, -1).join('/');
      return loc.host + boardName;
  }

  function settingsJsonReplacer(key, value) {
    if (key === 'creationTime') {
      return new Date(value);
    } else {
      return value;
    }
  }

  async function ngidAddStyle() {
    const styleVars = ((hostSettings) && (hostSettings.getStyleVars))
      ? hostSettings.getStyleVars() : DEFAULT_STLYE_VARS;
    await GM.addStyle(styleVars);

    // Shared style.
    await GM.addStyle(GLOBAL_STYLE);
    await GM.addStyle(DIALOG_STYLE);

    // Host-dependent style.
    if (hostSettings) {
      if (hostSettings.stylePolyfill) {
        await GM.addStyle(POLYFILL_STYLE);
      }

      if (hostSettings.hostStyle) {
        await GM.addStyle(hostSettings.hostStyle);
      }
    }
  }

  function ngidStart() {
    insertSettingDialog(settings);

    // Init all posts' NG state.
    for (const post of queryer.queryPosts()) {
      initPostMeta(post);
    }
    updateNgState();

    // Observing the thread expansion.
    // TODO: Move reusable code to a independent module.
    const threadObserver = new MutationObserver(function (records) {
      const postReplys = records.reduce((total, record) => {
        for (const node of record.addedNodes) {
          if (queryer.isReplyPost(node)) {
            total.push(node);
          }
        }
        return total;
      } , []);
      const replySize = postReplys.length;
      console.log(`Reply size change: ${replySize}`);

      postReplys.forEach(initPostMeta);
      updateNgState();
    });

    for (const thread of queryer.queryThreads()) {
      threadObserver.observe(thread, { childList: true });
    }

    // Binding with the setting update.
    function onSettingChangeCb(key) {
      if ((key == 'ngWords') || (key == 'globalNgWords')) {
        updateNgWordState();
      }
      updateNgState();
    }
    settings.on('add', onSettingChangeCb);
    settings.on('remove', onSettingChangeCb);
    settings.on('clear', onSettingChangeCb);
    settings.on('swap', onSettingChangeCb);

    function onOptionChangeCb() {
      for (const ngPost of document.querySelectorAll('.ngid-ngpost')) {
        if (settings.options.transparentNg) {
          ngPost.classList.add('ngid-transparent-ng');
        } else {
          ngPost.classList.remove('ngid-transparent-ng');
        }
      }
    }
    settings.on('option', onOptionChangeCb);
  }

  const NGID_DESCIPTORS = [
    {
      title: 'NGID', description: '指定したIDのスレ/レスを隠す',
      key: 'ngIds', prefix: 'ID:', lineEdit: true,
      replacer(value) {
        value = value.replace(/^ID:/, '');
        return value;
      },
    },
    {
      title: 'NGNo', description: '指定したスレ/レスを隠す',
      key: 'ngNos', prefix: 'No.', lineEdit: false,
      replacer(value) {
        value = value.replace(/^No./, '');
        if (value.match(/\D/)) {
          return '';
        }
        return value;
      },
    },
    {
      title: 'NGWord', description: '指定した文字列を含むスレ/レスを隠す',
      key: 'ngWords', prefix: '', lineEdit: true,
      replacer(value) { return value; },
    },
    {
      title: 'NGImage', description: '指定したIDのイラストを隠す',
      key: 'ngImages', prefix: 'ID:', lineEdit: true,
      replacer(value) {
        value = value.replace(/^ID:/, '');
        return value;
      },
    },
  ];

  const NGID_OPTIONS = {
    'transparentNg': { default: false, title: 'NG対象を透明化する' },
  };

  const GLOBAL_NGWORD_DESCRIPTOR = {
    title: 'NGWord', description: 'すべての板に適用するNGWord',
    key: 'globalNgWords', prefix: '', lineEdit: true,
    replacer(value) { return value; },
  };

  function createSettings(settingsInner) {
    const eventListener = {
      onadd: [], onremove: [], onclear: [], onswap: [],
      onoption: [],
    };

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

    function findNg(key, value) {
      if (!Array.isArray(settingsInner[key])) {
        throw new Error('Invalid key');
      }

      return settingsInner[key].find(v => v.value === value);
    }

    async function addNg(key, value) {
      if (!Array.isArray(settingsInner[key])) {
        throw new Error('Invalid key');
      } else if (settingsInner[key].some(v => value === v.value)) {
        return false;
      }

      settingsInner[key].push({ value: value, creationTime: new Date() });
      await settingsInner.saveNg(key);

      emitEvent('onadd', key, value);
      return true;
    }

    async function removeNg(key, value) {
      if (!Array.isArray(settingsInner[key])) {
        throw new Error('Invalid key');
      }

      settingsInner[key] = settingsInner[key].filter(v => v.value !== value);
      await settingsInner.saveNg(key);

      emitEvent('onremove', key, value);
      return true;
    }

    async function clearNg(key, predicate = null) {
      if (!Array.isArray(settingsInner[key])) {
        throw new Error('Invalid key');
      }

      if (typeof predicate === 'function') {
        settingsInner[key] = settingsInner[key].filter(predicate)
      } else {
        settingsInner[key] = [];
      }
      await settingsInner.saveNg(key);

      emitEvent('onclear', key);
    }

    // unsafe
    async function swapNg(key, list) {
      if (!Array.isArray(settingsInner[key])) {
        throw new Error('Invalid key');
      }

      const oldList = settingsInner[key];
      settingsInner[key] = list;
      await settingsInner.saveNg(key);

      emitEvent('onswap', key);

      return oldList;
    }

    async function saveOptions() {
      await settingsInner.saveOptions();
      emitEvent('onoption');
    }

    return {
      get ngIds() { return settingsInner.ngIds.map(v => v.value); },
      get ngNos() { return settingsInner.ngNos.map(v => v.value); },
      get ngWords() { return settingsInner.ngWords.map(v => v.value); },
      get ngImages() { return settingsInner.ngImages.map(v => v.value); },
      get globalNgWords() { return settingsInner.globalNgWords.map(v => v.value); },
      findNg, addNg, removeNg, clearNg, swapNg,
      get options() { return settingsInner.options; },
      saveOptions,
      on(eventName, cb) { addEventListener(`on${eventName}`, cb); },
    };
  }

  function insertSettingDialog(settings) {
    const { tabBox, footer } = Komica.insertDialog('NGID', 'ngid-settings-dialog', 'ngid');

    const localGroupTitle = 'この板';
    NGID_DESCIPTORS.forEach(({ title }) => tabBox.addPage(title, localGroupTitle));

    const optionsPageInfo = tabBox.addPage('&#x2699; 設定', localGroupTitle);

    const globalGroupTitle = '共通';
    const globalNgWordPageInfo = tabBox.addPage('NGWord', globalGroupTitle);

    function switchTab(pageIdx, root) {
      switch (pageIdx) {
        case optionsPageInfo.index:
          renderOptions(root);
          break;
        case globalNgWordPageInfo.index:
          renderList(root, GLOBAL_NGWORD_DESCRIPTOR);
          break;
        default:
          if ((pageIdx >= 0) && (pageIdx < NGID_DESCIPTORS.length)) {
            renderList(root, NGID_DESCIPTORS[pageIdx]);
          }
          break;
      }
    }

    tabBox.on('switch', switchTab);

    function getCurrentPageDescriptor() {
      const currentSelected = tabBox.currentSelected;
      switch (currentSelected) {
        case globalNgWordPageInfo.index:
          return GLOBAL_NGWORD_DESCRIPTOR;
        default:
          if ((currentSelected >= 0) && (currentSelected < NGID_DESCIPTORS.length)) {
            return NGID_DESCIPTORS[currentSelected];
          } else {
            return null;
          }
      }
    }

    function createListitem(value, prefix = '') {
      const view = document.createElement('div');
      view.className = 'ngid-listitem';

      const dataBlock = document.createElement('span');
      dataBlock.innerHTML = `${prefix}${value}`;
      view.appendChild(dataBlock);

      const delButton = document.createElement('span');
      delButton.className = 'ngid-text-button';
      delButton.innerHTML = '削除';
      delButton.dataset.value = value;
      delButton.addEventListener('click', removeItemCb, false);
      view.appendChild(delButton);
      return view;
    }

    async function removeItemCb(ev) {
      const pageDesciptor = getCurrentPageDescriptor();
      if (pageDesciptor === null) {
        return;
      }

      const button = ev.target;
      await settings.removeNg(pageDesciptor.key, button.dataset.value);
    }

    function createInputField(placeholder, replacer) {
      const view = document.createElement('div');
      view.className = 'ngid-inputfield';

      const textField = document.createElement('input');
      textField.placeholder = placeholder;
      view.appendChild(textField);

      const addButton = document.createElement('button');
      addButton.innerHTML = '追加';
      addButton.addEventListener('click',
        async ev => {
          const pageDesciptor = getCurrentPageDescriptor();
          if (pageDesciptor === null) {
            return;
          }

          const value = replacer(textField.value).trim();
          if (value !== '') {
            await settings.addNg(pageDesciptor.key, value);
            textField.value = '';
          }
          textField.focus();
        }, false);
      view.appendChild(addButton);
      return view;
    }

    function renderList(root, pageDesciptor) {
      root.innerHTML = '';

      const { title, description, key, prefix, lineEdit, replacer } = pageDesciptor;

      const inputField = createInputField(description, replacer);
      root.appendChild(inputField);

      if (lineEdit) {
        const editButton = document.createElement('button');
        editButton.classList.add('ngid-lineedit-button');
        editButton.innerHTML = '編集';
        editButton.addEventListener('click',
          () => renderLineEdit(root, pageDesciptor), false);

        inputField.appendChild(editButton);
      }

      // create items list
      const lists = settings[key];
      const items = lists.map(data => createListitem(data, prefix));
      items.reverse();
      items.forEach(item => root.appendChild(item));
    }

    function renderLineEdit(root, pageDesciptor) {
      root.innerHTML = '';

      const { title, description, key, prefix, lineEdit, replacer } = pageDesciptor;

      const textView = document.createElement('textarea');
      textView.classList.add('ngid-lineedit-textview');
      textView.value = settings[key].join('\n');

      const saveView = document.createElement('div');
      saveView.classList.add('ngid-lineedit-saveview');
      saveView.appendChild(document.createTextNode(description));

      const saveButton = document.createElement('button');
      saveButton.innerHTML = '保存';
      saveButton.addEventListener('click',
        async ev => {
          const lists = textView.value.split(/\n/)
            .map(v => replacer(v).trim())
            .filter(v => v.length > 0)
            .map(v => {
              return { value: v, creationTime: new Date() };
            });
          // swapNg will occur render and back to listview
          // unsafe
          await settings.swapNg(key, lists);
        }, false);
      saveView.appendChild(saveButton);

      // We need a block to fillup the page.
      const outerBlock = document.createElement('div');
      outerBlock.style.cssText = 'display: flex; flex-direction: column; height: 100%; width: 100%';
      outerBlock.appendChild(saveView);
      outerBlock.appendChild(textView);

      root.appendChild(outerBlock);
    }

    function createGap() {
      return document.createElement('hr');
    }

    function createCheckbox(optionId, defaultValue, title) {
      const checked = (optionId in settings.options) ? settings.options[optionId] : defaultValue;
      const view = document.createElement('label');
      view.for = `ngid-${optionId}`;
      view.className = 'ngid-listitem';

      const titleBlock = document.createElement('span');
      titleBlock.innerHTML = title;
      view.appendChild(titleBlock);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `ngid-${optionId}`;
      checkbox.className = 'ngid-text-button';
      checkbox.checked = checked;
      checkbox.addEventListener('change', async () => {
        settings.options[optionId] = checkbox.checked;
        await settings.saveOptions();
      });
      view.appendChild(checkbox);
      return view;
    }

    function renderOptions(root) {
      root.innerHTML = '';

      root.appendChild(createGap());
      for (const [optionId, details] of Object.entries(NGID_OPTIONS)) {

        switch (typeof details.default) {
          case 'boolean':
            root.appendChild(createCheckbox(optionId, details.default, details.title));
            break;
        }
        root.appendChild(createGap());
      }
    }

    // rerender current list if it is openning
    function renderCurrentListCb(key) {
      const pageDesciptor = getCurrentPageDescriptor();
      if ((pageDesciptor !== null) && (pageDesciptor.key === key)) {
        const root = tabBox.getCurrentPage();
        renderList(root, pageDesciptor);
      }
    }

    settings.on('add',    renderCurrentListCb);
    settings.on('remove', renderCurrentListCb);
    settings.on('clear',  renderCurrentListCb);
    settings.on('swap',   renderCurrentListCb);
  }

  // Mapping post no to meta data.
  //
  // String => PostMetaObject{ id: String, no: String, isThreadPost: bool, isContainsNgWord: bool, contextMenuRoot: HTMLElement }
  const postMetas = {};

  // Init and store the meta data of the `post`.
  //
  // This function maybe called twice for a post due to the thread expanding,
  // but we don't mind and just reinit the post.
  function initPostMeta(post) {
    // Only when we know the post no.
    const postNo = queryer.queryNo(post);
    if (!postNo) {
      return;
    }

    post.dataset.ngidNo = postNo; // For convenience.

    const postMeta = {
      no: postNo,
      id: queryer.queryId(post),
      isThreadPost: queryer.isThreadPost(post),
      isContainsNgWord: isContainsNgWord(post),
      contextMenuRoot: null,
    };

    postMetas[postNo] = postMeta;

    // Insert the context menu root and create the menu.
    const insertPoint = queryer.postNoEl(post);
    if (insertPoint) {
      const parent = insertPoint.parentElement;

      // WORKAROUND: GM4 double insert
      if (parent.querySelector('.ngid-context')) {
        return;
      }

      const contextMenuRoot = document.createElement('details');
      contextMenuRoot.className = 'text-button ngid-context';
      contextMenuRoot.addEventListener('mouseenter', autoToggleContextMenu);
      insertPoint.after(contextMenuRoot);

      postMeta.contextMenuRoot = contextMenuRoot;

      renderContextMenu(post, postMeta, '');
    }
  }

  function isContainsNgWord(post) {
    const postBody = queryer.queryBody(post) || '';
    const threadTitle = queryer.queryThreadTitle(post) || '';
    const pred = word => ((postBody.includes(word)) || (threadTitle.includes(word)));
    return settings.ngWords.some(pred) || settings.globalNgWords.some(pred);
  }

  function autoToggleContextMenu() {
    this.open = true;
  }

  function renderContextMenu(post, postMeta, ngState) {
    const postId = postMeta.id;
    const postNo = postMeta.no;
    const isThreadPost = postMeta.isThreadPost;
    const root = postMeta.contextMenuRoot;

    // Remove the menu body.
    while (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    const menu = document.createElement('div');
    menu.className = 'ngid-context-menu';
    root.appendChild(menu);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('ngid-context-menu-close-button');
    closeButton.innerHTML = 'メニューを閉じる';
    closeButton.addEventListener('click', contentMenuCloseButtonCb);
    menu.appendChild(closeButton);

    const summary = document.createElement('summary');
    summary.innerHTML = '&nbsp;NG';
    root.appendChild(summary);

    const postType = (isThreadPost) ? 'スレ' : 'レス';
    if (ngState === 'ngword') {
      menu.appendChild(document.createTextNode(
        `この${postType}にはNGWordsが含まれている。`));
    } else if (ngState === 'ngid') {
      menu.appendChild(document.createTextNode(
        `このIDはNGIDに指定されている。`));
    } else {
      // Only show buttons of enabled function.
      if (postNo) {
        const ngNoButton = document.createElement('div');
        ngNoButton.className = 'ngid-text-button';
        ngNoButton.dataset.no = postNo;
        if (ngState == 'ngno') {
          ngNoButton.innerHTML = `この${postType}を現す`;
        } else {
          ngNoButton.innerHTML = `この${postType}を隠す`;
        }
        ngNoButton.addEventListener('click', addNgNoButtonCb, false);

        menu.appendChild(ngNoButton);
      }

      if (postId) {
        const ngIdButton = document.createElement('div');
        ngIdButton.className = 'ngid-text-button';
        ngIdButton.dataset.id = postId;
        ngIdButton.innerHTML = `ID:${postId}をNGIDに追加`;
        ngIdButton.addEventListener('click', addNgIdButtonCb, false);
        menu.appendChild(ngIdButton);

        const ngImageButton = document.createElement('div');
        ngImageButton.className = 'ngid-text-button';
        ngImageButton.dataset.id = postId;
        if (isNgImage(post)) {
          ngImageButton.innerHTML = `ID:${postId}のイラストを表す`;
        } else {
          ngImageButton.innerHTML = `ID:${postId}のイラストを隠す`;
        }
        ngImageButton.addEventListener('click', addNgImageButtonCb, false);
        menu.appendChild(ngImageButton);
      }
    }
  }

  function contentMenuCloseButtonCb() {
    this.parentElement.parentElement.open = false;
  }

  async function addNgIdButtonCb(ev) {
    const id = this.dataset.id;
    if (await settings.addNg('ngIds', id)) {
      console.log(`add NGID ${id}`);
    }
  }

  async function addNgNoButtonCb(ev) {
    const no = this.dataset.no;
    if (await settings.addNg('ngNos', no)) {
      console.log(`add NGNO ${no}`);
    } else {
      console.log(`remove NGNO ${no}`);
      await settings.removeNg('ngNos', no);
    }
  }

  async function addNgImageButtonCb(ev) {
    const id = this.dataset.id;
    if (await settings.addNg('ngImages', id)) {
      console.log(TAG, `add NGImage ${id}`);
    } else {
      console.log(`remove NGImage ${id}`);
      await settings.removeNg('ngImages', id);
    }
  }

  function isNgImage(post) {
    return post.classList.contains('ngid-ngimage');
  }

  function updateNgWordState() {
    for (const post of queryer.queryPosts()) {
      const postMeta = postMetas[post.dataset.ngidNo];
      if (postMeta) {
        postMeta.isContainsNgWord = isContainsNgWord(post);
      }
    }
  }

  function updateNgState() {
    for (const post of queryer.queryPosts()) {
      const postMeta = postMetas[post.dataset.ngidNo];
      if (!postMeta) {
        continue;
      }

      const isNgPost = post.classList.contains('ngid-ngpost');
      let ngState = '';
      if (postMeta.isContainsNgWord) {
        ngState = 'ngword';
      } else if (settings.ngIds.includes(postMeta.id)) {
        ngState = 'ngid';
      } else if (settings.ngNos.includes(postMeta.no)) {
        ngState = 'ngno';
      }

      const needNgImage = settings.ngImages.includes(postMeta.id);

      setNgState(post, ngState !== '');
      setNgImage(post, needNgImage);

      // no touch if it isn't and wasn't a NGed post
      if ((isNgPost)
        || (ngState !== '')
        || (isNgImage(post) == needNgImage)) {
        const context = post.querySelector('.ngid-context');
        renderContextMenu(post, postMeta, ngState);
      }
    }

    // A workaround for non-structured layout.
    if (hostSettings.nonStructuredLayout) {
      for (const post of queryer.queryThreads()) {
        const isNgThread = post.classList.contains('ngid-ngpost');
        let el = post.nextSibling;
        while ((el) && (!(el instanceof HTMLHRElement))) {
          if (queryer.isReplyPost(el)) {
            if (isNgThread) {
              el.classList.add('ngid-destroy');
            } else {
              el.classList.remove('ngid-destroy');
            }
          }
          el = el.nextSibling;
        }
      }
    }
  }

  function setNgState(post, isNg) {
    if (isNg) {
      if (post.classList.contains('threadpost')) {
        post.parentElement.classList.add('ngid-ngthread');
      }
      post.classList.add('ngid-ngpost');
      if (settings.options.transparentNg) {
        post.classList.add('ngid-transparent-ng');
      }
    } else {
      if (post.classList.contains('threadpost')) {
        post.parentElement.classList.remove('ngid-ngthread');
      }
      post.classList.remove('ngid-ngpost');
      if (settings.options.transparentNg) {
        post.classList.remove('ngid-transparent-ng');
      }
    }
  }

  function setNgImage(post, isNg) {
    if (isNg) {
      post.classList.add('ngid-ngimage');
    } else {
      post.classList.remove('ngid-ngimage');
    }
  }

  await ngidAddStyle();
  ngidStart();
})();
