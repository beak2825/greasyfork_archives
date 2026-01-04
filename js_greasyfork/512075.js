// ==UserScript==
// @name         【Open放送室】Ctrl Enterコメント送信
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ctrl + Enterで送信
// @author       You
// @match        https://housoshitu.live/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=housoshitu.live
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/512075/%E3%80%90Open%E6%94%BE%E9%80%81%E5%AE%A4%E3%80%91Ctrl%20Enter%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%80%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/512075/%E3%80%90Open%E6%94%BE%E9%80%81%E5%AE%A4%E3%80%91Ctrl%20Enter%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%80%81%E4%BF%A1.meta.js
// ==/UserScript==

setTimeout(()=>{

    const commentInput = document.querySelector('input[placeholder="コメントを入力"]');
    const sendBtn = commentInput.parentElement.querySelector('button');

    commentInput.addEventListener("keydown",(e)=>{
        if(e.code === 'Enter' && e.ctrlKey) sendBtn.click();
    })


},500)