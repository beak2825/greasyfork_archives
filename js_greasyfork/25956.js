// ==UserScript==
// @name        Kharus Chat Unlimited Patch
// @namespace   Kharus Chat Patch
// @match       https://kharus.com/pages/chat*
// @match       http://kharus.com/pages/chat*
// @description:en for Kharus Chatting
// @version     201612.001

// @description for Kharus Chatting
// @downloadURL https://update.greasyfork.org/scripts/25956/Kharus%20Chat%20Unlimited%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/25956/Kharus%20Chat%20Unlimited%20Patch.meta.js
// ==/UserScript==

function ChatPatch() {
chatCount["GUILD_CHATTING"] = -999;
chatCount["PUBLIC_거래채팅"] = -999;
chatCount["PUBLIC_동맹레이드"] = -999;
chatCount["PUBLIC_잡담채팅"] = -999;
}
setInterval(ChatPatch, 1000);