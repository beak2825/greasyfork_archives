// ==UserScript==
// @name         VK link fixier
// @namespace    http://vk.com/
// @version      0.1
// @description  This script removes 'vk.com/away' links redirects
// @author       Kenya-West
// @include      https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387863/VK%20link%20fixier.user.js
// @updateURL https://update.greasyfork.org/scripts/387863/VK%20link%20fixier.meta.js
// ==/UserScript==

setInterval(function () {
    main()
}, 500)

function main() {

    const links = document.querySelectorAll("a[href^='/away.php']");
    links.forEach(link => {
        let result = fixLink(link.href);
        if (result) {
            link.href = result;
        }
    });

    function fixLink(href) {

        if (href.substr(0, 23) === "https://vk.com/away.php") {

            let last = href.indexOf("&", 0);
            if (last === -1) {
                last = 1000;
            }
            const url = decodeURIComponent(href.substr(27, last - 27));
            return url;

        }
        return null;
    }

}
