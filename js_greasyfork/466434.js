// ==UserScript==
// @name         Geoguessr avatar ad remover
// @description  Removes the new Geoguessr avatar ad
// @version      1.0.0
// @license      MIT
// @author       joniber#5011
// @namespace https://greasyfork.org/users/1072330
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/466434/Geoguessr%20avatar%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/466434/Geoguessr%20avatar%20ad%20remover.meta.js
// ==/UserScript==


//=====================================================================================\\
//  don't edit anything after this point unless you know what you're doing             \\
//=====================================================================================\\

const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false,
};

const ERROR_MESSAGE = (wrong) => '${wrong}';

function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`));
}


function onMutationsStandard(mutations, observer) {

   let button = document.querySelector('.deal-promo-button_root__nUfyK')
   if(button){
    let div = button.parentNode
    if(div){
     div.remove()
     button.remove()
    }
   }


}

const observer = new MutationObserver(onMutationsStandard);

observer.observe(document.body, OBSERVER_CONFIG);
