// ==UserScript==
// @name               JavDb净化增强
// @name:zh-TW         JavDb凈化增強
// @name:en            JavDbEnhance
// @namespace          https://github.com/GangPeter/pgscript
// @version            1.0.5
// @author             GangPeter
// @description        去除JavDb广告、拦截弹窗、修复布局、支持PC端|移动端
// @description:zh-TW  去除JavDb廣告、攔截彈窗、修復布局、支持PC端|移動端
// @description:en     Remove JavDb ads
// @license            None
// @icon               data:image/png;base64,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
// @homepageURL        https://github.com/GangPeter/pgscript
// @supportURL         https://github.com/GangPeter/pgscript
// @match              *://*.javdb.com/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/519687/JavDb%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519687/JavDb%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" div.modal.is-active.over18-modal{display:none!important}nav.app-desktop-banner{display:none!important}nav.sub-header{display:none!important}#footer{display:none!important}#magnets>article>div>div.top-meta{display:none!important}#navbar-menu-hero>div>a[href*=theporndude]{display:none!important}#reviews>article>div>dl>dt.review-item.more.has-text-link:has(a[href*=plans]){display:none!important} ");

(function () {
  'use strict';

  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2["Debug"] = "DEBUG";
    LogLevel2["Info"] = "INFO";
    LogLevel2["Warn"] = "WARN";
    LogLevel2["Error"] = "ERROR";
    return LogLevel2;
  })(LogLevel || {});
  function PGLOG(level, funName, message) {
    const now = /* @__PURE__ */ new Date();
    const time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const logMessage = `${time} [${funName}|${level}]: ${message}`;
    console.log(logMessage);
  }
  const FUNNAME = "JavDb增强";
  PGLOG(LogLevel.Info, FUNNAME, "启动!");

})();