// ==UserScript==
// @name NT动漫追番书签
// @version 1.0.1
// @description 记录NT动漫播放记录，动画更新时标记出上次播放到第几集
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_deleteValue
// @match *://www.ntdm9.com/*
// @namespace https://greasyfork.org/users/1356095
// @downloadURL https://update.greasyfork.org/scripts/504655/NT%E5%8A%A8%E6%BC%AB%E8%BF%BD%E7%95%AA%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504655/NT%E5%8A%A8%E6%BC%AB%E8%BF%BD%E7%95%AA%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==
(function () {
  main();
  GM_registerMenuCommand("清空记录", reset);
})();

function main() {
  let path = location.pathname;
  if (path == "/") {
      renderList();
  }
  if (path.includes("/video/")) {
      renderVideo();
  }
  if (path.includes("/play/")) {
      doLog();
  }
}

function renderList() {
  document.querySelector("#root").setAttribute("style", "width: 1121px");
  document
      .querySelector("#container > div.div_right.baseblock")
      .setAttribute("style", "width: 400px");
  Array.from(document.querySelectorAll(".one_new_anime")).forEach(($n) => {
      let $t = $n.querySelector(".one_new_anime_name");
      let link = $t.getAttribute("href");
      let id = link.replace(/.*\/(\d+)\..*/, "$1");
      let obj = GM_getValue(id, { last: 0 });
      if (obj.last) {
          let text = $n.querySelector(".one_new_anime_ji").innerText;
          let isNew = false;

          if (text == "完结") {
              if (obj.isFinish) {
                  isNew = obj.last < obj.max;
              } else {
                  isNew = true;
              }
          } else if (
              parseInt(text.replace(/[^\d]/g, "")) > parseInt(obj.last)
          ) {
              isNew = true;
          }
          let $s = document.createElement("span");
          $s.innerText = `[${obj.last}/${obj.max}]`;
          $s.style =
              " display: inline-block; overflow: hidden; " +
              (isNew ? "color: #fe0101;" : "");
          $t.after($s);
      }
  });
}
function renderVideo() {
  let id = location.pathname.replace(/.*\/(\d+)\..*/, "$1");
  let obj = GM_getValue(id, { last: 0 });
  if (obj.last) {
      let list = Array.from(document.querySelectorAll("#content a"));
      for (let i = 0; i < list.length; i++) {
          if (list[i].getAttribute("href") == obj.lastLink) {
              list[i].innerText = `>>${list[i].innerText}<<`;
              break;
          }
      }
  }
}
function doLog() {
  let [id, , current] = location.pathname
      .replace(/.*\/([\d\-]+)\..*/, "$1")
      .split("-");
  let obj = GM_getValue(id, { last: 0 });
  let [, , max] = Array.from(document.querySelectorAll("#content a"))
      .pop()
      .getAttribute("href")
      .replace(/.*\/([\d\-]+)\..*/, "$1")
      .split("-");
  if (+current > obj.last) {
      obj.last = current;
      obj.lastLink = location.pathname;
      obj.isFinish = document
          .querySelector("#play_imform")
          .innerHTML.includes("完结");
      obj.max = max;
      GM_setValue(id, obj);
  }
}

function reset() {
  GM_listValues().forEach((k) => GM_deleteValue(k));
  window.location.reload()
}
