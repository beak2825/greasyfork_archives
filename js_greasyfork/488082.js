// ==UserScript==
// @name           teambition_tools
// @namespace      npm/vite-plugin-monkey
// @version        2.0.0
// @author         monkey
// @description    teambition提效工具脚本
// @license        MIT
// @icon           https://vitejs.dev/logo.svg
// @match          https://teambition.alibaba-inc.com/project/*/sprint/section/*
// @grant          GM.addElement
// @grant          GM.addStyle
// @grant          GM.deleteValue
// @grant          GM.getResourceUrl
// @grant          GM.getValue
// @grant          GM.info
// @grant          GM.listValues
// @grant          GM.notification
// @grant          GM.openInTab
// @grant          GM.registerMenuCommand
// @grant          GM.setClipboard
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_addElement
// @grant          GM_addStyle
// @grant          GM_addValueChangeListener
// @grant          GM_cookie
// @grant          GM_deleteValue
// @grant          GM_download
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_getTab
// @grant          GM_getTabs
// @grant          GM_getValue
// @grant          GM_info
// @grant          GM_listValues
// @grant          GM_log
// @grant          GM_notification
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_removeValueChangeListener
// @grant          GM_saveTab
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_unregisterMenuCommand
// @grant          GM_webRequest
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @grant          window.close
// @grant          window.focus
// @grant          window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/488082/teambition_tools.user.js
// @updateURL https://update.greasyfork.org/scripts/488082/teambition_tools.meta.js
// ==/UserScript==

;(({ entrySrc = `` }) => {
  window.GM;
  const key = `__monkeyWindow-` + new URL(entrySrc).origin;
  document[key] = window;
  console.log(`[vite-plugin-monkey] mount monkeyWindow to document`);
  const entryScript = document.createElement("script");
  entryScript.type = "module";
  entryScript.src = entrySrc;
  document.head.insertBefore(entryScript, document.head.firstChild);
  console.log(`[vite-plugin-monkey] mount entry module to document.head`);
})(...[
  {
    "entrySrc": "https://hybrid-es.alibaba.net/__vite-plugin-monkey.entry.js"
  }
]);

