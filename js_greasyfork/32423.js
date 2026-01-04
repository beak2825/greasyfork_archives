// ==UserScript==
// @name        Gif Remover for Gitter
// @namespace   https://github.com/ryanford-dev/gif-remover
// @description Remove gifs from Gitter
// @match       *.gitter.im/*/*/~chat*
// @version     0.0.5
// @license     https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/32423/Gif%20Remover%20for%20Gitter.user.js
// @updateURL https://update.greasyfork.org/scripts/32423/Gif%20Remover%20for%20Gitter.meta.js
// ==/UserScript==

const chatContainer = document.getElementById('chat-container').firstChild;
const config = { childList: true };

const findGifs = (mutations) => {
  let imgs = document.querySelectorAll("img");

  imgs.forEach((img) => {
    if (img.src.match(".gif")) {
      let parent = img.parentNode;
      parent.removeChild(img);
      parent.textContent = "Gif removed";
    }
  });
};

const gifRemover = new MutationObserver(findGifs);
gifRemover.observe(chatContainer, config);
