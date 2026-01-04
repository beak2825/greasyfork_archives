// ==UserScript==
// @name        Youtube PiP 子母畫面支援 - Enable Picture-in-Picture(PiP) mode on Youtube
// @name:zh     Youtube PiP 子母畫面支援 - Enable Picture-in-Picture(PiP) mode on Youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.12
// @author      IVSnote App
// @description Enable in-build youtube pip mode.
// @description:zh 開啟內建 Youtube 子母畫面支援。
// @downloadURL https://update.greasyfork.org/scripts/409842/Youtube%20PiP%20%E5%AD%90%E6%AF%8D%E7%95%AB%E9%9D%A2%E6%94%AF%E6%8F%B4%20-%20Enable%20Picture-in-Picture%28PiP%29%20mode%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/409842/Youtube%20PiP%20%E5%AD%90%E6%AF%8D%E7%95%AB%E9%9D%A2%E6%94%AF%E6%8F%B4%20-%20Enable%20Picture-in-Picture%28PiP%29%20mode%20on%20Youtube.meta.js
// ==/UserScript==

var pipbtn = document.getElementsByClassName('ytp-pip-button ytp-button')[0];
pipbtn.removeAttribute('style');
pipbtn.getElementsByTagName('path')[0].setAttribute('fill','#edc226');