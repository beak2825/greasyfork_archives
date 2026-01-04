// ==UserScript==
// @name         Eksisozluk Yazar Etiket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  overlay notification
// @author       You
// @match        https://eksisozluk1923.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471301/Eksisozluk%20Yazar%20Etiket.user.js
// @updateURL https://update.greasyfork.org/scripts/471301/Eksisozluk%20Yazar%20Etiket.meta.js
// ==/UserScript==

let blockedUsers = ["esitler arasinda sonuncu","heist","atanamayan katip","gecenzaman","yemyesilyurt","belkibirgunbiryerde","basim hafif donuyor gecer insallah","mrttrhn","asabibozuk","cinnnahcik","hirvat teknik adam","geceyim","isbu nick","kenjataimu","kereste","paradox","zarp","passenger28","tatli karinca","ah bir gecenler","the cipcirkin ordek yavrusu","prafheimas"];
window.addEventListener('load', function() {
    let entries = document.querySelectorAll('li[data-author]');

    entries.forEach((entry) => {
        let author = entry.getAttribute('data-author');
        if(blockedUsers.includes(author)) {
            let contentElement = entry.querySelector('.content');
            let contentHTML = contentElement.innerHTML;

            // Clear content div
            contentElement.innerHTML = "";

            // Create content container div
            let contentContainer = document.createElement("div");
            contentContainer.style.position = "relative";
            contentContainer.innerHTML = contentHTML;
            contentContainer.style.filter = "blur(3px)";
            contentContainer.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
            contentContainer.style.isolation = "isolate";

            // Create overlay div
            let overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
            overlay.style.zIndex = "10";
            overlay.style.padding = "10px";
            overlay.style.color = "white";
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.textAlign = "center";

            let textSpan = document.createElement("span");
            textSpan.textContent = "is*et öz*l övmüş";
            textSpan.style.backgroundColor = "rgba(136, 8, 8, 0.4)";
            textSpan.style.padding = "5px";
            textSpan.style.borderRadius = "5px";

            overlay.appendChild(textSpan);

            // Append both content container and overlay div to the original content div
            contentElement.appendChild(contentContainer);
            contentElement.appendChild(overlay);
        }
    });
}, false);
