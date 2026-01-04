// ==UserScript==
// @name         Affilikala
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  embed your affilio.ir verified affiliate link to digikala links!
// @author       You
// @match        https://www.digikala.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digikala.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448843/Affilikala.user.js
// @updateURL https://update.greasyfork.org/scripts/448843/Affilikala.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
var anchors = document.getElementsByTagName("a");

for (var i = 0; i < anchors.length; i++) {
    var str = anchors[i].href;
    var regex = /[%].*/;
    str = str.replace(regex, "");
    anchors[i].href = str + "?utm_source=https:__toogb-ir&utm_medium=AFFILIATE&utm_campaign=لینک توسعه دهنده&utm_content=توجیبی&affid=ZmU0MGM3YzYtZWU0OC00NzUyLWJlZTEtMmE5NDcxNzY5N2IwIyMjODQ2MTQ=&exp=2"
}
})