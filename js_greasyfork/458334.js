// ==UserScript==
// @name         japaneseasmr显示播放窗口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show audioplay and allow download media
// @author       Silvio27
// @match        https://japaneseasmr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=japaneseasmr.com
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458334/japaneseasmr%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/458334/japaneseasmr%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.getElementById("audioplayer").style.display = 'block'

    let audio = document.getElementsByTagName("audio")
    for (let i of audio) {
        i.controlsList = 'download'
    }


})();