// ==UserScript==
// @name         Aternos auto starter
// @namespace    dsc.bio/jamsandwich47
// @version      0.1
// @description  poggus
// @author       Kur0
// @match        https://aternos.org/server/
// @icon         https://www.google.com/s2/favicons?domain=aternos.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428347/Aternos%20auto%20starter.user.js
// @updateURL https://update.greasyfork.org/scripts/428347/Aternos%20auto%20starter.meta.js
// ==/UserScript==

function wait_for_bar(){
    if (document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.offline")!=='null' ){
        document.querySelector("#start").click()
    }
    if (document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-actions.queueing.pending")!=='null' ){
        document.querySelector("#confirm").click()
    }
    if (document.querySelector("#read-our-tos > main > div").style.display == 'block'){
        document.querySelector("#read-our-tos > main > div > div > div > main > div > a.btn.btn-green").click()
    }

}



var interval1 = setInterval(wait_for_bar, 1000)