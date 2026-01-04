// ==UserScript==
// @name        Hide NG Streams - twitch.tv
// @namespace   Violentmonkey Scripts
//
// @include     https://www.twitch.tv/*
//
//
// @grant       none
// @version     1.1.1
// @license     MIT
// @run-at      document-end
// @noframes
//
// @description twitchのライブ一覧からNGワードで指定したものを含むチャンネルを非表示にします
// @downloadURL https://update.greasyfork.org/scripts/510668/Hide%20NG%20Streams%20-%20twitchtv.user.js
// @updateURL https://update.greasyfork.org/scripts/510668/Hide%20NG%20Streams%20-%20twitchtv.meta.js
// ==/UserScript==
//

/** 特定のキーワードでNGにしたい場合ここに追記 **/
const NG_WORDS = [].map(x => x.toLowerCase());

/** 正規表現でNGにしたい場合ここを変更 **/
// const reg = new RegExp(//, 'i')

const HIDDEN_ATTR = 'data-hidden';

let remove_retried = 0

function shouldBeHidden(x) {
  const lowerX = x.toLowerCase();
  return NG_WORDS.some((ng) => {
    lowerX.includes(ng) ? console.log(lowerX.includes(ng), ng) : null;
    return lowerX.includes(ng) || (reg && reg.test(x))
  });
}

function hide() {
  const channels = [...document.querySelectorAll('article')].filter(x => {
    return !x.getAttribute(HIDDEN_ATTR)
  });

  if (channels.length === 0 && remove_retried < 3) {
    remove_retried += 1;
    setTimeout(
      () => hide()
      , 100);
    return;
  }

  channels.forEach(function (x) {
    if (shouldBeHidden(x.innerText)) {
      if (window.location.pathname.startsWith('/directory/following')) {
        x?.parentNode?.parentNode?.parentNode?.setAttribute('style', 'display: none !important;');
      } else {
        x?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.setAttribute('style', 'display: none !important;');
      }
      x.setAttribute(HIDDEN_ATTR, true);
    }
  })
}

const observer = new MutationObserver(() => {
  if (window.location.pathname === '/directory/all'
    || window.location.pathname.startsWith('/directory/category')
    || window.location.pathname.startsWith('/directory/following')
  ) {
    hide();
  };
});


(function () {
  const body = document.querySelector('body');
  if (body) {
    observer.observe(body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
})()