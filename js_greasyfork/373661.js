// ==UserScript==
// @name         FictionAlley, replace � with '
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all the � characters with '.
// @author       sarjalim
// @match        http://www.fictionalley.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373661/FictionAlley%2C%20replace%20%EF%BF%BD%20with%20%27.user.js
// @updateURL https://update.greasyfork.org/scripts/373661/FictionAlley%2C%20replace%20%EF%BF%BD%20with%20%27.meta.js
// ==/UserScript==

(function () {
    var chapterText = document.querySelectorAll('div.boxtext')[0].innerHTML; // Get chapter text
    var newChapterText = chapterText.replace(new RegExp('�', 'g'), "'"); // Replace characters and deposit chapter text in a new variable
    document.querySelectorAll('div.boxtext')[0].innerHTML = newChapterText; // Replace former chapter text with the updated version
})();