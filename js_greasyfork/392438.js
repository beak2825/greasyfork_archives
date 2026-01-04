// ==UserScript==
// @name         bandcamp quick embed code
// @version      0.1
// @description  one-click embed code
// @match        https://*.bandcamp.com/*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/2653
// @downloadURL https://update.greasyfork.org/scripts/392438/bandcamp%20quick%20embed%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/392438/bandcamp%20quick%20embed%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var id = unsafeWindow.TralbumData.id;
    var title = document.title;
    var code = '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=' + id + '/size=small/bgcol=ffffff/linkcol=0687f5/transparent=true/" seamless><a href="' + url + '">' + title + '</a></iframe>';

    var myli = document.createElement('li');
    myli.innerHTML = '<span id="my-copy-embed">Copy Embed</span>';
    myli.addEventListener('click', function() { GM_setClipboard(code, 'text') });

    var ctrlbar = document.getElementsByClassName('share-collect-controls')[0];
    var ul = ctrlbar.children[0];
    ul.appendChild(myli);

})();