// ==UserScript==
// @name         Cyclist Ring
// @namespace    microbes.torn.ring
// @version      0.3.1
// @description  Making money by pickpocketing cyclists!
// @author       Microbes
// @match        https://www.torn.com/page.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487359/Cyclist%20Ring.user.js
// @updateURL https://update.greasyfork.org/scripts/487359/Cyclist%20Ring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElementToExist('.pickpocketing-root').then(() => {
        $('.pickpocketing-root').append(`<div id="cyclist-div"><a id="cyclist-enable-btn" class="torn-btn btn-big">Enable Cyclist Alert</a><br/><br/></div>`);

        $('#cyclist-enable-btn').click(() => {
            $('#cyclist-div').fadeOut();
            enabled()

            // Test sound when enabled
            var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
            audio.play();
        });
    });

    function enabled() {
        interceptFetch("torn.com", "/page.php?sid=crimesData", (response, url) => {
            const crimes = response.DB.crimesByType;

            if (isCyclistAvailable(crimes)) {
                // Play sound
                var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
                audio.play();

                /* Highlight all cyclist */
                $('.CircularProgressbar').nextAll().each(function() {
                    if ($(this).css('background-position-y') == '0px') {
                        $(this).parent().parent().parent().parent().css("background-color", "#00ff00");
                    }
                });
            }
        });
    }

    function isCyclistAvailable(crimes) {
        for (let i = 0; i < crimes.length; i++) {
            const crime = crimes[i];
            if (crime.title === "Cyclist" && crime.available === true) {
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