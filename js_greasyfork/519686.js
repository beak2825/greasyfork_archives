// ==UserScript==
// @name               JavLibrary净化增强
// @name:zh-TW         JavLibrary凈化增強
// @name:en            JavLibraryEnhance
// @namespace          https://github.com/GangPeter/pgscript
// @version            1.0.5
// @author             GangPeter
// @description        去除JavLibrary广告、拦截弹窗、修复布局、支持PC端|移动端
// @description:zh-TW  去除JavLibrary廣告、攔截彈窗、修復布局、支持PC端|移動端
// @description:en     Remove JavLibrary ads
// @license            None
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC50lEQVR4nNRXS2gTURTN0qIouBBX6sKFC0HBtSCooFgEqUsXulD8tUVFS12ILrpwpUs3Lly4FASXTSz2E422aTHNpzFq/VUqaFJbm8y8z/XMa5OZyXwy0zIVH5y85L0755137333TWL92jqyImZ8VLQ2+4DRjL7MTpgD9UE14OCoz5oWrNNp8aeZY6TpUTuFmqyC6qyfAdEw6zYn9f3uMj0ZXCdtS8iPlBBP/DUUvXYx4bFF0zH8sotBm9XgmjIYFyk1uOCIF7/RCNESU5PBiv0QBA4CqW9rSPnlsfOWCvLaVkrzW/i+PhwBseOmI9h51wemVKLs9CDg3RYCS2YtYxAYkN99FFjCIWUNJBfpJ7ZSkcM0L9P0TU622EJTPOvtCy1QnJ1eozCGejgWi0DBor5b7XtWJdHGcAQvDEcSM0MpB8MrIPnKJOA3wxMMACUkVJwdC+8DwTrUypMBDpGDIK32v9SyPgRDrMedIG8hyHsQjBu9SLoTFAIQ1LQd6Le4E0w1EVT0XThMHTbjlCx4+8BKIICcFFTCWFnGaU6mcBozkP8oGIFb65fv/KPgRcCBDH8Amw3BEiks/j3Bmgh4DrzVNlOBnaJRfhVV/ZDt+otUQBkLkRxxBFe9C/CeaAUY9U3q25dzyd7KKjWHovdAEqjqe+CFz43FfwAJ8Qzzm6IV8BKY0fdRTTwmIWcoQxrKw5nok9BIOg1JR9LYK9nLLDsXvYAcQPyCI+45JeBSYPIEsIiLNSmncXL2Bheg7gbe6RCgyjzrCixgFsiKp75ecxWg7hZ+xUOA86XNDUXgK+/FUX0YPgSqsPPrDgElYJ71kRA5SkuNJvR2SrOTNMbaaUw/SqP6EXrNDtMb/QB90g9i8fstC5aPAPcXReN/VglXU4nftuE9v0PTvI+K/B4W7l1dEvoJaNU+GGHid1cnwEhCxrvwjjeHGjgPLOCWr5JEHRAYFeg5fnP4g2E+S79XfDz/j9swSvwFAAD//+BbUY8AAAAGSURBVAMA+yLYVhcl05AAAAAASUVORK5CYII=
// @homepageURL        https://github.com/GangPeter/pgscript
// @supportURL         https://github.com/GangPeter/pgscript
// @match              *://*.javlibrary.com/*
// @match              *://*.javlib.com/*
// @match              *://*.o83h.com/*
// @match              *://*.r86m.com/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/519686/JavLibrary%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519686/JavLibrary%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const n=document.createElement("style");n.textContent=t,document.head.append(n)})(" #adultwarningmask,#topbanner11{display:none!important}#leftmenu>div>ul>li:has(a[href*=tyrantdb]){display:none!important}#leftmenu>table{display:none!important}#rightcolumn>div.socialmedia{display:none!important}#sder43f,#bottommenu,#bottomcopyright{display:none!important}#rightcolumn>div.titlebox{display:none!important}#rightcolumn>table.about{display:none!important}#bottombanner13{display:none!important} ");

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
  const FUNNAME = "JavLibrary增强";
  PGLOG(LogLevel.Info, FUNNAME, "启动!");

})();