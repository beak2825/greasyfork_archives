// ==UserScript==
// @name         Discord Download Block
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @author       Mrgaton , tnfAngel
// @match        *://discord.com/*
// @match        *://ptb.discord.com/*
// @match        *://canary.discord.com/*
// @description  Guapo Hermosisimo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425801/Discord%20Download%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/425801/Discord%20Download%20Block.meta.js
// ==/UserScript==
document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.hideMFASMSNotice= `true`
document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.hideNag = `true`
document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.BrowserHandoffStore= `true`
document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.collapsedCategoryMigration= `true`
document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.shouldShowChangeLog = `false`
    
let clases = ["notice-3bPHh-", "colorDefault-22HBa0"]
let sitios = ["discord.com"]

function comprobarClase(nombre) {
    if (document.getElementsByClassName(nombre).length > 0) {
        return true
    } else {
        return false
    }
}
function eliminarPorClase(nombre) {
    const elementos = document.getElementsByClassName(nombre)
    while (elementos.length > 0) {
        elementos[0].parentNode.removeChild(elementos[0])
    }
}
function comprobarClases() {
    let incluye = false
    if (sitios) {
        sitios.forEach(sitio => {
            if (window.location.host.includes(sitio)){
                incluye = true
            }
        })
    }
    if (incluye) {
        clases.forEach(clase => {
            if (comprobarClase(clase)) {
                eliminarPorClase(clase)
                console.log(`La clase '${clase}' fue eliminada del DOM.`)
            }
        })
    }
}

Load()
comprobarClases()

setInterval(() => {
    comprobarClases() 
}, 5000)