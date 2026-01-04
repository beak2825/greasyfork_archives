// ==UserScript==
// @name         一键清空微博
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键清空微博，直接调用接口
// @author       Marvin
// @match        https://weibo.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460138/%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/460138/%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const token = getCookie("XSRF-TOKEN");
  const uid = location.pathname.slice(3);
  if (token && uid) {
    console.log("TOKEN: " + token);
  }

  function del(id) {
    fetch("https://weibo.com/ajax/statuses/destroy", {
      headers: {
        "content-type": "application/json;charset=UTF-8",

        "x-xsrf-token": token,
      },
      body: '{"id":"' + id + '"}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
  }

  async function getList() {
    return await fetch("https://weibo.com/ajax/statuses/mymblog?uid=" + uid + "&feature=0", {})
      .then((res) => res.json())
      .then((d) => {
        return d.data.list.map((d) => d.id);
      });
  }

  async function run() {
    const list = await getList();
    if (!list.length || list.length == 0) return;

    for (let i of list) {
      await del(i);
    }
    run();
  }

  window.run = run;
})();
