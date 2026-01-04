// ==UserScript==
// @name         Automatic Re-Join · Bonk.io
// @namespace    https://greasyfork.org/en/users/962705
// @version      1.0.5
// @license      GPL-3.0
// @description  This script will automatically attempt to rejoin a full room.
// @author       rrreddd
// @match        https://bonk.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456707/Automatic%20Re-Join%20%C2%B7%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/456707/Automatic%20Re-Join%20%C2%B7%20Bonkio.meta.js
// ==/UserScript==

var target = document.getElementById("sm_connectingWindow_text")

let roompass = ""

var observer = new MutationObserver(function(mutations) {
    if ((target.innerText.includes("room_full")) || (target.innerText.includes("no_entry_client"))) {
        roompass = document.getElementById("roomlistjoinpasswordtext").value
        setTimeout(()=>{
            document.getElementById("sm_connectingWindowCancelButton").click()
            setTimeout(()=>{
                document.getElementById("roomlistjoinbutton").click()
                setTimeout(()=>{
                    if (document.getElementById("roomlistjoinpasswordwindowcontainer").style.visibility == "visible") {
                        document.getElementById("roomlistjoinpasswordtext").value = roompass
                        setTimeout(()=>{document.getElementById("roomlistpassjoinbutton").click()}, 2000)
                    }
                }, 1000)
            }, 1000)
        }, 1000)
    }
});

observer.observe(target, {
    attributes:    true,
    childList:     true,
    characterData: true
});