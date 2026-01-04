// ==UserScript==
// @name        viedemerde.fr and other nonsense remover
// @namespace   Violentmonkey Scripts
// @match       *://*.viedemerde.fr/*
// @match       *://*.minutefacile.com/*
// @match       *://*.betaseries.com/*
// @grant       none
// @version     1.0.2
// @author      ChillPC
// @description Supprime le pop-in et rétablit la barre de scroll pour viedemerde.fr et autre (Sur le model de GourouLubrik)
// @downloadURL https://update.greasyfork.org/scripts/427577/viedemerdefr%20and%20other%20nonsense%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/427577/viedemerdefr%20and%20other%20nonsense%20remover.meta.js
// ==/UserScript==

function mutationObserverCallback(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        console.log(mutation);
        if (mutation.attributeName === 'class') {
            const target = mutation.target;
            if(target.classList.contains('sd-cmp')) //burnthewitch!
            {
                target.classList.remove('sd-cmp-7Eaxt');
            }
            target.style.setProperty("overflow", "visible", "important");
            const popup = document.getElementById('sd-cmp');
            if(popup) {
                popup.remove();
            }
        }
    })
}
const mutationObserver = new MutationObserver(mutationObserverCallback);
mutationObserver.observe(document.querySelector('html'), { attributes: true })
