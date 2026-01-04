// ==UserScript==
// @name         GGn Collection Removal Buttons
// @namespace    none
// @version      2
// @description  Adds a button to each theme collection for easy removal
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/485174/GGn%20Collection%20Removal%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/485174/GGn%20Collection%20Removal%20Buttons.meta.js
// ==/UserScript==
const collectionsDiv = document.querySelector('.theme_collections')
if (collectionsDiv) {
    collectionsDiv.querySelectorAll('div').forEach(div => {
        div.style.display = 'flex'
        div.style.alignItems = 'center'
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = 'X'
        button.style.cssText = `
            filter: opacity(0.7);
    font-size: 0.9em;
    width: min-content;
    height: min-content;
    margin-left: auto;`

        div.append(button)
        button.onclick = () => {
            button.disabled = true
            const groupId = new URL(location.href).searchParams.get('id')
            const collectionId = /\d+/.exec(div.firstElementChild.href)[0]
            fetch('collections.php', {
                method: 'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `action=manage_handle&auth=${authkey}&collageid=${collectionId}&remove[]=${groupId}&submit=Remove`
            })
                .then(r => {
                    if (!(r.ok && r.redirected)) {
                        button.disabled = false
                        throw Error
                    }
                    button.textContent = '✓'
                })
                .catch(() => {
                    alert(`Failed to remove collection ID ${collectionId}`)
                })
        }
    })
}