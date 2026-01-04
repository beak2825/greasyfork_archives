// ==UserScript==
// @name         [GitHub] Additional Hotkeys
// @namespace    https://github.com/oleglegun/github-additional-hotkeys
// @version      0.1
// @description  Hotkeys and additional CSS improvements
// @author       oleglegun <oleg.legun@gmail.com>
// @match        https://github.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393960/%5BGitHub%5D%20Additional%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/393960/%5BGitHub%5D%20Additional%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true
    let firstKey

    // g h - go to the profile
    // g p - go to the projects page

    // Shift Enter - save edited note
    // Arrow Up/Down - select project link + added custom CSS

    const keyG = 'KeyG'
    const keyH = 'KeyH'
    const keyP = 'KeyP'
    const keyN = 'KeyN'
    const keyE = 'KeyE'
    const keyEnter = 'Enter'
    const arrowUp = 'ArrowUp'
    const arrowDown = 'ArrowDown'
    const keyBackspace = 'Backspace'

    const key1 = 'Digit1'
    const key2 = 'Digit2'
    const key3 = 'Digit3'
    const key4 = 'Digit4'
    const key5 = 'Digit5'
    const key6 = 'Digit6'
    const key7 = 'Digit7'
    const key8 = 'Digit8'
    const key9 = 'Digit9'

    function userIsPrinting() {
        return ['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) !== -1
    }

    function isProjectsTabOpened() {
        return window.location.search === '?tab=projects'
    }

    function isProjectOpened() {
        return window.location.pathname.includes('/projects/')
    }

    if (isProjectsTabOpened()) {
        // Focus on first project
        setTimeout(() => document.querySelector('#projects-results h4 a').focus(), 500)
    }

    if (isProjectOpened()) {
        // Add numbers to columns
        // Focus on first column
        setTimeout(() => {
            const columnNamesElements = document.querySelectorAll('.js-project-columns-container .js-project-column-name')

            columnNamesElements.forEach((nameElement, idx) => {
                nameElement.innerText = `${idx + 1} ${nameElement.innerText}`
            })

            document.querySelector('.js-project-columns-container > .project-column').focus()
        }, 500)

    }

    document.addEventListener('keydown', function(e) {
        if (DEBUG) {
            console.log(e)
        }

        switch(e.code) {
            case keyG:
                if (userIsPrinting()) return

                firstKey = e.code
                break
            case keyH:
                if (userIsPrinting()) return

                if (firstKey === keyG) {
                    console.log('g h: Going Home')
                    window.location.assign("/oleglegun");

                    firstKey = null
                }
                break
            case keyP:
                if (userIsPrinting()) return
                if (firstKey === keyG) {
                    console.log('g p: Going to the Projects')
                    e.stopPropagation()
                    window.location.assign('/oleglegun?tab=projects')
                    firstKey = null
                }
                break

            case keyEnter:
                if (e.shiftKey) {
                    const saveNoteButton = document.querySelector('button[data-disable-with="Saving note..."]')

                    if (!saveNoteButton) {
                        return
                    }

                    if (DEBUG) {
                        console.log("Shift Enter: Saving Note")
                    }
                    saveNoteButton.click()
                }
                break
            case arrowUp:
                if (isProjectsTabOpened()) {
                    const projectLinks = document.querySelectorAll('#projects-results h4 a')

                    let focusedLink
                    let focusedLinkIdx
                    let activeElement = document.activeElement

                    for (let i = 0; i < projectLinks.length; i++) {
                        if (activeElement === projectLinks[i]) {
                            focusedLink = projectLinks[i]
                            focusedLinkIdx = i
                        }
                    }

                    if (!focusedLinkIdx) {
                        projectLinks[0].focus()
                    } else {
                        projectLinks[focusedLinkIdx - 1].focus()
                    }
                }
                break
            case arrowDown:
                if (isProjectsTabOpened()) {
                    const projectLinks = document.querySelectorAll('#projects-results h4 a')

                    let focusedLink
                    let focusedLinkIdx
                    let activeElement = document.activeElement

                    for (let i = 0; i < projectLinks.length; i++) {
                        if (activeElement === projectLinks[i]) {
                            focusedLink = projectLinks[i]
                            focusedLinkIdx = i
                        }
                    }

                    if (focusedLinkIdx === undefined) {
                        projectLinks[0].focus()
                    } else {
                        if (focusedLinkIdx === projectLinks.length - 1) return

                        projectLinks[focusedLinkIdx + 1].focus()
                    }
                }
                break
            case key1:
            case key2:
            case key3:
            case key4:
            case key5:
            case key6:
            case key7:
            case key8:
            case key9:
                if (userIsPrinting()) return

                if (isProjectOpened()) {
                    const columnElements = document.querySelectorAll('.js-project-columns-container > .project-column')
                    const columnNumberToFocus = parseInt(e.key)

                    if (columnNumberToFocus <= columnElements.length) {
                        columnElements[columnNumberToFocus - 1].focus()
                    }
                }
                break
            case keyN:
                if (userIsPrinting()) return

                if (isProjectOpened()) {
                    // Click on "Add new card"
                    const focusedElement = document.activeElement
                    focusedElement &&
                        focusedElement.classList.contains("project-column") &&
                        focusedElement.querySelector('button[aria-label^="Add a note"]').click()
                    e.preventDefault() // do not print this 'n' into Textarea
                }
                break
            case keyE:
                if (userIsPrinting()) return

                if (isProjectOpened()) {
                    const focusedElement = document.activeElement
                    focusedElement &&
                        focusedElement.classList.contains('issue-card') &&
                        focusedElement.querySelector('button[data-dialog-id^="edit-note"]').click()
                }
                break
            case keyBackspace:
                if (userIsPrinting()) return

                if (isProjectOpened()) {
                    const focusedElement = document.activeElement
                    focusedElement &&
                        focusedElement.classList.contains('issue-card') &&
                        focusedElement.querySelector('form.js-remove-card-after-request button[type="submit"]').click()
                }
                break
        }
    }, true)

})();
