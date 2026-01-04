// ==UserScript==
// @name         NyaaDeadTorrents
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  A simple script to remove dead torrents from the browse section of Nyaa.
// @author       Arjix
// @include      https://nyaa.si/*
// @include      https://sukebei.nyaa.si/*
// @include      https://meowinjapanese.cf/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/417573/NyaaDeadTorrents.user.js
// @updateURL https://update.greasyfork.org/scripts/417573/NyaaDeadTorrents.meta.js
// ==/UserScript==


if (!localStorage.getItem("NyaaRemoveRule")) {
    localStorage.setItem("NyaaRemoveRule", "seeds")
}


function submitSetting() {
    let value = document.getElementById("removeDeadTorrentsRule").value
    localStorage.setItem("NyaaRemoveRule", value)
}


function removeTorrent(torrent, count) {
    torrent.parentNode.removeChild(torrent)
    console.log("Removed torrent with index of: " + count.toString())
}

window.addEventListener("load", function () {
    const title = document.querySelector("title").innerText
    const allMeta = document.head.querySelectorAll("meta")
    const desc = allMeta[allMeta.length - 1].content

    if ("Browse :: Nyaa" === title || desc === "Nyaa homepage" || "Browse :: Sukebei" === title || desc === "Sukebei homepage" || desc.includes("Search for ") || desc.includes("Torrents uploaded by ")) {
        let torrents = document.querySelectorAll(".table-responsive > table > tbody > tr")
        var torrentsCount = torrents.length
        let removeRule = localStorage.getItem("NyaaRemoveRule")
        for (let count = 0; count < torrents.length; count++) {
            let seeds = torrents[count].querySelector("td:nth-child(6)").innerText
            let leachers = torrents[count].querySelector("td:nth-child(7)").innerText

            if (seeds == "0" && removeRule == "seeds") {
                removeTorrent(torrents[count], count)
                torrentsCount = torrentsCount - 1
            } else if (leachers == "0" && removeRule == "leachers") {
                removeTorrent(torrents[count], count)
                torrentsCount = torrentsCount - 1
            } else if (seeds == "0" && leachers == "0" && removeRule == "both") {
                removeTorrent(torrents[count], count)
                torrentsCount = torrentsCount - 1
            }
        }
        if (torrentsCount <= 0) {
            let pagination = document.querySelectorAll("ul.pagination > li")
            let nextPage = pagination[pagination.length - 1].childNodes[0].href
            window.location.replace(nextPage)
        }
    } else if (document.location.href == "https://nyaa.si/profile") {
        if (localStorage.getItem("NyaaRemoveRule") == "seeds") {
            var choiceOne = "<option selected>"
        } else { var choiceOne = "<option>" }
        if (localStorage.getItem("NyaaRemoveRule") == "leachers") {
            var choiceTwo = "<option selected>"
        } else { var choiceTwo = "<option>" }
        if (localStorage.getItem("NyaaRemoveRule") == "both") {
            var choiceThree = "<option selected>"
        } else { var choiceThree = "<option>" }
        var settings = `<div class="row">
					<div class="form-group col-md-4">
							<p>DeadTorrent removeRule:
                            <select id="removeDeadTorrentsRule">` +
            choiceOne + "seeds</option>" +
            choiceTwo + "leachers</option>" +
            choiceThree + "both</option>" +
            `</select></p>
					          </div>
				            </div>`
        $("#preferences-change > form > .row").first().after(settings)
        document.getElementById("submit_settings").addEventListener('click', () => { submitSetting(); }, false);
    }
}, false)