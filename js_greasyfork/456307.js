// ==UserScript==
// @name         NoteMS-AutoReset
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动恢复notems内容，不对外发布
// @author       MelonFish
// @match        https://note.ms/*
// @match        http://note.ms/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456307/NoteMS-AutoReset.user.js
// @updateURL https://update.greasyfork.org/scripts/456307/NoteMS-AutoReset.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var txt = `保护文本`
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }
    setInterval(async function () {
        document.querySelector('.content').innerHTML=txt
        console.log('ok');
        await sleep(1)
        location.reload()
    },2000)
})();