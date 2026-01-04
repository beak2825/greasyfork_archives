// ==UserScript==
// @name         Aliexpress link fixier
// @namespace    http://aliexpress.com/
// @version      0.1
// @description  This script fixes links redirects' to new interface
// @author       Kenya-West
// @include      *aliexpress.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386646/Aliexpress%20link%20fixier.user.js
// @updateURL https://update.greasyfork.org/scripts/386646/Aliexpress%20link%20fixier.meta.js
// ==/UserScript==

window.onload = () => {
    fixLinks();
}

function fixLinks() {
    let urls;
    let regex = /item\/(.*)\/(\d+)\.html/gi;

    window.setInterval(() => {

        urls = document.querySelectorAll("a[href*='aliexpress.com/item/']");

        urls.forEach((element) => {
            element.href = element.href.split(/[?#]/)[0];
            let path = new URL(element);

            if (regex.test(path.pathname) == true) {
                path.pathname = path.pathname.replace(regex, "item/$2.html");
                element.pathname = path.pathname;
            }
        })
    }, 500);
}