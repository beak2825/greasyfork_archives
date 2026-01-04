// ==UserScript==
// @name         DisneyPlus Skip Intro & Next Episode
// @namespace    https://worldpc.it
// @author       WorldPC
// @description  Auto-skip intro on supported Disney series & Next Episode
// @version      0.0.2
// @include      https://www.disneyplus.com*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/438428/DisneyPlus%20Skip%20Intro%20%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/438428/DisneyPlus%20Skip%20Intro%20%20Next%20Episode.meta.js
// ==/UserScript==


(function() {
    'use strict';
     setInterval(() => {
        
		//Salta INTRO
		const skip = document.querySelectorAll("button.skip__button.body-copy")[0];
		
		//Salta episodio successivo
		const episodiosuccessivo = document.querySelectorAll("[data-testid='up-next-play-button']")[0];
        if ( skip ){
            skip.click();
        }
        if ( episodiosuccessivo ){
            episodiosuccessivo.click();
        }
    }, 1500);
})();