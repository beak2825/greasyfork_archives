// ==UserScript==
// @name         Postal Worker Alerts
// @namespace    none
// @version      0.3
// @description  Making money by pickpocketing Postal Workers!
// @author       Gonave
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498060/Postal%20Worker%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/498060/Postal%20Worker%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElementToExist('.pickpocketing-root').then(() => {
        $('.pickpocketing-root').append(`<div id="postalworker-div"><a id="postalworker-enable-btn" class="torn-btn btn-big">Enable Postal Worker Alert</a><br/><br/></div>`);

        $('#postalworker-enable-btn').click(() => {
            $('#postalworker-div').fadeOut();
            enabled();

            var audio = new Audio('https://audio.jukehost.co.uk/vtfQzQc1FVLVQoCUDfSmFQlo5ophVwTq');
            audio.play();
        });
    });

    function enabled() {
        interceptFetch("torn.com", "/loader.php?sid=crimesData", (response, url) => {
            const crimes = response.DB.crimesByType;

            if (isPostalWorkerAvailable(crimes)) {
                var audio = new Audio('https://audio.jukehost.co.uk/vtfQzQc1FVLVQoCUDfSmFQlo5ophVwTq');
                audio.play();
                    }
            }
        );
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
