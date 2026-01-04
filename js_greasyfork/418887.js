// ==UserScript==
// @name         TableOfContents
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      1.4
// @description  Create a table of contents for the page. ctrl+alt(command)+t to show; click an item to jump; escape or click outside to close.
// @author       fujifruity
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418887/TableOfContents.user.js
// @updateURL https://update.greasyfork.org/scripts/418887/TableOfContents.meta.js
// ==/UserScript==

{
    const modalId = 'fujifruity-toc'
    const createModal = () => {
        const modalHTML = `
            <div id=${modalId} style="z-index:99999; width:auto; max-height:90%; position:fixed;
                padding:1em; margin:1em; border-radius: 8px; overflow-y:auto; cursor:pointer;
                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; background-color:white" >
            </div> `
        document.body.innerHTML = modalHTML + document.body.innerHTML
        const modal = document.getElementById(modalId)
        // Add headdings to the modal
        const headdings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        const clickableHeaddings = headdings.map((e, i) => {
            e = e.cloneNode(true)
            modal.appendChild(e)
            e.style.color = 'black'
            e.style.backgroundColor = 'white'
            e.addEventListener('click', event => headdings[i].scrollIntoView({ behavior: "smooth" }))
            return e
        })
        return modal
    }
    const getModal = () => document.getElementById(modalId) ?? createModal()
    const closeModal = () => { getModal().style.display = 'none' }
    window.addEventListener('keydown', event => {
        if (!event.altKey && !event.metaKey || !event.ctrlKey || event.key != 't') return
        // Show modal
        getModal().style.display = 'block'
        // Set shortcut to close modal
        const onKeydown = event => {
            if (event.key != 'Escape') return
            closeModal()
            window.removeEventListener('keydown', onKeydown)
        }
        const onClick = event => {
            closeModal()
            window.removeEventListener('click', onClick)
        }
        window.addEventListener('keydown', onKeydown)
        window.addEventListener('click', onClick)
    })
}