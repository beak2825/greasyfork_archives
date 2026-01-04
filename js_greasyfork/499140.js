// ==UserScript==
// @name         Copy nicknames for pointauc
// @namespace    http://tampermonkey.net/
// @version      2024-06-28
// @description  Copy nicknames for pountauc for streams
// @author       ToSa
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499140/Copy%20nicknames%20for%20pointauc.user.js
// @updateURL https://update.greasyfork.org/scripts/499140/Copy%20nicknames%20for%20pointauc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createFileAndDownload(fileName, data = '', postfix = (+(new Date)).toString()) {
        var lnk = document.createElement('a');
        lnk.href = `data:text/plain;content-disposition=attachment;filename=${fileName},${data}`
        lnk.download = fileName;
        lnk.target = '_blank';
        lnk.style.display = 'none';
        lnk.id = `downloadlnk-${postfix}`;
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);
    }

    const parentElement = document.querySelector(".linkGroup.SelectionCountContainer");
    var theFirstChild = parentElement.firstChild;
    var NewElement1 = document.createElement("a");
    NewElement1.className = "StarContent";
    var newElement = document.createElement("i");
    newElement.className = "fa fa-copy star_thread_icon muted"
    NewElement1.appendChild(newElement);
    parentElement.insertBefore(NewElement1, theFirstChild);
    newElement.onclick = function() {
        let nicknames = [];
        const messageList = document.querySelector(".messageList").children;
        let message = "";
        for (message of messageList) {
            if (message.tagName.toLowerCase() == "li" && !message.className.includes("firstPost")) {
                if (!nicknames.includes(message.getAttribute("data-author"))) {
                    nicknames.push(message.getAttribute("data-author"));
                }
            }
        }
        let linkPathName = document.location.pathname;
        linkPathName = linkPathName.split("/");
        const fileName = `Nicknames_${linkPathName[2]}.txt`
        createFileAndDownload(fileName, nicknames.toString().replace(/,/g, "\n"));

    }
})();