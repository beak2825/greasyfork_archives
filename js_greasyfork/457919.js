// ==UserScript==
// @name         Pornhub Title Change
// @namespace    https://greasyfork.org/zh-CN/scripts/457919
// @version      0.1
// @description  Pornhub Title Change.
// @author       You
// @match        https://cn.pornhub.com/view_video.php?viewkey=ph63aadc1d046c4
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457919/Pornhub%20Title%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/457919/Pornhub%20Title%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let author = document.querySelector('.userInfo .usernameBadgesWrapper').innerText
    document.title += " - "+author
})();