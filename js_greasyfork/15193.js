// ==UserScript==
// @name        TA Chat Comic Sans
// @namespace   com.ta.chat
// @include     http://www.trueachievements.com/chat.aspx
// @version     1.1
// @description TA Chat Font Comic Sans
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15193/TA%20Chat%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/15193/TA%20Chat%20Comic%20Sans.meta.js
// ==/UserScript==

var sFont = "Comic Sans MS";

var divChatBody = document.getElementById("divChatBody");
divChatBody.style.fontFamily = sFont;

var divChatList = document.getElementById("divChatList");
divChatList.style.fontFamily = sFont;

var txtChatMessage = document.getElementById("txtChatMessage");
txtChatMessage.style.fontFamily = sFont;

var spnTopic = document.getElementById("spnTopic");
spnTopic.style.fontFamily = sFont;