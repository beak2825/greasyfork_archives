// ==UserScript==
// @name         Discord Server Scrollbar
// @license GNU GPLv3 
// @namespace    https://sea-salt-child.tumblr.com/
// ^ Contact me there in case this implodes or something
// @version      0.2
// @description  Discord scrollbar, it is jank but it works.
// @author       Nihil
// @match        https://discord.com/*
// @icon         https://i.imgur.com/wJ7cfJC.png
// @grant        none
// @name:pt-BR   Scrollbar para Discord
// @description:pt-BR   Scrollbar meio eh, mas funciona pra quem não tem mouse.
// @downloadURL https://update.greasyfork.org/scripts/448084/Discord%20Server%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/448084/Discord%20Server%20Scrollbar.meta.js
// ==/UserScript==

function all(){
    var barra = document.getElementsByClassName("scroller-3X7KbA none-2-_0dP scrollerBase-_bVAAt")[0];
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            console.log('mutation.type = ' + mutation.type);
            if (mutation.type === 'attributes') {
                document.getElementsByClassName("scroller-3X7KbA none-2-_0dP scrollerBase-_bVAAt")[0].setAttribute('class', 'scroller-1ox3I2 thin-31rlnD scrollerBase-_bVAAt fade-1R6FHN');
            }
        });
    });

        document.getElementsByClassName("scroller-3X7KbA none-2-_0dP scrollerBase-_bVAAt")[0].setAttribute('class', 'scroller-1ox3I2 thin-31rlnD scrollerBase-_bVAAt fade-1R6FHN');

        observer.observe(barra, {
            attributes: true

        });
}
setTimeout (all, 2000);