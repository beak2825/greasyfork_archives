// ==UserScript==
// @name               YouTube Like/Dislike Shortcuts Lite
// @name:pt-BR         Atalhos Gostei/Não Gostei Lite no YouTube
// @namespace          YTLDSL
// @author             warib64
// @description        Enables keyboard shortcuts to like/dislike a video on YouTube.
// @description:pt-BR  Cria atalhos para os botões gostei/não gostei em um vídeo no YouTube.
// @match              *://*.youtube.com/*
// @license            MIT
// @version            1.2
// @downloadURL https://update.greasyfork.org/scripts/529365/YouTube%20LikeDislike%20Shortcuts%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/529365/YouTube%20LikeDislike%20Shortcuts%20Lite.meta.js
// ==/UserScript==
 
// You can change the codes to whichever keys you want to use for liking, disliking, and opening or writing comments on Shorts.
const codeLike = "NumpadAdd";
const codeDislike = "NumpadSubtract";

/* Filling in these quotation marks with the code of a key creates an additional shortcut dedicated to removing your like/dislike,
   that makes it so that pressing the regular shortcuts for liking/disliking multiple times has no effect on the state of that button.
   If you want to use the regular shortcuts for removing likes/dislikes as well, leave this blank.                                     */
const codeRemove = "";

// If you want the shortcut to be triggered only when holding ctrl, alt, or shift, change this value from 0 to 1, 2, or 3, respectively.
const combination = 0;

//    /\/\/\   Settings   /\/\/\
//  ------------------------------
//    \/\/\/     Code     \/\/\/

let tag, like, dislike;

const observer = new MutationObserver(findButtons);

addEventListener('yt-page-data-updated', reset);

function reset() {
  isVideo = /^\/watch/.test(location.pathname);
  if (isVideo) {
    removeEventListener("keydown", press);
    like = null; dislike = null;
    observer.observe(document.documentElement, {childList: true, subtree: true});
    findButtons();
  }
}

function findButtons() {
  if (like && dislike) {
    addEventListener("keydown", press);
    observer.disconnect();
  }

  like = document.querySelector('like-button-view-model button');
  dislike = document.querySelector('dislike-button-view-model button');
}

function press(e) {
  if (e.target.getAttribute("contenteditable") === "true") {return;}

  tag = e.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") {return;}

  switch (combination) {
    case 1:
      if (!e.ctrlKey) {return;}
      break;
    case 2:
      if (!e.altKey) {return;}
      break;
    case 3:
      if (!e.shiftKey) {return;}
      break;
  }

  switch (e.code) {
    case codeLike:
      if (like) {
        if (codeRemove && checkPressed(like)) {break;}
        else {like.click();}
      }
    case codeDislike:
      if (dislike) {
        if (codeRemove && checkPressed(dislike)) {break;}
        else {dislike.click();}
      }
      break;
    case codeRemove:
      if (checkPressed(like)) {like.click();}
      else if (checkPressed(dislike)) {dislike.click();}
      break;
  }
}

function checkPressed(element) {
  return (element.getAttribute("aria-pressed") === "true");
}
