// ==UserScript==
// @name        Github屏蔽用户
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      Gwen0x4c3
// @license     MIT
// @description 屏蔽Github搜索页面某些丝麻用户的内容，如cirosantilli发的与代码无关的Shit Repo，我囸你写吗狗罕见
// @downloadURL https://update.greasyfork.org/scripts/493913/Github%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/493913/Github%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
(function() {
  'use strict';
  
  const log = {
    info(message, obj) {
      if (typeof(message) == 'string') {
        console.log("%c[INFO] " + message, "color:blue;font-weight:bold;", obj);
      } else {
        console.log("%c[INFO] ", "color:blue;font-weight:bold;", arguments);
      }
    },
    error(message, obj) {
      if (typeof(message) == 'string') {
        console.log("%c[ERROR] " + message, "color:red;font-weight:bold;", obj);
      } else {
        console.log("%c[ERROR] ", "color:red;font-weight:bold;", arguments);
      }
    }
  }
  
  const REGEX_SEARCH_REPO = /\/search\?.*?type=repositories.*?/;
  const REGEX_SEARCH_USER = /\/search\?.*?type=users.*?/;
  const REGEX_EXCLUDE_USER = /-user:([a-zA-Z0-9_]+)/g;
  
  const store = {
    blockedUsers: GM_getValue("blocked_users", ['cirosantilli', 'wumaoland']),
    dialog: null
  }
  
  GM_registerMenuCommand("⚙查看屏蔽用户", () => {
    store.dialog.show();
  });
  
  function createElement(tag, clazz, attrs) {
    const elem = document.createElement(tag);
    elem.className = clazz;
    if (attrs) {
      for (let key in attrs) {
        elem[key] = attrs[key];
      }
    }
    return elem;
  }
  
  function blockElem(target) {
    const div = createElement('div', target.className, {
      innerText: `🚫Blocked this shit content by user: ${target.getAttribute('gb_user')}`
    })
    target.replaceWith(div);
  }
  
  function blockRepoSearch() {
    const resultList = document.querySelector('div[data-testid="results-list"]');
    // log.info("获取results list", { resultList });
    if (!resultList || resultList.gb_blocked) {
      setTimeout(blockRepoSearch, 100);
    } else {
      resultList.gb_blocked = true;
      const repos = resultList.children;
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        const span = repo.querySelector('.search-match');
        log.info({repo, span});
        const user = span.innerText.split('/')[0];
        repo.setAttribute('gb_user', user);
        for (let blockedUser of store.blockedUsers) {
          if (blockedUser == user) {
            log.info("BLOCKED " + span.innerText);
            blockElem(repo);
            break;
          }
        }
        const exampleButton = repo.querySelector('button');
        const blockButton = createElement('button', exampleButton.className, {
          innerText: '🚫Block',
          onclick: e => {
            if (confirm("Are you sure to BLOCK this MF:" + user)) {
              store.blockedUsers.push(user);
              GM_setValue('blocked_users', store.blockedUsers);
              for (let j = 0; j < repos.length; j++) {
                if (repos[j].getAttribute('gb_user') == user) {
                  blockElem(repos[j]);
                }
              }
            }
          }
        });
        blockButton.setAttribute('data-size', 'small');
        const buttonWrapper = createElement('div', exampleButton.parentElement.className);
        buttonWrapper.appendChild(blockButton);
        exampleButton.parentElement.parentElement.prepend(buttonWrapper);
      }
    }
  }
  
  function blockUserSearch() {
    const resultList = document.querySelector('div[data-testid="results-list"]');
    // log.info("获取results list", { resultList });
    if (!resultList || resultList.gb_blocked) {
      setTimeout(blockRepoSearch, 100);
    } else {
      resultList.gb_blocked = true;
      const users = resultList.children;
      for (let i = 0; i < users.length; i++) {
        const userElem = users[i];
        const a = user.querySelector('a:last-of-type');
        const user = a.innerText;
        userElem.setAttribute('gb_user', user);
        for (let blockedUser of store.blockedUsers) {
          if (blockedUser == user) {
            log.info("BLOCKED " + span.innerText);
            blockElem(userElem);
            break;
          }
        }
        const exampleButton = user.querySelector('button');
        const blockButton = createElement('button', exampleButton.className, {
          innerText: '🚫Block',
          onclick: e => {
            if (confirm("Are you sure to BLOCK this MF:" + user)) {
              store.blockedUsers.push(user);
              GM_setValue('blocked_users', store.blockedUsers);
              for (let j = 0; j < users.length; j++) {
                if (users[j].getAttribute('gb_user') == user) {
                  // users[j].remove();
                  // j--;
                  blockElem(users[j]);
                }
              }
            }
          }
        });
        blockButton.setAttribute('data-size', 'small');
        const buttonWrapper = createElement('div', exampleButton.parentElement.className);
        buttonWrapper.appendChild(blockButton);
        exampleButton.parentElement.parentElement.prepend(buttonWrapper);
      }
    }
  }
  
  function initDialog() {
    if (document.getElementById('gb_block_dialog')) {
      return;
    }
    const dialog = createElement('dialog', '', {
      id: 'gb_block_dialog',
      style: 'width:50%;position:fixed;left:0;top:50px;'
    });
    store.dialog = dialog;
    const closeBtn = createElement('span', '', {
      innerText: '×',
      style: 'position:absolute;right:5px;top:2px;font-size:18px;cursor:pointer',
      onclick: e => {
        dialog.close();
      }
    })
    const tips = createElement('p', '', {
      innerText: '多个用户使用英文逗号","分隔',
      style: 'text-align: center'
    })
    const textArea = createElement('textarea', '', {
      style: 'width:100%;min-height:200px;font-size:18px;resize:none;',
      value: store.blockedUsers.join(', '),
      onblur: e => {
        const arr = textArea.value.split(',');
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].trim();
          if (arr[i].length == 0) {
            arr.splice(i, 1);
            i--;
          }
        }
        store.blockedUsers = [...arr];
        GM_setValue('blocked_users', store.blockedUsers);
        textArea.value = arr.join(', ');
      }
    })
    dialog.appendChild(closeBtn);
    dialog.appendChild(tips);
    dialog.appendChild(textArea);
    document.body.append(dialog);
  }
  
  function handleUrlChange(url) {
    initDialog();
    // const _url = new URL(url);
    // if (_url.pathname == '/search') {
    //   let q = _url.searchParams.get('q');
    //   if (!q) {
    //     q = '';
    //   }
    //   let users = [];
    //   let match = null;
    //   while ((match = REGEX_EXCLUDE_USER.exec(q)) !== null) {
    //     users.push(match[1]);
    //   }
    // }
    if (REGEX_SEARCH_REPO.test(lastUrl)) {
      blockRepoSearch();
    } else if (REGEX_SEARCH_USER.test(lastUrl)) {
      blockUserSearch();
    }
  }
  
  let lastUrl = '';
  handleUrlChange(location.href);
  const urlTimer = setInterval(() => {
    if (lastUrl != location.href) {
      log.info("url changed to " + location.href);
      lastUrl = location.href;
      handleUrlChange(lastUrl);
    }
  }, 300);
})();