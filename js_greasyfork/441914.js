// ==UserScript==
// @name         Netflix_Lowercase
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make the subtitles of Netflix lowercase, best used in conjunction with [Language Reactor].
// @author       You
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441914/Netflix_Lowercase.user.js
// @updateURL https://update.greasyfork.org/scripts/441914/Netflix_Lowercase.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // alert("Trying lol");
    let intervalTime = 10; // 30ms once

    const interval = setInterval(() => {
        toLowerCase();
    }, intervalTime);

    function toLowerCase(){
        let subtitleWords = document.querySelectorAll('.lln-word');
        subtitleWords.forEach(
            (word)=>{
                word.innerHTML = word.innerHTML.toLowerCase();
            }
        );
    }
    //todo: 在subtitle更新后自动启动，避免延迟

})();