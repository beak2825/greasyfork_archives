// ==UserScript==
// @name        您访问该网站多少次
// @description   您是否访问过
// @description:en 您是否访问过
// @version       0.3.1
// @description  try to take over the world!
// @author       chancoki
// @include      /.*:.*/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/754467
// @downloadURL https://update.greasyfork.org/scripts/427666/%E6%82%A8%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E7%AB%99%E5%A4%9A%E5%B0%91%E6%AC%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/427666/%E6%82%A8%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E7%AB%99%E5%A4%9A%E5%B0%91%E6%AC%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const body = document.body;
  const div = document.createElement("div");
  const p = document.createElement("p");
  body.appendChild(div);
  body.appendChild(p);
  div.className = "aView1";
  p.innerHTML = `
  <style>
  .aView1 {
    display: none;
    width: 220px;
    height: 40px;
    border-radius: 20px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    box-shadow: 0 0 10px #aaa;
    font-weight: bolder;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: saturate(180%) blur(20px);
    position: fixed;
    left: 50%;
    top: -65px;
    transform: translate(-50%, 0);
    z-index: 3000;
    color: #222;
    user-select: none;
    animation: run 10s;
  }

  .aView1 div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .aView1 div img {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }

  @keyframes run {

    0%,
    100% {
      top: -65px;
      opacity: .3;
    }

    20%,
    80% {
      top: 75px;
      opacity: 1;
    }
  }
  }

  .history {
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
  }

  .history li {
    width: 135px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: saturate(180%) blur(20px);
    box-shadow: 0 0 3px #bbb;
    border-radius: 5px;
    margin-bottom: 2px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
  }

  .history li span {
    font-size: 12px;
    line-height: 20px;
  }

  .history li button {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    text-align: center;
    padding: 0;
    outline: none;
    font-size: 12px;
    border: none;
    background-color: #fff;
    color: #bbb;
    box-shadow: 0 0 3px #bbb;
    line-height: 14px;
    transition: all .6s;
  }

  .history li button:hover {
    background-color: red;
    color: #fff;
  }
</style>

<div class="setting" style="
      position: fixed;
      top: 75px;
      left: 5px;
      z-index:3000;
      display: none;
      ">
  <ul class="history">
  </ul>
</div>
`;
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const m = date.getMinutes();
  const history = document.querySelector(".history");
  const setting = document.querySelector(".setting");
  let storage = JSON.parse(window.localStorage.getItem("myview")) ? JSON.parse(window.localStorage.getItem("myview")) : [];
  const item = Object.keys(localStorage).filter((item) =>/(\d\d?-\d\d? \d\d?:\d\d? (访问)?备份)|(myseen)/.test(item));
  let hLi = "";
  for (let i of item) hLi += `<li><span>${i}</span><button data-name='${i}'  title='删除记录'>X</button></li>`;
  history.innerHTML = hLi;
  const bf = item.filter((i) => JSON.parse(window.localStorage.getItem(i)).some((i) => i.url == location.pathname));
  const beifen = JSON.parse(window.localStorage.getItem(bf[0]))? JSON.parse(window.localStorage.getItem(bf[0])) : [];
  if (
    storage.some((item) => item.url == location.pathname) ||
    beifen.some((item) => item.url == location.pathname)
  ) {
    let tmp = storage.filter((item) => item.url == location.pathname);
    if (tmp.length <= 0) {
      tmp = beifen.filter((item) => item.url == location.pathname);
      beifen[beifen.indexOf(tmp[0])].record = (beifen[beifen.indexOf(tmp[0])].record || 1) + 1;
      aView("您已访问 " + beifen[beifen.indexOf(tmp[0])].record + " 次该网站");
      window.localStorage.setItem(bf[0], JSON.stringify(beifen));
    } else {
      storage[storage.indexOf(tmp[0])].record =
        (storage[storage.indexOf(tmp[0])].record || 2) + 1;
      aView(
        "您已访问 " + storage[storage.indexOf(tmp[0])].record + " 次该网站"
      );
    }
  } else {
    const time = `${month}-${day} ${hour}:${m}`;
    if (storage.length >= 100) {
      window.localStorage.setItem(time + " 访问备份", JSON.stringify(storage));
      storage = [];
    }
    storage.push({
      url: location.pathname,
      title: document.title,
      time,
      record: 1,
    });
    aView("已经加入访问记录");
  }
  window.localStorage.setItem("myview", JSON.stringify(storage));

  function aView(flag) {
    if (/已删除/.test(flag)) {
      div.style.display = "block";
      div.innerHTML = `<div><img src='${
        window.location.protocol + "//" + window.location.host + "/favicon.ico"
      }'class = 'img'/><span>${flag}</span></div>`;
      const img = document.querySelector(".img");
      img.onerror = () => {
        img.style.display = "none";
      };
    } else {
      setTimeout(() => {
        div.style.display = "block";
        div.innerHTML = `<div><img src='${
          window.location.protocol +
          "//" +
          window.location.host +
          "/favicon.ico"
        }'class = 'img'/><span>${flag}</span></div>`;
        const img = document.querySelector(".img");
        img.onerror = () => {
          img.style.display = "none";
        };
      }, 3500);
    }
    setTimeout(() => {
      div.style.display = "none";
    }, 13500);
  }
  div.addEventListener("click", () => {
    div.style.display = "none";
  });

  let isOpen = true;
  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 79) {
      if (isOpen) {
        setting.style.display = "block";
      } else {
        setting.style.display = "none";
      }
      isOpen = !isOpen;
    }
  });
  history.addEventListener("click", (e) => {
    if (e.target.nodeName == "BUTTON") {
      window.localStorage.removeItem(e.target.dataset.name);
      const item = Object.keys(localStorage).filter((item) =>
        /(\d\d?-\d\d? \d\d?:\d\d? (访问)?备份)|(myseen)/.test(item)
      );
      let hLi = "";
      for (let i of item) hLi += `<li><span>${i}</span><button data-name='${i}'>X</button></li>`;
      history.innerHTML = hLi;
      aView("已删除 " + e.target.dataset.name);
    }
  });
  // Your code here...
})();
