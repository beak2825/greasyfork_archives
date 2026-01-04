// ==UserScript==
// @name tts top of chat and click to hide
// @namespace Violentmonkey Scripts
// @match https://www.fishtank.live/
// @grant none
// @version 1.0
// @author -
// @description 4/20/2023, 4:52:49 PM
// @licence MIT
// @downloadURL https://update.greasyfork.org/scripts/464507/tts%20top%20of%20chat%20and%20click%20to%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/464507/tts%20top%20of%20chat%20and%20click%20to%20hide.meta.js
// ==/UserScript==
(function() {
'use strict';

// Add custom CSS
var customCSS = `
.ChatMessageTTS_chat-message-tts__W04AH {
background-color: rgba(116,7,0,1);
position: absolute;
top: 0;
margin-left: auto;
}`;
var styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.appendChild(document.createTextNode(customCSS));
document.head.appendChild(styleElement);

// Add click event listener
document.addEventListener('click', function(event) {
var target = event.target;
var targetClass = 'ChatMessageTTS_chat-message-tts__W04AH';

while (target !== null) {
if (target.classList && target.classList.contains(targetClass)) {
target.style.display = 'none';
break;
}
target = target.parentElement;
}
});
})();