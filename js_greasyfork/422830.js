// ==UserScript==
// @name        AO3 Browsing Notes
// @description Userscript for notes that appear next to works when you're browsing AO3
// @include     *://archiveofourown.org/tags/*/works*
// @include     *://archiveofourown.org/collections/*/works*
// @include     *://archiveofourown.org/works?*
// @include     *://archiveofourown.org/users/*/works*
// @include     *://archiveofourown.org/works/search?*
// @namespace   https://greasyfork.org/en/scripts/422830-ao3-browsing-notes
// @version     0.3
// @run-at      document-end
// @grant       GM.getValue
// @grant       GM.setValue

// @downloadURL https://update.greasyfork.org/scripts/422830/AO3%20Browsing%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/422830/AO3%20Browsing%20Notes.meta.js
// ==/UserScript==


'use strict';

const createElem = (elemType, idName, workID, clsName, text = "") => {
    const elem = document.createElement(elemType)
    elem.setAttribute("work-id", workID)
    elem.id = idName
    elem.className = clsName
    elem.textContent = text
    return elem
}


const createAddBtn = workID => {
    const addChangeNote = async () => {

        const displayDiv = document.querySelector(`#displayDiv${workID}`)
        const noteTextarea = document.querySelector(`#noteTextarea${workID}`)
        const addBtn = document.querySelector(`#addBtn${workID}`)
        if(noteTextarea.style.display === "none"){
            noteTextarea.style.display = "block"
            displayDiv.style.display = "none"
            noteTextarea.value = displayDiv.textContent
            addBtn.textContent = "Save Note"
        }else {
            noteTextarea.style.display = "none"
            displayDiv.style.display = "block"
            displayDiv.textContent = noteTextarea.value
            await GM.setValue(workID, noteTextarea.value)
            addBtn.textContent = "Add/Edit Note"
        }
    }
    const newBtn = createElem("button", `addBtn${workID}`, workID, "ao3-note-btn", "Add/Edit Note")
    newBtn.addEventListener("click", addChangeNote)
    return newBtn
}

const createNoteTextarea = (workID, text) => {
    const noteTextarea = createElem("textarea", `noteTextarea${workID}`, workID, "ao3-note-textarea", text)
    noteTextarea.style.display = "none"
    return noteTextarea
}

const createButtonDiv = workID => {
    const btnDiv = createElem("div", `btnDiv${workID}`, workID, "ao3-note-div ao3-note-btn-div", undefined)
    btnDiv.appendChild(createAddBtn(workID))
    return btnDiv
}

const createTextDisplayDiv = (workID, text) => {
    const displayDiv = createElem("div", `displayDiv${workID}`, workID, "ao3-note-div ao3-note-display-div", text)
    displayDiv.style.whiteSpace = "pre"
    return displayDiv
}

const createOuterDiv = (workID, text) => {
    const outerDiv = createElem("div", `outerDiv${workID}`, workID, "ao3-note-div ao3-note-outer-div", undefined)
    outerDiv.style.backgroundColor = "#ECECEC"
    outerDiv.style.border = "thin solid #000000"
    outerDiv.appendChild(createButtonDiv(workID))
    outerDiv.appendChild(createTextDisplayDiv(workID, text))
    outerDiv.appendChild(createNoteTextarea(workID, text))
    return outerDiv
}

const createFullDisplay = async () => {
    const worksList = document.querySelectorAll("li.work.blurb.group")
    for(let work of worksList){
        const summary = work.querySelector("blockquote.userstuff.summary")
        const workID = work.id
        const storedText = await GM.getValue(workID, "")
        summary.appendChild(createOuterDiv(workID, storedText))
    }
}

createFullDisplay()