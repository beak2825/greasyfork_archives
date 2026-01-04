// ==UserScript==
// @name            Arca Refresher
// @namespace       LeKAKiD
// @description     Arca Live Extension
// @homepageURL     https://github.com/lekakid/ArcaRefresher
// @supportURL      https://arca.live/b/namurefresher
// @match           https://*.arca.live/*
// @match           https://arca.live/*
// @exclude-match   https://st*.arca.live/*
// @noframes
// @run-at          document-start
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest
// @version         2.10.6
// @author          LeKAKiD
// @require         https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require         https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require         https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom,npm/@violentmonkey/ui
// @downloadURL https://update.greasyfork.org/scripts/419977/Arca%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/419977/Arca%20Refresher.meta.js
// ==/UserScript==

(function () {
'use strict';

function _extends() {
  _extends = Object.assign || function (target) {
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

var css_248z = "#refresherSetting {\r\n    margin: 0 auto;\r\n    max-width: 1300px;\r\n    border: 1px solid #bbb;\r\n    background-color: #fff;\r\n    padding: 1rem;\r\n}\r\n\r\n#refresherSetting select,\r\n#refresherSetting textarea,\r\n#refresherSetting input[type=\"text\"] {\r\n    display: block;\r\n    width: 100%;\r\n    padding: .5rem .75rem;\r\n    color: #55595c;\r\n    background-color: #fff;\r\n    border: 1px solid #bbb;\r\n}\r\n\r\n#refresherSetting input[disabled] {\r\n    background-color: #eee;\r\n}\r\n\r\n#refresherSetting select {\r\n    overflow: scroll;\r\n}\r\n\r\n#refresherSetting label {\r\n    display: inline;\r\n}\r\n\r\n@media (prefers-color-scheme:dark) {\r\n    #refresherSetting {\r\n        border: 1px solid #43494c;\r\n        background-color: #181a1b;\r\n    }\r\n    \r\n    #refresherSetting select,\r\n    #refresherSetting textarea,\r\n    #refresherSetting input[type=\"text\"] {\r\n        color: #e2e2e2;\r\n        background-color: #181a1b;\r\n        border: 1px solid #43494c;\r\n    }\r\n    \r\n    #refresherSetting input[disabled] {\r\n        background-color: #999;\r\n    }\r\n}";

const categoryKey = {
  UTILITY: 'utility',
  INTERFACE: 'interface',
  MEMO: 'memo',
  MUTE: 'mute',
  CHANNEL_ADMIN: 'channelAdmin'
};
var Configure = {
  categoryKey,
  initialize,
  addSetting,
  get,
  set
};
const configCategoryString = {
  utility: '유틸리티',
  interface: '인터페이스 변경',
  memo: '메모 관리',
  mute: '뮤트 설정',
  channelAdmin: '채널 관리자 기능'
};
const saveCallbackList = [];
const loadCallbackList = [];

function addSetting(settingObject) {
  const {
    category,
    header,
    option,
    description,
    callback
  } = settingObject;
  const {
    save,
    load
  } = callback;
  const row = VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, header), VM.createElement("div", {
    class: "col-md-9"
  }, option, description && VM.createElement("p", null, description)));
  document.querySelector(`#refresherSetting #${category}`).append(row);
  saveCallbackList.push(save);
  loadCallbackList.push(load);
}

function importConfig(JSONString) {
  const data = JSON.parse(JSONString); // 임시 수정 설정 검증 루틴 필요

  for (const key of Object.keys(data)) {
    GM_setValue(key, data[key]);
  }
}

function exportConfig() {
  const keys = GM_listValues();
  const config = {};

  for (const key of keys) {
    config[key] = GM_getValue(key);
  }

  const result = JSON.stringify(config);
  return result;
}

function resetConfig() {
  const keys = GM_listValues();

  for (const key of keys) {
    GM_deleteValue(key);
  }
}

function initialize() {
  // 스크립트 설정 버튼 엘리먼트
  const showBtn = VM.createElement("li", {
    class: "nav-item dropdown",
    id: "showSetting"
  }, VM.createElement("a", {
    "aria-expanded": "false",
    class: "nav-link",
    href: "#"
  }, VM.createElement("span", {
    class: "d-none d-sm-block"
  }, "\uC2A4\uD06C\uB9BD\uD2B8 \uC124\uC815"), VM.createElement("span", {
    class: "d-block d-sm-none"
  }, VM.createElement("span", {
    class: "ion-gear-a"
  }))));
  const contentWrapper = document.querySelector('.content-wrapper');
  const configContainer = VM.createElement("div", {
    class: "hidden clearfix",
    id: "refresherSetting"
  }, VM.createElement("style", null, css_248z), VM.createElement("div", {
    class: "row"
  }, VM.createElement("div", {
    class: "col-sm-0 col-md-2"
  }), VM.createElement("div", {
    class: "col-sm-12 col-md-8"
  }, VM.createElement("div", {
    class: "dialog card"
  }, VM.createElement("div", {
    class: "card-block"
  }, VM.createElement("h4", {
    class: "card-title"
  }, "\uC544\uCE74 \uB9AC\uD504\uB808\uC154(Arca Refresher) \uC124\uC815"), VM.createElement("div", {
    id: "category"
  }), VM.createElement("div", {
    class: "row btns"
  }, VM.createElement("div", {
    class: "col-12"
  }, VM.createElement("a", {
    href: "#",
    id: "exportConfig",
    class: "btn btn-primary"
  }, "\uC124\uC815 \uB0B4\uBCF4\uB0B4\uAE30"), VM.createElement("a", {
    href: "#",
    id: "importConfig",
    class: "btn btn-secondary"
  }, "\uC124\uC815 \uAC00\uC838\uC624\uAE30"), VM.createElement("a", {
    href: "#",
    id: "resetConfig",
    class: "btn btn-danger"
  }, "\uC124\uC815 \uCD08\uAE30\uD654"))), VM.createElement("div", {
    class: "row btns"
  }, VM.createElement("div", {
    class: "col-12"
  }, VM.createElement("a", {
    href: "#",
    id: "saveAndClose",
    class: "btn btn-primary"
  }, "\uC800\uC7A5"), VM.createElement("a", {
    href: "#",
    id: "closeSetting",
    class: "btn btn-arca"
  }, "\uB2EB\uAE30")))))))); // 설정 카테고리 생성

  const categorySlot = configContainer.querySelector('#category');

  for (const key of Object.keys(configCategoryString)) {
    categorySlot.append(VM.createElement(VM.Fragment, null, VM.createElement("hr", null), VM.createElement("h5", {
      class: "card-title"
    }, configCategoryString[key]), VM.createElement("div", {
      id: key
    })));
  } // 설정 버튼 클릭 이벤트


  showBtn.addEventListener('click', () => {
    if (configContainer.classList.contains('hidden')) {
      for (const func of loadCallbackList) {
        func();
      }

      contentWrapper.classList.add('disappear');
    } else {
      configContainer.classList.add('disappear');
    }
  }); // 애니메이션 처리

  contentWrapper.addEventListener('animationend', () => {
    if (contentWrapper.classList.contains('disappear')) {
      contentWrapper.classList.add('hidden');
      contentWrapper.classList.remove('disappear');
      configContainer.classList.add('appear');
      configContainer.classList.remove('hidden');
    } else if (contentWrapper.classList.contains('appear')) {
      contentWrapper.classList.remove('appear');
    }
  });
  configContainer.addEventListener('animationend', () => {
    if (configContainer.classList.contains('disappear')) {
      configContainer.classList.add('hidden');
      configContainer.classList.remove('disappear');
      contentWrapper.classList.add('appear');
      contentWrapper.classList.remove('hidden');
    } else if (configContainer.classList.contains('appear')) {
      configContainer.classList.remove('appear');
    }
  }); // 엘리먼트 부착

  document.querySelector('ul.navbar-nav').append(showBtn);
  contentWrapper.insertAdjacentElement('afterend', configContainer); // 이벤트 핸들러

  configContainer.querySelector('#exportConfig').addEventListener('click', event => {
    event.preventDefault();
    const data = btoa(encodeURIComponent(exportConfig()));
    navigator.clipboard.writeText(data);
    alert('클립보드에 설정이 복사되었습니다.');
  });
  configContainer.querySelector('#importConfig').addEventListener('click', event => {
    event.preventDefault();
    let data = prompt('가져올 설정 데이터를 입력해주세요');
    if (data == null) return;

    try {
      if (data == '') throw '[Setting.importConfig] 공백 값을 입력했습니다.';
      data = decodeURIComponent(atob(data));
      importConfig(data);
      location.reload();
    } catch (error) {
      alert('올바르지 않은 데이터입니다.');
      console.error(error);
    }
  });
  configContainer.querySelector('#resetConfig').addEventListener('click', event => {
    event.preventDefault();
    if (!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;
    resetConfig();
    location.reload();
  });
  configContainer.querySelector('#saveAndClose').addEventListener('click', event => {
    event.preventDefault();

    for (const func of saveCallbackList) {
      func();
    }

    location.reload();
  });
  configContainer.querySelector('#closeSetting').addEventListener('click', () => {
    configContainer.classList.add('disappear');
  });
}

function get({
  key,
  defaultValue
}) {
  if (Array.isArray(defaultValue)) {
    return GM_getValue(key, [...defaultValue]);
  }

  if (typeof defaultValue == 'object') {
    return GM_getValue(key, _extends({}, defaultValue));
  }

  return GM_getValue(key, defaultValue);
}

function set({
  key
}, value) {
  GM_setValue(key, value);
}

var css_248z$1 = "#context-wrapper.mobile {\r\n    display: flex;\r\n    justify-content: center;\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n}\r\n\r\n#context-wrapper.mobile #context-menu {\r\n    width: 80%;\r\n    align-self: center;\r\n}\r\n\r\n#context-menu {\r\n    position: fixed;\r\n    width: 300px;\r\n    padding: .5rem;\r\n    border: 1px solid #bbb;\r\n    background-color: #fff;\r\n    z-index: 20;\r\n    pointer-events: auto;\r\n}\r\n\r\n#context-menu .devider {\r\n    height: 1px;\r\n    margin: .5rem 0;\r\n    overflow: hidden;\r\n    background-color: #e5e5e5;\r\n}\r\n\r\n#context-menu .item {\r\n    display: block;\r\n    width: 100%;\r\n    padding: 3px 20px;\r\n    clear: both;\r\n    font-weight: 400;\r\n    color: #373a3c;\r\n    white-space: nowrap;\r\n    border: 0;\r\n}\r\n\r\n#context-menu .item:hover,\r\n#context-menu .item:focus {\r\n    color: #2b2d2f;\r\n    background-color: #f5f5f5;\r\n    text-decoration: none;\r\n}\r\n\r\n#context-wrapper {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n}";

var ContextMenu = {
  initialize: initialize$1,
  hide,
  addMenuGroup,
  createMenu,
  getContextData
};
const eventList = {
  clickOnImage: []
};
const contextMenuView = VM.createElement("div", {
  class: "menu",
  id: "context-menu"
});
const contextMenuWrapper = VM.createElement("div", {
  class: "hidden",
  id: "context-wrapper"
}, contextMenuView);
let mobile = false;

function initialize$1() {
  // on/off 설정 넣어
  document.head.append(VM.createElement("style", null, css_248z$1));
  document.body.append(contextMenuWrapper);

  if (window.outerWidth <= 768) {
    mobile = true;
    contextMenuWrapper.classList.add('mobile');
  }

  function callEvent(event) {
    if (!contextMenuWrapper.classList.contains('hidden')) {
      hide();
      return;
    }

    if (event.target.closest('.article-body')) {
      if (event.target.closest('img, video:not([controls])')) {
        contextMenuView.dataset.url = `${event.target.src}${event.target.tagName == 'VIDEO' ? '.gif' : ''}?type=orig`;
        removeMenuAll();
        appendMenu(eventList.clickOnImage);
        show(event);
        event.preventDefault();
      }
    }
  }

  if (mobile) {
    document.addEventListener('touchstart', event => {
      if (event.touches.length == 2) {
        callEvent(event);
      }
    });
  } else {
    document.addEventListener('contextmenu', callEvent);
  }

  document.addEventListener('click', event => {
    if (contextMenuWrapper.classList.contains('hidden')) return;
    if (event.target.closest('#context-menu')) return;
    hide();
    event.preventDefault();
  });
  document.addEventListener('scroll', () => {
    hide();
  });
}

function show(event) {
  contextMenuWrapper.classList.remove('hidden');

  if (!mobile) {
    const x = event.clientX + 2;
    const rect = contextMenuView.getBoundingClientRect();
    let y;

    if (event.clientY + rect.height > window.innerHeight) {
      y = event.clientY - rect.height - 2;
    } else {
      y = event.clientY + 2;
    }

    contextMenuView.setAttribute('style', `left: ${x}px; top: ${y}px`);
  }
}

function hide() {
  contextMenuWrapper.classList.add('hidden');
}

function addMenuGroup(event, contextElement) {
  if (!eventList.hasOwnProperty(event)) {
    console.error('[ContextMenu.registContextMenu] 존재하지 않는 이벤트 등록');
    return;
  }

  eventList[event].push(contextElement);
}

function appendMenu(elementArray) {
  let count = 0;

  for (const element of elementArray) {
    if (count > 0) contextMenuView.append(VM.createElement("div", {
      class: "devider"
    }));
    contextMenuView.append(element);
    count += 1;
  }
}

function removeMenuAll() {
  while (contextMenuView.childElementCount) {
    contextMenuView.removeChild(contextMenuView.children[0]);
  }
}

function createMenu(MenuItem) {
  const {
    text,
    description,
    onClick
  } = MenuItem;
  const menuItem = VM.createElement("a", {
    href: "#",
    class: "item",
    title: description || false
  }, text);
  menuItem.addEventListener('click', onClick);
  return menuItem;
}

function getContextData(name) {
  return contextMenuView.dataset[name];
}

var Parser = {
  initialize: initialize$2,
  getChannelInfo,
  getArticleInfo,
  getCurrentState,
  hasArticle,
  hasBoard,
  hasComment,
  hasWriteView,
  queryView,
  queryItems,
  parseUserInfo,
  parseUserID
};
let articleView = null;
let boardView = null;
let commentView = null;
let writeView = null;
let currentChannel = '';
let currentChannelID = '';
let currentState = '';
let currentArticleTitle = '';
let currentArticleCategory = '';
let currentArticleAuthor = '';
let currentArticleAuthorID = '';

function initialize$2() {
  const articleElement = document.querySelector('article');
  const boardTitle = articleElement.querySelector('.board-title');
  articleView = articleElement.querySelector('.article-wrapper');
  commentView = articleElement.querySelector('#comment');
  boardView = articleElement.querySelector('div.board-article-list .list-table, div.included-article-list .list-table');
  writeView = articleElement.querySelector('.article-write');

  if (boardTitle) {
    currentChannel = boardTitle.querySelector('a:not([class])').textContent;
    currentChannelID = location.pathname.split('/')[2];
  }

  if (articleView) {
    currentState = 'article';
    const titleElement = articleView.querySelector('.article-head .title');
    const categoryElement = articleView.querySelector('.article-head .badge');
    const authorElement = articleView.querySelector('.article-head .user-info');
    currentArticleTitle = titleElement ? titleElement.lastChild.textContent.trim() : '';
    currentArticleCategory = categoryElement ? categoryElement.textContent : '';
    currentArticleAuthor = authorElement ? parseUserInfo(authorElement) : '';
    currentArticleAuthorID = authorElement ? parseUserID(authorElement) : '';
  } else if (boardView) {
    currentState = 'board';
  } else if (writeView) {
    currentState = 'write';
  }
}

function getCurrentState() {
  return currentState;
}

function getChannelInfo() {
  return {
    id: currentChannelID,
    name: currentChannel
  };
}

function getArticleInfo() {
  if (!articleView) {
    console.error('[Parser.getArticleInfo] 게시물 확인 불가');
    return;
  }

  return {
    title: currentArticleTitle,
    category: currentArticleCategory,
    author: currentArticleAuthor,
    authorID: currentArticleAuthorID
  };
}

function hasArticle() {
  return !!articleView;
}

function hasBoard() {
  return !!boardView;
}

function hasComment() {
  return !!commentView;
}

function hasWriteView() {
  return !!writeView;
}

function queryView(query) {
  switch (query) {
    case 'article':
      return articleView;

    case 'board':
      return boardView;

    case 'comment':
      return commentView;

    case 'write':
      return writeView;

    default:
      return document;
  }
}

function queryItems(query, viewQuery, viewElement) {
  const view = viewElement || queryView(viewQuery);

  switch (query) {
    case 'articles':
      return view.querySelectorAll('a.vrow:not(.notice-unfilter)');

    case 'comments':
      return view.querySelectorAll('.comment-item');

    case 'emoticons':
      return view.querySelectorAll('.emoticon');

    case 'users':
      return view.querySelectorAll('.user-info');

    case 'avatars':
      return view.querySelectorAll('.avatar');

    case 'ips':
      return view.querySelectorAll('.user-info small');

    default:
      return null;
  }
}

function parseUserInfo(infoElement) {
  if (!infoElement) {
    console.error('[Parser.parseUserInfo] 올바르지 않은 부모 엘리먼트 사용');
    return null;
  }

  if (infoElement.dataset.info) {
    return infoElement.dataset.info;
  }

  let id = infoElement.children[0].title || infoElement.children[0].textContent;

  if (/\([0-9]*\.[0-9]*\)/.test(id)) {
    id = infoElement.childNodes[0].textContent + id;
  }

  infoElement.dataset.info = id;
  return id;
}

function parseUserID(infoElement) {
  if (!infoElement) {
    console.error('[Parser.parseUserID] 올바르지 않은 부모 엘리먼트 사용');
    return null;
  }

  if (infoElement.dataset.id) {
    return infoElement.dataset.id;
  }

  let id = infoElement.children[0].title || infoElement.children[0].textContent;

  if (id.indexOf('#') > -1) {
    id = id.substring(id.indexOf('#'));
  }

  infoElement.dataset.id = id;
  return id;
}

async function waitForElement(selector) {
  let targetElement = document.querySelector(selector);
  if (targetElement) return Promise.resolve(targetElement);
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      targetElement = document.querySelector(selector);

      if (targetElement) {
        observer.disconnect();
        resolve(targetElement);
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  });
}

var ArticleMenu = {
  addHeaderBtn
};

function addHeaderBtn(buttonObject) {
  const {
    text,
    icon,
    description,
    onClick
  } = buttonObject;
  const headerMenu = Parser.queryView('article').querySelector('.edit-menu');
  const element = VM.createElement("a", {
    href: "#",
    title: description
  }, icon && VM.createElement("span", {
    class: icon
  }), ` ${text}`);
  element.addEventListener('click', onClick);
  headerMenu.prepend(VM.createElement(VM.Fragment, null, element, headerMenu.childElementCount > 0 && VM.createElement("span", {
    class: "sep"
  })));
}

var AnonymousNick = {
  load
};
const DefaultPrefix = ['웃는', '화난', '불쌍한', '즐거운', '건장한', '해탈한', '광기의', '귀여운', '곱슬머리', '개구쟁이', '자신있는', '방구석', '노래하는', '책읽는', '구르는', '비틀거리는', '힘든', '순수한', '행복한', '불닭먹는'];
const DefaultSuffix = ['미호', '캬루', '둘리', '도바킨', '테레사', '윾돌이', '보노보노', '다비', '공룡', '아야'];

function load() {
  try {
    if (Parser.hasArticle()) {
      addArticleMenu();
    }
  } catch (error) {
    console.error(error);
  }
}

function addArticleMenu() {
  ArticleMenu.addHeaderBtn({
    text: '익명화',
    icon: 'ion-wand',
    description: '게시물 작성자와 댓글 작성자를 일시적 익명으로 만듭니다.',

    onClick(event) {
      event.preventDefault();
      const userElements = Parser.queryItems('users', 'article');
      const avatarElements = Parser.queryItems('avatars', 'article');
      avatarElements.forEach(e => {
        e.remove();
      });
      const users = new Set();
      userElements.forEach(e => {
        users.add(Parser.parseUserID(e));
      });
      const alterNicks = new Set();
      let overcount = 1;

      while (alterNicks.size < users.size) {
        if (alterNicks.size < DefaultPrefix.length * DefaultSuffix.length) {
          const numPrefix = Math.floor(Math.random() * DefaultPrefix.length);
          const numSuffix = Math.floor(Math.random() * DefaultSuffix.length);
          alterNicks.add(`${DefaultPrefix[numPrefix]} ${DefaultSuffix[numSuffix]}`);
        } else {
          alterNicks.add(`비둘기 ${`${overcount++}`.padStart(4, '0')}`);
        }
      }

      const alterTable = {};

      for (let i = 0; i < users.size; i += 1) {
        alterTable[[...users][i]] = [...alterNicks][i];
      }

      userElements.forEach(e => {
        e.textContent = alterTable[Parser.parseUserID(e)];
      });
    }

  });
}

function getTimeStr(datetime) {
  const date = new Date(datetime);
  let hh = date.getHours();
  let mm = date.getMinutes();

  if (hh.toString().length == 1) {
    hh = `0${hh}`;
  }

  if (mm.toString().length == 1) {
    mm = `0${mm}`;
  }

  return `${hh}:${mm}`;
}
function getDateStr(datetime) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  if (month.toString().length == 1) {
    month = `0${month}`;
  }

  if (day.toString().length == 1) {
    day = `0${day}`;
  }

  if (hh.toString().length == 1) {
    hh = `0${hh}`;
  }

  if (mm.toString().length == 1) {
    mm = `0${mm}`;
  }

  if (ss.toString().length == 1) {
    ss = `0${ss}`;
  }

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}
function in24(datetime) {
  const target = new Date(datetime);
  const criteria = new Date();
  criteria.setHours(criteria.getHours() - 24);
  if (target > criteria) return true;
  return false;
}

var css_248z$2 = "@keyframes light{\r\n    0% {\r\n        background-color: rgb(246, 247, 239);\r\n    }\r\n    100% {\r\n        background-color: rgba(255, 255, 255, 0);\r\n    }\r\n\r\n}\r\n\r\n@keyframes loaderspin {\r\n    0% { transform: rotate(0deg);\r\n        box-shadow: 0 0 15px #3d414d;\r\n    }\r\n    5% {\r\n        box-shadow: 0 0 -10px #3d414d;\r\n    }\r\n    15%{\r\n        box-shadow: 0 0 0px #3d414d;\r\n    }\r\n    100% { transform: rotate(360deg);\r\n        box-shadow: 0 0 0px #3d414d;\r\n    }\r\n}\r\n\r\n#autoRefresher {\r\n    border: 6px solid #d3d3d3;\r\n    border-top: 6px solid #3d414d;\r\n    border-radius: 50%;\r\n    position: fixed;\r\n    bottom: 30px;\r\n    left: 10px;\r\n    width: 40px;\r\n    height: 40px;\r\n    z-index: 20;\r\n}\r\n\r\n.target {\r\n    background-color: #e6aaaa;\r\n}\r\n\r\n.badge {\r\n    transition: none;\r\n}";

var AutoRefresher = {
  load: load$1,
  addRefreshCallback
};
const REFRESH_TIME = {
  key: 'refreshTime',
  defaultValue: 3
};
const HIDE_REFRESHER = {
  key: 'hideRefresher',
  defaultValue: false
};
let refreshTime = 0;
let loader = null;
let loopInterval = null;
const refreshCallbackList = [];

function load$1() {
  try {
    addSetting$1();
    if (Parser.hasArticle()) return;

    if (Parser.hasBoard()) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$1() {
  const refreshTimeSelect = VM.createElement("select", null, VM.createElement("option", {
    value: "0"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "3"
  }, "3\uCD08"), VM.createElement("option", {
    value: "5"
  }, "5\uCD08"), VM.createElement("option", {
    value: "10"
  }, "10\uCD08"));
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '자동 새로고침',
    option: refreshTimeSelect,
    description: '일정 시간마다 게시물 목록을 갱신합니다.',
    callback: {
      save() {
        Configure.set(REFRESH_TIME, Number(refreshTimeSelect.value));
      },

      load() {
        refreshTimeSelect.value = Configure.get(REFRESH_TIME);
      }

    }
  });
  const hideRefreshSign = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40"));
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '새로고침 애니메이션 숨김',
    option: hideRefreshSign,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_REFRESHER, hideRefreshSign.value == 'true');
      },

      load() {
        hideRefreshSign.value = Configure.get(HIDE_REFRESHER);
      }

    }
  });
}

function addRefreshCallback(callback) {
  refreshCallbackList.push(callback);
  refreshCallbackList.sort((a, b) => a.priority - b.priority);
}

function apply() {
  refreshTime = Configure.get(REFRESH_TIME);
  if (refreshTime == 0) return;
  const articleList = Parser.queryView('board');
  loader = VM.createElement("div", {
    id: "autoRefresher",
    class: Configure.get(HIDE_REFRESHER) ? 'hidden' : ''
  }, VM.createElement("style", null, css_248z$2));
  articleList.append(loader);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();else if (loopInterval == null) start();
  });
  articleList.addEventListener('click', event => {
    if (event.target.tagName != 'INPUT') return;

    if (event.target.classList.contains('batch-check-all')) {
      if (event.target.checked) stop();else start();
    } else {
      const btns = articleList.querySelectorAll('.batch-check');

      for (const btn of btns) {
        if (btn.checked) {
          stop();
          return;
        }
      }

      start();
    }
  });
  start();
}

function swapNewArticle(newArticles) {
  const oldArticles = Parser.queryItems('articles', 'board');
  const oldnums = [];

  for (const o of oldArticles) {
    oldnums.push(o.pathname.split('/')[3]);
    o.remove();
  }

  for (const n of newArticles) {
    if (oldnums.indexOf(n.pathname.split('/')[3]) == -1) {
      n.setAttribute('style', 'animation: light 0.5s');
    }

    const lazywrapper = n.querySelector('noscript');
    if (lazywrapper) lazywrapper.outerHTML = lazywrapper.innerHTML;
    const time = n.querySelector('time');

    if (time && in24(time.dateTime)) {
      time.innerText = getTimeStr(time.dateTime);
    }
  }

  const articleList = Parser.queryView('board');
  articleList.append(...newArticles);
  const noticeUnfilterBtn = articleList.querySelector('.notice-unfilter');

  if (noticeUnfilterBtn) {
    const firstArticle = articleList.querySelector('a.vrow:not(.notice)');
    firstArticle.insertAdjacentElement('beforebegin', noticeUnfilterBtn);
  }

  for (const {
    callback
  } of refreshCallbackList) {
    callback();
  }
}

async function routine() {
  const newArticles = await new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const rootView = req.response.querySelector('div.board-article-list .list-table');
      const articles = Parser.queryItems('articles', null, rootView);
      resolve(articles);
    });
    req.send();
  });
  swapNewArticle(newArticles);
  animate();
}

function animate() {
  loader.removeAttribute('style');
  setTimeout(() => {
    loader.setAttribute('style', `animation: loaderspin ${refreshTime}s ease-in-out`);
  }, 50);
}

function setLoop() {
  loopInterval = setInterval(() => routine(), refreshTime * 1000);
}

function start() {
  animate();
  setLoop();
}

function stop() {
  clearInterval(loopInterval);
  loopInterval = null;
}

var ArticleRemover = {
  load: load$2
};
const AUTO_REMOVE_USER = {
  key: 'autoRemoveUser',
  defaultValue: []
};
const AUTO_REMOVE_KEYWORD = {
  key: 'autoRemoveKeyword',
  defaultValue: []
};
const USE_AUTO_REMOVER_TEST = {
  key: 'useAutoRemoverTest',
  defaultValue: true
};

function load$2() {
  try {
    addSetting$2();

    if (Parser.hasBoard()) {
      AutoRefresher.addRefreshCallback({
        priority: 999,
        callback: remove
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$2() {
  const removeTestMode = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.CHANNEL_ADMIN,
    header: '삭제 테스트 모드',
    option: removeTestMode,
    description: '게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.',
    callback: {
      save() {
        Configure.set(USE_AUTO_REMOVER_TEST, removeTestMode.value == 'true');
      },

      load() {
        removeTestMode.value = Configure.get(USE_AUTO_REMOVER_TEST);
      }

    }
  });
  const removeKeywordList = VM.createElement("textarea", {
    rows: "6",
    placeholder: "\uC0AD\uC81C\uD560 \uD0A4\uC6CC\uB4DC\uB97C \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  });
  Configure.addSetting({
    category: Configure.categoryKey.CHANNEL_ADMIN,
    header: '게시물 삭제 키워드 목록',
    option: removeKeywordList,
    description: '지정한 유저가 작성한 게시물을 삭제합니다.',
    callback: {
      save() {
        Configure.set(AUTO_REMOVE_KEYWORD, removeKeywordList.value.split('\n').filter(i => i != ''));
      },

      load() {
        removeKeywordList.value = Configure.get(AUTO_REMOVE_KEYWORD).join('\n');
      }

    }
  });
  const removeUserList = VM.createElement("textarea", {
    rows: "6",
    placeholder: "\uC0AD\uC81C\uD560 \uC774\uC6A9\uC790\uC758 \uB2C9\uB124\uC784\uC744 \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  });
  Configure.addSetting({
    category: Configure.categoryKey.CHANNEL_ADMIN,
    header: '게시물 삭제 유저 목록',
    option: removeUserList,
    description: '지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.',
    callback: {
      save() {
        Configure.set(AUTO_REMOVE_USER, removeUserList.value.split('\n').filter(i => i != ''));
      },

      load() {
        removeUserList.value = Configure.get(AUTO_REMOVE_USER).join('\n');
      }

    }
  });
}

function remove() {
  const form = document.querySelector('.batch-delete-form');
  if (form == null) return false;
  const userlist = Configure.get(AUTO_REMOVE_USER);
  const keywordlist = Configure.get(AUTO_REMOVE_KEYWORD);
  const testMode = Configure.get(USE_AUTO_REMOVER_TEST);
  const articles = Parser.queryItems('articles', 'board');
  const articleid = [];
  articles.forEach(item => {
    const titleElement = item.querySelector('.col-title');
    const userElement = item.querySelector('.user-info');
    if (!titleElement || !userElement) return;
    const title = titleElement.innerText;
    const author = Parser.parseUserID(userElement);
    const checkbox = item.querySelector('.batch-check');
    const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author);
    const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title);

    if (titleAllow || authorAllow) {
      if (testMode) {
        item.classList.add('target');
      } else {
        articleid.push(checkbox.getAttribute('data-id'));
      }
    }
  });

  if (articleid.length > 0 && !testMode) {
    form.querySelector('input[name="articleIds"]').value = articleid.join(',');
    form.submit();
    return true;
  }

  return false;
}

var BlockImageNewWindow = {
  load: load$3
};
const BLOCK_IMAGE_NEW_WINDOW = {
  key: 'blockImageNewWindow',
  defaultValue: false
};

function load$3() {
  try {
    addSetting$3();

    if (Parser.hasArticle()) {
      apply$1();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$3() {
  const setting = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '컨텐츠 원본보기 방지',
    option: setting,
    description: '게시물 조회 시 이미지 등을 클릭하면 원본 이미지가 열리는 기능을 막습니다.',
    callback: {
      save() {
        Configure.set(BLOCK_IMAGE_NEW_WINDOW, setting.value == 'true');
      },

      load() {
        setting.value = Configure.get(BLOCK_IMAGE_NEW_WINDOW);
      }

    }
  });
}

function apply$1() {
  if (!Configure.get(BLOCK_IMAGE_NEW_WINDOW)) return;
  const targetElements = document.querySelectorAll('.article-body img, .article-body video:not([controls])');

  for (const element of targetElements) {
    const a = VM.createElement("a", null);
    element.insertAdjacentElement('beforebegin', a);
    a.append(element);
  }
}

var css_248z$3 = ".body .board-article .article-list .list-table.show-filtered-category .vrow.filtered-category {\r\n    display: flex;\r\n}\r\n\r\n.body .board-article .show-filtered-category .filter-count-category {\r\n    color: #bbb;\r\n}";

var CommentRefresh = {
  load: load$4,
  addRefreshCallback: addRefreshCallback$1
};
const refreshCallbackList$1 = [];

function load$4() {
  try {
    if (Parser.hasArticle()) {
      apply$2();
    }
  } catch (error) {
    console.error(error);
  }
}

function apply$2() {
  const commentArea = Parser.queryView('comment');

  if (commentArea && commentArea.querySelector('.alert')) {
    // 댓글 작성 권한 없음
    return;
  }

  const btn = VM.createElement("button", {
    class: "btn btn-arca",
    style: "margin-left: 1rem"
  }, VM.createElement("span", {
    class: "icon ion-android-refresh"
  }), VM.createElement("span", null, " \uC0C8\uB85C\uACE0\uCE68"));
  const clonebtn = btn.cloneNode(true);
  commentArea.querySelector('.title a').insertAdjacentElement('beforebegin', btn);
  commentArea.querySelector('.subtitle').append(clonebtn);

  async function onClick(event) {
    event.preventDefault();
    btn.disabled = true;
    clonebtn.disabled = true;
    const response = await getRefreshData();
    const newComments = response.querySelector('#comment .list-area');

    try {
      commentArea.querySelector('.list-area').remove();
    } // eslint-disable-next-line no-empty
    catch (_unused) {}

    if (newComments) {
      newComments.querySelectorAll('time').forEach(time => {
        time.textContent = getDateStr(time.dateTime);
      });
      commentArea.querySelector('.title').insertAdjacentElement('afterend', newComments);

      for (const {
        callback
      } of refreshCallbackList$1) {
        callback();
      }
    }

    btn.disabled = false;
    clonebtn.disabled = false;
  }

  btn.addEventListener('click', onClick);
  clonebtn.addEventListener('click', onClick);
}

function addRefreshCallback$1(callback) {
  refreshCallbackList$1.push(callback);
  refreshCallbackList$1.sort((a, b) => a.priority - b.priority);
}

function getRefreshData() {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      resolve(req.response);
    });
    req.send();
  });
}

var MuteContent = {
  load: load$5
};
const BLOCK_USER = {
  key: 'blockUser',
  defaultValue: []
};
const BLOCK_KEYWORD = {
  key: 'blockKeyword',
  defaultValue: []
};
const MUTE_CATEGORY = {
  key: 'muteCategory',
  defaultValue: {}
};
const MUTE_NOTICE = {
  key: 'hideNotice',
  defaultValue: false
};

function load$5() {
  try {
    addSetting$4();

    if (Parser.hasArticle()) {
      addArticleMenu$1();
    }

    if (Parser.hasComment()) {
      muteContent('comment');
    }

    if (Parser.hasBoard()) {
      muteNotice();
      mutePreview();
      muteContent('board');
    }

    AutoRefresher.addRefreshCallback({
      priority: 100,

      callback() {
        muteNotice();
        mutePreview();
        muteContent('board');
      }

    });
    CommentRefresh.addRefreshCallback({
      priority: 100,

      callback() {
        muteContent('comment');
      }

    });
  } catch (error) {
    console.error(error);
  }
}

function addSetting$4() {
  document.head.append(VM.createElement("style", null, css_248z$3));
  const hideNotice = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.MUTE,
    header: '공지사항 접기',
    option: hideNotice,
    description: '',
    callback: {
      save() {
        Configure.set(MUTE_NOTICE, hideNotice.value == 'true');
      },

      load() {
        hideNotice.value = Configure.get(MUTE_NOTICE);
      }

    }
  });
  const userMute = VM.createElement("textarea", {
    rows: "6",
    placeholder: "\uBBA4\uD2B8\uD560 \uC774\uC6A9\uC790\uC758 \uB2C9\uB124\uC784\uC744 \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  });
  Configure.addSetting({
    category: Configure.categoryKey.MUTE,
    header: '사용자 뮤트',
    option: userMute,
    description: VM.createElement(VM.Fragment, null, "\uC9C0\uC815\uD55C \uC720\uC800\uC758 \uAC8C\uC2DC\uBB3C\uACFC \uB313\uAE00\uC744 \uC228\uAE41\uB2C8\uB2E4.", VM.createElement("br", null), "Regex \uBB38\uBC95\uC744 \uC9C0\uC6D0\uD558\uAE30 \uB54C\uBB38\uC5D0 \uD2B9\uC218\uBB38\uC790 \uC0AC\uC6A9 \uC2DC \uC5ED\uC2AC\uB798\uC2DC\uB97C \uBD99\uC5EC\uC57C\uD569\uB2C8\uB2E4.", VM.createElement("br", null), "\uC0AC\uC6A9 \uC2DC \uC5ED\uC2AC\uB798\uC2DC\uB97C \uBD99\uC5EC \uC791\uC131\uD574\uC57C\uD558\uB294 \uD2B9\uC218\uBB38\uC790 \uBAA9\uB85D", VM.createElement("br", null), VM.createElement("ul", null, VM.createElement("li", null, "\uC18C\uAD04\uD638()"), VM.createElement("li", null, "\uB9C8\uCE68\uD45C."))),
    callback: {
      save() {
        Configure.set(BLOCK_USER, userMute.value.split('\n').filter(i => i != ''));
      },

      load() {
        userMute.value = Configure.get(BLOCK_USER).join('\n');
      }

    }
  });
  const keywordMute = VM.createElement("textarea", {
    rows: "6",
    placeholder: "\uBBA4\uD2B8\uD560 \uD0A4\uC6CC\uB4DC\uB97C \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  });
  Configure.addSetting({
    category: Configure.categoryKey.MUTE,
    header: '키워드 뮤트',
    option: keywordMute,
    description: VM.createElement(VM.Fragment, null, "\uC9C0\uC815\uD55C \uD0A4\uC6CC\uB4DC\uAC00 \uD3EC\uD568\uB41C \uC81C\uBAA9\uC744 \uAC00\uC9C4 \uAC8C\uC2DC\uBB3C\uACFC \uB313\uAE00\uC744 \uC228\uAE41\uB2C8\uB2E4.", VM.createElement("br", null), "Regex \uBB38\uBC95\uC744 \uC9C0\uC6D0\uD558\uAE30 \uB54C\uBB38\uC5D0 \uD2B9\uC218\uBB38\uC790 \uC0AC\uC6A9 \uC2DC \uC5ED\uC2AC\uB798\uC2DC\uB97C \uBD99\uC5EC\uC57C\uD569\uB2C8\uB2E4.", VM.createElement("br", null), "\uC0AC\uC6A9 \uC2DC \uC5ED\uC2AC\uB798\uC2DC\uB97C \uBD99\uC5EC \uC791\uC131\uD574\uC57C\uD558\uB294 \uD2B9\uC218\uBB38\uC790 \uBAA9\uB85D", VM.createElement("br", null), VM.createElement("ul", null, VM.createElement("li", null, "\uC18C\uAD04\uD638()"), VM.createElement("li", null, "\uC911\uAD04\uD638", '{}'), VM.createElement("li", null, "\uB300\uAD04\uD638[]"), VM.createElement("li", null, "\uB9C8\uCE68\uD45C."), VM.createElement("li", null, "\uD50C\uB7EC\uC2A4+"), VM.createElement("li", null, "\uBB3C\uC74C\uD45C?"), VM.createElement("li", null, "\uB2EC\uB7EC\uAE30\uD638$"), VM.createElement("li", null, "\uCE90\uB7FF^"), VM.createElement("li", null, "\uBCC4*"), VM.createElement("li", null, "\uC2AC\uB798\uC2DC/"), VM.createElement("li", null, "\uC5ED\uC2AC\uB798\uC2DC\\"), VM.createElement("li", null, "\uD558\uC774\uD508-"), VM.createElement("li", null, "\uD30C\uC774\uD504|"))),
    callback: {
      save() {
        Configure.set(BLOCK_KEYWORD, keywordMute.value.split('\n').filter(i => i != ''));
      },

      load() {
        keywordMute.value = Configure.get(BLOCK_KEYWORD).join('\n');
      }

    }
  });
  const boardCategoryElements = document.querySelectorAll('.board-category a');
  if (!boardCategoryElements.length) return;
  const tbody = VM.createElement("tbody", null);
  const categoryMute = VM.createElement("table", {
    class: "table align-middle"
  }, VM.createElement("colgroup", null, VM.createElement("col", {
    width: "40%"
  }), VM.createElement("col", {
    width: "30%"
  }), VM.createElement("col", {
    width: "30%"
  })), VM.createElement("thead", null, VM.createElement("th", null, "\uC774\uB984"), VM.createElement("th", null, "\uBBF8\uB9AC\uBCF4\uAE30 \uBBA4\uD2B8"), VM.createElement("th", null, "\uAC8C\uC2DC\uBB3C \uBBA4\uD2B8")), tbody);

  for (const element of boardCategoryElements) {
    const name = element.textContent == '전체' ? '일반' : element.textContent;
    tbody.append(VM.createElement("tr", {
      "data-id": name
    }, VM.createElement("td", null, name), VM.createElement("td", null, VM.createElement("label", null, VM.createElement("input", {
      type: "checkbox",
      name: "mutePreview",
      style: "margin: .25em"
    }), " \uC801\uC6A9")), VM.createElement("td", null, VM.createElement("label", null, VM.createElement("input", {
      type: "checkbox",
      name: "muteArticle",
      style: "margin: .25em"
    }), " \uC801\uC6A9"))));
  }

  const channel = Parser.getChannelInfo().id;
  Configure.addSetting({
    category: Configure.categoryKey.MUTE,
    header: '카테고리 뮤트',
    option: categoryMute,
    description: VM.createElement(VM.Fragment, null, "\uBBF8\uB9AC\uBCF4\uAE30 \uBBA4\uD2B8: \uD574\uB2F9 \uCE74\uD14C\uACE0\uB9AC \uAC8C\uC2DC\uBB3C\uC758 \uBBF8\uB9AC\uBCF4\uAE30\uB97C \uC81C\uAC70\uD569\uB2C8\uB2E4.", VM.createElement("br", null), "\uAC8C\uC2DC\uBB3C \uBBA4\uD2B8: \uD574\uB2F9 \uCE74\uD14C\uACE0\uB9AC\uC758 \uAC8C\uC2DC\uBB3C\uC744 \uC228\uAE41\uB2C8\uB2E4."),
    callback: {
      save() {
        const data = Configure.get(MUTE_CATEGORY);
        if (!data[channel]) data[channel] = {};
        const rows = tbody.querySelectorAll('tr');

        for (const row of rows) {
          const {
            id
          } = row.dataset;
          const preview = row.querySelector('input[name="mutePreview"]').checked;
          const article = row.querySelector('input[name="muteArticle"]').checked;

          if (preview || article) {
            data[channel] = _extends({}, data[channel], {
              [id]: {
                mutePreview: preview,
                muteArticle: article
              }
            });
          } else {
            delete data[channel][id];
          }
        }

        Configure.set(MUTE_CATEGORY, data);
      },

      load() {
        const muteCategory = Configure.get(MUTE_CATEGORY)[channel];
        if (!muteCategory) return;

        for (const element of tbody.children) {
          const {
            id
          } = element.dataset;

          if (muteCategory[id]) {
            element.querySelector('input[name="mutePreview"]').checked = muteCategory[id].mutePreview;
            element.querySelector('input[name="muteArticle"]').checked = muteCategory[id].muteArticle;
          }
        }
      }

    }
  });
}

function addArticleMenu$1() {
  const userList = Configure.get(BLOCK_USER);
  const articleInfo = Parser.getArticleInfo();
  const user = articleInfo.author;
  const userID = articleInfo.authorID.replace('(', '\\(').replace(')', '\\)').replace('.', '\\.');
  const filter = `${user == userID ? '^' : ''}${userID}$`;
  const indexed = userList.indexOf(filter);

  if (indexed > -1) {
    ArticleMenu.addHeaderBtn({
      text: '뮤트 해제',
      icon: 'ion-ios-refresh-empty',
      description: '게시물 작성자의 뮤트를 해제합니다.',

      onClick(event) {
        event.preventDefault();
        userList.splice(indexed, 1);
        Configure.set(BLOCK_USER, userList);
        location.reload();
      }

    });
  } else {
    ArticleMenu.addHeaderBtn({
      text: '뮤트',
      icon: 'ion-ios-close',
      description: '게시물 작성자를 뮤트합니다.',

      onClick(event) {
        event.preventDefault();
        userList.push(filter);
        Configure.set(BLOCK_USER, userList);
        history.back();
      }

    });
  }
}

function mutePreview() {
  const channel = Parser.getChannelInfo().id;
  const config = Configure.get(MUTE_CATEGORY)[channel];
  if (!config) return;
  const articles = Parser.queryItems('articles', 'board');
  articles.forEach(article => {
    const badge = article.querySelector('.badge');
    if (badge == null) return;
    let category = badge.textContent;
    category = category == '' ? '일반' : category;
    if (!config[category]) return;
    const {
      mutePreview: filtered
    } = config[category];
    if (!filtered) return;
    const preview = article.querySelector('.vrow-preview');
    if (preview) preview.remove();
  });
}

function muteNotice() {
  if (!Configure.get(MUTE_NOTICE)) return;

  if (document.readyState != 'complete') {
    window.addEventListener('load', () => {
      muteNotice();
    }, {
      once: true
    });
    return;
  }

  const itemContainer = Parser.queryView('board');
  const notices = itemContainer.querySelectorAll('a.vrow.notice-board');
  let noticeCount = 0;

  for (const notice of notices) {
    if (notice != notices[notices.length - 1]) {
      notice.classList.add('filtered');
      notice.classList.add('filtered-notice');
      noticeCount += 1;
    } else {
      let unfilterBtn = itemContainer.querySelector('.notice-unfilter');

      if (!unfilterBtn) {
        // 사용자가 공식 공지 숨기기 기능을 사용하지 않음
        unfilterBtn = VM.createElement("a", {
          class: "vrow notice notice-unfilter"
        }, VM.createElement("div", {
          class: "vrow-top"
        }, "\uC228\uACA8\uC9C4 \uACF5\uC9C0 \uD3BC\uCE58\uAE30(", VM.createElement("span", {
          class: "notice-filter-count"
        }, noticeCount), "\uAC1C) ", VM.createElement("span", {
          class: "ion-android-archive"
        })));
        unfilterBtn.addEventListener('click', () => {
          itemContainer.classList.add('show-filtered-notice');
          unfilterBtn.style.display = 'none';
        });
        notice.insertAdjacentElement('afterend', unfilterBtn);
      }
    }
  }
}

const ContentTypeString = {
  keyword: '키워드',
  user: '사용자',
  category: '카테고리',
  deleted: '삭제됨',
  all: '전체'
};

function muteContent(viewQuery) {
  if (document.readyState != 'complete') {
    window.addEventListener('load', () => {
      muteContent(viewQuery);
    }, {
      once: true
    });
    return;
  }

  const itemContainer = Parser.queryView(viewQuery);
  const count = {};

  for (const key of Object.keys(ContentTypeString)) {
    count[key] = 0;
  }

  const channel = Parser.getChannelInfo().id;
  let userlist = Configure.get(BLOCK_USER, []);
  let keywordlist = Configure.get(BLOCK_KEYWORD, []);
  const categoryConfig = Configure.get(MUTE_CATEGORY, {})[channel];

  if ((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute != undefined) {
    userlist.push(...unsafeWindow.LiveConfig.mute.users);
    keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
    userlist = Array.from(new Set(userlist));
    keywordlist = Array.from(new Set(keywordlist));
  }

  let contents = null;
  let keywordSelector = '';
  let targetElement = null;
  let insertPosition = '';

  if (viewQuery == 'board') {
    contents = Parser.queryItems('articles', 'board');
    keywordSelector = '.col-title';
    targetElement = itemContainer;
    insertPosition = 'afterbegin';
  } else if (viewQuery == 'comment') {
    contents = Parser.queryItems('comments', 'comment');
    keywordSelector = '.message';
    targetElement = itemContainer.querySelector('.list-area');
    insertPosition = 'beforebegin';
  }

  contents.forEach(item => {
    const keywordElement = item.querySelector(keywordSelector);
    const userElement = item.querySelector('.user-info');
    if (!keywordElement || !userElement) return;
    const keywordText = keywordElement.innerText;
    const userText = Parser.parseUserInfo(userElement);
    const categoryElement = item.querySelector('.badge');
    let category;

    if (categoryElement == null || categoryElement.textContent == '') {
      category = '일반';
    } else {
      category = categoryElement.textContent;
    }

    const keywordAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(keywordText);
    const userAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(userText);
    let categoryAllow = false;

    if (channel && categoryConfig && categoryConfig[category]) {
      categoryAllow = categoryConfig[category].muteArticle;
    }

    if (keywordAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-keyword');
      count.keyword += 1;
      count.all += 1;
    }

    if (userAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-user');
      count.user += 1;
      count.all += 1;
    }

    if (categoryAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-category');
      count.category += 1;
      count.all += 1;
    }

    if (item.classList.contains('deleted')) {
      item.classList.add('filtered');
      item.classList.add('filtered-deleted');
      count.deleted += 1;
      count.all += 1;
    }
  });
  let toggleHeader = itemContainer.querySelector('.frontend-header');
  if (toggleHeader) toggleHeader.remove();
  toggleHeader = VM.createElement("div", {
    class: "frontend-header"
  }, VM.createElement("span", {
    class: "filter-title"
  }, "\uD544\uD130\uB41C \uAC8C\uC2DC\uBB3C"), VM.createElement("span", {
    class: "filter-count-container"
  }));
  const container = toggleHeader.querySelector('.filter-count-container');

  if (count.all > 0) {
    targetElement.insertAdjacentElement(insertPosition, toggleHeader);

    for (const key of Object.keys(count)) {
      if (count[key] > 0) {
        let className = `show-filtered-${key}`;
        if (key == 'all') className = 'show-filtered';
        const btn = VM.createElement("span", {
          class: `filter-count filter-count-${key}`
        }, ContentTypeString[key], " (", count[key], ")");
        container.append(btn);
        btn.addEventListener('click', () => {
          if (targetElement.classList.contains(className)) {
            targetElement.classList.remove(className);
            toggleHeader.classList.remove(className);
          } else {
            targetElement.classList.add(className);
            toggleHeader.classList.add(className);
          }
        });
      }
    }
  }
}

function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}
function getRandomColor() {
  return `00000${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`.slice(-6);
}

var CategoryColor = {
  load: load$6
};
const CATEGORY_COLOR = {
  key: 'categoryColor',
  defaultValue: {}
};

function load$6() {
  try {
    addSetting$5();

    if (Parser.hasBoard()) {
      generateColorStyle();
      apply$3();
    }

    AutoRefresher.addRefreshCallback({
      priority: 0,
      callback: apply$3
    });
  } catch (error) {
    console.error(error);
  }
}

function addSetting$5() {
  // 카테고리 목록 등록
  const boardCategoryElements = document.querySelectorAll('.board-category a');
  if (!boardCategoryElements.length) return;
  const tbody = VM.createElement("tbody", null);
  const table = VM.createElement("table", {
    class: "table align-middle"
  }, VM.createElement("colgroup", null, VM.createElement("col", {
    width: "40%"
  }), VM.createElement("col", {
    width: "20%"
  }), VM.createElement("col", {
    width: "20%"
  }), VM.createElement("col", {
    width: "20%"
  })), VM.createElement("thead", null, VM.createElement("th", null, "\uC774\uB984"), VM.createElement("th", null, "\uBC43\uC9C0\uC0C9"), VM.createElement("th", null, "\uBC30\uACBD\uC0C9"), VM.createElement("th", null, "\uAD75\uAC8C")), tbody);

  for (const element of boardCategoryElements) {
    const name = element.textContent == '전체' ? '일반' : element.textContent;
    tbody.append(VM.createElement("tr", {
      "data-id": name
    }, VM.createElement("td", null, VM.createElement("span", {
      class: "badge badge-success",
      style: "margin: .25em"
    }, `${name}`), VM.createElement("span", {
      class: "title"
    }, "\uC81C\uBAA9")), VM.createElement("td", null, VM.createElement("input", {
      type: "text",
      name: "badge",
      placeholder: "000000",
      maxlength: "6",
      disabled: name == '일반'
    })), VM.createElement("td", null, VM.createElement("input", {
      type: "text",
      name: "bg",
      placeholder: "000000",
      maxlength: "6"
    })), VM.createElement("td", null, VM.createElement("label", null, VM.createElement("input", {
      type: "checkbox",
      name: "bold",
      style: "margin: .25em"
    }), " \uC801\uC6A9"))));
  } // 이벤트 핸들러


  tbody.addEventListener('keypress', event => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  tbody.addEventListener('dblclick', event => {
    if (event.target.tagName != 'INPUT') return;
    if (event.target.disabled) return;
    const color = getRandomColor();
    const yiq = getContrastYIQ(color);

    if (event.target.name == 'badge') {
      event.target.value = color;
      event.target.closest('tr').querySelector('.badge').style.backgroundColor = `#${color}`;
      event.target.closest('tr').querySelector('.badge').style.color = yiq;
    }

    if (event.target.name == 'bg') {
      event.target.value = color;
      event.target.closest('tr').querySelector('td').style.backgroundColor = `#${color}`;
      event.target.closest('tr').querySelector('.title').style.color = yiq;
    }
  });
  tbody.addEventListener('input', event => {
    let color = '';
    let yiq = '';

    if (event.target.value.length == 6) {
      color = `#${event.target.value}`;
      yiq = getContrastYIQ(event.target.value);
    }

    if (event.target.name == 'badge') {
      event.target.closest('tr').querySelector('.badge').style.backgroundColor = color;
      event.target.closest('tr').querySelector('.badge').style.color = yiq;
    }

    if (event.target.name == 'bg') {
      event.target.closest('tr').querySelector('td').style.backgroundColor = color;
      event.target.closest('tr').querySelector('.title').style.color = yiq;
    }

    if (event.target.name == 'bold') {
      event.target.closest('tr').querySelector('.title').style.fontWeight = event.target.checked ? 'bold' : '';
    }
  });
  const channel = Parser.getChannelInfo().id;
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '카테고리 색상 설정',
    option: table,
    description: '더블 클릭으로 무작위 색상을 선택할 수 있습니다.',
    callback: {
      save() {
        const colorConfig = Configure.get(CATEGORY_COLOR);
        if (!colorConfig[channel]) colorConfig[channel] = {};
        const rows = tbody.querySelectorAll('tr');

        for (const row of rows) {
          const {
            id
          } = row.dataset;
          const badge = row.querySelector('input[name="badge"]').value.toUpperCase();
          const bgcolor = row.querySelector('input[name="bg"]').value.toUpperCase();
          const bold = row.querySelector('input[name="bold"]').checked;

          if (badge || bgcolor || bold) {
            colorConfig[channel] = _extends({}, colorConfig[channel], {
              [id]: {
                badge,
                bgcolor,
                bold
              }
            });
          } else {
            if (colorConfig[channel][id]) {
              delete colorConfig[channel][id];
            }
          }
        }

        Configure.set(CATEGORY_COLOR, colorConfig);
      },

      load() {
        const channelConfig = Configure.get(CATEGORY_COLOR)[channel];
        if (!channelConfig) return;

        for (const element of tbody.children) {
          const {
            id
          } = element.dataset;

          if (channelConfig[id]) {
            const {
              badge,
              bgcolor,
              bold
            } = channelConfig[id];
            const tdElement = element.querySelector('td');
            const badgeElement = element.querySelector('.badge');
            const titleElement = element.querySelector('.title');
            const badgeInput = element.querySelector('input[name="badge"]');
            const bgInput = element.querySelector('input[name="bg"]');
            const boldInput = element.querySelector('input[name="bold"]');
            badgeInput.value = badge;

            if (badge) {
              badgeElement.style.backgroundColor = `#${badge}`;
              badgeElement.style.color = getContrastYIQ(badge);
            }

            bgInput.value = bgcolor;

            if (bgcolor) {
              tdElement.style.backgroundColor = `#${bgcolor}`;
              titleElement.style.color = getContrastYIQ(bgcolor);
            }

            boldInput.checked = bold;

            if (bold) {
              titleElement.style.fontWeight = 'bold';
            }
          }
        }
      }

    }
  });
}

const styleTable = {};

function generateColorStyle() {
  const channel = Parser.getChannelInfo().id;
  const categoryConfig = Configure.get(CATEGORY_COLOR)[channel];
  if (!categoryConfig) return;
  const style = [];

  for (const key in categoryConfig) {
    if (categoryConfig[key]) {
      const {
        badge,
        bgcolor,
        bold
      } = categoryConfig[key];
      let styleKey;

      do {
        styleKey = Math.random().toString(36).substr(2);
      } while (styleTable[styleKey]);

      style.push(`
                .color_${styleKey} {
                    background-color: #${bgcolor} !important;
                    color: ${getContrastYIQ(bgcolor)};
                    font-weight: ${bold ? 'bold' : 'normal'}
                }
    
                .color_${styleKey} .badge {
                    background-color: #${badge} !important;
                    color: ${getContrastYIQ(badge)};
                }
            `);
      styleTable[key] = styleKey;
    }
  }

  document.head.append(VM.createElement("style", null, style.join('\n')));
}

function apply$3() {
  const articles = Parser.queryItems('articles', 'board');
  articles.forEach(article => {
    if (article.childElementCount < 2) return;
    const categoryElement = article.querySelector('.badge');
    if (!categoryElement) return;
    const category = categoryElement.textContent ? categoryElement.textContent : '일반';
    if (!styleTable[category]) return;
    article.classList.add(`color_${styleTable[category]}`);
  });
}

var ClipboardUpload = {
  load: load$7
};

async function load$7() {
  try {
    if (Parser.hasWriteView()) {
      await waitForElement('.fr-box');
      apply$4();
    }
  } catch (error) {
    console.error(error);
  }
}

function apply$4() {
  const editor = unsafeWindow.FroalaEditor('#content');
  editor.events.on('paste.before', event => {
    const files = event.clipboardData.files;
    if (files.length == 0) return true;
    editor.image.upload(files);
    return false;
  }, true);
}

var MuteEmoticon = {
  load: load$8
};
const BLOCK_EMOTICON = {
  key: 'blockEmoticon',
  defaultValue: {}
};

function load$8() {
  try {
    addSetting$6();

    if (Parser.hasComment()) {
      mute();
      apply$5();
    }

    CommentRefresh.addRefreshCallback({
      priority: 100,

      callback() {
        mute();
        apply$5();
      }

    });
  } catch (error) {
    console.error(error);
  }
}

function addSetting$6() {
  const muteEmoticon = VM.createElement("select", {
    size: "6",
    multiple: ""
  });
  const deleteBtn = VM.createElement("button", {
    class: "btn btn-arca"
  }, "\uC0AD\uC81C");
  deleteBtn.addEventListener('click', event => {
    event.target.disabled = true;
    const removeElements = muteEmoticon.selectedOptions;

    while (removeElements.length > 0) removeElements[0].remove();

    event.target.disabled = false;
  });
  Configure.addSetting({
    category: Configure.categoryKey.MUTE,
    header: '뮤트된 아카콘',
    option: VM.createElement(VM.Fragment, null, muteEmoticon, deleteBtn),
    description: VM.createElement(VM.Fragment, null, "\uC544\uCE74\uCF58 \uBBA4\uD2B8\uB294 \uB313\uAE00\uC5D0\uC11C \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", VM.createElement("br", null), "Ctrl, Shift, \uB9C8\uC6B0\uC2A4 \uB4DC\uB798\uADF8\uB97C \uC774\uC6A9\uD574\uC11C \uC5EC\uB7EC\uAC1C\uB97C \uB3D9\uC2DC\uC5D0 \uC120\uD0DD \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
    callback: {
      save() {
        const data = Configure.get(BLOCK_EMOTICON);
        const keys = Array.from(muteEmoticon.children, e => e.value);

        for (const key in data) {
          if (keys.indexOf(key) == -1) delete data[key];
        }

        Configure.set(BLOCK_EMOTICON, data);
      },

      load() {
        const data = Configure.get(BLOCK_EMOTICON);

        for (const key of Object.keys(data)) {
          muteEmoticon.append(VM.createElement("option", {
            value: key
          }, data[key].name));
        }
      }

    }
  });
}

function mute() {
  const blockEmoticons = Configure.get(BLOCK_EMOTICON);
  let list = [];

  for (const key in blockEmoticons) {
    if ({}.hasOwnProperty.call(blockEmoticons, key)) {
      list = list.concat(blockEmoticons[key].bundle);
    }
  }

  const comments = Parser.queryItems('comments', 'comment');
  comments.forEach(item => {
    const emoticon = item.querySelector('.emoticon');

    if (emoticon) {
      const id = Number(emoticon.dataset.id);

      if (list.indexOf(id) > -1) {
        emoticon.closest('.message').innerText = '[아카콘 뮤트됨]';
      }
    }
  });
}

function apply$5() {
  const commentArea = Parser.queryView('comment');
  const emoticons = Parser.queryItems('emoticons', 'comment');
  emoticons.forEach(item => {
    const btn = VM.createElement("span", null, '\n | ', VM.createElement("a", {
      href: "#",
      class: "block-emoticon",
      "data-id": item.dataset.id
    }, VM.createElement("span", {
      class: "ion-ios-close"
    }), ' 아카콘 뮤트'));
    const timeElement = item.closest('.content').querySelector('.right > time');
    timeElement.insertAdjacentElement('afterend', btn);
  });
  commentArea.addEventListener('click', async event => {
    if (!event.target.classList.contains('block-emoticon')) return;
    event.preventDefault();
    event.target.textContent = '뮤트 처리 중...';
    event.target.classList.remove('block-emoticon');
    const id = event.target.dataset.id;
    const [name, bundleID] = await getEmoticonInfo(id);
    const bundle = await getEmoticonBundle(bundleID);
    const blockEmoticon = Configure.get(BLOCK_EMOTICON);
    blockEmoticon[bundleID] = {
      name,
      bundle
    };
    Configure.set(BLOCK_EMOTICON, blockEmoticon);
    location.reload();
  });
}

function getEmoticonInfo(id) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/emoticon/shop/${id}`);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const name = req.response.querySelector('.article-head .title').innerText;
      const bundleID = req.response.URL.split('/e/')[1];
      resolve([name, bundleID]);
    });
    req.send();
  });
}

function getEmoticonBundle(bundleID) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/emoticon/${bundleID}`);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      const bundle = req.response.map(item => item.id);
      resolve(bundle);
    });
    req.send();
  });
}

var FullAreaReply = {
  load: load$9
};

function load$9() {
  try {
    if (Parser.hasArticle()) {
      apply$6();
    }
  } catch (error) {
    console.error(error);
  }
}

function apply$6() {
  const commentArea = Parser.queryView('comment');
  commentArea.addEventListener('click', event => {
    if (event.target.closest('form')) return;
    const element = event.target.closest('a, .emoticon, .btn-more, .message');
    if (element == null) return;
    if (!element.classList.contains('message')) return;
    event.preventDefault();
    element.parentNode.querySelector('.reply-link').click();
  });
}

var styles = {"green":"IPScouter-module_green__K9yWK","red":"IPScouter-module_red__3yMjL","blue":"IPScouter-module_blue__YSAPo"};
var stylesheet=".vcol.col-author {\r\n    width: 7.5rem !important;\r\n}\r\n\r\n.IPScouter-module_green__K9yWK {\r\n    color: rgb(37, 141, 37)\r\n}\r\n\r\n.IPScouter-module_red__3yMjL {\r\n    color: rgb(236, 69, 69)\r\n}\r\n\r\n.IPScouter-module_blue__YSAPo {\r\n    color: rgb(56, 174, 252)\r\n}";

var IPScouter = {
  load: load$a
};
const DB = {
  KT: ['1.96', '1.97', '1.98', '1.99', '1.100', '1.101', '1.102', '1.103', '1.104', '1.105', '1.106', '1.107', '1.108', '1.109', '1.110', '1.111', '39.4', '39.5', '39.6', '39.7', '49.16', '49.17', '49.18', '49.19', '49.20', '49.21', '49.22', '49.23', '49.24', '49.25', '49.26', '49.27', '49.28', '49.29', '49.30', '49.31', '49.56', '49.57', '49.58', '49.59', '49.60', '49.61', '49.62', '49.63', '110.68', '110.69', '110.70', '110.71', '116.200', '116.201', '118.234', '118.235', '119.194', '163.213', '163.222', '163.229', '163.255', '175.216', '175.217', '175.218', '175.219', '175.220', '175.221', '175.222', '175.223'],
  SK: ['27.160', '27.161', '27.162', '27.163', '27.164', '27.165', '27.166', '27.167', '27.168', '27.169', '27.170', '27.171', '27.172', '27.173', '27.174', '27.175', '27.176', '27.177', '27.178', '27.179', '27.180', '27.181', '27.182', '27.183', '42.16', '42.17', '42.18', '42.19', '42.20', '42.21', '42.22', '42.23', '42.24', '42.25', '42.26', '42.27', '42.28', '42.29', '42.30', '42.31', '42.32', '42.33', '42.34', '42.35', '42.36', '42.37', '42.38', '42.39', '42.40', '42.41', '42.42', '42.43', '42.44', '42.45', '42.46', '42.47', '58.102', '58.103', '111.218', '111.219', '113.216', '113.217', '114.52', '114.53', '123.228', '123.229', '124.0', '124.1', '124.2', '124.3', '124.136', '124.137', '124.138', '124.139', '180.132', '180.133', '180.134', '180.135', '219.252', '219.253', '220.103', '223.32', '223.33', '223.34', '223.35', '223.36', '223.37', '223.38', '223.39', '223.40', '223.41', '223.42', '223.43', '223.44', '223.45', '223.46', '223.47', '223.48', '223.49', '223.50', '223.51', '223.52', '223.53', '223.54', '223.55', '223.56', '223.57', '223.58', '223.59', '223.60', '223.61', '223.62', '223.63'],
  LG: ['106.96', '109.97', '109.98', '109.99', '106.100', '106.101', '106.102', '106.103', '117.110', '117.111', '211.36', '223.168', '223.169', '223.170', '223.171', '223.172', '223.173', '223.174', '223.175'],
  zenmate: ['5.79', '5.254', '31.3', '37.58', '37.221', '46.28', '46.183', '50.7', '62.210', '66.249', '89.238', '89.238', '91.221', '94.242', '95.141', '103.10', '103.254', '107.167', '109.200', '176.123', '178.162', '178.255', '179.43', '185.9', '185.82', '185.104', '192.71', '192.99', '193.182', '207.244', '209.58'],
  tor: ['1.161', '103.28', '103.16', '103.125', '103.194', '103.208', '103.214', '103.234', '103.236', '103.75', '104.40', '104.194', '104.196', '104.200', '104.218', '104.244', '107.155', '109.69', '109.70', '109.169', '109.194', '109.201', '109.248', '114.32', '111.90', '114.158', '115.73', '118.163', '119.237', '122.147', '123.30', '124.109', '125.212', '126.75', '128.14', '128.199', '128.31', '130.149', '137.74', '138.197', '139.162', '139.28', '139.99', '142.44', '142.58', '142.93', '143.202', '144.217', '145.239', '149.202', '151.53', '151.73', '151.77', '153.229', '154.127', '156.54', '157.157', '157.161', '157.230', '158.174', '158.69', '159.89', '160.119', '160.202', '162.213', '162.244', '162.247', '163.172', '164.132', '164.77', '166.70', '167.114', '167.86', '167.99', '169.197', '171.22', '171.244', '171.25', '172.96', '172.98', '173.14', '173.199', '173.212', '173.244', '173.255', '176.10', '176.126', '176.152', '176.214', '176.31', '176.53', '177.205', '178.128', '178.165', '178.17', '178.175', '178.20', '178.239', '178.254', '178.32', '178.9', '179.43', '179.48', '18.18', '18.85', '180.149', '180.150', '184.75', '185.10', '185.100', '185.103', '185.104', '185.107', '185.112', '185.113', '185.117', '185.121', '185.125', '185.127', '185.129', '185.14', '185.147', '185.158', '185.162', '185.165', '185.169', '185.175', '185.177', '185.193', '185.195', '185.203', '185.220', '185.222', '185.227', '185.233', '185.234', '185.242', '185.244', '185.248', '185.255', '185.4', '185.56', '185.61', '185.65', '185.66', '185.72', '185.86', '185.9', '186.214', '187.178', '188.166', '188.214', '188.65', '189.84', '190.10', '190.164', '190.210', '190.216', '191.114', '191.243', '191.32', '192.160', '192.195', '192.227', '192.34', '192.42', '192.68', '193.110', '193.150', '193.169', '193.201', '193.36', '193.56', '193.9', '193.90', '194.71', '194.99', '195.123', '195.176', '195.206', '195.228', '195.254', '196.41', '197.231', '198.167', '198.211', '198.46', '198.50', '198.96', '198.98', '199.127', '199.195', '199.249', '199.87', '200.52', '200.86', '200.98', '201.80', '203.78', '204.11', '204.17', '204.194', '204.8', '204.85', '205.168', '205.185', '206.248', '206.55', '207.244', '208.12', '209.126', '209.141', '209.95', '210.140', '210.160', '212.16', '212.21', '212.47', '212.75', '212.81', '213.108', '213.136', '213.160', '213.202', '213.252', '213.61', '213.95', '216.218', '216.239', '217.115', '217.12', '217.170', '220.135', '223.26', '23.129', '23.239', '24.20', '24.3', '27.122', '31.131', '31.185', '31.220', '31.31', '35.0', '37.128', '37.139', '37.187', '37.220', '37.228', '37.28', '37.48', '40.124', '41.215', '41.77', '45.114', '45.125', '45.32', '45.33', '45.35', '45.56', '45.76', '45.79', '46.101', '46.165', '46.166', '46.173', '46.182', '46.194', '46.23', '46.246', '46.29', '46.38', '46.98', '5.135', '5.150', '5.189', '5.196', '5.199', '5.2', '5.252', '5.3', '5.34', '5.39', '5.79', '50.247', '51.15', '51.254', '51.255', '51.38', '51.68', '51.75', '51.77', '52.167', '54.36', '54.37', '54.39', '58.153', '58.96', '59.127', '62.102', '62.210', '62.212', '62.219', '62.98', '64.113', '64.27', '65.181', '65.19', '66.110', '66.146', '66.155', '66.175', '66.42', '66.70', '67.163', '67.215', '69.162', '69.164', '70.168', '71.19', '72.14', '72.210', '72.221', '72.83', '73.15', '74.82', '77.141', '77.247', '77.55', '77.73', '77.81', '78.109', '78.142', '78.46', '79.117', '79.134', '79.141', '79.172', '80.127', '80.241', '80.67', '80.68', '80.79', '81.17', '82.118', '82.151', '82.221', '82.223', '82.228', '82.94', '84.19', '84.200', '84.209', '85.214', '85.235', '85.248', '86.123', '86.124', '86.127', '86.148', '87.101', '87.118', '87.120', '87.123', '87.247', '88.130', '88.76', '89.234', '89.236', '89.247', '89.31', '91.132', '91.146', '91.203', '91.207', '91.213', '91.219', '91.231', '92.116', '92.222', '92.63', '93.174', '93.55', '94.100', '94.102', '94.140', '94.168', '94.230', '94.242', '94.32', '95.128', '95.130', '95.142', '95.143', '95.168', '95.179', '95.211', '95.216', '96.66', '96.70', '97.74', '98.174'],
  hola: ['103.18', '104.131', '106.185', '106.186', '106.187', '107.161', '107.170', '107.181', '107.190', '107.191', '107.22', '108.61', '109.74', '14.136', '149.154', '149.62', '151.236', '158.255', '162.217', '162.218', '162.221', '162.243', '167.88', '168.235', '176.58', '176.9', '177.67', '178.209', '178.79', '192.110', '192.121', '192.184', '192.211', '192.241', '192.30', '192.40', '192.73', '192.81', '192.99', '198.147', '198.58', '199.241', '208.68', '209.222', '213.229', '217.78', '23.227', '23.249', '23.29', '31.193', '37.235', '41.223', '46.17', '46.19', '46.4', '5.9', '50.116', '54.225', '54.243', '66.85', '77.237', '81.4', '85.234', '88.150', '91.186', '92.48', '94.76', '95.215', '96.126']
};
const IPType = {
  KT: {
    str: 'KT',
    color: styles.blue
  },
  SK: {
    str: 'SK',
    color: styles.blue
  },
  LG: {
    str: 'LG',
    color: styles.blue
  },
  zenmate: {
    str: '젠메이트',
    color: styles.red
  },
  tor: {
    str: '토르',
    color: styles.red
  },
  hola: {
    str: '홀라',
    color: styles.red
  }
};

function load$a() {
  try {
    if (Parser.hasArticle()) {
      apply$7('article');
    }

    if (Parser.hasBoard()) {
      apply$7('board');
    }

    AutoRefresher.addRefreshCallback({
      priority: 0,

      callback() {
        apply$7('board');
      }

    });
    CommentRefresh.addRefreshCallback({
      priority: 0,

      callback() {
        apply$7('comment');
      }

    });
  } catch (error) {
    console.error(error);
  }
}

function apply$7(viewQuery) {
  const ipElements = Parser.queryItems('ips', viewQuery);
  ipElements.forEach(ipElement => {
    const ip = ipElement.textContent.replace(/\(|\)/g, '');
    const [result, color] = checkIP(ip);
    ipElement.parentNode.append(VM.createElement("span", {
      class: color
    }, ` - ${result}`));
  });
}

function checkIP(ip) {
  let result = '고정';
  let color = styles.green;

  for (const key of Object.keys(DB)) {
    if (DB[key].indexOf(ip) > -1) {
      result = IPType[key].str;
      color = IPType[key].color;
      break;
    }
  }

  return [result, color];
}

function getBlob(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onprogress: event => {
        if (onProgress) onProgress(event);
      },
      onload: response => {
        if (onLoad) onLoad();
        resolve(response.response);
      },
      onerror: reject
    });
  });
}
function getArrayBuffer(url, onProgress, onLoad) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      onprogress: event => {
        if (onProgress) onProgress(event);
      },
      onload: response => {
        if (onLoad) onLoad();
        resolve(response.response);
      },
      onerror: reject
    });
  });
}

var css_248z$4 = ".article-image {\r\n    margin: 1rem 0;\r\n    border: 1px solid #bbb;\r\n    width: 100%;\r\n    padding: 0.5rem;\r\n}\r\n\r\n.article-image .image-list {\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fill, minmax(100px, auto));\r\n    gap: 0.5rem;\r\n    justify-items: center;\r\n    margin-bottom: 0.5rem;\r\n}\r\n\r\n.article-image .item {\r\n    width: 100px;\r\n    height: 100px;\r\n    border: 1px solid #bbb;\r\n    margin: 0;\r\n    background-size: cover;\r\n}\r\n\r\n.article-image button {\r\n    width: 100%;\r\n    margin-top: 0.5rem;\r\n}\r\n\r\n@media (prefers-color-scheme:dark) {\r\n    #imageList tbody a {\r\n        color: #e2e2e2;\r\n    }\r\n}";

var ImageDownloader = {
  load: load$b
};
const FILENAME = {
  key: 'imageDownloaderFileName',
  defaultValue: '%title%'
};
const IMAGENAME = {
  key: 'imageDonwloaderImageName',
  defaultValue: '%num%'
};

function load$b() {
  try {
    addSetting$7();

    if (Parser.hasArticle()) {
      addContextMenu();
      apply$8();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$7() {
  const downloadName = VM.createElement("input", {
    type: "text"
  });
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '이미지 일괄 다운로드 압축파일 이름',
    option: downloadName,
    description: VM.createElement(VM.Fragment, null, "\uC774\uBBF8\uC9C0 \uC77C\uAD04 \uB2E4\uC6B4\uB85C\uB4DC \uC0AC\uC6A9 \uC2DC \uC800\uC7A5\uD560 \uC555\uCD95 \uD30C\uC77C\uC758 \uC774\uB984 \uD3EC\uB9F7\uC785\uB2C8\uB2E4.", VM.createElement("br", null), "%title%: \uAC8C\uC2DC\uBB3C \uC81C\uBAA9", VM.createElement("br", null), "%category%: \uAC8C\uC2DC\uBB3C \uCE74\uD14C\uACE0\uB9AC", VM.createElement("br", null), "%author%: \uAC8C\uC2DC\uBB3C \uC791\uC131\uC790", VM.createElement("br", null), "%channel%: \uCC44\uB110 \uC774\uB984"),
    callback: {
      save() {
        Configure.set(FILENAME, downloadName.value);
      },

      load() {
        downloadName.value = Configure.get(FILENAME);
      }

    }
  });
  const imageName = VM.createElement("input", {
    type: "text"
  });
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '이미지 일괄 다운로드 이미지 이름',
    option: imageName,
    description: VM.createElement(VM.Fragment, null, "\uC774\uBBF8\uC9C0 \uC77C\uAD04 \uB2E4\uC6B4\uB85C\uB4DC \uC0AC\uC6A9 \uC2DC \uC800\uC7A5\uD560 \uC774\uBBF8\uC9C0\uC758 \uC774\uB984 \uD3EC\uB9F7\uC785\uB2C8\uB2E4.", VM.createElement("br", null), "orig \uD639\uC740 num\uC744 \uC0AC\uC6A9\uD558\uC5EC \uC774\uB984\uC744 \uAD6C\uBD84\uD574\uC57C \uC815\uC0C1 \uC800\uC7A5\uB429\uB2C8\uB2E4.", VM.createElement("br", null), VM.createElement("br", null), "%orig%: \uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC\uBA85 (64\uC790 \uCF54\uB4DC)", VM.createElement("br", null), "%num%: \uB118\uBC84\uB9C1 (000~999)", VM.createElement("br", null), "%title%: \uAC8C\uC2DC\uBB3C \uC81C\uBAA9", VM.createElement("br", null), "%category%: \uAC8C\uC2DC\uBB3C \uCE74\uD14C\uACE0\uB9AC", VM.createElement("br", null), "%author%: \uAC8C\uC2DC\uBB3C \uC791\uC131\uC790", VM.createElement("br", null), "%channel%: \uCC44\uB110 \uC774\uB984"),
    callback: {
      save() {
        Configure.set(IMAGENAME, imageName.value);
      },

      load() {
        imageName.value = Configure.get(IMAGENAME);
      }

    }
  });
}

function addContextMenu() {
  const copyClipboardItem = ContextMenu.createMenu({
    text: '클립보드에 복사',

    async onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      const title = event.target.textContent;
      const buffer = await getArrayBuffer(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        event.target.textContent = `${progress}%`;
      }, () => {
        event.target.textContent = title;
      });
      const blob = new Blob([buffer], {
        type: 'image/png'
      });
      const item = new ClipboardItem({
        [blob.type]: blob
      });
      navigator.clipboard.write([item]);
      ContextMenu.hide();
    }

  });
  const saveImageItem = ContextMenu.createMenu({
    text: '이미지 저장',

    async onClick(event) {
      event.preventDefault();
      const title = event.target.textContent;
      const url = ContextMenu.getContextData('url');
      const ext = url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
      let imagename = replaceData(Configure.get(IMAGENAME));
      imagename = imagename.replace('%num%', '000');
      imagename = imagename.replace('%orig%', url.match(/[0-9a-f]{64}/)[0]);
      const file = await getBlob(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        event.target.textContent = `${progress}%`;
      }, () => {
        event.target.textContent = title;
      });
      window.saveAs(file, `${imagename}${ext}`);
      ContextMenu.hide();
    }

  });
  const copyURLItem = ContextMenu.createMenu({
    text: '이미지 주소 복사',

    onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      navigator.clipboard.writeText(url);
      ContextMenu.hide();
    }

  });
  const contextElement = VM.createElement("div", null, copyClipboardItem, saveImageItem, copyURLItem);
  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

function apply$8() {
  const data = parse();
  if (data.length == 0) return;
  const itemContainer = VM.createElement("div", {
    class: "image-list"
  });

  for (const d of data) {
    const style = {
      backgroundImage: `url(${d.thumb})`
    };
    itemContainer.append(VM.createElement("div", null, VM.createElement("label", {
      class: "item",
      style: style,
      "data-url": d.url,
      "data-filename": d.filename
    }, VM.createElement("input", {
      type: "checkbox",
      name: "select"
    }))));
  }

  itemContainer.addEventListener('dblclick', event => {
    event.preventDefault();
    window.getSelection().removeAllRanges();
    const label = event.target.closest('.item');

    if (label) {
      event.preventDefault();
      const value = !label.children[0].checked;

      for (const child of itemContainer.children) {
        child.querySelector('input[type="checkbox"]').checked = value;
      }
    }
  });
  const downloadBtn = VM.createElement("button", {
    class: "btn btn-arca"
  }, "\uC77C\uAD04 \uB2E4\uC6B4\uB85C\uB4DC");
  downloadBtn.addEventListener('click', async event => {
    event.preventDefault();
    downloadBtn.disabled = true;
    const checkedElements = itemContainer.querySelectorAll('input[type="checkbox"]:checked');

    if (checkedElements.length == 0) {
      alert('선택된 파일이 없습니다.');
      downloadBtn.disabled = false;
      return;
    }

    const zip = new JSZip();
    const originalText = downloadBtn.textContent;
    const total = checkedElements.length;
    const configureName = Configure.get(IMAGENAME);

    for (let i = 0; i < checkedElements.length; i++) {
      let imagename = replaceData(configureName);
      const {
        url,
        filename: orig
      } = checkedElements[i].parentNode.dataset;
      const ext = url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
      const file = await getBlob(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        downloadBtn.textContent = `다운로드 중...${progress}% (${i}/${total})`;
      });
      imagename = imagename.replace('%orig%', orig);
      imagename = imagename.replace('%num%', `${i}`.padStart(3, '0'));
      zip.file(`${imagename}${ext}`, file);
    }

    downloadBtn.textContent = originalText;
    let filename = Configure.get(FILENAME);
    filename = replaceData(filename);
    const zipblob = await zip.generateAsync({
      type: 'blob'
    });
    window.saveAs(zipblob, `${filename}.zip`);
    downloadBtn.disabled = false;
  });
  const wrapper = VM.createElement("div", {
    class: "article-image hidden"
  }, VM.createElement("style", null, css_248z$4), itemContainer, VM.createElement("div", null, "\uB354\uBE14\uD074\uB9AD\uC744 \uD558\uBA74 \uC774\uBBF8\uC9C0\uB97C \uBAA8\uB450 \uC120\uD0DD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), downloadBtn);
  const enableBtn = VM.createElement("a", {
    href: "#",
    class: "btn btn-arca"
  }, VM.createElement("span", {
    class: "ion-ios-download-outline"
  }), " \uC774\uBBF8\uC9C0 \uB2E4\uC6B4\uB85C\uB4DC \uBAA9\uB85D \uBCF4\uC774\uAE30");
  enableBtn.addEventListener('click', event => {
    event.preventDefault();

    if (wrapper.classList.contains('hidden')) {
      wrapper.classList.remove('hidden');
    } else {
      wrapper.classList.add('hidden');
    }
  });
  document.querySelector('.article-body').insertAdjacentElement('afterend', enableBtn).insertAdjacentElement('afterend', wrapper);
}

function replaceData(string) {
  const articleInfo = Parser.getArticleInfo();
  const channelInfo = Parser.getChannelInfo();
  string = string.replace('%title%', articleInfo.title);
  string = string.replace('%category%', articleInfo.category);
  string = string.replace('%author%', articleInfo.author);
  string = string.replace('%channel%', channelInfo.name);
  return string;
}

function parse() {
  const images = document.querySelectorAll('.article-body  img, .article-body video:not([controls])');
  const result = [];
  images.forEach(element => {
    const filepath = element.src.split('?')[0];
    const thumb = `${filepath}${element.tagName == 'VIDEO' ? '.gif' : ''}?type=list`;
    const url = `${filepath}${element.tagName == 'VIDEO' ? '.gif' : ''}?type=orig`;
    const filename = filepath.match(/[0-9a-f]{64}/)[0];
    result.push({
      thumb,
      url,
      filename
    });
  });
  return result;
}

var ImageSearch = {
  load: load$c
};

function load$c() {
  try {
    if (Parser.hasArticle()) {
      addContextMenu$1();
    }
  } catch (error) {
    console.error(error);
  }
}

function addContextMenu$1() {
  const searchGoogleItem = ContextMenu.createMenu({
    text: 'Google 검색',

    onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      window.open(`https://www.google.com/searchbyimage?safe=off&image_url=${url}`);
      ContextMenu.hide();
    }

  });
  const searchYandexItem = ContextMenu.createMenu({
    text: 'Yandex 검색',
    description: '러시아 검색엔진입니다.',

    onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      window.open(`https://yandex.com/images/search?rpt=imageview&url=${url}`);
      ContextMenu.hide();
    }

  });
  const searchSauceNaoItem = ContextMenu.createMenu({
    text: 'SauceNao 검색',
    description: '망가, 픽시브 이미지 검색을 지원합니다.',

    async onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        event.target.textContent = `${progress}%`;
      }, () => {
        event.target.textContent = '업로드 중...';
      });
      const docParser = new DOMParser();
      const formdata = new FormData();
      formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
      formdata.append('frame', 1);
      formdata.append('database', 999);
      const result = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://saucenao.com/search.php',
          data: formdata,
          onload: resolve,
          onerror: () => {
            reject(new Error('Access Rejected'));
          }
        });
      });
      const resultDocument = docParser.parseFromString(result.responseText, 'text/html');
      const replaceURL = resultDocument.querySelector('#yourimage a').href.split('image=')[1];
      window.open(`https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`);
      ContextMenu.hide();
    }

  });
  const searchTwigatenItem = ContextMenu.createMenu({
    text: 'TwitGaTen 검색',
    description: '트위터 이미지 검색을 지원합니다.',

    async onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        event.target.textContent = `${progress}%`;
      }, () => {
        event.target.textContent = '업로드 중...';
      });
      const formdata = new FormData();
      formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
      const result = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://twigaten.204504byse.info/search/media',
          data: formdata,
          onload: resolve,
          onerror: () => {
            reject(new Error('Access Rejected'));
          }
        });
      });
      window.open(result.finalUrl);
      ContextMenu.hide();
    }

  });
  const searchAscii2dItem = ContextMenu.createMenu({
    text: 'Ascii2D 검색',
    description: '트위터, 픽시브 이미지 검색을 지원합니다.',

    async onClick(event) {
      event.preventDefault();
      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(url, e => {
        const progress = Math.round(e.loaded / e.total * 100);
        event.target.textContent = `${progress}%`;
      }, () => {
        event.target.textContent = '업로드 중...';
      });
      const docParser = new DOMParser();
      const tokenDocument = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://ascii2d.net',
          onload: response => {
            resolve(docParser.parseFromString(response.responseText, 'text/html'));
          },
          onerror: () => {
            reject(new Error('Access Rejected'));
          }
        });
      });
      const token = tokenDocument.querySelector('input[name="authenticity_token"]').value;
      const formdata = new FormData();
      formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
      formdata.append('utf8', '✓');
      formdata.append('authenticity_token', token);
      const result = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://ascii2d.net/search/file',
          data: formdata,
          onload: resolve,
          onerror: () => {
            reject(new Error('Access Rejected'));
          }
        });
      });
      window.open(result.finalUrl);
      ContextMenu.hide();
    }

  });
  const contextElement = VM.createElement("div", null, searchGoogleItem, searchYandexItem, searchSauceNaoItem, searchTwigatenItem, searchAscii2dItem);
  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

var css_248z$5 = ".fix-header .root-container {\r\n    padding-top: 42px;\r\n}\r\n.fix-header .navbar-wrapper {\r\n    top: 0px;\r\n    position: fixed !important;\r\n    width: 100%;\r\n    z-index: 20;\r\n}\r\n\r\n.content-wrapper.hide-recent-visit .visited-channel-list {\r\n    display: none;\r\n}\r\n\r\n.content-wrapper.hide-avatar .avatar {\r\n    display: none !important;\r\n}\r\n.content-wrapper.hide-avatar .input-wrapper > .input {\r\n    width: calc(100% - 4.5rem - .5rem) !important;\r\n}\r\n\r\n.list-table.hide-notice a.notice {\r\n    display: none !important;\r\n}\r\n.content-wrapper.hide-modified b.modified {\r\n    display: none !important;\r\n}\r\n\r\n.content-wrapper.hide-sidemenu .right-sidebar {\r\n    display: none;\r\n}\r\n\r\n@media screen and (min-width: 991px) {\r\n    .content-wrapper.hide-sidemenu .board-article {\r\n        padding: 1rem;\r\n        margin: 0;\r\n    }\r\n}";

var LiveModifier = {
  load: load$d
};
const HIDE_RECENT_VISIT = {
  key: 'hideRecentVisit',
  defaultValue: false
};
const HIDE_SIDEMENU = {
  key: 'hideSideMenu',
  defaultValue: false
};
const HIDE_AVATAR = {
  key: 'hideAvatar',
  defaultValue: false
};
const HIDE_MODIFIED = {
  key: 'hideModified',
  defaultValue: false
};
const RESIZE_MEDIA = {
  key: 'resizeMedia',
  defaultValue: '100'
};

function load$d() {
  try {
    addSetting$8();
    apply$9();
  } catch (error) {
    console.error(error);
  }
}

function addSetting$8() {
  const hideRecentVisit = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '최근 방문 채널 숨김',
    option: hideRecentVisit,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_RECENT_VISIT, hideRecentVisit.value == 'true');
      },

      load() {
        hideRecentVisit.value = Configure.get(HIDE_RECENT_VISIT);
      }

    }
  });
  const hideSideMenu = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '우측 사이드 메뉴 숨김',
    option: hideSideMenu,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_SIDEMENU, hideSideMenu.value == 'true');
      },

      load() {
        hideSideMenu.value = Configure.get(HIDE_SIDEMENU);
      }

    }
  });
  const hideAvatar = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '프로필 아바타 숨김',
    option: hideAvatar,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_AVATAR, hideAvatar.value == 'true');
      },

      load() {
        hideAvatar.value = Configure.get(HIDE_AVATAR);
      }

    }
  });
  const hideModified = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '댓글 *수정됨 숨김',
    option: hideModified,
    description: '',
    callback: {
      save() {
        Configure.set(HIDE_MODIFIED, hideModified.value == 'true');
      },

      load() {
        hideModified.value = Configure.get(HIDE_MODIFIED);
      }

    }
  });
  const resizeMedia = VM.createElement("input", {
    type: "text",
    name: "resizeMedia"
  });
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '본문 이미지, 동영상 사이즈',
    option: resizeMedia,
    description: '',
    callback: {
      save() {
        Configure.set(RESIZE_MEDIA, resizeMedia.value);
      },

      load() {
        resizeMedia.value = Configure.get(RESIZE_MEDIA);
      }

    }
  });
}

function apply$9() {
  document.head.append(VM.createElement("style", null, css_248z$5));
  const contentWrapper = document.querySelector('.content-wrapper');
  const hideRecentVisit = Configure.get(HIDE_RECENT_VISIT);
  if (hideRecentVisit) contentWrapper.classList.add('hide-recent-visit');
  const hideSideMenu = Configure.get(HIDE_SIDEMENU);
  if (hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
  const hideAvatar = Configure.get(HIDE_AVATAR);
  if (hideAvatar) contentWrapper.classList.add('hide-avatar');
  const hideModified = Configure.get(HIDE_MODIFIED);
  if (hideModified) contentWrapper.classList.add('hide-modified');
  const resizeMedia = Configure.get(RESIZE_MEDIA);
  const css = `.article-body img, .article-body video {
        max-width: ${resizeMedia}% !important;
    }`;
  document.head.append(VM.createElement("style", null, css));
}

var css_248z$6 = "#refresherSetting #MyImage .grid-wrapper {\r\n    display: grid;\r\n    width: 100%;\r\n    min-height: calc(100px + 1rem + 2px);\r\n    border: 1px solid #bbb;\r\n    padding: 0.5rem;\r\n    grid-template-columns: repeat(auto-fill, minmax(100px, auto));\r\n    gap: 0.5rem;\r\n    justify-items: center;\r\n}\r\n\r\n#refresherSetting #MyImage .grid-item {\r\n    display: inline-block;\r\n    width: 100px;\r\n    height: 100px;\r\n    border: 1px solid #bbb;\r\n    margin: 0;\r\n    background-size: cover;\r\n}";

var MyImage = {
  load: load$e
};
const MY_IMAGES = {
  key: 'myImages',
  defaultValue: {}
};

async function load$e() {
  try {
    addSetting$9();

    if (Parser.hasArticle()) {
      addContextMenu$2();
    }

    if (Parser.hasWriteView()) {
      await waitForElement('.fr-box');
      apply$a();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$9() {
  const imgList = VM.createElement("div", {
    class: "grid-wrapper"
  });
  imgList.addEventListener('dblclick', event => {
    event.preventDefault();
    window.getSelection().removeAllRanges();
    const label = event.target.closest('.grid-item');

    if (label) {
      event.preventDefault();
      const value = !label.children[0].checked;

      for (const child of imgList.children) {
        child.querySelector('input[type="checkbox"]').checked = value;
      }
    }
  });
  const deleteBtn = VM.createElement("button", {
    class: "btn btn-arca"
  }, "\uC0AD\uC81C");
  deleteBtn.addEventListener('click', event => {
    event.target.disabled = true;
    const removeElements = imgList.querySelectorAll('input[type="checkbox"]:checked');

    for (const element of removeElements) {
      element.closest('div').remove();
    }

    event.target.disabled = false;
  });
  const channel = Parser.getChannelInfo().id;
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '자짤 관리',
    option: VM.createElement("div", {
      id: "MyImage"
    }, VM.createElement("style", null, css_248z$6), imgList, deleteBtn),
    description: '더블을 하면 이미지를 모두 선택할 수 있습니다.',
    callback: {
      save() {
        const data = Configure.get(MY_IMAGES);
        const images = Array.from(imgList.children, e => e.children[0].dataset.url);
        data[channel] = images;
        Configure.set(MY_IMAGES, data);
      },

      load() {
        const data = Configure.get(MY_IMAGES)[channel];
        if (!data) return;

        while (imgList.firstChild) imgList.lastChild.remove();

        for (const i of data) {
          const style = {
            backgroundImage: `url(${i}?type=list)`
          };
          imgList.append(VM.createElement("div", null, VM.createElement("label", {
            class: "grid-item",
            style: style,
            "data-url": i
          }, VM.createElement("input", {
            type: "checkbox",
            name: "select"
          }))));
        }
      }

    }
  });
}

function addContextMenu$2() {
  const channel = Parser.getChannelInfo().id;
  const addMyImageItem = ContextMenu.createMenu({
    text: '자짤로 등록',

    onClick(event) {
      event.preventDefault();
      const imgList = Configure.get(MY_IMAGES);

      if (!imgList[channel]) {
        imgList[channel] = [];
      }

      imgList[channel].push(ContextMenu.getContextData('url').split('?')[0]);
      Configure.set(MY_IMAGES, imgList);
      ContextMenu.hide();
    }

  });
  const contextElement = VM.createElement("div", null, addMyImageItem);
  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

function apply$a() {
  const channel = Parser.getChannelInfo().id;
  const editor = unsafeWindow.FroalaEditor('#content');

  if (editor.core.isEmpty()) {
    const imgList = Configure.get(MY_IMAGES)[channel];
    if (!imgList || !imgList.length) return;
    const img = imgList[Math.floor(Math.random() * imgList.length)];
    editor.html.set(`<img src="${img}">`);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
  }
}

var NewWindow = {
  load: load$f
};
const OPEN_NEW_WINDOW = {
  key: 'openNewWindow',
  defaultValue: false
};

function load$f() {
  try {
    addSetting$a();

    if (Parser.hasBoard()) {
      apply$b();
    }

    AutoRefresher.addRefreshCallback({
      priority: 100,
      callback: apply$b
    });
  } catch (error) {
    console.error(error);
  }
}

function addSetting$a() {
  const newWindow = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '게시물 새 창으로 열기',
    option: newWindow,
    description: '게시물 클릭 시 새창으로 띄워줍니다.',
    callback: {
      save() {
        Configure.set(OPEN_NEW_WINDOW, newWindow.value == 'true');
      },

      load() {
        newWindow.value = Configure.get(OPEN_NEW_WINDOW);
      }

    }
  });
}

function apply$b() {
  const value = Configure.get(OPEN_NEW_WINDOW);
  if (!value) return;
  const articles = Parser.queryItems('articles', 'board');

  for (const article of articles) {
    article.setAttribute('target', '_blank');
  }
}

var NotificationIconColor = {
  load: load$g
};
const NOTIFY_COLOR = {
  key: 'notificationIconColor',
  defaultValue: ''
};

function load$g() {
  try {
    addSetting$b();
    apply$c();
  } catch (error) {
    console.error(error);
  }
}

function addSetting$b() {
  const inputElement = VM.createElement("input", {
    type: "text",
    placeholder: "FFC107"
  });
  const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span'); // 이벤트 핸들러

  inputElement.addEventListener('keypress', event => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  inputElement.addEventListener('dblclick', event => {
    const color = getRandomColor();
    event.target.value = color;
    notificationIcon.style.color = `#${color}`;
  });
  inputElement.addEventListener('input', event => {
    let color = '';

    if (event.target.value.length == 6) {
      color = `#${event.target.value}`;
    }

    notificationIcon.style.color = color;
  });
  Configure.addSetting({
    category: Configure.categoryKey.INTERFACE,
    header: '알림 아이콘 색상 변경',
    option: inputElement,
    description: VM.createElement(VM.Fragment, null, "\uC54C\uB9BC \uC544\uC774\uCF58\uC758 \uC810\uB4F1 \uC0C9\uC0C1\uC744 \uBCC0\uACBD\uD569\uB2C8\uB2E4.", VM.createElement("br", null), "\uC0C9\uC0C1\uC744 \uC785\uB825\uD558\uBA74 \uC54C\uB9BC \uC544\uC774\uCF58\uC5D0\uC11C \uBBF8\uB9AC \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4.", VM.createElement("br", null), "\uB354\uBE14 \uD074\uB9AD\uC73C\uB85C \uBB34\uC791\uC704 \uC0C9\uC0C1\uC744 \uC120\uD0DD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
    callback: {
      save() {
        Configure.set(NOTIFY_COLOR, inputElement.value);
      },

      load() {
        inputElement.value = Configure.get(NOTIFY_COLOR);
      }

    }
  });
}

function apply$c() {
  const color = Configure.get(NOTIFY_COLOR);
  const notificationIcon = document.querySelector('.navbar-wrapper .noti-menu-link span');
  if (notificationIcon == null) return;
  const notiObserver = new MutationObserver(() => {
    if (notificationIcon.style.color) {
      notificationIcon.style.color = `#${color}`;
    }
  });
  notiObserver.observe(notificationIcon, {
    attributes: true
  });
}

var RatedownGuard = {
  load: load$h
};
const RATEDOWN_GUARD = {
  key: 'blockRatedown',
  defaultValue: false
};

function load$h() {
  try {
    addSetting$c();

    if (Parser.hasArticle()) {
      apply$d();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$c() {
  const ratedownBlock = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '비추천 방지',
    option: ratedownBlock,
    description: '비추천 버튼을 클릭하면 다시 한 번 확인창을 띄웁니다.',
    callback: {
      save() {
        Configure.set(RATEDOWN_GUARD, ratedownBlock.value == 'true');
      },

      load() {
        ratedownBlock.value = Configure.get(RATEDOWN_GUARD);
      }

    }
  });
}

function apply$d() {
  if (!Configure.get(RATEDOWN_GUARD)) return;
  const ratedown = document.querySelector('#rateDown');
  if (ratedown == null) return;
  ratedown.addEventListener('click', e => {
    if (!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
      e.preventDefault();
    }
  });
}

var ShortCut = {
  load: load$i
};
const USE_SHORTCUT = {
  key: 'useShortcut',
  defaultValue: false
};

function load$i() {
  try {
    addSetting$d();

    if (Parser.hasArticle()) {
      apply$e('article');
    } else if (Parser.hasBoard()) {
      apply$e('board');
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting$d() {
  const shortCut = VM.createElement("select", null, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9"));
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '단축키 사용',
    option: shortCut,
    description: VM.createElement("a", {
      href: "https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99",
      target: "_blank",
      rel: "noreferrer"
    }, "\uB2E8\uCD95\uD0A4 \uC548\uB0B4 \uBC14\uB85C\uAC00\uAE30"),
    callback: {
      save() {
        Configure.set(USE_SHORTCUT, shortCut.value == 'true');
      },

      load() {
        shortCut.value = Configure.get(USE_SHORTCUT);
      }

    }
  });
}

function apply$e(view) {
  if (!Configure.get(USE_SHORTCUT)) return;

  if (view == 'article') {
    document.addEventListener('keydown', onArticle);
  } else if (view == 'board') {
    document.addEventListener('keydown', onBoard);
  }
}

function onArticle(event) {
  // A 목록 바로가기
  // E 추천
  // R 댓글 목록보기
  // W 댓글 입력 포커스
  if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyA':
      event.preventDefault();
      location.pathname = location.pathname.replace(/\/[0-9]+/, '');
      break;

    case 'KeyE':
      event.preventDefault();
      document.querySelector('#rateUp').click();
      break;

    case 'KeyR':
      {
        event.preventDefault();
        const commentForm = document.querySelector('.article-comment');
        window.scrollTo({
          top: commentForm.offsetTop - 50,
          behavior: 'smooth'
        });
        break;
      }

    case 'KeyW':
      {
        event.preventDefault();
        const inputForm = document.querySelector('.article-comment .subtitle');
        const input = document.querySelector('.article-comment .input textarea');
        const top = window.pageYOffset + inputForm.getBoundingClientRect().top;
        window.scrollTo({
          top: top - 50,
          behavior: 'smooth'
        });
        input.focus({
          preventScroll: true
        });
        break;
      }
  }
}

function onBoard(event) {
  // W 게시물 쓰기
  // E 헤드라인
  // D 이전 페이지
  // F 다음 페이지
  if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyW':
      {
        event.preventDefault();
        const path = location.pathname.split('/');
        let writePath = '';

        if (path[path.length - 1] == '') {
          path[path.length - 1] = 'write';
        } else {
          path.push('write');
        }

        writePath = path.join('/');
        location.pathname = writePath;
        break;
      }

    case 'KeyE':
      {
        event.preventDefault();

        if (location.search.indexOf('mode=best') > -1) {
          location.search = '';
        } else {
          location.search = '?mode=best';
        }

        break;
      }

    case 'KeyD':
      {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');

        if (active.previousElementSibling) {
          active.previousElementSibling.firstChild.click();
        }

        break;
      }

    case 'KeyF':
      {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');

        if (active.nextElementSibling) {
          active.nextElementSibling.firstChild.click();
        }

        break;
      }
  }
}

var css_248z$7 = "#tempArticleWrapper {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n    z-index: 1000;\r\n\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n#tempArticleWrapper table {\r\n    max-width: 400px;\r\n    width: 100%;\r\n    max-height: 400px;\r\n    height: 100%;\r\n\r\n    border: 1px solid #bbb;\r\n    background-color: #fff;\r\n}\r\n\r\n#tempArticleWrapper tbody {\r\n    display: block;\r\n    height: 300px;\r\n    overflow: auto;\r\n}\r\n\r\n#tempArticleWrapper tr {\r\n    display: table;\r\n    width: 100%;\r\n    table-layout: fixed;\r\n}\r\n\r\n#tempArticleWrapper th:nth-child(1),\r\n#tempArticleWrapper td:nth-child(1) {\r\n    width: 10%;\r\n}\r\n#tempArticleWrapper th:nth-child(2),\r\n#tempArticleWrapper td:nth-child(2) {\r\n    width: 65%;\r\n}\r\n#tempArticleWrapper th:nth-child(3),\r\n#tempArticleWrapper td:nth-child(3) {\r\n    width: 25%;\r\n}\r\n\r\n#tempArticleWrapper td:nth-child(3) {\r\n    font-size: .83em;\r\n}";

var TemporaryArticle = {
  load: load$j
};
const TEMPORARY_ARTICLES = {
  key: 'tempArticles',
  defaultValue: {}
};

async function load$j() {
  try {
    await waitForElement('.fr-box');
    apply$f();
  } catch (error) {
    console.error(error);
  }
}

function apply$f() {
  const editor = unsafeWindow.FroalaEditor('#content');
  const tempArticles = Configure.get(TEMPORARY_ARTICLES);
  const selectAll = VM.createElement("input", {
    type: "checkbox",
    name: "selectAll"
  });
  const deleteBtn = VM.createElement("button", {
    class: "btn btn-danger",
    id: "tempDeleteBtn"
  }, "\uC0AD\uC81C");
  const closeBtn = VM.createElement("button", {
    class: "btn btn-arca",
    id: "tempCloseBtn"
  }, "\uB2EB\uAE30");
  const list = VM.createElement("tbody", null);
  const wrapper = VM.createElement("div", {
    class: "hidden",
    id: "tempArticleWrapper"
  }, VM.createElement("style", null, css_248z$7), VM.createElement("table", {
    class: "table align-middle"
  }, VM.createElement("thead", null, VM.createElement("tr", null, VM.createElement("th", null, selectAll), VM.createElement("th", null, "\uC81C\uBAA9"), VM.createElement("th", null, "\uC2DC\uAC04"))), list, VM.createElement("tfoot", null, VM.createElement("td", {
    colspan: "3",
    style: "text-align:center;"
  }, deleteBtn, closeBtn))));

  function loadArticle() {
    selectAll.checked = false;

    while (list.firstChild) list.lastChild.remove();

    for (const key of Object.keys(tempArticles)) {
      list.append(VM.createElement("tr", {
        "data-id": key
      }, VM.createElement("td", null, VM.createElement("input", {
        type: "checkbox",
        name: "select"
      })), VM.createElement("td", null, VM.createElement("a", {
        href: "#"
      }, tempArticles[key].title)), VM.createElement("td", null, getDateStr(tempArticles[key].time).split(' ')[0])));
    }
  }

  wrapper.addEventListener('click', event => {
    if (event.target.name == 'selectAll') {
      list.querySelectorAll('input[name="select"]').forEach(e => {
        e.checked = event.target.checked;
      });
    }

    if (event.target.tagName == 'A') {
      const row = event.target.closest('tr');
      const id = row.dataset.id;
      const title = document.querySelector('#inputTitle');
      title.value = tempArticles[id].title;
      editor.html.set(tempArticles[id].content);
      wrapper.classList.add('hidden');
    }

    if (!event.target.closest('table')) {
      wrapper.classList.add('hidden');
    }
  });
  deleteBtn.addEventListener('click', event => {
    event.preventDefault();
    const checkedItems = list.querySelectorAll('input[name="select"]:checked');
    checkedItems.forEach(i => {
      const row = i.closest('tr');
      const id = row.dataset.id;
      delete tempArticles[id];
    });
    Configure.set(TEMPORARY_ARTICLES, tempArticles);
    loadArticle();
  });
  closeBtn.addEventListener('click', event => {
    event.preventDefault();
    wrapper.classList.add('hidden');
  });
  const btns = document.querySelector('.btns');
  const saveBtn = VM.createElement("button", {
    class: "btn btn-primary",
    id: "tempSaveBtn"
  }, "\uC784\uC2DC \uC800\uC7A5");
  const loadBtn = VM.createElement("button", {
    class: "btn btn-arca",
    id: "tempLoadBtn"
  }, "\uBD88\uB7EC\uC624\uAE30");
  const submitBtn = btns.querySelector('#submitBtn');
  btns.insertAdjacentElement('afterend', wrapper);
  btns.prepend(VM.createElement(VM.Fragment, null, VM.createElement("style", null, `
                    .btns {
                        display: grid;
                        grid-template-columns: 7rem 7rem 1fr 7rem;
                        grid-template-areas:
                            "  save     load     .   submit"
                            "recapcha recapcha recapcha recapcha";
                        grid-row-gap: 1rem;
                    }
                    .btns > #tempSaveBtn { grid-area: save; }
                    .btns > #tempLoadBtn { grid-area: load; }
                    .btns > div { grid-area: recapcha; }
                    .btns > #submitBtn { grid-area: submit; }
                `), saveBtn, loadBtn, submitBtn));
  saveBtn.addEventListener('click', event => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    const title = document.querySelector('#inputTitle').value;
    tempArticles[timestamp] = {
      title: title || '제목 없음',
      time: timestamp,
      content: editor.html.get(true)
    };

    if (!wrapper.classList.contains('hidden')) {
      loadArticle();
    }

    Configure.set(TEMPORARY_ARTICLES, tempArticles);
    alert('작성 중인 게시물이 저장되었습니다.');
  });
  loadBtn.addEventListener('click', event => {
    event.preventDefault();

    if (wrapper.classList.contains('hidden')) {
      loadArticle();
      wrapper.classList.remove('hidden');
    }
  });
}

var UserMemo = {
  load: load$k
};
const USER_MEMO = {
  key: 'userMemo',
  defaultValue: {}
};
let handlerApplied = false;

function load$k() {
  try {
    addSetting$e();
    apply$g();
    AutoRefresher.addRefreshCallback({
      priority: 100,
      callback: apply$g
    });
    CommentRefresh.addRefreshCallback({
      priority: 100,
      callback: apply$g
    });
  } catch (error) {
    console.error(error);
  }
}

function addSetting$e() {
  const memoList = VM.createElement("select", {
    size: "6",
    multiple: ""
  });
  const deleteBtn = VM.createElement("button", {
    class: "btn btn-arca"
  }, "\uC0AD\uC81C");
  deleteBtn.addEventListener('click', event => {
    event.target.disabled = true;
    const removeElements = memoList.selectedOptions;

    while (removeElements.length > 0) removeElements[0].remove();

    event.target.disabled = false;
  });
  Configure.addSetting({
    category: Configure.categoryKey.MEMO,
    header: '메모된 이용자',
    option: VM.createElement(VM.Fragment, null, memoList, deleteBtn),
    description: VM.createElement(VM.Fragment, null, "\uBA54\uBAA8\uB294 \uAC8C\uC2DC\uBB3C \uC791\uC131\uC790, \uB313\uAE00 \uC791\uC131\uC790 \uC544\uC774\uCF58(IP)\uC744 \uD074\uB9AD\uD574 \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", VM.createElement("br", null), "Ctrl, Shift, \uB9C8\uC6B0\uC2A4 \uB4DC\uB798\uADF8\uB97C \uC774\uC6A9\uD574\uC11C \uC5EC\uB7EC\uAC1C\uB97C \uB3D9\uC2DC\uC5D0 \uC120\uD0DD \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
    callback: {
      save() {
        const data = Configure.get(USER_MEMO);
        const keys = Array.from(memoList.children, e => e.value);

        for (const key in data) {
          if (keys.indexOf(key) == -1) delete data[key];
        }

        Configure.set(USER_MEMO, data);
      },

      load() {
        const data = Configure.get(USER_MEMO);

        while (memoList.childElementCount) {
          memoList.removeChild(memoList.children[0]);
        }

        for (const key of Object.keys(data)) {
          memoList.append(VM.createElement("option", {
            value: key
          }, `${key}-${data[key]}`));
        }
      }

    }
  });
}

function apply$g() {
  const users = Parser.queryItems('users');
  const memos = Configure.get(USER_MEMO);
  users.forEach(user => {
    const id = Parser.parseUserID(user);
    let slot = user.querySelector('.memo');

    if (memos[id]) {
      if (slot == null) {
        slot = VM.createElement("span", {
          class: "memo"
        });
        user.append(slot);
      }

      slot.textContent = ` - ${memos[id]}`;
      user.title = memos[id];
    } else if (slot) {
      slot.remove();
      user.title = '';
    }
  });
  const articleView = Parser.queryView('article');
  if (!articleView || handlerApplied) return;
  handlerApplied = true;
  articleView.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const user = event.target.closest('.user-info');
    if (user == null) return;
    event.preventDefault();
    const id = Parser.parseUserID(user);
    const newMemo = prompt('이용자 메모를 설정합니다.\n', memos[id] || '');
    if (newMemo == null) return;
    let slot = user.querySelector('.memo');

    if (slot == null) {
      slot = VM.createElement("span", {
        class: "memo"
      });
      user.append(slot);
    }

    if (newMemo) {
      slot.textContent = ` - ${newMemo}`;
      memos[id] = newMemo;
    } else {
      slot.remove();
      delete memos[id];
    }

    Configure.set(USER_MEMO, memos);
    apply$g();
  });
}

var css_248z$8 = ".hidden {\r\n    display: none !important;\r\n}\r\n\r\n.appear {\r\n    animation: fadein 0.25s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.disappear {\r\n    animation: fadeout 0.25s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n@keyframes fadein {\r\n    from {\r\n        opacity: 0;\r\n    }\r\n    to {\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes fadeout {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0;\r\n    }\r\n}";

(async function () {
  await waitForElement('head'); // Load Global CSS

  document.head.append(VM.createElement("style", null, css_248z$8, stylesheet));
  await waitForElement('.content-wrapper');
  Configure.initialize();
  ContextMenu.initialize();
  LiveModifier.load();
  NotificationIconColor.load();
  await waitForElement('footer');
  Parser.initialize();
  AutoRefresher.load();
  CommentRefresh.load();
  AnonymousNick.load();
  ArticleRemover.load();
  BlockImageNewWindow.load();
  CategoryColor.load();
  FullAreaReply.load();
  ImageDownloader.load();
  ImageSearch.load();
  IPScouter.load();
  MuteContent.load();
  MuteEmoticon.load();
  NewWindow.load();
  RatedownGuard.load();
  ShortCut.load();
  UserMemo.load();
  ClipboardUpload.load();
  MyImage.load();
  TemporaryArticle.load();
})();

}());
