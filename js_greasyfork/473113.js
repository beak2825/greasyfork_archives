// ==UserScript==
// @name        ChatGPT - Auto-Disable History
// @namespace   ChatGPT Historydisabler
// @match       https://chat.openai.com/
// @grant       none
// @version     1.0
// @author      dystopiaTD
// @license     MIT
// @description Simply sets historyDisabled to "true" whenever ChatGPT is opened. It couldn't be any more lightweight!
// @downloadURL https://update.greasyfork.org/scripts/473113/ChatGPT%20-%20Auto-Disable%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/473113/ChatGPT%20-%20Auto-Disable%20History.meta.js
// ==/UserScript==
if(!localStorage[localStorage["oai/apps/historyDisabled"] == "\"true\""])
  localStorage["oai/apps/historyDisabled"] = "\"true\"";