// ==UserScript==
// @name         Chat /r Function *OLD*
// @description  Allows the use of /r function in chat
// @version      1.0
// @include      http://www.kongregate.com/games/*
// @require       https://greasyfork.org/scripts/18194-nabb-s-func-func-framework-old/code/Nabb's%20Func%20Func%20Framework%20*OLD*.user.js
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17682/Chat%20r%20Function%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17682/Chat%20r%20Function%20%2AOLD%2A.meta.js
// ==/UserScript==

// Nabb, 1st May 2009: nabb.trap17.com
// fixed? June 7th

// This script will add the '/r' feature, a shorthand for reply to whisper.
// When '/r' is typed, it will be replaced with '/w name' where name is
// username of the last user who sent a message. In the event that you
// have no received any messages, it will be replaced with '/w'.

setTimeout("nL=0;nFE((z='ChatDialogue.prototype.')+'receivedPrivateMessage',x='dMessage(',x+'nL=');nFA(z+'onKeyPress',\"(z=this._input_node).value=='/r'&&a.keyCode==32&&(z.value='/w'+(nL?' '+nL:''))\")",100)
