// ==UserScript==
// @name         RandomNerdTutorials Free Ebooks -> Insider
// @namespace    http://tampermonkey.net/
// @version      2024-02-24
// @description  Make the 'Free Ebooks' Menu Item go over the signup page directly to the Insider Page
// @author       @BenjaminDerProgrammierer
// @match        https://randomnerdtutorials.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=randomnerdtutorials.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488193/RandomNerdTutorials%20Free%20Ebooks%20-%3E%20Insider.user.js
// @updateURL https://update.greasyfork.org/scripts/488193/RandomNerdTutorials%20Free%20Ebooks%20-%3E%20Insider.meta.js
// ==/UserScript==

(function() {
    document.getElementById('menu-item-20487').childNodes[0].href = 'https://randomnerdtutorials.com/insider/';
     document.getElementById('menu-item-20487').childNodes[0].innerText = 'Insider Area - Free eBooks';
})();