// ==UserScript==
// @name         焰妃排队
// @namespace    http://tampermonkey.net/
// @version      0.0.14
// @description  焰妃直播间排队脚本
// @author       Mimiko
// @license      MIT
// @match        *://live.bilibili.com/22687800*
// @icon         http://i0.hdslb.com/bfs/activity-plat/static/20211202/dddbda27ce6f43bf18f5bca141752a99/fCo7evLooK.webp@128w
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453350/%E7%84%B0%E5%A6%83%E6%8E%92%E9%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/453350/%E7%84%B0%E5%A6%83%E6%8E%92%E9%98%9F.meta.js
// ==/UserScript==
// function

(() => {
  if (window.top !== window.self) return;
  // variable
  const Lines = {
    add_exist: "{name}已经排过队了，序号是{idx}",
    add_success: "{name}已经排队成功，序号是{idx}",
    admin_none: "尚未为排队姬指定饲养员",
    find_none: "{name}还没有排队",
    find_success: "{name}已经排过队了，序号是{idx}",
    server_none: "排队姬尚未启动",
    server_ready: "排队姬已经启动",
    voice_disconnect: "无法连接语音服务器",
    voice_fail: "语音设置失败",
    voice_invalid: "语音名称不存在",
    voice_success: "语音已设置为{name}",
    waiting_cancel: "开车已取消",
    waiting_countdown: "发车倒计时十秒",
    waiting_fail: "未能成功发车",
    waiting_none: "没有人在等车",
    waiting_start: "开车啦，请各位乘客输入自己的序号",
    waiting_success: "请序号为{idx}的{name}使用手机扫码上车",
  };
  // @ts-ignore
  const Monkey = GM;
  const cacheId = new Set();
  const cacheName = new Map();
  const cacheTimer = new Map();
  const delay = 30e3;
  const interval = 30e3;
  const listVoice = [
    "hiumaan",
    "hsiaochen",
    "huihui",
    "kangkang",
    "xiaoxiao",
    "yaoyao",
    "yunyang",
  ];
  const observer = new MutationObserver(() => {
    pick();
    clearDanmaku();
  });
  const port = 9644;
  const setAdmin = new Set();
  const setWaiting = new Set();
  const speaker = new SpeechSynthesisUtterance();
  let isWaiting = false;
  // function
  const add = async (name, id) => {
    if (!validate(name, id)) return;
    const data = await get(`http://localhost:${port}/queue/add?name=${name}`);
    if (!data) return;
    if (!data.status)
      speak(Lines.add_exist, {
        idx: data.idx,
        name,
      });
    else
      speak(Lines.add_success, {
        idx: data.idx,
        name,
      });
  };
  const addTimer = (token, delay, callback) => {
    removeTimer(token);
    cacheTimer.set(token, window.setTimeout(callback, delay));
  };
  const cancelWaiting = () => {
    if (!isWaiting) return;
    isWaiting = false;
    setWaiting.clear();
    removeTimer("waiting/countdown");
    removeTimer("waiting/speak");
    speak(Lines.waiting_cancel);
  };
  const clearDanmaku = () => {
    const $el = document.getElementById("chat-items");
    if (!$el) return;
    $el.innerHTML = "";
  };
  const endWaiting = () => {
    if (!isWaiting) return;
    isWaiting = false;
    if (!setWaiting.size) {
      speak(Lines.waiting_none);
      return;
    }
    const idx = Math.min(...setWaiting);
    setWaiting.clear();
    setCurrent(idx);
  };
  const find = async (name, id) => {
    if (!validate(name, id)) return;
    const data = await get(`http://localhost:${port}/queue/find?name=${name}`);
    if (!data) return;
    if (!data.idx)
      speak(Lines.find_none, {
        name,
      });
    else
      speak(Lines.find_success, {
        idx: data.idx,
        name,
      });
  };
  const get = (url) =>
    new Promise((resolve) => {
      Monkey.xmlHttpRequest({
        method: "GET",
        onerror: () => resolve(null),
        onload: (response) =>
          resolve(
            url.includes("localhost")
              ? JSON.parse(response.responseText)
              : response.responseText
          ),
        url,
      });
    });
  const getListAdmin = async () => {
    const data = await get(`http://localhost:${port}/admin/list`);
    if (!data) return false;
    if (!data.list.length) {
      speak(Lines.admin_none);
      return false;
    }
    data.list
      .filter((name) => name.trim())
      .forEach((name) => setAdmin.add(name.replace(/\r/g, "")));
    return true;
  };
  const log = (message) => {
    console.log(message);
    return message;
  };
  const main = async () => {
    pauseVideo();
    if (!(await ping())) return;
    if (!(await getListAdmin())) return;
    observe();
    clearDanmaku();
  };
  const observe = () => {
    const timer = window.setInterval(() => {
      const $el = document.getElementById("chat-items");
      if (!$el) return;
      window.clearInterval(timer);
      observer.observe($el, {
        childList: true,
        attributes: true,
        characterData: true,
      });
    }, 50);
  };
  const pauseVideo = () => document.querySelector("video")?.pause();
  const pick = () =>
    Array.from(document.querySelectorAll("#chat-items .danmaku-item")).forEach(
      ($danmaku) => {
        const content = $danmaku.getAttribute("data-danmaku")?.trim() || "";
        const id = $danmaku.getAttribute("data-ct")?.trim() || "";
        const name = $danmaku.getAttribute("data-uname")?.trim() || "";
        console.log(content, id, name);
        // admin
        if (setAdmin.has(name)) {
          if (content === "开车") return startWaiting();
          if (content === "刹车") return cancelWaiting();
          for (const keyword of ["切换语音", "语音切换"]) {
            if (content.startsWith(keyword))
              return setVoice(content.replace(keyword, "").trim() || "");
          }
        }
        // user
        if (content === "排队") return add(name, id);
        for (const keyword1 of ["查询排队", "排队查询"]) {
          if (content.startsWith(keyword1))
            return find(content.replace(keyword1, "").trim() || name, id);
        }
        if (isWaiting) {
          const idx = parseInt(content);
          if (idx > 0 && idx.toString() === content) return setWaiting.add(idx);
        }
        // others
        return;
      }
    );
  const ping = async () => {
    const data = await get(`http://localhost:${port}/system/ping`);
    if (!data) {
      speak(Lines.server_none);
      return false;
    }
    speak(Lines.server_ready);
    return true;
  };
  const removeTimer = (token) => {
    const n = cacheTimer.get(token);
    if (!n) return;
    cacheTimer.delete(token);
    window.clearTimeout(n);
  };
  const setCurrent = async (idx) => {
    const data = await get(
      `http://localhost:${port}/queue/setCurrent?idx=${idx}`
    );
    if (!data) return;
    if (!data.idx) speak(Lines.waiting_fail);
    else
      speak(Lines.waiting_success, {
        idx: data.idx,
        name: data.name,
      });
  };
  const setVoice = async (name) => {
    if (!name) return;
    if (!listVoice.includes(name)) {
      speak(Lines.voice_invalid);
      return;
    }
    const isLocal = ["huihui", "kangkang", "yaoyao"].includes(name);
    if (!isLocal) {
      const result = await get("https://speech.platform.bing.com/");
      if (!result) {
        speak(Lines.voice_disconnect);
        return;
      }
    }
    let n = 0;
    const fn = () => {
      const voice = speechSynthesis
        .getVoices()
        .filter((it) => it.name.toLowerCase().includes(name))[0];
      if (!voice) {
        n++;
        if (n > 10) {
          speak(Lines.voice_fail);
          return;
        }
        addTimer("voice/set", 100, fn);
        return;
      }
      speaker.voice = voice;
      speak(Lines.voice_success, {
        name,
      });
    };
    fn();
  };
  const speak = (message, data = {}) => {
    let msg = message;
    Object.keys(data).forEach(
      (key) => (msg = msg.replace(`{${key}}`, data[key].toString()))
    );
    log(msg);
    speaker.text = msg;
    window.speechSynthesis.speak(speaker);
  };
  const startWaiting = () => {
    if (isWaiting) return;
    isWaiting = true;
    setWaiting.clear();
    addTimer("waiting/countdown", delay, endWaiting);
    speak(Lines.waiting_start);
    addTimer("waiting/speak", delay - 10e3, () =>
      speak(Lines.waiting_countdown)
    );
  };
  const validate = (name, id) => {
    if (cacheId.has(id)) return false;
    cacheId.add(id);
    if (setAdmin.has(name)) return true;
    const ts = cacheName.get(name) || 0;
    const now = Date.now();
    if (now - ts < interval) return false;
    cacheName.set(name, now);
    return true;
  };
  // execute
  addTimer("main", 1e3, main);
})();
