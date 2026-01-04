// ==UserScript==
// @name        Narou Comment Muter
// @namespace   https://greasyfork.org/users/140004
// @description 「小説家になろう」の感想一覧ページで特定ユーザによる感想を非表示にする
// @author      dmizuk (https://greasyfork.org/users/140004)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       http://novelcom.syosetu.com/impression/list/ncode/*
// @match       https://novelcom.syosetu.com/impression/list/ncode/*
// @match       http://mypage.syosetu.com/*
// @match       https://mypage.syosetu.com/*
// @version     1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31362/Narou%20Comment%20Muter.user.js
// @updateURL https://update.greasyfork.org/scripts/31362/Narou%20Comment%20Muter.meta.js
// ==/UserScript==

const MUTED_IDS = 'mutedIds';

function getMutedIds() {
  const value = GM_getValue(MUTED_IDS);

  if (value) {
    return value.split(' ');
  } else {
    return [];
  }
}

function setMutedIds(ids) {
  GM_setValue(MUTED_IDS, ids.join(' '));
}

function muteId(id) {
  const muted = getMutedIds();

  if (! muted.includes(id)) {
    muted.push(id);
    setMutedIds(muted);
  }
}

function unmuteId(id) {
  const muted = getMutedIds();
  const i = muted.indexOf(id);

  if (i >= 0) {
    muted.splice(i, 1);
    setMutedIds(muted);
  }
}

function getIdFromMypageUrl(url) {
  return url.match(/^(?:https?:)?\/\/mypage\.syosetu\.com\/(\d+)/)[1];
}

function onImpressionList() {
  const style = document.createElement('style');
  style.innerHTML = ".muted > .comment_h2, .muted > .comment { display: none; }";
  document.head.appendChild(style);

  const muted = getMutedIds();

  for (const e of document.getElementsByClassName('waku')) {
    const a = e.querySelector('.comment_user > a');
    if (! a) continue; // 登録ユーザでない
    const id = getIdFromMypageUrl(a.href);

    if (muted.includes(id)) {
      e.classList.add('muted');

      const msg = document.createElement('div');
      msg.textContent = 'この投稿はミュートされています。';
      const showButton = document.createElement('button');
      msg.appendChild(showButton);

      showButton.textContent = '表示';
      showButton.addEventListener('click', () => {
        e.classList.remove('muted');
        e.removeChild(msg);
      });

      e.appendChild(msg);
    }
  }
}

function onMypage() {
  const id = getIdFromMypageUrl(location.href);
  const ul = document.querySelector('#anotheruser_info > ul');
  const muteButton = document.createElement('button');

  let isMuted = getMutedIds().includes(id);
  if (isMuted) {
    muteButton.textContent = 'ミュート解除';
  } else {
    muteButton.textContent = 'ミュート';
  }

  muteButton.addEventListener('click', () => {
    if (isMuted) {
      unmuteId(id);
      muteButton.textContent = 'ミュート';
    } else {
      muteId(id);
      muteButton.textContent = 'ミュート解除';
    }
    isMuted = ! isMuted;
  });

  const li = document.createElement('li');
  li.appendChild(muteButton);
  ul.style.width = '400px';
  ul.appendChild(li);
}

(function() {
  'use strict';

  switch (location.host) {
    case 'novelcom.syosetu.com':
      onImpressionList();
      break;
    case 'mypage.syosetu.com':
      onMypage();
      break;
  }
})();
