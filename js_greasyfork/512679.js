// ==UserScript==
// @name         Postal Worker Ring
// @namespace    tenren.torn.ring
// @version      0.2.1
// @description  Alert for pickpocketing Postal workers
// @author       Tenren
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512679/Postal%20Worker%20Ring.user.js
// @updateURL https://update.greasyfork.org/scripts/512679/Postal%20Worker%20Ring.meta.js
// ==/UserScript==

/*
 * Adapted from Cyclist Ring by Microbes: https://greasyfork.org/en/scripts/487359-cyclist-ring
 */

(function() {
    'use strict';

    waitForElementToExist('.pickpocketing-root').then(() => {
        $('.pickpocketing-root').append(`<div id="postalworker-div"><a id="postal-enable-btn" class="torn-btn btn-big">Enable Postal Worker Alert</a><br/><br/></div>`);

        $('#postal-enable-btn').click(() => {
            $('#postalworker-div').fadeOut();
            enabled()

            // Test sound when enabled
            var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
            audio.play();
        });
    });

    function enabled() {
        interceptFetch("torn.com", "/loader.php?sid=crimesData", (response, url) => {
            const crimes = response.DB.crimesByType;

            if (isPostalWorkerAvailable(crimes)) {
                // Play sound
                var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
                audio.play();

                /* Highlight all Postal Workers */
                $('[class^="titleAndProps"] div').each(function() {
                    if ($(this)[0].textContent.includes("Postal worker")) {
                        $(this).parent().parent().parent().css("background-color", "#00ff00");
                    }
                });
            }
        });
    }

    function isPostalWorkerAvailable(crimes) {
        for (let i = 0; i < crimes.length; i++) {
            const crime = crimes[i];
            if (crime.title === "Postal worker" && crime.available === true) {
                return true;
            }
        }
        return false;
    }
})();

function interceptFetch(url, q, callback) {
	const originalFetch = window.fetch;

	window.fetch = function() {
		return new Promise((resolve, reject) => {
			return originalFetch.apply(this, arguments).then(function(data) {
					let dataurl = data.url.toString();
					if (dataurl.includes(url) && dataurl.includes(q)) {
						const clone = data.clone();
						if (clone) {
							clone.json().then((response) => callback(response, data.url))
								.catch((error) => {
									console.log("[LoadoutShare][InterceptFetch] Error with clone.json(). Most likely not JSON data.", error)
								})
						}
					}

					resolve(data);
				})
				.catch((error) => {
					console.log("[LoadoutShare][InterceptFetch] Error with fetch.", error)
				})
		});
	};
}

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}