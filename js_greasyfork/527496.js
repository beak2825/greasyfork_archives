// ==UserScript==
// @name         Easy Solar Script
// @namespace    https://greasyfork.org/users/1437340
// @version      0.3.0
// @author       gaoyuanbj05
// @description  Scripts for darwin,jira,octopus... (Vue 3 powered)
// @license      MIT
// @icon         https://xyst.zhenguanyu.com/solar-cms/solar-cms-web-nemesis/favicon.png
// @match        https://*.zhenguanyu.com/*
// @exclude      https://xyst.zhenguanyu.com/*
// @exclude      https://xyst-test.zhenguanyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527496/Easy%20Solar%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/527496/Easy%20Solar%20Script.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const loadExternalScript = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  };
  const documentReady = () => {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  };
  async function loadVue(cdnUrl = "https://unpkg.com/vue@3/dist/vue.global.js") {
    if (typeof window.Vue !== "undefined") {
      return;
    }
    try {
      await loadExternalScript(cdnUrl);
    } catch (error) {
      console.error("Failed to load Vue:", error);
      throw error;
    }
  }
  function getScriptUrl(baseUrl, scriptName) {
    return `${baseUrl}/${scriptName}?v=${"379069f"}&t=${Date.now()}`;
  }
  async function checkTestEnvironment(baseUrl) {
    try {
      const healthCheckUrl = `${baseUrl}/health.json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2e3);
      const response = await fetch(healthCheckUrl, {
        method: "GET",
        signal: controller.signal,
        cache: "no-cache"
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "ok") {
          return true;
        }
      }
      return false;
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.warn("测试环境服务不可用:", error.message);
      }
      return false;
    }
  }
  async function init() {
    try {
      await documentReady();
      await loadVue();
      const space = location.host.split(".")[0];
      const prodBaseUrl = "https://static-nginx-test.oss-cn-beijing-internal.aliyuncs.com/solar/solar-tools/tampermonkey-scripts";
      const testBaseUrl = "http://localhost:8080";
      const scriptName = `${space}.js`;
      const testScriptUrl = getScriptUrl(testBaseUrl, scriptName);
      const prodScriptUrl = getScriptUrl(prodBaseUrl, scriptName);
      console.log("testScriptUrl", testScriptUrl);
      console.log("prodScriptUrl", prodScriptUrl);
      try {
        const isTestAvailable = await checkTestEnvironment(testBaseUrl);
        const scriptUrl = isTestAvailable ? testScriptUrl : prodScriptUrl;
        await loadExternalScript(scriptUrl);
        console.log(
          `已加载${isTestAvailable ? "测试" : "生产"}环境脚本: ${scriptUrl}`
        );
        if (!isTestAvailable) {
          console.log("当前版本:", "379069f");
        }
      } catch (error) {
        console.warn("无法找到对应的脚本: ", space);
      }
    } catch (error) {
      console.error("初始化失败:", error);
    }
  }
  init();

})();