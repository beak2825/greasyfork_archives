// ==UserScript==
// @name              tileChat
// @namespace         tilemanio.chat
// @version           1.0.0
// @description       Tilemanio chat
// @author            mkcodes
 
// @match             https://tileman.io/*
// @match             http://tileman.io/*

// @license           MIT

// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/427816/tileChat.user.js
// @updateURL https://update.greasyfork.org/scripts/427816/tileChat.meta.js
// ==/UserScript==

document.getElementById("performance_stats").innerHTML+='<iframe src="https://3chat-1.mkcodes.repl.co/embed.php?room=tileman" style="border:0px #ffffff hidden;opacity:75%;" name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="120%" width="137%" allowfullscreen></iframe>'