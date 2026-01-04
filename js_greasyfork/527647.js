// ==UserScript==
// @name         Instagram Auto Followers/Following Scraper (OSINT)
// @version      2.3
// @description  Auto scraping of all instagram Followers/Following to a .csv with popup controls.
// @author       SH3LL
// @match        https://www.instagram.com/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/527647/Instagram%20Auto%20FollowersFollowing%20Scraper%20%28OSINT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527647/Instagram%20Auto%20FollowersFollowing%20Scraper%20%28OSINT%29.meta.js
// ==/UserScript==

function createPopupButton(text, color,id, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.backgroundColor = color;
    button.style.border = "1px solid";
    button.style.paddingX = "2px";
    button.id = id;
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.addEventListener("click", clickHandler);
    return button;
}
function injectScript() {
    // RUN floriandiud SCRIPT
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/floriandiud/instagram-users-scraper/refs/heads/main/dist/main.min.js",
        onload: function(response) {
            const blob = new Blob([response.responseText], { type: 'text/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            import(blobUrl)
                .then(module => {
                console.log("Module loaded.", module);
            })
                .catch(error => {
                console.error("Error loading the module.", error);
            })
                .finally(() => {
                URL.revokeObjectURL(blobUrl);
            });
        }
    });
    let my_inject_button = document.getElementById("my-inject-button");
    my_inject_button.disabled = true;
    my_inject_button.style.backgroundColor = "grey";
    my_inject_button.textContent = "Injected💉"

}

(function() {
    'use strict';

    // RUN ONLY IN USER PROFILES PAGES
    let url = window.location.href;
    let regex = /^https:\/\/www\.instagram\.com\/([a-zA-Z0-9_\.]+)\/$/;
    let match = url.match(regex);
    if (!match) {
        return;
    }


    let scrolling = false;
    function createPopupButtons() {
        const popupContainer = document.createElement("div");
        popupContainer.style.position = "absolute";
        popupContainer.style.top = "10px";
        popupContainer.style.right = "10%";
        popupContainer.style.zIndex = "1000";
        popupContainer.style.display = "flex";
        popupContainer.style.gap = "10px";

        const injectButton = createPopupButton("Scrape💉", "purple", "my-inject-button", injectScript);
        const startScrollButton = createPopupButton("Scroll🔄", "green", "my-autoscrolling-button",  startScrolling);

        popupContainer.appendChild(injectButton);
        popupContainer.appendChild(startScrollButton);

        document.body.appendChild(popupContainer);
    }


    function scrollBox(element) {
        let scrollInterval = setInterval(function() {
            if (scrolling==true){
                element.scrollBy(0, 1000); // Scrolls down by 1000px
            }
        }, 500);

        let checkScrollInterval = setInterval(function() {
            if (scrolling==false) {
                clearInterval(scrollInterval);
                clearInterval(checkScrollInterval);
                console.log("Scrolling finished.");
            }
        }, 500); // Check every second
    }

    function startScrolling() {
        // AUTOSCROLLING OBSERVER
        let start_button = document.getElementById("my-autoscrolling-button");

        if(scrolling==false){
            console.log("Scrolling started.");
            const observer = new MutationObserver(mutations => {
                if(document.querySelector('div.x1rife3k')){scrollBox(document.querySelector('div.x1rife3k'));}
            });
            observer.observe(document.body, { childList: true, subtree: true });
            if(document.querySelector('div.x1rife3k')){scrollBox(document.querySelector('div.x1rife3k'));}

            scrolling=true;
            start_button.textContent = "Scrolling❌";
            start_button.style.backgroundColor = "darkorange";
        }else{
            scrolling=false;
            start_button.textContent = "Scroll🔄";
            start_button.style.backgroundColor = "green";
        }
    }


    createPopupButtons();
})();