// ==UserScript==
// @name         Google Search Translate Button [Improved]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a Translate button to the Google Search page
// @author       neoOpus
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430267/Google%20Search%20Translate%20Button%20%5BImproved%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/430267/Google%20Search%20Translate%20Button%20%5BImproved%5D.meta.js
// ==/UserScript==

// Change this to false if you don't want an icon
const useIcon = true;
// Change this to true if you want to add the button to the right of the 'Tools' button
const appendRight = false;

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const gTranslateUrl = "https://translate.google.com/#auto/en/";
const gTranslateIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,4H12.23L11,.34A.5.5,0,0,0,10.5,0H2A2,2,0,0,0,0,2V18a2,2,0,0,0,2,2h9.65L13,23.68a.5.5,0,0,0,.47.32H22a2,2,0,0,0,2-2V6A2,2,0,0,0,22,4ZM7.5,15a4.5,4.5,0,1,1,2.92-7.92.5.5,0,1,1-.65.76A3.5,3.5,0,1,0,11,11H7.5a.5.5,0,0,1,0-1h4a.5.5,0,0,1,.5.5A4.5,4.5,0,0,1,7.5,15Zm11.9-4a11.26,11.26,0,0,1-1.86,3.29,6.67,6.67,0,0,1-1.07-1.48.5.5,0,0,0-.93.38,8,8,0,0,0,1.34,1.87,8.9,8.9,0,0,1-.65.62L14.62,11ZM23,22a1,1,0,0,1-1,1H14.6l2.77-3.17a.49.49,0,0,0,.09-.48h0l-.91-2.66a9.36,9.36,0,0,0,1-.89c1,1,1.93,1.91,2.12,2.08a.5.5,0,0,0,.68-.74c-.47-.43-1.33-1.25-2.13-2.1a11.49,11.49,0,0,0,2.22-4H21.5a.5.5,0,0,0,0-1H18V9.5a.5.5,0,0,0-1,0V10H14.5a.49.49,0,0,0-.21,0L12.57,5H22a1,1,0,0,1,1,1Z" data-name="Google Translate"/></svg>';

(function process(mutations) {
    // Creating the element
    var el = document.createElement('div');
    el.className = 'hdtb-mitem';
    var link = document.createElement('a');

    // Adding the svg icon
    if (useIcon) {
        var span = document.createElement('span');
        span.className = 'bmaJhd iJddsb';
        span.style.cssText = 'height:16px;width:16px';
        span.innerHTML += gTranslateIcon;
        link.appendChild(span);
    }

		var q = '',
			queryElement = document.querySelector('input[name="q"]');		// selector for the Google search input textbox
		if (queryElement) {
				q = encodeURIComponent(queryElement.value);
        }
    // Hyperlink to go to google translate
    link.appendChild(document.createTextNode('Translate'));
    link.href = gTranslateUrl + q
    el.appendChild(link);

    // Inserting the element into Google search
    if (appendRight) {
        var toolsBtn = document.getElementById('hdtb-tls');
        toolsBtn.parentNode.insertBefore(el, toolsBtn.nextSibling);
    } else {
        var button = document.querySelector('.MUFPAc');
        button.appendChild(el);
    }
})();
