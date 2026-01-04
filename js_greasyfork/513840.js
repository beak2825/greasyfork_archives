// ==UserScript==
// @name         首页视频推荐 fetch hijack
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  funny 墨索李妮
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513840/%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%20fetch%20hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/513840/%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%20fetch%20hijack.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const oFetch = window.fetch;
  async function myFetch () {
    let [url,init] = arguments;
    let [api,search] = url.split("?");
    let searchObj = new URLSearchParams(search);
    if (api.includes("top/feed")) {
      searchObj.set("ps", 11);
      url = `${api}?${searchObj.toString()}`
    }

    try {
      const res = await oFetch(url,init);
      let myRes = res;
      if (url.includes('top/feed')) { // 推荐流
        const json = await res.json();
        const { item } = json.data;
        const myItem = item.filter(el => {
          return !!el.id //鉴定为没有id的是广告
        })
        myRes = new Response(JSON.stringify({
          ...json,
          data: {
            ...json.data,
            item: myItem
          }
        }), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })
      } else if (url.includes("xlive/web-interface")) {
        // 狗屎直播
        let json = await res.json();
        myRes = new Response(JSON.stringify({
          ...json,
          data: {
            ...json.data,
            recommend_room_list: []
          }
        }), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })
      } else if (url.includes("pgc/web/variety/feed")) {
        // 综艺
        let json = await res.json();
        myRes = new Response(JSON.stringify({
          ...json,
          data: {
            ...json.data,
            list: []
          }
        }), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })
        return new Promise(r => r(myRes))

      }
      return new Promise(r => r(myRes))


    } catch (err) {
      console.log(err);
      return oFetch(url,init)
    }

  }
  window.fetch = myFetch;


  // funny ssr 首屏广告
  window.addEventListener('load', () => {
    let cards = document.querySelectorAll('.feed-card')
    cards.forEach(el => {
      let href = el.querySelector('.bili-video-card__image--link')?.href;
      if (!href
        || href.includes('cm.bilibili.com')
      ) { // 过滤广告
        el.remove()
      }
    })
  })
})()