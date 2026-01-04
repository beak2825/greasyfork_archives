// ==UserScript==
// @name         Thread On Tab
// @namespace    https://wilchan.org
// @version      1.1
// @description  Nazwa tematu pojawia się w tytule karty.
// @author       Anonimas
// @match        https://wilchan.org/*
// @match        https://akanechan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510245/Thread%20On%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/510245/Thread%20On%20Tab.meta.js
// ==/UserScript==

const parseHTML_ = (html) => {
    let doc = new DOMParser().parseFromString(html.replace(/<br>/gi, " "), "text/html");
    return doc.body.textContent || "";
}

if (viewConfiguration.boardViewType === BoardViewType.ClassicThread) {
    let tittle = "/" + boardConfiguration.boardId + "/ - " + parseHTML_(document.querySelector("section.thread > .content > .message").innerHTML);
    originalTittle = tittle;
    document.title = tittle;
}