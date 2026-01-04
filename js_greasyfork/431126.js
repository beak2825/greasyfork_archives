// ==UserScript==
// @name         Auto Widen Bilibili Video Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto widen bilibili video screen
// @author       github/IcedOtaku
// @match        https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/431126/Auto%20Widen%20Bilibili%20Video%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/431126/Auto%20Widen%20Bilibili%20Video%20Screen.meta.js
// ==/UserScript==

document.ready = function() {
    let wideScreenBtn = document.getElementsByClassName("bilibili-player-iconfont-widescreen-on").item(0);
    wideScreenBtn.click();
}