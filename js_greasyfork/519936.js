// ==UserScript==
// @name Set Fira Code as font in development websites
// @name:zh-CN 将Fira Code 作为开发用网站的代码字体
// @namespace https://greasyfork.org/users/1133279
// @description Unified use of `Fira Code` as the code font to enhance developers' awareness of the code on the page
// @description:zh-CN 统一将`Fira Code`作为代码字体, 提高开发者对页面中的代码的感知度
// @version 9
// @author Arylo
// @include https://webpack.js.org/*
// @include https://rollupjs.org/*
// @include https://jestjs.io/*
// @include https://turbo.build/*
// @include https://vite.dev/*
// @include https://vitest.dev/*
// @include https://lodash.com/*
// @include https://docs.taro.zone/*
// @include https://ajv.js.org/*
// @include https://yargs.js.org/*
// @include https://www.tampermonkey.net/*
// @include https://*.github.io/*
// @include https://docs.gitlab.com/*
// @include https://www.w3schools.com/*
// @include https://www.typescriptlang.org/*
// @include https://yarnpkg.com/*
// @include https://pnpm.io/*
// @include https://npmjs.com/*
// @include https://docs.npmjs.com/*
// @include https://nodejs.org/docs/*
// @include https://vuejs.org/api/*
// @include https://vueuse.org/*
// @include https://react.dev/*
// @include https://rxjs.dev/*
// @include https://axios-http.com/*
// @include https://nextjs.org/*
// @include https://docs.nestjs.com/*
// @include https://eslint.org/*
// @include https://mochajs.org/*
// @include https://toml.io/*
// @include https://ls-lint.org/*
// @include https://nodemailer.com/*
// @include https://greasyfork.org/*/code
// @include https://docs.docker.com/*
// @include https://developers.weixin.qq.com/miniprogram/*
// @license MIT
// @resource font_css https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css
// @homepage https://greasyfork.org/zh-CN/scripts/519936
// @supportURL https://greasyfork.org/zh-CN/scripts/519936/feedback
// @run-at document-idle
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/519936/Set%20Fira%20Code%20as%20font%20in%20development%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/519936/Set%20Fira%20Code%20as%20font%20in%20development%20websites.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/polyfill/GM.ts
  var thisGlobal = window;
  if (typeof thisGlobal.GM === "undefined") {
    thisGlobal.GM = {};
  }
  function getGMWindow() {
    return thisGlobal;
  }

  // src/monkey/polyfill/GM_addStyle.ts
  var w = getGMWindow();
  if (typeof w.GM_addStyle === "undefined") {
    w.GM_addStyle = function GM_addStyle2(cssContent) {
      const head = document.getElementsByTagName("head")[0];
      if (head) {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.textContent = cssContent;
        head.appendChild(styleElement);
        return styleElement;
      }
      return null;
    };
  }
  if (typeof w.GM.addStyle === "undefined") {
    w.GM.addStyle = GM_addStyle;
  }

  // src/monkey/set-fira-code-development-websites/styles/template.css
  var template_default = '*{font-family:Fira Code,monospace!important;font-variant-ligatures:contextual;font-feature-settings:"calt"}\n';

  // src/monkey/set-fira-code-development-websites/index.ts
  var DEFAULT_PARENT_SELECTORS = [
    ":not(li) > a",
    ":not(h1):not(h2):not(h3):not(h4):not(h5) >"
  ];
  var DEFAULT_CODE_SELECTORS = [
    "code",
    "code *",
    "pre:not(:has(code))"
  ];
  function parseSelectors(selectors, parentSelectors) {
    const realSelectors = selectors.reduce((list, s) => {
      for (const ps of parentSelectors) {
        list.push(`${ps} ${s}`);
      }
      return list;
    }, []);
    return realSelectors;
  }
  function parseFontString(selectors) {
    return template_default.replace(/\*/g, selectors.join(", "));
  }
  setTimeout(() => {
    const fontCssContent = GM_getResourceText("font_css").replace(/(\burl\(["'])/g, "$1https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/");
    GM_addStyle(fontCssContent);
    const codeSelectors = DEFAULT_CODE_SELECTORS;
    const parentSelectors = DEFAULT_PARENT_SELECTORS;
    const selectors = parseSelectors(codeSelectors, parentSelectors);
    switch (location.host) {
      case "react.dev":
        selectors.push(".sp-code-editor .cm-content");
        break;
      case "w3schools.com":
      case "www.w3schools.com":
        selectors.push(".w3-code");
        break;
    }
    GM_addStyle(parseFontString(selectors));
  }, 25);
})();
