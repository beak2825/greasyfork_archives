// ==UserScript==
// @name         CC98消息辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CC98消息已读辅助
// @author       You
// @match        https://www.cc98.org/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469915/CC98%E6%B6%88%E6%81%AF%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469915/CC98%E6%B6%88%E6%81%AF%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Your code here...
  //https://api.cc98.org/user/name/用户姓名

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function replaceAfterLastSlash(path) {
    let paths = path.split("/")
    if(paths.length === 4) {
      paths.pop() //有分页的情况
    }
    return paths.join("/")
  }

  function compareTime(a, b) {
    const _a = new Date(a)
    const _b = new Date(b)
    return _a > _b
  }

  const wait = async (done) => {
    while (true) {
      if (done()) {
        await sleep(1000)
      }
      else {
        break;
      }
    }
  }

  const checkRead = async () => {
    let replys = undefined;
    await wait(() => {
      replys = document.querySelectorAll(".reply")
      return replys.length === 0
    })

    const accessToken = localStorage.getItem("accessToken").replace("str-", '')
    const metaUrl = "https://api.cc98.org" + replaceAfterLastSlash(location.pathname)

    fetch(metaUrl, {
      headers: {
        Host: location.host,
        Authorization: accessToken
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        //获取到lz的userName
        return fetch(`https://api.cc98.org/user/name/${responseJson.userName}`)
          .then(response => response.json())
          .then(responseJson => responseJson.lastLogOnTime)
      })
      .then(lastLogOnTime => {
        console.log(666, lastLogOnTime);
        [...replys].forEach(reply => {
          const time = reply.querySelector(".comment1 span").innerHTML.replace("发表于 ", '')
          reply.querySelector("#commentlike").insertAdjacentHTML('beforeend',
            `<div class="operation1" style="padding-left: 5px; padding-right: 5px;width: auto">楼主${compareTime(lastLogOnTime, time) ? '已' : '未'}读</div>`);
        })
      })
  }

  await wait(() => document.querySelector(".pagination") === null)
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("page-link")) {
      await sleep(1000)
      checkRead()
    }
  })
  checkRead()
})();