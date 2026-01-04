// ==UserScript==
// @name         GGn Corner Button
// @version      2
// @description  Add buttons to group content's top corners. In the main script, @grant GM_getValue to be customise position in settings. @grant GM_registerMenuCommand to register a Run command if position is set to none
// @author       ingts
// @match        https://gazellegames.net/
// ==/UserScript==
/**
 * @typedef {('none' | 'left' | 'left-vertical' | 'right' | 'right-vertical')} Position
 */

/**
 * @type HTMLDivElement
 */
const groupContentDiv = document.getElementById('content')

/**
 * @param {Position} position
 * @param {string} text
 * @param {(e: MouseEvent) => void} onclick
 */
function createCornerButton(position, text, onclick) {
    if (!groupContentDiv) return

    if (typeof GM_getValue !== "undefined") {
        if (typeof GM_getValue('corner_button') === 'undefined')
            GM_setValue('corner_button', position)

        position = GM_getValue('corner_button')
    }

    if (typeof GM_registerMenuCommand !== "undefined" && position === 'none') {
        GM_registerMenuCommand('Run', onclick)
        return
    }

    const container = createContainer(position)

    const button = document.createElement('button')
    button.textContent = text
    button.type = 'button'
    if (position.includes('vertical')) {
        button.style.writingMode = 'vertical-lr'
        button.style.height = 'unset'

        if (position.includes('left')) {
            button.style.rotate = 'z 180deg'
        }
    }
    button.style.padding = '2px'
    button.onclick = e => onclick(e)
    container.append(button)

    let leftPos = 0
    let topPos = 0
    switch (position) {
        case 'left':
            leftPos = groupContentDiv.offsetLeft + container.offsetWidth - container.scrollWidth
            topPos = groupContentDiv.offsetTop - container.offsetHeight
            break
        case 'left-vertical':
            leftPos = groupContentDiv.offsetLeft - container.offsetWidth
            topPos = groupContentDiv.offsetTop
            break
        case 'right':
            leftPos = groupContentDiv.offsetLeft + groupContentDiv.offsetWidth - container.scrollWidth
            topPos = groupContentDiv.offsetTop - container.offsetHeight
            break
        case 'right-vertical':
            leftPos = groupContentDiv.offsetLeft + groupContentDiv.offsetWidth
            topPos = groupContentDiv.offsetTop
    }

    requestAnimationFrame(() => {
        container.style.left = leftPos + 'px'
        container.style.top = topPos + 'px'
    })
}

/**
 * @private
 * @param {Position} position
 */
function createContainer(position) {
    const elementId = `${position}-corner-container`
    let container = document.getElementById(elementId)
    if (container) return container

    container = document.createElement('div')
    container.id = elementId
    container.style.position = 'absolute'
    container.style.display = 'flex'
    if (position.includes('vertical')) {
        container.style.flexDirection = 'column'
    }
    container.style.gap = '2px'

    document.body.append(container)
    return container
}
