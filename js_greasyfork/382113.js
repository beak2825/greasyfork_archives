// ==UserScript==
// @name         CCleaner free version download automatically redirect to ccleaner.com
// @namespace    zhihaofans
// @version      0.0.2
// @description  Automatically redirect to ccleaner.com download
// @author       zhihaofans
// @include        https://www.ccleaner.com/ccleaner/update
// @include        https://www.ccleaner.com/de-de/ccleaner/update
// @include        https://www.ccleaner.com/es-es/ccleaner/update
// @include        https://www.ccleaner.com/fr-fr/ccleaner/update
// @include        https://www.ccleaner.com/it-it/ccleaner/update
// @include        https://www.ccleaner.com/nl-nl/ccleaner/update
// @include        https://www.ccleaner.com/ru-ru/ccleaner/update
// @include        https://www.ccleaner.com/ru-ru/ccleaner/update
// @grant        Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/382113/CCleaner%20free%20version%20download%20automatically%20redirect%20to%20ccleanercom.user.js
// @updateURL https://update.greasyfork.org/scripts/382113/CCleaner%20free%20version%20download%20automatically%20redirect%20to%20ccleanercom.meta.js
// ==/UserScript==
(function () {
    window.location.href="https://www.ccleaner.com/ccleaner/download/standard";
})();
