// ==UserScript==
// @name        obsolete - d.gg utilities workaround for Violent Monkey on Chrome/Edge
// @namespace   Obamna
// @description Dummy script to hook into the entire page so the utilities one can hook as a subframe, fixes the Embeds button
// @match       https://www.destiny.gg/embed/chat
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/embed/chat?follow=%2Fbigscreen
// @grant       GM.xmlHttpRequest
// @version     0.2
// @author      mif
// @license     MIT
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/451967/obsolete%20-%20dgg%20utilities%20workaround%20for%20Violent%20Monkey%20on%20ChromeEdge.user.js
// @updateURL https://update.greasyfork.org/scripts/451967/obsolete%20-%20dgg%20utilities%20workaround%20for%20Violent%20Monkey%20on%20ChromeEdge.meta.js
// ==/UserScript==

const OBAMNA = true;