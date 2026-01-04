// ==UserScript==
// @name        allocine.fr / marmiton.org / jeuxvideo.com nonsense remover
// @namespace   Violentmonkey Scripts
// @match       *://www.allocine.fr/*
// @match       *://www.marmiton.org/*
// @match       *://www.jeuxvideo.com/*
// @match       *://www.750g.com/*
// @match       *://*.doctissimo.fr/*
// @match       *://*.aufeminin.com/*
// @match       *://www.lesnumeriques.com/*
// @match       *://*.cnetfrance.fr/*
// @match       *://www.purepeople.com/*
// @match       *://*.millenium.gg/*
// @match       *://www.jeuxactu.com/*
// @match       *://www.puretrend.com/*
// @match       *://www.terrafemina.com/*
// @match       *://www.purebreak.com/*
// @match       *://www.ozap.com/*
// @match       *://*.over-blog.com/*
// @match       *://*.canalblog.com/*
// @match       *://*.eklablog.com/*
// @match       *://www.leblogtvnews.com/*
// @match       *://*.actu.fr/*
// @grant       none
// @license MIT
// @version     1.05
// @author      GourouLubrik 
// @description Supprime le pop-in et rétablit la barre de scroll pour ces sites qui voudraient seulement vous laisser le choix entre payer 1/2 euros ou manger tout plein de vilains cookies de tracking
// @downloadURL https://update.greasyfork.org/scripts/425627/allocinefr%20%20marmitonorg%20%20jeuxvideocom%20nonsense%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/425627/allocinefr%20%20marmitonorg%20%20jeuxvideocom%20nonsense%20remover.meta.js
// ==/UserScript==

function mutationObserverCallback(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            const target = mutation.target;
            if(target.classList.contains('didomi-popup-open')) //burnthewitch!
            {
              target.classList.remove('no-ads', 'didomi-popup-open');
            }
            target.style.setProperty("overflow", "visible", "important");
            const didomiHost = document.getElementById('didomi-host');
            if(didomiHost) {
              didomiHost.remove();
            }
        }
    })
}
const mutationObserver = new MutationObserver(mutationObserverCallback);
mutationObserver.observe(document.querySelector('html > body'), { attributes: true })

