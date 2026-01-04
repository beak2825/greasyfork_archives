// ==UserScript==
// @name         Geoguessr Dual Compass
// @description  Enable both compasses in Geoguessr games.
// @version      0.1.1
// @author       macca#8949
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.svgrepo.com/show/60835/compass.svg
// @namespace https://greasyfork.org/users/865125
// @downloadURL https://update.greasyfork.org/scripts/457529/Geoguessr%20Dual%20Compass.user.js
// @updateURL https://update.greasyfork.org/scripts/457529/Geoguessr%20Dual%20Compass.meta.js
// ==/UserScript==


// --------- DON'T MODIFY ANYTHING BELOW THIS LINE -------- //

// --------- Credits to miraclewhips and extennsr for this script injection code https://gitlab.com/nonreviad/extenssr/-/blob/main/src/injected_scripts/maps_api_injecter.ts --------- //

let MWStreetViewInstance;

function overrideOnLoad(googleScript, observer, overrider) {
	const oldOnload = googleScript.onload
	googleScript.onload = (event) => {
			const google = window.google
			if (google) {
					observer.disconnect()
					overrider(google)
			}
			if (oldOnload) {
					oldOnload.call(googleScript, event)
			}
	}
}

function grabGoogleScript(mutations) {
	for (const mutation of mutations) {
			for (const newNode of mutation.addedNodes) {
					const asScript = newNode
					if (asScript && asScript.src && asScript.src.startsWith('https://maps.googleapis.com/')) {
							return asScript
					}
			}
	}
	return null
}

function injecter(overrider) {
	if (document.documentElement)
	{
			injecterCallback(overrider);
	}
}

function injecterCallback(overrider)
{
	new MutationObserver((mutations, observer) => {
			const googleScript = grabGoogleScript(mutations)
			if (googleScript) {
					overrideOnLoad(googleScript, observer, overrider)
			}
	}).observe(document.documentElement, { childList: true, subtree: true })
}

document.addEventListener('DOMContentLoaded', (event) => {
	injecter(() => {
		google.maps.StreetViewPanorama = class extends google.maps.StreetViewPanorama {
			constructor(...args) {
					super(...args);
					MWStreetViewInstance = this;
			}
		}
	});
});

// --------- //



localStorage.setItem('__GEOGUESSR_CLASSIC_COMPASS__', false);

let observingCompass = false;

const addCompassToPage = () => {
    if (!document.querySelector('.compass') && document.querySelector('.styles_columnOne__rw8hK')) {
        document.querySelector('.styles_columnOne__rw8hK').insertAdjacentHTML('afterbegin', `<div class="styles_control__zEkd0"><button class="compass" title="Compass" data-qa="compass"><div class="compass__circle"></div><img data-qa="compass" class="compass__indicator" src="/_next/static/images/compass-4be6c2fc7875215e0ece8a0f358585aa.svg" alt="Compass" draggable="false"></button></div>`);
    }
}

let compassObserver = new MutationObserver((mutations) => {
    if (MWStreetViewInstance) {
        // Add compass to page if not already there
        addCompassToPage();

        // Update direction
        let compass = document.querySelector('.compass__indicator');
        if (compass) {
            compass.style.transform = `rotate(-${MWStreetViewInstance.getPov().heading}deg)`;
        }
    }
});

const triggerCompassObserve = () => {
    compassObserver.observe(document.querySelector('.panorama-compass_latitude___jexD'), { attributes : true, attributeFilter : ['style'] });
    observingCompass = true;

    // Add compass to page
    addCompassToPage();
}

let observer = new MutationObserver((mutations) => {
    if (document.querySelector('.styles_columnOne__rw8hK')) {
        if (!observingCompass) {
            triggerCompassObserve();
        }

        // Disable menu option
        let menuItems = document.querySelectorAll('.game-options_option__eCz9o');
        if (menuItems[1] && menuItems[1].children[1].innerText == 'CLASSIC COMPASS OFF') {
            menuItems[1].children[1].innerText = 'DUAL COMPASS ENABLED';
            menuItems[1].children[2].remove();
            menuItems[1].insertAdjacentHTML('beforeend', '<small>Disable the script to modify this option</small>');
        }
    } else {
        observingCompass = false;
    }
});

observer.observe(document.body, {
  characterDataOldValue: true,
  subtree: true,
  childList: true,
  characterData: true
});
