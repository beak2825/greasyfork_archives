// ==UserScript==
// @name        fnos 论坛助手 签到和消息提醒
// @namespace   fnos club tools
// @match       https://club.fnnas.com/forum.php
// @version     1.0
// @author      liuyun
// @license MIT
// @description 2024/9/30 19:45:54
// @downloadURL https://update.greasyfork.org/scripts/511425/fnos%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%E7%AD%BE%E5%88%B0%E5%92%8C%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/511425/fnos%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%E7%AD%BE%E5%88%B0%E5%92%8C%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
(async () => {
  if (window.innerWidth > 768) {
    return;
  }
  addMsgStyle();
  const msg = document.createElement("a");
  msg.id = "fnos-msg";
  msg.href = "/home.php?mod=space&do=pm";
  msg.style.float = "right";
  msg.style.padding = "16px 10px";
  msg.style.color = "#444444";

  msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"/></svg>`;

  const search = document.getElementsByClassName("search_button")[0];
  search.parentElement.append(msg);

  setTimeout(() => {
    if (document.title.includes("新提醒")) {
      const fnosMsg = document.getElementById("fnos-msg");
      fnosMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h10.1q-.1.5-.1 1t.1 1H4l8 5l3.65-2.275q.35.325.763.563t.862.412L12 13L4 8v10h16V9.9q.575-.125 1.075-.35T22 9v9q0 .825-.587 1.413T20 20zM4 6v12zm15 2q-1.25 0-2.125-.875T16 5t.875-2.125T19 2t2.125.875T22 5t-.875 2.125T19 8"/></svg>`;
      fnosMsg.style.color = "#EAAA7E";
      fnosMsg.classList.add("flash");
    }
  }, 1000);

  const htmlStr = await fetch("/plugin.php?id=zqlj_sign").then((response) =>
    response.text()
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");
  const btn = doc.getElementsByClassName("bm signbtn cl");

  if (btn.length) {
    let item = btn[0];

    if (!item.innerHTML.includes("今日已打卡")) {
      const view = document.createElement("div");
      view.style.fontSize = "18px";
      view.style.position = "fixed";
      view.style.top = 0;
      view.style.zIndex = 9999;
      view.style.width = "100px";
      view.style.left = "50%";
      view.style.marginLeft = "-50px";
      view.style.textAlign = "center";
      view.style.height = "56px";
      view.style.display = "flex";
      view.style.justifyContent = "center";
      view.style.alignItems = "center";
      const a = item.getElementsByClassName("btna");
      if (a.length) {
        const link = a[0];
        link.style.color = "#EAAA7E";
        view.appendChild(link);
        document.body.appendChild(view);
      }
    }
  }
})();

function addMsgStyle(params) {
  var style = document.createElement("style");

  style.innerHTML = `
 .flash {
    animation: flash 2s infinite ease-in-out;
  }

  @keyframes flash {
    10% {
        transform: rotate(15deg)
    }

    20% {
        transform: rotate(-10deg)
    }

    30% {
        transform: rotate(5deg)
    }

    40% {
        transform: rotate(-5deg)
    }

    50% {
        transform: rotate(0deg)
    }
`;

  document.head.appendChild(style);
}
