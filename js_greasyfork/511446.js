// ==UserScript==
// @name         Bangumi跳转Comicat资源下载
// @namespace    https://gitee.com/mirrors406
// @version      2025.01.04
// @description  适用于www.bangumi.app，点击Bangumi番剧名称跳转Comicat搜索资源
// @author       Mirrors406
// @match        https://www.bangumi.app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511446/Bangumi%E8%B7%B3%E8%BD%ACComicat%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/511446/Bangumi%E8%B7%B3%E8%BD%ACComicat%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const intervalTime = 1000;
  const comicatSearch = "https://www.comicat.org/search.php?keyword=";
  const nameAlias = {
    不时用俄语小声说真心话的邻桌艾莉同学: "邻座艾莉同学",
  };

  let timer = null;
  let listLength = 0;

  const classNames = {
    list: "grid grid-cols-1 justify-items-center gap-12 px-12 xl:grid-cols-2 min-[1800px]:grid-cols-3 min-[2400px]:grid-cols-4",
    item: "group flex w-[30rem] select-none overflow-hidden rounded-2xl bg-neutral-2 ring-1 ring-neutral-6 h-[200px]",
    name: "truncate text-xl font-bold text-neutral-12",
  };

  function bindTorrnetLink(items) {
    const nameArr = [];

    for (let i = 0; i < items.length; i++) {
      const names = items[i].getElementsByClassName(classNames.name);
      const nameEle = names[0];
      const name = nameEle.innerText;
      const _name = replaceAnimateName(name);
      nameEle.innerHTML = `<a class="rounded-md px-2 hover:bg-neutral-4" target="_blank" href="${comicatSearch}${_name}" title="${name}">${name}</a>`;
      nameArr.push(name);
    }

    console.log(nameArr);
  }

  function intervalGetList() {
    timer = null;
    listLength = 0;

    timer = setInterval(() => {
      const lists = document.getElementsByClassName(classNames.list);
      if (lists[0]) {
        const items = lists[0].getElementsByClassName(classNames.item);
        if (items.length === listLength) return;
        listLength = items.length;
        bindTorrnetLink(items);
      }
    }, intervalTime);
  }

  function replaceAnimateName(name) {
    return nameAlias[name] ? nameAlias[name] : name;
  }

  // 监听 pushState, replaceState
  const _rewrite = function (type) {
    const origin = history[type];
    return function () {
      const newHistory = origin.apply(this, arguments);
      const e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return newHistory;
    };
  };
  history.pushState = _rewrite("pushState");
  history.replaceState = _rewrite("replaceState");

  window.addEventListener("replaceState", function (e) {
    intervalGetList();
  });
  window.addEventListener("pushState", function (e) {
    intervalGetList();
  });
})();
