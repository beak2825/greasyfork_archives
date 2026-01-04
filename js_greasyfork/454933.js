// ==UserScript==
// @name        VSCode - Insiders Install Button
// @namespace   Violentmonkey Scripts
// @match       https://marketplace.visualstudio.com/items
// @grant       none
// @version     1.0
// @author      MohamedBechirMejri
// @description Adds an install in vscode-insiders button on vscode marketplace - 11/16/2022, 12:19:37 PM
// @downloadURL https://update.greasyfork.org/scripts/454933/VSCode%20-%20Insiders%20Install%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/454933/VSCode%20-%20Insiders%20Install%20Button.meta.js
// ==/UserScript==

const extensionName = document.getElementById('FQN').value
const newInstallButton = document.createElement('a')
const buttonsContainer = document.querySelector('.ux-item-action')

newInstallButton.className = 'ms-Button-label ms-Button ux-button install ms-Button--default root-39'
newInstallButton.innerText = 'Install in VSCode - Insiders'
newInstallButton.href = 'vscode-insiders:extension/' + extensionName

newInstallButton.style.backgroundColor = '#0076b8'
newInstallButton.style.fontWeight = 'bold'
newInstallButton.style.display = 'flex'
newInstallButton.style.width = 'max-content'
newInstallButton.style.alignItems = 'center'
newInstallButton.style.marginTop = '0.5rem'

newInstallButton.addEventListener('mouseenter', e => {
  e.target.style.backgroundColor = '#004070'
})

newInstallButton.addEventListener('mouseleave', e => {
  e.target.style.backgroundColor = '#0076b8'
})


buttonsContainer.append(newInstallButton)

