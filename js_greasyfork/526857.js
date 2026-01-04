// ==UserScript==
// @name         GGn Quick Bump Requests
// @namespace    none
// @version      1
// @description  Bump requests from the list page
// @author       ingts
// @match        https://gazellegames.net/requests.php*
// @exclude      https://gazellegames.net/requests.php?action=new*
// @downloadURL https://update.greasyfork.org/scripts/526857/GGn%20Quick%20Bump%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/526857/GGn%20Quick%20Bump%20Requests.meta.js
// ==/UserScript==
const submit = document.querySelector('div.submit')
const rows = document.querySelectorAll("#requests_list > tbody > tr:not(.colhead_dark)")
const button = document.createElement('button')
button.textContent = 'Show bump buttons'
button.type = 'button'
button.style.marginTop = '10px'
submit.append(button)
button.onclick = () => {
    button.remove()
    rows.forEach(row=> {
        const voteButton = row.querySelector('a[href*="IndexVote"]')
        const bump = document.createElement('button')
        bump.textContent = 'Bump'
        bump.style.margin = '3px auto 0 auto'
        bump.style.display = 'block'
        bump.onclick = () => {
            bump.disabled = true
            fetch(`requests.php?action=bumprequest&id=${/\d+/.exec(voteButton.href)[0]}`)
                .then(r => {
                    if (r.status === 200) bump.textContent = 'Bumped'
                })
        }
        voteButton.after(bump)
    })
}