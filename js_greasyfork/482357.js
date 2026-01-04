// ==UserScript==
// @name        Show/Click favorite host links - wawacity
// @namespace   Violentmonkey Scripts
// @license		MIT
// @include      /^https:\/\/www\.wawacity\.[^\/]+\/\?p=serie&id=.*/
// @grant       none
// @version     1.2a
// @author      ConnorMcLeod
// @description Facilite l'ajoute d'épisodes de séries dans JDownloader (Lire la description détaillée)
// @downloadURL https://update.greasyfork.org/scripts/482357/ShowClick%20favorite%20host%20links%20-%20wawacity.user.js
// @updateURL https://update.greasyfork.org/scripts/482357/ShowClick%20favorite%20host%20links%20-%20wawacity.meta.js
// ==/UserScript==

favoriteHost = '1fichier';
// favoriteHost = 'Fikper';
// favoriteHost = 'Rapidgator';
// favoriteHost = 'Turbobit';
// favoriteHost = 'Nitroflare';

copyLinksInterval = 0;
clickedButtons = [];

if (document.location.search.startsWith('?p=serie&id=')) {
    const selector = document.querySelector("#DDLLinks");
    const links = selector.getElementsByClassName('link-row');

    for (let elt of links) {
        if (elt.textContent.includes(favoriteHost)) {
            elt.style.display = '';
        }
    }

    enableClick();

    if (!copyLinksInterval) {
        copyLinksInterval = setInterval(function() {
            const button = Array.from(document.getElementsByClassName('btn-copy-clipboard')).filter(e => !e.disabled).at(0);
            if (button) {
                button.focus();
                navigator.clipboard.writeText(button.getAttribute('data-href'))
                    .then(() => {
                        button.remove();
                    // })
                    // .catch((error) => {
                        // alert(error);
                    });
            }
        }, 500);
    }
} else if (copyLinksInterval) {
    clearInterval(copyLinksInterval);
    copyLinksInterval = 0;
    clickedButtons = [];
}

function enableClick() {
    const title = document.title.slice(0, -(" gratuitement sur Wawacity").length);
    const block = Array.from(document.getElementsByClassName("fa-play-circle")).map(x => x.parentNode).filter(e => e.innerText.includes(title))[0];

    const button = document.createElement("button");
    button.type = 'button';
    button.setAttribute('style', 'background-color: rgb(37 99 235);color: white;border: 0px;margin-left: 6px;border-radius: 6px;');
    button.append(`Récupérer toutes les url ${favoriteHost}`);

    const dlAll = () => {
        if (confirm(`Cliquer sur tous les liens ${favoriteHost} ?`)) {
            buttons = document.getElementsByTagName("button");
            correctButtons = Array.from(buttons).reverse().filter(e => [e.textContent, e.innerText].includes(`Récupérer l'URL : ${favoriteHost}`));
            setTimeout(function clicButton() {
                for (let i = 0; i < correctButtons.length; i++) {
                    const btn = correctButtons[i];
                    if (!clickedButtons.includes(btn)) {
                        clickedButtons.push(btn);
                        btn.click();
                        if (i < correctButtons.length - 1) {
                            setTimeout(clicButton, 1100);
                        }
                        break;
                    }
                }
            }, 1100);
            button.remove();
        }
    };

    button.onclick = dlAll;
    block.appendChild(button);
}