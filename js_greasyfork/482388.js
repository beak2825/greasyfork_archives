// ==UserScript==
// @name         机翻跳转
// @version      0.4
// @match       https://novel18.syosetu.com/*
// @match       https://ncode.syosetu.com/*
// @match       https://pixiv.net/novel/series/*
// @match       https://alphapolis.co.jp/novel/*
// @match       https://kakuyomu.jp/works/*
// @match       https://novelup.plus/story/*
// @match       https://syosetu.org/novel/*
// @match       https://novelism.jp/novel/*
// @description  网页机翻跳转
// @author       wty
// @grant        none
// @namespace https://greasyfork.org/users/1019438
// @downloadURL https://update.greasyfork.org/scripts/482388/%E6%9C%BA%E7%BF%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482388/%E6%9C%BA%E7%BF%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = "跳转"
    toTopBtn.className = "a-b-c-d-toTop"
    toTopBtn.onclick = function (e) {
    const url = window.location.href;

    const providers = {
      kakuyomu: (url) => /kakuyomu\.jp\/works\/([0-9]+)/.exec(url)?.[1],
      syosetu: (url) =>
        /syosetu\.com\/([A-Za-z0-9]+)/.exec(url)?.[1].toLowerCase(),
      novelup: (url) => /novelup\.plus\/story\/([0-9]+)/.exec(url)?.[1],
      hameln: (url) => /syosetu\.org\/novel\/([0-9]+)/.exec(url)?.[1],
      pixiv: (url) => {
        let novelId = /pixiv\.net\/novel\/series\/([0-9]+)/.exec(url)?.[1];
        if (novelId === undefined) {
          novelId = /pixiv\.net\/novel\/show.php\?id=([0-9]+)/.exec(url)?.[1];
          if (novelId !== undefined) {
            novelId = 's' + novelId;
          }
        }
        return novelId;
      },
      alphapolis: (url) => {
        const matched =
          /www\.alphapolis\.co\.jp\/novel\/([0-9]+)\/([0-9]+)/.exec(url);
        if (matched) {
          return `${matched[1]}-${matched[2]}`;
        } else {
          return undefined;
        }
      },
      novelism: (url) => /novelism\.jp\/novel\/([^\/]+)/.exec(url)?.[1],
    };
    for (const providerId in providers) {
      const provider = providers[providerId];
      const novelId = provider(url);
      if (novelId !== undefined) {
          window.location.href = `https://books.fishhawk.top/novel/${providerId}/${novelId}`
      }
    }
    }
    var body = document.body
    var style = document.createElement('style')
    style.id = "a-b-c-d-style"
    var css = `.a-b-c-d-toTop{
      position: fixed;
    bottom: 80%;
    right: 85%;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    font-size: 10px;
    z-index: 999;
    cursor: pointer;
    font-size: 10px;
    overflow: hidden;
    }`
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    body.appendChild(toTopBtn)
    body.appendChild(style)
    // Your code here...
})();