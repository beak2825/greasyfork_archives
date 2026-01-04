// ==UserScript==
// @name        Toggle Chat
// @namespace   Violentmonkey Scripts
// @match       https://*.fishtank.live/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @version     1.2
// @author      zurrty
// @license     GNU GPLv3
// @run-at      document-idle
// @description Press X to toggle chat visibility.
// @downloadURL https://update.greasyfork.org/scripts/539758/Toggle%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/539758/Toggle%20Chat.meta.js
// ==/UserScript==
'use strict';

function playSound(src) {
  const audio = document.createElement("audio");
  audio.style.display = "none";
  audio.volume = 0.5;
  audio.src = src;
  document.body.appendChild(audio);

  audio.onended = () => {
    audio.remove();
  };
  audio.play();
}

function setVisible(className, show) {
      document.querySelectorAll(className).forEach(el => {
          el.style.display = show ? '' : 'none';
          el.style.width = show ? '' : '0px';
      });
  }

function isInputFocused() {
  const active = document.activeElement;
  return document.activeElement != null && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
}

let isChat = true;

document.addEventListener("keydown", (e) => {
  if ((e.key === 'x' || e.key === 'X') && !isInputFocused() && !e.repeat) {
    isChat = !isChat;
    setVisible(".layout_right__x_sAY", isChat);
    document.querySelector(".layout_layout__5rz87").style["grid-template-columns"] = isChat ? "" : "var(--left-bar-width) calc(100vw - var(--left-bar-width) - 0px - var(--spacing)) 0px";
    playSound("https://cdn.fishtank.live/sounds/latch-short.wav")
  }
})
