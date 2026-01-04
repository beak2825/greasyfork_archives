// ==UserScript==
// @name         Add favicon to pinboard
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Add favicon to pinboard bookmarks
// @author       yueyericardo
// @match        https://pinboard.in/u:*
// @icon         https://www.google.com/s2/favicons?domain=pinboard.in
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425373/Add%20favicon%20to%20pinboard.user.js
// @updateURL https://update.greasyfork.org/scripts/425373/Add%20favicon%20to%20pinboard.meta.js
// ==/UserScript==

GM_addStyle(`
/* icon */
.star {
    width: 36px;
    cursor: auto;
}
.star span{
    cursor: pointer;
}
.star img{
    width: 12px;
    margin-left: 6px;
    /* backdrop-filter: invert(1); */
}
.bookmark {
    display: -webkit-inline-flex;
}
.display {
    margin-left: 4px;
}

/* tag */
a.tag, a.filter{
    border:1px solid #ccc;
    padding:0px 6px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.description {
    display: none;
}

`);

(function() {
    'use strict';

    function url_domain(data) {
        var a = document.createElement('a');
        a.href = data;
        return a.hostname;
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function addLinkIcons(){
        var bookmarks = document.getElementsByClassName('bookmark_title');
        for (var i = 0; i < bookmarks.length; i++) {
            var domain = url_domain(bookmarks[i].href);
            // var domain_icon_url = `https://api.faviconkit.com/${domain}/16`;
            // var domain_icon_url = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
            var domain_icon_url = `https://s2.googleusercontent.com/s2/favicons?sz=64&domain=${domain}`;
            // var domain_icon_url = `https://besticon-demo.herokuapp.com/icon?url=${domain}&size=80`;
            // var domain_icon_url = `https://f1.allesedv.com/${domain}`;
            console.log(domain_icon_url);
            var icon = createElementFromHTML(`<img class='url_icon' src=${domain_icon_url}>`)
            bookmarks[i].parentElement.parentElement.children[0].appendChild(icon);
        }
    }

    addLinkIcons();
})();