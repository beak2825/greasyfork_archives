// ==UserScript==
// @name        Gartic right column chat
// @namespace   Violentmonkey Scripts
// @description Moves the chat to the right column.
// @icon        https://gartic.io/favicon.ico
// @match       *://gartic.io/*
// @license     Mit
// @version     1.0.5
// @grant       GM_addStyle
// @author      Mops
// @downloadURL https://update.greasyfork.org/scripts/491675/Gartic%20right%20column%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/491675/Gartic%20right%20column%20chat.meta.js
// ==/UserScript==

GM_addStyle(`
#interaction {
  position: static !important;
  margin-top: 5px !important;
}

#chat {
  padding: 5px;
  border: 1px solid #979797;
  position: absolute !important;
  background-color: white;
  resize: horizontal;
  overflow: auto;
  min-width: 120px;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.5);
}

#chat h5 {
  position: static !important;
}

#screenRoom .ctt #interaction .bar {
  background-color: transparent !important;
  margin: 15px 15px 0 0 !important;
}

#chat {
  top: 60px;
  left: 1175px;
  height: 680px;
}

@media screen and (max-height: 753px), screen and (max-width: 1329px) {
  #chat {
    top: 60px;
    left: 990px;
    height: 570px;
  }
}

@media screen and (max-height: 641px), screen and (max-width: 1151px) {
  #chat {
    top: 0px;
    left: 850px;
    height: 505px;
  }
}

.textGame label, .area {
  pointer-events: none !important;
}
.area {
  display: none !important;
}

.textGame input[type=text] {
  height: 22px !important;
}
`)
