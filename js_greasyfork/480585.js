// ==UserScript==
// @name         Yellow Fever
// @namespace    http://yu.net/
// @version      0.1
// @description  Open Link
// @author       You
// @match        https://yellowfever18.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yellowfever18.com
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480585/Yellow%20Fever.user.js
// @updateURL https://update.greasyfork.org/scripts/480585/Yellow%20Fever.meta.js
// ==/UserScript==


const addButtonOpenLink = () => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-warning");
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.zIndex = 9999;

    const articles = document.querySelectorAll(".jeg_posts article")
    button.innerText = `Open ${articles.length} Post`;
    button.onclick = () => {
        for(const article of articles) {
            GM_openInTab(article.querySelector(".jeg_post_title a").href)
        }
    }

    document.body.append(button)
}

(function() {
    'use strict';

    const articles = document.querySelectorAll(".jeg_posts article")
    if(articles.length > 0) {
        addButtonOpenLink()
    }

    if(document.querySelector(".jeg_main_content")) {
        const links = document.querySelectorAll(".eael-creative-button")
        for(const link of links) {
            if(/terabox/.test(link.href)) {
                const url = new URL(link.href)
                const urlSearch = new URLSearchParams(url.search)
                if(urlSearch.get("s")) {
                    document.location.href = urlSearch.get("s")
                    return
                }

                document.location.href = link.href
            }
        }
    }
})();