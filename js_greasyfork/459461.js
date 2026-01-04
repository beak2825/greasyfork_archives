// ==UserScript==
// @name         lalal.ai downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  downlaod lalal.ai yes
// @author       You
// @match        https://www.lalal.ai/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lalal.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459461/lalalai%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/459461/lalalai%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

function main(){
for (var x of document.querySelectorAll(".widget-player__header.js-audioplayer"))
    {

        if (x.querySelector('button.dl-button') == null){
            var aElem = document.createElement('a')
            aElem.setAttribute("href", x.getAttribute('data-src'))
            var button = document.createElement('button')
            button.className = 'dl-button'
            aElem.appendChild(button)
            x.appendChild(aElem)
        } else {
            var button = x.querySelector('button.dl-button')
        }
        var dlURL = x.getAttribute('data-src')
        button.innerHTML = 'DL ' + dlURL.split('/')[dlURL.split('/').length-1]
    }
    setTimeout(main, 5000);
}

setTimeout(main, 5000);
})();