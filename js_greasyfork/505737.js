// ==UserScript==
// @name         GGn Release Title Filler
// @version      6
// @description  Set release title from torrent file
// @author       ingts
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @match        https://gazellegames.net/upload.php*
// @namespace https://greasyfork.org/users/1141417
// @downloadURL https://update.greasyfork.org/scripts/505737/GGn%20Release%20Title%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/505737/GGn%20Release%20Title%20Filler.meta.js
// ==/UserScript==
const autofill = true

const fileInput = document.getElementById('file')
const aliasInput = document.getElementById('aliases')
if (aliasInput.value) {
    GM_addStyle(`
    .aliases1 {
    position: relative;
    display: none;
    top: 25px;
    right: 11%;
    margin-bottom: 15px;
    padding-top: 10px
    }
    
    #fill_title:hover ~ .aliases1 {display: inline-block;}
    .aliases1:hover {display: inline-block;}
    `)
    fileInput.insertAdjacentHTML('afterend', `
    <div class="aliases1">
    <div id="alias-ctn" style="display:flex;flex-direction:column;gap: 1px;">
</div></div>`)

    const aliasCtn = document.getElementById('alias-ctn')
    const aliases = aliasInput.value.split(', ')
        .filter(al => !/[A-Z]{2}\d{4,}/.test(al) && /[a-zA-Z]/.test(al)) // remove DLsite codes and those without latin characters

    aliases.forEach(al => {
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = al
        button.onclick = () => setTitle(false, al)
        aliasCtn.append(button)
    })

    GM_deleteValue("aliases")
}

let filename

fileInput.onchange = () => {
    filename = fileInput.files[0].name
    if (autofill && document.getElementById('categories').value === 'Games') {
        if (!/\s/.test(filename) && filename.includes('-')) setTitle(true) // likely scene
        else setTitle(false)
    }
}
addButton(true)
addButton()

function addButton(exact) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = `Fill ${exact ? 'exact' : 'title'}`
    button.onclick = () => setTitle(exact)
    button.style.marginLeft = '6px'
    if (!exact) button.id = 'fill_title'
    fileInput.after(button)
}

const titleInput = document.getElementById('release_title')

function setTitle(exact, alias) {
    const exts = ["flac", "mp3", "pdf", "epub", "mobi", "cbz", "cbr", "cb7", "azw3","zip",
        "7z", "rar", "iso", "sh", "dmg", "appimage", "arc", "nsp", "xci", "exe", "apk", "ipa"]
    const noExt = new RegExp(`(.*?)\\.?(?:${exts.join('|')}|tar.(?:gz|xz|zst|bz2))?.torrent`, 'i').exec(filename)?.[1] ?? ''
    if (exact) {
        titleInput.value = noExt
    } else {
        const groupTitle = document.getElementById('title').value

        const s = /v\d/.test(noExt) ? "v\\d" : "(?<=\\s)\\d+(?:\\.\\d)*$" // so that a number in the title isn't taken as the version
        let version = new RegExp(`(?:[(\\[].*)?${s}.*`).exec(noExt)?.[0] // optional bracket before version
            ?? /[(\[].*[\])]/.exec(noExt)?.[0] // bracket only for e.g. (Build 123456)
            ?? ''

        if (/^\d/.test(version)) {
            version = `v${version}`
        }

        titleInput.value = `${alias ? alias : groupTitle} ${version}`
        titleInput.dispatchEvent(new Event('blur'))
    }
}

