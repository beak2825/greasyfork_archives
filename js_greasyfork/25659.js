// ==UserScript==
// @name        Kharus Chat Mono Patch
// @namespace   Kharus Chat Patch
// @match       https://kharus.com/pages/chat*
// @match       http://kharus.com/pages/chat*
// @description:en for Kharus Chatting
// @version     201612.007

// @description for Kharus Chatting
// @downloadURL https://update.greasyfork.org/scripts/25659/Kharus%20Chat%20Mono%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/25659/Kharus%20Chat%20Mono%20Patch.meta.js
// ==/UserScript==

function ChatPatch() {
$('p>span').css({'color': 'black'});
$('p').removeClass();
chatCount["GUILD_CHATTING"] = -999;
chatCount["PUBLIC_거래채팅"] = -999;
}
setInterval(ChatPatch, 100);