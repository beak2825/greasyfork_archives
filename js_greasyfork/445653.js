// This userscript needs Violentmonkey or Tampermonkey.
// 本用户脚步需要Violentmonkey/Tampermonkey.
//
// ==UserScript==
// @name        GPW-Helper
// @description Misc Helpers
// @version     1.0.0
// @author      GazellePW
// @namespace   GazellePW
// @license     MIT
// @require     https://unpkg.com/gmxhr-fetch
// @grant       GM_xmlhttpRequest
// @match       http*://localhost*/*
// @match       https://greatposterwall.com/*
// @downloadURL https://update.greasyfork.org/scripts/445653/GPW-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445653/GPW-Helper.meta.js
// ==/UserScript==

unsafeWindow.gpwHelper = {
  id: '6C406E43-E587-429A-B69C-BB5082BC7589',
  fetch: window.gmfetch,
}
