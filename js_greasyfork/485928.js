// ==UserScript==
// @name            Hanzipopup - Popup Dictionary for Chinese Language
// @namespace       https://krmanik.github.io/hanzipopup/
// @version         0.0.1
// @description     A port of Zhongwen Chinese-English Pop-Up Dictionary as UserScript for Safari
// @homepageURL     https://krmanik.github.io/hanzipopup/
// @supportURL      https://github.com/krmanik/hanzipopup
// @icon            https://krmanik.github.io/hanzipopup/icon.png
// @match           *://*/*
// @exclude-match   *://*/*/wordlist.*
// @exclude-match   *://*/*/tts.*
// @inject-into     content
// @grant           GM.addStyle
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.xmlHttpRequest
// @license         GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/485928/Hanzipopup%20-%20Popup%20Dictionary%20for%20Chinese%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/485928/Hanzipopup%20-%20Popup%20Dictionary%20for%20Chinese%20Language.meta.js
// ==/UserScript==

/*
 Hanzipopup - A Chinese-English Pop-Up Dictionary UserScript
 Copyright (C) 2024 krmanik
 https://github.com/krmanik/hanzipopup
 
 ---
 
 Zhongwen - A Chinese-English Pop-Up Dictionary
 Copyright (C) 2010-2023 Christian Schiller
 https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde

 ---

 Originally based on Rikaikun 0.8
 Copyright (C) 2010 Erek Speed
 http://code.google.com/p/rikaikun/

 ---

 Originally based on Rikaichan 1.07
 by Jonathan Zarate
 http://www.polarcloud.com/

 ---

 Originally based on RikaiXUL 0.4 by Todd Rudick
 http://www.rikai.com/
 http://rikaixul.mozdev.org/

 ---

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 ---

 Please do not change or remove any of the copyrights or links to web pages
 when modifying any of the files.
 */

 'use strict';

// https://github.com/cschiller/zhongwen
// https://github.com/krmanik/hanzipopup
let style = `
.unselectable {
  -khtml-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
#custom-popup-container {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 200px 28px;
  z-index: 99999999999;
  width: 90%;
  height: 400px;
}
#custom-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 8px 8px 8px 18px;
}
.custom-popup-label {
  display: flex;
  margin-bottom: 2px;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  width: 95%;
  padding-bottom: 4px;
  place-items: center;
  align-items: center;
}
#custom-popup-container a {
  text-decoration: none;
  color: #2196F3;
}
#custom-popup-container input[type=checkbox],
input[type=radio] {
  accent-color: #2196F3;
}
#zhongwenPopupContainer {
  height: 348px;
  overflow-y: scroll;
  margin-left: 20px;
  margin-bottom: 60px;
}
#zhongwenPopupContainer::-webkit-scrollbar {
  width: 6px;
}
#zhongwenPopupContainer::-webkit-scrollbar-track {
  background: #fff;
}
#zhongwenPopupContainer::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 20px;
}
#zhongwenPopupContainer::-webkit-scrollbar-thumb:hover {
  background: #555;
}
@media (prefers-color-scheme: dark) {
  #custom-popup-container {
      background-color: #2f2f2f !important;
      color: #fff;
  }
  #zhongwenPopupContainer {
      select {
        color: #fff;
        background-color: #2f2f2f !important;
        margin: 0;
      }
  }
  #zhongwenPopupContainer::-webkit-scrollbar-track {
    background: #2f2f2f;
  }
}
/* Generic Styles */
#zhongwen-window,
#zhongwen-window * {
  width: auto;
  height: auto;
  background: transparent;
  border: none !important;
  margin: 0px;
  padding: 0px;
  letter-spacing: normal;
  text-align: left;
  text-decoration: none;
  text-indent: 0px;
  text-transform: none;
  white-space: normal;
  word-spacing: normal;
  font-weight: normal;
  font-size: 12px;
  font-family: Tahoma, Geneva, sans-serif;
  visibility: visible;
  line-height: initial;
}
#zhongwen-window {
  position: absolute;
  z-index: 99999999;
  border: 1px solid #d0d0d0 !important;
  padding: 4px;
  background: #e6f4ff;
  top: 5px;
  left: 5px;
  min-width: 100px;
  border-radius: 5px;
  box-shadow: 10px 10px 5px -5px #999999;
}
#zhongwen-window .w-hanzi {
  font-size: 32px;
  margin-right: 0.7em;
}
#zhongwen-window .w-pinyin {
  font-size: 18px;
}
#zhongwen-window .w-def {
  font-size: 16px;
}
#zhongwen-window .w-zhuyin {
  font-family: PMingLiU, 'Apple LiGothic', sans-serif;
  font-size: 16px;
}
#zhongwen-window .w-hanzi-small {
  font-size: 18px;
  margin-right: 0.7em;
}
#zhongwen-window .w-pinyin-small {
  font-size: 16px;
}
#zhongwen-window .w-def-small {
  font-size: 12px;
}
#zhongwen-window .w-zhuyin-small {
  font-family: PMingLiU, 'Apple LiGothic', sans-serif;
  font-size: 12px;
}
#zhongwen-window .grammar {
  font-weight: bold;
}
#zhongwen-window .vocab {
  font-weight: bold;
}
/* Yellow Background */
#zhongwen-window.background-yellow,
#zhongwen-window.background-yellow * {
  color: #000000;
  background: #ffffbf;
}
#zhongwen-window.background-yellow .w-hanzi,
#zhongwen-window.background-yellow .w-hanzi-small {
  color: #7070e0;
}
#zhongwen-window.background-yellow .grammar {
  color: #00008b;
}
#zhongwen-window.background-yellow .vocab {
  color: #00008b;
}
/* Lightblue Background */
#zhongwen-window.background-lightblue,
#zhongwen-window.background-lightblue * {
  color: #000000;
  background: #e6f4ff;
}
#zhongwen-window.background-lightblue .w-hanzi,
#zhongwen-window.background-lightblue .w-hanzi-small {
  color: #3082bf;
}
#zhongwen-window.background-lightblue .w-pinyin,
#zhongwen-window.background-lightblue .w-pinyin-small {
  color: #00b366;
}
#zhongwen-window.background-lightblue .grammar {
  color: #00008b;
}
#zhongwen-window.background-lightblue .vocab {
  color: #00008b;
}
/* Blue Background */
#zhongwen-window.background-blue,
#zhongwen-window.background-blue * {
  color: #ffffff;
  background: #5c73b8;
}
#zhongwen-window.background-blue .w-hanzi,
#zhongwen-window.background-blue .w-hanzi-small {
  color: #b7e7ff;
}
#zhongwen-window.background-blue .w-pinyin,
#zhongwen-window.background-blue .w-pinyin-small {
  color: #c0ffc0;
}
#zhongwen-window.background-blue .grammar {
  color: #add8e6;
}
#zhongwen-window.background-blue .vocab {
  color: #add8e6;
}
/* Black Background */
#zhongwen-window.background-black,
#zhongwen-window.background-black * {
  color: #ffffff;
  background: #000000;
}
#zhongwen-window.background-black .w-hanzi,
#zhongwen-window.background-black .w-hanzi-small {
  color: #7070e0;
}
#zhongwen-window.background-black .w-pinyin,
#zhongwen-window.background-black .w-pinyin-small {
  color: #20a020;
}
#zhongwen-window.background-black .grammar {
  color: #add8e6;
}
#zhongwen-window.background-black .vocab {
  color: #add8e6;
}
/* Standard Tone Colors */
#zhongwen-window.tonecolor-standard .tone1 {
  color: #ee363e;
}
#zhongwen-window.tonecolor-standard .tone2 {
  color: #f47c36;
}
#zhongwen-window.tonecolor-standard .tone3 {
  color: #73bb4f;
}
#zhongwen-window.tonecolor-standard .tone4 {
  color: #649cd3;
}
#zhongwen-window.tonecolor-standard .tone5 {
  color: #a0a0a0;
}
/* Pleco Tone Colors */
#zhongwen-window.tonecolor-pleco .tone1 {
  color: #e30000;
}
#zhongwen-window.tonecolor-pleco .tone2 {
  color: #02b31c;
}
#zhongwen-window.tonecolor-pleco .tone3 {
  color: #1510f0;
}
#zhongwen-window.tonecolor-pleco .tone4 {
  color: #8900bf;
}
#zhongwen-window.tonecolor-pleco .tone5 {
  color: #777777;
}
/* Hanping Tone Colors */
#zhongwen-window.tonecolor-hanping .tone1 {
  color: #64b4ff;
}
#zhongwen-window.tonecolor-hanping .tone2 {
  color: #30b030;
}
#zhongwen-window.tonecolor-hanping .tone3 {
  color: #f08000;
}
#zhongwen-window.tonecolor-hanping .tone4 {
  color: #d00020;
}
#zhongwen-window.tonecolor-hanping .tone5 {
  color: #a0a0a0;
}
#hanzipopup-fab-container,
#custom-popup-container {
  .info-button {
    background: #828282;
    padding: 8px;
    margin: 1px;
    border-radius: 8px;
    color: white;
    text-align: center;
    cursor: pointer;
    border: none;
  }
  #zhongwen-info-buttons {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 64px;
    padding: 4px;
    z-index: 9999999999;
  }
  .option-div {
    margin: 4px 0px 4px 2px;
  }
  .h-icon-btn {
    width: 36px;
    height: 36px;
    position: relative;
    border: none;
    border-radius: 10%;
    cursor: pointer;
    outline: none;
    top: unset;
    left: unset;
    right: unset;
    bottom: unset;
  }
  .h-icon-btn:before {
    content: "";
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 24px;
  }
  .init {
    border-radius: 2px;
    display: inline-flex;
    width: 24px !important;
    height: 24px !important;
    cursor: pointer;
  }
  .init:before {
    left: 0px !important;
    position: absolute;
  }
  .hero:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .enable:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .disable:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .option:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .save:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .view:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .show:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .hide:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M460-320v-320L300-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .tts:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h360l-80 80H160v640h440v-120h80v120q0 33-23.5 56.5T600-80H160Zm80-160v-80h280v80H240Zm0-120v-80h200v80H240Zm360 0L440-520H320v-200h120l160-160v520Zm80-122v-276q36 21 58 57t22 81q0 45-22 81t-58 57Zm0 172v-84q70-25 115-86.5T840-620q0-78-45-139.5T680-846v-84q104 27 172 112.5T920-620q0 112-68 197.5T680-310Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .prev:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M440-760v-80h80v80h-80Zm0 640v-80h80v80h-80ZM280-760v-80h80v80h-80Zm0 640v-80h80v80h-80ZM120-760v-80h80v80h-80Zm0 640v-80h80v80h-80Zm480 0v-80h80v-560h-80v-80h240v80h-80v560h80v80H600ZM280-320 120-480l160-160 56 56-63 64h287v80H273l63 64-56 56Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .next:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M440-120v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80ZM120-120v-80h80v-560h-80v-80h240v80h-80v560h80v80H120Zm560-200-56-56 63-64H400v-80h287l-63-64 56-56 160 160-160 160Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .up:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M240-400v-480h480v480H240Zm80-80h320v-320H320v320Zm320 240v-80h80v80h-80Zm-400 0v-80h80v80h-80ZM640-80v-80h80v80h-80Zm-200 0v-80h80v80h-80Zm-200 0v-80h80v80h-80Zm240-560Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .down:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M240-80v-480h480v480H240Zm80-80h320v-320H320v320Zm-80-480v-80h80v80h-80Zm400 0v-80h80v80h-80ZM240-800v-80h80v80h-80Zm200 0v-80h80v80h-80Zm200 0v-80h80v80h-80ZM480-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .copy:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M120-220v-80h80v80h-80Zm0-140v-80h80v80h-80Zm0-140v-80h80v80h-80ZM260-80v-80h80v80h-80Zm100-160q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480Zm40 240v-80h80v80h-80Zm-200 0q-33 0-56.5-23.5T120-160h80v80Zm340 0v-80h80q0 33-23.5 56.5T540-80ZM120-640q0-33 23.5-56.5T200-720v80h-80Zm420 80Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .alt:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Zm280-40h320v-240H440v240Zm80-80v-80h160v80H520Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .more-info:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m357-384 123-123 123 123 57-56-180-180-180 180 57 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .popup:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm80-280v-80h400v80H280Zm0 160v-80h240v80H280Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .pinyin:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M340-468h56v-82h-56v82ZM101-260l-17-45h39q5 0 9.5-3.5t4.5-8.5v-101l-52 17-11-44 63-19v-90H81v-42h56v-92h44v92h45v42h-46v77l40-13 6 42-46 16v125q0 18-10.5 32.5T142-260h-41Zm139 6-29-32q35-23 57.5-59t23.5-79h-68v-45h72v-81h-54v-41h253v44h-57v83h70l-2 40h-68v165h-44v-165h-58q-2 52-27.5 96.5T240-254Zm193-327-41-10 22-48q11-24 19-49l45 16q-10 23-21.5 45.5T433-581Zm-121-2q-10-23-21-45t-25-42l40-17q14 20 25 42t21 45l-40 17Zm390 249q28 0 54.5-13t48.5-37v-106q-23 3-42.5 7t-36.5 9q-45 14-67.5 35T636-390q0 26 18 41t48 15Zm-23 68q-57 0-90-32.5T556-387q0-52 33-85t106-53q23-6 50.5-11t59.5-9q-2-47-22-68.5T721-635q-26 0-51.5 9.5T604-592l-32-56q33-25 77.5-40.5T740-704q71 0 108 44t37 128v257h-67l-6-45q-28 25-61.5 39.5T679-266Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .font:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M560-160v-520H360v-120h520v120H680v520H560Zm-360 0v-320H80v-120h360v120H320v320H200Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .translate:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .book:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M160-391h45l23-66h104l24 66h44l-97-258h-46l-97 258Zm81-103 38-107h2l38 107h-78Zm319-70v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-499Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .message:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M320-520q17 0 28.5-11.5T360-560q0-17-11.5-28.5T320-600q-17 0-28.5 11.5T280-560q0 17 11.5 28.5T320-520Zm160 0q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm160 0q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .zi:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M560-480h80v-120h-80v120ZM180-160l-20-80h60q8 0 14-6t6-14v-125q-17 7-33 13.5T176-360l-16-78q19-4 39.5-11t40.5-15v-136h-60v-80h60v-120h80v120h60v80h-60v96q15-9 29-18t27-18v80q-12 10-26 19.5T320-423v203q0 23-18.5 41.5T260-160h-80Zm222 0-44-66q42-28 72.5-75t42.5-99h-73v-80h80v-120h-60v-80h360v80h-60v120h80v80h-80v240h-80v-240h-86q-14 71-54.5 136.5T402-160Zm288-490-69-30q16-27 35.5-59t31.5-61l74 27q-15 29-35 62t-37 61Zm-189-8q-17-25-39-55t-42-53l72-34q18 23 38.5 52t37.5 53l-67 37Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
  .close:before {
    position: absolute;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'%3E%3C/path%3E%3C/svg%3E") center / contain no-repeat;
  }
}
@keyframes tts-loading {
  to {
    transform: rotate(360deg);
  }
}
.tts-loading:before {
  content: '' !important;
  box-sizing: border-box !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 20px !important;
  height: 20px !important;
  margin-top: -10px !important;
  margin-left: -10px !important;
  border-radius: 50% !important;
  border: 2px solid #fff !important;
  border-top-color: #ec440e !important;
  animation: tts-loading .6s linear infinite !important;
  -webkit-animation: tts-loading .6s linear infinite !important;
}
#hanzipopup-fab-container {
  position: fixed;
  transform: translate(-50%, -50%);
  bottom: 0px;
  right: 0px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  z-index: 9999999999;
  touch-action: none;
  .fab-btn {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 10%;
      background-color: #585e88;
      color: white;
      z-index: 1000;
      box-shadow: 0px 2px 18px -1px rgba(0, 0, 0, 0.3);
      outline: none;
      border: none;
      cursor: pointer;
  }
  ul {
    li {
      position: absolute;
      top: 0;
      left: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      list-style-type: none;
      transition: .5s;
      border-radius: 10%;
      cursor: pointer;
      margin: 0 auto;
    }
  }
  &.fab-active {
      &.fab-active {
        :nth-child(1) { --nth-child: 1 }
        :nth-child(2) { --nth-child: 2 }
        :nth-child(3) { --nth-child: 3 }
        :nth-child(4) { --nth-child: 4 }
        :nth-child(5) { --nth-child: 5 }
        :nth-child(6) { --nth-child: 6 }
        :nth-child(7) { --nth-child: 7 }
        :nth-child(8) { --nth-child: 8 }
        li {
          top: 0;
        }
        &.left {
          li:nth-child(n+1) {
            left: calc(var(--nth-child) * 40px);
            transition-delay: calc(var(--nth-child) * 0.01s);
          }
        }
        &.right {
          li:nth-child(n+1) {
            left: calc(var(--nth-child) * -40px);
            transition-delay: calc(var(--nth-child) * 0.01s);
          }
        }
      }
    }
}
`;

GM.addStyle(style);

// https://github.com/krmanik/hanzipopup
let defaultConfig = {
    popupColor: 'yellow',
    fontSize: 'small',
    zhuyin: false,
    grammar: true,
    vocab: true,
    simpTrad: 'classic',
    toneColorScheme: 'standard',
    enable: false,
    tts: false,
    prev: false,
    next: false,
    more: false,
    cnTtsEngine: 'browser',
    ttsvoice: "zh-CN-XiaoxiaoNeural",
}

async function setConfig(key, value) {
    let config = await GM.getValue('config', JSON.stringify(defaultConfig));
    config = JSON.parse(config);
    config[key] = value;
    let jsonStr = JSON.stringify(config);
    return await GM.setValue('config', jsonStr);
}

async function getConfig() {
    let config = await GM.getValue('config', null);
    if (config === null) {
        config = JSON.stringify(defaultConfig);
        await GM.setValue('config', config);
        return defaultConfig;
    }
    config = JSON.parse(config);
    return config
}

// https://github.com/cschiller/zhongwen
function altViewInfo() {
    altView = (altView + 1) % 3;
    triggerSearch();
}

function copyToClip() {
    copyToClipboard(getTextForClipboard());
}

function copyToClipboard(data) {
    let txt = document.createElement('textarea');
    txt.style.position = "absolute";
    txt.style.left = "-100%";
    txt.value = data;
    document.body.appendChild(txt);
    txt.select();
    document.execCommand('copy');
    document.body.removeChild(txt);

    showPopup('Copied to clipboard', null, -1, -1);
}

function wordPrev() {
    let offset = selStartDelta;
    selStartDelta = --offset;
    let ret = triggerSearch();
    if (ret === 0) {
        return
    } else if (ret === 2) {
        savedRangeNode = findPreviousTextNode(savedRangeNode.parentNode, savedRangeNode);
        savedRangeOffset = 0;
        offset = savedRangeNode.data.length;
    }
}

function wordNext() {
    selStartDelta += selStartIncrement;
    let ret = triggerSearch();
    if (ret === 0) {
        return;
    } else if (ret === 2) {
        savedRangeNode = findNextTextNode(savedRangeNode.parentNode, savedRangeNode);
        savedRangeOffset = 0;
        selStartDelta = 0;
        selStartIncrement = 0;
    }
}

async function grammarInfo() {
    let config = await getConfig();
    if (config['grammar'] && savedSearchResults.grammar) {
        let sel = encodeURIComponent(window.getSelection().toString());

        // https://resources.allsetlearning.com/chinese/grammar/%E4%B8%AA
        let allset = 'https://resources.allsetlearning.com/chinese/grammar/' + sel;
        infoWindowOpen(allset);
    }
}

async function vocabInfo() {
    let config = await getConfig();
    if (config['vocab'] && savedSearchResults.vocab) {
        let sel = encodeURIComponent(window.getSelection().toString());

        // https://resources.allsetlearning.com/chinese/vocabulary/%E4%B8%AA
        let allset = 'https://resources.allsetlearning.com/chinese/vocabulary/' + sel;
        infoWindowOpen(allset);
    }
}

function tatoebaInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://tatoeba.org/eng/sentences/search?from=cmn&to=eng&query=%E8%BF%9B%E8%A1%8C
    let tatoeba = 'https://tatoeba.org/eng/sentences/search?from=cmn&to=eng&query=' + sel;
    infoWindowOpen(tatoeba);
}

function movePopupUp() {
    altView = 0;
    popY -= 20;
    triggerSearch();
}

function movePopupDown() {
    altView = 0;
    popY += 20;
    triggerSearch();
}

function lineDictInfo() {
    // use the simplified character for linedict lookup
    let simp = savedSearchResults[0][0];

    // https://english.dict.naver.com/english-chinese-dictionary/#/search?query=%E8%AF%8D%E5%85%B8
    let linedict = 'https://english.dict.naver.com/english-chinese-dictionary/#/search?query=' +
        encodeURIComponent(simp);
    infoWindowOpen(linedict);
}

function forvoInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://forvo.com/search/%E4%B8%AD%E6%96%87/zh/
    var forvo = 'https://forvo.com/search/' + sel + '/zh/';
    infoWindowOpen(forvo);

}

function dictInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://dict.cn/%E7%BF%BB%E8%AF%91
    let dictcn = 'https://dict.cn/' + sel;
    infoWindowOpen(dictcn);

}

function icibaInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://www.iciba.com/%E4%B8%AD%E9%A4%90
    let iciba = 'https://www.iciba.com/' + sel;
    infoWindowOpen(iciba);

}

function mdbgInfo() {
    let sel = encodeURIComponent(window.getSelection().toString());

    // https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=%E4%B8%AD%E6%96%87
    let mdbg = 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + sel;
    infoWindowOpen(mdbg);
}

function reversoInfo() {
    let sel = encodeURIComponent(
        window.getSelection().toString());

    let reverso = 'https://context.reverso.net/translation/chinese-english/' + sel;
    infoWindowOpen(reverso);
}

function moedictInfo() {
    // use the traditional character for moedict lookup
    let trad = savedSearchResults[0][1];

    // https://www.moedict.tw/~%E4%B8%AD%E6%96%87
    let moedict = 'https://www.moedict.tw/~' + encodeURIComponent(trad);
    infoWindowOpen(moedict);
}

let infoButtons = [
    { id: 'grammar_info', label: 'Grammar', func: grammarInfo },
    { id: 'vocab_info', label: 'Vocabulary', func: vocabInfo },
    { id: 'tatoeba_info', label: 'Tatoeba', func: tatoebaInfo },
    { id: 'line_dict_info', label: 'Line Dict', func: lineDictInfo },
    { id: 'forvo_info', label: 'Forvo', func: forvoInfo },
    { id: 'dict_info', label: 'Dict.cn', func: dictInfo },
    { id: 'iciba_info', label: 'Iciba', func: icibaInfo },
    { id: 'mdbg_info', label: 'MDBG', func: mdbgInfo },
    { id: 'reverso_info', label: 'Reverso', func: reversoInfo },
    { id: 'moedict_info', label: 'Moedict', func: moedictInfo }
];

const infoButtonContainer = document.createElement('div');
infoButtonContainer.id = 'zhongwen-info-buttons';
infoButtonContainer.style.display = 'none';

async function setupInfoButtons() {
    let config = await getConfig();

    infoButtons.forEach(function (button) {
        let infoButton = createLabelButton(button.label, button.func);
        infoButton.classList.add('info-button');
        infoButton.id = button.id;

        if (!config[button.id]) {
            infoButton.style.display = 'none';
            config[button.id] = false;
        } else {
            infoButton.style.display = 'inline-block';
            config[button.id] = true;
        }
        infoButtonContainer.appendChild(infoButton);
    });
}

async function updateInfoButtons(id) {
    id = id.replace("hanzipopup-", "");

    let config = await getConfig();
    let infoButton = document.querySelector(`#${id}`);

    if (!config[id]) {
        infoButton.style.display = 'none';
    } else {
        infoButton.style.display = 'inline-block';
    }
}

setupInfoButtons();
document.body.appendChild(infoButtonContainer);

function onKeyDown(keyDown) {
    let sel = window.getSelection().toString();
    if (sel.length === 0) {
        return;
    }

    if (keyDown.ctrlKey || keyDown.metaKey) {
        return;
    }

    if (keyDown.keyCode === 27) {
        // esc key pressed
        hidePopup();
        return;
    }

    if (keyDown.altKey && keyDown.keyCode === 87) {
        // Alt + w
        viewWordList();
        return;
    }

    switch (keyDown.keyCode) {
        case 65: // 'a'
            altViewInfo();
            break;
        case 66: // 'b'
            wordPrev();
            break;
        case 67: // 'c'
            copyToClip();
            break;
        case 68: // 'd'
            disableTab();
            break;
        case 71: // 'g'
            grammarInfo();
            break;
        case 77: // 'm'
            selStartIncrement = 1;
        // falls through
        case 78: // 'n'
            wordNext();
            break;
        case 80: // 'p'
            ttsPlay();
            break;
        case 82: // 'r'
            saveWordList();
            break;
        case 84: // 't'
            tatoebaInfo();
            break;
        case 86: // 'v'
            vocabInfo();
            break;
        case 88: // 'x'
            movePopupUp();
            break;
        case 89: // 'y'
            movePopupDown();
            break;
        case 49: // '1'
            lineDictInfo();
            break;
        case 50: // '2'
            forvoInfo();
            break;
        case 51: // '3'
            dictInfo();
            break;
        case 52: // '4'
            icibaInfo();
            break;
        case 53: // '5'
            mdbgInfo();
            break;
        case 54: // '6'
            reversoInfo();
            break;
        case 55: // '7'
            moedictInfo();
            break;
        default:
            return;
    }
}

// https://gist.github.com/likev/c36fcc8a08ba1a2c5d08f9c7d806a0ad
// JS port of https://github.com/Migushthe2nd/MsEdgeTTS

let socket = null;
let ttsText = null;
let ttsWindow = null;
let ttsError = false;
let ttsAudio = new Audio("");

let langList = [{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
    "ShortName": "zh-CN-XiaoxiaoNeural",
    "Gender": "Female",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["News", "Novel"], "VoicePersonalities": ["Warm"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoyiNeural)",
    "ShortName": "zh-CN-XiaoyiNeural",
    "Gender": "Female",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoyi Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Cartoon", "Novel"], "VoicePersonalities": ["Lively"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunjianNeural)",
    "ShortName": "zh-CN-YunjianNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunjian Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Sports", " Novel"], "VoicePersonalities": ["Passion"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
    "ShortName": "zh-CN-YunxiNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunxi Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Novel"], "VoicePersonalities": ["Lively", "Sunshine"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiaNeural)",
    "ShortName": "zh-CN-YunxiaNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunxia Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Cartoon", "Novel"], "VoicePersonalities": ["Cute"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunyangNeural)",
    "ShortName": "zh-CN-YunyangNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Yunyang Online (Natural) - Chinese (Mainland)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["News"], "VoicePersonalities": ["Professional", "Reliable"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN-liaoning, XiaobeiNeural)",
    "ShortName": "zh-CN-liaoning-XiaobeiNeural",
    "Gender": "Female",
    "Locale": "zh-CN-liaoning",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaobei Online (Natural) - Chinese (Northeastern Mandarin)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Dialect"], "VoicePersonalities": ["Humorous"] }
},
{
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN-shaanxi, XiaoniNeural)",
    "ShortName": "zh-CN-shaanxi-XiaoniNeural",
    "Gender": "Female",
    "Locale": "zh-CN-shaanxi",
    "SuggestedCodec": "audio-24khz-48kbitrate-mono-mp3",
    "FriendlyName": "Microsoft Xiaoni Online (Natural) - Chinese (Zhongyuan Mandarin Shaanxi)",
    "Status": "GA",
    "VoiceTag": { "ContentCategories": ["Dialect"], "VoicePersonalities": ["Bright"] }
}];

function create_edge_TTS({ voice = "zh-CN-XiaoxiaoNeural", timeout = 10, auto_reconnect = true } = {}) {
    const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    // const VOICES_URL = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;
    const SYNTH_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;
    const BINARY_DELIM = "Path:audio\r\n";
    const VOICE_LANG_REGEX = /\w{2}-\w{2}/;

    let _outputFormat = "audio-24khz-48kbitrate-mono-mp3";
    let _voiceLocale = 'zh-CN';
    let _voice = voice;
    const _queue = { message: [], url_resolve: {}, url_reject: {} };
    let ready = false;

    function _SSMLTemplate(input) {
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${_voiceLocale}">
                  <voice name="${_voice}">
                      ${input}
                  </voice>
              </speak>`;
    }

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    create_new_ws();

    function setFormat(format) {
        if (format) {
            _outputFormat = format;
        }
        socket.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
                      {
                          "context": {
                              "synthesis": {
                                  "audio": {
                                      "metadataoptions": {
                                          "sentenceBoundaryEnabled": "false",
                                          "wordBoundaryEnabled": "false"
                                      },
                                      "outputFormat": "${_outputFormat}" 
                                  }
                              }
                          }
                      }
                  `);
    }

    async function createURL(requestId) {
        let index_message = 0;
        for (let message of _queue.message) {
            const isbinary = message instanceof Blob;

            if (!isbinary) {
                continue;
            }

            const data = await message.text();
            const Id = /X-RequestId:(.*?)\r\n/gm.exec(data)[1];

            if (Id !== requestId) {
                continue;
            }

            if (data.charCodeAt(0) === 0x00 && data.charCodeAt(1) === 0x67 && data.charCodeAt(2) === 0x58) {
                // Last (empty) audio fragment
                const blob = new Blob(_queue[requestId], { 'type': 'audio/mp3' });
                _queue[requestId] = null;
                const url = URL.createObjectURL(blob);
                _queue.url_resolve[requestId](url);
            } else {
                const index = data.indexOf(BINARY_DELIM) + BINARY_DELIM.length;
                const audioData = message.slice(index);
                _queue[requestId].push(audioData);
                _queue.message[index_message] = null;
            }
            ++index_message;
        }
    }

    function onopen(event) {
        setFormat();
        ready = true;
    }

    async function onmessage(event) {
        const isbinary = event.data instanceof Blob;
        _queue.message.push(event.data)
        if (!isbinary) {
            const requestId = /X-RequestId:(.*?)\r\n/gm.exec(event.data)[1];
            if (event.data.includes("Path:turn.end")) {
                createURL(requestId);
                addLoading(false);
            }
        }
    }

    function onerror(event) {
        ready = false;
        addLoading(false);
    }

    function onclose(event) {
        ready = false;
        addLoading(false);
    }

    function addSocketListeners() {
        socket.addEventListener('open', onopen);
        socket.addEventListener('message', onmessage);
        socket.addEventListener('error', onerror);
        socket.addEventListener('close', onclose);
    }

    function create_new_ws() {
        try {
            if (ttsError) {
                addLoading(false);
                return;
            }

            socket = new WebSocket(SYNTH_URL);

            socket.onerror = function (event) {
                ttsError = true;
                ttsPostMessage();
                addLoading(false);
            }

            addSocketListeners();
        } catch (e) {
            console.log(e);
        }
    }

    let toStream = function (input) {
        let requestSSML = _SSMLTemplate(input);
        const requestId = uuidv4().replaceAll('-', '');
        const request = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n` + requestSSML.trim();

        _queue[requestId] = [];

        return new Promise((resolve, reject) => {
            _queue.url_resolve[requestId] = resolve, _queue.url_reject[requestId] = reject;

            if (!ready) {
                if (auto_reconnect) {
                    create_new_ws();
                    socket.addEventListener('open', _ => socket.send(request));

                    setTimeout(_ => { if (!ready) reject('reconnect timeout') }, timeout * 1000);
                }
                else reject('socket error or timeout');
            } else {
                socket.send(request)
            }
        });
    }

    async function play(input) {
        const url = await toStream(input);
        let play_resolve = function () { };
        ttsAudio.src = url;
        ttsAudio.onended = (e) => {
            addLoading(false);
            play_resolve(true);
        }
        await ttsAudio.play();
        return new Promise((resolve, reject) => {
            play_resolve = resolve
        });
    }

    return new Promise((resolve, reject) => {
        setTimeout(_ => reject('socket open timeout'), timeout * 1000);
        // Connection opened
        socket.addEventListener('open', function (event) {
            resolve({
                play,
                toStream,
                setVoice: (voice, locale) => {
                    _voice = voice;
                    if (!locale) {
                        const voiceLangMatch = VOICE_LANG_REGEX.exec(_voice);
                        if (!voiceLangMatch) {
                            throw new Error("Could not infer voiceLocale from voiceName!");
                        }
                        _voiceLocale = voiceLangMatch[0];
                    } else {
                        _voiceLocale = locale;
                    }
                },
                setFormat,
                isReady: _ => ready
            })
        });
    });
}

function addLoading(add) {
    let speakBtn = document.querySelector("#hanzi-popup-tts-btn > button");
    if (speakBtn) {
        if (add) {
            speakBtn.classList.remove("tts");
            speakBtn.classList.add("tts-loading");
        } else {
            speakBtn.classList.add("tts");
            speakBtn.classList.remove("tts-loading");
        }
    }
}

function ttsPostMessage(ttsText, voice) {
    if (!ttsWindow || ttsWindow.closed) {
        ttsWindow = window.open(`${host}/tts.html`);
    } else {
        ttsWindow.postMessage({ message: "ttsPlay", text: ttsText, voice: voice }, "*");
    }
}

async function edgeTtsPlay(text, voice = "zh-CN-XiaoxiaoNeural") {
    if (text === undefined || text === null || text === '') {
        return;
    }

    addLoading(true);

    if (ttsError) {
        ttsPostMessage(text, voice);
        addLoading(false);
        return;
    }

    ttsText = text;
    const tts = await create_edge_TTS({ voice });

    try {
        await tts.play(text);
    } catch (e) {
        ttsError = true;
        console.log(e);
        addLoading(false);
        // again 
        edgeTtsPlay(text);
    }
}

window.addEventListener("message", function (event) {
    if (event.data.message === "ttsResult") {
        if (!event.data.result) {
            if (confirm("TTS failed. Open Hanzipopup TTS page again?")) {
                if (ttsWindow) {
                    ttsWindow.focus();
                }
            }
        }
    }
});

function enableAutoTTS() {
    if (typeof window === 'undefined') {
        return;
    }
    const isiOS = navigator.userAgent.match(/ipad|iphone/i);
    if (!isiOS) {
        return;
    }
    const simulateSpeech = () => {
        const lecture = new SpeechSynthesisUtterance('hello');
        lecture.volume = 0;
        speechSynthesis.speak(lecture);
        document.removeEventListener('click', simulateSpeech);
    };

    document.addEventListener('click', simulateSpeech);
}

enableAutoTTS();

let savedTarget;
let savedRangeNode;
let savedRangeOffset;
let savedTtsStr;
let selText;
let clientX;
let clientY;
let selStartDelta;
let selStartIncrement;
let popX = 0;
let popY = 0;
let timer;
let altView = 0;
let savedSearchResults = [];
let savedSelStartOffset = 0;
let savedSelEndList = [];
let dict;
let enable = false;
let host = "https://krmanik.github.io/hanzipopup";
let wordListWindow;
let infoWindow;
let clickedTarget;

function createLabel(labelText, icon) {
    let labelIcon = document.createElement('div');
    labelIcon.classList.add("h-icon-btn");
    labelIcon.classList.add("init");
    labelIcon.classList.add(icon.name);
    labelIcon.style.background = icon.color;

    let labelDiv = document.createElement('div');
    labelDiv.style.marginLeft = '4px';
    labelDiv.innerHTML = labelText;
    let label = document.createElement('label');
    label.classList.add("custom-popup-label");
    label.appendChild(labelIcon);
    label.appendChild(labelDiv);
    return label;
}

function createRadioFormGroup(labelText, groupName, options, icon) {
    let formGroup = document.createElement('div');
    formGroup.id = groupName;
    formGroup.style.marginBottom = '20px';
    formGroup.style.textAlign = "left";

    let label = createLabel(labelText, icon);
    formGroup.appendChild(label);

    options.forEach(option => {
        let radioDiv = document.createElement('div');
        radioDiv.classList.add("option-div");

        let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = option.id;
        radioInput.name = groupName;
        radioInput.value = option.value;
        radioInput.addEventListener('change', () => {
            setConfig(groupName, option.value);
        });

        let radioLabel = document.createElement('label');
        radioLabel.style.marginLeft = '4px';
        radioLabel.style.fontSize = '16px';
        radioLabel.htmlFor = option.id;
        radioLabel.innerHTML = option.label;

        radioDiv.appendChild(radioInput);
        radioDiv.appendChild(radioLabel);
        formGroup.appendChild(radioDiv);
    });
    return formGroup;
}

function createCheckboxFormGroup(id, labelText, options, svg) {
    let formGroup = document.createElement('div');
    formGroup.id = id;
    formGroup.style.marginBottom = '20px';
    formGroup.style.textAlign = "left";

    let label = createLabel(labelText, svg);
    formGroup.appendChild(label);

    options.forEach(option => {
        let checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add("option-div");

        let checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.id = `hanzipopup-${option.id}`;
        checkboxInput.name = `hanzipopup-${option.id}`;
        checkboxInput.addEventListener('click', async (e) => {
            setTimeout(async () => {
                await setConfig(option.id, checkboxInput.checked);
            }, 50);
            setTimeout(async () => {
                if (checkboxInput.id === "hanzipopup-more") {
                    let config = await getConfig();
                    let moreInfo = document.querySelector("#hanzipopup-more-info");
                    if (config['more']) {
                        moreInfo.style.display = "block";
                        moreInfo.scrollIntoView();
                    } else {
                        moreInfo.style.display = "none";
                        moreInfo.scrollIntoView();
                    }
                } else if (checkboxInput.id.includes("_info")) {
                    await updateInfoButtons(checkboxInput.id);
                }
                await setupToolbar();
            }, 100);
        });

        let checkboxLabelElem = document.createElement('label');
        checkboxLabelElem.style.marginLeft = "4px";
        checkboxLabelElem.style.fontSize = '16px';
        checkboxLabelElem.htmlFor = option.id;
        checkboxLabelElem.innerHTML = option.label;

        checkboxDiv.appendChild(checkboxInput);
        checkboxDiv.appendChild(checkboxLabelElem);
        formGroup.appendChild(checkboxDiv);
    });
    return formGroup;
}

function createLabelButton(text, clickCallback) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.className = "unselectable";
    button.addEventListener('click', clickCallback);
    return button;
}

async function createLangList(langList) {
    let config = await getConfig();

    let container = document.createElement("div");
    container.style.margin = "8px 0px 8px 20px";
    container.style.width = "80%";
    container.style.display = "inline-block";
    container.id = "tts-voice-select";

    if (!config["tts"]) {
        container.style.display = "none";
    }

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", "voiceSelection");
    labelElement.textContent = "Select voice";

    let selectElement = document.createElement("select");
    selectElement.id = "voiceSelection";
    selectElement.name = "voiceSelection";
    selectElement.style.width = "90%";
    selectElement.addEventListener("change", async (e) => {
        selectElement.value = e.target.value;
        config['ttsvoice'] = selectElement.value;
        await setConfig('ttsvoice', config['ttsvoice']);
    });

    for (let i = 0; i < langList.length; i++) {
        let option = document.createElement("option");
        option.value = langList[i].ShortName;
        option.textContent = langList[i].FriendlyName + " (" + langList[i].Gender + ")";
        selectElement.add(option);
    }

    container.appendChild(labelElement);
    container.appendChild(selectElement);
    document.querySelector("#cnTtsEngineEdge").parentElement.appendChild(container);
}

async function ttsPlay() {
    let hanzi = savedSearchResults[0][0];
    let config = await getConfig();
    let cnTtsEngine = config['cnTtsEngine'] || 'browser';

    if (cnTtsEngine === 'browser') {
        let utterance = new SpeechSynthesisUtterance(hanzi);
        utterance.lang = "zh-CN";
        speechSynthesis.speak(utterance);
    } else {
        edgeTtsPlay(hanzi, config['ttsvoice']);
    }
}

function toggleFeature() {
    if (enable) {
        disableTab();
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#a1a1a1";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "unset";
    } else {
        enableTab();
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "4px solid #31eb3f";
    }
    enable = !enable;
    setConfig('enable', enable);
}

let buttonList = {
    'option': { func: toggleOption, color: "#424769" },
    'view': { func: viewWordList, color: "#3E64FF" },
    'save': { func: saveWordList, color: "#3E64FF" },
    'more-info': { func: toggleMore, color: "#5C6BC0" },
    'next': { func: wordNext, color: "#5C6BC0" },
    'prev': { func: wordPrev, color: "#5C6BC0" },
    'tts': { func: ttsPlay, color: "#5C6BC0" },
    'enable': { func: toggleFeature, color: "#a1a1a1" }
};

const fabContainer = document.createElement("div");
fabContainer.id = "hanzipopup-fab-container";
fabContainer.classList.add('right');
const fabElement = document.createElement('button');
fabElement.id = "hanzipopup-fab-btn";
fabElement.classList.add("h-icon-btn");
fabElement.classList.add("pinyin");
fabElement.classList.add("fab-btn");

async function setupToolbar() {
    let config = await getConfig();

    let elementsToRemove = [];

    if (!config['tts']) {
        elementsToRemove.push('tts');
        document.querySelector("#cnTtsEngine").style.display = "none";
    } else {
        document.querySelector("#cnTtsEngine").style.display = "unset";
        document.querySelector("#cnTtsEngine").value = config['cnTtsEngine'];
    }

    if (!config['prev']) {
        elementsToRemove.push('prev');
    }
    if (!config['next']) {
        elementsToRemove.push('next');
    }
    if (!config['more']) {
        elementsToRemove.push('more-info');
    }

    let filteredButtonList = Object.keys(buttonList).reduce((result, key) => {
        if (!elementsToRemove.includes(key)) {
            result[key] = buttonList[key];
        }
        return result;
    }, {});

    let windowWidth = window.innerWidth;
    fabContainer.style.left = windowWidth - 38 + "px";
    fabContainer.style.top = window.innerHeight - 38 + "px";

    let toolList = document.querySelector("#hanzipopup-tools");
    if (toolList) {
        toolList.innerHTML = "";
    } else {
        toolList = document.createElement("ul");
        toolList.id = "hanzipopup-tools";
    }

    fabContainer.appendChild(toolList);

    for (let key in filteredButtonList) {
        const liElem = document.createElement("li");
        liElem.onclick = filteredButtonList[key].func;
        liElem.id = `hanzi-popup-${key}-btn`

        let icon = document.createElement("button");
        icon.classList.add("h-icon-btn");
        icon.classList.add(key);
        icon.style.background = filteredButtonList[key].color;

        liElem.appendChild(icon)
        toolList.appendChild(liElem);
    }

    if (config['enable']) {
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        document.getElementById("hanzipopup-fab-btn").style.borderBottom = "4px solid #31eb3f";
    }

    let oldPositionX = fabContainer.style.left;
    let oldPositionY = fabContainer.style.top;

    const move = (e) => {
        if (e.type === "touchmove") {
            fabContainer.style.top = e.touches[0].clientY + "px";
            fabContainer.style.left = e.touches[0].clientX + "px";
        } else {
            fabContainer.style.top = e.clientY + "px";
            fabContainer.style.left = e.clientX + "px";
        }
    };

    const mouseDown = (e) => {
        oldPositionY = fabContainer.style.top;
        oldPositionX = fabContainer.style.left;
        if (e.type === "mousedown") {
            window.addEventListener("mousemove", move);
        } else {
            window.addEventListener("touchmove", move);
        }

        fabContainer.style.transition = "none";
    };

    const mouseUp = (e) => {
        if (e.type === "mouseup") {
            window.removeEventListener("mousemove", move);
        } else {
            window.removeEventListener("touchmove", move);
        }
        snapToSide(e);
        fabContainer.style.transition = "0.3s ease-in-out left";
    };

    const snapToSide = (e) => {
        windowWidth = window.innerWidth;
        let currPositionX, currPositionY;

        if (e.type === "touchend") {
            currPositionX = e.changedTouches[0].clientX;
            currPositionY = e.changedTouches[0].clientY;
        } else {
            currPositionX = e.clientX;
            currPositionY = e.clientY;
        }
        if (currPositionY < 38) {
            fabContainer.style.top = 38 + "px";
        }
        if (currPositionX < windowWidth / 2) {
            if (!isFabButtonClicked(e)) {
                return;
            }
            fabContainer.style.left = 30 + "px";
            fabContainer.classList.remove('right');
            fabContainer.classList.add('left');
        } else {
            if (!isFabButtonClicked(e)) {
                return;
            }
            fabContainer.style.left = windowWidth - 38 + "px";
            fabContainer.classList.remove('left');
            fabContainer.classList.add('right');
        }
    };

    fabContainer.addEventListener("mousedown", mouseDown);
    fabContainer.addEventListener("mouseup", mouseUp);
    fabContainer.addEventListener("touchstart", mouseDown);
    fabContainer.addEventListener("touchend", mouseUp);
    fabContainer.addEventListener("click", (e) => {
        // console.log({ oldPositionX, oldPositionY, currentX: fabContainer.style.left, currentY: fabContainer.style.top, clientX: e.clientX, clientY: e.clientY })
        if (oldPositionY === fabContainer.style.top && oldPositionX === fabContainer.style.left) {
            if (isFabButtonClicked(e)) {
                fabContainer.classList.toggle("fab-active");
                return;
            }
        }
    });
    function isFabButtonClicked(e) {
        if (e.target.id === "hanzipopup-fab-btn") {
            return true;
        }
        return false;
    }
}

function toggleMore(e) {
    infoButtonContainer.style.left = e.clientX - 40 + "px";
    if (e.clientY < 400) {
        infoButtonContainer.style.top = e.clientY + 20 + "px";
    } else {
        infoButtonContainer.style.bottom = window.innerHeight - e.clientY + 28 + "px";
    }
    infoButtonContainer.style.display = infoButtonContainer.style.display === 'none' ? 'flex' : 'none';
}

// Background color of the pop-up window
const formGroupColors = createRadioFormGroup('Popup Background Color', 'popupColor',
    [{ id: 'popupColorYellow', value: 'yellow', label: 'Yellow pop-up background' },
    { id: 'popupColorBlue', value: 'blue', label: 'Blue pop-up background' },
    { id: 'popupColorLightBlue', value: 'lightblue', label: 'Light blue pop-up background' },
    { id: 'popupColorBlack', value: 'black', label: 'Black pop-up background' }],
    { name: 'popup', color: "#de4e4e" }
);
formGroupColors.style.marginTop = '8px';

// Coloring pinyin syllables based on the tone of the character
const formGroupToneColors = createRadioFormGroup(
    'Pinyin Color',
    'toneColors',
    [{ id: 'toneColorsStandard', value: 'standard', label: 'Use the default color scheme.' },
    { id: 'toneColorsPleco', value: 'pleco', label: 'Use the <a href="https://pleco.com" target="_blank">Pleco</a> color scheme.' },
    { id: 'toneColorsHanping', value: 'hanping', label: 'Use the <a href="https://hanpingchinese.com/" target="_blank">Hanping</a> color scheme.' },
    { id: 'toneColorsNone', value: 'none', label: 'Don\'t show any tone colors.' }],
    { name: 'pinyin', color: "#34d941" }
);

// Font size of the characters in the pop-up window
const formGroupFontSize = createRadioFormGroup('Font Size', 'fontSize',
    [{ id: 'fontSizeSmall', value: 'small', label: 'Display characters in a smaller font size.' },
    { id: 'fontSizeLarge', value: 'large', label: 'Display characters in a larger font size.' }],
    { name: 'font', color: "#6272cf" }
);

// Simplified and traditional characters
const formGroupSimpTrad = createRadioFormGroup('Simplified & Traditional Characters', 'simpTrad',
    [{ id: 'simpTradClassic', value: 'classic', label: 'Display both simplified and traditional characters.' },
    { id: 'simpTradAuto', value: 'auto', label: 'Use the character style automatically detected on the page (either simplified or traditional).' }],
    { name: 'zi', color: "#ff9800" }
);

// Saving entries to the Built-in Word List
const formGroupSaveToWordList = createRadioFormGroup('Save Words', 'saveToWordList',
    [{ id: 'saveToWordListAllEntries', value: 'allEntries', label: 'Save all entries.' },
    { id: 'saveToWordListFirstEntryOnly', value: 'firstEntryOnly', label: 'Save only the first entry.' }],
    { name: 'save', color: "#3E64FF" }
);

// Saving entries to the Built-in Word List
const formGroupTtsEngine = createRadioFormGroup('Text to Speech Engine', 'cnTtsEngine',
    [{ id: 'cnTtsEngineBrowser', value: 'browser', label: 'Use Browser Speech Synthesis' },
    { id: 'cnTtsEngineEdge', value: 'msedge', label: 'Use MS Edge TTS' }],
    { name: 'tts', color: "#3E64FF" }
);

// Additional Chinese transliterations
const formGroupAdditional = createCheckboxFormGroup('optional-feature', 'Optional Feature',
    [{ id: 'zhuyin', label: 'Show <a href="https://wikipedia.org/wiki/Bopomofo" target="_blank">Zhuyin (Bopomofo)</a> phonetic symbols.' },
    { id: 'tts', label: 'Text to Speech for selected Chinese characters' },
    { id: 'prev', label: 'Select previous Chinese character' },
    { id: 'next', label: 'Select next Chinese character' },
    { id: 'more', label: 'Show more button to display additional information' }],
    { name: 'translate', color: "#ff7043" }
);

// Grammar and usage notes
const formGroupGrammarNotes = createCheckboxFormGroup('grammar-vocab', 'Grammar & Vocabulary Notes', [{ id: 'grammar', label: 'Show grammar and usage notes' }, { id: 'vocab', label: 'Show vocabulary notes' }], { name: 'book', color: "#efa22f" });

const grammarNotesInfo = document.createElement('div');
grammarNotesInfo.style.marginLeft = '4px';
grammarNotesInfo.innerHTML = 'Grammar and usage notes from the <a href="https://resources.allsetlearning.com/chinese/grammar" target="_blank">Chinese Grammar Wiki</a>.';
grammarNotesInfo.innerHTML += '<br>';
grammarNotesInfo.innerHTML += 'Vocabulary notes from the <a href="https://resources.allsetlearning.com/chinese/vocabulary" target="_blank">Chinese Vocabulary Wiki</a>.';
formGroupGrammarNotes.appendChild(grammarNotesInfo);

// More information list button
const formGroupMoreInfo = createCheckboxFormGroup('hanzipopup-more-info', 'More Info', infoButtons, { name: 'message', color: "#4caf50" });

// create header title
const headerTitle = document.createElement('div');
headerTitle.textContent = 'Options';
headerTitle.style.fontSize = '20px';
headerTitle.style.fontWeight = 'bold';

const titleContainer = document.createElement('div');
titleContainer.id = 'custom-title-container';

const closeBtn = document.createElement("button");
closeBtn.classList.add("h-icon-btn");
closeBtn.classList.add("init");
closeBtn.classList.add("close");
closeBtn.style.background = "red";
closeBtn.onclick = toggleOption;

titleContainer.appendChild(headerTitle);
titleContainer.appendChild(closeBtn);

// Create popup container element
const popupContainer = document.createElement('div');
popupContainer.id = 'custom-popup-container';
popupContainer.style.display = 'none';

// Create zhongwen config container element
const zhongwenPopupContainer = document.createElement('div');
zhongwenPopupContainer.id = 'zhongwenPopupContainer';

zhongwenPopupContainer.appendChild(formGroupColors);
zhongwenPopupContainer.appendChild(formGroupToneColors);
zhongwenPopupContainer.appendChild(formGroupFontSize);
zhongwenPopupContainer.appendChild(formGroupSimpTrad);
zhongwenPopupContainer.appendChild(formGroupSaveToWordList);
zhongwenPopupContainer.appendChild(formGroupGrammarNotes);
zhongwenPopupContainer.appendChild(formGroupAdditional);
zhongwenPopupContainer.appendChild(formGroupTtsEngine);
zhongwenPopupContainer.appendChild(formGroupMoreInfo);

popupContainer.appendChild(titleContainer);
popupContainer.appendChild(zhongwenPopupContainer);
document.body.appendChild(popupContainer);
createLangList(langList);
setupToolbar();
fabContainer.append(fabElement);
document.body.appendChild(fabContainer);

// https://github.com/cschiller/zhongwen
class ZhongwenDictionary {

    constructor(wordDict, wordIndex, grammarKeywords, vocabKeywords) {
        this.wordDict = wordDict;
        this.wordIndex = wordIndex;
        this.grammarKeywords = grammarKeywords;
        this.vocabKeywords = vocabKeywords;
        this.cache = {};
    }

    static find(needle, haystack) {

        let beg = 0;
        let end = haystack.length - 1;

        while (beg < end) {
            let mi = Math.floor((beg + end) / 2);
            let i = haystack.lastIndexOf('\n', mi) + 1;

            let mis = haystack.substr(i, needle.length);
            if (needle < mis) {
                end = i - 1;
            } else if (needle > mis) {
                beg = haystack.indexOf('\n', mi + 1) + 1;
            } else {
                return haystack.substring(i, haystack.indexOf('\n', mi + 1));
            }
        }

        return null;
    }

    hasGrammarKeyword(keyword) {
        return this.grammarKeywords[keyword];
    }

    hasVocabKeyword(keyword) {
        return this.vocabKeywords[keyword];
    }

    wordSearch(word, max) {

        let entry = { data: [] };

        let dict = this.wordDict;
        let index = this.wordIndex;

        let maxTrim = max || 7;

        let count = 0;
        let maxLen = 0;

        WHILE:
        while (word.length > 0) {

            let ix = this.cache[word];
            if (!ix) {
                ix = ZhongwenDictionary.find(word + ',', index);
                if (!ix) {
                    this.cache[word] = [];
                    continue;
                }
                ix = ix.split(',');
                this.cache[word] = ix;
            }

            for (let j = 1; j < ix.length; ++j) {
                let offset = ix[j];

                let dentry = dict.substring(offset, dict.indexOf('\n', offset));

                if (count >= maxTrim) {
                    entry.more = 1;
                    break WHILE;
                }

                ++count;
                if (maxLen === 0) {
                    maxLen = word.length;
                }

                entry.data.push([dentry, word]);
            }

            word = word.substr(0, word.length - 1);
        }

        if (entry.data.length === 0) {
            return null;
        }

        entry.matchLen = maxLen;
        return entry;
    }
}

function makeGetRequest(url, responseType = 'text') {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: responseType,
            onload: function (response) {
                if (response.status === 200) {
                    resolve(response.response);
                } else {
                    reject(new Error(`Request failed with status: ${response.status}`));
                }
            },
            onerror: function (error) {
                reject(new Error(`Request failed with error: ${error}`));
            }
        });
    });
}

async function getCedict(url) {
    let arraybuffer = await makeGetRequest(url, 'arraybuffer');
    const { entries } = await unzipit.unzip(new Uint8Array(arraybuffer));
    const arrayBuffer = await entries['cedict_ts.u8'].arrayBuffer();
    const string = new TextDecoder().decode(arrayBuffer);
    return string;
}

async function loadDictData() {
    let wordDict = getCedict(`${host}/data/cedict_ts.zip`);

    // let wordDict = makeGetRequest(`${host}/data/cedict_ts.u8`);
    let wordIndex = makeGetRequest(`${host}/data/cedict.idx`);
    let grammarKeywords = makeGetRequest(`${host}/data/grammarKeywordsMin.json`, 'json');
    let vocabKeywords = makeGetRequest(`${host}/data/vocabularyKeywordsMin.json`, 'json');

    return Promise.all([wordDict, wordIndex, grammarKeywords, vocabKeywords]);
}

async function loadDictionary() {
    const [wordDict, wordIndex, grammarKeywords, vocabKeywords] = await loadDictData();
    return new ZhongwenDictionary(wordDict, wordIndex, grammarKeywords, vocabKeywords);
}

async function loadDict() {
    try {
        if (dict) {
            return;
        }
        dict = await loadDictionary().then(r => dict = r);
        console.log("Dictionary Loaded...");
    } catch (e) {
        disableTab();
        console.log(e);
    }
}

// regular expression for zero-width non-joiner U+200C &zwnj;
let zwnj = /\u200c/g;

function search(text) {

    if (!dict) {
        return;
    }

    let entry = dict.wordSearch(text);

    if (entry) {
        for (let i = 0; i < entry.data.length; i++) {
            let word = entry.data[i][1];
            if (dict.hasGrammarKeyword(word) && (entry.matchLen === word.length)) {
                // the final index should be the last one with the maximum length
                entry.grammar = { keyword: word, index: i };
            }
            if (dict.hasVocabKeyword(word) && (entry.matchLen === word.length)) {
                // the final index should be the last one with the maximum length
                entry.vocab = { keyword: word, index: i };
            }
        }
    }

    return entry;
}

// https://github.com/cschiller/zhongwen
function onMouseMove(mouseMove) {
    clickedTarget = mouseMove.target;

    if(!shouldHidePopup()) {
        return;
    }

    if (clientX && clientY) {
        if (mouseMove.clientX === clientX && mouseMove.clientY === clientY) {
            return;
        }
    }

    clientX = mouseMove.clientX;
    clientY = mouseMove.clientY;

    let range;
    let rangeNode;
    let rangeOffset;

    let moveClientX = mouseMove.clientX;
    let moveClientY = mouseMove.clientY;

    // Handle Chrome and Firefox
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(moveClientX, moveClientY);
        if (range === null) {
            return;
        }
        rangeNode = range.startContainer;
        rangeOffset = range.startOffset;
    } else if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(moveClientX, moveClientY);
        if (range === null) {
            return;
        }
        rangeNode = range.offsetNode;
        rangeOffset = range.offset;
    }

    if (mouseMove.target === savedTarget) {
        if (rangeNode === savedRangeNode && rangeOffset === savedRangeOffset) {
            return;
        }
    }

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    if (rangeNode.data && rangeOffset === rangeNode.data.length) {
        rangeNode = findNextTextNode(rangeNode.parentNode, rangeNode);
        rangeOffset = 0;
    }

    if (!rangeNode || rangeNode.parentNode !== mouseMove.target) {
        rangeNode = null;
        rangeOffset = -1;
    }

    savedTarget = mouseMove.target;
    savedRangeNode = rangeNode;
    savedRangeOffset = rangeOffset;

    selStartDelta = 0;
    selStartIncrement = 1;

    if (rangeNode && rangeNode.data && rangeOffset < rangeNode.data.length) {
        popX = mouseMove.clientX;
        popY = mouseMove.clientY;
        timer = setTimeout(() => triggerSearch(), 50);
        return;
    }

    // Don't close just because we moved from a valid pop-up slightly over to a place with nothing.
    let dx = popX - mouseMove.clientX;
    let dy = popY - mouseMove.clientY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 4) {
        clearHighlight();
        hidePopup();
    }
}

async function triggerSearch() {

    let rangeNode = savedRangeNode;
    let selStartOffset = savedRangeOffset + selStartDelta;

    selStartIncrement = 1;

    if (!rangeNode) {
        // clearHighlight();
        hidePopup();
        return 1;
    }

    if (selStartOffset < 0 || rangeNode.data.length <= selStartOffset) {
        // clearHighlight();
        hidePopup();
        return 2;
    }

    let u = rangeNode.data.charCodeAt(selStartOffset);

    let isChineseCharacter = !isNaN(u) && (
        u === 0x25CB ||
        (0x3400 <= u && u <= 0x9FFF) ||
        (0xF900 <= u && u <= 0xFAFF) ||
        (0xFF21 <= u && u <= 0xFF3A) ||
        (0xFF41 <= u && u <= 0xFF5A) ||
        (0xD800 <= u && u <= 0xDFFF)
    );

    if (!isChineseCharacter) {
        clearHighlight();
        hidePopup();
        return 3;
    }

    let selEndList = [];
    let originalText = getText(rangeNode, selStartOffset, selEndList, 30 /*maxlength*/);

    // Workaround for Google Docs: remove zero-width non-joiner &zwnj;
    let text = originalText.replace(zwnj, '');

    savedSelStartOffset = selStartOffset;
    savedSelEndList = selEndList;

    let result = search(text);
    result.originalText = originalText;

    processSearchResult(result);

    return 0;
}

async function processSearchResult(result) {

    let selStartOffset = savedSelStartOffset;
    let selEndList = savedSelEndList;

    if (!result) {
        hidePopup();
        clearHighlight();
        return;
    }

    let highlightLength;
    let index = 0;
    for (let i = 0; i < result.matchLen; i++) {
        // Google Docs workaround: determine the correct highlight length
        while (result.originalText[index] === '\u200c') {
            index++;
        }
        index++;
    }
    highlightLength = index;

    selStartIncrement = result.matchLen;
    selStartDelta = (selStartOffset - savedRangeOffset);

    let rangeNode = savedRangeNode;
    // don't try to highlight form elements
    if (!('form' in savedTarget)) {
        let doc = rangeNode.ownerDocument;
        if (!doc) {
            clearHighlight();
            hidePopup();
            return;
        }
        highlightMatch(doc, rangeNode, selStartOffset, highlightLength, selEndList);
    }

    let config = await getConfig();
    showPopup(await makeHtml(result, config.toneColorScheme), savedTarget, popX, popY, false);
}

// modifies selEndList as a side-effect
function getText(startNode, offset, selEndList, maxLength) {
    let text = '';
    let endIndex;

    if (startNode.nodeType !== Node.TEXT_NODE) {
        return '';
    }

    endIndex = Math.min(startNode.data.length, offset + maxLength);
    text += startNode.data.substring(offset, endIndex);
    selEndList.push({
        node: startNode,
        offset: endIndex
    });

    let nextNode = startNode;
    while ((text.length < maxLength) && ((nextNode = findNextTextNode(nextNode.parentNode, nextNode)) !== null)) {
        text += getTextFromSingleNode(nextNode, selEndList, maxLength - text.length);
    }

    return text;
}

// modifies selEndList as a side-effect
function getTextFromSingleNode(node, selEndList, maxLength) {
    let endIndex;

    if (node.nodeName === '#text') {
        endIndex = Math.min(maxLength, node.data.length);
        selEndList.push({
            node: node,
            offset: endIndex
        });
        return node.data.substring(0, endIndex);
    } else {
        return '';
    }
}

function highlightMatch(doc, rangeStartNode, rangeStartOffset, matchLen, selEndList) {
    if (!selEndList || selEndList.length === 0) return;

    let selEnd;
    let offset = rangeStartOffset + matchLen;

    for (let i = 0, len = selEndList.length; i < len; i++) {
        selEnd = selEndList[i];
        if (offset <= selEnd.offset) {
            break;
        }
        offset -= selEnd.offset;
    }

    let range = doc.createRange();
    range.setStart(rangeStartNode, rangeStartOffset);
    range.setEnd(selEnd.node, offset);

    let sel = window.getSelection();
    if (!sel.isCollapsed && selText !== sel.toString())
        return;
    sel.empty();
    sel.addRange(range);
    selText = sel.toString();
    return selText;
}

function getTextForClipboard() {
    let result = '';
    for (let i = 0; i < savedSearchResults.length; i++) {
        result += savedSearchResults[i].slice(0, -1).join('\t');
        result += '\n';
    }
    return result;
}

function clearHighlight() {

    if (selText === null) {
        return;
    }

    let selection = window.getSelection();
    if (selection.isCollapsed || selText === selection.toString()) {
        selection.empty();
    }
    selText = null;
}

function findNextTextNode(root, previous) {
    if (root === null) {
        return null;
    }
    let nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, null);
    let node = nodeIterator.nextNode();
    while (node !== previous) {
        node = nodeIterator.nextNode();
        if (node === null) {
            return findNextTextNode(root.parentNode, previous);
        }
    }
    let result = nodeIterator.nextNode();
    if (result !== null) {
        return result;
    } else {
        return findNextTextNode(root.parentNode, previous);
    }
}

function findPreviousTextNode(root, previous) {
    if (root === null) {
        return null;
    }
    let nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, null);
    let node = nodeIterator.nextNode();
    while (node !== previous) {
        node = nodeIterator.nextNode();
        if (node === null) {
            return findPreviousTextNode(root.parentNode, previous);
        }
    }
    nodeIterator.previousNode();
    let result = nodeIterator.previousNode();
    if (result !== null) {
        return result;
    } else {
        return findPreviousTextNode(root.parentNode, previous);
    }
}

// https://github.com/cschiller/zhongwen
function enableTab() {
    document.addEventListener('mousedown', onMouseMove);
    document.addEventListener('touchstart', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
}

function disableTab() {
    document.removeEventListener('mousedown', onMouseMove);
    document.removeEventListener('touchstart', onMouseMove);
    document.removeEventListener('keydown', onKeyDown);

    let popup = document.getElementById('zhongwen-window');
    if (popup) {
        popup.parentNode.removeChild(popup);
    }

    clearHighlight();
}

function saveWordList() {
    let entries = [];
    for (let j = 0; j < savedSearchResults.length; j++) {
        let entry = {
            simplified: savedSearchResults[j][0],
            traditional: savedSearchResults[j][1],
            pinyin: savedSearchResults[j][2],
            definition: savedSearchResults[j][3]
        };
        entries.push(entry);
    }

    if (wordListWindow && !wordListWindow.closed) {
        wordListWindow.postMessage({ message: "requestResult", entries: entries }, "*");
    } else {
        wordListWindow = window.open(`${host}/wordlist.html`);
    }

    let interval = setInterval(function () {
        try {
            wordListWindow.postMessage({ message: "requestResult", entries: entries }, "*");
        } catch (e) {
            if (wordListWindow.closed) {
                clearInterval(interval);
                return;
            }
        }
    }, 500);

    window.addEventListener("message", function (event) {
        if (event.data.message === "deliverResult") {
            clearInterval(interval);
            wordListWindow.postMessage({ message: "refreshPage", refresh: true }, "*");
        }
    }, false);

    showPopup(`Added to word list.<p>Press View button to open word list.`, null, -1, -1);
}

function viewWordList() {
    // Alt + w
    if (!wordListWindow) {
        wordListWindow = window.open(`${host}/wordlist.html`);
    } else {
        wordListWindow.focus();
        wordListWindow.location.href = `${host}/wordlist.html`;
    }
}

function infoWindowOpen(url) {
    if (!infoWindow || infoWindow.closed) {
        infoWindow = window.open(url);
    } else {
        infoWindow.location.href = url;
        infoWindow.focus();
    }
}

function toggleOption() {
    popupContainer.style.display = (popupContainer.style.display === 'none' || popupContainer.style.display === '') ? 'block' : 'none';
}

async function loadVals() {
    let config = await getConfig();

    const popupColor = config['popupColor'] || 'yellow';
    document.querySelector(`input[name="popupColor"][value="${popupColor}"]`).checked = true;

    const toneColorScheme = config['toneColorScheme'] || 'standard';
    if (toneColorScheme === 'none') {
        document.querySelector('#toneColorsNone').checked = true;
    } else {
        document.querySelector(`input[name="toneColors"][value="${toneColorScheme}"]`).checked = true;
    }

    const fontSize = config['fontSize'] || 'small';
    document.querySelector(`input[name="fontSize"][value="${fontSize}"]`).checked = true;

    const simpTrad = config['simpTrad'] || 'classic';
    document.querySelector(`input[name="simpTrad"][value="${simpTrad}"]`).checked = true;

    const saveToWordList = config['saveToWordList'] || 'allEntries';
    document.querySelector(`input[name="saveToWordList"][value="${saveToWordList}"]`).checked = true;

    const cnTtsEngine = config['cnTtsEngine'] || 'browser';
    document.querySelector(`input[name="cnTtsEngine"][value="${cnTtsEngine}"]`).checked = true;

    document.querySelector('#hanzipopup-grammar').checked = config['grammar'];
    document.querySelector('#hanzipopup-vocab').checked = config['vocab'];
    document.querySelector('#hanzipopup-zhuyin').checked = config['zhuyin'];
    document.querySelector('#hanzipopup-tts').checked = config['tts'];
    document.querySelector('#hanzipopup-prev').checked = config['prev'];
    document.querySelector('#hanzipopup-next').checked = config['next'];
    document.querySelector('#hanzipopup-more').checked = config['more'];

    infoButtons.forEach(function (button) {
        document.querySelector(`#hanzipopup-${button.id}`).checked = config[button.id];
    });

    if (config['ttsvoice']) {
        document.querySelector("#voiceSelection").value = config['ttsvoice'];
    } else {
        config['ttsvoice'] = "zh-CN-XiaoxiaoNeural";
        document.querySelector("#voiceSelection").value = "zh-CN-XiaoxiaoNeural";
        await setConfig('ttsvoice', config['ttsvoice']);
    }

    if (config['more']) {
        document.querySelector("#hanzipopup-more-info").style.display = "block";
    } else {
        document.querySelector("#hanzipopup-more-info").style.display = "none";
    }
}

function shouldHidePopup() {
    if (clickedTarget.tagName === "BUTTON") {
        return false;
    }
    return true;
}

// https://github.com/cschiller/zhongwen
async function showPopup(html, elem, x, y, looseWidth) {
    let config = await getConfig();

    if (!x || !y) {
        x = y = 0;
    }

    let popup = document.getElementById('zhongwen-window');

    if (!popup) {
        popup = document.createElement('div');
        popup.setAttribute('id', 'zhongwen-window');
        document.body.appendChild(popup);
    }

    popup.style.width = 'auto';
    popup.style.height = 'auto';
    popup.style.maxWidth = (looseWidth ? '' : '600px');
    popup.className = `background-${config.popupColor} tonecolor-${config.toneColorScheme}`;

    popup.innerHTML = html;

    if (elem) {
        popup.style.top = '-1000px';
        popup.style.left = '0px';
        popup.style.display = '';

        let pW = popup.offsetWidth;
        let pH = popup.offsetHeight;

        if (pW <= 0) {
            pW = 200;
        }
        if (pH <= 0) {
            pH = 0;
            let j = 0;
            while ((j = html.indexOf('<br/>', j)) !== -1) {
                j += 5;
                pH += 22;
            }
            pH += 25;
        }

        if (altView === 1) {
            x = window.scrollX;
            y = window.scrollY;
        } else if (altView === 2) {
            x = (window.innerWidth - (pW + 20)) + window.scrollX;
            y = (window.innerHeight - (pH + 20)) + window.scrollY;
        } else if (elem instanceof window.HTMLOptionElement) {

            x = 0;
            y = 0;

            let p = elem;
            while (p) {
                x += p.offsetLeft;
                y += p.offsetTop;
                p = p.offsetParent;
            }

            if (elem.offsetTop > elem.parentNode.clientHeight) {
                y -= elem.offsetTop;
            }

            if (x + popup.offsetWidth > window.innerWidth) {
                // too much to the right, go left
                x -= popup.offsetWidth + 5;
                if (x < 0) {
                    x = 0;
                }
            } else {
                // use SELECT's width
                x += elem.parentNode.offsetWidth + 5;
            }
        } else {
            // go left if necessary
            if (x + pW > window.innerWidth - 20) {
                x = (window.innerWidth - pW) - 20;
                if (x < 0) {
                    x = 0;
                }
            }

            // below the mouse
            let v = 25;

            // go up if necessary
            if (y + v + pH > window.innerHeight) {
                let t = y - pH - 30;
                if (t >= 0) {
                    y = t;
                }
            } else {
                y += v;
            }

            x += window.scrollX;
            y += window.scrollY;
        }
    } else {
        x += window.scrollX;
        y += window.scrollY;
    }

    // (-1, -1) indicates: leave position unchanged
    if (x !== -1 && y !== -1) {
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        popup.style.display = '';
    }
}

async function makeHtml(result, showToneColors) {
    let config = await getConfig();

    let entry;
    let html = '';
    let texts = [];
    let hanziClass;

    if (result === null) return '';

    for (let i = 0; i < result.data.length; ++i) {
        entry = result.data[i][0].match(/^([^\s]+?)\s+([^\s]+?)\s+\[(.*?)\]?\s*\/(.+)\//);

        if (!entry) continue;

        // Hanzi

        if (config.simpTrad === 'auto') {

            let word = result.data[i][1];

            hanziClass = 'w-hanzi';
            if (config.fontSize === 'small') {
                hanziClass += '-small';
            }
            html += '<span class="' + hanziClass + '">' + word + '</span>&nbsp;';

        } else {

            hanziClass = 'w-hanzi';
            if (config.fontSize === 'small') {
                hanziClass += '-small';
            }
            html += '<span class="' + hanziClass + '">' + entry[2] + '</span>&nbsp;';
            if (entry[1] !== entry[2]) {
                html += '<span class="' + hanziClass + '">' + entry[1] + '</span>&nbsp;';
            }

        }

        // Pinyin

        let pinyinClass = 'w-pinyin';
        if (config.fontSize === 'small') {
            pinyinClass += '-small';
        }
        let p = await pinyinAndZhuyin(entry[3], showToneColors, pinyinClass);
        html += p[0];

        // Zhuyin

        if (config.zhuyin) {
            html += '<br>' + p[2];
        }

        // Definition

        let defClass = 'w-def';
        if (config.fontSize === 'small') {
            defClass += '-small';
        }
        let translation = entry[4].replace(/\//g, ' ◆ ');
        html += '<br><span class="' + defClass + '">' + translation + '</span><br>';

        let addFinalBr = false;

        // Grammar
        if (config['grammar'] && result.grammar && result.grammar.index === i) {
            html += '<br><span class="grammar">Press "g" for grammar and usage notes.</span><br>';
            addFinalBr = true;
        }

        // Vocab
        if (config['vocab'] && result.vocab && result.vocab.index === i) {
            html += '<br><span class="vocab">Press "v" for vocabulary notes.</span><br>';
            addFinalBr = true;
        }

        if (addFinalBr) {
            html += '<br>';
        }

        texts[i] = [entry[2], entry[1], p[1], translation, entry[3]];
    }
    if (result.more) {
        html += '&hellip;<br/>';
    }

    savedSearchResults = texts;
    savedSearchResults.grammar = result.grammar;
    savedSearchResults.vocab = result.vocab;

    return html;
}

function hidePopup() {
    if(!shouldHidePopup()) {
        return;
    }

    let popup = document.getElementById('zhongwen-window');
    if (popup) {
        popup.style.display = 'none';
        popup.textContent = '';
    }
}

// https://github.com/cschiller/zhongwen
let tones = {
    1: '&#772;',
    2: '&#769;',
    3: '&#780;',
    4: '&#768;',
    5: ''
};

let utones = {
    1: '\u0304',
    2: '\u0301',
    3: '\u030C',
    4: '\u0300',
    5: ''
};

function parse(s) {
    return s.match(/([^AEIOU:aeiou]*)([AEIOUaeiou:]+)([^aeiou:]*)([1-5])/);
}

function tonify(vowels, tone) {
    let html = '';
    let text = '';

    if (vowels === 'ou') {
        html = 'o' + tones[tone] + 'u';
        text = 'o' + utones[tone] + 'u';
    } else {
        let tonified = false;
        for (let i = 0; i < vowels.length; i++) {
            let c = vowels.charAt(i);
            html += c;
            text += c;
            if (c === 'a' || c === 'e') {
                html += tones[tone];
                text += utones[tone];
                tonified = true;
            } else if (i === vowels.length - 1 && !tonified) {
                html += tones[tone];
                text += utones[tone];
                tonified = true;
            }
        }
        html = html.replace(/u:/, '&uuml;');
        text = text.replace(/u:/, '\u00FC');
    }

    return [html, text];
}

async function pinyinAndZhuyin(syllables, showToneColors, pinyinClass) {
    let config = await getConfig();

    let text = '';
    let html = '';
    let zhuyin = '';
    let a = syllables.split(/[\s·]+/);
    for (let i = 0; i < a.length; i++) {
        let syllable = a[i];

        // ',' in pinyin
        if (syllable === ',') {
            html += ' ,';
            text += ' ,';
            continue;
        }

        if (i > 0) {
            html += '&nbsp;';
            text += ' ';
            zhuyin += '&nbsp;';
        }
        if (syllable === 'r5') {
            if (showToneColors) {
                html += '<span class="' + pinyinClass + ' tone5">r</span>';
            } else {
                html += '<span class="' + pinyinClass + '">r</span>';
            }
            text += 'r';
            continue;
        }
        if (syllable === 'xx5') {
            if (showToneColors) {
                html += '<span class="' + pinyinClass + ' tone5">??</span>';
            } else {
                html += '<span class="' + pinyinClass + '">??</span>';
            }
            text += '??';
            continue;
        }
        let m = parse(syllable);
        if (showToneColors) {
            html += '<span class="' + pinyinClass + ' tone' + m[4] + '">';
        } else {
            html += '<span class="' + pinyinClass + '">';
        }
        let t = tonify(m[2], m[4]);
        html += m[1] + t[0] + m[3];
        html += '</span>';
        text += m[1] + t[1] + m[3];

        let zhuyinClass = 'w-zhuyin';
        if (config.fontSize === 'small') {
            zhuyinClass += '-small';
        }

        zhuyin += '<span class="tone' + m[4] + ' ' + zhuyinClass + '">'
            + numericPinyin2Zhuyin(syllable) + '</span>';
    }
    return [html, text, zhuyin];
}

const zhuyinTones = ['?', '', '\u02CA', '\u02C7', '\u02CB', '\u30FB'];

const pinyinTones = {
    1: '\u0304',
    2: '\u0301',
    3: '\u030C',
    4: '\u0300',
    5: ''
};

const zhuyinMap = {
    'a': '\u311a',
    'ai': '\u311e',
    'an': '\u3122',
    'ang': '\u3124',
    'ao': '\u3120',
    'ba': '\u3105\u311a',
    'bai': '\u3105\u311e',
    'ban': '\u3105\u3122',
    'bang': '\u3105\u3124',
    'bao': '\u3105\u3120',
    'bei': '\u3105\u311f',
    'ben': '\u3105\u3123',
    'beng': '\u3105\u3125',
    'bi': '\u3105\u3127',
    'bian': '\u3105\u3127\u3122',
    'biao': '\u3105\u3127\u3120',
    'bie': '\u3105\u3127\u311d',
    'bin': '\u3105\u3127\u3123',
    'bing': '\u3105\u3127\u3125',
    'bo': '\u3105\u311b',
    'bu': '\u3105\u3128',
    'ca': '\u3118\u311a',
    'cai': '\u3118\u311e',
    'can': '\u3118\u3122',
    'cang': '\u3118\u3124',
    'cao': '\u3118\u3120',
    'ce': '\u3118\u311c',
    'cen': '\u3118\u3123',
    'ceng': '\u3118\u3125',
    'cha': '\u3114\u311a',
    'chai': '\u3114\u311e',
    'chan': '\u3114\u3122',
    'chang': '\u3114\u3124',
    'chao': '\u3114\u3120',
    'che': '\u3114\u311c',
    'chen': '\u3114\u3123',
    'cheng': '\u3114\u3125',
    'chi': '\u3114',
    'chong': '\u3114\u3128\u3125',
    'chou': '\u3114\u3121',
    'chu': '\u3114\u3128',
    'chua': '\u3114\u3128\u311a',
    'chuai': '\u3114\u3128\u311e',
    'chuan': '\u3114\u3128\u3122',
    'chuang': '\u3114\u3128\u3124',
    'chui': '\u3114\u3128\u311f',
    'chun': '\u3114\u3128\u3123',
    'chuo': '\u3114\u3128\u311b',
    'ci': '\u3118',
    'cong': '\u3118\u3128\u3125',
    'cou': '\u3118\u3121',
    'cu': '\u3118\u3128',
    'cuan': '\u3118\u3128\u3122',
    'cui': '\u3118\u3128\u311f',
    'cun': '\u3118\u3128\u3123',
    'cuo': '\u3118\u3128\u311b',
    'da': '\u3109\u311a',
    'dai': '\u3109\u311e',
    'dan': '\u3109\u3122',
    'dang': '\u3109\u3124',
    'dao': '\u3109\u3120',
    'de': '\u3109\u311c',
    'dei': '\u3109\u311f',
    'den': '\u3109\u3123',
    'deng': '\u3109\u3125',
    'di': '\u3109\u3127',
    'dian': '\u3109\u3127\u3122',
    'diang': '\u3109\u3127\u3124',
    'diao': '\u3109\u3127\u3120',
    'die': '\u3109\u3127\u311d',
    'ding': '\u3109\u3127\u3125',
    'diu': '\u3109\u3127\u3121',
    'dong': '\u3109\u3128\u3125',
    'dou': '\u3109\u3121',
    'du': '\u3109\u3128',
    'duan': '\u3109\u3128\u3122',
    'dui': '\u3109\u3128\u311f',
    'dun': '\u3109\u3128\u3123',
    'duo': '\u3109\u3128\u311b',
    'e': '\u311c',
    'ei': '\u311f',
    'en': '\u3123',
    'er': '\u3126',
    'fa': '\u3108\u311a',
    'fan': '\u3108\u3122',
    'fang': '\u3108\u3124',
    'fei': '\u3108\u311f',
    'fen': '\u3108\u3123',
    'feng': '\u3108\u3125',
    'fo': '\u3108\u311b',
    'fou': '\u3108\u3121',
    'fu': '\u3108\u3128',
    'ga': '\u310d\u311a',
    'gai': '\u310d\u311e',
    'gan': '\u310d\u3122',
    'gang': '\u310d\u3124',
    'gao': '\u310d\u3120',
    'ge': '\u310d\u311c',
    'gei': '\u310d\u311f',
    'gen': '\u310d\u3123',
    'geng': '\u310d\u3125',
    'gong': '\u310d\u3128\u3125',
    'gou': '\u310d\u3121',
    'gu': '\u310d\u3128',
    'gua': '\u310d\u3128\u311a',
    'guai': '\u310d\u3128\u311e',
    'guan': '\u310d\u3128\u3122',
    'guang': '\u310d\u3128\u3124',
    'gui': '\u310d\u3128\u311f',
    'gun': '\u310d\u3128\u3123',
    'guo': '\u310d\u3128\u311b',
    'ha': '\u310f\u311a',
    'hai': '\u310f\u311e',
    'han': '\u310f\u3122',
    'hang': '\u310f\u3124',
    'hao': '\u310f\u3120',
    'he': '\u310f\u311c',
    'hei': '\u310f\u311f',
    'hen': '\u310f\u3123',
    'heng': '\u310f\u3125',
    'hong': '\u310f\u3128\u3125',
    'hou': '\u310f\u3121',
    'hu': '\u310f\u3128',
    'hua': '\u310f\u3128\u311a',
    'huai': '\u310f\u3128\u311e',
    'huan': '\u310f\u3128\u3122',
    'huang': '\u310f\u3128\u3124',
    'hui': '\u310f\u3128\u311f',
    'hun': '\u310f\u3128\u3123',
    'huo': '\u310f\u3128\u311b',
    'ji': '\u3110\u3127',
    'jia': '\u3110\u3127\u311a',
    'jian': '\u3110\u3127\u3122',
    'jiang': '\u3110\u3127\u3124',
    'jiao': '\u3110\u3127\u3120',
    'jie': '\u3110\u3127\u311d',
    'jin': '\u3110\u3127\u3123',
    'jing': '\u3110\u3127\u3125',
    'jiong': '\u3110\u3129\u3125',
    'jiu': '\u3110\u3127\u3121',
    'ju': '\u3110\u3129',
    'juan': '\u3110\u3129\u3122',
    'jue': '\u3110\u3129\u311d',
    'jun': '\u3110\u3129\u3123',
    'ka': '\u310e\u311a',
    'kai': '\u310e\u311e',
    'kan': '\u310e\u3122',
    'kang': '\u310e\u3124',
    'kao': '\u310e\u3120',
    'ke': '\u310e\u311c',
    'ken': '\u310e\u3123',
    'keng': '\u310e\u3125',
    'kong': '\u310e\u3128\u3125',
    'kou': '\u310e\u3121',
    'ku': '\u310e\u3128',
    'kua': '\u310e\u3128\u311a',
    'kuai': '\u310e\u3128\u311e',
    'kuan': '\u310e\u3128\u3122',
    'kuang': '\u310e\u3128\u3124',
    'kui': '\u310e\u3128\u311f',
    'kun': '\u310e\u3128\u3123',
    'kuo': '\u310e\u3128\u311b',
    'la': '\u310c\u311a',
    'lai': '\u310c\u311e',
    'lan': '\u310c\u3122',
    'lang': '\u310c\u3124',
    'lao': '\u310c\u3120',
    'le': '\u310c\u311c',
    'lei': '\u310c\u311f',
    'leng': '\u310c\u3125',
    'li': '\u310c\u3127',
    'lia': '\u310c\u3127\u311a',
    'lian': '\u310c\u3127\u3122',
    'liang': '\u310c\u3127\u3124',
    'liao': '\u310c\u3127\u3120',
    'lie': '\u310c\u3127\u311d',
    'lin': '\u310c\u3127\u3123',
    'ling': '\u310c\u3127\u3125',
    'liu': '\u310c\u3127\u3121',
    'lo': '\u310c\u311b',
    'long': '\u310c\u3128\u3125',
    'lou': '\u310c\u3121',
    'lu': '\u310c\u3128',
    'lu:': '\u310c\u3129',
    'luan': '\u310c\u3128\u3123',
    'lu:e': '\u310c\u3129\u311d',
    'lun': '\u310c\u3129',
    'lu:n': '\u310c\u3129\u3123',
    'luo': '\u310c\u3129\u3123',
    'ma': '\u3107\u311a',
    'mai': '\u3107\u311e',
    'man': '\u3107\u3122',
    'mang': '\u3107\u3124',
    'mao': '\u3107\u3120',
    'me': '\u3107\u311c',
    'mei': '\u3107\u311f',
    'men': '\u3107\u3123',
    'meng': '\u3107\u3125',
    'mi': '\u3107\u3127',
    'mian': '\u3107\u3127\u3122',
    'miao': '\u3107\u3127\u3120',
    'mie': '\u3107\u3127\u311d',
    'min': '\u3107\u3127\u3123',
    'ming': '\u3107\u3127\u3125',
    'miu': '\u3107\u3127\u3121',
    'mo': '\u3107\u311b',
    'mou': '\u3107\u3121',
    'mu': '\u3107\u3128',
    'na': '\u310b\u311a',
    'nai': '\u310b\u311e',
    'nan': '\u310b\u3122',
    'nang': '\u310b\u3124',
    'nao': '\u310b\u3120',
    'ne': '\u310b\u311c',
    'nei': '\u310b\u311f',
    'nen': '\u310b\u3123',
    'neng': '\u310b\u3125',
    'ni': '\u310b\u3127',
    'nia': '\u310b\u3127\u311a',
    'nian': '\u310b\u3127\u3122',
    'niang': '\u310b\u3127\u3124',
    'niao': '\u310b\u3127\u3120',
    'nie': '\u310b\u3127\u311d',
    'nin': '\u310b\u3127\u3123',
    'ning': '\u310b\u3127\u3125',
    'niu': '\u310b\u3127\u3121',
    'nong': '\u310b\u3128\u3125',
    'nou': '\u310b\u3121',
    'nu': '\u310b\u3128',
    'nu:': '\u310b\u3129',
    'nuan': '\u310b\u3128\u3123',
    'nu:e': '\u310b\u3129\u311d',
    'nun': '\u310b\u3129',
    'nuo': '\u310b\u3129\u311d',
    'ou': '\u3121',
    'pa': '\u3106\u311a',
    'pai': '\u3106\u311e',
    'pan': '\u3106\u3122',
    'pang': '\u3106\u3124',
    'pao': '\u3106\u3120',
    'pei': '\u3106\u311f',
    'pen': '\u3106\u3123',
    'peng': '\u3106\u3125',
    'pi': '\u3106\u3127',
    'pian': '\u3106\u3127\u3122',
    'piao': '\u3106\u3127\u3120',
    'pie': '\u3106\u3127\u311d',
    'pin': '\u3106\u3127\u3123',
    'ping': '\u3106\u3127\u3125',
    'po': '\u3106\u311b',
    'pou': '\u3106\u3121',
    'pu': '\u3106\u3128',
    'qi': '\u3111\u3127',
    'qia': '\u3111\u3127\u311a',
    'qian': '\u3111\u3127\u3122',
    'qiang': '\u3111\u3127\u3124',
    'qiao': '\u3111\u3127\u3120',
    'qie': '\u3111\u3127\u311d',
    'qin': '\u3111\u3127\u3123',
    'qing': '\u3111\u3127\u3125',
    'qiong': '\u3111\u3129\u3125',
    'qiu': '\u3111\u3127\u3121',
    'qu': '\u3111\u3129',
    'quan': '\u3111\u3129\u3122',
    'que': '\u3111\u3129\u311d',
    'qun': '\u3111\u3129\u3123',
    'ran': '\u3116\u3122',
    'rang': '\u3116\u3124',
    'rao': '\u3116\u3120',
    're': '\u3116\u311c',
    'ren': '\u3116\u3123',
    'reng': '\u3116\u3125',
    'ri': '\u3116',
    'rong': '\u3116\u3128\u3125',
    'rou': '\u3116\u3121',
    'ru': '\u3116\u3128',
    'ruan': '\u3116\u3128\u3122',
    'rui': '\u3116\u3128\u311f',
    'run': '\u3116\u3128\u3123',
    'ruo': '\u3116\u3128\u311b',
    'sa': '\u3119\u311a',
    'sai': '\u3119\u311e',
    'san': '\u3119\u3122',
    'sang': '\u3119\u3124',
    'sao': '\u3119\u3120',
    'se': '\u3119\u311c',
    'sei': '\u3119\u311f',
    'sen': '\u3119\u3123',
    'seng': '\u3119\u3125',
    'sha': '\u3115\u311a',
    'shai': '\u3115\u311e',
    'shan': '\u3115\u3122',
    'shang': '\u3115\u3124',
    'shao': '\u3115\u3120',
    'she': '\u3115\u311c',
    'shei': '\u3115\u311f',
    'shen': '\u3115\u3123',
    'sheng': '\u3115\u3125',
    'shi': '\u3115',
    'shong': '\u3115\u3128\u3125',
    'shou': '\u3115\u3121',
    'shu': '\u3115\u3128',
    'shua': '\u3115\u3128\u311a',
    'shuai': '\u3115\u3128\u311e',
    'shuan': '\u3115\u3128\u3122',
    'shuang': '\u3115\u3128\u3124',
    'shui': '\u3115\u3128\u311f',
    'shun': '\u3115\u3128\u3123',
    'shuo': '\u3115\u3128\u311b',
    'si': '\u3119',
    'song': '\u3119\u3128\u3125',
    'sou': '\u3119\u3121',
    'su': '\u3119\u3128',
    'suan': '\u3119\u3128\u3122',
    'sui': '\u3119\u3128\u311f',
    'sun': '\u3119\u3128\u3123',
    'suo': '\u3119\u3128\u311b',
    'ta': '\u310a\u311a',
    'tai': '\u310a\u311e',
    'tan': '\u310a\u3122',
    'tang': '\u310a\u3124',
    'tao': '\u310a\u3120',
    'te': '\u310a\u311c',
    'teng': '\u310a\u3125',
    'ti': '\u310a\u3127',
    'tian': '\u310a\u3127\u3122',
    'tiao': '\u310a\u3127\u3120',
    'tie': '\u310a\u3127\u311d',
    'ting': '\u310a\u3127\u3125',
    'tong': '\u310a\u3128\u3125',
    'tou': '\u310a\u3121',
    'tu': '\u310a\u3128',
    'tuan': '\u310a\u3128\u3122',
    'tui': '\u310a\u3128\u311f',
    'tun': '\u310a\u3128\u3123',
    'tuo': '\u310a\u3128\u311b',
    'wa': '\u3128\u311a',
    'wai': '\u3128\u311e',
    'wan': '\u3128\u3122',
    'wang': '\u3128\u3124',
    'wei': '\u3128\u311f',
    'wen': '\u3128\u3123',
    'weng': '\u3128\u3125',
    'wo': '\u3128\u311b',
    'wu': '\u3128',
    'xi': '\u3112\u3127',
    'xia': '\u3112\u3127\u311a',
    'xian': '\u3112\u3127\u3122',
    'xiang': '\u3112\u3127\u3124',
    'xiao': '\u3112\u3127\u3120',
    'xie': '\u3112\u3127\u311d',
    'xin': '\u3112\u3127\u3123',
    'xing': '\u3112\u3127\u3125',
    'xiong': '\u3112\u3129\u3125',
    'xiu': '\u3112\u3127\u3121',
    'xu': '\u3112\u3129',
    'xuan': '\u3112\u3129\u3122',
    'xue': '\u3112\u3129\u311d',
    'xun': '\u3112\u3129\u3123',
    'ya': '\u3127\u311a',
    'yan': '\u3127\u3122',
    'yang': '\u3127\u3124',
    'yao': '\u3127\u3120',
    'ye': '\u3127\u311d',
    'yi': '\u3127',
    'yin': '\u3127\u3123',
    'ying': '\u3127\u3125',
    'yong': '\u3129\u3125',
    'you': '\u3127\u3121',
    'yu': '\u3129',
    'yuan': '\u3129\u3122',
    'yue': '\u3129\u311d',
    'yun': '\u3129\u3123',
    'za': '\u3117\u311a',
    'zai': '\u3117\u311e',
    'zan': '\u3117\u3122',
    'zang': '\u3117\u3124',
    'zao': '\u3117\u3120',
    'ze': '\u3117\u311c',
    'zei': '\u3117\u311f',
    'zen': '\u3117\u3123',
    'zeng': '\u3117\u3125',
    'zha': '\u3113\u311a',
    'zhai': '\u3113\u311e',
    'zhan': '\u3113\u3122',
    'zhang': '\u3113\u3124',
    'zhao': '\u3113\u3120',
    'zhe': '\u3113\u311c',
    'zhei': '\u3113\u311f',
    'zhen': '\u3113\u3123',
    'zheng': '\u3113\u3125',
    'zhi': '\u3113',
    'zhong': '\u3113\u3128\u3125',
    'zhou': '\u3113\u3121',
    'zhu': '\u3113\u3128',
    'zhua': '\u3113\u3128\u311a',
    'zhuai': '\u3113\u3128\u311e',
    'zhuan': '\u3113\u3128\u3122',
    'zhuang': '\u3113\u3128\u3124',
    'zhui': '\u3113\u3128\u311f',
    'zhun': '\u3113\u3128\u3123',
    'zhuo': '\u3113\u3128\u311b',
    'zi': '\u3117',
    'zong': '\u3117\u3128\u3125',
    'zou': '\u3117\u3121',
    'zu': '\u3117\u3128',
    'zuan': '\u3117\u3128\u3122',
    'zui': '\u3117\u3128\u311f',
    'zun': '\u3117\u3128\u3123',
    'zuo': '\u3117\u3128\u311b'
};

globalThis.numericPinyin2Zhuyin = function (syllable) {
    return zhuyinMap[syllable.substring(0, syllable.length - 1).toLowerCase()]
        + zhuyinTones[syllable[syllable.length - 1]] + '</span>';

};

globalThis.accentedPinyin2Zhuyin = function (syllable) {
    let lowerCased = syllable.toLowerCase();
    let key = lowerCased;
    let tone = 5;
    for (let i = 1; i <= 4; i++) {
        let idx = lowerCased.indexOf(pinyinTones[i]);
        if (idx > 0) {
            key = lowerCased.substring(0, idx);
            if (idx < lowerCased.length - 1) {
                key += lowerCased.substring(idx + 1);
            }
            tone = i;
            break;
        }
    }
    return zhuyinMap[key] + zhuyinTones[tone];
};

/* unzipit@1.4.3, license MIT */
'use strict';(function(z,G){"object"===typeof exports&&"undefined"!==typeof module?G(exports):"function"===typeof define&&define.amd?define(["exports"],G):(z="undefined"!==typeof globalThis?globalThis:z||self,G(z.unzipit={}))})(this,function(z){function G(a){return a.arrayBuffer?a.arrayBuffer():new Promise((b,c)=>{const e=new FileReader;e.addEventListener("loadend",()=>{b(e.result)});e.addEventListener("error",c);e.readAsArrayBuffer(a)})}async function na(a){a=await G(a);return new Uint8Array(a)}
function aa(a){return"undefined"!==typeof Blob&&a instanceof Blob}function I(a){return"undefined"!==typeof SharedArrayBuffer&&a instanceof SharedArrayBuffer}function R(a,b){var c=a.length;if(b<=c)return a;b=new Uint8Array(Math.max(c<<1,b));b.set(a,0);return b}function oa(a,b,c,e,d,h){for(var k=ba,f=ca,l=0;l<c;){var n=a[f(e,d)&b];d+=n&15;var u=n>>>4;if(15>=u)h[l]=u,l++;else{var x=n=0;16==u?(x=3+k(e,d,2),d+=2,n=h[l-1]):17==u?(x=3+k(e,d,3),d+=3):18==u&&(x=11+k(e,d,7),d+=7);for(u=l+x;l<u;)h[l]=n,l++}}return d}
function da(a,b,c,e){for(var d=0,h=0,k=e.length>>>1;h<c;){var f=a[h+b];e[h<<1]=0;e[(h<<1)+1]=f;f>d&&(d=f);h++}for(;h<k;)e[h<<1]=0,e[(h<<1)+1]=0,h++;return d}function J(a,b){var c=a.length,e,d;var h=g.bl_count;for(d=0;d<=b;d++)h[d]=0;for(d=1;d<c;d+=2)h[a[d]]++;d=g.next_code;var k=0;h[0]=0;for(e=1;e<=b;e++)k=k+h[e-1]<<1,d[e]=k;for(b=0;b<c;b+=2)h=a[b+1],0!=h&&(a[b]=d[h],d[h]++)}function K(a,b,c){for(var e=a.length,d=g.rev15,h=0;h<e;h+=2)if(0!=a[h+1]){var k=a[h+1],f=h>>1<<4|k,l=b-k;k=a[h]<<l;for(l=k+
(1<<l);k!=l;)c[d[k]>>>15-b]=f,k++}}function ea(a,b){for(var c=g.rev15,e=15-b,d=0;d<a.length;d+=2)a[d]=c[a[d]<<b-a[d+1]]>>>e}function ba(a,b,c){return(a[b>>>3]|a[(b>>>3)+1]<<8)>>>(b&7)&(1<<c)-1}function pa(a,b,c){return(a[b>>>3]|a[(b>>>3)+1]<<8|a[(b>>>3)+2]<<16)>>>(b&7)&(1<<c)-1}function ca(a,b){return(a[b>>>3]|a[(b>>>3)+1]<<8|a[(b>>>3)+2]<<16)>>>(b&7)}function qa(a){D.push(a.target);S();const {id:b,error:c,data:e}=a.data;a=N.get(b);N.delete(b);c?a.reject(c):a.resolve(e)}function T(a){return new Promise((b,
c)=>{const e=new Worker(a);e.onmessage=d=>{"start"===d.data?(e.onerror=void 0,e.onmessage=void 0,b(e)):c(Error(`unexpected message: ${d.data}`))};e.onerror=c})}async function ra(){if(0===D.length&&U<y.numWorkers){++U;try{const a=await V.createWorker(y.workerURL);O.push(a);D.push(a);V.addEventListener(a,qa)}catch(a){P=!1}}return D.pop()}async function S(){if(0!==B.length){if(y.useWorkers&&P){var a=await ra();if(P){if(a){if(0===B.length){D.push(a);S();return}const {id:E,src:W,uncompressedSize:X,type:Y,
resolve:L,reject:sa}=B.shift();N.set(E,{id:E,resolve:L,reject:sa});a.postMessage({type:"inflate",data:{id:E,type:Y,src:W,uncompressedSize:X}},[])}return}}for(;B.length;){const {src:E,uncompressedSize:W,type:X,resolve:Y}=B.shift();a=E;aa(E)&&(a=await na(E));{var b=a;a=X;var c=Y;const L=new Uint8Array(W);var e=void 0,d=void 0,h,k=L,f=Uint8Array;if(3==b[0]&&0==b[1])k||new f(0);else{var l=pa,n=ba,u=oa,x=ca,A=null==k;A&&(k=new f(b.length>>>2<<3));for(var C=0,t=0,r=h=0,m=0;0==C;){C=l(b,m,1);var q=l(b,m+
1,2);m+=3;if(0==q)0!=(m&7)&&(m+=8-(m&7)),m=(m>>>3)+4,q=b[m-4]|b[m-3]<<8,A&&(k=R(k,r+q)),k.set(new f(b.buffer,b.byteOffset+m,q),r),m=m+q<<3,r+=q;else{A&&(k=R(k,r+131072));1==q&&(d=g.flmap,e=g.fdmap,t=511,h=31);if(2==q){q=n(b,m,5)+257;h=n(b,m+5,5)+1;e=n(b,m+10,4)+4;m+=14;for(d=0;38>d;d+=2)g.itree[d]=0,g.itree[d+1]=0;t=1;for(d=0;d<e;d++){var p=n(b,m+3*d,3);g.itree[(g.ordr[d]<<1)+1]=p;p>t&&(t=p)}m+=3*e;J(g.itree,t);K(g.itree,t,g.imap);d=g.lmap;e=g.dmap;m=u(g.imap,(1<<t)-1,q+h,b,m,g.ttree);p=da(g.ttree,
0,q,g.ltree);t=(1<<p)-1;q=da(g.ttree,q,h,g.dtree);h=(1<<q)-1;J(g.ltree,p);K(g.ltree,p,d);J(g.dtree,q);K(g.dtree,q,e)}for(;;)if(q=d[x(b,m)&t],m+=q&15,p=q>>>4,0==p>>>8)k[r++]=p;else if(256==p)break;else{q=r+p-254;264<p&&(p=g.ldef[p-257],q=r+(p>>>3)+n(b,m,p&7),m+=p&7);p=e[x(b,m)&h];m+=p&15;p=g.ddef[p>>>4];var Q=(p>>>4)+l(b,m,p&15);m+=p&15;for(A&&(k=R(k,r+131072));r<q;)k[r]=k[r++-Q],k[r]=k[r++-Q],k[r]=k[r++-Q],k[r]=k[r++-Q];r=q}}}k.length==r||k.slice(0,r)}c(a?new Blob([L],{type:a}):L.buffer)}}}}function fa(a,
b,c){return new Promise((e,d)=>{B.push({src:a,uncompressedSize:b,type:c,resolve:e,reject:d,id:ta++});S()})}async function ua(){for(const a of O)await V.terminate(a);O.splice(0,O.length);D.splice(0,D.length);B.splice(0,B.length);N.clear();U=0;P=!0}async function H(a,b,c){return await a.read(b,c)}async function Z(a,b,c,e){return a.sliceAsBlob?await a.sliceAsBlob(b,c,e):await a.read(b,c)}function v(a,b){return a[b]+256*a[b+1]}function w(a,b){return a[b]+256*a[b+1]+65536*a[b+2]+16777216*a[b+3]}function F(a,
b){return w(a,b)+4294967296*w(a,b+4)}function M(a,b){I(a.buffer)&&(a=new Uint8Array(a));return va.decode(a)}async function wa(a,b){var c=Math.min(65557,b);b-=c;var e=await H(a,b,c);for(c-=22;0<=c;--c){if(101010256!==w(e,c))continue;var d=new Uint8Array(e.buffer,e.byteOffset+c,e.byteLength-c);e=v(d,4);if(0!==e)throw Error(`multi-volume zip files are not supported. This is volume: ${e}`);e=v(d,10);const k=w(d,12),f=w(d,16);var h=v(d,20);const l=d.length-22;if(h!==l)throw Error(`invalid comment length. expected: ${l}, actual: ${h}`);
d=new Uint8Array(d.buffer,d.byteOffset+22,h);h=M(d);return 65535===e||4294967295===f?await xa(a,b+c,h,d):await ha(a,f,k,e,h,d)}throw Error("could not find end of central directory. maybe not zip file");}async function xa(a,b,c,e){b=await H(a,b-20,20);if(117853008!==w(b,0))throw Error("invalid zip64 end of central directory locator signature");b=F(b,8);var d=await H(a,b,56);if(101075792!==w(d,0))throw Error("invalid zip64 end of central directory record signature");b=F(d,32);const h=F(d,40);d=F(d,
48);return ha(a,d,h,b,c,e)}async function ha(a,b,c,e,d,h){let k=0;b=await H(a,b,c);c=[];for(let A=0;A<e;++A){var f=b.subarray(k,k+46),l=w(f,0);if(33639248!==l)throw Error(`invalid central directory file header signature: 0x${l.toString(16)}`);f={versionMadeBy:v(f,4),versionNeededToExtract:v(f,6),generalPurposeBitFlag:v(f,8),compressionMethod:v(f,10),lastModFileTime:v(f,12),lastModFileDate:v(f,14),crc32:w(f,16),compressedSize:w(f,20),uncompressedSize:w(f,24),fileNameLength:v(f,28),extraFieldLength:v(f,
30),fileCommentLength:v(f,32),internalFileAttributes:v(f,36),externalFileAttributes:w(f,38),relativeOffsetOfLocalHeader:w(f,42)};if(f.generalPurposeBitFlag&64)throw Error("strong encryption is not supported");k+=46;l=b.subarray(k,k+f.fileNameLength+f.extraFieldLength+f.fileCommentLength);f.nameBytes=l.slice(0,f.fileNameLength);f.name=M(f.nameBytes);var n=f.fileNameLength+f.extraFieldLength;const C=l.slice(f.fileNameLength,n);f.extraFields=[];for(var u=0;u<C.length-3;){const t=v(C,u+0);var x=v(C,u+
2);u+=4;x=u+x;if(x>C.length)throw Error("extra field length exceeds extra field buffer size");f.extraFields.push({id:t,data:C.slice(u,x)});u=x}f.commentBytes=l.slice(n,n+f.fileCommentLength);f.comment=M(f.commentBytes);k+=l.length;if(4294967295===f.uncompressedSize||4294967295===f.compressedSize||4294967295===f.relativeOffsetOfLocalHeader){l=f.extraFields.find(t=>1===t.id);if(!l)throw Error("expected zip64 extended information extra field");l=l.data;n=0;if(4294967295===f.uncompressedSize){if(n+8>
l.length)throw Error("zip64 extended information extra field does not include uncompressed size");f.uncompressedSize=F(l,n);n+=8}if(4294967295===f.compressedSize){if(n+8>l.length)throw Error("zip64 extended information extra field does not include compressed size");f.compressedSize=F(l,n);n+=8}if(4294967295===f.relativeOffsetOfLocalHeader){if(n+8>l.length)throw Error("zip64 extended information extra field does not include relative header offset");f.relativeOffsetOfLocalHeader=F(l,n);n+=8}}if(l=f.extraFields.find(t=>
28789===t.id&&6<=t.data.length&&1===t.data[0]&&w(t.data,1),ya.unsigned(f.nameBytes)))f.fileName=M(l.data.slice(5));if(0===f.compressionMethod&&(l=f.uncompressedSize,0!==(f.generalPurposeBitFlag&1)&&(l+=12),f.compressedSize!==l))throw Error(`compressed size mismatch for stored file: ${f.compressedSize} != ${l}`);c.push(f)}return{zip:{comment:d,commentBytes:h},entries:c.map(A=>new za(a,A))}}async function ia(a,b){if(b.generalPurposeBitFlag&1)throw Error("encrypted entries not supported");var c=await H(a,
b.relativeOffsetOfLocalHeader,30);a=await a.getLength();var e=w(c,0);if(67324752!==e)throw Error(`invalid local file header signature: 0x${e.toString(16)}`);e=v(c,26);var d=v(c,28);c=b.relativeOffsetOfLocalHeader+c.length+e+d;if(0===b.compressionMethod)e=!1;else if(8===b.compressionMethod)e=!0;else throw Error(`unsupported compression method: ${b.compressionMethod}`);d=c+b.compressedSize;if(0!==b.compressedSize&&d>a)throw Error(`file data overflows file bounds: ${c} +  ${b.compressedSize}  > ${a}`);
return{decompress:e,fileDataStart:c}}async function Aa(a,b){const {decompress:c,fileDataStart:e}=await ia(a,b);if(!c)return b=await H(a,e,b.compressedSize),0===b.byteOffset&&b.byteLength===b.buffer.byteLength?b.buffer:b.slice().buffer;a=await Z(a,e,b.compressedSize);return await fa(a,b.uncompressedSize)}async function Ba(a,b,c){const {decompress:e,fileDataStart:d}=await ia(a,b);if(!e)return b=await Z(a,d,b.compressedSize,c),aa(b)?b:new Blob([I(b.buffer)?new Uint8Array(b):b],{type:c});a=await Z(a,
d,b.compressedSize);return await fa(a,b.uncompressedSize,c)}async function ja(a){if("undefined"!==typeof Blob&&a instanceof Blob)a=new ka(a);else if(a instanceof ArrayBuffer||a&&a.buffer&&a.buffer instanceof ArrayBuffer)a=new la(a);else if(I(a)||I(a.buffer))a=new la(a);else if("string"===typeof a){var b=await fetch(a);if(!b.ok)throw Error(`failed http request ${a}, status: ${b.status}: ${b.statusText}`);a=await b.blob();a=new ka(a)}else if("function"!==typeof a.getLength||"function"!==typeof a.read)throw Error("unsupported source type");
b=await a.getLength();if(b>Number.MAX_SAFE_INTEGER)throw Error(`file too large. size: ${b}. Only file sizes up 4503599627370496 bytes are supported`);return await wa(a,b)}const Ca="undefined"!==typeof process&&process.versions&&"undefined"!==typeof process.versions.node&&"undefined"===typeof process.versions.electron;class la{constructor(a){this.typedArray=a instanceof ArrayBuffer||I(a)?new Uint8Array(a):new Uint8Array(a.buffer,a.byteOffset,a.byteLength)}async getLength(){return this.typedArray.byteLength}async read(a,
b){return new Uint8Array(this.typedArray.buffer,this.typedArray.byteOffset+a,b)}}class ka{constructor(a){this.blob=a}async getLength(){return this.blob.size}async read(a,b){a=this.blob.slice(a,a+b);a=await G(a);return new Uint8Array(a)}async sliceAsBlob(a,b,c=""){return this.blob.slice(a,a+b,c)}}class Da{constructor(a){this.url=a}async getLength(){if(void 0===this.length){const a=await fetch(this.url,{method:"HEAD"});if(!a.ok)throw Error(`failed http request ${this.url}, status: ${a.status}: ${a.statusText}`);
this.length=parseInt(a.headers.get("content-length"));if(Number.isNaN(this.length))throw Error("could not get length");}return this.length}async read(a,b){if(0===b)return new Uint8Array(0);const c=await fetch(this.url,{headers:{Range:`bytes=${a}-${a+b-1}`}});if(!c.ok)throw Error(`failed http request ${this.url}, status: ${c.status} offset: ${a} size: ${b}: ${c.statusText}`);a=await c.arrayBuffer();return new Uint8Array(a)}}const g=function(){var a=Uint16Array,b=Uint32Array;return{next_code:new a(16),
bl_count:new a(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new a(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new b(32),flmap:new a(512),
fltree:[],fdmap:new a(32),fdtree:[],lmap:new a(32768),ltree:[],ttree:[],dmap:new a(32768),dtree:[],imap:new a(512),itree:[],rev15:new a(32768),lhst:new b(286),dhst:new b(30),ihst:new b(19),lits:new b(15E3),strt:new a(65536),prev:new a(32768)}}();(function(){function a(e,d,h){for(;0!=d--;)e.push(0,h)}for(var b=0;32768>b;b++){var c=b;c=(c&2863311530)>>>1|(c&1431655765)<<1;c=(c&3435973836)>>>2|(c&858993459)<<2;c=(c&4042322160)>>>4|(c&252645135)<<4;c=(c&4278255360)>>>8|(c&16711935)<<8;g.rev15[b]=(c>>>
16|c<<16)>>>17}for(b=0;32>b;b++)g.ldef[b]=g.of0[b]<<3|g.exb[b],g.ddef[b]=g.df0[b]<<4|g.dxb[b];a(g.fltree,144,8);a(g.fltree,112,9);a(g.fltree,24,7);a(g.fltree,8,8);J(g.fltree,9);K(g.fltree,9,g.flmap);ea(g.fltree,9);a(g.fdtree,32,5);J(g.fdtree,5);K(g.fdtree,5,g.fdmap);ea(g.fdtree,5);a(g.itree,19,0);a(g.ltree,286,0);a(g.dtree,30,0);a(g.ttree,320,0)})();const ma={table:function(){for(var a=new Uint32Array(256),b=0;256>b;b++){for(var c=b,e=0;8>e;e++)c=c&1?3988292384^c>>>1:c>>>1;a[b]=c}return a}(),update:function(a,
b,c,e){for(var d=0;d<e;d++)a=ma.table[(a^b[c+d])&255]^a>>>8;return a},crc:function(a,b,c){return ma.update(4294967295,a,b,c)^4294967295}},y={numWorkers:1,workerURL:"",useWorkers:!1};let ta=0,U=0,P=!0;const O=[],D=[],B=[],N=new Map,V=function(){if(Ca){const {Worker:a}=module.require?module.require("worker_threads"):{};return{async createWorker(b){return new a(b)},addEventListener(b,c){b.on("message",e=>{c({target:b,data:e})})},async terminate(b){await b.terminate()}}}return{async createWorker(a){try{return await T(a)}catch(c){console.warn("could not load worker:",
a)}let b;try{const c=await fetch(a,{mode:"cors"});if(!c.ok)throw Error(`could not load: ${a}`);b=await c.text();a=URL.createObjectURL(new Blob([b],{type:"application/javascript"}));const e=await T(a);y.workerURL=a;return e}catch(c){console.warn("could not load worker via fetch:",a)}if(void 0!==b)try{a=`data:application/javascript;base64,${btoa(b)}`;const c=await T(a);y.workerURL=a;return c}catch(c){console.warn("could not load worker via dataURI")}console.warn("workers will not be used");throw Error("can not start workers");
},addEventListener(a,b){a.addEventListener("message",b)},async terminate(a){a.terminate()}}}();class za{constructor(a,b){this._reader=a;this._rawEntry=b;this.name=b.name;this.nameBytes=b.nameBytes;this.size=b.uncompressedSize;this.compressedSize=b.compressedSize;this.comment=b.comment;this.commentBytes=b.commentBytes;this.compressionMethod=b.compressionMethod;a=b.lastModFileDate;var c=b.lastModFileTime;this.lastModDate=new Date((a>>9&127)+1980,(a>>5&15)-1,a&31,c>>11&31,c>>5&63,2*(c&31),0);this.isDirectory=
0===b.uncompressedSize&&b.name.endsWith("/");this.encrypted=!!(b.generalPurposeBitFlag&1);this.externalFileAttributes=b.externalFileAttributes;this.versionMadeBy=b.versionMadeBy}async blob(a="application/octet-stream"){return await Ba(this._reader,this._rawEntry,a)}async arrayBuffer(){return await Aa(this._reader,this._rawEntry)}async text(){const a=await this.arrayBuffer();return M(new Uint8Array(a))}async json(){const a=await this.text();return JSON.parse(a)}}const ya={unsigned(){return 0}},va=
new TextDecoder;z.HTTPRangeReader=Da;z.cleanup=function(){ua()};z.setOptions=function(a){y.workerURL=a.workerURL||y.workerURL;a.workerURL&&(y.useWorkers=!0);y.useWorkers=void 0!==a.useWorkers?a.useWorkers:y.useWorkers;y.numWorkers=a.numWorkers||y.numWorkers};z.unzip=async function(a){const {zip:b,entries:c}=await ja(a);return{zip:b,entries:Object.fromEntries(c.map(e=>[e.name,e]))}};z.unzipRaw=ja;Object.defineProperty(z,"__esModule",{value:!0})});
/* unzipit@1.4.3, license MIT */

/*
 Hanzipopup - A Chinese-English Pop-Up Dictionary UserScript
 Copyright (C) 2024 krmanik
 https://github.com/krmanik/hanzipopup
*/

async function setupHanzipopup() {
    await loadVals();
    await loadDict();

    let config = await getConfig();
    if (config["enable"]) {
        enable = true;
        document.querySelector("#hanzi-popup-enable-btn > button").style.background = "#33b249";
        enableTab();
    }
}

setupHanzipopup();
