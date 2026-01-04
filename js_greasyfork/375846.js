// ==UserScript==
// @name               Wenku8 Dark Theme
// @description        Change to dark theme
// @name:zh-TW         文庫小說 黑版
// @description:zh-TW  切換成黑版
// @version            1.0
// @include            /^https?\:\/\/.*?\.wenku8\.net\/novel\//
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/375846/Wenku8%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/375846/Wenku8%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("content").style.color = "#848484";
    document.getElementById("title").style.color = "#848484";
    document.getElementsByTagName("body")[0].style.background = "#111111";
})();