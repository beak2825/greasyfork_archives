// ==UserScript==
// @name         TetrioAutoInvite
// @namespace    https://fazerog02.dev
// @version      0.2
// @description  when you create new private custom game, this system send message to teams channel
// @author       fazerog02
// @match        https://tetr.io/
// @icon         https://www.google.com/s2/favicons?domain=tetr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427088/TetrioAutoInvite.user.js
// @updateURL https://update.greasyfork.org/scripts/427088/TetrioAutoInvite.meta.js
// ==/UserScript==

let last_roomid = null

const sendTeams = (roomid) => {
    const url = "https://prod-16.japaneast.logic.azure.com:443/workflows/65089436a34e4290a41c5b8b168ce212/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZqAix7W-TidofWtB4EKYU3oLRnd9pMklWvTEle87EHU"
    const data = JSON.stringify({
        message: `https://tetr.io/${roomid}`
    })
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
}

(function() {
    const roomid = document.getElementById("roomid")
    const observer = new MutationObserver((record, obs) => {
        const player_count = document.getElementById("playercount")
        console.log(player_count.innerText)
        if(player_count.innerText === "1"){
            const roomid = record[0].target.innerText
            if(last_roomid !== roomid){
                last_roomid = roomid
                sendTeams(roomid)
            }
        }
    })
    const config = {
        childList: true,
        attributes: true,
        characterData: true
    }
    observer.observe(roomid, config)
})();