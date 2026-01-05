// ==UserScript==
// @name        Show Artist Pixiv ID
// @namespace   https://greasyfork.org/en/users/37676
// @description Show Pixiv ID of the artist under nickname in the illustration page
// @match       *://*.pixiv.net/*/artworks/*
// @run-at      document-end
// @version     1.0.9
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/18735/Show%20Artist%20Pixiv%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/18735/Show%20Artist%20Pixiv%20ID.meta.js
// ==/UserScript==

let pageObserver = null;
const nextData = document.querySelector('#__NEXT_DATA__');

if (nextData && !pageObserver) {
    try {
        const nextJson = JSON.parse(nextData.text);
        const illustID = nextJson?.query?.id;

        if (illustID) {
			fetch('https://www.pixiv.net/ajax/illust/' + illustID)
				.then(function(response) { return response.json(); })
				.then(function(json) {
					const userID = json?.body?.userId;
					const userName = json?.body?.userName;
					const userAccount = json?.body?.userAccount;
					
					if (userID && userName && userAccount) {
						if (!pageObserver) {
							pageObserver = new MutationObserver(function(mutations) {
								const profileElement = document.querySelectorAll('a[href*="/users/'+userID+'"]');

								if (profileElement.length > 0) {
									for (let i=0; i < profileElement.length; i++) {
										const imageElement = profileElement[i].querySelectorAll('div[role*="img"]');

										if (imageElement.length > 0) {
											for (let j=0; j < imageElement.length; j++) {
												const parentElement = imageElement[j].parentElement;

												if (parentElement) {
													const nextElement = parentElement.nextElementSibling;

													if (nextElement) {
														if (nextElement.innerHTML.indexOf(userAccount) < 0) {
															if (parentElement.innerHTML.indexOf(userName) < 0) {
																nextElement.innerHTML += '<div>'+userName+'</div>';
															}
															
															nextElement.innerHTML += '<div>'+userAccount+'</div>';
														}
													}
												}
											}
										}
									}
								}
							});

							pageObserver.observe(document.querySelector('#__next'), {
								childList: true,
								subtree: true
							});
						}
					}
            });
        }

    } catch(e) {

    }
}
