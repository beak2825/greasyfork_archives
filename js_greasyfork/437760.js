// ==UserScript==
// @name         No pixlr ads
// @namespace    https://github.com/PixelMelt
// @version      0.4
// @description  Remove the ad sidebar and image download limit from pixlr.
// @author       Pix#7008
// @match        https://pixlr.com/e/
// @icon         https://www.google.com/s2/favicons?domain=pixlr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437760/No%20pixlr%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/437760/No%20pixlr%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removead(){
        localStorage['user-settings'] = '{"lastNewsCheck":"2023-08-10T00:48:05.787Z"}'
        if(window.location.href == `https://pixlr.com/e/#editor`){
            document.getElementById(`workspace`).style.right = `0`
            if(document.getElementById(`iasriiigh`)){
                document.getElementById(`iasriiigh`).remove()
                document.getElementById(`right-space`).remove()
                console.log(`deleted sidebar`)
            }
            if(document.getElementById(`modal-pop`)){
                document.getElementById(`modal-pop`).remove()
                console.log(`deleted pop up`)
            }
            if(document.getElementById(`modal-5488a20440ea`)){
                document.getElementById(`modal-5488a20440ea`).remove()
                console.log(`deleted pop up blur`)
            }
        }
        setTimeout(removead, 1000);
    }
    removead()
})();