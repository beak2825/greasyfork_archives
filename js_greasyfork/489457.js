// ==UserScript==
// @name         SauceNAO 跳轉e-hentai
// @namespace    https://greasyfork.org/scripts/489457
// @version      1.0
// @description  SauceNAO 跳轉e-hentai按鈕
// @author       fmnijk
// @match        https://saucenao.com/*
// @icon         https://www.google.com/s2/favicons?domain=saucenao.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489457/SauceNAO%20%E8%B7%B3%E8%BD%89e-hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/489457/SauceNAO%20%E8%B7%B3%E8%BD%89e-hentai.meta.js
// ==/UserScript==

(window.onload = function() {
	'use strict'

    if (window.location.href === 'https://saucenao.com/'){
        return false;
    }

	const $ = s => document.querySelector(s);

	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true });
	}

    /*增加跳轉按鈕*/
	function changeCoin() {

        const elements1 = document.querySelectorAll('#middle > div > table > tbody > tr > td.resulttablecontent > div.resultcontent > div.resulttitle > strong');
        const elements2 = document.querySelectorAll('#middle > div > table > tbody > tr > td.resulttablecontent > div.resultcontent > div.resultcontentcolumn > small');

        const elements = [...elements1, ...elements2];

        // Remove existing elements with class "goto-e-hentai"
        const existingLinks = document.querySelectorAll('.goto-e-hentai');
        existingLinks.forEach(link => link.remove());

        // Iterate through each element
        elements.forEach((element, index) => {
            // Get the text content
            const textContent = element.textContent.trim();

            // Create a hyperlink element
            const link = document.createElement('a');

            // Add a class to the link
            link.classList.add('goto-e-hentai');

            // Set the href attribute with the desired URL
            link.href = `https://e-hentai.org/?f_search=${encodeURIComponent(textContent)}`;

            // Create an image element
            const image = document.createElement('img');

            // Set the src attribute for the image
            image.src = 'https://www.google.com/s2/favicons?domain=e-hentai.org';

            // Set background color of the image to white
            image.style.backgroundColor = 'white';

            // Set the alt attribute for accessibility (optional)
            image.alt = 'Link';

            // Append the image to the link
            link.appendChild(image);

            // Insert the link next to the element
            element.insertAdjacentElement('afterend', link);
        });
	}

	onDomChange(changeCoin);
    $('#result-hidden-notification').click();

})();
