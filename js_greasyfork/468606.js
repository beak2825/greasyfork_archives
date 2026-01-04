// ==UserScript==
// @name         rule34 fav
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fav rule34 post by hotkey 'F' or numpad enter
// @author       teheidomahttps://rule34.xxx/index.php?page=post*
// @match        https://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468606/rule34%20fav.user.js
// @updateURL https://update.greasyfork.org/scripts/468606/rule34%20fav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', event => {
        switch(event.code) {
            case 'KeyF':
            case 'NumpadEnter':
                var url = new URL(window.location.toLocaleString());
                var id = url.searchParams.get('id');
                unsafeWindow.addFav(id.toString());
        }

    }, false);
})();