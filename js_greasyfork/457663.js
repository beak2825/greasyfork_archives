// ==UserScript==
// @name         Download vdip map history as a GIF
// @namespace    https://github.com/arlm
// @version      0.2
// @description  Make a GIF out of the vDip game history maps
// @author       arlm
// @license      MIT
// @match        https://www.vdiplomacy.com/board.php*
// @match        https://vdiplomacy.com/board.php*
// @icon         https://www.google.com/s2/favicons?domain=vdiplomacy.com
// @require https://greasyfork.org/scripts/457666-gif-js-v2/code/gifjs_v2.js?version=1135176
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457663/Download%20vdip%20map%20history%20as%20a%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/457663/Download%20vdip%20map%20history%20as%20a%20GIF.meta.js
// ==/UserScript==

let imgHref = window.location.href;

if (imgHref.includes('vdiplomacy.com') && imgHref.includes('viewArchive=Maps')) {
    var returnButton = document.querySelector('body > div.content.content-follow-on > p > a.light');
    var downloadLink = document.createElement ('a');
    downloadLink.addClassName('light');
    downloadLink.setStyle("margin-left: 1em; color: #6d5238;");
    downloadLink.innerText = 'Download GIF'
    downloadLink.onclick = function(){
        var images = Array.from(document.querySelectorAll('body > div.content.content-follow-on > p > img')).reverse();

        var gif = new GIF({
          workers: 2,
          quality: 10
        });

        images.forEach(
            function(img){
                gif.addFrame(img, {delay: 1250});
            }
        )

        gif.on('finished', function(blob) {
          window.open(URL.createObjectURL(blob));
        });

        gif.render();
    };

    returnButton.parentElement.appendChild(downloadLink);
}