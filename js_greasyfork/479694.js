// ==UserScript==
// @name         GGn Title Formatter
// @namespace    none
// @version      40.001
// @description  Formats title, sets alias if applicable and has buttons to undo. Adds buttons in edit page to format name and alias. Easily fix title in group pages
// @author       ingts
// @match        https://gazellegames.net/upload.php
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @match        https://gazellegames.net/upload.php?action=copy&groupid=*
// @exclude      https://gazellegames.net/upload.php?groupid=*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/diff@8.0.2
// @require      https://update.greasyfork.org/scripts/540511/1712720/GGn%20Formatters.js
// @downloadURL https://update.greasyfork.org/scripts/479694/GGn%20Title%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/479694/GGn%20Title%20Formatter.meta.js
// ==/UserScript==

if (typeof GM_getValue('enable_on_upload') === 'undefined')
    GM_setValue('enable_on_upload', false)
if (typeof GM_getValue('group_auto_check') === 'undefined')
    GM_setValue('group_auto_check', true)

let titleInput, alias

function formatText() {
    let origTitle = titleInput.value
    alias = document.getElementById('aliases')
    let origAlias = alias.value

    let titleAfterTitleCase = formatTitle(titleInput.value, alias.value)
    titleInput.value = titleAfterTitleCase

    if (titleAfterTitleCase !== origTitle || alias.value !== origAlias) {
        document.querySelector("#title_tr > td.label").insertAdjacentHTML('beforeend', `<span style="color: #ebaf51;display: block;">Undo Title Formatter</span>
    <div id="tf-undo-buttons"></div>`)

        const buttonDiv = document.getElementById('tf-undo-buttons')

        if (titleAfterTitleCase !== origTitle) {
            const button1 = document.createElement('button')
            button1.textContent = 'Formatting'
            button1.type = 'button'
            button1.onclick = () => {
                titleInput.value = origTitle
            }
            buttonDiv.append(button1)
        }
    }
}

function startTextFormat(wait) {
    const tInterval = setInterval(() => {
        if (document.activeElement === titleInput || !titleInput.value)
            return
        clearInterval(tInterval)
        if (wait) {
            // to allow upload scripts that use the title input's value to set the title before formatting
            setTimeout(formatText, 2000)
        } else formatText()
    }, 500)
}

function addButton(input) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Format'
    button.addEventListener('click', () => {
        input.value = formatTitle(input.value, alias?.value || alias?.textContent)
    })
    input.after(button)
}

if (location.href.includes('upload.php') && GM_getValue('enable_on_upload')) {
    titleInput = document.getElementById('title')

    // changing the category changes the form using a server request and the title input is replaced
    document.getElementById('categories').addEventListener('change', () => {
        new MutationObserver((mutations, observer) => {
            titleInput = document.getElementById('title')
            startTextFormat(true)
            observer.disconnect()
        }).observe(document.getElementById('dynamic_form'), {childList: true, subtree: true})
    })
    startTextFormat(true)
} else if (location.href.includes('editgroup')) {
    titleInput = document.querySelector("input[name=name]")
    alias = document.querySelector('input[name=aliases]')
    addButton(alias)
    addButton(titleInput)
} else { // group page
    const aliasText = document.querySelector('textarea[name=aliases]').textContent
    if (GM_getValue('group_auto_check')) {
        const nameContainer = document.getElementById('display_name')
        const title = document.getElementById('user_script_data').dataset.groupName
        const formatted = formatTitle(title, aliasText)
        const diffChars = Diff.diffChars(title, formatted)

        if (diffChars.length > 1) {
            nameContainer.insertAdjacentHTML('beforeend', `<div style="font-size: initial;" id="title-formatter-check">
    <div style="
    display: flex;
    flex-direction: row;
    justify-content: start;
    column-gap: 3px;
    margin-top: 3px;
">
        <button type="button" style="width: fit-content;" id="title-formatter-close">Close</button>
        <button type="button" style="width: fit-content;background-color: #2f742f;" id="title-formatter-accept">Accept</button>
        <span id="title-formatter-diff" style="margin-left: 5px;"></span>
    </div>
</div>`)
            const span = document.getElementById('title-formatter-diff')
            for (const diffChar of diffChars) {
                let style = ""
                if (diffChar.removed) {
                    if (!/^\s*$/.test(diffChar.value)) { // not space only
                        continue
                    }
                    style = "background-color: red"
                } else {
                    style = 'color: ' + (diffChar.added ? 'lightgreen' : 'rgb(165 146 146)')
                }
                const s = document.createElement('span')
                s.style.cssText = style
                s.textContent = diffChar.value
                span.append(s)
            }

            const mainContainer = document.getElementById('title-formatter-check')
            document.getElementById('title-formatter-close').onclick = () => mainContainer.remove()
            document.getElementById('title-formatter-accept').onclick = () => {
                fetch('torrents.php', {
                    method: 'POST',
                    body: new URLSearchParams(`action=rename&auth=${authkey}&groupid=${/\d+/.exec(location.href)[0]}&name=${encodeURIComponent(formatted)}`),
                }).then(r => {
                    if (r.redirected) {
                        mainContainer.remove()
                        const titleEl = nameContainer.childNodes[0].nodeType === Node.TEXT_NODE ? nameContainer.childNodes[0] : nameContainer.childNodes[1]
                        titleEl.textContent = titleEl.textContent.replace(title, formatted)
                    } else alert('Rename failed')
                })
            }
        }
    }
    // wait to make sure the editor helper loads first
    setTimeout(() => {
        const editHelperRename = document.getElementById('titleEdit')

        if (editHelperRename) {
            editHelperRename.addEventListener('click', () => {
                titleInput = document.querySelector("input[name=name]")
                alias = aliasText
                addButton(titleInput)
            })
        }
    }, 80)
}