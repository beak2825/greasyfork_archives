"use strict";
// ==UserScript==
// @name         回到旧版B站主页（已失效）
// @namespace    http://salt.is.lovely/
// @version      0.1.4-tip1
// @description  修改cookie回到旧版B站主页（脚本已失效可以删除）
// @author       salt
// @license      MulanPSL2
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/475203/%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88B%E7%AB%99%E4%B8%BB%E9%A1%B5%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475203/%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88B%E7%AB%99%E4%B8%BB%E9%A1%B5%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89.meta.js
// ==/UserScript==

// 开源在 github https://github.com/Salt-lovely/salt-bili-back
// 在 https://greasyfork.org/zh-CN/scripts/475203 安装

/*
Copyright (c) 2023 Salt_lovely
回到旧版B站主页 is licensed under Mulan PSL v2.
You can use this software according to the terms and conditions of the Mulan PSL v2.
You may obtain a copy of Mulan PSL v2 at:
          http://license.coscl.org.cn/MulanPSL2
THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
See the Mulan PSL v2 for more details.
*/
(() => {
  // node_modules/salt-lib/lib/storage/localStorage.js
  function innerParse(str) {
    if (str) {
      try {
        return JSON.parse(str);
      } catch (e) {
      }
    }
    return null;
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function unsafeRead(key) {
    const storage = localStorage.getItem(key);
    return innerParse(storage);
  }
  function listen(listener, options = { passive: true }) {
    window.addEventListener("storage", listener, options);
    return () => window.removeEventListener("storage", listener, options);
  }
  function readAndListen(props) {
    const { key, defaultValue, listener, callOnChange = true, options = { passive: true } } = props;
    let v = unsafeRead(key);
    if (defaultValue !== void 0 && v === null) {
      write(key, defaultValue);
      v = defaultValue;
    }
    const fn = (ev) => {
      if (ev.key !== key || ev.storageArea !== localStorage)
        return;
      const newValue = innerParse(ev.newValue);
      const oldValue = innerParse(ev.oldValue);
      if (callOnChange && newValue === oldValue)
        return;
      const encapsulatedEvent = {
        key,
        newValue,
        oldValue,
        storageArea: ev.storageArea,
        url: ev.url
      };
      listener(encapsulatedEvent);
    };
    const off = listen(fn, options);
    return [v, off];
  }

  // src/utils.ts
  var defaultExpires = new Date(3398759114e3);
  var defaultDomain = ".bilibili.com";
  var NEW_UI = 0;
  var OLD_UI = 1;
  var TRADITION_UI = 2;
  var STORAGE_KEY = "salt-lovely-bili-tool";
  function deleteCookie(name, domain = defaultDomain) {
    setCookie(name, "", defaultExpires, domain);
  }
  function setCookie(name, value = "", expires = defaultExpires, domain = defaultDomain) {
    document.cookie = `${name}=${value};expires=${expires};path=/;domain=${domain}`;
  }
  function genResetCookieFn({
    delMap,
    setMap
  }) {
    console.log(`设置成功`);
    if (delMap)
      console.log(`将强制清除这些cookie: ${delMap.join(", ")}`);
    if (setMap)
      console.log(`将强制接管这些cookie: ${Object.keys(setMap).join(", ")}`);
    return () => {
      if (delMap)
        delMap.forEach((c) => deleteCookie(c));
      if (setMap)
        Object.keys(setMap).forEach((c) => setCookie(c, setMap[c]));
    };
  }

  // src/index.tsx
  if (window.isSaltGoBackBilibiliInit) {
    console.log(
      `
检测到重复启用盐酱牌回到旧版B站主页脚本

请检查您的脚本安装是否正确
`
    );
  } else {
    window.isSaltGoBackBilibiliInit = true;
    let interval = 0;
    const setNewUI = () => {
      clearInterval(interval);
      setCookie("i-wanna-go-back", "0");
    };
    const setOldUI = () => {
      clearInterval(interval);
      const resetFn = genResetCookieFn({
        delMap: ["buvid3"],
        setMap: {
          "i-wanna-go-back": "1",
          "i-wanna-go-feeds": "-1",
          nostalgia_conf: "2"
        }
      });
      interval = setInterval(resetFn, 500);
    };
    const setTraditionalUI = () => {
      clearInterval(interval);
      const resetFn = genResetCookieFn({
        delMap: ["buvid3", "buvid4", "buvid_fp"],
        setMap: {
          "i-wanna-go-back": "1",
          "i-wanna-go-feeds": "1",
          nostalgia_conf: "2"
        }
      });
      interval = setInterval(resetFn, 500);
    };
    const setUICookie = (value2) => {
      switch (value2) {
        case NEW_UI:
          setNewUI();
          break;
        case OLD_UI:
          setOldUI();
          break;
        case TRADITION_UI:
          setTraditionalUI();
          break;
        case null:
          setNewUI();
          break;
        default:
          console.log("无法识别的UI模式", value2);
          setOldUI();
      }
    };
    const [value] = readAndListen({
      key: `${STORAGE_KEY}-ui-version`,
      defaultValue: OLD_UI,
      listener: (ev) => {
        const { newValue } = ev;
        setUICookie(newValue);
      }
    });
    setUICookie(value);
    console.log(
      `
欢迎使用盐酱牌回到旧版B站主页脚本！

下个版本将会在屏幕底部添加切换按钮
`
    );
  }
})();
