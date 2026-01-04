// ==UserScript==
// @name         BTCspinner.io - Auto-spin
// @namespace    hhttps://greasyfork.org/fr/users/823129-sigri44
// @version      0.2
// @description  Auto-spin from BTCspinner.io
// @author       Sigri44
// @match        https://btcspinner.io/spinner
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438500/BTCspinnerio%20-%20Auto-spin.user.js
// @updateURL https://update.greasyfork.org/scripts/438500/BTCspinnerio%20-%20Auto-spin.meta.js
// ==/UserScript==

(function() {
    'use strict'

    $(document).ready(function(){
        console.log("Status:: Page loaded")
        setTimeout(function(){
            $('.rounded-pill')[1].click()
            console.log("Status:: Spinned")
        }, 1000)
        let spinner = setInterval(function(){
            switch($('#swal2-title').text()) {
                case "You won":
                    // Close win pop-up
                    $('.swal2-confirm').click()
                    break
                case "Scratch and Win":
                    // Scratch all
                    $('.rounded-pill')[3].click()
                    break
                case "One chest contains:":
                    // Chest are 3/4/5
                    let rand = random(3, 6)
                    $('.rounded-pill')[rand].click()
                    $('.rounded-pill')[3].click()
                    break
                case "Nope. Better luck next time.":
                    // Close lose pop-up
                    $('.swal2-confirm').click()
                    break
                case "Out of Spins!":
                    console.log("Out of spin !")
                    // Free refill
                    $('.rounded-pill')[3].click()
                    //clearInterval(spinner)
                    break
            }
            // Respin
            $('.rounded-pill')[1].click()
            console.log("Status:: Spinned again")
        }, 3500)
    })
    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
})();