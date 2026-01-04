// ==UserScript==
// @name         GGn Submit Both Edit Forms
// @version      3
// @description  Submit wiki and non-wiki forms together
// @author       ingts
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @namespace https://greasyfork.org/users/1141417
// @downloadURL https://update.greasyfork.org/scripts/542738/GGn%20Submit%20Both%20Edit%20Forms.user.js
// @updateURL https://update.greasyfork.org/scripts/542738/GGn%20Submit%20Both%20Edit%20Forms.meta.js
// ==/UserScript==

/** @type {HTMLFormElement[]} */
const formElements = [...document.querySelectorAll('#content form[action="torrents.php"]')]
formElements.length = 2

if (formElements[1]) {
    for (const formElement of formElements) {
        button(formElement.querySelector('input[type=submit]'))
    }
}

function button(insert) {
    const input = document.createElement('input')
    input.type = 'button'
    input.value = 'Submit Both'
    input.style.marginLeft = '5px'
    insert.insertAdjacentElement('afterend', input)

    input.onclick = async () => {
        if (!formElements[0].reportValidity() || !formElements[1].reportValidity()) return
        input.disabled = true
        const formDatas = [new FormData(formElements[0]), new FormData(formElements[1])]

        const fetches = formDatas.map((fd, index) => {
            fetch('torrents.php', {
                method: 'POST',
                body: fd,
            }).then(r => {
                if (!(r.ok && r.redirected)) {
                    console.error(r)
                    input.disabled = false
                    alert(`Failed to submit ${index === 0 ? 'wiki' : 'non-wiki'} form`)
                    throw new Error()
                }
            })
        })


        Promise.all(fetches).then(() => {
            setTimeout(() => {
                location.href = `https://gazellegames.net/torrents.php?id=${/\d+/.exec(location.href)[0]}`
            }, 1000)
        })
    }
}