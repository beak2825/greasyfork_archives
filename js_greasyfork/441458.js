// ==UserScript==
// @name        qb-fix-bilibili
// @version     0.0.29
// @description inQ_Beta wants to fix some of bilibili problem
// @license     Apache-2.0
// @author      inQ_Beta
// @match       https://*.bilibili.com/*
// @grant       GM_addStyle
// @grant       GM_notification
// @grant       unsafeWindow
// @namespace no1xsyzy
// @downloadURL https://update.greasyfork.org/scripts/441458/qb-fix-bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/441458/qb-fix-bilibili.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function trace(description, center) {
    return center;
  }
  const $ = (x) => document.querySelector(x);
  function betterSelector(parentNode2, selector2) {
    const className = /^\.([\w_-]+)$/.exec(selector2);
    if (className) {
      return {
        select: () => trace(`betterSelector("${selector2}").select#class`, parentNode2.getElementsByClassName(className[1])[0]),
        selectAll: () => trace(
          `betterSelector("${selector2}").selectAll#class`,
          Array.from(parentNode2.getElementsByClassName(className[1]))
        )
      };
    }
    const elementID = /^#([\w_-]+)$/.exec(selector2);
    if (elementID) {
      return {
        select: () => trace(`betterSelector("${selector2}").select#id=${elementID[1]}`, document.getElementById(elementID[1])),
        selectAll: () => trace(`betterSelector("${selector2}").selectAll#id=${elementID[1]}`, [
          document.getElementById(elementID[1])
        ])
      };
    }
    const tagName = /^([\w_-]+)$/.exec(selector2);
    if (tagName) {
      return {
        select: () => trace(`betterSelector("${selector2}").select#tag`, parentNode2.getElementsByTagName(tagName[1])[0]),
        selectAll: () => trace(
          `betterSelector("${selector2}").selectAll#tag`,
          Array.from(parentNode2.getElementsByTagName(tagName[1]))
        )
      };
    }
    return {
      select: () => trace(`betterSelector("${selector2}").select#qs`, parentNode2.querySelector(selector2)),
      selectAll: () => trace(`betterSelector("${selector2}").selectAll#qs`, Array.from(parentNode2.querySelectorAll(selector2)))
    };
  }
  function selectAncestor(childNode, selector2) {
    let p = childNode;
    while (p != null && !p.matches(selector2)) {
      p = p.parentElement;
    }
    return p;
  }
  function launchObserver({
    parentNode: parentNode2,
    selector: selector2,
    failCallback = null,
    successCallback = null,
    stopWhenSuccess = true,
    config = {
      childList: true,
      subtree: true
    }
  }) {
    if (!parentNode2) {
      parentNode2 = document;
    }
    const { select, selectAll } = betterSelector(parentNode2, selector2);
    let _connected = false;
    const off = () => {
      if (_connected) {
        observer.takeRecords();
        observer.disconnect();
        _connected = false;
      }
    };
    const on = () => {
      if (!_connected) {
        observer.observe(parentNode2, config);
        _connected = true;
      }
    };
    const connected = () => _connected;
    const reroot = (newParentNode) => {
      parentNode2 = newParentNode;
    };
    const wrapped = { on, off, connected, reroot };
    const observeFunc = (mutationList) => {
      const selected = select();
      if (!selected) {
        if (failCallback) {
          failCallback({ ...wrapped, mutationList });
        }
        return;
      }
      if (stopWhenSuccess) {
        off();
      }
      if (successCallback) {
        const maybePromise = successCallback({
          ...wrapped,
          selected,
          selectAll,
          mutationList
        });
        if (maybePromise instanceof Promise) {
          maybePromise.then(() => {
          });
        }
      }
    };
    const observer = new MutationObserver(observeFunc);
    on();
    return wrapped;
  }
  function attrChange({
    node,
    attributeFilter,
    callback,
    once = true
  }) {
    let _connected = false;
    let _resolve;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    const wrapped = {
      on() {
        if (_connected)
          return;
        _connected = true;
        observer.observe(node, { attributeFilter, attributeOldValue: true });
      },
      off() {
        if (!_connected)
          return;
        _connected = false;
        observer.disconnect();
      },
      connected() {
        return _connected;
      },
      reroot(x) {
        if (_connected) {
          wrapped.off();
          node = x;
          wrapped.on();
        } else {
          node = x;
        }
      },
      then(onfulfill, onrejected) {
        return promise.then(onfulfill, onrejected);
      }
    };
    const observer = new MutationObserver((mutationList) => {
      if (once) {
        wrapped.off();
      }
      callback(mutationList, wrapped);
      _resolve(mutationList[0].attributeName);
    });
    wrapped.on();
    return wrapped;
  }
  function elementEmerge(selector2, parentNode2, subtree = true) {
    const g = betterSelector(parentNode2 ?? document, selector2).select();
    if (g)
      return Promise.resolve(g);
    return new Promise((resolve) => {
      launchObserver({
        parentNode: parentNode2,
        selector: selector2,
        successCallback: ({ selected }) => {
          resolve(selected);
        },
        config: { subtree, childList: true }
      });
    });
  }
  const waitAppBodyMount = async function() {
    const appBody = betterSelector(document, `.app-body`).select();
    if (!appBody) {
      throw new Error("activity page");
    }
    await new Promise((resolve) => {
      launchObserver({
        parentNode: appBody,
        selector: `#sections-vm`,
        successCallback: ({ selected }) => {
          resolve(null);
        },
        config: { childList: true }
      });
    });
    return appBody;
  }();
  async function 关注栏尺寸() {
    GM_addStyle(`
  .section-content-cntr{height:calc(100vh - 250px)!important;}
  .follow-cntr{height:calc(100vh - 150px)!important;}
  .follow-cntr>.anchor-list{height:auto!important;}
  .follow-cntr>.anchor-list>.three-anchor{height:auto!important;}
  .side-bar-popup-cntr {bottom: 120px !important;height: calc( 100% - 240px ) !important;}
  `);
    const sidebarVM = await (async () => {
      if (location.pathname === "/") {
        return betterSelector(document, `.flying-vm`).select();
      } else if (location.pathname === "/p/eden/area-tags") {
        return betterSelector(document, `#area-tags`).select();
      } else if (/^(?:\/blanc)?\/(\d+)$/.exec(location.pathname)) {
        const appBody = await waitAppBodyMount;
        return betterSelector(appBody, `#sidebar-vm`).select();
      }
    })();
    const sidebarPopup = await elementEmerge(`.side-bar-popup-cntr`, sidebarVM);
    launchObserver({
      parentNode: sidebarPopup,
      selector: `*`,
      successCallback: ({ mutationList }) => {
        if (sidebarPopup.style.height !== "0px") {
          sidebarPopup.style.bottom = "75px";
          sidebarPopup.style.height = "calc(100vh - 150px)";
        }
        setTimeout(() => $(`.side-bar-popup-cntr.ts-dot-4 .ps`)?.dispatchEvent(new Event("scroll")), 2e3);
      },
      stopWhenSuccess: false,
      config: {
        attributes: true,
        attributeFilter: ["class"]
      }
    });
  }
  const followersTextClass = (followers) => {
    if (followers > 1e6) {
      return [`${Math.round(followers / 1e5) / 10}m★`, "followers-m"];
    } else if (followers > 1e3) {
      return [`${Math.round(followers / 100) / 10}k★`, "followers-k"];
    } else {
      return [`${followers}★`, "followers-1"];
    }
  };
  function defaultCacheStorageFactory(id) {
    let store = [];
    const get = (key) => store.filter(([k, t, v]) => k === key).map(([k, t, v]) => [t, v])[0] ?? [0, void 0];
    const set = (key, time, value) => {
      const i = store.findIndex(([k, t, v]) => k === key);
      if (i === -1) {
        store.push([key, time, value]);
      } else {
        store[i] = [key, time, value];
      }
    };
    const cleanup = (ttl, now) => {
      store = store.filter(([k, t]) => t + ttl > now);
    };
    return { get, set, cleanup };
  }
  function timedLRU(func, {
    id,
    version = 1,
    ttl = 10 * 60 * 1e3,
    cleanupInterval = 60 * 1e3,
    cacheStorageFactory = defaultCacheStorageFactory
  }) {
    const cacheStorage = cacheStorageFactory(id, version);
    let timeout = null;
    const cleanup = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      cacheStorage.cleanup(ttl, (/* @__PURE__ */ new Date()).getTime());
      timeout = setTimeout(cleanup, cleanupInterval);
    };
    setTimeout(cleanup, cleanupInterval / 10);
    const wrapped = async (k) => {
      const t = (/* @__PURE__ */ new Date()).getTime();
      let [_, v] = cacheStorage.get(k);
      if (v === void 0) {
        v = await func(k);
      }
      cacheStorage.set(k, t, v);
      return v;
    };
    wrapped.cleanup = cleanup;
    return wrapped;
  }
  function localStorageCacheStorageFactory(id, version) {
    const get = (key) => JSON.parse(localStorage.getItem(`cacheStore__${id}__${version}__${key}`)) ?? [0, void 0];
    const set = (key, time, value) => {
      localStorage.setItem(`cacheStore__${id}__${version}__${key}`, JSON.stringify([time, value]));
    };
    const cleanup = (ttl, now) => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k.startsWith(`cacheStore__${id}__`)) {
          continue;
        }
        if (!k.startsWith(`cacheStore__${id}__${version}__`))
          ;
        const [t, _] = JSON.parse(localStorage.getItem(k));
        if (t + ttl < now) {
          localStorage.removeItem(k);
        }
      }
    };
    return { get, set, cleanup };
  }
  const getCard = timedLRU(
    async (uid) => {
      const json = await (await fetch(`https://api.bilibili.com/x/web-interface/card?mid=${uid}`, {
        // credentials: 'include',
        headers: {
          Accept: "application/json"
        },
        method: "GET",
        mode: "cors"
      })).json();
      if (json.code !== 0) {
        throw json.message;
      }
      const {
        data: {
          card: { fans, sex }
        }
      } = json;
      return { fans, gender: sex };
    },
    {
      id: "getCard",
      version: 2,
      ttl: 86400 * 1e3,
      cacheStorageFactory: localStorageCacheStorageFactory
    }
  );
  const getFansCount = async (uid) => {
    return (await getCard(uid)).fans;
  };
  const getSexTag = async (uid) => {
    const { gender } = await getCard(uid);
    switch (gender) {
      case "男":
        return "♂";
      case "女":
        return "♀";
      default:
        return "〼";
    }
  };
  const getInfoByRoom = timedLRU(
    async (roomid) => {
      const json = await (await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomid}`, {
        // credentials: 'include',
        headers: {
          Accept: "application/json"
        },
        method: "GET",
        mode: "cors"
      })).json();
      if (json.code !== 0) {
        throw json.message;
      }
      const followers = json.data.anchor_info.relation_info.attention;
      return { followers };
    },
    {
      id: "getInfoByRoom",
      version: 2,
      ttl: 86400 * 1e3,
      cacheStorageFactory: localStorageCacheStorageFactory
    }
  );
  const getRoomFollowers = async (roomid) => {
    return (await getInfoByRoom(roomid)).followers;
  };
  async function* getDynamicFeed({
    timezone = -480,
    type = "all"
  }) {
    let page = 1;
    let json = await (await fetch(
      `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=${timezone}&type=${type}&page=${page}`,
      {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET",
        mode: "cors"
      }
    )).json();
    if (json.code === 0) {
      for (const item of json.data.items) {
        yield item;
      }
    } else {
      throw json.message;
    }
    while (json.data.has_more) {
      page += 1;
      json = await (await fetch(
        `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=${timezone}&type=${type}&offset=${json.data.offset}&page=${page}`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          method: "GET",
          mode: "cors"
        }
      )).json();
      if (json.code === 0) {
        for (const item of json.data.items) {
          yield item;
        }
      } else {
        throw json.message;
      }
    }
  }
  function compareDynamicID(a, b) {
    if (a === b)
      return 0;
    if (a.length < b.length)
      return -1;
    if (a.length > b.length)
      return 1;
    if (a < b)
      return -1;
    if (a > b)
      return 1;
  }
  function recordDynamicFeed(spec) {
    const registry = [];
    const gen = getDynamicFeed(spec);
    const extend = async (n = 1) => {
      for (let i = 0; i < n; i++) {
        let v;
        try {
          v = (await gen.next()).value;
        } catch (err) {
        }
        if (v) {
          registry.push(v);
        } else {
          return false;
        }
      }
      return true;
    };
    const getByIndex = async (i) => {
      while (registry.length < i) {
        if (!await extend())
          break;
      }
      if (registry.length > i) {
        return registry[i];
      }
    };
    const lastVisibleDynamic = () => {
      for (let i = registry.length - 1; i >= 0; i--) {
        if (registry[i].visible) {
          return registry[i];
        }
      }
      return null;
    };
    const getByDynamicID = async (did) => {
      if (!registry.length && !await extend()) {
        return null;
      }
      do {
        if (registry[registry.length - 1].id_str === did) {
          return registry[registry.length - 1];
        }
        if (compareDynamicID(lastVisibleDynamic().id_str, did) < 0) {
          for (const dyn of registry) {
            if (dyn.id_str === did) {
              return dyn;
            }
          }
          return null;
        }
      } while (await extend());
    };
    const getByBVID = async (bvid) => {
      if (spec.type === "article") {
        return null;
      }
      for (const dyn of registry) {
        if (dyn.modules.module_dynamic.major.archive.bvid === bvid) {
          return dyn;
        }
      }
      do {
        if (lastVisibleDynamic()?.modules.module_dynamic.major.archive.bvid === bvid) {
          return lastVisibleDynamic();
        }
      } while (await extend());
      return null;
    };
    return { getByIndex, getByDynamicID, getByBVID };
  }
  const CARDCLS$1 = "Item_1EohdhbR";
  const NAMECLS = "Item_QAOnosoB";
  const parentNode$2 = $(`#area-tag-list`);
  const selector$3 = `.${CARDCLS$1}`;
  GM_addStyle(`
.${NAMECLS}.processed::after {
  content: attr(data-followers);
}

.${NAMECLS}.processed.followers-m {
  color: purple !important;
}

.${NAMECLS}.processed.followers-k {
  color: grey !important;
}

.${NAMECLS}.processed.followers-1 {
  color: red !important;
}
`);
  function 分区添加粉丝数() {
    launchObserver({
      parentNode: parentNode$2,
      selector: selector$3,
      successCallback: ({ selectAll }) => {
        for (const card of selectAll()) {
          (async () => {
            const nametag = card.querySelector(`.${NAMECLS}`);
            if (nametag.classList.contains("processed")) {
              return;
            }
            const followers = await getRoomFollowers(card.pathname.slice(1));
            const [txt, cls] = followersTextClass(followers);
            nametag.dataset.followers = txt;
            nametag.title = txt;
            nametag.classList.add("processed");
            nametag.classList.add(cls);
          })();
        }
      },
      stopWhenSuccess: false
    });
  }
  const CARDCLS = "Item_1EohdhbR";
  const TITLECLS = "Item_2GEmdhg6";
  const parentNode$1 = $(`#area-tag-list`);
  const selector$2 = `.${CARDCLS}`;
  function 分区卡片直播间标题指向() {
    launchObserver({
      parentNode: parentNode$1,
      selector: selector$2,
      successCallback: ({ selectAll }) => {
        for (const card of selectAll()) {
          (async () => {
            const titletag = card.querySelector(`.${TITLECLS}`);
            titletag.title = titletag.textContent.trim();
          })();
        }
      },
      stopWhenSuccess: false
    });
  }
  function 分区() {
    关注栏尺寸();
    分区添加粉丝数();
    分区卡片直播间标题指向();
  }
  function liveStatus() {
    const livePlayer = betterSelector(document, `#live-player`).select();
    const video = betterSelector(livePlayer, `video`).select();
    if (typeof video === "undefined") {
      return "⏹️";
    } else {
      return "▶️";
    }
  }
  const liveTitle = () => betterSelector(document, `.live-title`).select().innerText;
  const liveHost = () => betterSelector(document, `.room-owner-username`).select().innerText;
  const makeTitle = () => `${liveStatus()} ${liveTitle()} - ${liveHost()} - 哔哩哔哩直播`;
  const selector$1 = `.live-title`;
  async function 直播间标题() {
    launchObserver({
      parentNode: await elementEmerge(`#head-info-vm .left-header-area`),
      selector: selector$1,
      successCallback: () => {
        document.title = makeTitle();
      },
      stopWhenSuccess: false
    });
    document.title = makeTitle();
  }
  function 通用表情框尺寸修复() {
    GM_addStyle(`
#control-panel-ctnr-box > .border-box.top-left[style^="transform-origin: 249px "],
#control-panel-ctnr-box > .border-box.top-left[style^="transform-origin: 251px "]
{
  height: 500px
}
`);
  }
  const parentNode = betterSelector(document, `#chat-items`).select();
  const selector = `.user-name`;
  GM_addStyle(`
.infoline::before{
  content: attr(data-infoline);
}
.infoline.followers-m::before{
  color: purple;
}
.infoline.followers-k::before{
  color: red;
}
`);
  const append = async (un) => {
    const uid = selectAncestor(un, `.chat-item`).dataset.uid;
    const fans = await getFansCount(uid);
    const [txt, cls] = followersTextClass(fans);
    const sextag = await getSexTag(uid);
    un.dataset.infoline = `${sextag} ${txt} `;
    if (cls !== "")
      un.classList.add(cls);
  };
  function 直播间留言者显示粉丝数() {
    launchObserver({
      parentNode,
      selector,
      successCallback: ({ selectAll }) => {
        for (const un of selectAll()) {
          if (!un.classList.contains("infoline")) {
            un.classList.add("infoline");
            append(un);
          }
        }
      },
      stopWhenSuccess: false
    });
  }
  async function 自动刷新崩溃直播间() {
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    const player = betterSelector(document, `#live-player`).select();
    const video = elementEmerge(`video`, player, false).then((x) => void 0);
    const endingPanel = elementEmerge(`.web-player-ending-panel`, player, false).then(
      (x) => void 0
    );
    const errorPanel = elementEmerge(`.web-player-error-panel`, player, false).then((x) => void 0);
    const last = await Promise.race([video, endingPanel, errorPanel]);
    if (last.tagName === "VIDEO")
      ;
    else if (last.classList.contains("web-player-error-panel")) {
      location.reload();
    }
  }
  function define(name, defaultValue) {
    const v = localStorage.getItem(name);
    if (v === null) {
      localStorage.setItem(name, JSON.stringify(defaultValue));
    }
    return {
      get() {
        return localStorage.getItem(name);
      },
      set(v2) {
        return localStorage.setItem(name, JSON.stringify(v2));
      }
    };
  }
  const oldFetch = unsafeWindow.fetch;
  const middlewares = [];
  unsafeWindow.fetch = function(input, init = {}) {
    const request = new Request(input, init);
    return processFetchWithMiddlewares(middlewares)(request);
  };
  const processFetchWithMiddlewares = function(middlewares2) {
    if (middlewares2.length === 0) {
      return oldFetch;
    }
    const [head, ...tail] = middlewares2;
    const next = processFetchWithMiddlewares(tail);
    switch (head.type) {
      case "before":
        return (input) => next(head.func(input));
      case "after":
        return (input) => head.func(next(input));
      case "wrap":
        return (input) => head.func(next, input);
    }
  };
  function hijack(m) {
    middlewares.push(m);
  }
  const MCDN_RE = /[xy0-9]+\.mcdn\.bilivideo\.cn:\d+/;
  const QUALITY_SUFFIX_RE = /(\d+)_(?:minihevc|prohevc|bluray)/g;
  const disableMcdn = define("disableMcdn", true);
  let forceHighestQuality = true;
  let recentErrors = 0;
  setInterval(() => {
    if (recentErrors > 0) {
      recentErrors /= 2;
    }
  }, 1e4);
  function healthChecker(promise) {
    promise.then((response) => {
      if (!response.url.match(/\.(m3u8|m4s)/))
        return;
      if (response.status >= 400 && response.status < 500) {
        recentErrors++;
        if (recentErrors >= 5 && forceHighestQuality) {
          forceHighestQuality = false;
          GM_notification({
            title: "qb-fix-bilibili",
            text: "真原画可能不可用，取消强制",
            timeout: 3e3,
            silent: true
          });
        }
      }
    });
  }
  function 真原画() {
    hijack({
      type: "wrap",
      func: async (fetch2, req) => {
        try {
          if (MCDN_RE.test(req.url) && disableMcdn.get()) {
            return Promise.reject(new Error());
          }
          if (QUALITY_SUFFIX_RE.test(req.url) && forceHighestQuality) {
            req = new Request(req.url.replace(QUALITY_SUFFIX_RE, "$1"), req);
          }
          const url = req.url;
          const promise = fetch2(req);
          healthChecker(promise);
          return promise;
        } catch (e) {
        }
        return fetch2(req);
      }
    });
  }
  function 避免被判定为不可见() {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: false
    });
  }
  function 直播间底部卡片悬浮标题() {
    GM_addStyle(`
.item_box .item_description .user_des .title[data-v-2e86094d]:hover {
  overflow: visible;
  z-index: 10;
  width: fit-content;
  background: white;
  border-color: black;
}

.item_box .item_description .user_des .title[data-v-2e86094d] {
  position: relative;
  border-radius: 2px;
  border: transparent 1px solid;
}

.card-box .card-list .card-item[data-v-14260fc2]:has(.title:hover),
.item_box .item_description[data-v-2e86094d]:has(.title:hover),
.item_box .item_description .user_des[data-v-2e86094d]:has(.title:hover) {
  overflow: visible;
}

.item_box .item_cover[data-v-2e86094d] {
  border-radius: 8px 8px 0 0;
}

.item_box .item_description[data-v-2e86094d]:has(.title:hover) {
  
  border-radius:  0 0 8px 8px;
}

`);
  }
  function 直播间() {
    关注栏尺寸();
    直播间标题();
    直播间留言者显示粉丝数();
    通用表情框尺寸修复();
    自动刷新崩溃直播间();
    真原画();
    避免被判定为不可见();
    直播间底部卡片悬浮标题();
  }
  function 直播主页() {
    关注栏尺寸();
  }
  async function 分离视频类型() {
    GM_addStyle(`
  .qfb__subselect_list {display: none;}

  .bili-dyn-list-tabs__item.active:nth-child(2) ~ .qfb__subselect_list {
    display: flex;
  }

  #qfb_upload, #qfb_live_replay {
    display: none;
  }

  #qfb_upload:not(:checked) ~ .bili-dyn-list-tabs .qfb_upload::before {content:"☐"}
  #qfb_upload:checked ~ .bili-dyn-list-tabs .qfb_upload::before {content:"☑"}
  #qfb_upload:not(:checked) ~ .bili-dyn-list .qfb_upload {
    display: none;
  }

  #qfb_live_replay:not(:checked) ~ .bili-dyn-list-tabs .qfb_live_replay::before {content:"☐"}
  #qfb_live_replay:checked ~ .bili-dyn-list-tabs .qfb_live_replay::before {content:"☑"}
  #qfb_live_replay:not(:checked) ~ .bili-dyn-list .qfb_live_replay {
    display: none;
  }
  `);
    const listTabs = await elementEmerge(`.bili-dyn-list-tabs`);
    const cmbUpload = document.createElement("input");
    cmbUpload.setAttribute("type", "checkbox");
    cmbUpload.setAttribute("id", "qfb_upload");
    cmbUpload.checked = true;
    listTabs.before(cmbUpload);
    const cmbLiveReplay = document.createElement("input");
    cmbLiveReplay.setAttribute("type", "checkbox");
    cmbLiveReplay.setAttribute("id", "qfb_live_replay");
    cmbLiveReplay.checked = true;
    listTabs.before(cmbLiveReplay);
    const listTabsUpload = await elementEmerge(`.bili-dyn-list-tabs__item:nth-child(2)`, listTabs);
    const subSelect = document.createElement("div");
    subSelect.classList.add("bili-dyn-list-tabs");
    subSelect.classList.add("qfb__subselect_list");
    subSelect.innerHTML = `
  <div class="bili-dyn-list-tabs__list">
    <label class="bili-dyn-list-tabs__item qfb_upload" for="qfb_upload">
      投稿视频
    </label>
    <label class="bili-dyn-list-tabs__item qfb_live_replay" for="qfb_live_replay">
      直播回放
    </label>
  </div>
  `;
    listTabs.after(subSelect);
    attrChange({
      node: listTabsUpload,
      attributeFilter: ["class"],
      callback: () => {
        if (listTabsUpload.classList.contains("active")) {
          subSelect.style.display = "flex";
        } else {
          subSelect.style.display = "none";
        }
      },
      once: false
    });
    listTabs.addEventListener("click", (e) => {
      listTabsUpload.classList.contains("");
      if (e.target === listTabsUpload) {
        subSelect.style.display = "flex";
      } else {
        subSelect.style.display = "none";
      }
    });
    const dynList = await elementEmerge(`.bili-dyn-list__items`);
    launchObserver({
      parentNode: dynList,
      selector: `.bili-dyn-list__item`,
      successCallback: ({ selectAll }) => {
        for (const div of selectAll()) {
          if (div.classList.contains("processed"))
            continue;
          const type = div.getElementsByClassName(`bili-dyn-card-video__badge`)[0]?.textContent.trim();
          switch (type) {
            case "直播回放":
              div.classList.add("qfb_live_replay");
              break;
            case "合作视频":
            case "投稿视频":
              div.classList.add("qfb_upload");
              break;
          }
          div.classList.add("processed");
        }
      },
      config: {
        childList: true
      }
    });
  }
  async function 动态首页联合投稿具名() {
    const record = recordDynamicFeed({ type: "video" });
    launchObserver({
      parentNode: document.body,
      selector: `.bili-dyn-item`,
      successCallback: async ({ selectAll }) => {
        for (const dynItem of selectAll()) {
          if (dynItem.dataset.qfb_expanded_did === "processing") {
            return;
          }
          if (dynItem.dataset.qfb_expanded_did && !dynItem.querySelector(`.bili-dyn-item-fold`)) {
            dynItem.dataset.qfb_expanded_did = "processing";
            const dyn = await record.getByDynamicID(dynItem.querySelector(`.bili-dyn-card-video`).getAttribute("dyn-id"));
            const timediv = dynItem.querySelector(`.bili-dyn-time`);
            timediv.innerHTML = `${dyn.modules.module_author.pub_time} · ${dyn.modules.module_author.pub_action}`;
            delete dynItem.dataset.qfb_expanded_did;
          } else if (!dynItem.dataset.qfb_expanded_did && dynItem.querySelector(`.bili-dyn-item-fold`)) {
            dynItem.dataset.qfb_expanded_did = "processing";
            const dyn = await record.getByDynamicID(dynItem.querySelector(`.bili-dyn-card-video`).getAttribute("dyn-id"));
            const timediv = dynItem.querySelector(`.bili-dyn-time`);
            if (!dyn.modules.module_fold)
              return;
            const description = (await Promise.all(dyn.modules.module_fold.ids.map((did) => record.getByDynamicID(did)))).map((dyn2) => `<a href="${dyn2.modules.module_author.jump_url}">${dyn2.modules.module_author.name}</a>`).join(`、`);
            timediv.innerHTML = `${dyn.modules.module_author.pub_time} · 与${description}联合创作`;
            dynItem.dataset.qfb_expanded_did = dyn.id_str;
          }
        }
      },
      stopWhenSuccess: false
    });
  }
  function 动态页面() {
    动态首页联合投稿具名();
    分离视频类型();
  }
  async function 单条动态页面$1() {
    const dyn = await elementEmerge(`.bili-rich-text`, document);
    const uname = $(`.bili-dyn-title>span`).textContent.trim();
    const dtime = $(`.bili-dyn-time`).textContent.trim();
    const dcont = dyn.textContent.trim();
    const ddisp = dcont.length > 23 ? dcont.slice(0, 20) + "..." : dcont;
    document.title = `${uname} 于 ${dtime} 说道：『${ddisp}』-哔哩哔哩`;
  }
  async function opus$1() {
    const uname = $(`.opus-module-author__name`).textContent.trim();
    const dtime = $(`.opus-module-author__pub__text`).textContent.trim();
    const dcont = $(`.opus-module-content`).textContent.trim();
    const ddisp = dcont.length > 23 ? dcont.slice(0, 20) + "..." : dcont;
    document.title = `${uname} 于 ${dtime} 说道：『${ddisp}』-哔哩哔哩`;
  }
  function 单条动态页面() {
    单条动态页面$1();
  }
  function opus() {
    opus$1();
  }
  async function 排序粉丝勋章() {
    const list = await elementEmerge(`.medalList .list`);
    Array.from(list.children).sort(
      (a, b) => betterSelector(b, ".btn").selectAll().length - betterSelector(a, ".btn").selectAll().length || betterSelector(b, ".living").selectAll().length - betterSelector(a, ".living").selectAll().length || +betterSelector(b, ".m-medal__fans-medal-level").select().textContent - +betterSelector(a, ".m-medal__fans-medal-level").select().textContent
    ).forEach((node) => list.appendChild(node));
  }
  function 粉丝勋章页() {
    排序粉丝勋章();
  }
  function 专栏可以复制() {
    $(".article-container").addEventListener("copy", (e) => e.stopImmediatePropagation(), true);
  }
  function 专栏() {
    专栏可以复制();
  }
  let patched = false;
  const patchers = [];
  function monkeypatch4ReplaceState() {
    if (patched) {
      return;
    }
    patched = true;
    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, unused, url) {
      let pre = [state, unused, url];
      for (const patcher of patchers) {
        pre = patcher(pre);
      }
      originalReplaceState.call(history, ...pre);
    };
  }
  function patchReplaceState(patcher) {
    monkeypatch4ReplaceState();
    patchers.unshift(patcher);
  }
  function makeRegExpFromSearchKey(s) {
    if (typeof s === "string") {
      return new RegExp(`(?<=[?&])(?<key>${s})=(?<value>[^&]+)(?<trailing>&?)`, "g");
    }
    return new RegExp(`(?<=[?&])(?<key>${s.join("|")})=(?<value>[^&]+)(?<trailing>&?)`, "g");
  }
  function 拒绝URL垃圾参数() {
    patchReplaceState(([state, title, url]) => {
      if (url === void 0) {
        return [state, title, url];
      }
      if (typeof url === "string") {
        url = new URL(url, location.href);
      }
      url.search = url.search.replace(makeRegExpFromSearchKey(["vd_source"]), "").replace(/^\?$/, "");
      return [state, title, url];
    });
  }
  function 视频页() {
    拒绝URL垃圾参数();
  }
  if (location.host === "live.bilibili.com") {
    if (location.pathname === "/") {
      直播主页();
    } else if (location.pathname === "/p/eden/area-tags") {
      分区();
    } else if (location.pathname === "/p/html/live-fansmedal-wall/") {
      粉丝勋章页();
    } else if (/^(?:\/blanc)?\/(\d+)$/.exec(location.pathname) && $(`.app-body`)) {
      直播间();
    } else
      ;
  } else if (location.host === "space.bilibili.com")
    ;
  else if (location.host === "t.bilibili.com") {
    if (/\/\d+/.exec(location.pathname)) {
      单条动态页面();
    } else {
      动态页面();
    }
  } else if (location.host === "www.bilibili.com") {
    if (/^\/opus\//.exec(location.pathname)) {
      opus();
    } else if (location.pathname.startsWith("/read/cv")) {
      专栏();
    } else if (location.pathname.startsWith("/video/")) {
      视频页();
    }
  } else
    ;
})();
