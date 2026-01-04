// ==UserScript==
// @name         GGn Group Quick Search
// @version      3
// @description  Buttons to search torrents and log
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @namespace https://greasyfork.org/users/1141417
// @downloadURL https://update.greasyfork.org/scripts/541450/GGn%20Group%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/541450/GGn%20Group%20Quick%20Search.meta.js
// ==/UserScript==
const title = document.getElementById('user_script_data').dataset.groupName

createCornerButton('left-vertical', 'Torrents', () => {
    GM_openInTab(`https://gazellegames.net/torrents.php?action=advanced&groupname=${title}`, {active: true})
})

createCornerButton('left-vertical', 'Log', e => {
    const b = "https://gazellegames.net/log.php?search="
    if (e.shiftKey) {
        GM_openInTab(`${b}Torrent Group ${/\d+/.exec(location.href)[0]}`, {active: true})
        return
    }
    GM_openInTab(`${b}${title}`, {active: true})
})