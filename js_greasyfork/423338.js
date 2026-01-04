// ==UserScript==
// @name         SimpleShortcuts
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      2.4
// @description  Create single-key shortcuts for any page. Press ctrl+alt+s to open manager.
// @author       fujifruity
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/423338/SimpleShortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/423338/SimpleShortcuts.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // With Tampermonkey, you can directly modify shortcuts from Storage tab (Advance mode only) in the editor.

    // Find the longest matching url from GM cache
    let targetUrl; {
        const urls = await GM.listValues()
        console.log('urls', urls)
        const foundUrl = urls.sort((a, b) => b.length - a.length).find(url => location.href.startsWith(url))
        targetUrl = foundUrl ?? location.protocol + '//' + location.host + location.pathname
    }
    const getShortcuts = async () => {
        const shortcuts = await GM.getValue(targetUrl) ?? '{}'
        return JSON.parse(shortcuts)
    }
    const elem = selector => document.querySelector(selector)
    const setShortcuts = async () => {
        const shortcuts = await getShortcuts()
        Object.keys(shortcuts).forEach(k => {
            window.addEventListener('keydown', event => {
                if (["INPUT", "TEXTAREA"].includes(event.target.tagName) ||
                 event.ctrlKey || event.altKey || event.metaKey || event.key != k) return
                const button = elem(shortcuts[k])
                button.focus()
                button.click()
                console.log('clicking', button);
            })
        })
    }
    // Set shortcuts if exist
    setShortcuts()

    const modalId = 'fujifruity-simpleshortcuts'
    const modal = `
        <style>
            #${modalId} * { margin:4px; }
            #${modalId} #modalTitle { font-weight:bold; }
            #${modalId} {
                z-index:99999; width:auto; max-height:90%; position:fixed;
                margin:16px; padding:16px; border-radius:8px; overflow-y:auto;
                box-shadow:rgba(0, 0, 0, 0.35) 0px 5px 15px; background-color:white
            }
        </style>
        <div id=${modalId}  >
            <div id=modalTitle>SimpleShortcuts for</div>
            <div id=targetUrl></div>
            <hr class="solid">
            <input id=keyInput size=3 placeholder=key maxlength=20>
            <input id=valueInput size=16 placeholder="CSS selector">
            <button id=saveButton>Save</button>
            <div id=shortcutList></div>
        </div> `
    const createModal = async () => {
        document.body.innerHTML = modal + document.body.innerHTML
        // Init url input
        elem('#targetUrl').textContent = targetUrl
        // Init key input
        const keyInput = elem('#keyInput')
        keyInput.addEventListener('keyup', event => {
            keyInput.value = event.key
            keyInput.size = event.key.length
        })
        // Init shortcut list
        const updateShortcutList = async () => {
            const shortcuts = await getShortcuts()
            const lines = Object.keys(shortcuts).map(k => `<div>${k ? k : '" "'} ➔ ${shortcuts[k]}</div>`).join('')
            elem('#shortcutList').innerHTML = lines
        }
        updateShortcutList()
        // Init save button
        elem('#saveButton').onclick = async () => {
            const key = elem('#keyInput').value
            const value = elem('#valueInput').value
            const shortcuts = await getShortcuts()
            if (!key) return
            if (value) {
                shortcuts[key] = value
            } else {
                delete shortcuts[key]
            }
            await GM.setValue(targetUrl, JSON.stringify(shortcuts))
            updateShortcutList()
            setShortcuts()
        }
        return elem('#' + modalId)
    }

    window.addEventListener('keydown', async event => {
        if (!event.altKey && !event.metaKey || !event.ctrlKey || event.key != 's') return
        // Show modal
        const modal = elem('#' + modalId) ?? await createModal()
        modal.style.display = 'block'
        modal.focus()
        // Set event listeners to close modal
        const closeModal = modal => { modal.style.display = 'none' }
        const onKeydown = event => {
            if (["INPUT", "TEXTAREA"].includes(event.target.tagName) || event.key != 'Escape') return
            closeModal(modal)
            window.removeEventListener('keydown', onKeydown)
        }
        const onClick = event => {
            if (modal.contains(event.target)) return
            closeModal(modal)
            window.removeEventListener('click', onClick)
        }
        window.addEventListener('keydown', onKeydown)
        window.addEventListener('click', onClick)
    });
})()