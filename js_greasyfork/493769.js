// ==UserScript==
// @name         Minecraftify Google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the google logo to the minecraft logo
// @author       Crecher
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493769/Minecraftify%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/493769/Minecraftify%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("lnXdpd")[0].srcset = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogodownload.org%2Fwp-content%2Fuploads%2F2014%2F02%2Fminecraft-logo-1.png&f=1&nofb=1&ipt=fba331a41a1de4d315fc89cf15d237a990015f82d05cf1128dec972778270463&ipo=images"; document.getElementsByClassName("lnXdpd")[0].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogodownload.org%2Fwp-content%2Fuploads%2F2014%2F02%2Fminecraft-logo-1.png&f=1&nofb=1&ipt=fba331a41a1de4d315fc89cf15d237a990015f82d05cf1128dec972778270463&ipo=images"
})();