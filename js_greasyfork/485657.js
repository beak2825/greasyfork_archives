// ==UserScript==
// @name         DevCore Auto Up
// @namespace    https://devcore.fun/
// @version      1.0
// @description  -
// @author       -
// @match        https://devcore.fun/*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=devcore.fun
// @downloadURL https://update.greasyfork.org/scripts/485657/DevCore%20Auto%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/485657/DevCore%20Auto%20Up.meta.js
// ==/UserScript==

const _xfToken = document.querySelector('input[name="_xfToken"]').value;
const threads = [
  "https://devcore.fun/threads/795/",
  "https://devcore.fun/threads/796/", // Ссылки на темы, которые необходимо поднимать. Ссылка должна заканчиваться на /
];

const time = 0.02; // Интервал между поднятиями в часах (Зависит от вашей группы https://devcore.fun/threads/264/)
const limit = 10; // Максимальное количество поднимаемых тем (Зависит от вашей группы https://devcore.fun/threads/264/)

function bumpThread(threadUrl) {
  const bumpUrl = `${threadUrl}bump?&_xfToken=${_xfToken}&_xfResponseType=json`;
  fetch(bumpUrl, { method: "GET", credentials: "include" }).then((response) => {
    if (response.ok) {
      XF.flashMessage(`Тема ${threadUrl} была поднята`, 1500);
      const threadData = GM_getValue("threadData", {});
      threadData[threadUrl].lastBump = Date.now();
      GM_setValue("threadData", threadData);
    } else {
      console.error(`Ошибка при поднятии темы ${threadUrl}`);
    }
  });
}

function bumpThreadWithDelay(threadUrl, delay) {
  setTimeout(() => {
    bumpThread(threadUrl);
  }, delay);
}

function addThreadToList(threadUrl) {
  const threadData = GM_getValue("threadData", {});
  if (!threadData[threadUrl]) {
    if (Object.keys(threadData).length < limit) {
      const expirationDate = Date.now() + 1000 * 60 * 60 * 24 * 3;
      threadData[threadUrl] = { lastBump: 0, expires: expirationDate };
      GM_setValue("threadData", threadData);
      XF.flashMessage("Тема была добавлена во временный список", 5000);
    } else {
      XF.flashMessage(
        "Нет свободных слотов. Максимальное число тем - " + limit,
        5000
      );
    }
  } else {
    XF.flashMessage("Тема уже есть в списке поднимаемых.", 4000);
  }
}

function removeThreadFromList(threadUrl) {
  const threadData = GM_getValue("threadData", {});
  if (threadData[threadUrl]) {
    delete threadData[threadUrl];
    GM_setValue("threadData", threadData);
    XF.flashMessage("Тема была удалена из списка", 5000);
    document.location.reload();
  } else {
    XF.flashMessage("Тема нет в списке поднимаемых.", 4000);
  }
}

function shouldBumpThread(threadUrl) {
  const threadData = GM_getValue("threadData", {});
  if (!threadData[threadUrl]) {
    return false;
  }
  const lastBumpTime = threadData[threadUrl].lastBump;
  if (lastBumpTime === 0) {
    return true;
  }
  const elapsedTime = (Date.now() - lastBumpTime) / 1000 / 60 / 60;
  return elapsedTime >= time + 1 / 60;
}

function cleanupThreadData() {
  const threadData = GM_getValue("threadData", {});
  let updated = false;

  for (const threadUrl in threadData) {
    const isNotInThreads = !threads.includes(threadUrl);
    const isExpired = Date.now() > threadData[threadUrl].expires;
    const isPermanent = threadData[threadUrl].expires === 1883631170774;

    if ((isPermanent && isNotInThreads) || isExpired) {
      delete threadData[threadUrl];
      updated = true;
    }
  }

  if (updated) {
    GM_setValue("threadData", threadData);
  }
}

function getTimeLeft(threadUrl) {
  const threadData = GM_getValue("threadData", {});
  const lastBumpTime = threadData[threadUrl]
    ? threadData[threadUrl].lastBump
    : 0;
  const elapsedTime = (Date.now() - lastBumpTime) / 1000 / 60 / 60;
  const timeLeft = time + 1 / 60 - elapsedTime;
  return timeLeft;
}

function addButton() {
  const linkGroup = document.querySelector(".buttonGroup");
  const threadUrl =
    window.location.href.split("?")[0].replace(/\/+$/, "") + "/";
  const threadData = GM_getValue("threadData", {});
  if (linkGroup && !threadData[threadUrl]) {
    const addToListButton = document.createElement("a");
    addToListButton.textContent = "Добавить в список поднимаемых тем";
    addToListButton.classList.add("button--link", "button");
    addToListButton.addEventListener("click", () => {
      addThreadToList(threadUrl);
    });
    const lastChild = linkGroup.lastElementChild;
    linkGroup.insertBefore(addToListButton, lastChild);
  } else if (linkGroup) {
    const addToListButton = document.createElement("a");
    addToListButton.textContent = "Удалить из списка поднимаемых тем";
    addToListButton.classList.add("button--link", "button");
    addToListButton.addEventListener("click", () => {
      removeThreadFromList(threadUrl);
    });
    const lastChild = linkGroup.lastElementChild;
    linkGroup.insertBefore(addToListButton, lastChild);
  }
}

function init() {
  if (window.location.href === "https://devcore.fun/") {
    cleanupThreadData();
    const threadData = GM_getValue("threadData", {});
    const allThreads = Array.from(
      new Set([...threads, ...Object.keys(threadData)])
    );

    let bumpCount = 0;

    for (const threadUrl of allThreads) {
      const isPermanentThread = threads.includes(threadUrl);
      if (isPermanentThread && !threadData[threadUrl]) {
        const expirationDate = 1883631170774;
        threadData[threadUrl] = { lastBump: 0, expires: expirationDate };
        GM_setValue("threadData", threadData);
      }

      if (threadData[threadUrl]) {
        const isExpired = Date.now() > threadData[threadUrl].expires;
        if (!isExpired && shouldBumpThread(threadUrl)) {
          const delay = bumpCount * 5000;
          bumpThreadWithDelay(threadUrl, delay);
          bumpCount++;
        } else {
          const timeLeft = getTimeLeft(threadUrl);
          console.log(
            `Следующее поднятие через ${timeLeft.toFixed(2)} ч. - ${threadUrl}`
          );
        }
      }
    }
  }
}

if (window.location.pathname.startsWith("/threads/")) {
  addButton();
}
init();