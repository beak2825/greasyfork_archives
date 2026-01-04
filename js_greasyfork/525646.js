// ==UserScript==
// @name        humanity.org
// @namespace   Violentmonkey Scripts
// @match       https://testnet.humanity.org/dashboard*
// @grant       none
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @version     1.2
// @author      DSperson
// @description 2024/10/15 下午9:02:54
// @downloadURL https://update.greasyfork.org/scripts/525646/humanityorg.user.js
// @updateURL https://update.greasyfork.org/scripts/525646/humanityorg.meta.js
// ==/UserScript==
console.log("开始加载");

function gotod() {
  const element1 = document.querySelector("#app > div > div:nth-child(2) > div > div.logged-in > div.rewards > div.table > div.bottom");
  if (element1.className !== "bottom disable") {
    element1.click();
    console.log("点击一次");
  }
  else {
    console.log("等待中");
  }

  setTimeout(() => {
    const element2 = document.querySelector("#app > div > div:nth-child(2) > div > div.logged-in > div.rewards > div.popup > div > div.skip")
    if (element2 !== null) {
      element2.click();
    }
    const elements3 = document.querySelector("#app > div > div:nth-child(2) > div > div.popup > div > div.skip")
    if (elements3 !== null) {
      elements3.click();
    }
  }, 15 * 1000);
}


const countdown = setInterval(() => {
  gotod();
}, 60 * 1000 * 10); // 每秒更新一次

const hhhhh = setInterval(() =>{
  const needrefresh = document.querySelector("#app > div > div:nth-child(2) > div > div.logged-in > div.rewards > div.table > div.tiem > div.text")
  if (needrefresh !== null) {
    const refersh_text = needrefresh.textContent;
    const gh = incrementAndSave()
    if (refersh_text === "00:00:00") {
      location.reload();
    }
  }
}, 60 *1000 * 60)

setTimeout(() => {
  gotod();
  const gh = incrementAndSave()
  const gh2 = incrementAndSave()
  console.log(gh2)
}, 15 * 1000);
