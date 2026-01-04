// ==UserScript==
// @name         bunkr video downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download video automatically
// @author       
// @license       MIT
// @match        https://stream.bunkr.ru/v/*
// @match        https://bunkr.su/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunkr.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461808/bunkr%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/461808/bunkr%20video%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

   let dwnBtn
    const pageLoaded = () => {
        dwnBtn = document.getElementsByClassName('text-primary')[1]
    }
   
    let intervalId = setInterval(() => {
        pageLoaded()

        if (dwnBtn){
            clearInterval(intervalId)
            dwnBtn.click();
            setTimeout(() => {
                window.close();
            }, 5000)
        }
    },1000)
})();