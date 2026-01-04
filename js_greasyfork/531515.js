// ==UserScript==
// @name         Skin Easier
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  search skin, open skin image & hide/show miracle favs
// @author       Big watermelon
// @match        *://agma.io
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/531515/Skin%20Easier.user.js
// @updateURL https://update.greasyfork.org/scripts/531515/Skin%20Easier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regex = /(<|&lt;)td id="skinContainer(\d+)" class="skin-container (?:|faded|selected)"(>|&gt;)(?:|\n *)\1img src="skins\/\2_lo\.png\?u=\d+" alt=""\3(?:|\n *)\1h4\3(.*?)\1\/h4\3(?:|\n *)(?:\1button id="skinUseBtn\2" class="btn btn-primary skinuse-btn" onclick="toggleSkin\(\2\);"\3Use\1\/button\3|<p>\&#128274;<br>\((?:Level \d+|Limited Edition|Gold Members)\)<\/p>|<button id="skinPurchaseBtn\2" class="btn btn-warning" onclick="purchaseSkin\(\d+, \2\);">Buy \([\d,]+\)<\/button>)(?:|\n *)\1\/td\3/g;

    function init(phpSkins) {
        $('#publicSkinsHeader').before(`<div class="skin-subcategory" style="min-height:65px;color: black;"><button onclick="const fav = document.getElementById('fav-skins').style; fav.display = fav.display ? (this.innerText = 'Hide ⭐', '') : (this.innerText = 'Show ⭐', 'none')">Hide ⭐</button><input id="searchSkin" placeholder="Name or Id"><input type="number" placeholder="Open Skin Id" style="width: 150px;" onkeydown="event.key == 'Enter' && open('./skins/' + this.value +'.png', '_blank', '')"></div><table><tbody id="searchSkinsResults"></tbody></table>`);
        const searchSkinsResults = document.getElementById('searchSkinsResults');
        const pages = [...phpSkins.matchAll(regex)].map(([slot, _, id, __, name]) => [slot.replaceAll('&lt;', '<').replaceAll('&gt;', '>'), id, name]);
        document.getElementById('searchSkin').addEventListener("keydown", function(event) {
            if (event.key == 'Enter')
                searchSkinsResults.innerHTML = '<tr>' + pages
                    .map(([slot, id, name]) => [slot, 2 * (id == this.value) + 2 * (name == this.value) + id.includes(this.value) + name.includes(this.value)])
                    .filter(m => m[1])
                    .sort((a, b) => b[1] - a[1])
                    .map(m => m[0])
                    .map((slot, i) => (console.log(i), slot + ((i + 1) % 4 ? '' : '</tr><tr>')))
                    .join('')
                 + '</tr>';
        });
    }

    var loaded = false;
    document.addEventListener("DOMContentLoaded", () => {
        if (loaded) return;
        loaded = true;

        const originalPost = unsafeWindow.$.post;
        unsafeWindow.$.post = function(url, data, callback, type) {
            if (url == "skins.php")
                return originalPost.call(this, url, data, function(response) {
                    callback(response);
                    init(response);
                }, type);
            return originalPost.apply(this, arguments);
        };
    });
})();