// ==UserScript==
// @name         RPGEN - Read out Sasayaki-Chat
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  TL;DR
// @author       https://greasyfork.org/ja/users/705684
// @match        https://rpgen.org/dq/?map=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpgen.site
// @license      MIT
// @grant        none
// @require      https://update.greasyfork.org/scripts/515720/1477456/util.js
// @downloadURL https://update.greasyfork.org/scripts/514707/RPGEN%20-%20Read%20out%20Sasayaki-Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/514707/RPGEN%20-%20Read%20out%20Sasayaki-Chat.meta.js
// ==/UserScript==

(() => {
    const removeNonVerbal = str => str
    .replace(/\[.+?\]/g, ' Urawaza ')
    .replace(/h?ttps?:\/\/.+$/g, ' URL ');

    const id = setInterval(() => {
        if (window.dqSock && window.dqSock.socket) {
            clearInterval(id);
            window.dqSock.socket.on("uNC_s", (async function({g, t}) {
                const random = await window.pseudoRandomBy(g);
                const uttr = new SpeechSynthesisUtterance(removeNonVerbal(t));
                const voices = window.speechSynthesis.getVoices().filter(v => v.lang === 'ja-JP');
                uttr.voice = voices[voices.length * random | 0];
                window.speechSynthesis.speak(uttr);
            }));
        }
    }, 500);
})();