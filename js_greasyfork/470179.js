// ==UserScript==
// @name         uns0urce
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autotype and auto choose target for s0urce.io
// @author       You
// @match        https://s0urce.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=s0urce.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470179/uns0urce.user.js
// @updateURL https://update.greasyfork.org/scripts/470179/uns0urce.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const adblock = document.getElementById('window-msg2')
    adblock.style.display = 'none'

    const desktopWrapper = document.getElementById('desktop-wrapper')
    const customDesktopSettings = document.createElement('div')
    customDesktopSettings.classList.add('desktop-element')
    customDesktopSettings.id = 'desktop-settings'
    customDesktopSettings.style.position = 'absolute'
    customDesktopSettings.style.top = '255px'
    customDesktopSettings.style.left = '130px'
    const customDesktopSettingsImage = document.createElement('img')
    customDesktopSettingsImage.src = 'https://cdn.discordapp.com/attachments/1121687891404406815/1125611167843352617/tampermonkey.png'
    customDesktopSettingsImage.classList.add('desktop-element-img')
    const customDesktopSettingsTitle = document.createElement('div')
    customDesktopSettingsTitle.classList.add('desktop-element-title')
    customDesktopSettingsTitle.innerText = 'uns0urce'
    customDesktopSettings.appendChild(customDesktopSettingsImage)
    customDesktopSettings.appendChild(customDesktopSettingsTitle)
    desktopWrapper.appendChild(customDesktopSettings)
    const windowWrapper = document.getElementsByClassName('window-wrapper')[0]
    const customWindow = document.createElement('div')
    customWindow.classList.add('window')
    customWindow.id = 'window-autotype'
    customWindow.style.top = '234px'
    customWindow.style.left = '291px'
    customWindow.style.borderColor = 'rgb(77, 100, 122)'
    customWindow.style.zIndex = '10'
    customWindow.style.display = 'none'
    const customWindowTitle = document.createElement('div')
    customWindowTitle.classList.add('window-title')
    customWindowTitle.style.backgroundColor = 'rgb(77, 100, 122)'
    const customWindowTitleImage = document.createElement('img')
    customWindowTitleImage.src = 'https://cdn.discordapp.com/attachments/1121687891404406815/1125611167843352617/tampermonkey.png'
    customWindowTitleImage.classList.add('icon-small')
    customWindowTitleImage.classList.add('window-title-icon')
    const customWindowClose = document.createElement('span')
    customWindowClose.classList.add('window-close-style')
    customWindowClose.classList.add('window-close')
    const customWindowCloseImage = document.createElement('img')
    customWindowCloseImage.src = '../client/img/icon-close.png'
    customWindowCloseImage.classList.add('window-close-img')
    customWindowClose.appendChild(customWindowCloseImage)
    customWindowTitle.appendChild(customWindowTitleImage)
    customWindowTitle.appendChild(customWindowClose)
    const customWindowContent = document.createElement('div')
    customWindowContent.classList.add('window-content')
    customWindowContent.style.width = '360px'
    customWindowContent.style.height = '160px'
    customWindow.appendChild(customWindowTitle)
    customWindow.appendChild(customWindowContent)
    windowWrapper.appendChild(customWindow)

    // Open window from desktop
    customDesktopSettings.addEventListener('click', function () {
        if (customWindow.style.display === 'none') {
            customWindow.style.display = ''
        } else {
            customWindow.style.display = 'none'
        }
    })

    // Close window
    customWindowClose.addEventListener('click', function () {
        customWindow.style.display = 'none'
    })

    // Drag window
    let isDragging = false
    let dragX = 0
    let dragY = 0
    customWindowTitle.addEventListener('mousedown', function (event) {
        isDragging = true
        dragX = event.clientX
        dragY = event.clientY
    })

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            const deltaX = event.clientX - dragX
            const deltaY = event.clientY - dragY
            const currentX = parseInt(customWindow.style.left)
            const currentY = parseInt(customWindow.style.top)
            customWindow.style.left = `${currentX + deltaX}px`
            customWindow.style.top = `${currentY + deltaY}px`
            dragX = event.clientX
            dragY = event.clientY
        }
    })

    document.addEventListener('mouseup', function () {
        isDragging = false
    })

    // Settings
    // Autotype toggle button
    const enableButton = document.createElement('div')
    enableButton.classList.add('button')
    enableButton.id = 'settings-button-autotype'
    enableButton.innerText = 'AutoType: On'
    customWindowContent.appendChild(enableButton)

    enableButton.addEventListener('click', function () {
        if (enableButton.innerText === 'AutoType: On') {
            enableButton.innerText = 'AutoType: Off'
            autoTypeEnabled = false
        } else {
            enableButton.innerText = 'AutoType: On'
            autoTypeEnabled = true
        }
    })

    // Line break
    const br = document.createElement('br')
    const br2 = document.createElement('br')
    customWindowContent.appendChild(br)
    customWindowContent.appendChild(br2)

    // Speed input in MS
    const speedLabel = document.createElement('label')
    speedLabel.innerText = 'Speed (MS)'
    customWindowContent.appendChild(speedLabel)

    const speedInput = document.createElement('input')
    speedInput.type = 'number'
    speedInput.min = '1'
    speedInput.max = '1000'
    speedInput.value = '350'
    speedInput.style.width = '50px'
    speedInput.style.marginLeft = '10px'
    speedInput.style.marginRight = '10px'
    customWindowContent.appendChild(speedInput)

    // Line break
    const br3 = document.createElement('br')
    const br4 = document.createElement('br')
    customWindowContent.appendChild(br3)
    customWindowContent.appendChild(br4)

    // Auto choose target
    const autoChooseTarget = document.createElement('div')
    autoChooseTarget.classList.add('button')
    autoChooseTarget.id = 'settings-button-autotype'
    autoChooseTarget.innerText = 'Auto Choose Target: Off'
    customWindowContent.appendChild(autoChooseTarget)

    autoChooseTarget.addEventListener('click', function () {
        if (autoChooseTarget.innerText === 'Auto Choose Target: On') {
            autoChooseTarget.innerText = 'Auto Choose Target: Off'
            autoChooseTargetEnabled = false
        } else {
            autoChooseTarget.innerText = 'Auto Choose Target: On'
            autoChooseTargetEnabled = true

            const toolTypeImage = document.getElementsByClassName('tool-type-img')[0]
            const loadEvent = new Event('load')
            toolTypeImage.dispatchEvent(loadEvent)
        }
    })


    const targetMessageInput = document.getElementById('targetmessage-input')
    targetMessageInput.value = 'smacked by uns0urce autotype'

    // --- //

    let autoTypeEnabled = true
    let autoChooseTargetEnabled = false
    async function autoType() {
        const toolTypeForm = document.getElementById('tool-type-form')
        const toolTypeInput = document.getElementById('tool-type-word')
        const toolTypeImage = document.getElementsByClassName('tool-type-img')[0]

        const knownWordsFetch = await fetch('https://raw.githubusercontent.com/Lozarth/outs0urce/main/words.json')
        const knownWords = await knownWordsFetch.json()

        toolTypeImage.addEventListener('load', function () {
            if (!autoTypeEnabled) return

            if (toolTypeImage.src === 'https://s0urce.io/client/img/words/template.png' && autoChooseTargetEnabled) {
                const playerList = document.getElementById('player-list')
                const playerListRows = playerList.getElementsByTagName('tr')

                const randomPlayer = playerListRows[Math.floor(Math.random() * playerListRows.length)]
                randomPlayer.click()

                const hackButton = document.getElementById('window-other-button')
                hackButton.click()

                const portButton1 = document.getElementById('window-other-port1')
                const portButton2 = document.getElementById('window-other-port2')
                const portButton3 = document.getElementById('window-other-port3')

                const randomPort = Math.floor(Math.random() * 3)

                if (randomPort === 0) {
                    portButton1.click()
                } else if (randomPort === 1) {
                    portButton2.click()
                } else {
                    portButton3.click()
                }
            }

            const wordObject = knownWords.find(knownWord => knownWord.image === toolTypeImage.src)

            if (wordObject) {
                toolTypeInput.value = wordObject.word

                let delay = parseInt(speedInput.value)
                let randomVariation = Math.floor(Math.random() * 100)

                delay += randomVariation

                setTimeout(function () {
                    toolTypeForm.requestSubmit()
                }, delay)
            }
        })

        // toolTypeInput.addEventListener('keydown', function (event) {
        //     if (event.key === 'Enter') {
        //         const enteredWord = toolTypeInput.value
        //         const wordImage = toolTypeImage.src
        //         const wordObject = knownWords.find(knownWord => knownWord.word === enteredWord)

        //         if (!wordObject || wordObject.image !== wordImage) {
        //             // Push to custom known words local storage

        //         }

        //     }
        // })
    }

    autoType()
})()
