// ==UserScript==
// @name         Deneme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Çok Yakında Youtube Kanalında
// @author       DARK
// @match        https://btcspinner.io/spinner
// @match        https://btcspinner.io/store
// @match        https://btcspinner.io/store/faucet
// @icon         https://www.google.com/s2/favicons?domain=btcspinner.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436741/Deneme.user.js
// @updateURL https://update.greasyfork.org/scripts/436741/Deneme.meta.js
// ==/UserScript==

(($) => {

    document.body.addEventListener('touchstart', function(e){
        //e.preventDefault()
        alert("sdf");
    }, false)

})(window.jQuery)