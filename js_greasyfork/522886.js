// ==UserScript==
 
// @name              JavDB Filter
// @name:zh-CN        JavDB 过滤插件
 
// @description       JavDB 过滤插件，用于过滤不感兴趣的标签、演员等
 
// @namespace         https://sleazyfork.org/users/263018
// @version           1.1.1
// @author            snyssss
// @license           MIT
 
// @match             https://javdb.com/*
// @include           /^https:\/\/(\w*\.)?javdb(\d)*\.com.*$/
// @icon              https://javdb.com/favicon-32x32.png
// @grant             none

// @downloadURL https://update.greasyfork.org/scripts/522886/JavDB%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/522886/JavDB%20Filter.meta.js
// ==/UserScript==

// https://cdn.jsdelivr.net/npm/idb@8/build/umd.js
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).idb={})}(this,(function(e){"use strict";const t=(e,t)=>t.some((t=>e instanceof t));let n,r;const o=new WeakMap,s=new WeakMap,i=new WeakMap;let a={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return o.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return f(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function c(e){a=e(a)}function u(e){return(r||(r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(l(this),t),f(this.request)}:function(...t){return f(e.apply(l(this),t))}}function d(e){return"function"==typeof e?u(e):(e instanceof IDBTransaction&&function(e){if(o.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)}));o.set(e,t)}(e),t(e,n||(n=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,a):e)}function f(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(f(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)}));return i.set(t,e),t}(e);if(s.has(e))return s.get(e);const t=d(e);return t!==e&&(s.set(e,t),i.set(t,e)),t}const l=e=>i.get(e);const p=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],I=new Map;function y(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(I.get(t))return I.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=D.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!p.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let i=s.store;return r&&(i=i.index(t.shift())),(await Promise.all([i[n](...t),o&&s.done]))[0]};return I.set(t,s),s}c((e=>({...e,get:(t,n,r)=>y(t,n)||e.get(t,n,r),has:(t,n)=>!!y(t,n)||e.has(t,n)})));const B=["continue","continuePrimaryKey","advance"],b={},g=new WeakMap,v=new WeakMap,h={get(e,t){if(!B.includes(t))return e[t];let n=b[t];return n||(n=b[t]=function(...e){g.set(this,v.get(this)[t](...e))}),n}};async function*m(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;const n=new Proxy(t,h);for(v.set(n,t),i.set(n,l(t));t;)yield n,t=await(g.get(n)||t.continue()),g.delete(n)}function w(e,n){return n===Symbol.asyncIterator&&t(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===n&&t(e,[IDBIndex,IDBObjectStore])}c((e=>({...e,get:(t,n,r)=>w(t,n)?m:e.get(t,n,r),has:(t,n)=>w(t,n)||e.has(t,n)}))),e.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(e=>t(e.oldVersion,e))),f(n).then((()=>{}))},e.openDB=function(e,t,{blocked:n,upgrade:r,blocking:o,terminated:s}={}){const i=indexedDB.open(e,t),a=f(i);return r&&i.addEventListener("upgradeneeded",(e=>{r(f(i.result),e.oldVersion,e.newVersion,f(i.transaction),e)})),n&&i.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),a.then((e=>{s&&e.addEventListener("close",(()=>s())),o&&e.addEventListener("versionchange",(e=>o(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),a},e.unwrap=l,e.wrap=f}));

(async () => {
  // 初始化 idb
  const db = await idb.openDB("JavDB-Filter", 1, {
    upgrade(db) {
      db.createObjectStore("videos", {
        keyPath: "id",
      });
      db.createObjectStore("idPrefixs", {
        keyPath: "value",
      });
      db.createObjectStore("directors", {
        keyPath: "value",
      });
      db.createObjectStore("makers", {
        keyPath: "value",
      });
      db.createObjectStore("series", {
        keyPath: "value",
      });
      db.createObjectStore("tags", {
        keyPath: "value",
      });
      db.createObjectStore("actors", {
        keyPath: "value",
      });
    },
  }); // 超时时间

  const expiry = 24 * 60 * 60 * 1000; // 获取当前页面的 URL

  const url = window.location.href; // 检查 URL 是否为详情页

  const isDetailPage = url.startsWith("https://javdb.com/v/"); // 检查是否包含屏蔽项

  const isBlocked = async (type, value) => {
    if (value) {
      const data = await db.get(type, value);

      return data !== undefined;
    }

    return false;
  }; // 提取当前页面数据

  const getInfo = (doc) => {
    const info = doc.querySelector(".movie-panel-info");

    if (info === null) {
      return null;
    }

    const links = [...info.querySelectorAll("A")];

    const idPrefix = links
      .filter((link) => link.href.includes("/video_codes"))
      .map((link) => link.href.match(/(\w+)(\?f=\w+)?$/)[1]);

    const director = links
      .filter((link) => link.href.includes("/directors"))
      .map((link) => link.href.match(/(\w+)(\?f=\w+)?$/)[1]);

    const maker = links
      .filter((link) => link.href.includes("/makers"))
      .map((link) => link.href.match(/(\w+)(\?f=\w+)?$/)[1]);

    const series = links
      .filter((link) => link.href.includes("/series"))
      .map((link) => link.href.match(/(\w+)(\?f=\w+)?$/)[1]);

    const tags = links
      .filter((link) => link.href.includes("/tags"))
      .map((link) => link.href.match(/c\d=\d+/)[0]);

    const actors = links
      .filter((link) => link.href.includes("/actors"))
      .map((link) => link.href.match(/\w+$/)[0]);

    return {
      idPrefix: idPrefix.length > 0 ? idPrefix[0] : null,
      director: director.length > 0 ? director[0] : null,
      maker: maker.length > 0 ? maker[0] : null,
      series: series.length > 0 ? series[0] : null,
      tags,
      actors,
    };
  }; // 绑定事件

  const bindEvents = (doc) => {
    const info = doc.querySelector(".movie-panel-info");

    if (info === null) {
      return null;
    }

    const links = [...info.querySelectorAll("A")];

    const bindEvent = (element, type, value) => {
      let timer = null;

      const check = async () => {
        const result = await isBlocked(type, value);

        if (result) {
          element.style.color = "red";
        } else {
          element.style.removeProperty("color");
        }

        return result;
      };

      element.addEventListener("mousedown", () => {
        timer = setTimeout(async () => {
          const isBlocked = await check();

          if (isBlocked) {
            await db.delete(type, value);
          } else {
            await db.put(type, { value });
          }

          await check();

          timer = null;
        }, 1000);
      });

      element.addEventListener("mouseup", () => {
        if (timer === null) {
          return;
        }

        clearTimeout(timer);

        window.location.href = element.href;
      });

      element.addEventListener("click", (e) => {
        e.preventDefault();
      });

      check();
    };

    links
      .filter((link) => link.href.includes("/video_codes"))
      .forEach((link) => {
        const value = link.href.match(/(\w+)(\?f=\w+)?$/)[1];

        bindEvent(link, "idPrefixs", value);
      });

    links
      .filter((link) => link.href.includes("/directors"))
      .forEach((link) => {
        const value = link.href.match(/(\w+)(\?f=\w+)?$/)[1];

        bindEvent(link, "directors", value);
      });

    links
      .filter((link) => link.href.includes("/makers"))
      .forEach((link) => {
        const value = link.href.match(/(\w+)(\?f=\w+)?$/)[1];

        bindEvent(link, "makers", value);
      });

    links
      .filter((link) => link.href.includes("/series"))
      .forEach((link) => {
        const value = link.href.match(/(\w+)(\?f=\w+)?$/)[1];

        bindEvent(link, "series", value);
      });

    links
      .filter((link) => link.href.includes("/tags"))
      .forEach((link) => {
        const value = link.href.match(/c\d=\d+/)[0];

        bindEvent(link, "tags", value);
      });

    links
      .filter((link) => link.href.includes("/actors"))
      .forEach((link) => {
        const value = link.href.match(/\w+$/)[0];

        bindEvent(link, "actors", value);
      });
  }; // 非详情页的情况下，尝试过滤列表

  if (isDetailPage === false) {
    // 列表容器
    const list = document.querySelector(".movie-list"); // 过滤函数

    const filter = (() => {
      let isRunning = false;

      const queue = [];

      const getIsBlocked = async (data) => {
        const items = [
          () => isBlocked("idPrefixs", data.idPrefix),
          () => isBlocked("directors", data.directors),
          () => isBlocked("makers", data.maker),
          () => isBlocked("series", data.series),
          ...data.tags.map((tag) => () => isBlocked("tags", tag)),
          ...data.actors.map((actor) => () => isBlocked("actors", actor)),
        ];

        for (const fn of items) {
          if (await fn()) {
            return true;
          }
        }

        return false;
      };

      const dequeue = async () => {
        if (isRunning) {
          return;
        }

        if (queue.length === 0) {
          return;
        }

        isRunning = true;

        await queue.shift()();

        isRunning = false;

        dequeue();
      };

      const run = async () => {
        // 查找列表下所有视频
        const items = list.querySelectorAll(".item"); // 过滤视频

        for (const item of items) {
          // 获取链接、标题
          const { href, title } = item.querySelector("A"); // 获取番号

          const id = item.querySelector("STRONG").textContent; // 过滤

          const check = async (data) => {
            const items = [
              () => isBlocked("idPrefixs", data.idPrefix),
              () => isBlocked("directors", data.directors),
              () => isBlocked("makers", data.maker),
              () => isBlocked("series", data.series),
              ...data.tags.map((tag) => () => isBlocked("tags", tag)),
              ...data.actors.map((actor) => () => isBlocked("actors", actor)),
            ];

            for (const fn of items) {
              if (await fn()) {
                item.remove();
                break;
              }
            }
          }; // 从缓存中查找

          const data = await db.get("videos", id); // 有缓存，直接过滤

          if (data) {
            await check(data); // 缓存没有过期，无需更新

            if (Date.now() - data.timestamp < expiry) {
              continue;
            }
          }

          // 请求后过滤
          const task = () =>
            new Promise(async (resolve) => {
              // 从缓存中查找
              const cache = await db.get("videos", id);

              // 有缓存且没有过期，返回结果
              if (cache && Date.now() - cache.timestamp < expiry) {
                resolve(cache);
                return;
              }

              // 请求数据
              const response = await fetch(href);

              const parser = new DOMParser();

              const responseText = await response.text();

              const doc = parser.parseFromString(responseText, "text/html");

              const info = getInfo(doc);

              if (info === null) {
                // 防止爬虫检测
                await new Promise((resolve) => setTimeout(resolve, 1600));

                resolve();
                return;
              }

              const result = {
                id,
                title: title.trim(),
                timestamp: Date.now(),
                ...info,
              };

              await db.put("videos", result);
              await new Promise((resolve) => setTimeout(resolve, 160));

              resolve(result);
            }).then((data) => {
              if (data) {
                return check(data);
              }
            }); // 加入任务队列

          queue.push(task);
        } // 执行队列

        dequeue();
      };

      return run;
    })(); // 有列表的情况下，开始过滤

    if (list) {
      const observer = new MutationObserver(filter);

      observer.observe(list, {
        childList: true,
      });

      filter();
    }
    return;
  } // 详情页的情况下，获取数据

  const info = getInfo(document);

  if (info === null) {
    return;
  } // 获取番号

  const id = document.querySelector(".title > STRONG").textContent.trim();
  const title = document.querySelector(".title > .current-title").textContent; // 更新缓存

  await db.put("videos", {
    id,
    title: title.trim(),
    timestamp: Date.now(),
    ...info,
  }); // 绑定事件

  bindEvents(document);
})();
