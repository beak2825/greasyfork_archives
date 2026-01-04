// ==UserScript==
// @name         Twitter-UI-Cleaner
// @namespace    https://github.com/TwoSquirrels
// @version      1.3
// @description  Eliminate distractions on Twitter
// @author       TwoSquirrels
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496633/Twitter-UI-Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/496633/Twitter-UI-Cleaner.meta.js
// ==/UserScript==

setInterval(() => {
  const username = document.querySelector(`a[href$="/communities"]`)?.href?.match(/(?<=\.com\/)[A-Za-z0-9_]+(?=\/)/g)[0] ?? null;

  // ユーザーにカーソルをかざした時に出てくるカードを非表示にする
  for (const card of document.querySelectorAll(`div[data-testid="hoverCardParent"] > div[style]`)) {
    card.style.display = "none";
  }

  // ビジネスのリンクをスペースに置き換える
  for (const business of document.querySelectorAll(`a[href="/i/verified-orgs-signup"]`)) {
    business.onclick = (event) => event.stopPropagation();
    business.href = "/i/spaces/start";
    business.getElementsByTagName("svg")[0].innerHTML = [
      `<g><path d="M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39`,
      `7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5`,
      `5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0`,
      `.414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0`,
      `.414.34.75.75.75s.75-.336.75-.75V9z"></path></g>`
    ].join(" ");
    business.getElementsByTagName("span")[0].innerText = "スペースを作成";
    business.ariaLabel = "スペースを作成";
  }

  // Grok のリンクをリストに置き換える
  for (const grok of document.querySelectorAll(`a[href="/i/grok"]`)) {
    grok.onclick = (event) => event.stopPropagation();
    grok.href = `/${username}/lists`;
    grok.getElementsByTagName("svg")[0].innerHTML = [
      `<g><path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0`,
      `.28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path></g>`
    ].join(" ");
    grok.getElementsByTagName("span")[0].innerText = "リスト";
    grok.ariaLabel = "リスト";
  }
}, 10);
