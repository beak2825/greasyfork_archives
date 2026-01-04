// ==UserScript==
// @name        See LinkedIn Profile Views
// @namespace   Violentmonkey Scripts
// @match       https://www.linkedin.com/me/profile-views/urn:li:wvmp:summary/
// @grant       none
// @version     1.1
// @author      turtlebasket
// @license     MIT
// @description 3/30/2022
// @downloadURL https://update.greasyfork.org/scripts/442347/See%20LinkedIn%20Profile%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/442347/See%20LinkedIn%20Profile%20Views.meta.js
// ==/UserScript==

let docStr = new XMLSerializer().serializeToString(document)

let stalkersHTML = "<u><h3>PROFILE VIEWERS</h3></u><br>"

for (let line of docStr.split('\n')) {
    if (line.search("firstName") != 0 && line.search("lastName" != 0)) {
        try {
            let res = JSON.parse(line)["included"] ?? null
            if (res != null) {
                for (let item of res) {
                    if (item["$type"] == "com.linkedin.voyager.identity.shared.MiniProfile") {

                        photoUrl = item["picture"]["rootUrl"] +
                         item["picture"]["artifacts"].filter(a => a.width == 200)[0]["fileIdentifyingUrlPathSegment"]

                        stalkersHTML +=
                            `<div style="display:flex; flex-direction:row; margin-bottom: 10px;">
                                <div class="display:flex;">
                                    <img style="min-width: 52px; max-width: 52px" src="${photoUrl}">
                                </div>
                                <div style="display:flex flex-direction:column; margin-left: 12px;">
                                    <strong><a href="https://linkedin.com/in/${item.publicIdentifier}"><h4>${item.firstName} ${item.lastName}</h4></a></strong>
                                    <i>${item.occupation}</i>
                                </div>
                            </div>`;
                    }
                }
            }
        } catch (e) {}
    }
}

let list = document.createElement("div")
list.style.padding = "18px"
list.style.backgroundColor = "lightgray"
list.style.borderRadius = "5px"
list.style.color = "black"
list.style.fontFamily = ["Comic Sans", "Sans-Serif"]
list.style.display = "flex"
list.style.flexDirection = "column"
list.innerHTML = stalkersHTML

console.log(list)

let el = document.getElementById("ember37")
el.appendChild(list)
