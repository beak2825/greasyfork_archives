// ==UserScript==
// @name         IGG-Games/MPC-G Skiper
// @namespace    https://greasyfork.org/zh-TW/scripts/19802-igg-games-mpc-g-skiper
// @version      2.5
// @description  Skip wating AD page in IGG games download link
// @author       Yu-Hsin Lu
// @include      http://igg-games.com/*
// @require      https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.10/clipboard.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/19802/IGG-GamesMPC-G%20Skiper.user.js
// @updateURL https://update.greasyfork.org/scripts/19802/IGG-GamesMPC-G%20Skiper.meta.js
// ==/UserScript==

// Global patten
const URLpat = /.*bluemediafiles.com.*?xurl=(.*)$/i;
const googlepat = /drive\.google\.com/;
const megapat = /mega\.nz/;

(function() {
    // Create panel
    new Clipboard('.clipboard');
    const titleElement = document.querySelector('h1.title');
    const megaButton = document.createElement('button');
    megaButton.classList.add("clipboard");
    titleElement.append(document.createElement('br'));
    megaButton.id = "mega";
    megaButton.innerHTML = "Copy all mega download link";
    titleElement.append(megaButton);
    titleElement.append(document.createElement('br'));
    const googleButton = document.createElement('button');
    googleButton.classList.add("clipboard");
    googleButton.id = "google";
    googleButton.innerHTML = "Copy all google download link";
    titleElement.append(googleButton);

    let collections = {mega: [],google: []};
    let anchors = document.querySelectorAll('a');
    anchors = Array.apply(null, anchors);
    let all_downloadlinks = anchors.filter(anchor => URLpat.test(anchor.href)).map(anchor => {
        const downloadlink = `http${URLpat.exec(anchor.href)[1]}`;
        anchor.href = downloadlink;
        return downloadlink;
    });
    all_downloadlinks.filter(downloadlink => googlepat.test(downloadlink)).forEach(downloadlink => collections.google.push(downloadlink));
    all_downloadlinks.filter(downloadlink => megapat.test(downloadlink)).forEach(downloadlink => collections.mega.push(downloadlink));
    document.querySelector('#mega').innerHTML = "Copy All Mega Link";
    document.querySelector('#mega').setAttribute("data-clipboard-text", collections.mega.join("\n"));
    document.querySelector('#google').innerHTML = "Copy All Google Link";
    document.querySelector('#google').setAttribute("data-clipboard-text", collections.google.join("\n"));
})();
