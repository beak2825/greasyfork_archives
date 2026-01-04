// ==UserScript==
// @name         livechesscloud Exportable PGN
// @namespace    https://www.twitch.tv/simplevar
// @version      2025-02-28
// @description  Exportable PGN
// @author       SimpleVar
// @match        https://view.livechesscloud.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechesscloud.com
// @grant        none
// @run-at       document-end
// @license      Fuckall
// @downloadURL https://update.greasyfork.org/scripts/518648/livechesscloud%20Exportable%20PGN.user.js
// @updateURL https://update.greasyfork.org/scripts/518648/livechesscloud%20Exportable%20PGN.meta.js
// ==/UserScript==

(()=>{
    const text = document.createElement('textarea')
    text.setAttribute('readonly', 1)
    text.innerText = '...'
    text.style.minHeight = '10rem'

    const moves = document.querySelector('app-gv-movelist > app-gv-scroll')
    moves.parentElement.append(text)

    new MutationObserver((mutationList, observer) => {
        text.innerText = moves.innerText
            .replaceAll('♞', 'N')
            .replaceAll('♘', 'N')
            .replaceAll('♝', 'B')
            .replaceAll('♗', 'B')
            .replaceAll('♜', 'R')
            .replaceAll('♖', 'R')
            .replaceAll('♛', 'Q')
            .replaceAll('♕', 'Q')
            .replaceAll('♚', 'K')
            .replaceAll('♔', 'K')
            .replaceAll('\n', ' ')
    }).observe(moves, { childList: true });
})()