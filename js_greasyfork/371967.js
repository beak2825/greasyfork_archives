// ==UserScript==
// @name         Snapcode Color Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change snapcode color
// @author       www.youtube.com/bryxz
// @match        https://app.snapchat.com/web/deeplink/snapcode?type=SVG&size=520&username=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371967/Snapcode%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/371967/Snapcode%20Color%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName("path")[1].style.fill = "#ff32ff";
})();