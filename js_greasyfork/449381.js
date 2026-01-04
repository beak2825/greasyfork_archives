// ==UserScript==
// @name         Auto Rejoin
// @namespace    https://greasyfork.org/users/945115
// @version      0.4
// @license      GPL-3.0
// @description  Automatically attempts to rejoin when the room is full.
// @author       left paren
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449381/Auto%20Rejoin.user.js
// @updateURL https://update.greasyfork.org/scripts/449381/Auto%20Rejoin.meta.js
// ==/UserScript==

var target = document.getElementById("sm_connectingWindow_text")

let roompass = ""

var observer = new MutationObserver(function(mutations) {
    if (/room_full|no_client_entry/.test(target.innerText)) {
        roompass = document.getElementById("roomlistjoinpasswordtext").value
        setTimeout(()=>{
            document.getElementById("sm_connectingWindowCancelButton").click()
            setTimeout(()=>{
                document.getElementById("roomlistjoinbutton").click()
                setTimeout(()=>{
                    if (document.getElementById("roomlistjoinpasswordwindowcontainer").style.visibility == "visible") {
                        document.getElementById("roomlistjoinpasswordtext").value = roompass
                        setTimeout(()=>{document.getElementById("roomlistpassjoinbutton").click()}, 100)
                    }
                }, 1)
            }, 1)
        }, 1)
    }
});

observer.observe(target, {
    attributes:    true,
    childList:     true,
    characterData: true
});