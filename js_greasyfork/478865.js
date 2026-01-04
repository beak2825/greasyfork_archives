// ==UserScript==
// @name         BOSS直聘-外包标注
// @namespace    https://github.com/bosens-China/boss-outsourcing-tips
// @version      1.1.4
// @description  BOSS直聘外包标注工具，对可能是外包的岗位进行显示提醒。
// @author       yliu
// @match        https://www.zhipin.com/job_detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478865/BOSS%E7%9B%B4%E8%81%98-%E5%A4%96%E5%8C%85%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478865/BOSS%E7%9B%B4%E8%81%98-%E5%A4%96%E5%8C%85%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function() {
  "use strict";
  function createScript(rest) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      Object.entries(rest).forEach(([key, value]) => {
        script[key] = value;
      });
      script.onload = () => {
        resolve(script);
      };
      document.body.appendChild(script);
    });
  }
  function createStyle({ href }) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.body.appendChild(link);
    return link;
  }
  function isSupportModule() {
    let isModule2 = false;
    try {
      isModule2 = HTMLScriptElement.supports("module");
    } catch (e) {
      isModule2 = false;
    }
    return isModule2;
  }
  const axiosCnd = `https://cdn.jsdelivr.net/npm/axios@1.7.9/dist/axios.min.js`;
  const createAxios = () => createScript({
    src: `${axiosCnd}`,
    defer: true
  });
  const version = "1.1.4";
  const getAxios = () => window.axios;
  const isModule = isSupportModule();
  const prefixUrl = `https://fastly.jsdelivr.net/gh/bosens-China/boss-outsourcing-tips@v${version}-dist/${isModule ? "es" : "iife"}`;
  const main = function() {
    return __async(this, null, function* () {
      yield createAxios();
      const axios = getAxios();
      const { data: manifest } = yield axios.get(`${prefixUrl}/manifest.json`);
      const { file: jsFile } = manifest["src/main.ts"];
      const { file: cssFile } = manifest["style.css"];
      createScript({
        src: `${prefixUrl}/${jsFile}`,
        type: isModule ? "module" : "text/javascript"
      });
      createStyle({
        href: `${prefixUrl}/${cssFile}`
      });
    });
  };
  main();
})();
