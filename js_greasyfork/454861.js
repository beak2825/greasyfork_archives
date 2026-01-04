// ==UserScript==
// @name         IMDb lists Reelgood links
// @version      0.1
// @description  Provides link to Reelgood for each title in your watchlist and any other list
// @author       Aviem Zur
// @match        https://www.imdb.com/user/ur*/watchlist*
// @match        https://www.imdb.com/list/ls*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @license      MIT
// @namespace https://greasyfork.org/users/14514
// @downloadURL https://update.greasyfork.org/scripts/454861/IMDb%20lists%20Reelgood%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/454861/IMDb%20lists%20Reelgood%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var prefix = "https://reelgood.com/search?q=";
    function addLink(item, index, arr) {
        var btn = document.createElement("a");
        btn.innerText = "Stream now!"
        btn.target = "_blank";
        if (window.location.href.includes("/list")) {
            // List
            if (window.location.href.includes("=grid")) {
                btn.href = prefix + item.firstElementChild.firstElementChild.nextElementSibling.innerText
                var target = item.firstElementChild;
                target.appendChild(document.createElement("br"))
                target.appendChild(btn)
            } else {
                btn.href = prefix + item.firstChild.nextSibling.nextElementSibling.firstChild.nextElementSibling.firstElementChild.nextElementSibling.innerText
                var target_parent = item.firstChild.nextSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling
                target_parent.insertBefore(btn, target_parent.firstElementChild.nextElementSibling)
            }
        } else {
            // Watchlist
            if (window.location.href.includes("=grid")) {
                btn.href = prefix + item.firstChild.nextSibling.firstChild.innerText;
                var target2 = item.firstChild.nextSibling.nextSibling;
                target2.appendChild(document.createElement("br"))
                target2.appendChild(btn)
            } else {
                btn.href = prefix + item.firstChild.firstChild.nextSibling.firstChild.innerText;
                item.firstChild.firstChild.nextSibling.firstChild.nextSibling.nextSibling.appendChild(btn)
            }
        }
    }
    var titles = Array.from(document.getElementsByClassName("lister-item"))
    titles.forEach(addLink)
})();