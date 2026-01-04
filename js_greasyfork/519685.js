// ==UserScript==
// @name               JavBus净化增强
// @name:zh-TW         JavBus凈化增強
// @name:en            JavBusEnhance
// @namespace          https://github.com/GangPeter/pgscript
// @version            1.0.5
// @author             GangPeter
// @description        去除JavBus广告、拦截弹窗、修复布局、支持PC端|移动端
// @description:zh-TW  去除JavBus廣告、攔截彈窗、修復布局、支持PC端|移動端
// @description:en     Remove JavBus ads
// @license            None
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABBElEQVR4nLSSQQ7BUBCGH2FX4QLdd4Uj2EiEjRO4ii2xsnOWLjgA1USQoInYaDWxYNFQ5WckVY+2CJr8Xcz73j/zZob1GAOJ0W/bbsOLdO+PSBtZ9gJKLIZ5pcITnBtplMnwgXE26wX0ev35iis3fSBA1bp2HGC2WjAaDewXCwxEMdghsOy3gdAi1UQCtmFw0BNwWK/DAccXiERA36xUwk7T/GuY5vNYNZtQk8kvn/mpQg1ocya5HLRyGWoq9bkBdYWGT62jBXgcwh8MolHMikUsq1UMJQl9QcC207kajNLp1wYETAsFHEwTJ8fB0bJwsm3otRqUePz9HtwyXRbAL+tPx3gGAAD//27vhQUAAAAGSURBVAMAQIr/QsoicMsAAAAASUVORK5CYII=
// @homepageURL        https://github.com/GangPeter/pgscript
// @supportURL         https://github.com/GangPeter/pgscript
// @match              *://*.javbus.com/*
// @match              *://*.busjav.help/*
// @match              *://*.seedmm.help/*
// @match              *://*.seejav.help/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/519685/JavBus%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519685/JavBus%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const a=document.createElement("style");a.textContent=n,document.head.append(a)})(" div.ad-box,div.alert.alert-info.alert-dismissable.alert-common{display:none!important}div.container>h4:has(a[href*=bootstr]){display:none!important}footer.footer{display:none!important}div.bcpic2:has(div.ad-box){display:none!important}#ct>div.mn>div:nth-child(1):has(div){display:none!important}#an{display:none!important}#ct>div.mn>div.banner728{display:none!important}#sd>div.frame.move-span.cl.frame-1{display:none!important}#ct>div>div.sd.sd_allbox>div.frame.move-span.cl.frame-1{display:none!important}div.biaoqi-fix-area,div.jav-footer{display:none!important}tbody>tr>td.plc.plm:has(div.sign){display:none!important}div.pls.favatar[id*=favatar]>div.card_gender_0[id*=userinfo]{display:none!important}#ct>div>div.mn>div.pgs.mtm.mbm.cl>div.banner728{display:none!important} ");

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
  const FUNNAME = "JavBus增强";
  PGLOG(LogLevel.Info, FUNNAME, "启动!");

})();