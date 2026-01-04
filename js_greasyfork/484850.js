// ==UserScript==
// @name         modelos jusbrasil
// @namespace    http://tampermonkey.net/
// @version      2024-01-11
// @description  Remove as limitações para a leitura de modelos.E remove a limitação de cópia do texto
// @author       Eu
// @match        https://www.jusbrasil.com.br/*
// @icon         https://static.jusbr.com/topbar/images/jusbrasil-logo@2x.png
// @license MIT
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484850/modelos%20jusbrasil.user.js
// @updateURL https://update.greasyfork.org/scripts/484850/modelos%20jusbrasil.meta.js
// ==/UserScript==

(function() {
    quandoExistir('.StockPhotoModal-body--paywall', (elem) => elem.remove())

    quandoExistir('div.ViewLockWrapper', (elem) => {
        let clone = elem.cloneNode(true)
        clone.style.maxHeight = 'initial'
        clone.classList.remove('ViewLockWrapper')
        elem.parentElement.append(clone)
        elem.remove()
    })
})();

function quandoExistir(querySelector, callback, tentativas = 5){
    let interacao = 0
    const interval = setInterval(() => {
        let elem = document.querySelector(querySelector)
        if(elem){
            callback(elem)
            clearInterval(interval)
        }
        if(interacao++ >= tentativas){
            clearInterval(interval)
        }

    }, 1000)
}