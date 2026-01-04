// ==UserScript==
// @name         bilibili 倍速控制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用快捷键控制bilibili的倍速选择
// @author       pipizhu
// @match        http*://www.bilibili.com/video/*
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license 		 MIT
// @downloadURL https://update.greasyfork.org/scripts/476181/bilibili%20%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/476181/bilibili%20%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(function() {
  "use strict";
  document.body.onload = init;
})();

const speedList = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3];

const upKeyCode = "Period";
const downKeyCode = "Comma";
let customUpKey = GM_getValue("customUpKey");
let customDownKey = GM_getValue("customDownKey");

async function init() {
  // addActionBtns();
  console.log("init keybindings");
  GM_registerMenuCommand("打开设置面板", openSettings);
  try {
    bindKeys();
    const cachedSpeed = GM_getValue("currentSpeed");
    // await delay(1000);
    if (cachedSpeed) {
      console.log("cached speed", cachedSpeed);
      GM_registerMenuCommand("✅当前记忆倍速 X" + cachedSpeed, () => { });
      setSpeed(cachedSpeed);
    }
    console.log("bind success!");
  } catch (e) {
    console.log("error", e);
  }
}

function getCurrentSpeed() {
  const video = getCurrentVideo();
  return video.playbackRate;
}

function bindKeys() {
  const keys = "0123456789";
  document.addEventListener(
    "keydown",
    (e) => {
      if (
        keys.indexOf(e.key) != -1 &&
        !(e.isComposing || e.ctrlKey || e.altKey)
      ) {
        e.stopImmediatePropagation();
      }
      if (e.key === "2") {
        setSpeed(2);
        return;
      }
      if (e.key === "5") {
        setSpeed(1.5);
        return;
      }
      if (e.key === "7") {
        setSpeed(1.75);
        return;
      }
      if (e.key === "1" || e.key === "z") {
        setSpeed(1);
        return;
      }
      if (e.key === "3") {
        setSpeed(3);
        return;
      }
      const video = getCurrentVideo();
      const currentSpeed = video.playbackRate;
      const isCustom = customUpKey && customDownKey;
      let currentIndex = speedList.findIndex((s) => s === currentSpeed);
      if (isCustom) {
        if (e.key === customUpKey) {
          currentIndex = Math.min(currentIndex + 1, speedList.length - 1);
        }
        if (e.key === customDownKey) {
          currentIndex = Math.max(currentIndex - 1, 0);
        }
      } else {
        if (e.code === upKeyCode && e.shiftKey) {
          // increase speed
          currentIndex = Math.min(currentIndex + 1, speedList.length - 1);
        } else if (e.code === downKeyCode && e.shiftKey) {
          // decrease speed
          currentIndex = Math.max(currentIndex - 1, 0);
        }
      }
      const speed = speedList[currentIndex];
      setSpeed(speed);
    },
    true,
  );
}

function setSpeed(speed) {
  const video = getCurrentVideo();
  video.playbackRate = speed;
}

async function delay(time) {
  return new Promise((res) => setTimeout(() => res(), time));
}

function getCurrentVideo() {
  const video = document.getElementsByTagName("video")[0];
  return video;
}

function addStyle(styleString) {
  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(styleString));
  document.head.append(style);
}

function preserveSpeed() {
  const currentSpeed = getCurrentSpeed();
  GM_setValue("currentSpeed", currentSpeed);
}

function clearSpeed() {
  GM_setValue("currentSpeed", "");
}

function openSettings() {
  const speed = getCurrentSpeed();
  const currentKey = {
    up: customUpKey || ">",
    down: customDownKey || "<",
  };
  const html = `
    <div class='bli-speed-pannel-setting' id='bli-speed-pannel-setting' style='position: fixed; bottom: 0; right: 0;top: 0;left:0; z-index: 9999;display:flex;justify-content: center;align-items: center'>
      <div style='position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);z-index: -1'></div>
      <div style='background: white;padding:20px;border-radius: 5px;'>
        <h2>当前速度：${speed}</h2>
        <div>
          <button id='save-speed'> 记忆当前速度 </button>
          <button id='clear-speed'> 取消记忆当前速度 </button>
        </div>

        <h2>当前快捷键</h2>
        <div>加速键:${currentKey.up} 减速键:${currentKey.down}</div>

        <input type='checkbox' id='custom-speed-checkbox' />
        <label for="custom-speed-checkbox">自定义快捷键</label>
        <div>
          <button id='custom-down-key'>设置减速快捷键 </button>
          <button id='custom-up-key'>设置加速快捷键 </button>
        </div>

        <button style='display: block; margin: 0 auto;margin-top: 20px; ' id='close-pannel-setting'>关闭面板</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
  addStyle(`
    .bli-speed-pannel-setting button{
      background: transparent;
      border: 1px solid;
      padding: 5px 8px;
      border-radius: 25px;
      cursor: pointer;
    }
    .bli-speed-pannel-setting button:disabled{
      cursor: not-allowed;
      opacity: 0.5;
    }
    .bli-speed-pannel-setting h2{
      text-align: center;
    }
  `);

  const closePannel = () => {
    document.body.removeChild(
      document.getElementById("bli-speed-pannel-setting"),
    );
  };

  const upKey = GM_getValue("customUpKey");
  const downKey = GM_getValue("customDownKey");
  const isCustom = upKey && downKey;
  const customCheckBox = document.getElementById("custom-speed-checkbox");
  const upBtn = document.getElementById("custom-up-key");
  const downBtn = document.getElementById("custom-down-key");
  customCheckBox.checked = isCustom;
  upBtn.disabled = !isCustom;
  downBtn.disabled = !isCustom;
  if (upKey) {
    upBtn.innerText = "加速键:" + upKey;
  }
  if (downKey) {
    downBtn.innerText = "减速键:" + downKey;
  }

  function handleUpKey(e) {
    const key = e.key;
    customUpKey = key;
    GM_setValue("customUpKey", key);
    upBtn.innerText = "加速键:" + key;
    document.removeEventListener("keydown", handleUpKey);
  }
  function handleDownKey(e) {
    const key = e.key;
    customDownKey = key;
    GM_setValue("customDownKey", key);
    downBtn.innerText = "减速键:" + key;
    document.removeEventListener("keydown", handleDownKey);
  }
  upBtn.addEventListener("click", () => {
    upBtn.innerText = "请输入加速键";
    document.removeEventListener("keydown", handleDownKey);
    document.addEventListener("keydown", handleUpKey);
  });

  downBtn.addEventListener("click", () => {
    downBtn.innerText = "请输入减速键";
    document.removeEventListener("keydown", handleUpKey);
    document.addEventListener("keydown", handleDownKey);
  });

  customCheckBox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    upBtn.disabled = !checked;
    downBtn.disabled = !checked;
    if (!checked) {
      GM_setValue("customUpKey", "");
      GM_setValue("customDownKey", "");
    }
  });

  document.getElementById("save-speed").addEventListener("click", () => {
    preserveSpeed();
    closePannel();
  });
  document.getElementById("clear-speed").addEventListener("click", () => {
    clearSpeed();
    closePannel();
  });
  document
    .getElementById("close-pannel-setting")
    .addEventListener("click", () => {
      closePannel();
    });
}
