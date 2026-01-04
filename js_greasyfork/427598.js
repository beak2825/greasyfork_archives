// ==UserScript==
// @name         Neopets: Tarla's Treasure checker
// @author       Cody Woolaver, Tombaugh Regio
// @version      1.2
// @namespace    https://greasyfork.org/users/780470
// @description  Checks to see if Tarla is around. Forked from Cody Woolaver's Magma Pool Checker
// @include      *://www.neopets.com/freebies/tarlastoolbar.phtml
// @license      MIT
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/427598/Neopets%3A%20Tarla%27s%20Treasure%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/427598/Neopets%3A%20Tarla%27s%20Treasure%20checker.meta.js
// ==/UserScript==

//==========================================================

const WAIT = {
    //Refresh intervals when Tarla might show up (in minutes)
    min: 1,
    max: 3,

    //Refresh intervals when she won't (in minutes)
    idle: 30
}

//=============================================================

const TARLA_REJECTED = 'http://images.neopets.com/freebie/tarla1.gif'
const MINUTES = 1000 * 60

//Get the time in NST from the header clock
const nst = document.getElementById("nst").innerText.match(/(\d+):.+([ap]m)/)
const isPM = (nst[2] == 'pm')
const nstHour = parseInt(nst[1]) + (isPM ? 12 : 0 )

//If Tarla will not show up today, ask if user wants to close the tab
if (/Tarla is busy with her other chores today/.test(document.querySelector('.content'))) {
    if(confirm('Tarla will not give out prizes today. Would you like to close this page?')){
        window.close()
    }
} else if (document.body.innerHTML.indexOf(TARLA_REJECTED) == -1){
    //If Tarla is here, create a pop-up alert
    alert('Tarla is here!')

} else if (nstHour % 6 == 0) {
    //If Tarla will show up today, but the timeslot isn't right, refresh every so often
    window.setTimeout(() => location.reload(), WAIT.idle * MINUTES)

} else {
    //If the rough timeslot is correct but Tarla isn't here yet, refresh at random intervals
    const waitTime = (WAIT.min + (Math.random() * (WAIT.max - WAIT.min))) * MINUTES
    window.setTimeout(() => location.reload(), waitTime)
}