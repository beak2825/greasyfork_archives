// ==UserScript==
// @name         自用bilibili脚本
// @namespace    mimiko/bilibili
// @version      0.0.28
// @description  吧啦吧啦
// @author       Mimiko
// @license      MIT
// @match        *://*.bilibili.com/*
// @grant        GM.addStyle
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436748/%E8%87%AA%E7%94%A8bilibili%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436748/%E8%87%AA%E7%94%A8bilibili%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/436748-%E8%87%AA%E7%94%A8bilibili%E8%84%9A%E6%9C%AC
"use strict";
(() => {
  if (window.top !== window.self) return;
  const Utils = {
    addStyle: (listContent, ...listItem) => {
      const content = listContent
        .map((it, i) => `${it}${listItem[i] ?? ""}`)
        .join("");
      GM.addStyle(content);
    },
    debounce: (fn, delay) => {
      let timer = 0;
      return (...args) => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
      };
    },
    echo: (...args) => console.log(...args),
    get: (url, data = {}) =>
      new Promise((resolve) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: `${url}?${new URLSearchParams(
            Object.entries(data).map((group) => [group[0], String(group[1])]),
          ).toString()}`,
          onload: (res) => resolve(JSON.parse(res.responseText).data),
          onerror: () => resolve(undefined),
        });
      }),
    getElements: (selector) =>
      new Promise((resolve) => {
        const fn = () => {
          if (document.hidden) return;
          const $el = document.querySelectorAll(selector);
          if (!$el.length) return;
          window.clearInterval(timer);
          resolve([...$el]);
        };
        const timer = window.setInterval(fn, 50);
        fn();
      }),
    hideElements: (...selectors) => {
      Utils.addStyle`
      ${selectors.map((selector) => `${selector} { display: none !important; }`).join("\n")}
      `;
    },
    load: (name) => {
      try {
        const data = localStorage.getItem(`mimiko-gms/${name}`);
        if (!data) return null;
        return JSON.parse(data);
      } catch (e) {
        alert(`读取缓存失败：${e.message}`);
        return null;
      }
    },
    removeElements: (selector) =>
      document.querySelectorAll(selector).forEach(($it) => $it.remove()),
    run: (fn) => fn(),
    save: (name, data) =>
      localStorage.setItem(`mimiko-gms/${name}`, JSON.stringify(data)),
    sleep: (ts) => new Promise((resolve) => setTimeout(resolve, ts)),
  };
  const Blacklist = {
    list: [],
    clear: () => {
      if (!User.isLogin) return;
      Utils.save("list-blacklist", []);
      Utils.save("time-blacklist", 0);
    },
    has: (name) => Blacklist.list.includes(name),
    load: async () => {
      if (!User.isLogin) return;
      const time = Utils.load("time-blacklist");
      if (!time || Date.now() - time > 864e5) {
        await Blacklist.update();
        return;
      }
      Blacklist.list = Utils.load("list-blacklist") ?? [];
    },
    save: () => {
      if (!User.isLogin) return;
      Utils.save("list-blacklist", Blacklist.list);
      Utils.save("time-blacklist", Date.now());
    },
    update: async () => {
      const PAGE_SIZE = 50;
      const fetchPage = async (pageNum = 0) => {
        if (!User.isLogin) return [];
        const result = await Utils.get(
          "https://api.bilibili.com/x/relation/blacks",
          {
            pn: pageNum,
            ps: PAGE_SIZE,
          },
        );
        if (!result?.list.length) return [];
        const usernames = result.list.map((user) => user.uname);
        if (usernames.length >= PAGE_SIZE)
          return [...usernames, ...(await fetchPage(pageNum + 1))];
        return usernames;
      };
      Blacklist.list = await fetchPage();
      Blacklist.save();
    },
  };
  // LRU cache for video views
  const Cache = {
    LIMIT: 5e4,
    countMap: new Map(),
    accessTimeMap: new Map(),
    init: () => {
      const savedData = Utils.load("cache-recommend") ?? [];
      Cache.countMap.clear();
      Cache.accessTimeMap.clear();
      let baseTime = Date.now() - savedData.length;
      for (const [id, count] of savedData) {
        Cache.countMap.set(id, count);
        Cache.accessTimeMap.set(id, baseTime++);
      }
    },
    add: (id) => {
      const currentCount = Cache.countMap.get(id) ?? 0;
      Cache.countMap.set(id, currentCount + 1);
      Cache.accessTimeMap.set(id, Date.now());
      if (Cache.countMap.size > Cache.LIMIT) {
        let oldestId = "";
        let oldestTime = Infinity;
        for (const [videoId, accessTime] of Cache.accessTimeMap) {
          if (accessTime < oldestTime) {
            oldestTime = accessTime;
            oldestId = videoId;
          }
        }
        if (oldestId) {
          Cache.countMap.delete(oldestId);
          Cache.accessTimeMap.delete(oldestId);
        }
      }
    },
    clear: () => {
      Cache.countMap.clear();
      Cache.accessTimeMap.clear();
      Cache.save();
    },
    get: (id) => [id, Cache.countMap.get(id) ?? 0],
    save: () => {
      const sortedEntries = Array.from(Cache.countMap.entries()).sort(
        (a, b) => {
          const timeA = Cache.accessTimeMap.get(a[0]) ?? 0;
          const timeB = Cache.accessTimeMap.get(b[0]) ?? 0;
          return timeA - timeB;
        },
      );
      Utils.save("cache-recommend", sortedEntries);
    },
  };
  const Router = {
    count: {
      index: 0,
      unknown: 0,
      video: 0,
    },
    handlers: {
      index: [],
      unknown: [],
      video: [],
    },
    currentPath: "",
    init: () => {
      const checkRoute = async () => {
        const { pathname } = window.location;
        if (pathname === Router.currentPath) return;
        Router.currentPath = pathname;
        const currentPage = Utils.run(() => {
          if (Router.is("index")) return "index";
          if (Router.is("video")) return "video";
          return "unknown";
        });
        if (currentPage === "unknown") return;
        const pageHandlers = Router.handlers[currentPage];
        for (const handler of pageHandlers) {
          if (Router.count[currentPage] === 0)
            handler.initResult = await handler.init();
          if (handler.onRoute && typeof handler.onRoute === "function")
            handler.onRoute();
          if (typeof handler.initResult === "function")
            handler.onRoute = await handler.initResult();
        }
        Router.count[currentPage]++;
      };
      window.setInterval(checkRoute, 200);
      return Router;
    },
    is: (pageName) => {
      const { pathname } = window.location;
      if (pageName === "index") return ["/", "/index.html"].includes(pathname);
      if (pageName === "video") return pathname.startsWith("/video/");
      return true;
    },
    watch: (pageName, initFn) => {
      Router.handlers[pageName].push({
        init: initFn,
        initResult: undefined,
        onRoute: null,
      });
      return Router;
    },
  };
  const User = {
    isLogin: false,
    update: async () => {
      const result = await Utils.get(
        "https://api.bilibili.com/x/web-interface/nav",
      );
      if (!result) return;
      User.isLogin = result.isLogin;
    },
  };
  const setupIndex = async () => {
    Utils.addStyle`
    body { min-width: auto; }
    .container:first-child { display: none; }

    .feed-roll-btn button:first-of-type { height: ${Utils.run(() => {
      const picture = document.querySelector(".feed-card picture");
      if (!picture) return 135;
      const { height } = picture.getBoundingClientRect();
      return height;
    })}px !important; }

    .flexible-roll-btn { display: none !important; }

    .feed-card { display: block !important; margin-top: 0 !important; }
    .feed-card.is-hidden { position: relative; }

    .feed-card.is-hidden .bili-video-card {
      transition: opacity 0.3s;
      opacity: 0.1;
    }
    .feed-card.is-hidden .bili-video-card:hover { opacity: 1; }

    .feed-card.is-hidden .reason {
      position: absolute;
      width: 160px;
      height: 32px;
      left: 50%;
      top: 32%;
      text-align: center;
      line-height: 32px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      z-index: 1;
    }
    .feed-card.is-hidden:hover .reason { opacity: 0; }
    `;
    const [container] = await Utils.getElements(".container");
    const newContainer = document.createElement("div");
    container.classList.forEach((className) =>
      newContainer.classList.add(className),
    );
    container.parentNode?.append(newContainer);
    const [buttonGroup] = await Utils.getElements(".feed-roll-btn");
    const clearButton = document.createElement("button");
    clearButton.classList.add("primary-btn", "roll-btn");
    clearButton.innerHTML = "<span>✖</span>";
    clearButton.setAttribute("title", "清空缓存");
    clearButton.addEventListener("click", () => {
      Blacklist.clear();
      Cache.clear();
      alert("缓存已清空");
    });
    clearButton.style.marginTop = "20px";
    buttonGroup.append(clearButton);
    return async () => {
      await User.update();
      await Blacklist.load();
      const handleMutation = () => {
        observer.disconnect();
        const feedItems = [...container.children].filter((item) =>
          item.classList.contains("feed-card"),
        );
        const itemsToShow = [];
        const itemsToHide = [];
        feedItems.forEach((item) => {
          const checkItem = () => {
            const authorElement = item.querySelector(
              ".bili-video-card__info--author",
            );
            const author = authorElement?.textContent ?? "";
            if (!author)
              return {
                hideReason: "UP主不存在",
                viewCount: 0,
              };
            const linkElement = item.querySelector("a");
            if (!linkElement)
              return {
                hideReason: "链接不存在",
                viewCount: 0,
              };
            const statsElement = item.querySelector(
              ".bili-video-card__stats--text",
            );
            const statsText = statsElement?.textContent ?? "";
            if (!statsText)
              return {
                hideReason: "播放量不存在",
                viewCount: 0,
              };
            const viewCount = Utils.run(() => {
              if (statsText.includes("万"))
                return parseFloat(statsText.split("万")[0]) * 1e4;
              const match = statsText.match(/(\d+(?:\.\d+)?)/);
              return match ? parseFloat(match[1]) : 0;
            });
            if (Blacklist.has(author))
              return {
                hideReason: "UP主在黑名单中",
                viewCount,
              };
            if (!statsText.includes("万"))
              return {
                hideReason: "播放量不足1万",
                viewCount,
              };
            if (viewCount < 3e4)
              return {
                hideReason: "播放量不足3万",
                viewCount,
              };
            const infoElement = item.querySelector(
              ".bili-video-card__info--icon-text",
            );
            const videoId = linkElement.href
              .replace(/.*\/BV/, "")
              .replace(/\/\?.*/, "");
            const threshold = infoElement?.textContent === "已关注" ? 2 : 0;
            if (Cache.get(videoId)[1] > threshold) {
              return {
                hideReason: `已出现${Cache.get(videoId)[1]}次`,
                viewCount,
              };
            }
            Cache.add(videoId);
            return {
              hideReason: "",
              viewCount,
            };
          };
          const { hideReason, viewCount } = checkItem();
          const itemData = {
            element: item,
            viewCount,
          };
          if (!hideReason) {
            itemsToShow.push(itemData);
            return;
          }
          if (hideReason.includes("不存在")) return;
          item.classList.add("is-hidden");
          const reasonTip = document.createElement("div");
          reasonTip.classList.add("reason");
          reasonTip.textContent = hideReason;
          item.append(reasonTip);
          itemsToHide.push(itemData);
        });
        itemsToShow.sort((a, b) => b.viewCount - a.viewCount);
        itemsToHide.sort((a, b) => b.viewCount - a.viewCount);
        const fragment = document.createDocumentFragment();
        itemsToShow.forEach(({ element }) => {
          fragment.appendChild(element);
        });
        itemsToHide.forEach(({ element }) => {
          fragment.appendChild(element);
        });
        newContainer.appendChild(fragment);
        Cache.save();
        observer.observe(container, {
          childList: true,
        });
      };
      const observer = new MutationObserver(handleMutation);
      handleMutation();
      return () => observer.disconnect();
    };
  };
  const setupVideo = () => {
    Utils.addStyle`
    .video-share-popover { display: none; }
    `;
    const toggleFullscreen = async () => {
      const [button] = await Utils.getElements(".bpx-player-ctrl-web");
      button.click();
    };
    const toggleWidescreen = async () => {
      const [button] = await Utils.getElements(".bpx-player-ctrl-wide");
      button.click();
    };
    const handleKeydown = (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (["q", "w", "e", "d", "f", "m"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "f") {
        toggleFullscreen();
        return;
      }
      if (e.key === "w") toggleWidescreen();
    };
    return () => {
      document.addEventListener("keydown", handleKeydown);
      return () => {
        document.removeEventListener("keydown", handleKeydown);
      };
    };
  };
  Utils.run(() => {
    if (window.location.hostname !== "www.bilibili.com") return;
    Cache.init();
    Router.watch("index", setupIndex).watch("video", setupVideo).init();
  });
})();
