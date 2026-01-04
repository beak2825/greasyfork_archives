// ==UserScript==
// @name         tweetdeck wider column
// @namespace    https://github.com/jubyshu
// @version      0.0.1
// @icon         https://tweetdeck.twitter.com/favicon.ico
// @description  Make tweetdeck column wider
// @author       jubyshu
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390651/tweetdeck%20wider%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/390651/tweetdeck%20wider%20column.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let colStyle = document.createElement('style');
    colStyle.innerText = '.column{width:500px !important;}';
    document.getElementsByTagName('head')[0].appendChild(colStyle);

})();