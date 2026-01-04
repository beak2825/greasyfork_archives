// ==UserScript==
// @name         GGn Ignore Requests
// @namespace    none
// @version      2
// @description  Ignore individual requests and by user
// @author       ingts
// @match        https://gazellegames.net/requests.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/487639/GGn%20Ignore%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/487639/GGn%20Ignore%20Requests.meta.js
// ==/UserScript==

if (location.href.includes('action=view')) {
    const id = new URL(location.href).searchParams.get('id')
    let ignored = GM_getValue(id)
    const button = document.createElement('a')
    button.href = 'javascript:'
    button.className = 'brackets'
    button.textContent = ignored ? ' Unignore ' : ' Ignore '
    document.querySelector('div.linkbox').append(button)
    button.onclick = () => {
        if (ignored) {
            GM_deleteValue(id)
            button.textContent = ' Ignore '
            ignored = false
        } else {
            GM_setValue(id, 1)
            button.textContent = ' Unignore '
            ignored = true
        }
    }

    let users = GM_getValue('users', [])
    const name = document.querySelector("td > strong > a").textContent
    const button2 = document.createElement('a')
    button2.href = 'javascript:'
    button2.className = 'brackets'
    let userIgnored = users.includes(name)
    button2.textContent = userIgnored ? ' Unignore User ' : ' Ignore User '
    document.querySelector('div.linkbox').append(button2)
    button2.onclick = () => {
        if (userIgnored) {
            users = users.filter(n => n !== name)
            GM_setValue('users', users)
            button2.textContent = ' Ignore User '
            userIgnored = false
        } else {
            users.push(name)
            GM_setValue('users', users)
            button2.textContent = ' Unignore User '
            userIgnored = true
        }
    }
} else if (location.href.endsWith('requests.php') || location.href.includes('page=')) {
    const users = GM_getValue('users', [])
    document.querySelectorAll('#requests_list tr:not(.colhead_dark)').forEach(row => {
        if (GM_getValue(/\d+/.exec(row.querySelector('a').href)[0]) || users.includes(row.querySelector('a.username').textContent)) row.remove()
    })
}