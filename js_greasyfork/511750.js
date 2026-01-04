// ==UserScript==
// @name        ねとるむフレ検索
// @description ねとるむでフレンド検索
// @namespace   https://your-unique-namespace.example.com/
// @version     1.0
// @author      baka
// @match       https://netroom.oz96.com/*
// @grant       none
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/511750/%E3%81%AD%E3%81%A8%E3%82%8B%E3%82%80%E3%83%95%E3%83%AC%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/511750/%E3%81%AD%E3%81%A8%E3%82%8B%E3%82%80%E3%83%95%E3%83%AC%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

  const userList = document.getElementById('user_list2');

  function filterUsers(suN) {
    Array.from(userList.getElementsByClassName('li_user clearfix')).forEach($user => {
      $user.style.display = $user.getElementsByClassName('user_name')[0].textContent.includes(suN) || suN === "" ? '' : 'none';
    });
  }

  function addSearchInput() {
    if (!document.getElementById('suNe')) {
      const suNe = document.createElement('input');
      suNe.type = 'text';
      suNe.id = 'suNe';
      suNe.placeholder = '検索...';
      userList.prepend(suNe);
      suNe.addEventListener('input', () => filterUsers(suNe.value));
    }
  }

  new MutationObserver(() => addSearchInput()).observe(userList, { childList: true, subtree: true });
  addSearchInput();
