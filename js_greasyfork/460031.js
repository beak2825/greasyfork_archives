// ==UserScript==
// @name         Friends removal button & last online time
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds button that deletes selected friend, and also shows last online time.
// @author       Zgoly
// @license      GNU GPL v3.0. https://www.gnu.org/licenses/gpl-3.0.html
// @match        https://www.roblox.com/users/*friends*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460031/Friends%20removal%20button%20%20last%20online%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/460031/Friends%20removal%20button%20%20last%20online%20time.meta.js
// ==/UserScript==

// Change name of this class if roblox starts using it (probably not)
const clas = "rb-frblot-modified"

setInterval(() => {
    const friends = document.querySelectorAll(".avatar-card-container")
    friends.forEach(friend => {
        if (!friend.classList.contains(clas)) {
            friend.classList.add(clas)
            friend.style.position = "relative"

            const id = friend.parentElement.id

            // Create a button to remove the friend and add it to the friend element
            const button = document.createElement("button")
            button.style = "position:absolute; top:6px; right:6px; border:none; border-radius:25px; background:rgb(255 0 0 / 50%);"
            button.innerText = "x"
            button.addEventListener("click", () => {
                button.remove()
                $.post(`https://friends.roblox.com/v1/users/${id}/unfriend`).then(() => friend.style.opacity = 0.5)
            })
            friend.appendChild(button)

            // Get the last online time of the current friend using the Roblox API and display it on the friend element
            fetch("https://presence.roblox.com/v1/presence/last-online", {
                "body": `{"userIds":[${id}]}`,
                "method": "POST"
            }).then((response) => response.json()).then((data) => {
                const seconds = Math.round((new Date() - new Date(data.lastOnlineTimestamps[0].lastOnline)) / 1000)
                const time = (seconds < 60) ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` :
                (seconds < 3600) ? `${Math.floor(seconds / 60)} ${Math.floor(seconds / 60) === 1 ? 'minute' : 'minutes'}` :
                (seconds < 86400) ? `${Math.floor(seconds / 3600)} ${Math.floor(seconds / 3600) === 1 ? 'hour' : 'hours'}` :
                (seconds < 604800) ? `${Math.floor(seconds / 86400)} ${Math.floor(seconds / 86400) === 1 ? 'day' : 'days'}` :
                (seconds < 2629746) ? `${Math.floor(seconds / 604800)} ${Math.floor(seconds / 604800) === 1 ? 'week' : 'weeks'}` :
                (seconds < 31556952) ? `${Math.floor(seconds / 2629746)} ${Math.floor(seconds / 2629746) === 1 ? 'month' : 'months'}` :
                `${Math.floor(seconds / 31556952)} ${Math.floor(seconds / 31556952) === 1 ? 'year' : 'years'}`

                // Create a paragraph element
                const lastOnline = document.createElement("p")
                lastOnline.style = "position:absolute; bottom:6px; right:6px;"
                lastOnline.innerText = time
                friend.appendChild(lastOnline)
            })
        }
    })
}, 250)

GM_addStyle(".avatar-card-caption {width: calc(100% - 150px) !important;}")