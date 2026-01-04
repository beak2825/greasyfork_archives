// ==UserScript==
// @name         FF14 鱼糕增强插件
// @namespace    ffxiv-yugao-buffer-plugin
// @version      1.1.3
// @author       毛呆
// @description  为鱼糕网页版增加自动标记已完成的功能。
// @license      MIT
// @match        https://fish.ffmomola.com/*
// @downloadURL https://update.greasyfork.org/scripts/473716/FF14%20%E9%B1%BC%E7%B3%95%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473716/FF14%20%E9%B1%BC%E7%B3%95%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function() {
    let href = decodeURIComponent(location.href);
    let wsUrl = /[\?&]OVERLAY_WS=([^&]+)/.exec(href);
    let ws = null;
    let queue = [];
    let rseqCounter = 0;
    let responsePromises = {};
    let subscribers = {};
    let sendMessage = null;
    let eventsStarted = false;
    if (!wsUrl) {
      wsUrl = [
        "?OVERLAY_WS=ws://127.0.0.1:10501/ws",
        "ws://127.0.0.1:10501/ws"
      ];
    }
    if (wsUrl) {
      let connectWs2 = function() {
        ws = new WebSocket(wsUrl[1]);
        ws.addEventListener("error", (e) => {
          console.error(e);
        });
        ws.addEventListener("open", () => {
          console.log("Connected!");
          processEvent({ type: "open" });
          let q = queue;
          queue = null;
          for (let msg of q)
            sendMessage(msg);
        });
        ws.addEventListener("message", (msg) => {
          try {
            msg = JSON.parse(msg.data);
          } catch (e) {
            console.error("Invalid message received: ", msg);
            return;
          }
          if (msg.rseq !== void 0 && responsePromises[msg.rseq]) {
            responsePromises[msg.rseq](msg);
            delete responsePromises[msg.rseq];
          } else {
            processEvent(msg);
          }
        });
        ws.addEventListener("close", () => {
          processEvent({ type: "close" });
          queue = [];
          console.log("Trying to reconnect...");
          setTimeout(() => {
            connectWs2();
          }, 300);
        });
      };
      sendMessage = (obj) => {
        if (queue)
          queue.push(obj);
        else
          ws.send(JSON.stringify(obj));
      };
      connectWs2();
    } else {
      let waitForApi2 = function() {
        if (!window.OverlayPluginApi || !window.OverlayPluginApi.ready) {
          setTimeout(waitForApi2, 300);
          return;
        }
        let q = queue;
        queue = null;
        window.__OverlayCallback = processEvent;
        for (let [msg, resolve] of q)
          sendMessage(msg, resolve);
      };
      sendMessage = (obj, cb) => {
        if (queue)
          queue.push([obj, cb]);
        else
          OverlayPluginApi.callHandler(JSON.stringify(obj), cb);
      };
      waitForApi2();
    }
    function processEvent(msg) {
      if (subscribers[msg.type]) {
        for (let sub of subscribers[msg.type])
          sub(msg);
      }
    }
    window.dispatchOverlayEvent = processEvent;
    window.addOverlayListener = (event, cb) => {
      if (eventsStarted && subscribers[event]) {
        console.warn(`A new listener for ${event} has been registered after event transmission has already begun.
Some events might have been missed and no cached values will be transmitted.
Please register your listeners before calling startOverlayEvents().`);
      }
      if (!subscribers[event]) {
        subscribers[event] = [];
      }
      subscribers[event].push(cb);
    };
    window.removeOverlayListener = (event, cb) => {
      if (subscribers[event]) {
        let list = subscribers[event];
        let pos = list.indexOf(cb);
        if (pos > -1)
          list.splice(pos, 1);
      }
    };
    window.callOverlayHandler = (msg) => {
      let p;
      if (ws) {
        msg.rseq = rseqCounter++;
        p = new Promise((resolve) => {
          responsePromises[msg.rseq] = resolve;
        });
        sendMessage(msg);
      } else {
        p = new Promise((resolve) => {
          sendMessage(msg, (data) => {
            resolve(data == null ? null : JSON.parse(data));
          });
        });
      }
      return p;
    };
    window.startOverlayEvents = () => {
      eventsStarted = false;
      sendMessage({
        call: "subscribe",
        events: Object.keys(subscribers)
      });
    };
  })();
  let tagRef;
  window.addOverlayListener("open", () => {
    if (tagRef)
      return;
    const contentRef = document.querySelector(".v-toolbar__content");
    const titleRef = document.querySelector(".v-toolbar__title");
    tagRef = document.createElement("div");
    contentRef.insertBefore(tagRef, titleRef.nextElementSibling);
    tagRef.innerHTML = `
  <span class="v-badge v-badge--inline theme--dark">
    <span class="v-badge__wrapper">
      <span
        role="status"
        class="v-badge__badge primary"
        >ACT 已连接</span
      >
    </span>
  </span>
  `;
  });
  window.addOverlayListener("close", () => {
    if (!tagRef)
      return;
    const contentRef = document.querySelector(".v-toolbar__content");
    contentRef.removeChild(tagRef);
    tagRef = void 0;
  });
  function insertAchieveCheckbox({ store: store2, fishMap: fishMap2 }) {
    const achieveMap = {
      愿者上钩: [],
      净界太公: [],
      太公仙路: [],
      晓月太公: []
    };
    store2.state.bigFish.forEach((id) => {
      const fish2 = fishMap2.get(id);
      if (!fish2) {
        console.debug("[Log 未找到鱼王]", id);
        return;
      }
      if (fish2.patch < 5) {
        achieveMap["愿者上钩"].push(id);
        achieveMap["太公仙路"].push(id);
      }
      if (fish2.patch >= 5 && fish2.patch < 6) {
        achieveMap["净界太公"].push(id);
        achieveMap["太公仙路"].push(id);
      }
      if (fish2.patch >= 6 && fish2.patch < 7) {
        achieveMap["晓月太公"].push(id);
      }
    });
    Array.from(document.querySelectorAll(".v-subheader")).forEach((el) => {
      const title = el.innerText.trim();
      if (!(title in achieveMap))
        return;
      const button = document.createElement("button");
      el.appendChild(button);
      button.innerHTML = "标记为已获得";
      button.title = "将该成就下所有鱼王标记为已获得";
      button.style.border = "1px solid #979797";
      button.style.borderRadius = "4px";
      button.style.background = "rgba(128, 128, 128, 0.5)";
      button.style.marginLeft = "20px";
      button.style.padding = "0 4px";
      button.addEventListener("click", () => {
        store2.commit("batchSetFishCompleted", {
          fishIds: achieveMap[title],
          completed: true
        });
      });
    });
  }
  function getInstance() {
    const app = document.getElementById("app");
    return app.__vue__;
  }
  function getStore() {
    const instance = getInstance();
    return instance.$store;
  }
  window.addOverlayListener("LogLine", onLogLine);
  window.startOverlayEvents();
  const store = getStore();
  const fish = store.state.fish;
  const fishNameToIdMap = /* @__PURE__ */ new Map();
  const fishMap = /* @__PURE__ */ new Map();
  Object.keys(fish).forEach((id) => {
    const name = store.getters.getItemName(id);
    if (name) {
      const _id = Number(id.length > 6 ? id.slice(-6) : id);
      fishNameToIdMap.set(name, _id);
      fishMap.set(_id, fish[id]);
    }
  });
  const fishReg = /(.+?)??（(.+?)星寸）。$/;
  function onLogLine(data) {
    const { type, line, rawLine } = data;
    if (type !== "LogLine")
      return;
    if (!Array.isArray(line))
      return;
    const [logType, timestamp, code, name, message] = line;
    if (logType !== "00")
      return;
    if (name)
      return;
    if (code !== "0843")
      return;
    const match = message.match(fishReg);
    if (!match) {
      return;
    }
    const [, fishName] = match;
    console.log(`成功钓上了 ${fishName}`);
    const id = fishNameToIdMap.get(fishName);
    if (!id) {
      return;
    }
    store.commit("setFishCompleted", {
      fishId: id,
      completed: true
    });
  }
  let achieveTimer;
  getInstance().$watch(
    "$route.path",
    function(path) {
      if (path === "/wiki") {
        let whileFind2 = function() {
          if (achieveTimer)
            clearTimeout(achieveTimer);
          const el = Array.from(document.querySelectorAll(".v-subheader")).find(
            (el2) => el2.innerText.trim() === "专研钓鱼笔记"
          );
          if (el) {
            insertAchieveCheckbox({ store, fishMap });
          } else {
            achieveTimer = setTimeout(whileFind2, 1e3);
          }
        };
        whileFind2();
      } else {
        if (achieveTimer)
          clearTimeout(achieveTimer);
      }
    },
    {
      immediate: true
    }
  );

})();
