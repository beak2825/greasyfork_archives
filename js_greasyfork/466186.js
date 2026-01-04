// ==UserScript==
// @name         B站自动开播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  bilibili 自动选择分区开启直播
// @author       Bakapiano
// @match        https://link.bilibili.com/p/center/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466186/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%BC%80%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/466186/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%BC%80%E6%92%AD.meta.js
// ==/UserScript==

var area = "单机游戏"
var cate = "其他单机"
async function f() {
  async function sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  const t = document.querySelector(
    "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.dp-i-block > div.fs-12 > a"
  );
  if (t.innerText === "选择分类") {
    t.click();
    await sleep(1000);
    // document
    //   .querySelector(
    //     "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.dp-i-block > div.link-popup-panel.p-relative.m-auto.a-move-in-top.a-forwards.link-popup > div.popup-content-ctnr > div > ul > li:nth-child(3) > a"
    //   )
    //   .click();
    Array.from(document.querySelectorAll("#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.dp-i-block > div.link-popup-panel.p-relative.m-auto.a-move-in-top.a-forwards.link-popup > div.popup-content-ctnr > div > ul > li"))
    .filter(e => e.innerText === "单机游戏")[0].querySelector("a").click()
    await sleep(1000);
    // document
    //   .querySelector(
    //     "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.dp-i-block > div.link-popup-panel.p-relative.m-auto.a-move-in-top.a-forwards.link-popup > div.popup-content-ctnr > div > div.f-clear.categories-ctnr > div.f-clear.viewport > div > div:nth-child(19) > a:nth-child(2)"
    //   )
    //   .click();
    Array.from(document.querySelectorAll(".category"))
    .filter(e => e.innerText === cate)[0].click()
    await sleep(1000);

    document.querySelector("#category-submit-btn > span").click();
    await sleep(1000);
  }

  document
    .querySelector(
      "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.live-btn-ctnr > button"
    )
    .click();
}
var i = setInterval(() => {
  const close = document.querySelector(
    "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.live-btn-ctnr > button"
  );
  console.log(close)
  if (close.innerText === "关闭直播") return clearInterval(i);
  const start = document.querySelector(
    "#live-center-app > div > main > div > div.my-room.start-live.a-move-in-left > div:nth-child(2) > div > div:nth-child(1) > section > div.section-block.with-radius.with-padding > div.live-btn-ctnr > button"
  );
  console.log(start)
  if (start.innerText === "开始直播") {
    clearInterval(i);
    f();
  }
}, 5000);
