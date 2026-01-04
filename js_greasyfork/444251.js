// ==UserScript==
// @name         YouTube Live Chat CSS Tamer
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  to change CSS behavior for YouTube Live Chat for better performance.
// @author       CY Fung
// @match        https://www.youtube.com/live_chat?*
// @match        https://www.youtube.com/live_chat_replay?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444251/YouTube%20Live%20Chat%20CSS%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/444251/YouTube%20Live%20Chat%20CSS%20Tamer.meta.js
// ==/UserScript==

function main(){



}


;!(function $$() {
    'use strict';

    if(document.documentElement == null) return window.requestAnimationFrame($$)

    const cssTxt = `
/*
yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer ~ * {
  content-visibility: auto;
}*/

#chat.style-scope.yt-live-chat-renderer,
yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer,
#item-scroller,
yt-live-chat-text-message-renderer.style-scope.yt-live-chat-item-list-renderer .style-scope.yt-live-chat-text-message-renderer,
yt-live-chat-ticker-paid-message-item-renderer
{
  contain: layout paint style;
}

yt-img-shadow#author-photo.style-scope{
  contain: layout paint style;
  content-visibility: auto;
  contain-intrinsic-size: 24px 24px;
}

#item-offset.style-scope.yt-live-chat-item-list-renderer,
#items.style-scope.yt-live-chat-item-list-renderer {
  contain: layout paint;
}

.style-scope.yt-live-chat-text-message-renderer {
  cursor: default;
}

#author-photo.style-scope.yt-live-chat-text-message-renderer,
yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer,
yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer ~ span#message.style-scope.yt-live-chat-text-message-renderer
{
  pointer-events: none;
}

span#message.style-scope.yt-live-chat-text-message-renderer > img.emoji.yt-formatted-string.style-scope.yt-live-chat-text-message-renderer{
  contain: layout paint style;
  cursor: default;
  pointer-events: none;
}

body yt-live-chat-app{
  contain: size layout paint style;
  content-visibility: auto;
  transform: translate3d(0,0,0);
  overflow: hidden;
}

    `;

    function addStyle (styleText) {
      const styleNode = document.createElement('style');
      styleNode.type = 'text/css';
      styleNode.textContent = styleText;
      document.documentElement.appendChild(styleNode);
      return styleNode;
    }

    addStyle (cssTxt);

    main(window.$);


    // Your code here...
})();